---
title: Keycloak Realm Management Overview
sidebar_label: Overview
---

# Keycloak Realm Management

The `keycloak-realm-management` Helm chart provides **realm blueprints** for Keycloak, rendered into [keycloak-config-cli](https://github.com/adorsys/keycloak-config-cli) partial-import files. It manages the declarative configuration of the Mia Platform realms within the Keycloak instance deployed by the [Keycloak chart](/requirements/installation-guidelines/shared-services/authn/keycloak/10_overview.md).

## What the chart manages

The chart renders and applies the following Keycloak realm resources:

- **Realm settings**: display name, login theme, password policies, brute-force protection, session timeouts.
- **Roles**: realm-level and client-level roles used by Mia Platform products for authorization.
- **Groups**: global groups scoped by product (e.g. `realm/admin`, `realm/reporter`). Groups carry realm-management client roles, enabling fine-grained admin delegation.
- **Client scopes**: OIDC scopes and protocol mappers that control what appears in access tokens.
- **OIDC clients**: one client per Mia Platform product (Console, Catalog, AI Foundry, Homepage & RBAC). Each client is conditionally included via `products.*` values.
- **Identity providers**: external IdPs federated via OIDC. Supports multiple IdPs per realm (one per customer organization / email domain).
- **Identity provider mappers**: attribute and role mappers that transform incoming IdP claims into Mia Platform user attributes and roles.
- **Authentication flows**: custom flows extending Keycloak's defaults.
- **Organizations**: customer organizations mapped to email domains. When a user enters their email, Keycloak matches the domain to the correct IdP automatically.
- **User profile**: custom attributes for traceability of user identity across IdP migrations.
- **Components**: `UserProfileProvider` and `ClientRegistrationPolicy` defaults, always included to prevent keycloak-config-cli from removing Keycloak's built-in defaults.

## Dual-realm model

Every Mia Platform installation uses two Keycloak realms:

| Realm | Purpose |
|---|---|
| **`mia-platform`** | Core product realm. Holds all Mia Platform OIDC clients, roles, authorization policies, and protocol mappers. This realm is the OIDC issuer for all Mia Platform services. |
| **`mia-extensions`** | Extensibility realm. Designed for customer-specific integrations, custom clients, and additional identity flows. Federated 1:1 with `mia-platform`: every authentication in `mia-extensions` is brokered through `mia-platform`. |

## Declarative, incremental management

Realm configuration is managed **declaratively**: values files are rendered into partial-import YAML by Helm and applied via `keycloak-config-cli` with remote state tracking enabled (`IMPORT_REMOTESTATE_ENABLED=true`).

This means:

- **Incremental**: only the resources defined in each import file are managed. Everything else in the realm is left untouched.
- **Non-destructive**: all resource types use `no-delete` policy: removing an entry from a values file stops managing that resource but does not delete it from Keycloak.
- **Idempotent**: applying the same values file multiple times produces the same result.

## Identity Provider federation

Users are never created directly in the Mia Platform realm (except service accounts). All human users authenticate through external IdPs federated via OIDC.

Each federated IdP is configured with:

- **`trustEmail: true`**: the email from the IdP is considered verified.
- **`syncMode: FORCE`** (or `IMPORT`): controls whether user attributes are overwritten on every login (`FORCE`) or only set on first login (`IMPORT`).
- **`pkceEnabled: true` + `pkceMethod: S256`**: PKCE on the broker flow.
- **`clientAuthMethod: private_key_jwt`**: the IdP client authenticates to the upstream provider with a signed JWT. No shared secrets are used.

## Organization-based IdP routing

When organizations are enabled (Keycloak ≥ 25.0.0), each organization owns one or more verified email domains and is linked to one or more identity providers. When a user enters their email at login, Keycloak matches the domain to the organization and redirects to the associated IdP, no manual IdP selection is needed by the user.

## Component templates

The chart splits each realm into numbered component files inside `templates/`:

```
templates/
├── master/                        # master realm
│   ├── 01-realm-settings.yaml
│   ├── 05-themes.yaml
│   ├── 10-components.yaml
│   ├── 20-client-scopes.yaml
│   ├── 30-clients.yaml
│   ├── 40-roles.yaml
│   ├── 50-groups.yaml
│   ├── 60-users.yaml
│   ├── 80-authentication-flows.yaml
│   ├── 81-authentication-flows-bindings.yaml
│   ├── 85-required-actions.yaml
│   └── 90-identity-providers.yaml
├── products/                      # mia-platform realm
│   ├── 010-realm-settings.yaml
│   ├── 030-smtp.yaml
│   ├── 050-themes.yaml
│   ├── 100-components.yaml
│   ├── 200-client-scopes.yaml
│   ├── 300-clients.yaml           # base product clients
│   ├── 305-clients-cimd.yaml      # Client ID Metadata Description clients (options.cimd)
│   ├── 310-clients-authz.yaml     # products.authz
│   ├── 315-clients-ai-foundry.yaml # products.aiFoundry
│   ├── 320-clients-catalog.yaml   # products.catalog
│   ├── 325-clients-flow.yaml      # products.flow
│   ├── 330-clients-console.yaml   # products.console
│   ├── 400-roles.yaml
│   ├── 450-client-scope-mappings.yaml
│   ├── 500-groups.yaml
│   ├── 600-users.yaml
│   ├── 800-authentication-flows.yaml
│   ├── 810-authentication-flows-bindings.yaml
│   ├── 850-required-actions.yaml
│   ├── 900-identity-providers.yaml
│   └── 930-organizations.yaml
├── extensibility/                 # mia-extensions realm
│   ├── 01-realm-settings.yaml
│   ├── 05-themes.yaml
│   ├── 10-components.yaml
│   ├── 20-client-scopes.yaml
│   ├── 30-clients.yaml
│   ├── 35-client-profiles.yaml
│   ├── 37-client-policies.yaml
│   ├── 40-roles.yaml
│   ├── 45-client-scope-mappings.yaml
│   ├── 50-groups.yaml
│   ├── 60-users.yaml
│   ├── 80-authentication-flows.yaml
│   ├── 81-authentication-flows-bindings.yaml
│   ├── 85-required-actions.yaml
│   └── 90-identity-providers.yaml
└── default/                       # generic reusable realm template
    ├── 01-realm-settings.yaml
    ├── 05-themes.yaml
    ├── 10-components.yaml
    ├── 20-client-scopes.yaml
    ├── 30-clients.yaml
    ├── 40-roles.yaml
    ├── 45-client-scope-mappings.yaml
    ├── 50-groups.yaml
    ├── 60-users.yaml
    ├── 80-authentication-flows.yaml
    ├── 81-authentication-flows-bindings.yaml
    ├── 85-required-actions.yaml
    └── 90-identity-providers.yaml
```

The numeric prefix determines import order. This matters because some resources depend on others (e.g. roles must exist before they can be assigned to groups or clients).

The `products/` templates use a wider numbering scheme (increments of 10 with room for per-product files) so that new product clients can be inserted without renumbering existing files. Each `3XX-clients-*.yaml` file renders only when the corresponding `products.*` (or `options.cimd`) flag is enabled.

## Login theme

The chart exposes two values to select which Keycloak theme is applied to login and account pages across all three managed realms (`master`, `mia-platform`, `mia-extensions`):

| Value | Controls | Default |
|---|---|---|
| `themes.login` | Login page theme (`loginTheme` in Keycloak) | `""` (Keycloak built-in) |
| `themes.account` | Account console theme (`accountTheme` in Keycloak) | `""` (Keycloak built-in) |

The Mia Platform custom image ships two pre-built themes:

- `mia-platform-keycloak-ui`: standard Mia Platform login UI (used for Console, Catalog, AI Foundry deployments)
- `mia-care-keycloak-ui`: Mia Care variant

```yaml
# Example in *-values.yaml
themes:
  login: mia-platform-keycloak-ui
  account: mia-platform-keycloak-ui
```

The text displayed on the login page title is derived from the `realmName` value, which the chart uses as the realm's `displayName`.

> Logo, colours, and fonts are compiled into the theme at Docker image build time. They are not configurable via chart values.
