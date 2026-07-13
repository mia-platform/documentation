---
title: Helm Values Overview
sidebar_label: Overview
---

# Keycloak Realm Management Helm Values Reference

This page documents all configurable values for the `keycloak-realm-management` chart. Each values file defines one Keycloak realm and the OIDC clients, identity providers, and user mappings it contains.

:::tip
For step-by-step setup, see the [Getting Started guide](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/15_getting-started.md). For real-world values examples, see the `values/` directory and the `ci/` directory in the chart repository.
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
| `themes.account` | string | `""` | Account management portal theme name. Leave empty to use the Keycloak default. |

## Identity provider redirector (`identityProviderRedirector`)

Configures the browser flow's `identity-provider-redirector` authenticator, which can automatically redirect users to a default identity provider instead of showing the Keycloak login form (e.g. for the `master` realm, always redirecting to the corporate IdP).

| Key | Type | Default | Description |
|---|---|---|---|
| `identityProviderRedirector.defaultAlias` | string | `""` | Alias of the identity provider to redirect to by default. Must match an `identityProviders[].alias` entry. Leave empty to disable the default redirect and show the standard login form. |

## Products (`products`)

Controls which Mia Platform product OIDC clients are created in the realm. Setting a product to `true` renders the corresponding `client` and `scope` resources in the realm import. Enable only the products that are deployed in your installation.

| Key | Type | Default | Description |
|---|---|---|---|
| `products.console` | bool | `false` | Create the OIDC client and scopes for **Mia Platform Console** (Homepage & RBAC included). |
| `products.catalog` | bool | `false` | Create the OIDC client and scopes for **Context Catalog**. |
| `products.aiFoundry` | bool | `false` | Create the OIDC client and scopes for **AI Foundry**. |
| `products.flow` | bool | `false` | Create the OIDC client and scopes for **Mia Flow**. |
| `products.authz` | bool | `false` | Create the OIDC client and scopes for the Authorization service. |

When a product is enabled, the corresponding `urls.*` value must be set.

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
| `options.isPaaS` | bool | `false` | Enables PaaS-specific configuration. Adjusts certain product client settings for the Mia Platform SaaS topology (different redirect URI patterns, additional org-routing attributes). **Do not set** for on-premises installations. |
| `options.cimd` | bool | `false` | Enables CIMD (Continuous Integration & Monitoring Delivery) integration. |

## Identity Providers (`identityProviders`)

A list of external IdP configurations. Each entry is a full Keycloak `identityProvider` object passed through to the realm import. Supported protocols include OIDC, SAML, and any provider supported by Keycloak.

| Key | Description |
|---|---|
| `identityProviders[].alias` | **Required.** Unique alias for the IdP within the realm. Used in redirect URIs and mappers. |
| `identityProviders[].displayName` | Human-readable name shown on the login page. |
| `identityProviders[].providerId` | Provider type, e.g. `oidc` or `saml`. |
| `identityProviders[].enabled` | Whether the IdP is active. |
| `identityProviders[].trustEmail` | If `true`, the email from the IdP is considered verified without a separate email verification flow. |
| `identityProviders[].config.issuer` | OIDC issuer URL of the upstream IdP. |
| `identityProviders[].config.authorizationUrl` | IdP authorization endpoint. |
| `identityProviders[].config.tokenUrl` | IdP token endpoint. |
| `identityProviders[].config.userInfoUrl` | IdP userinfo endpoint. |
| `identityProviders[].config.jwksUrl` | IdP JWKS endpoint for token signature verification. |
| `identityProviders[].config.clientId` | Client ID registered on the upstream IdP for the Mia Keycloak broker. |
| `identityProviders[].config.clientAuthMethod` | Client authentication method. `private_key_jwt` is strongly recommended: no shared secrets. |
| `identityProviders[].config.defaultScope` | OIDC scopes to request (e.g. `openid email profile`). |
| `identityProviders[].config.pkceEnabled` | Enable PKCE on the broker flow (`"true"` / `"false"` as strings). |
| `identityProviders[].config.pkceMethod` | PKCE method: `S256`. |
| `identityProviders[].config.syncMode` | User attribute sync mode: `FORCE` (overwrite on every login) or `IMPORT` (set on first login only). |

**Example: corporate OIDC IdP with `private_key_jwt`:**

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

For organization-based routing (Keycloak `kc.org.*` attributes), add the relevant `config` keys to each IdP entry. See the `ci/paas-dev-products-values.yaml` file in the chart repository for a complete example.

## Identity Provider Mappers (`identityProviderMappers`)

A list of claim/role mappers applied after the IdP authentication. Each entry is a full Keycloak `identityProviderMapper` object.

| Key | Description |
|---|---|
| `identityProviderMappers[].name` | Unique name for the mapper. |
| `identityProviderMappers[].identityProviderAlias` | Alias of the IdP this mapper belongs to. |
| `identityProviderMappers[].identityProviderMapper` | Mapper type, e.g. `oidc-user-attribute-idp-mapper`, `oidc-role-idp-mapper`, `oidc-hardcoded-role-idp-mapper`. |
| `identityProviderMappers[].config` | Mapper-specific configuration (depends on `identityProviderMapper` type). |

```yaml
identityProviderMappers:
  - name: "map-uid-to-provider-sub"
    identityProviderAlias: "corporate-sso"
    identityProviderMapper: oidc-user-attribute-idp-mapper
    config:
      claim: uid
      user.attribute: provider_sub
      syncMode: IMPORT
  - name: "hardcode-reporter-role"
    identityProviderAlias: "corporate-sso"
    identityProviderMapper: oidc-hardcoded-role-idp-mapper
    config:
      role: realm/reporter
      syncMode: IMPORT
```

## Organizations (`organizations`)

A list of Keycloak organizations to create in the realm (requires Keycloak ≥ 25.0.0, `organizationsEnabled`). Each organization owns one or more verified email domains and can be linked to one or more identity providers, enabling automatic IdP routing based on the email domain entered at login.

| Key | Description |
|---|---|
| `organizations[].alias` | **Required.** Unique identifier for the organization. |
| `organizations[].name` | **Required.** Human-readable name of the organization. |
| `organizations[].description` | Description of the organization. |
| `organizations[].domains[].name` | **Required.** Domain name associated with the organization (e.g. `mia-platform.eu`). |
| `organizations[].identityProviders[].alias` | Alias of an identity provider linked to this organization. Must match an `identityProviders[].alias` entry. |

```yaml
organizations:
  - alias: mia-platform
    name: Mia Platform
    description: Mia Platform organization
    domains:
      - name: mia-platform.eu
    identityProviders:
      - alias: corporate-sso
```

## SMTP server (`smtpServer`)

Configure an SMTP server for Keycloak to send email notifications (password reset, email verification, etc.).

| Key | Type | Default | Description |
|---|---|---|---|
| `smtpServer.enabled` | bool | `false` | Enable SMTP configuration. |
| `smtpServer.config.host` | string | - | SMTP host. |
| `smtpServer.config.port` | string | `"587"` | SMTP port. |
| `smtpServer.config.from` | string | - | Sender email address. |
| `smtpServer.config.fromDisplayName` | string | - | Display name shown as the email sender (e.g. `"Mia Platform"`). |
| `smtpServer.config.starttls` | bool | `false` | Enable STARTTLS. |
| `smtpServer.config.auth` | bool | `false` | Enable SMTP authentication. |
| `smtpServer.config.user` | string | - | SMTP username (when `auth: true`). |
| `smtpServer.config.password` | string | - | SMTP password (when `auth: true`). |

`smtpServer.config` accepts any additional Keycloak `smtpServer` field as a pass-through.

## IdP settings (`idpSettings`)

Controls creation of the Mia Platform Identity Provider client used to federate the `mia-extensions` realm (and other extensibility realms) with `mia-platform` for organization-based routing.

| Key | Type | Default | Description |
|---|---|---|---|
| `idpSettings.enabled` | bool | `false` | Create the Mia Platform Identity Provider client. |
| `idpSettings.redirectUris` | list | `[]` | Allowed redirect URIs for the Mia Platform Identity Provider client. |
| `idpSettings.postLogoutRedirectUris` | list | `[]` | Allowed post-logout redirect URIs for the Mia Platform Identity Provider client. |
| `idpSettings.clientSecret` | string | `""` | Client secret for the Mia Platform Identity Provider client. Should be injected via a vault placeholder (e.g. `${vault.mia-platform-identity-provider-client-secret}`), not hardcoded. |

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
:::

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

organizations:
  - alias: corporate
    name: Corporate
    description: Corporate organization
    domains:
      - name: example.com
    identityProviders:
      - alias: corporate-sso

smtpServer:
  enabled: true
  config:
    host: smtp.example.com
    port: "587"
    from: noreply@example.com
    fromDisplayName: "Mia Platform"
    starttls: true
    auth: true
    user: smtp-user
    password: smtp-password
```
