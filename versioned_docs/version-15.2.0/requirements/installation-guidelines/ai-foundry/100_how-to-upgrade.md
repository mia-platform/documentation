---
id: how-to-upgrade
title: How To Upgrade
sidebar_label: How To Upgrade
---

# How to Upgrade the AI Foundry chart

To upgrade the `ai-foundry` chart, update the chart version and run `helm upgrade`.

:::tip
The chart follows [semver](https://semver.org/): breaking changes are introduced only in **major** version bumps. Minor releases add new optional configuration; patch releases contain only fixes. Always review the changelog before upgrading across a major boundary.
:::

## Direct chart upgrade

If you installed the chart directly:

```bash
helm repo update

helm upgrade ai-foundry mia-platform/ai-foundry \
  --namespace ai-foundry \
  --values values.yaml \
  --atomic \
  --timeout 5m
```

## Upgrade via the ai-foundry-deployment wrapper

If you use the `ai-foundry-deployment` wrapper repository, update the pinned chart version in `Chart.yaml`:

```yaml
dependencies:
  - name: ai-foundry
    alias: aiFoundry
    version: "~0.X"   # ← bump to the new target version constraint
    repository: "https://nexus.mia-platform.eu/repository/helm-internal/"
```

Then update and deploy:

```bash
helm dependency update

helm upgrade ai-foundry . \
  --namespace ai-foundry \
  --values values/<env>.yaml \
  --atomic \
  --timeout 5m
```

## Version-specific upgrade notes

### From 0.4.83-0 to 0.5.0-beta.23 (Mia-Platform v15.1.1 to v15.2.0)

This version moves the AI gateway (LiteLLM), the workflow engine (Temporal), document conversion (Docling), the memory service and the secret store (OpenBao) to the new [AI Services](/requirements/installation-guidelines/ai-services/10_overview.md) product, and adds new services that are enabled by default. The chart validates the values at render time and refuses to render incomplete configurations.

1. Install [AI Services](/requirements/installation-guidelines/ai-services/10_overview.md) in its own namespace before you upgrade AI Foundry.
2. Upgrade the [Realm Management chart](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/100_how-to-upgrade.md) to `0.1.47` with `products.aiFoundry: true` and `products.aiServices: true`.
3. Point `adkBeApp.config.litellmProxyApiBase` at the LiteLLM gateway of AI Services, and set `secrets.adkBeAppKeys.litellmProxyApiKey` if your gateway needs one. `adkBeApp.config.aiGatewayEnabled` defaults to `true`; to call the models directly, set it to `false`. Remove `adkBeApp.config.googleCloudProject`, `googleCloudLocation`, `googleGenaiUseVertexai`, `compactionSummarizerModel`, `sessionNamerModel` and `secrets.adkBeAppKeys.googleApplicationCredentials`: they are no longer read.
4. Provide the database credential of the new `ai-foundry-be` service: set `secrets.aiFoundryBeKeys.enabled: true` with `postgresConnectionString`, or create an `ai-foundry-be-keys` Secret. It must reach the same database as `secrets.adkBeAppKeys.postgresConnectionString`. If you set `aiFoundryBe.config.litellmBaseUrl`, also provide `litellmAdminKey` and `mcpConsentKeySecret` in the same Secret.
5. Configure Agentic Workflows (`aiFoundryWorkflows`, enabled by default): set `aiFoundryWorkflows.config.temporalAddress` to the Temporal frontend of AI Services and `aiFoundryWorkflows.config.temporalNamespace` to a namespace declared in `temporal.namespaces` of your AI Services values, then set `secrets.aiFoundryWorkflowsKeys.enabled: true` with `postgresConnectionString`, or create an `ai-foundry-workflows-keys` Secret. To skip the feature, set `aiFoundryWorkflows.enabled: false`.
6. Configure the new `secretStoreService` (enabled by default): set `secretStoreService.config.storeAddr` to your OpenBao or Vault (with AI Services, `http://openbao.<ai-services namespace>.svc.cluster.local:8200`). With the default `approle` authentication, set `secrets.secretStoreServiceKeys.enabled: true` with `storeRoleId` and `storeSecretId`, or create a `secret-store-service-keys` Secret. With `secretStoreService.config.auth.method: jwt`, set `secretStoreService.config.auth.jwt.role`.
7. Provide the database credential of the new `workspaceService` (enabled by default): set `secrets.workspaceServiceKeys.enabled: true` with a `postgresConnectionString` to a database of its own, or create a `workspace-service-keys` Secret. To skip the feature, set `workspaceService.enabled: false`. If you set `workspaceService.config.runnerNamespace` to another namespace, create it first.
8. Prepare or disable the `aiFoundryProvisioner` hook Job, enabled in the default values. It runs after install and upgrade to migrate the existing agentic resources of every tenant, and the release fails if the Job fails. It needs the `ai-foundry-be` database credential and, when the top-level `catalogUrl` is set, the `ai-foundry-provisioner` Keycloak client (created by Realm Management with `products.aiFoundry: true`) in `aiFoundryProvisioner.clientId`, its credential in `secrets.aiFoundryProvisionerKeys` or an `ai-foundry-provisioner-keys` Secret, `aiFoundryProvisioner.serve.enabled: true` (key pair) or `aiFoundryProvisioner.keyPublishedExternally: true`, and `authzUrl` and `authorizationServer.issuer`. Run the first upgrade with `aiFoundryProvisioner.dryRun: true`. To migrate the tenants by hand, set `aiFoundryProvisioner.enabled: false`.
9. Provide the credential of the new `exchangeAiServices` client of `authtool-bff` and set `aiServicesClientId: "ai-services-api"`. With `secrets.authtoolBffKeys.enabled: true`, set `secrets.authtoolBffKeys.exchangeAiServices.privateKey` (or `clientSecret`); if you manage the `authtool-bff-keys` Secret yourself, add the `exchangeAiServices-key.pem` key. If you do not call AI Services, set `authtoolBff.config.clients.exchangeAiServices: null`, otherwise `authtool-bff` fails at startup.
10. Remove the `doclingService` block and `serviceAccounts.doclingService` from your values, and set `apiGateway.docling.url` to the Docling route of AI Services. With an empty URL the `/api/docling/` route is not served.
11. Remove the Tempo settings: `adkBeApp.config.tempoBaseUrl`, `aiFoundryBff.config.tempoBaseUrl`, `aiFoundryBff.config.tempoAllowedServices`, `secrets.adkBeAppKeys.tempoAuthHeader` and `secrets.aiFoundryBffKeys.tempoAuthHeader`. The chart no longer creates the `ai-foundry-bff-keys` Secret.
12. If the chart creates your image pull Secret, set `global.imagePullSecret.name` and all of `global.imageCredentials.registry`, `username`, `password` and `email`: the Secret is now created only when all of them are set, while `global.imagePullSecret.enabled` still adds the reference to every pod.

Also note:

- To keep the AI gateway keys of the tenants in the central store of AI Services, set `aiServicesSecretStoreUrl` together with `authtoolBffUrl` and `aiServicesClientId`.
- Agent memory uses the memory service of AI Services: set `adkBeApp.config.agentMemoryBaseUrl` and `aiFoundryBff.config.memoryBaseUrl`.
- Trace and metric screens now read Langfuse and Prometheus through `aiFoundryBe.config.langfuseBaseUrl` and `prometheusBaseUrl`, and `adkBeApp.config.langfuseBaseUrl` and `prometheusBaseUrl`. With `aiFoundryBe.config.langfuseBaseUrl` set, also provide `secrets.aiFoundryBeKeys.langfuseAuthHeader`.
- The chart now also deploys `ai-foundry-mcp-server` (`aiFoundryMcp`) and a Redis instance (`redis`), both enabled by default with no required configuration.

### From 0.4.79 to 0.4.83-0 (Mia-Platform v15.0.2 to v15.1.0)

No manual action required: install the new chart version.

Also note:

- The new optional `namespacePrefix` value (default empty) adds a `<namespacePrefix>-` prefix to the names of all the resources the chart creates, including the image pull Secret and the TLS Secret set in `ingressRoute.tls.secretName`. Secrets that you create yourself must then use the prefixed names. Setting it on an existing installation renames its resources.
- The name of the Traefik IngressRoute can be set with `ingressRoute.name`. The default is `default-ingress`, the previous name.
- `aiFoundryWebsite.config.oauth.scopes` sets the OAuth scopes shown in the git-credential-oauth setup snippet of the AI Foundry website. When it is not set, the chart uses `openid offline_access` with `isPaaS: false`.
