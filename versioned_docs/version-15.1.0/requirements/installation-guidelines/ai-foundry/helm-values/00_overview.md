---
id: overview
title: Helm Values Overview
sidebar_label: Overview
---

# Helm Values: ai-foundry chart

This page describes all configurable values for the `ai-foundry` chart. See `values.yaml` for defaults.

## URL and environment

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `url` | string | `""` | ✅ | Full public URL where AI Foundry is exposed (e.g. `https://ai-foundry.your-domain.com`). Used to configure OIDC redirect URIs, CORS, and routing. |
| `environment` | string | `""` | ✅ | Logical environment name (e.g. `production`, `development`). Used for labelling and environment-specific behaviour. |
| `isPaaS` | boolean | `false` | ❌ | Set to `true` for Mia Platform PaaS deployments. |
| `catalogUrl` | string | `""` | ❌ | Full URL of the Mia Platform Catalog instance. Used by `aiFoundryBff` (and, via the ADK backend, `adkBeApp`) to call the Catalog API using a token-exchange client. |
| `catalogClientId` | string | `""` | ❌ | OIDC client ID used to identify the Catalog API audience for the token-exchange flow (e.g. `catalog-api`). |
| `authzUrl` | string | `""` | ❌ | URL of an external Authorization API (e.g. the `services` chart's `apiGateway`, routed to `rbacManagement`). Used by `aiFoundryBff` and, when `accessControl.config.externalContext.enabled: true`, by `accessControl` itself. |
| `authzClientId` | string | `""` | ❌ | OIDC client ID used to identify the Authz API audience for the token-exchange flow (e.g. `authz-api`). |
| `authtoolBffUrl` | string | `""` | ❌ | Base URL of `authtool-bff`, used to route token-exchange calls through it for cross-cluster calls. Leave empty to forward the caller's JWT verbatim to `authzUrl`/`catalogUrl` instead (same-cluster pass-through mode). |

## IngressRoute (Traefik)

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `ingressRoute.enabled` | boolean | `false` | ❌ | Create a Traefik `IngressRoute` resource. |
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

`authtool-bff` runs three OIDC clients: `website` (browser login/logout), `exchangeCatalog` (token exchange for the Catalog API), and `exchangeAuthz` (token exchange for the Authz API). Each has its own key material.

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
| `secrets.adkBeAppKeys.googleApplicationCredentials` | string | `""` | Full JSON content of the GCP service account key file (not base64 encoded; the chart handles encoding). |
| `secrets.adkBeAppKeys.postgresConnectionString` | string | `""` | PostgreSQL connection string used by the ADK backend (e.g. `postgresql://user:pass@host:5432/dbname`). |
| `secrets.adkBeAppKeys.otelExporterOtlpHeaders` | string | `""` | OTLP authentication headers for the ADK backend (e.g. `Authorization=Bearer <token>`). |
| `secrets.adkBeAppKeys.tempoAuthHeader` | string | `""` | Bearer token for `adkBeApp` to send traces directly to Tempo (used when `adkBeApp.config.tempoBaseUrl` is set). |

### ai-foundry-bff keys

Unlike the other secrets above, this Secret is **always created by the chart** whenever `aiFoundryBff.enabled: true` — there is no `enabled` gate.

| Key | Type | Description |
|---|---|---|
| `secrets.aiFoundryBffKeys.tempoAuthHeader` | string | Bearer token for authenticating to the Tempo backend (e.g. `Bearer <token>`). |

## Global image settings

| Key | Type | Default | Description |
|---|---|---|---|
| `global.labels` | object | `{}` | Additional labels added to all resources. |
| `global.annotations` | object | `{}` | Additional annotations added to all resources. |
| `global.imagePullSecret.enabled` | boolean | `false` | When `true`, the chart creates a `kubernetes.io/dockerconfigjson` Secret from `global.imageCredentials` and references it on every pod. |
| `global.imagePullSecret.name` | string | `""` | Name of the image pull secret. Must match an existing Secret when `enabled: false`, or is created by the chart when `enabled: true`. |
| `global.imageCredentials.registry` | string | `""` | Container registry hostname. Also used as the fallback registry for any microservice image that does not set its own `image.registry`. |
| `global.imageCredentials.username` | string | `""` | Registry username. Typically injected at deploy time via `--set` rather than committed to a values file. |
| `global.imageCredentials.password` | string | `""` | Registry password/token. Typically injected at deploy time via `--set`. |
| `global.imageCredentials.email` | string | `""` | Email associated with the registry credentials (required by the `dockerconfigjson` format). |

## Service accounts

Each microservice gets its own dedicated `ServiceAccount`, created by default. Applies to: `accessControl`, `adkBeApp`, `aiFoundryBff`, `aiFoundryWebsite`, `apiGateway`, `authtoolBff`, `cache`, `doclingService`.

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
| `accessControl.config.externalContext.authorization.credentialsName` | string | `""` | Optional override for the credentials file name mounted from `secrets.accessControlKeys`. |

## adkBeApp

The ADK Backend App orchestrates AI agents using Google Cloud ADK and Vertex AI.

| Key | Type | Default | Description |
|---|---|---|---|
| `adkBeApp.config.googleCloudProject` | string | `""` | GCP project ID where Vertex AI agents are deployed. |
| `adkBeApp.config.googleCloudLocation` | string | `""` | GCP region (e.g. `europe-west1`). |
| `adkBeApp.config.googleGenaiUseVertexai` | boolean | `false` | Set to `true` to use Vertex AI as the GenAI backend. When `false`, the Google AI Studio API is used. |
| `adkBeApp.config.agentReloadInterval` | string | `"300"` | Interval in seconds at which the ADK backend reloads agent definitions. |
| `adkBeApp.config.tempoBaseUrl` | string | `""` | Base URL of a Tempo instance for `adkBeApp` to ship traces to directly, authenticated via `secrets.adkBeAppKeys.tempoAuthHeader`. |
| `adkBeApp.config.foundryIntrospectionTools` | boolean | `false` | Enable introspection tools that expose AI Foundry's own agent/tool definitions to agents. |
| `adkBeApp.config.allowPrivateNetworkMcp` | boolean | `false` | Allow the ADK backend to reach MCP servers on private/internal network addresses. |

## aiFoundryBff

The AI Foundry BFF provides the backend API to the website and collects agent traces in Tempo.

| Key | Type | Default | Description |
|---|---|---|---|
| `aiFoundryBff.config.tempoBaseUrl` | string | `""` | Base URL of the Tempo instance used for agent trace queries (e.g. `https://tempo.your-domain.com`). |
| `aiFoundryBff.config.tempoAllowedServices` | string | `"copilot-chat,claude-code,mia-ai-foundry,mia-flow"` | Comma-separated list of service names whose traces are surfaced in the AI Foundry UI. |

## aiFoundryWebsite

The AI Foundry frontend application. The `config.links` section configures all cross-product navigation links displayed in the UI.

| Key | Type | Default | Description |
|---|---|---|---|
| `aiFoundryWebsite.config.enabled` | boolean | `true` | Enable the runtime configuration injection. |
| `aiFoundryWebsite.config.links.catalogHref` | string |  | URL of the Mia Platform Catalog website. |
| `aiFoundryWebsite.config.links.miaFlowHref` | string |  | URL of the Mia Flow application. |
| `aiFoundryWebsite.config.links.consoleHref` | string |  | URL of the Mia Platform Console. |
| `aiFoundryWebsite.config.links.dataFabricHref` | string |  | URL of the Data Fabric control plane. |
| `aiFoundryWebsite.config.links.homepageHref` | string |  | URL of the Mia Platform homepage (deployed by the `services` chart). |
| `aiFoundryWebsite.config.links.p4samdHref` | string |  | URL of the p4samd platform. |
| `aiFoundryWebsite.config.links.claudeCodeHref` | string |  | URL of Claude Code. |
| `aiFoundryWebsite.config.links.claudeCodeDocsHref` | string |  | URL of the Claude Code plugin discovery docs. |
| `aiFoundryWebsite.config.links.claudeCodeSkillsDocsHref` | string |  | URL of the Claude Code skills docs. |
| `aiFoundryWebsite.config.links.claudeCodeTracesDocsHref` | string |  | URL of the Claude Code traces/monitoring docs. |
| `aiFoundryWebsite.config.links.githubCopilotHref` | string |  | URL of GitHub Copilot. |
| `aiFoundryWebsite.config.links.githubCopilotCustomInstructionsHref` | string |  | URL of the GitHub Copilot custom instructions docs. |
| `aiFoundryWebsite.config.links.miaDocsHref` | string |  | URL of the Mia Platform documentation. |
| `aiFoundryWebsite.config.links.vscodeDocsHref` | string |  | URL of the VS Code agent customization docs. |
| `aiFoundryWebsite.config.links.vscodeMonitoringDocsHref` | string |  | URL of the VS Code agent monitoring docs. |
| `aiFoundryWebsite.config.links.kiroDocsHref` | string |  | URL of the Kiro IDE docs. |
| `aiFoundryWebsite.config.otelServices` | array | `["copilot-chat","claude-code","mia-ai-foundry","mia-flow"]` | List of service names displayed in the OTEL traces view. |
| `aiFoundryWebsite.env.BASE_PATH` | string | `"/website/"` | Base path at which the website is served. |

## apiGateway

The Envoy API gateway. Validates JWTs and routes traffic to backend services.

| Key | Type | Default | Description |
|---|---|---|---|
| `apiGateway.logLevel` | string | `"info"` | Envoy log level (`debug`, `info`, `warn`, `error`). |
| `apiGateway.authorizationServer.name` | string | `""` | Name of the OIDC authorization server cluster in Envoy's configuration (used for JWKS resolution). |
| `apiGateway.authorizationServer.audiences` | array | `["ai-foundry-api"]` | Expected JWT audiences. Tokens not containing at least one of these audiences are rejected. |
| `apiGateway.maxBodyBytes` | integer | `10485760` | Maximum allowed request body size in bytes (default: 10 MiB). |

## authtoolBff

The OIDC Backend-for-Frontend. Manages session lifecycle and the PKCE login/logout flow. Configures three OIDC clients: `website` (browser login/logout), `exchangeCatalog` (token exchange for the Catalog API, aliased `catalog-api`), and `exchangeAuthz` (token exchange for the Authz API, aliased `authz-api`).

| Key | Type | Default | Description |
|---|---|---|---|
| `authtoolBff.config.clients.website.clientId` | string | `"ai-foundry-website-bff"` | OIDC client ID registered in Keycloak for the browser login/logout flow. |
| `authtoolBff.config.clients.website.tokenAuthMethod` | string | `"private_key_jwt"` | Token endpoint authentication method for the website client. Options: `private_key_jwt`, `client_secret_post`, `client_secret_basic`. |
| `authtoolBff.config.clients.website.credentialsName` | string | `""` | Optional override for the credentials file name mounted from `secrets.authtoolBffKeys.website`. |
| `authtoolBff.config.clients.exchangeCatalog.clientId` | string | `"ai-foundry-token-exchange"` | OIDC client ID used for the Catalog token-exchange grant. |
| `authtoolBff.config.clients.exchangeCatalog.clientAlias` | string | `"catalog-api"` | Alias under which the exchanged Catalog token is issued. |
| `authtoolBff.config.clients.exchangeCatalog.tokenAuthMethod` | string | `"private_key_jwt"` | Token endpoint authentication method for the Catalog exchange client. |
| `authtoolBff.config.clients.exchangeAuthz.clientId` | string | `"ai-foundry-token-exchange"` | OIDC client ID used for the Authz token-exchange grant. |
| `authtoolBff.config.clients.exchangeAuthz.clientAlias` | string | `"authz-api"` | Alias under which the exchanged Authz token is issued. |
| `authtoolBff.config.clients.exchangeAuthz.tokenAuthMethod` | string | `"private_key_jwt"` | Token endpoint authentication method for the Authz exchange client. |
| `authtoolBff.config.disableAccessTokenEncryption` | boolean | `false` | Disable encryption of the access token stored in Redis. Leave `false` unless required for debugging. |
| `authtoolBff.config.userClaims` | array | `[]` | Additional JWT claims to propagate as user context within the session. |
| `authtoolBff.config.authorizationCache` | object | `{}` | Pass-through cache connection config, used when `cache.enabled: false`. |

## cache

Redis instance used by `authtoolBff` to store encrypted session tokens.

| Key | Type | Default | Description |
|---|---|---|---|
| `cache.config.maxMemory` | string | `"192mb"` | Maximum memory allocated to Redis. When reached, Redis evicts keys using the `allkeys-lru` policy. |

## doclingService

The Docling document conversion service. It parses uploaded documents (PDF, DOCX, etc.) for use as AI agent context.

:::caution Resource requirements
`doclingService` is CPU-intensive (requests: 500m CPU / 1 GiB memory; limits: 1000m CPU / 2 GiB memory). It is disabled by default in lightweight environments (`preproduction`, `experimental`). Enable it only when document parsing is required.
:::

| Key | Type | Default | Description |
|---|---|---|---|
| `doclingService.enabled` | boolean | `true` | Enable or disable the Docling service. Set to `false` to reduce resource consumption when document ingestion is not needed. |
