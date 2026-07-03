---
title: Helm Values Overview
sidebar_label: Overview
---

# Keycloak Realm Management Helm Values Reference

This page documents all configurable values for the `keycloak-realm-management` chart. Each values file defines one Keycloak realm and the OIDC clients, identity providers, and user mappings it contains.

:::tip
For step-by-step setup, see the [Getting Started guide](/requirements/installation-guidelines/authn/keycloak-realm-management/15_getting-started.md). For real-world values examples, see the `values/` directory and the `ci/` directory in the chart repository.
:::

## Realm identity

| Key | Type | Default | Description |
|---|---|---|---|
| `realmId` | string | `""` | **Required.** The realm ID used in Keycloak's internal identifier and in OIDC issuer URLs (e.g. `mia-platform`, `master`). Must be unique within the Keycloak instance. |
| `realmName` | string | `""` | Display name shown in the Keycloak Admin Console and login page (e.g. `"Mia Platform"`). |

## Themes

| Key | Type | Default | Description |
|---|---|---|---|
| `themes.login` | string | `""` | Login page theme name. Set to `mia-platform-keycloak-ui` to use the custom Mia Platform login theme. Leave empty to use the Keycloak default. |
| `themes.account` | string | `""` | Account management portal theme name. |

## Products to configure (`products`)

Controls which Mia Platform product OIDC clients are created in the realm. Setting a product to `true` renders the corresponding `client` and `scope` resources in the realm import.

| Key | Type | Default | Description |
|---|---|---|---|
| `products.console` | bool | `false` | Create the OIDC client and scopes for **Mia Platform Console** (Homepage & RBAC included). |
| `products.catalog` | bool | `false` | Create the OIDC client and scopes for **Context Catalog**. |
| `products.aiFoundry` | bool | `false` | Create the OIDC client and scopes for **AI Foundry**. |
| `products.flow` | bool | `false` | Create the OIDC client and scopes for **Mia Flow**. |
| `products.authz` | bool | `false` | Create the OIDC client and scopes for the Authorization service. |

## Product URLs (`urls`)

Base URLs used to compute OIDC redirect URIs, post-logout redirect URIs, and CORS allowed origins for each product's client. All values should include the scheme (e.g. `https://...`).

| Key | Type | Default | Description |
|---|---|---|---|
| `urls.keycloak` | string | `""` | **Required.** Public URL of the Keycloak instance. Used to build issuer URLs in the realm configuration. |
| `urls.console` | string | `""` | Console URL. Required when `products.console: true`. |
| `urls.consoleCms` | string | `""` | Console CMS URL (e.g. `https://cms.console.example.com`). Required when `products.console: true`. |
| `urls.catalog` | string | `""` | Catalog URL. Required when `products.catalog: true`. |
| `urls.aiFoundry` | string | `""` | AI Foundry URL. Required when `products.aiFoundry: true`. |
| `urls.flow` | string | `""` | Mia Flow URL. Required when `products.flow: true`. |
| `urls.authz` | string | `""` | Authorization service URL. Required when `products.authz: true`. |

## Platform options (`options`)

| Key | Type | Default | Description |
|---|---|---|---|
| `options.isPaaS` | bool | `false` | Enables PaaS-specific configuration. Adjusts certain product client settings for the Mia Platform SaaS topology (different redirect URI patterns, additional org-routing attributes). |
| `options.cimd` | bool | `false` | Enables CIMD (Continuous Integration & Monitoring Delivery) integration. |

## Identity Providers (`identityProviders`)

A list of external IdP configurations. Each entry is a full Keycloak `identityProvider` object passed through to the realm import. Supported protocols include OIDC, SAML, and any provider supported by Keycloak.

```yaml
identityProviders:
  - alias: my-okta                      # unique alias used in login flow routing
    displayName: "Okta"
    providerId: oidc                    # or saml
    enabled: true
    trustEmail: true
    config:
      issuer: "https://example.okta.com"
      authorizationUrl: "https://example.okta.com/oauth2/v1/authorize"
      tokenUrl: "https://example.okta.com/oauth2/v1/token"
      clientId: "<CLIENT_ID>"
      clientAuthMethod: private_key_jwt # or client_secret_post
      pkceEnabled: "true"
      pkceMethod: S256
      defaultScope: "openid email profile"
      syncMode: IMPORT
```

For organization-based routing (Keycloak `kc.org.*` attributes), add the relevant `config` keys to each IdP entry. See the `ci/paas-dev-products-values.yaml` file in the chart repository for a complete example.

## Identity Provider Mappers (`identityProviderMappers`)

A list of claim/role mappers applied after the IdP authentication. Each entry is a full Keycloak `identityProviderMapper` object.

```yaml
identityProviderMappers:
  - name: "map-uid-to-provider-sub"
    identityProviderAlias: "my-okta"
    identityProviderMapper: oidc-user-attribute-idp-mapper
    config:
      claim: uid
      user.attribute: provider_sub
      syncMode: IMPORT
  - name: "hardcode-admin-role"
    identityProviderAlias: "my-okta"
    identityProviderMapper: oidc-hardcoded-role-idp-mapper
    config:
      role: admin
      syncMode: IMPORT
```

## SMTP server (`smtpServer`)

| Key | Type | Default | Description |
|---|---|---|---|
| `smtpServer.enabled` | bool | `false` | Configure the realm SMTP server for email notifications (password reset, email verification). |
| `smtpServer.config.port` | string | `"587"` | SMTP port. |
| `smtpServer.config.starttls` | bool | `false` | Enable STARTTLS. |
| `smtpServer.config.auth` | bool | `false` | Enable SMTP authentication. |

Additional SMTP fields (host, user, password, from, fromDisplayName) can be added under `smtpServer.config` as pass-through values.

## IdP settings (`idpSettings`)

| Key | Type | Default | Description |
|---|---|---|---|
| `idpSettings.enabled` | bool | `false` | Enable per-realm IdP settings configuration. |
| `idpSettings.redirectUris` | list | `[]` | Additional allowed redirect URIs added to IdP-triggered login flows. |

## Custom clients (`customClients`)

Pass-through list of additional OIDC client definitions not covered by the `products.*` flags. Each entry is a full Keycloak `client` object.

```yaml
customClients:
  - clientId: "my-custom-service"
    name: "My Custom Service"
    publicClient: false
    serviceAccountsEnabled: true
    standardFlowEnabled: false
    redirectUris:
      - "https://my-service.example.com/callback"
```

## Custom users (`customUsers`)

Pass-through list of initial users to create in the realm. Each entry is a full Keycloak `user` object.

```yaml
customUsers:
  - username: "service-admin"
    email: "service-admin@example.com"
    enabled: true
    realmRoles:
      - admin
```

:::warning
Custom users with sensitive credentials should not be defined in plain-text values files. Use this field only for non-sensitive technical accounts or during initial bootstrapping.
# Helm Values — keycloak-realm-management chart

This page describes the configurable values for the `keycloak-realm-management` chart. Each values file represents the configuration of a single Keycloak realm. Values are used by the component templates in `templates/<realm>/` to generate the YAML files applied by `keycloak-config-cli`.

## Realm identity

| Key | Default | Description |
|---|---|---|
| `realmId` | `""` | **Required.** The Keycloak realm identifier, used as the realm `id` and `realm` name in the API. |
| `realmName` | `""` | Display name for the realm shown in the admin console and on the login page. |

## Themes

| Key | Default | Description |
|---|---|---|
| `themes.login` | `""` | Login page theme name. Leave empty to use the Keycloak default. |
| `themes.account` | `""` | Account console theme name. Leave empty to use the Keycloak default. |

## Identity providers

Configure one or more external OIDC Identity Providers to federate into the realm. Each entry corresponds to an `identityProviders` resource in Keycloak.

| Key | Description |
|---|---|
| `identityProviders[].alias` | **Required.** Unique alias for the IdP within the realm. Used in redirect URIs and mappers. |
| `identityProviders[].displayName` | Human-readable name shown on the login page. |
| `identityProviders[].providerId` | Always `oidc` for OIDC providers. |
| `identityProviders[].enabled` | Whether the IdP is active. |
| `identityProviders[].trustEmail` | If `true`, the email from the IdP is considered verified without a separate email verification flow. |
| `identityProviders[].config.issuer` | OIDC issuer URL of the upstream IdP. |
| `identityProviders[].config.authorizationUrl` | IdP authorization endpoint. |
| `identityProviders[].config.tokenUrl` | IdP token endpoint. |
| `identityProviders[].config.userInfoUrl` | IdP userinfo endpoint. |
| `identityProviders[].config.jwksUrl` | IdP JWKS endpoint for token signature verification. |
| `identityProviders[].config.clientId` | Client ID registered on the upstream IdP for the Mia Keycloak broker. |
| `identityProviders[].config.clientAuthMethod` | Client authentication method. `private_key_jwt` is strongly recommended — no shared secrets. |
| `identityProviders[].config.defaultScope` | OIDC scopes to request (e.g. `openid email profile`). |
| `identityProviders[].config.pkceEnabled` | Enable PKCE on the broker flow (`"true"` / `"false"` as strings). |
| `identityProviders[].config.pkceMethod` | PKCE method: `S256`. |
| `identityProviders[].config.syncMode` | User attribute sync mode: `FORCE` (overwrite on every login) or `IMPORT` (set on first login only). |

**Example — corporate OIDC IdP with `private_key_jwt`:**

```yaml
identityProviders:
  - alias: corporate-sso
    displayName: Corporate SSO
    enabled: true
    providerId: oidc
    trustEmail: true
    config:
      issuer: https://idp.example.com
      authorizationUrl: https://idp.example.com/oauth2/authorize
      tokenUrl: https://idp.example.com/oauth2/token
      userInfoUrl: https://idp.example.com/oauth2/userinfo
      jwksUrl: https://idp.example.com/oauth2/jwks
      clientId: mia-platform-broker
      clientAuthMethod: private_key_jwt
      defaultScope: openid email profile
      pkceEnabled: "true"
      pkceMethod: S256
      syncMode: FORCE
      useJwksUrl: "true"
      disableUserInfo: "false"
      isAccessTokenJWT: "true"
```

## Identity provider mappers

Configure attribute and role mappers for each federated IdP.

| Key | Description |
|---|---|
| `identityProviderMappers[].name` | Unique name for the mapper. |
| `identityProviderMappers[].identityProviderAlias` | Alias of the IdP this mapper belongs to. |
| `identityProviderMappers[].identityProviderMapper` | Mapper type, e.g. `oidc-user-attribute-idp-mapper`, `oidc-role-idp-mapper`, `oidc-hardcoded-role-idp-mapper`. |
| `identityProviderMappers[].config` | Mapper-specific configuration (depends on `identityProviderMapper` type). |

**Example — hardcoded role mapper:**

```yaml
identityProviderMappers:
  - name: assign-reporter-role
    identityProviderAlias: corporate-sso
    identityProviderMapper: oidc-hardcoded-role-idp-mapper
    config:
      role: realm/reporter
      syncMode: IMPORT
```

## Products

Controls which Mia Platform product OIDC clients are included in the realm. Enable only the products that are deployed in your installation.

| Key | Default | Description |
|---|---|---|
| `products.authz` | `false` | Include the Homepage & RBAC OIDC client |
| `products.catalog` | `false` | Include the Catalog OIDC client |
| `products.console` | `false` | Include the Console OIDC client |
| `products.aiFoundry` | `false` | Include the AI Foundry OIDC client |
| `products.flow` | `false` | Include the Flow OIDC client |

When a product is enabled, the corresponding `urls.*` value must be set.

## URLs

Product base URLs used to generate OIDC redirect URIs for each product client.

| Key | Description |
|---|---|
| `urls.keycloak` | **Required.** Keycloak base URL (e.g. `https://keycloak.example.com`). |
| `urls.authz` | Base URL for Homepage & RBAC (required when `products.authz: true`). |
| `urls.catalog` | Base URL for Catalog (required when `products.catalog: true`). |
| `urls.console` | Base URL for Console (required when `products.console: true`). |
| `urls.consoleCms` | Base URL for Console CMS, if deployed separately. |
| `urls.flow` | Base URL for Flow (required when `products.flow: true`). |

## Options

Feature flags controlling platform-specific realm behaviours.

| Key | Default | Description |
|---|---|---|
| `options.isPaaS` | `false` | Enable PaaS-specific configurations. **Do not set** for on-premises installations. |
| `options.cimd` | `false` | Enable CIMD-specific configurations. |

## SMTP server

Configure an SMTP server for Keycloak to send email notifications (password reset, email verification, etc.).

| Key | Default | Description |
|---|---|---|
| `smtpServer.enabled` | `false` | Enable SMTP configuration |
| `smtpServer.config.host` | — | SMTP host |
| `smtpServer.config.port` | `587` | SMTP port |
| `smtpServer.config.from` | — | Sender email address |
| `smtpServer.config.starttls` | `false` | Use STARTTLS |
| `smtpServer.config.auth` | `false` | Enable SMTP authentication |
| `smtpServer.config.user` | — | SMTP username (when `auth: true`) |
| `smtpServer.config.password` | — | SMTP password (when `auth: true`) |

## Custom clients

Add OIDC clients beyond those provided by the `products.*` flags.

| Key | Description |
|---|---|
| `customClients[]` | List of additional OIDC client definitions. Each entry is a full Keycloak client representation. |

## Custom users

Add service account users to the realm (e.g. for CI/CD or automation tooling).

| Key | Description |
|---|---|
| `customUsers[]` | List of user definitions. Each entry is a Keycloak user representation. |

## Complete example

```yaml
# mia-platform-values.yaml
realmId: mia-platform
realmName: Mia Platform

urls:
  keycloak: https://keycloak.example.com
  console: https://console.example.com
  catalog: https://catalog.example.com
  aiFoundry: https://ai-foundry.example.com

products:
  console: true
  catalog: true
  aiFoundry: true

themes:
  login: my-custom-theme

identityProviders:
  - alias: corporate-sso
    displayName: Corporate SSO
    enabled: true
    providerId: oidc
    trustEmail: true
    config:
      issuer: https://idp.example.com
      authorizationUrl: https://idp.example.com/oauth2/authorize
      tokenUrl: https://idp.example.com/oauth2/token
      userInfoUrl: https://idp.example.com/oauth2/userinfo
      jwksUrl: https://idp.example.com/oauth2/jwks
      clientId: mia-platform-broker
      clientAuthMethod: private_key_jwt
      defaultScope: openid email profile
      pkceEnabled: "true"
      pkceMethod: S256
      syncMode: FORCE
      useJwksUrl: "true"
      disableUserInfo: "false"
      isAccessTokenJWT: "true"

identityProviderMappers:
  - name: assign-reporter-role
    identityProviderAlias: corporate-sso
    identityProviderMapper: oidc-hardcoded-role-idp-mapper
    config:
      role: realm/reporter
      syncMode: IMPORT

smtpServer:
  enabled: true
  config:
    host: smtp.example.com
    port: "587"
    from: noreply@example.com
    starttls: true
    auth: true
    user: smtp-user
    password: smtp-password
```
