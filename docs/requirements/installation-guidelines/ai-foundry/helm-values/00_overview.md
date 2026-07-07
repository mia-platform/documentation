---
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
| `catalogUrl` | string | `""` | ❌ | Full URL of the Mia Platform Catalog instance the ADK backend connects to. |
| `catalogCluster` | string | `""` | ❌ | Cluster alias of the Catalog instance (e.g. `console`, `console-noprod`). Used to resolve cross-cluster references. |

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

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.authtoolBffKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `authtool-bff-keys` from the values below. |
| `secrets.authtoolBffKeys.privateKey` | string | `""` | RSA private key in PEM format, base64 encoded. Required when `authtoolBff.tokenAuthMethod` is `private_key_jwt`. |
| `secrets.authtoolBffKeys.cookieSecret` | string | `""` | Secret used to sign and encrypt session cookies (hex, 64 bytes recommended). |
| `secrets.authtoolBffKeys.tokenEncKey` | string | `""` | Key used to encrypt token data stored in Redis (hex, 32 bytes recommended). |
| `secrets.authtoolBffKeys.clientSecret` | string | `""` | OIDC client secret. Required when `authtoolBff.tokenAuthMethod` is `client_secret_post` or `client_secret_basic`. |

:::tip Key generation
```bash
ssh-keygen -t rsa -b 4096 -m PEM -f private.key -N "" > /dev/null
privateKey=$(base64 < private.key); rm private.key private.key.pub
cookieSecret=$(openssl rand -hex 64)
tokenEncKey=$(openssl rand -hex 32)
```
:::

### adk-be-app keys

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.adkBeAppKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `adk-be-app-keys` from the values below. |
| `secrets.adkBeAppKeys.googleApplicationCredentials` | string | `""` | Full JSON content of the GCP service account key file (not base64 encoded; the chart handles encoding). |
| `secrets.adkBeAppKeys.postgresConnectionString` | string | `""` | PostgreSQL connection string used by the ADK backend (e.g. `postgresql://user:pass@host:5432/dbname`). |
| `secrets.adkBeAppKeys.gcpServiceAccount` | string | `""` | GCP service account email, used for Workload Identity Federation when running on GKE. |
| `secrets.adkBeAppKeys.otelExporterOtlpHeaders` | string | `""` | OTLP authentication headers for the ADK backend (e.g. `Authorization=Bearer <token>`). |

### ai-foundry-bff keys

These credentials are not yet managed inline by the chart and must be provided as an external Secret named `ai-foundry-bff-keys`.

| Key | Type | Description |
|---|---|---|
| `secrets.aiFoundryBffKeys.tempoAuthHeader` | string | Bearer token for authenticating to the Tempo backend (e.g. `Bearer <token>`). |
| `secrets.aiFoundryBffKeys.postgresPassword` | string | Password for the PostgreSQL user used by `aiFoundryBff`. |
| `secrets.aiFoundryBffKeys.otelExporterOtlpHeaders` | string | OTLP authentication headers for `aiFoundryBff`. |

## Global image settings

| Key | Type | Default | Description |
|---|---|---|---|
| `global.imagePullSecrets` | array | `[]` | List of image pull secret names applied to all pods. |
| `global.imageCredentials.registry` | string | `""` | Container registry hostname. |
| `global.labels` | object | `{}` | Additional labels added to all resources. |
| `global.annotations` | object | `{}` | Additional annotations added to all resources. |

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

## adkBeApp

The ADK Backend App orchestrates AI agents using Google Cloud ADK and Vertex AI.

| Key | Type | Default | Description |
|---|---|---|---|
| `adkBeApp.config.googleCloudProject` | string | `""` | GCP project ID where Vertex AI agents are deployed. |
| `adkBeApp.config.googleCloudLocation` | string | `""` | GCP region (e.g. `europe-west1`). |
| `adkBeApp.config.googleGenaiUseVertexai` | boolean | `false` | Set to `true` to use Vertex AI as the GenAI backend. When `false`, the Google AI Studio API is used. |
| `adkBeApp.config.agentReloadInterval` | string | `"300"` | Interval in seconds at which the ADK backend reloads agent definitions. |

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
| `aiFoundryWebsite.config.links.githubCopilotHref` | string |  | URL of GitHub Copilot. |
| `aiFoundryWebsite.config.links.miaDocsHref` | string |  | URL of the Mia Platform documentation. |
| `aiFoundryWebsite.config.links.vscodeDocsHref` | string |  | URL of the VS Code agent customization docs. |
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

The OIDC Backend-for-Frontend. Manages session lifecycle and the PKCE login/logout flow.

| Key | Type | Default | Description |
|---|---|---|---|
| `authtoolBff.tokenAuthMethod` | string | `"private_key_jwt"` | Authentication method for the primary OIDC client. Options: `private_key_jwt`, `client_secret_post`, `client_secret_basic`. |
| `authtoolBff.exchangeTokenAuthMethod` | string | `"private_key_jwt"` | Authentication method for the token exchange client (used to obtain tokens for the Catalog API). |
| `authtoolBff.credentialsName` | string | `""` | Override the Kubernetes Secret name for the primary client credentials. |
| `authtoolBff.exchangeCredentialsName` | string | `""` | Override the Kubernetes Secret name for the exchange client credentials. |
| `authtoolBff.config.clientId` | string | `""` | OIDC client ID registered in Keycloak for `authtool-bff`. |
| `authtoolBff.config.exchangeClientId` | string | `""` | OIDC client ID registered in Keycloak for the token exchange flow (e.g. `catalog-api`). |
| `authtoolBff.config.exchangeClientAlias` | string | `"catalog-api"` | Alias used internally to reference the token exchange client. |
| `authtoolBff.config.baseUrl` | string | `""` | Override the base URL used by `authtool-bff` for OIDC redirect URIs. Defaults to `url` when empty. |

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

This page is a placeholder for AI Foundry Helm values documentation.
