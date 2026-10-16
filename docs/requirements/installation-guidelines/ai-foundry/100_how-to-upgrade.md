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

### From 0.4.83-0 to 0.5.0-preview.0 (Mia-Platform v15.1.1 to v15.2.0) {#from-0483-0-to-050-preview-0-mia-platform-v1511-to-v1520}

This version moves the AI gateway (LiteLLM), the workflow engine (Temporal), document conversion (Docling) and the memory service to the new [AI Services](/requirements/installation-guidelines/shared-services/ai-services/10_overview.md) product, adds a credential store (`secretStoreService`) in front of OpenBao, and adds new services that are enabled by default. The chart validates the values at render time and refuses to render incomplete configurations.

1. Upgrade the [Realm Management chart](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/100_how-to-upgrade.md) to `0.1.47` with `products.aiFoundry: true` and `products.aiServices: true`.
2. Upgrade [Homepage & RBAC](/requirements/installation-guidelines/shared-services/services/100_how-to-upgrade.md) to `0.4.6`. AI Foundry requires its authorization API: make sure `authzUrl` and `authzClientId: "authz-api"` point to it.
3. Install [AI Services](/requirements/installation-guidelines/shared-services/ai-services/10_overview.md) in its own namespace.
4. Point `adkBeApp.config.litellmProxyApiBase` at the LiteLLM gateway of AI Services, and set `secrets.adkBeAppKeys.litellmProxyApiKey` if your gateway needs one. `adkBeApp.config.aiGatewayEnabled` defaults to `true`; to call the models directly, set it to `false`. Remove `adkBeApp.config.googleCloudProject`, `googleCloudLocation`, `googleGenaiUseVertexai`, `compactionSummarizerModel` and `sessionNamerModel`: they are no longer read. Remove also `secrets.adkBeAppKeys.googleApplicationCredentials`: the key has been removed from the chart and `helm upgrade` fails while it is set.

   The models of the system playbooks (session namer, follow-ups, feedback summaries, compaction, memory extraction, Insights narration) are now set by the new top-level `systemAgentModel`, which replaces `compactionSummarizerModel` and `sessionNamerModel`. When it is empty, the default `claude-haiku-5-5` is used. The model must be served by the AI gateway: register it there, or set `systemAgentModel` to a model the gateway already serves.
5. Provide the database credential of the new `ai-foundry-be` service: set `secrets.aiFoundryBeKeys.enabled: true` with `postgresConnectionString`, or create an `ai-foundry-be-keys` Secret. It must reach the same database as `secrets.adkBeAppKeys.postgresConnectionString`, written as `postgresql://` without the `+asyncpg` driver suffix that `adk-be-app` needs. Set `aiFoundryBe.config.litellmBaseUrl` to the LiteLLM gateway of AI Services (for example `https://<ai-services host>/litellm/`): without it the model providers, the model catalogue and the spend screens do not work. It needs `litellmAdminKey` (the LiteLLM master key of AI Services) and `mcpConsentKeySecret` (a random secret, kept stable over time) in the same Secret, and both `authorizationServer.issuer` and `apiGateway.authorizationServer.audiences` set (the default audience is `ai-foundry-api`). `aiFoundryBff` requires `aiFoundryBe`: the chart refuses to render with `aiFoundryBff` enabled and `aiFoundryBe` disabled.
6. Configure Agentic Workflows (`aiFoundryWorkflows`, enabled by default): set `aiFoundryWorkflows.config.temporalAddress` to the Temporal frontend of AI Services and `aiFoundryWorkflows.config.temporalNamespace` to a namespace declared in `temporal.namespaces` of your AI Services values, then set `secrets.aiFoundryWorkflowsKeys.enabled: true` with `postgresConnectionString`, or create an `ai-foundry-workflows-keys` Secret. To skip the feature, set `aiFoundryWorkflows.enabled: false`. The chart refuses to render with `aiFoundryWorkflows.config.httpAllowPrivate: true`. If you set `aiFoundryWorkflows.config.aiServicesBaseUrl`, also set `authtoolBffUrl` and `aiServicesClientId`, disable `workspaceService` in this release and point `aiFoundryWorkflows.config.workspaceBaseUrl` to the workspace service you use; otherwise the chart refuses to render.
7. Configure the new `secretStoreService` (enabled by default): set `secretStoreService.config.storeAddr` to your OpenBao. With the default `approle` authentication, set `secrets.secretStoreServiceKeys.enabled: true` with `storeRoleId` and `storeSecretId`, or create a `secret-store-service-keys` Secret. With `secretStoreService.config.auth.method: jwt`, set `secretStoreService.config.auth.jwt.role`.
8. Provide the database credential of the new `workspaceService` (enabled by default): set `secrets.workspaceServiceKeys.enabled: true` with a `postgresConnectionString` to a database of its own, or create a `workspace-service-keys` Secret. To skip the feature, set `workspaceService.enabled: false`. If you set `workspaceService.config.runnerNamespace` to another namespace, create it first.
9. Prepare or disable the `aiFoundryProvisioner` hook Job, enabled in the default values. It runs after install and upgrade to migrate the existing agentic resources of every tenant, and the release fails if the Job fails. It needs the `ai-foundry-be` database credential and, when the top-level `catalogUrl` is set, the `ai-foundry-provisioner` Keycloak client (created by Realm Management with `products.aiFoundry: true`) in `aiFoundryProvisioner.clientId`, its credential in `secrets.aiFoundryProvisionerKeys` or an `ai-foundry-provisioner-keys` Secret, `aiFoundryProvisioner.serve.enabled: true` (key pair) or `aiFoundryProvisioner.keyPublishedExternally: true`, and `authzUrl` and `authorizationServer.issuer`. Run the first upgrade with `aiFoundryProvisioner.dryRun: true`. To migrate the tenants by hand, set `aiFoundryProvisioner.enabled: false`.
10. Provide the credential of the new `exchangeAiServices` client of `authtool-bff`, set `aiServicesClientId: "ai-services-api"` and make sure `authtoolBffUrl` is set (for example `http://authtool-bff`): without it no token exchange happens and AI Services refuses the caller's token. With `secrets.authtoolBffKeys.enabled: true`, set `secrets.authtoolBffKeys.exchangeAiServices.privateKey` (or `clientSecret`); if you manage the `authtool-bff-keys` Secret yourself, add the `exchangeAiServices-key.pem` key. If you do not call AI Services, set `authtoolBff.config.clients.exchangeAiServices: null`, otherwise `authtool-bff` fails at startup.
11. Remove the `doclingService` block and `serviceAccounts.doclingService` from your values: they have been removed from the chart and `helm upgrade` fails while they are set. Then set `apiGateway.docling.url` to the Docling route of AI Services. With an empty URL the `/api/docling/` route is not served.
12. Remove the Tempo settings: `adkBeApp.config.tempoBaseUrl`, `aiFoundryBff.config.tempoBaseUrl`, `aiFoundryBff.config.tempoAllowedServices`, `secrets.adkBeAppKeys.tempoAuthHeader` and `secrets.aiFoundryBffKeys.tempoAuthHeader`. The two `tempoAuthHeader` keys have been removed from the chart and `helm upgrade` fails while they are set. The chart no longer creates the `ai-foundry-bff-keys` Secret.
13. If the chart creates your image pull Secret, set `global.imagePullSecret.name` and all of `global.imageCredentials.registry`, `username`, `password` and `email`: the Secret is now created only when all of them are set, while `global.imagePullSecret.enabled` still adds the reference to every pod.

Also note:

- To keep the AI gateway keys of the tenants in the central store of AI Services, set `aiServicesSecretStoreUrl` together with `authtoolBffUrl` and `aiServicesClientId`.
- Agent memory uses the memory service of AI Services: set `adkBeApp.config.agentMemoryBaseUrl` and `aiFoundryBff.config.memoryBaseUrl`.
- Trace and metric screens now read Langfuse and Prometheus through `aiFoundryBe.config.langfuseBaseUrl` and `prometheusBaseUrl`, and `adkBeApp.config.langfuseBaseUrl` and `prometheusBaseUrl`. With `aiFoundryBe.config.langfuseBaseUrl` set, also provide `secrets.aiFoundryBeKeys.langfuseAuthHeader`.
- The chart now also deploys `ai-foundry-mcp-server` (`aiFoundryMcp`) and a Redis instance (`redis`), both enabled by default with no required configuration.
- `aiFoundryWebsite.config.links.consoleHref`, `catalogHref`, `homepageHref`, `miaFlowHref`, `dataFabricHref`, `p4samdHref`, `claudeCodeHref`, `githubCopilotHref` and `miaDocsHref` are no longer read by the website: the links to the other products come from the product configuration of the organization, served by Homepage & RBAC.

:::info
The installation of Langfuse, OpenBao and Prometheus is not covered by these guides yet: we are working to provide the documentation to install these components as well.
:::

### From 0.4.79 to 0.4.83-0 (Mia-Platform v15.0.2 to v15.1.0)

No manual action required: install the new chart version.

Also note:

- The new optional `namespacePrefix` value (default empty) adds a `<namespacePrefix>-` prefix to the names of all the resources the chart creates, including the image pull Secret and the TLS Secret set in `ingressRoute.tls.secretName`. Secrets that you create yourself must then use the prefixed names. Setting it on an existing installation renames its resources.
- The name of the Traefik IngressRoute can be set with `ingressRoute.name`. The default is `default-ingress`, the previous name.
- `aiFoundryWebsite.config.oauth.scopes` sets the OAuth scopes shown in the git-credential-oauth setup snippet of the AI Foundry website. When it is not set, the chart uses `openid offline_access` with `isPaaS: false`.
