---
title: Keycloak Realm Management Overview
sidebar_label: Overview
---

# Keycloak Realm Management

The `keycloak-realm-management` Helm chart provides **realm blueprints** for Keycloak, rendered into [keycloak-config-cli](https://github.com/adorsys/keycloak-config-cli) partial-import files. It manages the declarative configuration of the Mia Platform realms within the Keycloak instance deployed by the [Keycloak chart](/requirements/installation-guidelines/authn/keycloak/10_overview.md).

## What the chart manages

The chart renders and applies the following Keycloak realm resources:

- **Realm settings** — display name, login theme, password policies, brute-force protection, session timeouts.
- **Roles** — realm-level and client-level roles used by Mia Platform products for authorization.
- **Groups** — global groups scoped by product (e.g. `realm/admin`, `realm/reporter`). Groups carry realm-management client roles, enabling fine-grained admin delegation.
- **Client scopes** — OIDC scopes and protocol mappers that control what appears in access tokens.
- **OIDC clients** — one client per Mia Platform product (Console, Catalog, AI Foundry, Homepage & RBAC). Each client is conditionally included via `products.*` values.
- **Identity providers** — external IdPs federated via OIDC. Supports multiple IdPs per realm (one per customer organization / email domain).
- **Identity provider mappers** — attribute and role mappers that transform incoming IdP claims into Mia Platform user attributes and roles.
- **Authentication flows** — custom flows extending Keycloak's defaults.
- **Organizations** — customer organizations mapped to email domains. When a user enters their email, Keycloak matches the domain to the correct IdP automatically.
- **User profile** — custom attributes for traceability of user identity across IdP migrations.
- **Components** — `UserProfileProvider` and `ClientRegistrationPolicy` defaults, always included to prevent keycloak-config-cli from removing Keycloak's built-in defaults.

## Dual-realm model

Every Mia Platform installation uses two Keycloak realms:

| Realm | Purpose |
|---|---|
| **`mia-platform`** | Core product realm. Holds all Mia Platform OIDC clients, roles, authorization policies, and protocol mappers. This realm is the OIDC issuer for all Mia Platform services. |
| **`mia-extensions`** | Extensibility realm. Designed for customer-specific integrations, custom clients, and additional identity flows. Federated 1:1 with `mia-platform`: every authentication in `mia-extensions` is brokered through `mia-platform`. |

## Declarative, incremental management

Realm configuration is managed **declaratively**: values files are rendered into partial-import YAML by Helm and applied via `keycloak-config-cli` with remote state tracking enabled (`IMPORT_REMOTESTATE_ENABLED=true`).

This means:

- **Incremental** — only the resources defined in each import file are managed. Everything else in the realm is left untouched.
- **Non-destructive** — all resource types use `no-delete` policy: removing an entry from a values file stops managing that resource but does not delete it from Keycloak.
- **Idempotent** — applying the same values file multiple times produces the same result.

## Identity Provider federation

Users are never created directly in the Mia Platform realm (except service accounts). All human users authenticate through external IdPs federated via OIDC.

Each federated IdP is configured with:

- **`trustEmail: true`** — the email from the IdP is considered verified.
- **`syncMode: FORCE`** (or `IMPORT`) — controls whether user attributes are overwritten on every login (`FORCE`) or only set on first login (`IMPORT`).
- **`pkceEnabled: true` + `pkceMethod: S256`** — PKCE on the broker flow.
- **`clientAuthMethod: private_key_jwt`** — the IdP client authenticates to the upstream provider with a signed JWT. No shared secrets are used.

## Organization-based IdP routing

When organizations are enabled (Keycloak ≥ 25.0.0), each organization owns one or more verified email domains and is linked to one or more identity providers. When a user enters their email at login, Keycloak matches the domain to the organization and redirects to the associated IdP — no manual IdP selection is needed by the user.

## Component templates

The chart splits each realm into numbered component files inside `templates/`:

```
templates/
├── master/                        # master realm
│   └── 01-realm-settings.yaml
├── products/                      # mia-platform realm
│   ├── 01-realm-settings.yaml
│   ├── 10-roles.yaml
│   ├── 20-groups.yaml
│   ├── 30-client-scopes.yaml
│   ├── 32-clients.yaml
│   ├── 35-client-profiles.yaml
│   ├── 37-client-policies.yaml
│   ├── 50-components.yaml
│   ├── 60-users.yaml
│   ├── 80-authentication-flows.yaml
│   ├── 81-authentication-flows-bindings.yaml
│   ├── 90-identity-providers.yaml
│   └── 93-organizations.yaml
└── extensibility/                 # mia-extensions realm
    └── ...
```

The numeric prefix determines import order. This matters because some resources depend on others (e.g. roles must exist before they can be assigned to groups or clients).
