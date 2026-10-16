---
id: how-to-upgrade
title: How To Upgrade
sidebar_label: How To Upgrade
---

# How to Upgrade the Services chart

To upgrade the `services` chart, update the chart version and run `helm upgrade`.

:::tip
The chart follows [semver](https://semver.org/): breaking changes are introduced only in **major** version bumps. Minor releases add new optional configuration; patch releases contain only fixes. Always review the changelog before upgrading across a major boundary.
:::

## Direct chart upgrade

If you installed the chart directly:

```bash
helm repo update

helm upgrade services mia-platform/services \
  --namespace services \
  --values values.yaml \
  --atomic \
  --timeout 5m
```

## Upgrade via the services-deployment wrapper

If you use the `services-deployment` wrapper repository, update the pinned chart version in `Chart.yaml`:

```yaml title="Chart.yaml" {4}
dependencies:
  - name: services
    version: "~X.Y"   # bump to the desired version
    repository: "https://nexus.mia-platform.eu/repository/helm-internal/"
```

Then:

```bash
helm dependency update

helm upgrade --install services . \
  --namespace services \
  --values values/production.yaml \
  --atomic
```

## Version-specific notes

### From 0.3.16 to 0.4.6 (Mia-Platform v15.1.1 to v15.2.0)

1. Upgrade the [Realm Management chart](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/100_how-to-upgrade.md) to `0.1.47` first, with `products.authz` enabled, plus `products.catalog` and `products.aiServices` if you use those products. The ADK Backend App exchanges the user token through the Keycloak client set in the new `authtoolBff.config.exchangeClientId` (default `authz-token-exchange`), which needs the `mia:catalog` scope and, with AI Services, the `mia:ai-services` scope.
2. Set `adkBeApp.config.catalogApiUrl` to the API gateway of your Catalog installation (for example `http://api-gateway.<catalog namespace>.svc.cluster.local:8080`). `adkBeApp` is enabled by default and the chart refuses to render while this value is empty. If you do not run the Catalog, set `adkBeApp.enabled: false`.
3. Configure how the ADK Backend App reaches the models. `adkBeApp.config.aiGatewayEnabled` defaults to `true`, so the models are called through the LiteLLM gateway of [AI Services](/requirements/installation-guidelines/shared-services/ai-services/10_overview.md): set `adkBeApp.config.litellmProxyApiBase` (for example `https://<ai-services host>/litellm/`), `adkBeApp.config.secretStoreBaseUrl` (the public URL of AI Services) and the new top-level `aiServicesClientId: "ai-services-api"`. Without them the chart refuses to render. If you do not use AI Services, set `adkBeApp.config.aiGatewayEnabled: false`.
4. Remove the `doclingService` block and `serviceAccounts.doclingService` from your values: the chart no longer deploys Docling and its values schema rejects them. To keep document parsing for chat attachments, set the new `apiGateway.docling.url` to the Docling route of AI Services (for example `https://<ai-services host>/api/docling/`) together with `aiServicesClientId`. With an empty URL the `/api/docling/` route is not served.
5. Remove `adkBeApp.config.tempoBaseUrl` and `secrets.adkBeAppKeys.tempoAuthHeader` from your values: the schema no longer accepts them. If you manage the `adk-be-app-keys` Secret yourself, you can drop its `tempoAuthHeader` key.

Also note:

- The chart now creates the image pull Secret only when `global.imagePullSecret.name`, `global.imageCredentials.registry`, `username`, `password` and `email` are all set; `global.imagePullSecret.enabled` only controls whether pods reference it. If you relied on the chart to create the Secret, make sure all five values are set, or Helm removes it on upgrade.
- `adkBeApp.config.googleCloudProject`, `googleCloudLocation` and `googleGenaiUseVertexai` are no longer in the default values. They are still used if you set them.
- `adkBeApp.config.catalogClientId` now defaults to `catalog-api`.
- The new optional `hooks.seedBuiltinGroups.enabled` hook seeds the built-in groups and their role assignments into every tenant. It reads the `postgres-connection-string` key of the `rbac-management-keys` Secret.
- With `hooks.seedEmails.enabled`, you can now also customize the onboarding email under `hooks.seedEmails.data.defaultOnboardingEmail`.

### From 0.2.65-hotfix.0 to 0.3.16 (Mia-Platform v15.0.2 to v15.1.0)

1. If you enabled `hooks.seedData` and set `hooks.seedData.secretName`, remove that value: the chart no longer reads it. The seed job now always reads the PostgreSQL connection string from the `rbac-management-keys` Secret, under the key set in `hooks.seedData.secretKey` (default `postgres-connection-string`). Before you upgrade, make sure that Secret contains the connection string under that key.

Also note:

- The new optional `namespacePrefix` value (default empty) adds a `<namespacePrefix>-` prefix to the names of all the resources the chart creates, including the `rbac-management-keys` Secret, the image pull Secret set in `global.imagePullSecret.name` and the TLS Secret set in `ingressRoute.tls.secretName`. Secrets that you create yourself must then use the prefixed names. Setting it on an existing installation renames its resources.
- The name of the Traefik IngressRoute can be set with `ingressRoute.name`. The default is `default-ingress`, the previous name.
- The hook resources have new names: for example, the Secret `postgres-db-check-credentials` is now `postgres-db-connectivity-credentials`. Jobs left behind under the old names by an earlier failed hook are not cleaned up by Helm: delete them by hand.

### From 0.2.65 to 0.2.65-hotfix.0 (Mia-Platform v15.0.0 to v15.0.1)

No manual action required: install the new chart version.
