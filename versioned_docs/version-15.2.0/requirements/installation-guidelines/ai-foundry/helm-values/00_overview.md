---
id: overview
title: Helm Values Overview
sidebar_label: Overview
---

# Helm Values: ai-foundry chart

This page describes the main configurable values for the `ai-foundry` chart. See the chart `values.yaml` for the defaults and for the advanced keys of each service not listed here.

The chart validates the values at render time and refuses to render a configuration that would fail at runtime; the error message names the setting to fix.

:::info
The installation of Langfuse, OpenBao and Prometheus is not covered by these guides yet: we are working to provide the documentation to install these components as well.
:::

## URL and environment

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `url` | string | `""` | ✅ | Full public URL where AI Foundry is exposed (e.g. `https://ai-foundry.your-domain.com`). Used to configure OIDC redirect URIs, CORS, and routing. |
| `environment` | string | `""` | ✅ | Logical environment name (e.g. `production`, `development`). Used for labelling and environment-specific behaviour. |
| `isPaaS` | boolean | `false` | ❌ | Set to `true` for Mia Platform PaaS deployments. |
| `namespacePrefix` | string | `""` | ❌ | When set, prefixed (as `<namespacePrefix>-<name>`) to the names of the resources created by the chart, including Services, the `IngressRoute`, the image pull secret referenced by `global.imagePullSecret.name` and the TLS secret set in `ingressRoute.tls.secretName`. |
| `catalogUrl` | string | `""` | ❌ | Full URL of the Mia Platform Catalog instance. Used by `aiFoundryBff` (and, via the ADK backend, `adkBeApp`) to call the Catalog API using a token-exchange client. When empty, the items are stored in PostgreSQL and served by `aiFoundryBe`, which must then be enabled. |
| `catalogClientId` | string | `""` | ❌ | OIDC client ID used to identify the Catalog API audience for the token-exchange flow (e.g. `catalog-api`). |
| `authzUrl` | string | `""` | ✅ | URL of the authorization API of Homepage & RBAC (the `services` chart's `apiGateway`, routed to `rbacManagement`). Used by `aiFoundryBff`, `aiFoundryBe`, `aiFoundryProvisioner` and, when `rbacAuthzServiceUrl` is empty, by `accessControl`. |
| `authzClientId` | string | `""` | ❌ | OIDC client ID used to identify the Authz API audience for the token-exchange flow (e.g. `authz-api`). |
| `authtoolBffUrl` | string | `""` | ✅ | Base URL of `authtool-bff` (e.g. `http://authtool-bff`). The services call it to exchange the caller's token for the audience of the Catalog, Authz and AI Services APIs: the exchange happens only when it is set. When empty, the caller's JWT is forwarded unchanged, which the AI Services gateway refuses. |
| `aiServicesClientId` | string | `""` | ❌ | `authtool-bff` exchange alias for the AI Services audience: set it to `ai-services-api` (the alias of the `exchangeAiServices` client). Used for the calls to AI Services (memory service, Docling route, central secret store) and to the metrics store; when empty the caller's token is forwarded unchanged, which the AI Services gateway refuses. |
| `aiServicesSecretStoreUrl` | string | `""` | ❌ | Public URL of AI Services in front of its central secret store, used to keep the tenants' AI gateway keys there. Requires `authtoolBffUrl` and `aiServicesClientId`. Empty keeps every credential in this release's `secretStoreService`. |
| `systemAgentModel` | string | `""` | ❌ | Model of the seeded system playbooks (session namer, follow-ups, feedback summaries, compaction, memory extraction, Insights narration). Replaces `adkBeApp.config.compactionSummarizerModel` and `sessionNamerModel`. Empty uses the default of the seed, `claude-haiku-5-5`. The model must be served by the AI gateway. |

## IngressRoute (Traefik)

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `ingressRoute.enabled` | boolean | `false` | ❌ | Create a Traefik `IngressRoute` resource. |
| `ingressRoute.name` | string | `default-ingress` | ❌ | Name of the `IngressRoute` resource. Prefixed with `namespacePrefix` when set. |
| `ingressRoute.host` | string | `""` | ❌ | Hostname for the IngressRoute. Defaults to the host part of `url` when empty. |
| `ingressRoute.entryPoints` | array | `["websecure"]` | ❌ | Traefik entry points to attach the route to. |
| `ingressRoute.middlewares` | array | `[]` | ❌ | Additional Traefik middleware references (e.g. IP filtering, rate limiting). |
| `ingressRoute.serviceName` | string | `api-gateway` | ❌ | Kubernetes Service name to route traffic to. |
| `ingressRoute.servicePort` | integer | `8080` | ❌ | Service port to route traffic to. |

## Authorization server

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `authorizationServer.enabled` | boolean | `true` | ❌ | Enable JWT validation in the API gateway. |
| `authorizationServer.issuer` | string | `""` | ✅ | Keycloak realm issuer URL (e.g. `https://keycloak.your-domain.com/realms/my-realm`). Used by `authtoolBff` to discover OIDC endpoints and by the API gateway to validate JWTs. |

## Telemetry

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `telemetry.enabled` | boolean | `false` | ❌ | Enable OpenTelemetry tracing for services that support it. |
| `telemetry.otelExporterOtlpEndpoint` | string | `""` | ❌ | OTLP endpoint for all signals (traces, metrics, logs). |
| `telemetry.otelExporterOtlpTracesEndpoint` | string | `""` | ❌ | OTLP endpoint for traces only. Overrides the general endpoint for traces. |

## Secrets

The chart can manage secret creation inline. When `enabled: false` (default), the secret must exist in the namespace before install (e.g. created manually or via External Secrets Operator).

### authtool-bff keys

`authtool-bff` runs four OIDC clients: `website` (browser login/logout), `exchangeCatalog` (token exchange for the Catalog API), `exchangeAuthz` (token exchange for the Authz API), and `exchangeAiServices` (token exchange for AI Services). Each has its own key material, and every declared client needs it or `authtool-bff` fails at startup: to drop a client, set it to `null` under `authtoolBff.config.clients`. In a self-managed `authtool-bff-keys` Secret, each client has a `<client>-key.pem` entry (`private_key_jwt`) or a `<client>-client-secret` entry, plus `cookie-secret.key` and `redis-token-enc.key`.

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.authtoolBffKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `authtool-bff-keys` from the values below. |
| `secrets.authtoolBffKeys.cookieSecret` | string | `""` | Secret used to sign and encrypt session cookies (hex, 64 bytes recommended). |
| `secrets.authtoolBffKeys.tokenEncKey` | string | `""` | Key used to encrypt token data stored in Redis (hex, 32 bytes recommended). |
| `secrets.authtoolBffKeys.website.privateKey` | string | `""` | RSA private key in PEM format, base64 encoded. Used when the website client's `tokenAuthMethod` is `private_key_jwt`. |
| `secrets.authtoolBffKeys.website.clientSecret` | string | `""` | OIDC client secret. Used when the website client's `tokenAuthMethod` is `client_secret_post` or `client_secret_basic`. |
| `secrets.authtoolBffKeys.exchangeCatalog.privateKey` | string | `""` | RSA private key for the Catalog token-exchange client. |
| `secrets.authtoolBffKeys.exchangeCatalog.clientSecret` | string | `""` | OIDC client secret for the Catalog token-exchange client. |
| `secrets.authtoolBffKeys.exchangeAuthz.privateKey` | string | `""` | RSA private key for the Authz token-exchange client. |
| `secrets.authtoolBffKeys.exchangeAuthz.clientSecret` | string | `""` | OIDC client secret for the Authz token-exchange client. |
| `secrets.authtoolBffKeys.exchangeAiServices.privateKey` | string | `""` | RSA private key for the AI Services token-exchange client. |
| `secrets.authtoolBffKeys.exchangeAiServices.clientSecret` | string | `""` | OIDC client secret for the AI Services token-exchange client. |

:::tip Key generation
```bash
ssh-keygen -t rsa -b 4096 -m PEM -f private.key -N "" > /dev/null
privateKey=$(base64 < private.key); rm private.key private.key.pub
cookieSecret=$(openssl rand -hex 64)
tokenEncKey=$(openssl rand -hex 32)
```
:::

### access-control keys

Used only when `accessControl.config.externalContext.enabled: true`: `accessControl` authenticates as its own OIDC client to call the API configured via `authzUrl`.

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.accessControlKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `access-control-keys`. |
| `secrets.accessControlKeys.privateKey` | string | `""` | RSA private key in PEM format, base64 encoded. Used when `accessControl.config.externalContext.authorization.tokenAuthMethod` is `private_key_jwt`. |
| `secrets.accessControlKeys.clientSecret` | string | `""` | OIDC client secret. Used when `accessControl.config.externalContext.authorization.tokenAuthMethod` is `client_secret_post` or `client_secret_basic`. |

### adk-be-app keys

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.adkBeAppKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `adk-be-app-keys` from the values below. |
| `secrets.adkBeAppKeys.postgresConnectionString` | string | `""` | PostgreSQL connection string used by the ADK backend (e.g. `postgresql://user:pass@host:5432/dbname`). |
| `secrets.adkBeAppKeys.otelExporterOtlpHeaders` | string | `""` | OTLP authentication headers for the ADK backend (e.g. `Authorization=Bearer <token>`). |
| `secrets.adkBeAppKeys.litellmProxyApiKey` | string | `""` | Key for the LiteLLM AI gateway, when the gateway requires one. Without it, `adkBeApp` reads each tenant's own gateway key from the secret store. |
| `secrets.adkBeAppKeys.langfuseAuthHeader` | string | `""` | Authorization header for the Langfuse read API, used with `adkBeApp.config.langfuseBaseUrl`. |
| `secrets.adkBeAppKeys.prometheusAuthHeader` | string | `""` | Authorization header for the metrics store, used with `adkBeApp.config.prometheusBaseUrl`. |

The chart no longer creates an `ai-foundry-bff-keys` Secret: `aiFoundryBff` reads no credential.

### ai-foundry-be keys

Required while `aiFoundryBe.enabled: true`, unless an `ai-foundry-be-keys` Secret already exists. Also used by `aiFoundryProvisioner`.

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.aiFoundryBeKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `ai-foundry-be-keys` from the values below. |
| `secrets.aiFoundryBeKeys.postgresConnectionString` | string | `""` | PostgreSQL connection string. Must reach the same database as `secrets.adkBeAppKeys.postgresConnectionString`. |
| `secrets.aiFoundryBeKeys.langfuseAuthHeader` | string | `""` | Langfuse read credential (e.g. `Basic <base64 of public-key:secret-key>`). Required when `aiFoundryBe.config.langfuseBaseUrl` is set. |
| `secrets.aiFoundryBeKeys.prometheusAuthHeader` | string | `""` | Authorization header for the metrics store. When empty, the caller's token exchanged through `aiServicesClientId` is used. |
| `secrets.aiFoundryBeKeys.litellmAdminKey` | string | `""` | LiteLLM admin key: the master key of the AI Services gateway (`secrets.litellmProxyKeys.masterKey` of the AI Services values). It mints virtual keys and reads every tenant's spend. Required when `aiFoundryBe.config.litellmBaseUrl` is set. |
| `secrets.aiFoundryBeKeys.mcpConsentKeySecret` | string | `""` | Secret from which each person's durable gateway identity is derived. Read together with `litellmAdminKey` when `aiFoundryBe.config.litellmBaseUrl` is set. Use a random value (for example `openssl rand -hex 32`) and keep it stable: changing it gives every person a new identity. Empty falls back to short-lived keys. |

### ai-foundry-workflows keys

Required while `aiFoundryWorkflows.enabled: true`, unless an `ai-foundry-workflows-keys` Secret already exists.

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.aiFoundryWorkflowsKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `ai-foundry-workflows-keys`. |
| `secrets.aiFoundryWorkflowsKeys.postgresConnectionString` | string | `""` | PostgreSQL connection string. Must reach the same database as `adkBeAppKeys` and `aiFoundryBeKeys`. |

### secret-store-service keys

Required while `secretStoreService.enabled: true` with the default `approle` auth method, unless a `secret-store-service-keys` Secret already exists.

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.secretStoreServiceKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `secret-store-service-keys`. |
| `secrets.secretStoreServiceKeys.storeRoleId` | string | `""` | AppRole `role-id` for OpenBao. |
| `secrets.secretStoreServiceKeys.storeSecretId` | string | `""` | AppRole `secret-id` for OpenBao. Both values are required. |

### workspace-service keys

Required while `workspaceService.enabled: true`, unless a `workspace-service-keys` Secret already exists.

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.workspaceServiceKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `workspace-service-keys`. |
| `secrets.workspaceServiceKeys.postgresConnectionString` | string | `""` | PostgreSQL connection string of a database of its own: the service creates the `workspaces` table at startup, so the role needs create rights on it. |

### ai-foundry-provisioner keys

Required only when `aiFoundryProvisioner.enabled: true` and `catalogUrl` is set, unless an `ai-foundry-provisioner-keys` Secret already exists.

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.aiFoundryProvisionerKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `ai-foundry-provisioner-keys`. |
| `secrets.aiFoundryProvisionerKeys.privateKey` | string | `""` | Private key of the `ai-foundry-provisioner` Keycloak client. Requires `aiFoundryProvisioner.serve.enabled: true` or `aiFoundryProvisioner.keyPublishedExternally: true`. |
| `secrets.aiFoundryProvisionerKeys.clientSecret` | string | `""` | Client secret of the `ai-foundry-provisioner` Keycloak client, as an alternative to `privateKey`. |

## Global image settings

| Key | Type | Default | Description |
|---|---|---|---|
| `global.labels` | object | `{}` | Additional labels added to all resources. |
| `global.annotations` | object | `{}` | Additional annotations added to all resources. |
| `global.imagePullSecret.enabled` | boolean | `false` | When `true`, every pod references the image pull secret named in `global.imagePullSecret.name`. It does not control the creation of the Secret. |
| `global.imagePullSecret.name` | string | `""` | Name of the image pull secret. The chart creates a `kubernetes.io/dockerconfigjson` Secret with this name only when `name` and all of `global.imageCredentials.registry`, `username`, `password` and `email` are set; otherwise the Secret must already exist. |
| `global.imageCredentials.registry` | string | `""` | Container registry hostname. Also used as the fallback registry for any microservice image that does not set its own `image.registry`. |
| `global.imageCredentials.username` | string | `""` | Registry username. Typically injected at deploy time via `--set` rather than committed to a values file. |
| `global.imageCredentials.password` | string | `""` | Registry password/token. Typically injected at deploy time via `--set`. |
| `global.imageCredentials.email` | string | `""` | Email associated with the registry credentials (required by the `dockerconfigjson` format). |

## Service accounts

Each microservice gets its own dedicated `ServiceAccount`, created by default. Applies to: `accessControl`, `adkBeApp`, `aiFoundryBe`, `aiFoundryBff`, `aiFoundryWebsite`, `aiFoundryMcp`, `aiFoundryWorkflows`, `apiGateway`, `authtoolBff`, `cache`, `redis`, `secretStoreService`, `workspaceService`. Remove `serviceAccounts.doclingService` from existing values.

| Key | Type | Default | Description |
|---|---|---|---|
| `serviceAccounts.<service>.enabled` | boolean | `true` | Create a ServiceAccount for `<service>`. |

## Common microservice fields

All microservices share the following configurable fields:

| Key | Type | Description |
|---|---|---|
| `<service>.enabled` | boolean | Enable or disable the microservice. |
| `<service>.replicaCount` | integer | Number of pod replicas. |
| `<service>.image.registry` | string | Container registry. |
| `<service>.image.repository` | string | Image repository path. |
| `<service>.image.tag` | string | Image tag. |
| `<service>.image.pullPolicy` | string | Image pull policy (`Always`, `IfNotPresent`, `Never`). |
| `<service>.resources.requests.cpu` | string | CPU request. |
| `<service>.resources.requests.memory` | string | Memory request. |
| `<service>.resources.limits.cpu` | string | CPU limit. |
| `<service>.resources.limits.memory` | string | Memory limit. |
| `<service>.autoscaling.enabled` | boolean | Enable Horizontal Pod Autoscaler. |
| `<service>.autoscaling.minReplicas` | integer | Minimum replicas for HPA. |
| `<service>.autoscaling.maxReplicas` | integer | Maximum replicas for HPA. |
| `<service>.autoscaling.targetCPUUtilizationPercentage` | integer | Target CPU utilization percentage for HPA scaling. |

---

## accessControl

OPA-based ext-authz service. Enforces RBAC policies on every request forwarded by the API gateway. Can optionally fetch additional authorization context from an external API.

| Key | Type | Default | Description |
|---|---|---|---|
| `accessControl.config.externalContext.enabled` | boolean | `true` | Enable fetching external authorization context from the API configured via `authzUrl`. |
| `accessControl.config.externalContext.authorization.enabled` | boolean | `true` | Authenticate to the external authorization API as an OIDC client. |
| `accessControl.config.externalContext.authorization.clientId` | string | `"ai-foundry-access-control"` | OIDC client ID registered in Keycloak for `accessControl`. |
| `accessControl.config.externalContext.authorization.tokenAuthMethod` | string | `"private_key_jwt"` | Token endpoint authentication method. Options: `private_key_jwt`, `client_secret_post`, `client_secret_basic`. |

## adkBeApp

The ADK Backend App orchestrates AI agents using Google ADK and calls the models through the LiteLLM AI gateway of AI Services.

| Key | Type | Default | Description |
|---|---|---|---|
| `adkBeApp.config.aiGatewayEnabled` | boolean | `true` | Call the models through the AI gateway. Set to `false` to call them directly. |
| `adkBeApp.config.litellmProxyApiBase` | string | `""` | **Required** while `aiGatewayEnabled` is `true`: URL of the LiteLLM gateway of AI Services (e.g. `https://<ai-services host>/litellm/`). |
| `adkBeApp.config.agentMemoryBaseUrl` | string | `""` | URL of the AI Services gateway in front of the memory service. Empty disables agent memory. |
| `adkBeApp.config.langfuseBaseUrl` | string | `""` | Langfuse read API, for the trace agent tools. Credential in `secrets.adkBeAppKeys.langfuseAuthHeader`. |
| `adkBeApp.config.prometheusBaseUrl` | string | `""` | Prometheus-compatible metrics API, for the metrics agent tool. |
| `adkBeApp.config.agentReloadInterval` | string | `"300"` | Interval in seconds at which the ADK backend reloads agent definitions. |
| `adkBeApp.config.foundryIntrospectionTools` | boolean | `false` | Enable introspection tools that expose AI Foundry's own agent/tool definitions to agents. |
| `adkBeApp.config.allowPrivateNetworkMcp` | boolean | `false` | Allow the ADK backend to reach MCP servers on private/internal network addresses. |

## aiFoundryBff

The AI Foundry BFF provides the backend API to the website. It requires `aiFoundryBe`, which serves the observability read APIs.

| Key | Type | Default | Description |
|---|---|---|---|
| `aiFoundryBff.enabled` | boolean | `true` | Deploy the BFF. Requires `aiFoundryBe.enabled: true`: the chart refuses to render otherwise. |
| `aiFoundryBff.config.memoryBaseUrl` | string | `""` | URL of the AI Services gateway in front of the memory service (same value as `adkBeApp.config.agentMemoryBaseUrl`). Empty disables the memory routes. |
| `aiFoundryBff.config.secretStoreBaseUrl` | string | `""` | Secret store used to write credentials. Empty defaults to this release's `secretStoreService`; with `secretStoreService` disabled it is required, otherwise the chart refuses to render. |

## aiFoundryBe

PostgreSQL-backed implementation of the Catalog item API and read API for the observability screens. Enabled by default; its credential is in `secrets.aiFoundryBeKeys`.

| Key | Type | Default | Description |
|---|---|---|---|
| `aiFoundryBe.enabled` | boolean | `true` | Deploy `ai-foundry-be`. Required when `catalogUrl` is empty or `aiFoundryBff` is enabled. |
| `aiFoundryBe.config.langfuseBaseUrl` | string | `""` | Langfuse read API. Requires `secrets.aiFoundryBeKeys.langfuseAuthHeader`. Empty disables the trace screens. |
| `aiFoundryBe.config.prometheusBaseUrl` | string | `""` | Prometheus-compatible metrics API (Prometheus, or Mimir with its `/prometheus` prefix). Empty disables the metrics screens. |
| `aiFoundryBe.config.litellmBaseUrl` | string | `""` | Admin API of the LiteLLM gateway of AI Services (e.g. `https://<ai-services host>/litellm/`), used for the model providers, the model catalogue, the spend screens and the gateway identity of each person. Empty makes these routes answer `503`. Requires `secrets.aiFoundryBeKeys.litellmAdminKey`, `authorizationServer.issuer` and `apiGateway.authorizationServer.audiences`. |

## aiFoundryWorkflows

The Agentic Workflows engine: a REST API and a Temporal worker. Temporal is provided by AI Services.

| Key | Type | Default | Description |
|---|---|---|---|
| `aiFoundryWorkflows.enabled` | boolean | `true` | Deploy the workflows engine. Set to `false` to skip the feature. |
| `aiFoundryWorkflows.config.temporalAddress` | string | `""` | `host:port` of the Temporal gRPC frontend of AI Services (e.g. `temporal-frontend.<ai-services namespace>.svc.cluster.local:7233`). Empty makes every workflow route answer `503`. |
| `aiFoundryWorkflows.config.temporalNamespace` | string | `""` | **Required** while enabled: a Temporal namespace (not a Kubernetes one) declared in `temporal.namespaces` of the AI Services values. |
| `aiFoundryWorkflows.config.temporalTaskQueue` | string | `"agentic-workflows"` | Default Temporal task queue. |
| `aiFoundryWorkflows.config.adkBaseUrl` | string | `""` | Runtime that runs `agent` steps. Empty defaults to this release's `adkBeApp`; with `adkBeApp` disabled it is required, otherwise the chart refuses to render. |
| `aiFoundryWorkflows.config.httpAllowPrivate` | boolean | `false` | Whether an `http` step may reach a private address. Must stay `false`: the chart refuses to render with `true`, because the URL of such a step is chosen by whoever can edit a workflow. |
| `aiFoundryWorkflows.config.workspaceBaseUrl` | string | `""` | Workspace service used by the workflow runs. Empty defaults to this release's `workspaceService`. |
| `aiFoundryWorkflows.config.aiServicesBaseUrl` | string | `""` | Public URL of AI Services, used only for the runner-flavour lookup when the workspace service runs in another release. Requires `authtoolBffUrl` and `aiServicesClientId`, `workspaceService.enabled: false` and a `workspaceBaseUrl`: the chart refuses to render otherwise. Leave empty when `workspaceService` runs in this release. |

The database credential is in `secrets.aiFoundryWorkflowsKeys`.

## aiFoundryMcp

MCP server over the Catalog and Agentic Workflows, served at `{url}/foundry/mcp`. Enabled by default, with no required configuration.

| Key | Type | Default | Description |
|---|---|---|---|
| `aiFoundryMcp.enabled` | boolean | `true` | Deploy the MCP server. |
| `aiFoundryMcp.config.gatewayBaseUrl` | string | `""` | AI Foundry edge the server calls. Empty defaults to the in-cluster `api-gateway` Service. |

## aiFoundryProvisioner

A `post-install`/`post-upgrade` hook Job that seeds and migrates the AI Foundry resources of every tenant. The release fails if the Job fails. It needs the `ai-foundry-be` database credential. When `catalogUrl` is set it also needs the `ai-foundry-provisioner` Keycloak client (created by the [Realm Management chart](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/15_getting-started.md) `0.1.47` or later with `products.aiFoundry: true`), its credential in `secrets.aiFoundryProvisionerKeys`, `authzUrl` and `authorizationServer.issuer`.

| Key | Type | Default | Description |
|---|---|---|---|
| `aiFoundryProvisioner.enabled` | boolean | `true` | Run the hook Job. Set to `false` to skip it. |
| `aiFoundryProvisioner.dryRun` | boolean | `false` | Report what would change without writing. Recommended for the first run. |
| `aiFoundryProvisioner.clientId` | string | `""` | Client ID of the `ai-foundry-provisioner` service account. Required when `catalogUrl` is set. |
| `aiFoundryProvisioner.keyId` | string | `""` | `kid` of the client key, when it has one. |
| `aiFoundryProvisioner.serve.enabled` | boolean | `false` | Run the workload that publishes the client public key at `/.well-known/ai-foundry-provisioner/jwks.json`. Required with a private key, unless `keyPublishedExternally` is `true`. |
| `aiFoundryProvisioner.keyPublishedExternally` | boolean | `false` | Set when the public key is registered directly in Keycloak instead of fetched from the JWKS URL. |

## aiFoundryWebsite

The AI Foundry frontend application. The `config.links` section configures the documentation links shown in the integration pages. The links to the other Mia Platform products (Homepage, Catalog, Console, Flow) are not set here: the website reads them from the product configuration of the organization, served by Homepage & RBAC. The schema still accepts `catalogHref`, `consoleHref`, `homepageHref`, `miaFlowHref`, `dataFabricHref`, `p4samdHref`, `claudeCodeHref`, `githubCopilotHref` and `miaDocsHref`, but the website does not read them.

| Key | Type | Default | Description |
|---|---|---|---|
| `aiFoundryWebsite.config.enabled` | boolean | `true` | Enable the runtime configuration injection. |
| `aiFoundryWebsite.config.links.claudeCodeDocsHref` | string |  | URL of the Claude Code plugin discovery docs. |
| `aiFoundryWebsite.config.links.claudeCodeSkillsDocsHref` | string |  | URL of the Claude Code skills docs. |
| `aiFoundryWebsite.config.links.claudeCodeTracesDocsHref` | string |  | URL of the Claude Code traces/monitoring docs. |
| `aiFoundryWebsite.config.links.githubCopilotCustomInstructionsHref` | string |  | URL of the GitHub Copilot custom instructions docs. |
| `aiFoundryWebsite.config.links.vscodeDocsHref` | string |  | URL of the VS Code agent customization docs. |
| `aiFoundryWebsite.config.links.vscodeMonitoringDocsHref` | string |  | URL of the VS Code agent monitoring docs. |
| `aiFoundryWebsite.config.links.kiroDocsHref` | string |  | URL of the Kiro IDE docs. |
| `aiFoundryWebsite.config.links.jetbrainsDocsHref` | string |  | URL of the JetBrains IDE docs. |
| `aiFoundryWebsite.config.links.jetbrainsTracesDocsHref` | string |  | URL of the JetBrains traces/monitoring docs. |
| `aiFoundryWebsite.config.oauth.scopes` | string |  | OAuth scopes requested by the git credential helper setup shown in the integration pages. When unset, derived from `isPaaS`: `openid offline_access` on-premises, `openid offline_access organization:*` on PaaS. Set it explicitly only for a realm that needs different scopes. |
| `aiFoundryWebsite.config.otelServices` | array | `["copilot-chat","claude-code","mia-ai-foundry","litellm","mia-flow","adk-be-app"]` | List of service names displayed in the OTEL traces view. |
| `aiFoundryWebsite.env.BASE_PATH` | string | `"/website/"` | Base path at which the website is served. |

## apiGateway

The Envoy API gateway. Validates JWTs and routes traffic to backend services.

| Key | Type | Default | Description |
|---|---|---|---|
| `apiGateway.logLevel` | string | `"info"` | Envoy log level (`debug`, `info`, `warn`, `error`). |
| `apiGateway.authorizationServer.name` | string | `""` | Name of the OIDC authorization server cluster in Envoy's configuration (used for JWKS resolution). |
| `apiGateway.authorizationServer.audiences` | array | `["ai-foundry-api"]` | Expected JWT audiences. Tokens not containing at least one of these audiences are rejected. |
| `apiGateway.maxBodyBytes` | integer | `10485760` | Maximum allowed request body size in bytes (default: 10 MiB). |
| `apiGateway.docling.url` | string | `""` | Docling route of AI Services (e.g. `https://<ai-services host>/api/docling/`). The gateway routes `/api/docling/` there, exchanging the caller's token through `aiServicesClientId`. Empty leaves the route absent. |
| `apiGateway.docling.maxBodyBytes` | integer | `33554432` | Maximum request body size in bytes on the Docling route. |

## authtoolBff

The OIDC Backend-for-Frontend. Manages session lifecycle and the PKCE login/logout flow. Configures four OIDC clients: `website` (browser login/logout), `exchangeCatalog` (token exchange for the Catalog API, aliased `catalog-api`), `exchangeAuthz` (token exchange for the Authz API, aliased `authz-api`), and `exchangeAiServices` (token exchange for AI Services, aliased `ai-services-api`). Set a client to `null` to remove it; if you do not use AI Services, set `authtoolBff.config.clients.exchangeAiServices: null` and leave `aiServicesClientId` empty.

| Key | Type | Default | Description |
|---|---|---|---|
| `authtoolBff.config.clients.website.clientId` | string | `"ai-foundry-website-bff"` | OIDC client ID registered in Keycloak for the browser login/logout flow. |
| `authtoolBff.config.clients.website.tokenAuthMethod` | string | `"private_key_jwt"` | Token endpoint authentication method for the website client. Options: `private_key_jwt`, `client_secret_post`, `client_secret_basic`. |
| `authtoolBff.config.clients.exchangeCatalog.clientId` | string | `"ai-foundry-token-exchange"` | OIDC client ID used for the Catalog token-exchange grant. |
| `authtoolBff.config.clients.exchangeCatalog.clientAlias` | string | `"catalog-api"` | Alias under which the exchanged Catalog token is issued. |
| `authtoolBff.config.clients.exchangeCatalog.tokenAuthMethod` | string | `"private_key_jwt"` | Token endpoint authentication method for the Catalog exchange client. |
| `authtoolBff.config.clients.exchangeAuthz.clientId` | string | `"ai-foundry-token-exchange"` | OIDC client ID used for the Authz token-exchange grant. |
| `authtoolBff.config.clients.exchangeAuthz.clientAlias` | string | `"authz-api"` | Alias under which the exchanged Authz token is issued. |
| `authtoolBff.config.clients.exchangeAuthz.tokenAuthMethod` | string | `"private_key_jwt"` | Token endpoint authentication method for the Authz exchange client. |
| `authtoolBff.config.clients.exchangeAiServices.clientId` | string | `"ai-foundry-token-exchange"` | OIDC client ID used for the AI Services token-exchange grant. |
| `authtoolBff.config.clients.exchangeAiServices.clientAlias` | string | `"ai-services-api"` | Alias under which the exchanged AI Services token is issued. |
| `authtoolBff.config.clients.exchangeAiServices.tokenAuthMethod` | string | `"private_key_jwt"` | Token endpoint authentication method for the AI Services exchange client. |
| `authtoolBff.config.disableAccessTokenEncryption` | boolean | `false` | Disable encryption of the access token stored in Redis. Leave `false` unless required for debugging. |
| `authtoolBff.config.userClaims` | array | `["name","email","sub"]` | Additional JWT claims to propagate as user context within the session. |
| `authtoolBff.config.authorizationCache` | object | `{}` | Pass-through cache connection config, used when `cache.enabled: false`. |

## cache

Redis instance used by `authtoolBff` to store encrypted session tokens.

| Key | Type | Default | Description |
|---|---|---|---|
| `cache.config.maxMemory` | string | `"192mb"` | Maximum memory allocated to Redis. When reached, Redis evicts keys using the `allkeys-lru` policy. |

## redis

Shared application Redis of the AI Foundry services, used as a cache (persistence is off). Enabled by default.

| Key | Type | Default | Description |
|---|---|---|---|
| `redis.enabled` | boolean | `true` | Deploy the shared Redis. |
| `redis.config.maxMemory` | string | `"128mb"` | Maximum memory allocated to Redis. |

## secretStoreService

Credential store in front of OpenBao, holding the credentials configured in AI Foundry. Enabled by default.

| Key | Type | Default | Description |
|---|---|---|---|
| `secretStoreService.enabled` | boolean | `true` | Deploy the secret store service. |
| `secretStoreService.config.storeAddr` | string | `""` | **Required** while enabled: address of OpenBao (e.g. `https://openbao.your-domain.com`). |
| `secretStoreService.config.auth.method` | string | `"approle"` | `approle` uses the pair in `secrets.secretStoreServiceKeys`; `jwt` logs in with the pod ServiceAccount and needs a store whose JWT mount trusts the cluster OIDC issuer. |
| `secretStoreService.config.auth.jwt.role` | string | `""` | Store role bound to this namespace's ServiceAccount. Required with `auth.method: jwt`. |

## workspaceService

Ephemeral filesystem shared by the steps of a workflow run: a control plane plus one runner pod per workspace. Enabled by default; its database credential is in `secrets.workspaceServiceKeys`.

| Key | Type | Default | Description |
|---|---|---|---|
| `workspaceService.enabled` | boolean | `true` | Deploy the workspace service. Set to `false` to skip the feature. |
| `workspaceService.config.runnerBackend` | string | `"kubernetes"` | Runner backend. Must be `kubernetes` in a cluster. |
| `workspaceService.config.runnerNamespace` | string | `""` | Namespace where runner pods are created. Empty means the release namespace; another namespace must exist before install. |
| `workspaceService.config.allowArbitraryCommands` | boolean | `false` | Let runners execute commands from the cloned repository. Requires `runnerNodeSelector` or `runnerRuntimeClassName`. |
