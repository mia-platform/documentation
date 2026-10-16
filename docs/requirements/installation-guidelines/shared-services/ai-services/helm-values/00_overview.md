---
id: overview
title: Helm Values Overview
sidebar_label: Overview
---

# Helm Values: ai-services chart

This page describes all configurable values for the `ai-services` chart. See `values.yaml` for defaults. The chart does not ship a `values.schema.json`: invalid combinations are rejected at render time by the chart's validation template.

:::info
Langfuse, OpenBao, the OpenTelemetry Collector and Prometheus are not covered by this reference. We are working to provide the documentation to install these components as well.
:::

## URL and environment

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `url` | string | `""` | ✅ | Full public URL of AI Services (e.g. `https://ai-services.your-domain.com`). Used as the Envoy virtual host, as the `IngressRoute` host, as LiteLLM's base URL (`<url><litellmProxy.basePath>`), as the base of the Temporal UI callback URL and of the Memory MCP resource. Must match the AI Services URL configured in the Keycloak realm, which fetches `<url>/.well-known/jwks.json`. |
| `isPaaS` | boolean | `false` | ❌ | Set to `true` for Mia Platform PaaS deployments. Adds the `organization:*` scope to the scopes advertised by the Memory MCP protected-resource metadata. |
| `namespacePrefix` | string | not set | ❌ | Optional prefix prepended as `<namespacePrefix>-<name>` to the names of the component resources (including their `<component>-keys` Secrets), to the image pull secret name, to the `IngressRoute` name and to `ingressRoute.tls.secretName`. Not present in the default `values.yaml`. |
| `nameOverride` | string | `""` | ❌ | Overrides the chart name. |
| `fullnameOverride` | string | `""` | ❌ | Overrides the fully qualified app name. |

## Authorization server and authorization service

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `authorizationServer.enabled` | boolean | `false` | ✅ | Enables JWT validation (`jwt_authn`) on the API gateway. Must be `true` whenever `accessControl`, `doclingService`, `memoryService` or `secretStoreService` is enabled. |
| `authorizationServer.issuer` | string | `""` | ✅ | Keycloak realm issuer URL (e.g. `https://keycloak.your-domain.com/realms/my-realm`). Used by the API gateway for JWT validation, by `accessControl` for its client authentication and, unless `temporalUi.auth.providerUrl` is set, by the Temporal UI login. |
| `rbacAuthzServiceUrl` | string | `""` | ❌ | gRPC URL of the platform authorization service that `accessControl` resolves the caller's external context against. Takes precedence over `authzUrl`. One of the two is required when `accessControl.config.externalContext.enabled` is `true`. |
| `authzUrl` | string | `""` | ❌ | HTTP URL of the same authorization service. Used when `rbacAuthzServiceUrl` is empty. |

## Telemetry

| Key | Type | Default | Description |
|---|---|---|---|
| `telemetry.enabled` | boolean | `false` | Enable OpenTelemetry export for the services that support it. When `true`, an OTLP endpoint must resolve for `litellmProxy` (see `litellmProxy.telemetry.otlpEndpoint`). |
| `telemetry.apiGatewayTracing` | boolean | `false` | Let Envoy open a span of its own for every request. Off by default even with `telemetry.enabled`: Envoy then forwards the caller's `traceparent` unchanged. Turn it on only where Envoy's spans reach a backend that keeps them. |
| `telemetry.otelExporterOtlpEndpoint` | string | `""` | OTLP endpoint for all signals. Also the last fallback for LiteLLM Proxy's telemetry. |
| `telemetry.otelExporterOtlpTracesEndpoint` | string | `""` | OTLP endpoint for traces only. Overrides the general endpoint for traces. |
| `telemetry.otelExporterOtlpProtocol` | string | `""` | OTLP protocol (`OTEL_EXPORTER_OTLP_PROTOCOL`). Also used to derive LiteLLM's exporter when `litellmProxy.telemetry.otlpExporter` is empty. |

## IngressRoute (Traefik)

| Key | Type | Default | Description |
|---|---|---|---|
| `ingressRoute.enabled` | boolean | `false` | Create a Traefik `IngressRoute` that matches `Host(<url hostname>)` and points at the API gateway Service on port `8080`. |
| `ingressRoute.name` | string | `"default-ingress"` | Name of the `IngressRoute` resource. Not present in the default `values.yaml`. |
| `ingressRoute.entryPoints` | array | `["websecure"]` | Traefik entry points to attach the route to. |
| `ingressRoute.middlewares` | array | `[]` | Additional Traefik middleware references. |
| `ingressRoute.tlsEnabled` | boolean | `false` | Add a `tls` block to the `IngressRoute`. |
| `ingressRoute.tls` | object | `{}` | Content of the `tls` block. `ingressRoute.tls.secretName` is prefixed with `namespacePrefix` when set. |
| `ingressRoute.host` | string | `""` | Not read by the chart templates: the host is always derived from `url`. |

## Secrets

The chart can manage secret creation inline. When `enabled: false` (default), the Secret must exist in the namespace before install whenever the component that reads it is enabled; the chart checks for it at render time.

### access-control keys

Used when `accessControl.enabled`, `accessControl.config.externalContext.enabled` and `accessControl.config.externalContext.authorization.enabled` are `true`.

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.accessControlKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `access-control-keys`. |
| `secrets.accessControlKeys.privateKey` | string | `""` | PEM private key of the `accessControl` OIDC client, stored as `key.pem`. Required when `tokenAuthMethod` is `private_key_jwt`. |
| `secrets.accessControlKeys.clientSecret` | string | `""` | Client secret of the `accessControl` OIDC client, stored as `client-secret`. Required when `tokenAuthMethod` is `client_secret_post` or `client_secret_basic`. |

### litellm-proxy keys

Required when `litellmProxy.enabled` is `true` (default).

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.litellmProxyKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `litellm-proxy-keys`. |
| `secrets.litellmProxyKeys.postgresConnectionString` | string | `""` | Connection string of the external PostgreSQL database that holds LiteLLM's state (virtual keys, spend, models). Stored as `postgresConnectionString`. |
| `secrets.litellmProxyKeys.masterKey` | string | `""` | Admin key that mints every other virtual key. Stored as `masterKey`. The LiteLLM admin API is public on the API gateway, so this key is its only protection. |
| `secrets.litellmProxyKeys.saltKey` | string | `""` | Encrypts the provider credentials stored by LiteLLM. Stored as `saltKey`. Never rotate it once models are registered. |
| `secrets.litellmProxyKeys.providerCredentials` | object | `{}` | Provider API keys, as `<ENV_VAR_NAME>: <value>`. Each entry is added to the Secret and injected as an environment variable of the LiteLLM pod, to be referenced from `litellmProxy.config.model_list` as `os.environ/<ENV_VAR_NAME>`. Injected only when the chart creates the Secret. |

### temporal keys

Required when `temporal.enabled` is `true` (default). One external PostgreSQL server backs both the default and visibility stores.

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.temporalKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `temporal-keys` (as a pre-install/pre-upgrade hook, so the schema Job can read it). |
| `secrets.temporalKeys.postgresHost` | string | `""` | PostgreSQL host. Stored as `postgresHost`. |
| `secrets.temporalKeys.postgresPort` | string | `"5432"` | PostgreSQL port. Stored as `postgresPort`. |
| `secrets.temporalKeys.postgresUser` | string | `""` | PostgreSQL user. Stored as `postgresUser`. |
| `secrets.temporalKeys.postgresPassword` | string | `""` | PostgreSQL password. Stored as `postgresPassword`. |

### temporal-ui keys

Required when `temporalUi.auth.enabled` is `true`.

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.temporalUiKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `temporal-ui-keys`. |
| `secrets.temporalUiKeys.authClientSecret` | string | `""` | Client secret of the confidential client used by the Temporal UI login. Stored as `authClientSecret`. |

### memory-service keys

Required when `memoryService.enabled` is `true`.

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.memoryServiceKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `memory-service-keys`. |
| `secrets.memoryServiceKeys.postgresConnectionString` | string | `""` | Connection string of a PostgreSQL database dedicated to the Memory service, with the `vector` extension available. Stored as `postgresConnectionString`. |
| `secrets.memoryServiceKeys.litellmApiKey` | string | `""` | LiteLLM virtual key, stored as `litellmApiKey`. Needed only when `memoryService.config.aiGateway.enabled` is `true`. |

### secret-store-service keys

Used by a `secretStoreService` deployed by this chart that logs in to an external store with an AppRole.

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.secretStoreServiceKeys.enabled` | boolean | `false` | When `true` and at least one of the two values is set, the chart creates a Secret named `secret-store-service-keys`. |
| `secrets.secretStoreServiceKeys.storeRoleId` | string | `""` | AppRole role ID. Stored as `storeRoleId`. |
| `secrets.secretStoreServiceKeys.storeSecretId` | string | `""` | AppRole secret ID. Stored as `storeSecretId`. |

## Global image settings

| Key | Type | Default | Description |
|---|---|---|---|
| `global.labels` | object | `{}` | Additional labels added to all resources. |
| `global.annotations` | object | `{}` | Additional annotations added to all resources. |
| `global.imagePullPolicy` | string | `"IfNotPresent"` | Default image pull policy, used when a component's `image.pullPolicy` is empty. |
| `global.imagePullSecret.enabled` | boolean | `false` | When `true`, every pod references the image pull secret named `global.imagePullSecret.name`. |
| `global.imagePullSecret.name` | string | `""` | Name of the image pull secret. The chart creates a `kubernetes.io/dockerconfigjson` Secret with this name when `global.imageCredentials.registry`, `.username`, `.password` and `.email` are all set. |
| `global.imageCredentials.registry` | string | `""` | Container registry hostname. Also used as the fallback registry for any image that does not set its own `image.registry`. |
| `global.imageCredentials.username` | string | `""` | Registry username. Typically injected at deploy time via `--set`. |
| `global.imageCredentials.password` | string | `""` | Registry password or token. Typically injected at deploy time via `--set`. |
| `global.imageCredentials.email` | string | `""` | Email associated with the registry credentials. |
| `global.imageCredentials.name` | string | `""` | Not read by the chart templates. |

## Service accounts

Each component gets its own dedicated `ServiceAccount`, created by default. Applies to: `accessControl`, `apiGateway`, `litellmProxy`, `temporalFrontend`, `temporalHistory`, `temporalMatching`, `temporalWorker`, `temporalAdminTools`, `temporalUi`, `temporalSchemaSetup`, `temporalNamespaceSetup`, `doclingService`, `memoryService`, `secretStoreService`.

| Key | Type | Default | Description |
|---|---|---|---|
| `serviceAccounts.<service>.enabled` | boolean | `true` | Create a ServiceAccount for `<service>`. `serviceAccounts.secretStoreService.enabled` must stay `true` when `secretStoreService.config.auth.method` is `jwt`. |

## Common component fields

The Deployment-based components (`apiGateway`, `accessControl`, `litellmProxy`, `doclingService`, `memoryService`, `secretStoreService`, `temporalUi`, and the Temporal roles `temporalFrontend`, `temporalHistory`, `temporalMatching`, `temporalWorker`) share the following fields. The Temporal roles take their image from `temporal.image`.

| Key | Type | Description |
|---|---|---|
| `<service>.enabled` | boolean | Enable or disable the component. The Temporal roles follow `temporal.enabled`. |
| `<service>.replicaCount` | integer | Number of pod replicas. |
| `<service>.logLevel` | string | Log level, where supported. |
| `<service>.image.registry` | string | Container registry. |
| `<service>.image.repository` | string | Image repository path. |
| `<service>.image.tag` | string | Image tag. |
| `<service>.image.pullPolicy` | string | Image pull policy. Empty uses `global.imagePullPolicy`. |
| `<service>.resources.requests.cpu` | string | CPU request. |
| `<service>.resources.requests.memory` | string | Memory request. |
| `<service>.resources.limits.cpu` | string | CPU limit. |
| `<service>.resources.limits.memory` | string | Memory limit. |
| `<service>.env` | array | Additional environment variables, as full Kubernetes `env` entries. |
| `<service>.autoscaling.enabled` | boolean | Enable Horizontal Pod Autoscaler. |
| `<service>.autoscaling.minReplicas` | integer | Minimum replicas for HPA. |
| `<service>.autoscaling.maxReplicas` | integer | Maximum replicas for HPA. |
| `<service>.autoscaling.targetCPUUtilizationPercentage` | integer | Target CPU utilization for HPA scaling. |

### Component defaults

| Component | `enabled` | Image (`registry/repository:tag`) | Requests (CPU / memory) | Limits (CPU / memory) |
|---|---|---|---|---|
| `apiGateway` | `true` | `nexus.mia-platform.eu/cache/envoyproxy/envoy:v1.36.2` | `50m` / `64Mi` | `500m` / `256Mi` |
| `accessControl` | `false` | `nexus.mia-platform.eu/platform/auth/access-control/ext-authz:0.2.2-nocache` | `100m` / `128Mi` | `500m` / `256Mi` |
| `litellmProxy` | `true` | `docker.litellm.ai/berriai/litellm:v1.103.1` | `250m` / `768Mi` | `1000m` / `2Gi` |
| `doclingService` | `true` | `quay.io/docling-project/docling-serve-cpu:v1.36.0` | `1` / `1Gi` | `4` / `6Gi` |
| `memoryService` | `false` | `nexus.mia-platform.eu/ai-services/memory-service:0.1.0` | `50m` / `128Mi` | `500m` / `512Mi` |
| `secretStoreService` | `false` | `nexus.mia-platform.eu/ai-resources/secret-store-service:0.1.1` | `50m` / `64Mi` | `500m` / `256Mi` |
| `temporalFrontend`, `temporalHistory`, `temporalMatching`, `temporalWorker` | follows `temporal.enabled` (`true`) | `docker.io/temporalio/server:1.32.0` | `150m` / `256Mi` | `500m` / `512Mi` |
| `temporalUi` | `true` | `docker.io/temporalio/ui:2.55.0` | `25m` / `64Mi` | `250m` / `256Mi` |
| `temporalAdminTools` | `true` | `docker.io/temporalio/admin-tools:1.32.0` | `25m` / `64Mi` | `250m` / `256Mi` |

---

## apiGateway

The Envoy API gateway. Routes traffic to LiteLLM Proxy, the Temporal UI, Docling, Memory and the secret store, and applies `jwt_authn` and `ext_authz` on the gated routes.

| Key | Type | Default | Description |
|---|---|---|---|
| `apiGateway.logLevel` | string | `"info"` | Envoy log level. |
| `apiGateway.authorizationServer.audiences` | array | `[]` | JWT audiences accepted by `jwt_authn`. Must not be empty when `authorizationServer.enabled` is `true` and any of `doclingService`, `memoryService` or `secretStoreService` is enabled. Set `["ai-services-api"]` on a Mia-Platform installation. |
| `apiGateway.config` | object | `{}` | Advanced Envoy configuration. `apiGateway.config.clusterOverrides.<cluster>` overrides the address of an upstream cluster, intended for local development. |
| `apiGateway.maxBodyBytes` | integer | `10485760` | Maximum allowed request body size in bytes (default: 10 MiB). |

## accessControl

OPA-based ext-authz service behind the API gateway's `ext_authz` filter. Loads the `ai_services` policy bundle shipped with the chart. Requires `apiGateway.enabled`, `authorizationServer.enabled` and `authorizationServer.issuer`.

| Key | Type | Default | Description |
|---|---|---|---|
| `accessControl.enabled` | boolean | `false` | Enable Access Control. Required by `doclingService`, `memoryService` and `secretStoreService`. |
| `accessControl.env` | array | `GOMAXPROCS=2`, `GOMEMLIMIT=230MiB`, `TOKIO_WORKER_THREADS=2` | Environment variables pinning the thread pools of the two runtimes in the container. |
| `accessControl.config.externalContext.enabled` | boolean | `true` | Resolve the caller's external context against the authorization service in `rbacAuthzServiceUrl` or `authzUrl`. |
| `accessControl.config.externalContext.authorization.enabled` | boolean | `true` | Authenticate to the authorization service as an OIDC client. Requires `externalContext.enabled`. |
| `accessControl.config.externalContext.authorization.clientId` | string | `"ai-services-access-control"` | OIDC client ID registered in Keycloak for `accessControl`. |
| `accessControl.config.externalContext.authorization.tokenAuthMethod` | string | `"private_key_jwt"` | Token endpoint authentication method. Options: `private_key_jwt`, `client_secret_post`, `client_secret_basic`. With `private_key_jwt` the public key is published at `<url>/.well-known/jwks.json`. |

## litellmProxy

LiteLLM Proxy, the AI gateway. Served under `basePath` on the API gateway, with every route public: LiteLLM authenticates calls with its own virtual keys. Requires the `litellm-proxy-keys` Secret.

| Key | Type | Default | Description |
|---|---|---|---|
| `litellmProxy.enabled` | boolean | `true` | Enable LiteLLM Proxy. |
| `litellmProxy.basePath` | string | `"/litellm"` | Path prefix on the API gateway. Must start with `/`. |
| `litellmProxy.logLevel` | string | `"info"` | LiteLLM log level. |
| `litellmProxy.extraEnv` | object | `{}` | Additional environment variables as a `NAME: value` map. |
| `litellmProxy.config` | object | see below | Raw LiteLLM proxy configuration ([LiteLLM docs](https://docs.litellm.ai/docs/proxy/configs)). |
| `litellmProxy.config.model_list` | array | `[]` | Models declared in configuration. Provider credentials are referenced as `os.environ/<ENV_VAR_NAME>` (see `secrets.litellmProxyKeys.providerCredentials`). |
| `litellmProxy.config.litellm_settings.drop_params` | boolean | `true` | LiteLLM `drop_params` setting. |
| `litellmProxy.config.general_settings.store_model_in_db` | boolean | `true` | Lets holders of an admin or virtual key register models through the proxy's API, stored in LiteLLM's database. |
| `litellmProxy.config.general_settings.forward_client_headers_to_llm_api` | boolean | `true` | Forward the caller's headers to the upstream provider. |
| `litellmProxy.config.general_settings.forward_llm_provider_auth_headers` | boolean | `true` | Forward the caller's provider auth headers (the caller's provider key wins over the configured one). |
| `litellmProxy.modelCostMap.enabled` | boolean | `true` | Serve the curated model cost map shipped with the chart from an nginx sidecar. It sets both the model prices the proxy bills and the list of models offered by the AI Foundry model form. When `false`, the proxy uses LiteLLM's bundled prices. |
| `litellmProxy.modelCostMap.shrinkRatio` | string | `"0.11"` | Minimum ratio between the size of the curated map and LiteLLM's bundled one. Must be a fraction in (0, 1]. |
| `litellmProxy.modelCostMap.image` | object | `docker.io/nginxinc/nginx-unprivileged:1.31.3-alpine` | Image of the cost map sidecar. |
| `litellmProxy.modelCostMap.resources` | object | requests `10m` CPU / `16Mi` memory, limits `100m` CPU / `64Mi` memory | Resources of the cost map sidecar. |
| `litellmProxy.telemetry.serviceName` | string | `"litellm"` | OTel `service.name` reported by the proxy. Must not be empty: downstream attribution rules match `litellm`. |
| `litellmProxy.telemetry.otlpEndpoint` | string | `""` | OTLP endpoint of the proxy. When empty, `telemetry.otelExporterOtlpEndpoint` is used. |
| `litellmProxy.telemetry.otlpExporter` | string | `""` | `otlp_http` or `otlp_grpc`. Empty derives it from the endpoint and `telemetry.otelExporterOtlpProtocol`. |
| `litellmProxy.telemetry.otelV2` | boolean | `true` | Enable LiteLLM's OTel v2 integration, which emits the `gen_ai.*` attributes and GenAI metrics. |
| `litellmProxy.telemetry.captureMessageContent` | string | `"span_only"` | Capture prompts and completions on spans. `no_content` disables it; `span_and_event` also emits them as span events. |
| `litellmProxy.telemetry.environmentName` | string | `""` | Value of the `deployment.environment.name` resource attribute. Empty leaves it unset. |

## doclingService

Document conversion service, reachable at `/api/docling/` through the API gateway behind `jwt_authn` and `ext_authz`.

| Key | Type | Default | Description |
|---|---|---|---|
| `doclingService.enabled` | boolean | `true` | Enable Docling. Requires `authorizationServer.enabled`, `accessControl.enabled` and a non-empty `apiGateway.authorizationServer.audiences`. |
| `doclingService.env` | array | `TORCHINDUCTOR_CACHE_DIR=/tmp/torchinductor_cache` | Additional environment variables. |
| `doclingService.autoscaling.minReplicas` | integer | `1` | `0` requires the `HPAScaleToZero` feature gate on the cluster. |

## memoryService

Long-term memory owned by a person and shareable with named colleagues. When enabled, the API gateway adds the `/api/memories` and `/memory/mcp` routes behind `jwt_authn` and `ext_authz`, plus the public `/.well-known/oauth-protected-resource/memory/mcp` document. Requires the `memory-service-keys` Secret.

| Key | Type | Default | Description |
|---|---|---|---|
| `memoryService.enabled` | boolean | `false` | Enable the Memory service. |
| `memoryService.logLevel` | string | `"INFO"` | Log level. |
| `memoryService.config.databaseSchema` | string | `""` | Put the tables in a named schema instead of `public`. |
| `memoryService.config.embeddingModel` | string | `""` | Embedding model. Empty leaves search on keyword ranking. |
| `memoryService.config.embeddingDimensions` | integer | `1536` | Output width of the embedding model. Must match the model. |
| `memoryService.config.aiGateway.enabled` | boolean | `false` | Compute embeddings through an AI gateway. Requires `secrets.memoryServiceKeys.litellmApiKey`. |
| `memoryService.config.aiGateway.baseUrl` | string | `""` | AI gateway URL. Empty defaults to this chart's LiteLLM Proxy (`http://litellm-proxy`). |
| `memoryService.config.aiGateway.modelPrefix` | string | `"litellm_proxy"` | Model prefix used for calls through the gateway. |
| `memoryService.config.mcpEnabled` | boolean | `true` | Enable the MCP endpoint, published at `/memory/mcp`. |

## secretStoreService

Central store of the tenants' LiteLLM virtual keys (the `gateway-keys` collection). Reachable through the API gateway only at `/api/secrets/gateway-keys/{key}` and `/api/secrets/gateway-keys/{key}/presence`.

| Key | Type | Default | Description |
|---|---|---|---|
| `secretStoreService.enabled` | boolean | `false` | Enable the secret store service. Requires the authentication chain and an external store (`config.storeAddr`). |
| `secretStoreService.config.mode` | string | `"both"` | `read`, `write` or `both`. |
| `secretStoreService.config.storeAddr` | string | `""` | Address of the external OpenBao or Vault store. |
| `secretStoreService.config.storeKvMount` | string | `"kv"` | KV mount of the store. |
| `secretStoreService.config.storeNamespace` | string | `""` | `X-Vault-Namespace` sent on every call. Empty for a store without namespaces. |
| `secretStoreService.config.auth.method` | string | `"approle"` | `approle` (role/secret pair) or `jwt` (the pod's own ServiceAccount token). |
| `secretStoreService.config.auth.jwt.mount` | string | `"jwt"` | JWT auth mount on the store. Required with `auth.method: jwt`. |
| `secretStoreService.config.auth.jwt.role` | string | `""` | Role on the store. Required with `auth.method: jwt`. |
| `secretStoreService.config.auth.jwt.audience` | string | `"openbao"` | Audience of the projected ServiceAccount token. Must match the role's bound audiences. |
| `secretStoreService.config.auth.jwt.expirationSeconds` | integer | `600` | Lifetime of the projected token. |
| `secretStoreService.config.auth.jwt.mountPath` | string | `"/var/run/secrets/openbao"` | Mount path of the projected token. |

## temporal

Settings shared by the Temporal server roles (`temporalFrontend`, `temporalHistory`, `temporalMatching`, `temporalWorker`) and by the schema and namespace setup Jobs. Requires the `temporal-keys` Secret.

| Key | Type | Default | Description |
|---|---|---|---|
| `temporal.enabled` | boolean | `true` | Deploy Temporal. |
| `temporal.image` | object | `docker.io/temporalio/server:1.32.0` | Server image, shared by all four roles. |
| `temporal.adminToolsImage` | object | `docker.io/temporalio/admin-tools:1.32.0` | Image of the setup Jobs and of `temporalAdminTools`. |
| `temporal.logLevel` | string | `"info"` | Temporal log level. |
| `temporal.numHistoryShards` | integer | `512` | Number of history shards. Fixed at cluster bootstrap: it cannot be changed afterwards. |
| `temporal.persistence.databaseName` | string | `"temporal"` | Default store database. |
| `temporal.persistence.visibilityDatabaseName` | string | `"temporal_visibility"` | Visibility store database (PostgreSQL visibility only). |
| `temporal.persistence.sql.createDatabase` | boolean | `true` | Create the two databases in the schema setup Job. Set `false` when they are provisioned beforehand by an admin user. |
| `temporal.persistence.sql.tls.enabled` | boolean | `false` | TLS to PostgreSQL. |
| `temporal.persistence.sql.tls.hostVerificationEnabled` | boolean | `false` | Verify the PostgreSQL host certificate. |
| `temporal.persistence.sql.tls.serverName` | string | `""` | TLS server name. |
| `temporal.dynamicConfig` | object | `{}` | Temporal dynamic configuration. |
| `temporal.namespaces` | array | `[{name: default, retention: "72h"}]` | Temporal namespaces created by the `temporal-namespace-setup` Job after install and upgrade. |

## temporalAdminTools

`temporal` CLI pod for operational tasks (`kubectl exec`). Not exposed by any Service or route.

| Key | Type | Default | Description |
|---|---|---|---|
| `temporalAdminTools.enabled` | boolean | `true` | Deploy the admin tools pod (only when `temporal.enabled` is `true`). |

## temporalUi

Temporal Web UI, served under `basePath` on the API gateway. The route is public at the gateway; `temporalUi.auth` makes the UI run its own OIDC login.

| Key | Type | Default | Description |
|---|---|---|---|
| `temporalUi.enabled` | boolean | `true` | Deploy the Temporal UI. Requires `temporal.enabled`. |
| `temporalUi.basePath` | string | `"/temporal"` | Path prefix on the API gateway. Must start with `/`. |
| `temporalUi.auth.enabled` | boolean | `false` | Run the OIDC authorization-code flow in the UI. Requires `auth.clientId`, a realm (`auth.providerUrl` or `authorizationServer.issuer`) and the `temporal-ui-keys` Secret. Without it, the UI is open to anyone who can reach `url`. |
| `temporalUi.auth.label` | string | `"Mia-Platform"` | Label of the UI's own login page. |
| `temporalUi.auth.providerUrl` | string | `""` | Realm used for OIDC discovery. Empty uses `authorizationServer.issuer`. |
| `temporalUi.auth.issuerUrl` | string | `""` | Override of the expected `iss`. Normally empty. |
| `temporalUi.auth.clientId` | string | `""` | Confidential OIDC client of the UI. |
| `temporalUi.auth.callbackUrl` | string | `""` | Callback URL. Empty derives `<url><basePath>/auth/sso/callback`. |
| `temporalUi.auth.scopes` | array | `["openid", "profile", "email"]` | Requested scopes. |
| `temporalUi.auth.redirectToProvider` | boolean | `true` | Redirect straight to the realm instead of showing the UI's provider picker. |
