---
id: how-to-upgrade
title: How To Upgrade
sidebar_label: How To Upgrade
---

# How to Upgrade the Catalog chart

To upgrade the `catalog` chart, update the chart version and run `helm upgrade`.

:::tip
The chart follows [semver](https://semver.org/): breaking changes are introduced only in **major** version bumps. Minor releases add new optional configuration; patch releases contain only fixes. Always review the changelog before upgrading across a major boundary.
:::

## Direct chart upgrade

If you installed the chart directly:

```bash
helm repo update

helm upgrade catalog mia-platform/catalog \
  --namespace catalog \
  --values values.yaml \
  --atomic \
  --timeout 10m
```

## Upgrade via the catalog-deployment wrapper

If you use the `catalog-deployment` wrapper repository, update the pinned chart version in `Chart.yaml`:

```yaml
dependencies:
  - name: catalog
    version: "~0.X"   # ← bump to the new target version constraint
    repository: "https://nexus.mia-platform.eu/repository/helm-internal/"
```

Then update and deploy:

```bash
helm dependency update

helm upgrade catalog . \
  --namespace catalog \
  --values values/<env>.yaml \
  --atomic \
  --timeout 10m
```

## Version-specific upgrade notes

### From 0.3.28 to 0.3.42-0 (Mia-Platform v15.0.2 to v15.1.0)

1. Catalog Engine now syncs Catalog permissions to the Authz service with the `catalog-engine` Keycloak client. Upgrade the `keycloak-realm-management` chart to `0.1.35` first: with `products.catalog: true` it creates this client. If you do not manage the realm with that chart, create a confidential client `catalog-engine` with service accounts enabled, the "Signed JWT" client authenticator with the JWKS URL `<catalog url>/.well-known/jwks.json`, the default client scopes `mia:authz` and `mia:authz-roles`, and the `authz-api` client role `urn:mia-platform-internal:role:authz:permissions:writer` assigned to its service account user.
2. Add the client credential to the `catalog-engine-keys` Secret. With the default `catalogEngine.config.authzServiceAuthorization.tokenAuthMethod: private_key_jwt`, add a PEM-encoded private key under the `key.pem` key. With any other `tokenAuthMethod`, add the client secret under the `client-secret` key. If the chart creates the Secret (`secrets.catalogEngineKeys.enabled: true`), set `secrets.catalogEngineKeys.privateKey` or `secrets.catalogEngineKeys.clientSecret` instead.

Also note:

- To turn off the permissions sync, set `catalogEngine.config.authzServiceAuthorization.enabled: false`. The client and the credential of the steps above are then not needed.
- With `catalogKafkaContext.embedded.enabled: true` (default `false`) the chart deploys its own Kafka cluster in the Catalog namespace, without an operator or CRDs. It needs a StorageClass that can provision one ReadWriteOnce volume per Kafka node, and it cannot be combined with `secrets.kafkaKeys.enabled: true`.
- The new optional `namespacePrefix` value (default empty) adds a `<namespacePrefix>-` prefix to the names of all the resources the chart creates, including the image pull Secret and the TLS Secret set in `ingressRoute.tls.secretName`. Secrets that you create yourself must then use the prefixed names. Setting it on an existing installation renames its resources.
