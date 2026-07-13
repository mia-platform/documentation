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

## Step 1: Create a values file

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

## Step 2: Render and review

Render the `mia-platform` realm templates to review what will be applied:

```bash
helm template keycloak-realm-management . \
  -f mia-platform-values.yaml \
  --show-only 'templates/products/*.yaml'
```

This outputs the component YAML files that `keycloak-config-cli` will apply.

## Step 3: Import

The chart does not call `keycloak-config-cli` directly; import is driven by Makefile targets that render the chart and then run `keycloak-config-cli` via Docker.

Two import modes are available, depending on how `keycloak-config-cli` authenticates to Keycloak:

- **`make import-<realm>`** — authenticates with a `client_credentials` grant against a service account client (typically `keycloak-config-cli`). Requires `KEYCLOAK_CLIENT_SECRET` and, for non-`master` realms, `LOGIN_REALM` set to the realm the service account client lives in.
- **`make import-admin-<realm>`** — authenticates as an admin user (`KEYCLOAK_USER` / `KEYCLOAK_PASSWORD`) against the `master` realm. Useful for the very first import, before a `keycloak-config-cli` service account client exists.

```bash
# client_credentials grant (steady-state imports)
make import-products \
  ENV=dev \
  KEYCLOAK_URL=https://keycloak.example.com \
  KEYCLOAK_CLIENT_SECRET=<keycloak-config-cli_client_secret> \
  LOGIN_REALM=mia-platform

# admin user/password grant (initial bootstrap only)
make import-admin-products \
  ENV=dev \
  KEYCLOAK_URL=https://keycloak.example.com \
  KEYCLOAK_USER=admin \
  KEYCLOAK_PASSWORD=<admin_password>
```

`make import-products` (and `make import-admin-products`) run:

1. `hacks/template.sh` to render each component file in `templates/products/` for the given values file.
2. Renders files to `rendered/<ENV>/products/<values-file-name>/`.
3. Invokes `keycloak-config-cli` via Docker with `IMPORT_FILES_LOCATIONS='/configs/*.yaml'` and all resource types set to the `no-delete` managed policy (`IMPORT_MANAGED_CLIENT`, `IMPORT_MANAGED_ROLE`, `IMPORT_MANAGED_GROUP`, `IMPORT_MANAGED_ORGANIZATION`, etc.), plus `IMPORT_REMOTESTATE_ENABLED=true`.

The `master` realm uses the dedicated `make import-master` / `make import-admin-master` targets, which do not require `--env`.

To import every realm, run the target for each one individually (`master`, `products`, `extensibility`, or any custom realm folder under `templates/`):

```bash
make import-admin-master KEYCLOAK_URL=https://keycloak.example.com KEYCLOAK_USER=admin KEYCLOAK_PASSWORD=<admin_password>
make import-admin-products ENV=dev KEYCLOAK_URL=https://keycloak.example.com KEYCLOAK_USER=admin KEYCLOAK_PASSWORD=<admin_password>
make import-admin-extensibility ENV=dev KEYCLOAK_URL=https://keycloak.example.com KEYCLOAK_USER=admin KEYCLOAK_PASSWORD=<admin_password>
```

## Step 4: Verify

After import, verify the realm in the Keycloak admin console:

1. Navigate to the `mia-platform` realm.
2. Check that the configured IdP appears under **Identity Providers**.
3. Check that clients for the enabled products appear under **Clients**.
4. Test the login flow by accessing a Mia Platform product URL and verifying that the IdP redirect works correctly.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `KEYCLOAK_URL` | `http://localhost:8080` | Keycloak base URL |
| `KEYCLOAK_USER` | `admin` | Admin username. Used only by `make import-admin-*` targets. |
| `KEYCLOAK_PASSWORD` | `admin` | Admin password. Used only by `make import-admin-*` targets. |
| `KEYCLOAK_CLIENT_SECRET` | - | Client secret for the `keycloak-config-cli` service account client. Required by `make import-*` (non-admin) targets. |
| `LOGIN_REALM` | - | Realm containing the `keycloak-config-cli` service account client, used for the `client_credentials` grant. Required by `make import-*` (non-admin) targets for non-`master` realms. |
| `ENV` | `dev` | Environment name: used to organise rendered output in `rendered/<ENV>/` and to resolve the default values file path `values/<ENV>/<realm>-values.yaml`. Not used for the `master` realm. |
| `VALUES` | `values/<ENV>/<realm>-values.yaml` | Override the values file path passed to `hacks/template.sh`. |
