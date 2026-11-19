---
id: managed-keycloak-restricted-idp
title: "Managed Keycloak: Restricted Customer IdP"
sidebar_label: Restricted Customer IdP
sidebar_position: 3
---

# Managed Keycloak: Restricted Customer IdP

> **When to use this guide:** the customer has a Keycloak instance but **cannot create new realms** on it (e.g., a shared enterprise Keycloak managed by a central IT team with restricted RBAC). Mia Platform deploys its own managed Keycloak instance and federates it with the customer's existing realm via standard OIDC.

This scenario is **functionally identical to [Managed Keycloak](/requirements/installation-guidelines/shared-services/authn/federation-strategies/managed-keycloak.md)**. The only difference is that the federated IdP is a realm on the customer's existing Keycloak instance rather than a generic IdP (Okta, Azure AD, etc.). Federation happens over the standard OIDC protocol, no changes are required on the customer's Keycloak beyond registering an OIDC client.

For an overview of all available federation models see [Federation Strategies](/requirements/installation-guidelines/shared-services/authn/federation-strategies/index.md).

---

## Prerequisites

Identical to the Managed Keycloak scenario, plus:

- Access to the customer's Keycloak admin console to register an **OIDC client** in the realm that will act as the IdP.
- The OIDC endpoints of the customer's constrained realm.

---

## Phase 1: Deploy the managed Keycloak

Identical to the Managed Keycloak guide. Follow Steps 1.1 through 1.4 from the [Managed Keycloak installation guide](/requirements/installation-guidelines/shared-services/authn/federation-strategies/managed-keycloak.md#phase-1--deploy-the-managed-keycloak).

---

## Phase 2: Realm configuration

The configuration is identical to the Managed Keycloak scenario except for the `identityProviders` block, which points to the OIDC endpoints of the customer's Keycloak realm instead of a generic IdP.

### Step 2.1: Register an OIDC client on the customer's Keycloak

Before configuring the values files, the customer's team must register an OIDC client in their constrained realm. This client will be used by the Mia Keycloak as a broker.

Required parameters for the client on the customer's Keycloak:

| Parameter | Value |
|---|---|
| **Client ID** | a name of your choice (e.g. `mia-platform-broker`) |
| **Client authentication** | enabled (confidential) |
| **Authorization** | disabled |
| **Standard flow** | enabled |
| **Valid redirect URIs** | `https://keycloak.example.com/realms/master/broker/<alias>/endpoint` |
| **Grant types** | Authorization Code |

The client authentication method depends on what the customer's Keycloak supports:

- **`private_key_jwt` (recommended):** the Mia Keycloak authenticates with a signed JWT. No shared secrets. The client must have a JWKS URL configured or the public key uploaded manually.
- **`client_secret_post`:** fallback if `private_key_jwt` is not supported. Requires sharing the client secret between the two systems.

### Step 2.2: Collect the OIDC endpoints of the customer's realm

The OIDC endpoints of a Keycloak realm follow a fixed pattern:

| Endpoint | URL |
|---|---|
| **Issuer** | `https://keycloak.customer.example.com/realms/<realm-name>` |
| **Authorization** | `https://keycloak.customer.example.com/realms/<realm-name>/protocol/openid-connect/auth` |
| **Token** | `https://keycloak.customer.example.com/realms/<realm-name>/protocol/openid-connect/token` |
| **UserInfo** | `https://keycloak.customer.example.com/realms/<realm-name>/protocol/openid-connect/userinfo` |
| **JWKS** | `https://keycloak.customer.example.com/realms/<realm-name>/protocol/openid-connect/certs` |
| **Logout** | `https://keycloak.customer.example.com/realms/<realm-name>/protocol/openid-connect/logout` |

The full OIDC discovery document is available at:

```
https://keycloak.customer.example.com/realms/<realm-name>/.well-known/openid-configuration
```

### Step 2.3: Configure the `identityProviders` block

In the master realm values file, use the following template. Replace the generic IdP block from the Managed Keycloak guide with the Keycloak-specific one below:

```yaml
# values/production/master-values.yaml (relevant section)
identityProviders:
  - alias: customer-keycloak           # unique alias — appears in the redirect URI
    displayName: "Corporate Access"
    enabled: true
    providerId: oidc
    trustEmail: true                   # email from the customer's Keycloak is trusted
    config:
      issuer: https://keycloak.customer.example.com/realms/customer-realm
      authorizationUrl: https://keycloak.customer.example.com/realms/customer-realm/protocol/openid-connect/auth
      tokenUrl: https://keycloak.customer.example.com/realms/customer-realm/protocol/openid-connect/token
      userInfoUrl: https://keycloak.customer.example.com/realms/customer-realm/protocol/openid-connect/userinfo
      jwksUrl: https://keycloak.customer.example.com/realms/customer-realm/protocol/openid-connect/certs
      logoutUrl: https://keycloak.customer.example.com/realms/customer-realm/protocol/openid-connect/logout
      clientId: mia-platform-broker    # client ID registered in Step 2.1
      clientAuthMethod: private_key_jwt
      defaultScope: openid email profile
      pkceEnabled: "true"
      pkceMethod: S256
      syncMode: FORCE
      useJwksUrl: "true"
      disableUserInfo: "false"
      isAccessTokenJWT: "true"
      sendIdTokenOnLogout: "true"
```

:::note Difference from Managed Keycloak
The `issuer`, `authorizationUrl`, `tokenUrl`, `jwksUrl`, and `logoutUrl` endpoints point to the customer's constrained Keycloak realm rather than an external IdP. The communication protocol is identical: standard OIDC.
:::

#### Fallback with `client_secret_post`

If the customer's Keycloak does not support `private_key_jwt`:

```yaml
config:
  clientAuthMethod: client_secret_post
  clientSecret: "${vault.customer-keycloak-client-secret}"
```

The secret must be referenced via vault (requires `vault.enabled: true` in the Keycloak chart and the secret pre-provisioned in the vault).

### Step 2.4: Complete the configuration

For the remaining steps (products and extensibility values files, `make deps`, dry-run render, and import) follow Steps 2.1–2.6 from the [Managed Keycloak guide](/requirements/installation-guidelines/shared-services/authn/federation-strategies/managed-keycloak.md#phase-2--realm-configuration), replacing the `identityProviders` block with the one shown above.

---

## Differences from Managed Keycloak

| Aspect | Managed Keycloak | Restricted Customer IdP |
|---|---|---|
| **Keycloak chart deployment** | Identical | Identical |
| **Realm configuration** | Identical | Identical |
| **Federated IdP** | Any OIDC/LDAP provider | Customer's Keycloak realm (OIDC) |
| **Configuration required from customer** | Register a client on their existing IdP | Register an OIDC client in their Keycloak realm |
| **IdP endpoint format** | Provider-specific | Fixed Keycloak pattern `/realms/<name>/protocol/openid-connect/*` |
| **Endpoint discovery** | Via the provider's discovery URL | Via `/.well-known/openid-configuration` of the realm |

---

## Next steps

- **Configure Mia Platform products** → [Authentication Provider](/requirements/installation-guidelines/console/self-hosted/helm-values/25_authentication-provider.md)
- **Future realm updates** → [How To Upgrade: Keycloak Realm Management](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/100_how-to-upgrade.md)
