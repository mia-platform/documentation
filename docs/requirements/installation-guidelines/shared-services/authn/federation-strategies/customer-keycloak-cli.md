---
title: Customer Keycloak via CLI
sidebar_label: Customer Keycloak via CLI
sidebar_position: 2
---

# Customer Keycloak via CLI

> **When to use this guide:** the customer already operates a Keycloak instance with full admin access and wants Mia Platform realms provisioned within it. Mia Platform **does not deploy a Keycloak instance** in this scenario. The `keycloak-realm-management` chart is used as a CLI tool to import and incrementally update the `mia-platform` and `mia-platform-extensibility` realms on the customer's Keycloak.

For an overview of all available federation models see [Federation Strategies](./index.md).

---

## Prerequisites

| Requirement | Notes |
|---|---|
| Customer's Keycloak | **version ≥ 25.0** |
| Admin access to the customer's Keycloak | Required for the initial setup |
| Helm v3 | For rendering templates |
| Docker | For running `keycloak-config-cli` |

:::warning Minimum Keycloak version
The `keycloak-realm-management` chart uses Keycloak features available from version 25.0 (Organizations, extended OIDC attributes). Earlier versions are not supported. Verify the customer's Keycloak version before proceeding.
:::

---

## Phase 1: Initial setup on the customer's Keycloak

### Step 1.1: Create the `keycloak-config-cli` service account

To allow subsequent imports to run without admin credentials, create a dedicated service client in the `master` realm of the customer's Keycloak.

In the customer's Keycloak admin console:

1. Navigate to the **master** realm → **Clients** → **Create client**.
2. Fill in the fields:
   - **Client type**: OpenID Connect
   - **Client ID**: `keycloak-config-cli`
   - **Client authentication**: enabled
   - **Authorization**: disabled
   - **Standard flow**: disabled
   - **Service accounts roles**: enabled
3. Save and open the **Service account roles** tab.
4. Assign the `realm-admin` role (client role from the `realm-management` client) for the realms that `keycloak-config-cli` will manage.

:::note Least-privilege alternative
Instead of `realm-admin`, assign only the specific roles needed: `manage-realm`, `manage-clients`, `manage-identity-providers`, `manage-authorization`, `manage-users`, `manage-events`. This reduces the blast radius if the service account credentials are compromised.
:::

5. In the **Credentials** tab, copy the **Client secret**: it will be used as `KEYCLOAK_CLIENT_SECRET`.

### Step 1.2: Verify connectivity

Confirm the service account can authenticate:

```bash
curl -s -X POST \
  https://keycloak.customer.example.com/realms/master/protocol/openid-connect/token \
  -d "grant_type=client_credentials" \
  -d "client_id=keycloak-config-cli" \
  -d "client_secret=<CLIENT_SECRET>" \
  | jq .access_token
```

A JWT in the response confirms that connectivity and credentials are correct.

---

## Phase 2: Values file configuration

### Step 2.1: Install chart dependencies

From the `keycloak-realm-management` repository directory:

```bash
make deps
```

### Step 2.2: Create a values file for each realm

The values file structure for the three realms (master, products, extensibility) follows the same template described in the [Managed Keycloak guide](./managed-keycloak.md#step-22--create-a-values-file-for-each-realm).

The only differences for this scenario:

- Set `urls.keycloak` to the customer's Keycloak base URL (e.g. `https://keycloak.customer.example.com`).
- In the extensibility realm's `identityProviders` block, all endpoint URLs must reference the `mia-platform` realm on the customer's Keycloak (e.g. `https://keycloak.customer.example.com/realms/mia-platform/...`).
- The `themes.login` field can be left empty to use the customer Keycloak's default theme.

---

## Phase 3: Initial realm import

### Step 3.1: Render templates without applying (dry-run)

Before making any changes to the customer's Keycloak, render the templates and review the YAML that will be imported. This step makes no changes.

```bash
# Render master realm — output in rendered/master/master/<values-name>/
make template-master VALUES=values/production/master-values.yaml

# Render products realm — output in rendered/production/products/<values-name>/
make template-products ENV=production VALUES=values/production/products-values.yaml

# Render extensibility realm
make template-extensibility ENV=production VALUES=values/production/extensibility-values.yaml
```

Review the files under `rendered/` to confirm the generated configuration matches expectations before proceeding.

### Step 3.2: Import the realms (bootstrap with admin credentials)

For the first import use the customer's Keycloak admin credentials (`import-admin-*`). Realms must be imported in this order: **master → products → extensibility**.

```bash
# Master realm
make import-admin-master \
  KEYCLOAK_URL=https://keycloak.customer.example.com \
  KEYCLOAK_USER=<ADMIN_USER> \
  KEYCLOAK_PASSWORD=<ADMIN_PASSWORD> \
  VALUES=values/production/master-values.yaml

# mia-platform realm
make import-admin-products \
  ENV=production \
  KEYCLOAK_URL=https://keycloak.customer.example.com \
  KEYCLOAK_USER=<ADMIN_USER> \
  KEYCLOAK_PASSWORD=<ADMIN_PASSWORD> \
  VALUES=values/production/products-values.yaml

# mia-platform-extensibility realm
make import-admin-extensibility \
  ENV=production \
  KEYCLOAK_URL=https://keycloak.customer.example.com \
  KEYCLOAK_USER=<ADMIN_USER> \
  KEYCLOAK_PASSWORD=<ADMIN_PASSWORD> \
  VALUES=values/production/extensibility-values.yaml
```

### Step 3.3: Verify

In the customer's Keycloak admin console:

1. Confirm that the `mia-platform` and `mia-platform-extensibility` realms have been created.
2. In the `mia-platform` realm → **Clients**: confirm the product clients are present.
3. In the `mia-platform` realm → **Identity Providers**: confirm the federation entry is present.
4. Test the login flow by accessing one of the Mia Platform products.

---

## Phase 4: Incremental realm updates

After the initial bootstrap, subsequent updates (new Mia Platform releases, configuration changes) are applied via the service account created in Step 1.1, no admin credentials required.

### Safe update workflow

```
1. Update chart dependencies   →  make deps
2. Render templates            →  make template-<realm>   (dry-run — no changes applied)
3. Review rendered/            →  inspect or diff the generated YAML
4. Apply                       →  make import-<realm>
```

### Step 4.1: Update chart dependencies

After receiving a new version of the `keycloak-realm-management` chart:

```bash
make deps
```

### Step 4.2: Render and review (dry-run)

```bash
make template-products ENV=production VALUES=values/production/products-values.yaml
```

The files generated under `rendered/production/products/<values-name>/` show exactly what will be sent to `keycloak-config-cli`. Compare them with the previous render to identify changes before applying.

### Step 4.3: Apply with the service account

```bash
# Update master realm
make import-master \
  KEYCLOAK_URL=https://keycloak.customer.example.com \
  LOGIN_REALM=master \
  KEYCLOAK_CLIENT_SECRET=<CLIENT_SECRET> \
  VALUES=values/production/master-values.yaml

# Update mia-platform realm
make import-products \
  ENV=production \
  KEYCLOAK_URL=https://keycloak.customer.example.com \
  LOGIN_REALM=master \
  KEYCLOAK_CLIENT_SECRET=<CLIENT_SECRET> \
  VALUES=values/production/products-values.yaml

# Update mia-platform-extensibility realm
make import-extensibility \
  ENV=production \
  KEYCLOAK_URL=https://keycloak.customer.example.com \
  LOGIN_REALM=master \
  KEYCLOAK_CLIENT_SECRET=<CLIENT_SECRET> \
  VALUES=values/production/extensibility-values.yaml
```

### Safety guarantees

Each `make import-*` run is safe to repeat at any time thanks to the following `keycloak-config-cli` properties:

| Property | Effect |
|---|---|
| `IMPORT_REMOTESTATE_ENABLED=true` | Only resources declared in the import file are managed; everything else in the realm is left untouched |
| `IMPORT_MANAGED_CLIENT=no-delete` | Removing a client from the values file does **not** delete the client in Keycloak |
| `IMPORT_MANAGED_IDENTITYPROVIDER=no-delete` | Same for identity providers |
| `IMPORT_MANAGED_ROLE=no-delete` | Same for roles |
| `IMPORT_MANAGED_GROUP=no-delete` | Same for groups |
| Idempotency | Applying the same values file multiple times always produces the same result |

---

## Environment variables reference

| Variable | Default | Description |
|---|---|---|
| `KEYCLOAK_URL` | `http://localhost:8080` | Base URL of the customer's Keycloak |
| `KEYCLOAK_USER` | `admin` | Admin username (only for `import-admin-*`) |
| `KEYCLOAK_PASSWORD` | `admin` | Admin password (only for `import-admin-*`) |
| `KEYCLOAK_CLIENT_SECRET` | - | Service account client secret (for `import-*`) |
| `LOGIN_REALM` | - | Realm where `keycloak-config-cli` authenticates (typically `master`) |
| `ENV` | `dev` | Environment name: used to organise rendered files under `rendered/<ENV>/` |
| `VALUES` | `values/<ENV>/<realm>-values.yaml` | Path to the values file |
| `KEYCLOAK_CONFIG_CLI_IMAGE` | `adorsys/keycloak-config-cli:latest-<version>` | `keycloak-config-cli` Docker image: update to match the customer's Keycloak version |

:::note keycloak-config-cli version alignment
The `KEYCLOAK_CONFIG_CLI_IMAGE` variable in the `Makefile` must match the customer's Keycloak version. A significantly mismatched `keycloak-config-cli` version may silently drop or reject unsupported fields.
:::

---

## Next steps

- **Configure Mia Platform products** to use the customer's Keycloak as the Authentication Provider → [Authentication Provider](/requirements/installation-guidelines/console/self-hosted/helm-values/25_authentication-provider.md)
- **Future realm updates** → [How To Upgrade: Keycloak Realm Management](../keycloak-realm-management/100_how-to-upgrade.md)
