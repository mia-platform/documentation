---
title: Managed Keycloak
sidebar_label: Managed Keycloak
sidebar_position: 1
---

# Managed Keycloak

> **When to use this guide:** the customer does not have a dedicated Keycloak instance, or prefers to rely on a Keycloak instance fully managed by Mia Platform. Keycloak is deployed via the Helm chart and configured to federate the customer's existing Identity Provider.

For an overview of all available federation models see [Federation Strategies](/requirements/installation-guidelines/shared-services/authn/federation-strategies/index.md).

---

## Prerequisites

| Requirement | Notes |
|---|---|
| Kubernetes cluster ≥ 1.28 | With `kubectl` access configured |
| Helm v3 | |
| External PostgreSQL | Reachable from the cluster; database, user and password already provisioned |
| Docker | Used by `keycloak-config-cli` during the realm import phase |
| Nexus image pull secret | Access to `nexus.mia-platform.eu` for the custom Keycloak image |
| Customer IdP details | OIDC discovery URL, client ID, client authentication method |

Create the target namespace before installing:

```bash
kubectl create namespace keycloak
```

---

## Phase 1: Deploy the managed Keycloak

Follow the [Keycloak chart Getting Started guide](/requirements/installation-guidelines/shared-services/authn/keycloak/15_getting-started.md) to complete the following steps:

1. Create the required Kubernetes secrets (`keycloak-bootstrap-admin`, `keycloak-db`).
2. Prepare a production values file with hostname, Ingress, and database settings.
3. Run `helm upgrade --install` to install the chart.
4. Verify the pods are running and the `Keycloak` CR reports `Ready: True`.

Return here once the Keycloak instance is up and accessible at its admin URL.

---

## Phase 2: Realm configuration

Realm configuration is managed by the `keycloak-realm-management` chart. Each realm (master, products, extensibility) is configured with a separate values file and imported via `keycloak-config-cli`.

### Step 2.1: Install chart dependencies

From the `keycloak-realm-management` repository directory:

```bash
make deps
```

### Step 2.2: Create a values file for each realm

One values file is required for each of the three Mia Platform realms.

#### Master realm

```yaml
# values/production/master-values.yaml
realmId: master
realmName: Master
themes:
  login: mia-platform-keycloak-ui
  account: mia-platform-keycloak-ui
urls:
  keycloak: https://keycloak.example.com
identityProviders:
  - alias: customer-idp
    displayName: "Corporate Access"
    enabled: true
    providerId: oidc
    trustEmail: true
    config:
      issuer: https://idp.customer.example.com
      authorizationUrl: https://idp.customer.example.com/oauth2/authorize
      tokenUrl: https://idp.customer.example.com/oauth2/token
      userInfoUrl: https://idp.customer.example.com/oauth2/userinfo
      jwksUrl: https://idp.customer.example.com/oauth2/jwks
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

#### `mia-platform` realm (products)

```yaml
# values/production/products-values.yaml
realmId: mia-platform
realmName: Mia Platform
themes:
  login: mia-platform-keycloak-ui
  account: mia-platform-keycloak-ui
urls:
  keycloak: https://keycloak.example.com
  console: https://console.example.com
  catalog: https://catalog.example.com
  aiFoundry: https://ai-foundry.example.com
products:
  console: true
  catalog: true
  aiFoundry: true
# The federation with the customer IdP is configured in the master realm.
# Add an identityProviders block here only if the IdP must also be directly
# available on this realm.
```

#### `mia-platform-extensibility` realm (extensibility)

The extensibility realm is federated 1:1 to the `mia-platform` realm. Its `identityProviders` entry points to the OIDC endpoints of the `mia-platform` realm on the same Keycloak instance:

```yaml
# values/production/extensibility-values.yaml
realmId: mia-platform-extensibility
realmName: Mia Platform Extensibility
themes:
  login: mia-platform-keycloak-ui
urls:
  keycloak: https://keycloak.example.com
  console: https://console.example.com
products:
  console: true
identityProviders:
  - alias: mia-platform
    displayName: Mia Platform
    enabled: true
    providerId: oidc
    trustEmail: true
    config:
      issuer: https://keycloak.example.com/realms/mia-platform
      authorizationUrl: https://keycloak.example.com/realms/mia-platform/protocol/openid-connect/auth
      tokenUrl: https://keycloak.example.com/realms/mia-platform/protocol/openid-connect/token
      userInfoUrl: https://keycloak.example.com/realms/mia-platform/protocol/openid-connect/userinfo
      jwksUrl: https://keycloak.example.com/realms/mia-platform/protocol/openid-connect/certs
      clientId: mia-platform-identity-provider
      clientAuthMethod: private_key_jwt
      defaultScope: "openid email profile"
      pkceEnabled: "true"
      pkceMethod: S256
      syncMode: FORCE
      useJwksUrl: "true"
      disableUserInfo: "true"
      isAccessTokenJWT: "true"
      sendIdTokenOnLogout: "true"
```

### Step 2.3: Configure OIDC federation with the customer IdP

The `identityProviders` block in the master realm values file configures the federation with the customer's existing IdP.

#### Client authentication method

The recommended method is `private_key_jwt`: the Mia Keycloak authenticates toward the customer's IdP with a signed JWT, no shared secrets. The client registered on the customer's IdP must accept this method.

If the customer's IdP does not support `private_key_jwt`, use `client_secret_post`:

```yaml
config:
  clientAuthMethod: client_secret_post
  clientSecret: "${vault.customer-idp-client-secret}"   # vault reference — never plain text
```

The secret must be referenced via the `${vault.<name>}` mechanism (`vault.enabled: true` required in the Keycloak chart values, with the secret pre-provisioned in the vault).

#### Recommended identity provider mappers

Add the following mappers to the values file of the realm containing the federation:

```yaml
identityProviderMappers:
  # Preserve the original user identifier from the upstream IdP
  - name: sub-to-provider-sub
    identityProviderAlias: customer-idp
    identityProviderMapper: oidc-user-attribute-idp-mapper
    config:
      claim: sub
      user.attribute: provider_sub
      syncMode: IMPORT

  # Mark emails as verified without requiring a separate verification step
  - name: email-verified
    identityProviderAlias: customer-idp
    identityProviderMapper: hardcoded-attribute-idp-mapper
    config:
      attribute: emailVerified
      attribute.value: "true"
      syncMode: IMPORT

  # Assign a default role to all users authenticating via this IdP
  - name: assign-default-role
    identityProviderAlias: customer-idp
    identityProviderMapper: oidc-hardcoded-role-idp-mapper
    config:
      role: realm/reporter
      syncMode: IMPORT
```

For the full list of available mapper types see the [Helm Values Reference](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/helm-values/00_overview.md).

### Step 2.4: Render templates without applying (dry-run)

Before importing, render the templates and review the YAML files that will be sent to `keycloak-config-cli`. This step makes no changes to the cluster.

```bash
# Render master realm — output in rendered/master/master/<values-name>/
make template-master VALUES=values/production/master-values.yaml

# Render products realm — output in rendered/production/products/<values-name>/
make template-products ENV=production VALUES=values/production/products-values.yaml

# Render extensibility realm
make template-extensibility ENV=production VALUES=values/production/extensibility-values.yaml
```

Review the files generated under `rendered/` before proceeding to import.

### Step 2.5: Import the realms

Realms must be imported in this order: **master → products → extensibility**. For the initial import use the bootstrap admin credentials (`import-admin-*`):

```bash
# Import master realm
make import-admin-master \
  KEYCLOAK_URL=https://keycloak.example.com \
  KEYCLOAK_USER=temp-admin \
  KEYCLOAK_PASSWORD=<ADMIN_PASSWORD> \
  VALUES=values/production/master-values.yaml

# Import mia-platform realm
make import-admin-products \
  ENV=production \
  KEYCLOAK_URL=https://keycloak.example.com \
  KEYCLOAK_USER=temp-admin \
  KEYCLOAK_PASSWORD=<ADMIN_PASSWORD> \
  VALUES=values/production/products-values.yaml

# Import mia-platform-extensibility realm
make import-admin-extensibility \
  ENV=production \
  KEYCLOAK_URL=https://keycloak.example.com \
  KEYCLOAK_USER=temp-admin \
  KEYCLOAK_PASSWORD=<ADMIN_PASSWORD> \
  VALUES=values/production/extensibility-values.yaml
```

:::note
`import-admin-*` uses username/password and is appropriate for the initial bootstrap. For subsequent updates, switch to service account authentication (`import-*` with `KEYCLOAK_CLIENT_SECRET`) to avoid exposing admin credentials. See [How To Upgrade](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/100_how-to-upgrade.md).
:::

### Step 2.6: Verify

1. Open the Keycloak admin console (URL configured in `keycloak.hostname.admin`).
2. Navigate to the `mia-platform` realm → **Identity Providers**: confirm the customer IdP is listed and enabled.
3. Navigate to **Clients**: confirm the clients for the enabled products (Console, Catalog, AI Foundry…) are present.
4. Test the login flow by accessing one of the Mia Platform product URLs and verifying the redirect to the customer's IdP works correctly.

---

## Next steps

- **Configure Mia Platform products** to use this Keycloak as the Authentication Provider → [Authentication Provider](/requirements/installation-guidelines/console/self-hosted/helm-values/25_authentication-provider.md)
- **Future realm updates** → [How To Upgrade: Keycloak Realm Management](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/100_how-to-upgrade.md)
- **Keycloak chart upgrades** → [How To Upgrade: Keycloak](/requirements/installation-guidelines/shared-services/authn/keycloak/100_how-to-upgrade.md)
