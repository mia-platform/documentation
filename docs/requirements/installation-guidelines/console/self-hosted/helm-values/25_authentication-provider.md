---
id: authentication-provider
title: Authentication Provider
sidebar_label: Authentication Provider
---



In Mia Platform Console v15, authentication is handled exclusively through **Keycloak**. The `authtool-bff` service manages the OIDC PKCE session flow and replaces the previous `authenticationService`.

:::info Prerequisites
Before configuring the authentication provider, ensure you have a running Keycloak instance with the required realms and OIDC clients configured. Refer to the [Keycloak installation guide](/requirements/installation-guidelines/authn/keycloak/15_getting-started.md) and the [Realm Management guide](/requirements/installation-guidelines/authn/keycloak-realm-management/15_getting-started.md).
:::

## Keycloak Configuration

Connect Console to the Keycloak instance by configuring the `configurations.keycloak` block.

| Name | Type | Description | Optional |
|:----:|:----:|:-----------:|:--------:|
| `configurations.keycloak.protocol` | string | Protocol for the Keycloak connection: `http` or `https` | ❌ |
| `configurations.keycloak.host` | string | Hostname of the Keycloak instance, without the protocol prefix | ❌ |
| `configurations.keycloak.realm` | string | Realm name used for Console user authentication (e.g. `mia-platform`) | ❌ |
| `configurations.keycloak.extensibilityRealm` | string | Realm name used for service-to-service and extensibility token exchange (e.g. `mia-extensions`) | ❌ |

```yaml
configurations:
  keycloak:
    protocol: "https"
    host: "keycloak.your-domain.com"
    realm: "mia-platform"
    extensibilityRealm: "mia-extensions"
```

:::note Dual-realm model
Mia Platform uses two Keycloak realms by default: one for human user authentication (`realm`) and one for machine-to-machine token exchange used by internal services (`extensibilityRealm`). Both realms are configured by the Realm Management chart. See [Federation Strategies](/requirements/installation-guidelines/authn/20_federation-strategies.md) for the reasoning behind this split.
:::

## Authtool BFF Keys

The `authtool-bff` service requires three cryptographic secrets for session management. These are provided via `authtoolBff.keys` and **must be generated before installation**.

| Name | Type | Description | Optional |
|:----:|:----:|:-----------:|:--------:|
| `authtoolBff.keys.privateKey` | string | RSA private key (PEM format), base64 encoded. Used for `private_key_jwt` client authentication with Keycloak. | ❌ |
| `authtoolBff.keys.cookieSecret` | string | Secret used to sign and encrypt session cookies. | ❌ |
| `authtoolBff.keys.redisTokenEncKey` | string | Key used to encrypt token data stored in Redis. | ❌ |

Generate the key material with the following commands:

```bash
# RSA private key for authtool-bff (base64 encoded, no passphrase)
ssh-keygen -t rsa -b 4096 -m PEM -f private.key -N "" > /dev/null
authtoolBffPrivateKey=$(base64 < private.key)
rm private.key private.key.pub

cookieSecret=$(openssl rand -hex 64)
redisTokenEncKey=$(openssl rand -hex 32)
```

Then set the generated values in your `values.yaml`:

```yaml
authtoolBff:
  keys:
    privateKey: "<BASE64_ENCODED_RSA_PRIVATE_KEY>"
    cookieSecret: "<COOKIE_SECRET>"
    redisTokenEncKey: "<REDIS_TOKEN_ENC_KEY>"
```

:::tip Secret management
In production, store these values in a secrets manager (e.g. HashiCorp Vault) and use External Secrets Operator to inject them into the cluster. The `*-deployment` wrapper repositories include example ESO-based secret configurations.
:::

## Expose synchronization webhooks

If you want to control user creation and deletion from an external Identity Provider you can use the `enableUserSynchronizationWebhooks` configuration flag

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
|`enableUserSynchronizationWebhooks`| boolean | Activates webhooks for automatic user synchronization with external Identity providers |  | ✅ |

To know more about user synchronization with an Identity Provider, visit the [dedicated documentation page](/requirements/installation-guidelines/console/self-hosted/helm-values/26_synchronize-users-with-an-identity-provider.md).
