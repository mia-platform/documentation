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

### From 0.3.42-0 to 0.4.4 (Mia-Platform v15.1.1 to v15.2.0)

1. Remove the `doclingService` block and `serviceAccounts.doclingService` from your values, including `doclingService.enabled: false`. The chart no longer deploys Docling and its values schema rejects unknown keys, so `helm upgrade` fails while they are set.
2. To keep document parsing in the Catalog, set the new `apiGateway.docling.url` to the Docling route of [AI Services](/requirements/installation-guidelines/shared-services/ai-services/10_overview.md) (for example `https://<ai-services host>/api/docling/`) and `aiServicesClientId: "ai-services-api"`, so that the API gateway exchanges the caller's token for the AI Services audience. This requires `authtoolBff.enabled: true`. With an empty URL the `/api/docling/` route is not served.
3. Configure how the ADK Backend App reaches the models. `adkBeApp` is enabled by default and the new `adkBeApp.config.aiGatewayEnabled` defaults to `true`, so the chart refuses to render unless you either set `adkBeApp.config.litellmProxyApiBase` (for example `https://<ai-services host>/litellm/`) and `adkBeApp.config.secretStoreBaseUrl` (the public URL of AI Services) together with `aiServicesClientId`, or set `adkBeApp.config.aiGatewayEnabled: false`, or set `adkBeApp.enabled: false`.
4. Remove `adkBeApp.config.useInternalEngine`, `adkBeApp.config.tempoBaseUrl` and `secrets.adkBeAppKeys.tempoAuthHeader` from your values: the schema rejects them. If you manage the `adk-be-app-keys` Secret yourself, you can drop its `tempoAuthHeader` key. The ADK Backend App now reads the Catalog through the API gateway of the same release unless you set `adkBeApp.config.catalogApiUrl`; when it is empty, `apiGateway.enabled` must be `true`.
5. If you set `aiServicesClientId`, upgrade the [Realm Management chart](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/100_how-to-upgrade.md) to `0.1.47` with `products.aiServices: true`, so that the `catalog-token-exchange` and `catalog-website-bff` clients can request the `mia:ai-services` scope. If you do not manage the realm with that chart, add `mia:ai-services` as an optional client scope of both clients.

Also note:

- The chart can now deploy `secretStoreService` (disabled by default), which keeps the signing keys of Catalog webhooks in an external OpenBao or Vault. While it is disabled, creating or rotating a webhook with a `secret` returns `502`. To enable it, set `secretStoreService.enabled: true`, `secretStoreService.config.storeAddr` and the authentication settings under `secretStoreService.config.auth`.
- The chart now creates the image pull Secret only when `global.imagePullSecret.name`, `global.imageCredentials.registry`, `username`, `password` and `email` are all set; `global.imagePullSecret.enabled` only controls whether pods reference it. If you relied on the chart to create the Secret, make sure all five values are set, or Helm removes it on upgrade.
- The new optional `catalogEngine.workerThreads` limits the worker threads of Catalog Engine.
- The new `apiGateway.docling.maxBodyBytes` (default `33554432`, 32 MiB) limits the size of documents uploaded to `/api/docling/`.

### From 0.3.28 to 0.3.42-0 (Mia-Platform v15.0.2 to v15.1.0)

1. Catalog Engine now syncs Catalog permissions to the Authz service with the `catalog-engine` Keycloak client. Upgrade the `keycloak-realm-management` chart to `0.1.35` first: with `products.catalog: true` it creates this client. If you do not manage the realm with that chart, create a confidential client `catalog-engine` with service accounts enabled, the "Signed JWT" client authenticator with the JWKS URL `<catalog url>/.well-known/jwks.json`, the default client scopes `mia:authz` and `mia:authz-roles`, and the `authz-api` client role `urn:mia-platform-internal:role:authz:permissions:writer` assigned to its service account user.
2. Add the client credential to the `catalog-engine-keys` Secret. With the default `catalogEngine.config.authzServiceAuthorization.tokenAuthMethod: private_key_jwt`, add a PEM-encoded private key under the `key.pem` key. With any other `tokenAuthMethod`, add the client secret under the `client-secret` key. If the chart creates the Secret (`secrets.catalogEngineKeys.enabled: true`), set `secrets.catalogEngineKeys.privateKey` or `secrets.catalogEngineKeys.clientSecret` instead.

Also note:

- To turn off the permissions sync, set `catalogEngine.config.authzServiceAuthorization.enabled: false`. The client and the credential of the steps above are then not needed.
- With `catalogKafkaContext.embedded.enabled: true` (default `false`) the chart deploys its own Kafka cluster in the Catalog namespace, without an operator or CRDs. It needs a StorageClass that can provision one ReadWriteOnce volume per Kafka node, and it cannot be combined with `secrets.kafkaKeys.enabled: true`.
- The new optional `namespacePrefix` value (default empty) adds a `<namespacePrefix>-` prefix to the names of all the resources the chart creates, including the image pull Secret and the TLS Secret set in `ingressRoute.tls.secretName`. Secrets that you create yourself must then use the prefixed names. Setting it on an existing installation renames its resources.
