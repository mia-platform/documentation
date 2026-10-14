---
id: overview
title: Helm Values Overview
sidebar_label: Overview
---

# Helm Values: catalog chart

This page describes all configurable values for the `catalog` chart. See `values.yaml` for defaults.

## URL and environment

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `url` | string | `~` | ✅ | Full public URL where the Catalog is exposed (e.g. `https://catalog.your-domain.com`). Used for OIDC redirect URIs, CORS, and routing. |
| `isPaaS` | boolean | `false` | ❌ | Set to `true` for Mia Platform PaaS deployments. |
| `namespacePrefix` | string | `""` | ❌ | Optional prefix prepended as `<namespacePrefix>-<name>` to the names of the chart microservice resources (including their `<service>-keys` Secrets, such as `catalog-engine-keys`), to the image pull secret name, to the `IngressRoute` name and to `ingressRoute.tls.secretName`. Leave empty when the Catalog is installed in a dedicated namespace. |
| `environment` | string | `""` | ❌ | Logical environment name. One of `local`, `development`, `experimental`, `lts`, `preproduction`, `preview`, `demo`. |
| `authzUrl` | string | `~` | ❌ | URL of an external authorization API used by `accessControl` to enrich policy evaluation with external context (e.g. the `services` chart's `apiGateway`, routed to `rbacManagement`). Required when `accessControl.config.externalContext.enabled: true`. |
| `aiServicesClientId` | string | `""` | ❌ | Alias of the token exchange towards the [AI Services](/requirements/installation-guidelines/ai-services/10_overview.md) gateway (the `ai-services-api` Keycloak client), used for the Docling route and by `adkBeApp` to read the tenant's LiteLLM key. When empty, the caller's token is forwarded unchanged. |

## IngressRoute (Traefik)

| Key | Type | Default | Description |
|---|---|---|---|
| `ingressRoute.enabled` | boolean | `false` | Create a Traefik `IngressRoute` resource. |
| `ingressRoute.entryPoints` | array | `["websecure"]` | Traefik entry points to attach the route to. |
| `ingressRoute.middlewares` | array | `[]` | Additional Traefik middleware references. |

## Authorization server

| Key | Type | Default | Required | Description |
|---|---|---|---|---|
| `authorizationServer.enabled` | boolean | `true` | ❌ | Enable JWT validation in the API gateway. |
| `authorizationServer.issuer` | string | `~` | ✅ | Keycloak realm issuer URL (e.g. `https://keycloak.your-domain.com/realms/my-realm`). Used by `authtoolBff` for OIDC and by the API gateway for JWT validation. |

## Telemetry

| Key | Type | Default | Description |
|---|---|---|---|
| `telemetry.enabled` | boolean | `false` | Enable OpenTelemetry tracing for services that support it. |
| `telemetry.otelExporterOtlpEndpoint` | string | `""` | OTLP endpoint for all signals (traces, metrics, logs). |
| `telemetry.otelExporterOtlpTracesEndpoint` | string | `""` | OTLP endpoint for traces only. Overrides the general endpoint for traces. |

## Kafka

The Catalog uses Kafka for its item event pipeline. You can connect to an external Kafka cluster (default) or let the chart deploy an embedded one in the Catalog namespace.

### Embedded Kafka

When `catalogKafkaContext.embedded.enabled: true`, the chart deploys a Kafka cluster in the Catalog namespace with plain Kubernetes resources (a StatefulSet of KRaft nodes with combined broker and controller roles, its Services, a ConfigMap and a topics Job), without any operator or CustomResourceDefinition. It requires a StorageClass able to provision one `ReadWriteOnce` volume per node.

The chart fills in the `kafka-keys` Secret with the address of the embedded cluster, the SASL settings of `catalogKafkaContext.connectionConfig` are ignored (the listener is PLAINTEXT) and the pre-install Kafka connectivity hook is skipped.

:::caution
`catalogKafkaContext.embedded.enabled` and `secrets.kafkaKeys.enabled` are mutually exclusive: enabling both aborts the release. A Kafka cluster managed elsewhere (for example by a Strimzi operator) must be configured as an external cluster.
:::

| Key | Type | Default | Description |
|---|---|---|---|
| `catalogKafkaContext.embedded.enabled` | boolean | `false` | Deploy the embedded Kafka cluster in the Catalog namespace. |
| `catalogKafkaContext.embedded.clusterName` | string | `"catalog-kafka"` | Base name of every embedded Kafka resource. |
| `catalogKafkaContext.embedded.clusterId` | string | `"catalogEmbeddedKafka01"` | KRaft cluster id shared by every node: a 22 character base64url string. Must not change once the volumes are formatted. |
| `catalogKafkaContext.embedded.replicas` | integer | `1` | Number of KRaft nodes. The replication factor of every topic is derived from it, capped at 3. |
| `catalogKafkaContext.embedded.logLevel` | string | `"info"` | Kafka log level. |
| `catalogKafkaContext.embedded.image.registry` | string | `"docker.io"` | Kafka image registry. |
| `catalogKafkaContext.embedded.image.repository` | string | `"apache/kafka"` | Kafka image repository. |
| `catalogKafkaContext.embedded.image.tag` | string | `"4.2.0"` | Kafka image tag. |
| `catalogKafkaContext.embedded.image.pullPolicy` | string | `"IfNotPresent"` | Kafka image pull policy. |
| `catalogKafkaContext.embedded.heap.min` | string | `"256m"` | Initial heap size of the Kafka JVM (`-Xms`). |
| `catalogKafkaContext.embedded.heap.max` | string | `"512m"` | Maximum heap size of the Kafka JVM (`-Xmx`). Keep it well below `resources.limits.memory`. |
| `catalogKafkaContext.embedded.storage.size` | string | `"20Gi"` | Persistent volume size per node. |
| `catalogKafkaContext.embedded.storage.class` | string | `""` | StorageClass of the Kafka volumes. Empty means the cluster default StorageClass. |
| `catalogKafkaContext.embedded.resources` | object | requests `200m` CPU / `512Mi` memory, limits `500m` CPU / `1Gi` memory | Resources of each Kafka node. |
| `catalogKafkaContext.embedded.topics.partitions` | integer | `3` | Number of partitions of each topic in `catalogKafkaContext.topics`. |
| `catalogKafkaContext.embedded.topics.retentionMs` | integer | `172800000` | Retention of each topic in milliseconds, also used as the broker default retention. |
| `serviceAccounts.kafka.enabled` | boolean | `true` | Create a ServiceAccount for the embedded Kafka nodes. |

The topics in `catalogKafkaContext.topics` are created by a post-install/post-upgrade hook Job:

| Key | Type | Default | Description |
|---|---|---|---|
| `hooks.embeddedKafkaTopics.enabled` | boolean | `true` | Create the topics on the embedded Kafka cluster. Used only when `catalogKafkaContext.embedded.enabled: true`. |
| `hooks.embeddedKafkaTopics.backoffLimit` | integer | `2` | Number of retries of the hook Job. |
| `hooks.embeddedKafkaTopics.timeoutSeconds` | integer | `600` | Timeout of the hook Job in seconds. |
| `hooks.embeddedKafkaTopics.readyTimeoutSeconds` | integer | `480` | Time in seconds the hook waits for a Kafka broker to be ready. |

### Kafka context (shared by items pipeline)

| Key | Type | Default | Description |
|---|---|---|---|
| `catalogKafkaContext.topics.input` | string | `"catalog-events.input"` | Input topic consumed by `itemsConsumer` and `itemsCompressor`. |
| `catalogKafkaContext.topics.output` | string | `"catalog-events.output"` | Output topic produced by `itemsProducer`. |
| `catalogKafkaContext.connectionConfig.useBootstrapServers` | boolean | `true` | Read bootstrap servers from the `kafkaKeys` secret. |
| `catalogKafkaContext.connectionConfig.useSaslUsername` | boolean | `true` | Read SASL username from the `kafkaKeys` secret. |
| `catalogKafkaContext.connectionConfig.useSaslPassword` | boolean | `true` | Read SASL password from the `kafkaKeys` secret. |
| `catalogKafkaContext.connectionConfig.saslMechanism` | string | `"SCRAM-SHA-256"` | SASL authentication mechanism. |
| `catalogKafkaContext.connectionConfig.securityProtocol` | string | `"SASL_SSL"` | Kafka security protocol. |

## Secrets

The chart can manage secret creation inline. When `enabled: false` (default), the secret must exist in the namespace before install.

### authtool-bff keys

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.authtoolBffKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `authtool-bff-keys`. |
| `secrets.authtoolBffKeys.privateKey` | string | `""` | RSA private key in PEM format, base64 encoded. Required when `authtoolBff.tokenAuthMethod` is `private_key_jwt`. |
| `secrets.authtoolBffKeys.cookieSecret` | string | `""` | Secret used to sign and encrypt session cookies. |
| `secrets.authtoolBffKeys.tokenEncKey` | string | `""` | Key used to encrypt token data stored in Redis. |
| `secrets.authtoolBffKeys.clientSecret` | string | `""` | OIDC client secret. Required when `authtoolBff.tokenAuthMethod` is `client_secret_post` or `client_secret_basic`. |

:::tip Key generation
```bash
ssh-keygen -t rsa -b 4096 -m PEM -f private.key -N "" > /dev/null
privateKey=$(base64 < private.key); rm private.key private.key.pub
cookieSecret=$(openssl rand -hex 64)
tokenEncKey=$(openssl rand -hex 32)
```
:::

### catalog-engine keys

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.catalogEngineKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `catalog-engine-keys`. |
| `secrets.catalogEngineKeys.postgresConnectionString` | string | `""` | PostgreSQL connection string for the catalog database (e.g. `postgresql://user:pass@host:5432/catalog`). |
| `secrets.catalogEngineKeys.privateKey` | string | `""` | PEM private key of the `catalog-engine` OIDC client, stored as `key.pem`. Used when `catalogEngine.config.authzServiceAuthorization.enabled: true` and its `tokenAuthMethod` is `private_key_jwt`. |
| `secrets.catalogEngineKeys.clientSecret` | string | `""` | Client secret of the `catalog-engine` OIDC client, stored as `client-secret`. Used when `catalogEngine.config.authzServiceAuthorization.enabled: true` and its `tokenAuthMethod` is `client_secret_post` or `client_secret_basic`. |

### adk-be-app keys

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.adkBeAppKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `adk-be-app-keys`. |
| `secrets.adkBeAppKeys.googleApplicationCredentials` | string | `""` | Full JSON content of the GCP service account key file. |
| `secrets.adkBeAppKeys.postgresConnectionString` | string | `""` | PostgreSQL connection string for the ADK backend. |
| `secrets.adkBeAppKeys.otelExporterOtlpHeaders` | string | `""` | OTLP authentication headers for the ADK backend. |

### kafka keys

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.kafkaKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `kafka-keys` for the items pipeline services. |
| `secrets.kafkaKeys.bootstrapServers` | string | `""` | Kafka bootstrap servers address (e.g. `kafka.your-domain.com:9092`). |
| `secrets.kafkaKeys.saslUsername` | string | `""` | Kafka SASL username. |
| `secrets.kafkaKeys.saslPassword` | string | `""` | Kafka SASL password. |

### MongoDB keys

:::info
The `itemsCompressor` deduplication cache has been migrated from MongoDB to a dedicated PostgreSQL schema. Use [`secrets.itemsCompressorKeys`](#items-compressor-keys) instead; the MongoDB-based `secrets.mongoKeys` block has been removed.
:::

### items-compressor keys

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.itemsCompressorKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `items-compressor-keys`. |
| `secrets.itemsCompressorKeys.postgresConnectionString` | string | `""` | PostgreSQL connection string used by `itemsCompressor` as its deduplication cache (e.g. `postgresql://user:pass@host:5432/catalog`). |

### access-control keys

Used only when `accessControl.config.externalContext.enabled: true`: `accessControl` authenticates as its own OIDC client to call the API configured via `authzUrl`.

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.accessControlKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `access-control-keys`. |
| `secrets.accessControlKeys.privateKey` | string | `""` | RSA private key in PEM format, base64 encoded. Used when `accessControl.config.externalContext.authorization.tokenAuthMethod` is `private_key_jwt`. |
| `secrets.accessControlKeys.clientSecret` | string | `""` | OIDC client secret. Used when `accessControl.config.externalContext.authorization.tokenAuthMethod` is `client_secret_post` or `client_secret_basic`. |

## Global image settings

| Key | Type | Default | Description |
|---|---|---|---|
| `global.labels` | object | `{}` | Additional labels added to all resources. |
| `global.annotations` | object | `{}` | Additional annotations added to all resources. |
| `global.imagePullSecret.enabled` | boolean | `false` | When `true`, every pod references the image pull secret named in `global.imagePullSecret.name`. It does not control the creation of the Secret. |
| `global.imagePullSecret.name` | string | `""` | Name of the image pull secret. The chart creates a `kubernetes.io/dockerconfigjson` Secret with this name only when all of `global.imageCredentials.registry`, `username`, `password` and `email` are set; otherwise it must match an existing Secret. |
| `global.imageCredentials.registry` | string | `""` | Container registry hostname. Also used as the fallback registry for any microservice image that does not set its own `image.registry`. |
| `global.imageCredentials.username` | string | `""` | Registry username. Typically injected at deploy time via `--set` rather than committed to a values file. |
| `global.imageCredentials.password` | string | `""` | Registry password/token. Typically injected at deploy time via `--set`. |
| `global.imageCredentials.email` | string | `""` | Email associated with the registry credentials (required by the `dockerconfigjson` format). |

## Service accounts

Each microservice gets its own dedicated `ServiceAccount`, created by default. Applies to: `accessControl`, `adkBeApp`, `apiGateway`, `authtoolBff`, `cache`, `catalogEngine`, `catalogWebsite`, `itemsCompressor`, `itemsConsumer`, `itemsProducer`, `kafka` (embedded Kafka nodes), `mcpServer`, `policyEngine`, `secretStoreService`, `swaggerAggregator`.

| Key | Type | Default | Description |
|---|---|---|---|
| `serviceAccounts.<service>.enabled` | boolean | `true` | Create a ServiceAccount for `<service>`. |

## Common microservice fields

All microservices share the following configurable fields:

| Key | Type | Description |
|---|---|---|
| `<service>.enabled` | boolean | Enable or disable the microservice. |
| `<service>.replicaCount` | integer | Number of pod replicas. |
| `<service>.logLevel` | string | Log level (`debug`, `info`, `warn`, `error`). |
| `<service>.image.registry` | string | Container registry. |
| `<service>.image.repository` | string | Image repository path. |
| `<service>.image.tag` | string | Image tag. |
| `<service>.image.pullPolicy` | string | Image pull policy. |
| `<service>.resources.requests.cpu` | string | CPU request. |
| `<service>.resources.requests.memory` | string | Memory request. |
| `<service>.resources.limits.cpu` | string | CPU limit. |
| `<service>.resources.limits.memory` | string | Memory limit. |
| `<service>.autoscaling.enabled` | boolean | Enable Horizontal Pod Autoscaler. |
| `<service>.autoscaling.minReplicas` | integer | Minimum replicas for HPA. |
| `<service>.autoscaling.maxReplicas` | integer | Maximum replicas for HPA. |
| `<service>.autoscaling.targetCPUUtilizationPercentage` | integer | Target CPU utilization for HPA scaling. |

---

## catalogEngine

The core Catalog REST API. Serves all catalog data from PostgreSQL. It syncs Catalog permissions to the authorization API configured via `authzUrl`, authenticating as its own OIDC client (`catalog-engine`) with the credentials of the `catalog-engine-keys` Secret (see [catalog-engine keys](#catalog-engine-keys)).

| Key | Type | Default | Description |
|---|---|---|---|
| `catalogEngine.workerThreads` | string | `""` | Optional. Number of worker threads of the `catalogEngine` runtime (`TOKIO_WORKER_THREADS`). When empty, the runtime default is used. |
| `catalogEngine.config.persistence.config.maxConnections` | integer | `10` | Maximum number of PostgreSQL connections in the pool. |
| `catalogEngine.config.authzServiceAuthorization.enabled` | boolean | `true` | Authenticate to the authorization API as an OIDC client to sync Catalog permissions. |
| `catalogEngine.config.authzServiceAuthorization.clientId` | string | `"catalog-engine"` | OIDC client ID registered in Keycloak for `catalogEngine`. |
| `catalogEngine.config.authzServiceAuthorization.tokenAuthMethod` | string | `"private_key_jwt"` | Token endpoint authentication method. Options: `private_key_jwt`, `client_secret_post`, `client_secret_basic`. |

## accessControl

OPA-based ext-authz service. Enforces RBAC policies on every request forwarded by the API gateway. Can optionally fetch additional authorization context from an external API.

| Key | Type | Default | Description |
|---|---|---|---|
| `accessControl.config.externalContext.enabled` | boolean | `true` | Enable fetching external authorization context from the API configured via `authzUrl`. |
| `accessControl.config.externalContext.authorization.enabled` | boolean | `true` | Authenticate to the external authorization API as an OIDC client. |
| `accessControl.config.externalContext.authorization.clientId` | string | `"catalog-access-control"` | OIDC client ID registered in Keycloak for `accessControl`. |
| `accessControl.config.externalContext.authorization.tokenAuthMethod` | string | `"private_key_jwt"` | Token endpoint authentication method. Options: `private_key_jwt`, `client_secret_post`, `client_secret_basic`. |
| `accessControl.config.externalContext.authorization.credentialsName` | string | `""` | Optional override for the credentials file name mounted from `secrets.accessControlKeys`. |

## authtoolBff

The OIDC Backend-for-Frontend. Manages session lifecycle and the PKCE login/logout flow. Configures two OIDC clients: `website` (browser login/logout) and `exchange` (token exchange for calling authorization APIs on the user's behalf).

| Key | Type | Default | Description |
|---|---|---|---|
| `authtoolBff.config.clients.website.clientId` | string | `"catalog-website-bff"` | OIDC client ID registered in Keycloak for the browser login/logout flow. |
| `authtoolBff.config.clients.website.tokenAuthMethod` | string | `"private_key_jwt"` | Token endpoint authentication method for the website client. Options: `private_key_jwt`, `client_secret_post`, `client_secret_basic`. |
| `authtoolBff.config.clients.website.credentialsName` | string | `""` | Optional override for the credentials file name mounted from `secrets.authtoolBffKeys.website`. |
| `authtoolBff.config.clients.exchange.clientId` | string | `"catalog-token-exchange"` | OIDC client ID used for the `urn:ietf:params:oauth:grant-type:token-exchange` grant. |
| `authtoolBff.config.clients.exchange.clientAlias` | string | `"authz-api"` | Alias under which the exchanged token is issued; requested with audience `authz-api` and scope `mia:authz`. |
| `authtoolBff.config.clients.exchange.tokenAuthMethod` | string | `"private_key_jwt"` | Token endpoint authentication method for the exchange client. |
| `authtoolBff.config.clients.exchange.credentialsName` | string | `""` | Optional override for the credentials file name mounted from `secrets.authtoolBffKeys.exchange`. |
| `authtoolBff.config.disableAccessTokenEncryption` | boolean | `false` | Disable encryption of the access token stored in Redis. Leave `false` unless required for debugging. |
| `authtoolBff.config.userClaims` | array | `[]` | Additional JWT claims to propagate as user context within the session. |
| `authtoolBff.config.authorizationCache` | object | `{}` | Pass-through cache connection config, used when `cache.enabled: false`. |

## apiGateway

The Envoy API gateway. Validates JWTs and routes traffic to backend services.

| Key | Type | Default | Description |
|---|---|---|---|
| `apiGateway.logLevel` | string | `"info"` | Envoy log level. |
| `apiGateway.extraVirtualHosts` | array | `[]` | Additional hostnames (and, optionally, ports) accepted on the main virtual host. |
| `apiGateway.authorizationServer.name` | string | `""` | Name of the OIDC authorization server cluster in Envoy (used for JWKS resolution). |
| `apiGateway.authorizationServer.audiences` | array | `["catalog-api"]` | Expected JWT audiences. |
| `apiGateway.maxBodyBytes` | integer | `10485760` | Maximum allowed request body size in bytes (default: 10 MiB). |
| `apiGateway.docling.url` | string | `""` | URL of the Docling service of [AI Services](/requirements/installation-guidelines/ai-services/10_overview.md) (e.g. `https://<ai-services host>/api/docling/`), served on `/api/docling/`. The route is created only when set. |
| `apiGateway.docling.maxBodyBytes` | integer | `33554432` | Maximum allowed request body size in bytes for the `/api/docling/` route (default: 32 MiB). |

## catalogWebsite

The Catalog frontend application.

| Key | Type | Default | Description |
|---|---|---|---|
| `catalogWebsite.config.baseHref` | string | `"/website/"` | Base path at which the website is served. |

## adkBeApp

The ADK Backend App, enabled by default. Orchestrates AI agents using Google ADK and, by default, reaches the models through the [AI Services](/requirements/installation-guidelines/ai-services/10_overview.md) LiteLLM gateway. The same image is shared with the AI Foundry chart. The chart fails to render if the required values below are missing; set `adkBeApp.enabled: false` if you do not need it.

| Key | Type | Default | Description |
|---|---|---|---|
| `adkBeApp.enabled` | boolean | `true` | Deploy the ADK Backend App. |
| `adkBeApp.config.catalogApiUrl` | string | `""` | URL of the Catalog API read by `adkBeApp`. When empty, the release's own API gateway is used, and `apiGateway.enabled` must be `true`. |
| `adkBeApp.config.authtoolBffUrl` | string | `""` | URL of the `authtool-bff` used to exchange the caller's token for the Catalog audience. When empty, the release's own `authtoolBff` is used. |
| `adkBeApp.config.catalogClientId` | string | `"catalog-api"` | Client alias used to exchange the caller's token for the Catalog audience. |
| `adkBeApp.config.aiGatewayEnabled` | boolean | `true` | Call every model through the AI Services LiteLLM gateway. When `true`, `litellmProxyApiBase` and `secretStoreBaseUrl` are required, together with `aiServicesClientId`. Set to `false` to call the models directly. |
| `adkBeApp.config.litellmProxyApiBase` | string | `""` | URL of the AI Services LiteLLM gateway (e.g. `https://<ai-services host>/litellm/`). Required while `aiGatewayEnabled` is `true`. |
| `adkBeApp.config.secretStoreBaseUrl` | string | `""` | AI Services public URL (e.g. `https://<ai-services host>`), from which the tenant's LiteLLM key is read. Required while `aiGatewayEnabled` is `true`. |
| `adkBeApp.config.googleCloudProject` | string | | GCP project ID, used to call the models directly on Vertex AI. No longer has a default. |
| `adkBeApp.config.googleCloudLocation` | string | | GCP region. No longer has a default. |
| `adkBeApp.config.googleGenaiUseVertexai` | boolean | | Use Vertex AI as the GenAI backend. |
| `adkBeApp.config.agentReloadInterval` | string | `"300"` | Interval in seconds to reload agent definitions. |

## policyEngine

The authorization policy evaluation engine. Evaluates access policies against catalog resources.

| Key | Type | Default | Description |
|---|---|---|---|
| `policyEngine.config.redisKeyNamespace` | string | `"policy-engine"` | Redis key prefix used to namespace policy cache entries. |

## mcpServer

The Model Context Protocol server. Exposes the Catalog API as an MCP tool for AI assistants.

| Key | Type | Default | Description |
|---|---|---|---|
| `mcpServer.config` | object | `{}` | Additional MCP server configuration passed as a ConfigMap. |

## secretStoreService

Optional store of the webhook signing keys of `catalogEngine`, in front of an external OpenBao/Vault that is not deployed by the chart. Disabled by default: while it is off, webhooks without a secret keep working, and creating or rotating a webhook with a secret fails. When enabled, `catalogEngine` uses it by default (`catalogEngine.config.secretStoreUrl` empty).

| Key | Type | Default | Description |
|---|---|---|---|
| `secretStoreService.enabled` | boolean | `false` | Deploy the secret store service. |
| `secretStoreService.config.storeAddr` | string | `""` | Address of the external OpenBao/Vault. Required when enabled. |
| `secretStoreService.config.storeKvMount` | string | `"secret"` | KV v2 mount on the store. |
| `secretStoreService.config.storeNamespace` | string | `""` | Namespace sent on every call to the store. Empty for a store without namespaces. |
| `secretStoreService.config.auth.method` | string | `"jwt"` | Login method: `jwt` (the pod's ServiceAccount token) or `approle` (the pair in `secrets.secretStoreServiceKeys.storeRoleId`/`storeSecretId`, or an existing `secret-store-service-keys` Secret). |
| `secretStoreService.config.auth.jwt.mount` | string | `"jwt"` | JWT auth mount on the store that trusts the cluster's OIDC issuer. |
| `secretStoreService.config.auth.jwt.role` | string | `""` | Role on that mount bound to the ServiceAccount of `secretStoreService`. Required with the `jwt` method. |
| `secretStoreService.config.auth.jwt.audience` | string | `"openbao"` | Audience of the projected ServiceAccount token. |

## swaggerAggregator

Aggregates OpenAPI specs from platform projects into a unified portal. Disabled by default.

| Key | Type | Default | Description |
|---|---|---|---|
| `swaggerAggregator.enabled` | boolean | `false` | Enable the Swagger Aggregator. |
| `swaggerAggregator.config.clientId` | string | `"catalog-api-portal"` | OIDC client ID used by the aggregator for authenticated API discovery. |

## Items pipeline services

`itemsProducer`, `itemsConsumer`, and `itemsCompressor` form the Kafka event pipeline. They all read Kafka credentials from the `kafka-keys` secret and use the topic names defined in `catalogKafkaContext.topics`.

### itemsCompressor

Requires the `items-compressor-keys` Secret (see [items-compressor keys](#items-compressor-keys)) for its PostgreSQL connection string.

| Key | Type | Default | Description |
|---|---|---|---|
| `itemsCompressor.config.kafkaConsumerConfig.group.id` | string | `""` | Kafka consumer group ID. |
| `itemsCompressor.config.kafkaConsumerConfig.auto.offset.reset` | string | `"earliest"` | Offset reset policy. |
| `itemsCompressor.config.kafkaConsumerConfig.queued.max.messages.kbytes` | string | `"32840"` | Maximum size (KB) of queued messages on the consumer side. |
| `itemsCompressor.config.kafkaConsumerConfig.queued.min.messages` | string | `"5000"` | Minimum number of messages to keep queued on the consumer side. |
| `itemsCompressor.config.kafkaProducerConfig.compression.type` | string | `"snappy"` | Compression codec used when producing merged events back to Kafka. |
| `itemsCompressor.config.postgresConfig.cache.enabled` | boolean | `true` | Enable the PostgreSQL-backed deduplication cache. |
| `itemsCompressor.config.postgresConfig.cache.schemaName` | string | `"items_compressor"` | PostgreSQL schema used for the cache table. |
| `itemsCompressor.config.postgresConfig.cache.tableName` | string | `"items_compressor_cache"` | PostgreSQL table used for the cache. |

### itemsConsumer

| Key | Type | Default | Description |
|---|---|---|---|
| `itemsConsumer.config.kafkaConfig.group.id` | string | `""` | Kafka consumer group ID. |
| `itemsConsumer.config.kafkaConfig.auto.offset.reset` | string | `"earliest"` | Offset reset policy. |
| `itemsConsumer.config.kafkaConfig.enable.auto.commit` | string | `"true"` | Enable automatic offset commit. |

### itemsProducer

`itemsProducer` has no additional configuration beyond the common microservice fields. It reads Kafka credentials from the `kafka-keys` secret and writes to the `catalogKafkaContext.topics.output` topic.
