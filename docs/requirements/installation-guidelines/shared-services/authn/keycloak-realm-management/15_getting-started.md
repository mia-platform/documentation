---
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started with the Keycloak Realm Management chart

## Prerequisites

1. The [Keycloak chart](/requirements/installation-guidelines/shared-services/authn/keycloak/15_getting-started.md) already installed and Keycloak running.
2. [Helm](https://helm.sh/) v3.
3. [Docker](https://www.docker.com/) (used by the import pipeline to run `keycloak-config-cli`).
4. Admin credentials for the target Keycloak instance.

## Chart structure

```
keycloak-realm-management/
├── Chart.yaml
├── values.yaml           # shared defaults
├── values.schema.json    # JSON Schema for values validation
├── templates/
│   ├── master/           # master realm component files
│   ├── products/         # mia-platform realm component files
│   └── extensibility/    # mia-extensions realm component files
├── ci/                   # minimal values for CI chart validation
└── Makefile              # render + import pipeline
```

Each realm is rendered and imported independently. A separate values file per realm+environment drives the configuration.

## Step 1 — Create a values file

Create a values file for the `mia-platform` realm. At minimum, provide the realm identity, the Keycloak URL, the enabled products, and the IdP configuration:

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

See the [Helm Values reference](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/helm-values/00_overview.md) for the full list of available values.

## Step 2 — Render and review

Render the `mia-platform` realm templates to review what will be applied:

```bash
helm template keycloak-realm-management . \
  -f mia-platform-values.yaml \
  --show-only 'templates/products/*.yaml'
```

This outputs the component YAML files that `keycloak-config-cli` will apply.

## Step 3 — Import

Use the Makefile target to render and import directly into Keycloak via `keycloak-config-cli`:

```bash
make import-products \
  KEYCLOAK_URL=https://keycloak.example.com \
  KEYCLOAK_USER=admin \
  KEYCLOAK_PASSWORD=<admin_password>
```

`make import-products` runs:

1. `helm template` for each component file in `templates/products/`.
2. Renders files to `rendered/<ENV>/products/`.
3. Invokes `keycloak-config-cli` with `IMPORT_FILES_LOCATIONS='rendered/<ENV>/products/*.yaml'` and all `no-delete` policy flags enabled.

To import all realms at once:

```bash
make import \
  KEYCLOAK_URL=https://keycloak.example.com \
  KEYCLOAK_USER=admin \
  KEYCLOAK_PASSWORD=<admin_password>
```

## Step 4 — Verify

After import, verify the realm in the Keycloak admin console:

1. Navigate to the `mia-platform` realm.
2. Check that the configured IdP appears under **Identity Providers**.
3. Check that clients for the enabled products appear under **Clients**.
4. Test the login flow by accessing a Mia Platform product URL and verifying that the IdP redirect works correctly.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `KEYCLOAK_URL` | `http://localhost:8080` | Keycloak base URL |
| `KEYCLOAK_USER` | `admin` | Admin username |
| `KEYCLOAK_PASSWORD` | `admin` | Admin password |
| `ENV` | `dev` | Environment name — used to organise rendered output in `rendered/<ENV>/` |
