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
| `environment` | string | `""` | ❌ | Logical environment name. One of `local`, `development`, `experimental`, `lts`, `preproduction`, `preview`, `demo`. |
| `authzUrl` | string | `~` | ❌ | URL of an external authorization API used by `accessControl` to enrich policy evaluation with external context (e.g. the `services` chart's `apiGateway`, routed to `rbacManagement`). Required when `accessControl.config.externalContext.enabled: true`. |

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

The Catalog uses Kafka for its item event pipeline. You can deploy an embedded Kafka cluster (via Strimzi Operator) or connect to an external one.

### Embedded Kafka

| Key | Type | Default | Description |
|---|---|---|---|
| `kafka.enabled` | boolean | `false` | Deploy an embedded Kafka cluster managed by Strimzi. |
| `kafka.operator.enabled` | boolean | `false` | Deploy the Strimzi Kafka Operator in the same namespace. Set to `false` if the operator is already installed cluster-wide. |
| `kafka.ui.enabled` | boolean | `false` | Deploy the Kafbat UI for Kafka cluster management. |
| `kafka.version` | string | `"4.1.0"` | Kafka version to deploy. |
| `kafka.metadataVersion` | string | `"4.0-IV3"` | Kafka metadata version (KRaft mode). |
| `kafka.config.logRetentionHours` | integer | `48` | Log retention duration in hours. |
| `kafka.node.replicas` | integer | `1` | Number of Kafka nodes (broker + controller combined in KRaft mode). |
| `kafka.node.storage.size` | string | `"20Gi"` | Persistent volume size per node. |
| `kafka.node.storage.storageClass` | string | `"standard"` | Storage class for Kafka PVCs. |
| `kafka.topics` | array | see below | List of topics to auto-create on cluster initialization. |

Default topics created:

| Topic | Partitions |
|---|---|
| `catalog-events.input` | 3 |
| `catalog-events.output` | 3 |

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

### adk-be-app keys

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.adkBeAppKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `adk-be-app-keys`. |
| `secrets.adkBeAppKeys.googleApplicationCredentials` | string | `""` | Full JSON content of the GCP service account key file. |
| `secrets.adkBeAppKeys.postgresConnectionString` | string | `""` | PostgreSQL connection string for the ADK backend. |
| `secrets.adkBeAppKeys.otelExporterOtlpHeaders` | string | `""` | OTLP authentication headers for the ADK backend. |
| `secrets.adkBeAppKeys.tempoAuthHeader` | string | `""` | Bearer token for authenticating to a Tempo backend. |

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
| `global.imagePullSecret.enabled` | boolean | `false` | When `true`, the chart creates a `kubernetes.io/dockerconfigjson` Secret from `global.imageCredentials` and references it on every pod. |
| `global.imagePullSecret.name` | string | `""` | Name of the image pull secret. Must match an existing Secret when `enabled: false`, or is created by the chart when `enabled: true`. |
| `global.imageCredentials.registry` | string | `""` | Container registry hostname. Also used as the fallback registry for any microservice image that does not set its own `image.registry`. |
| `global.imageCredentials.username` | string | `""` | Registry username. Typically injected at deploy time via `--set` rather than committed to a values file. |
| `global.imageCredentials.password` | string | `""` | Registry password/token. Typically injected at deploy time via `--set`. |
| `global.imageCredentials.email` | string | `""` | Email associated with the registry credentials (required by the `dockerconfigjson` format). |

## Service accounts

Each microservice gets its own dedicated `ServiceAccount`, created by default. Applies to: `accessControl`, `adkBeApp`, `apiGateway`, `authtoolBff`, `cache`, `catalogEngine`, `catalogWebsite`, `doclingService`, `itemsCompressor`, `itemsConsumer`, `itemsProducer`, `mcpServer`, `policyEngine`, `swaggerAggregator`.

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

The core Catalog REST API. Serves all catalog data from PostgreSQL.

| Key | Type | Default | Description |
|---|---|---|---|
| `catalogEngine.config.persistence.config.maxConnections` | integer | `10` | Maximum number of PostgreSQL connections in the pool. |

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

## catalogWebsite

The Catalog frontend application.

| Key | Type | Default | Description |
|---|---|---|---|
| `catalogWebsite.config.baseHref` | string | `"/website/"` | Base path at which the website is served. |

## adkBeApp

The ADK Backend App. Orchestrates AI agents using Google Cloud ADK and Vertex AI. The same image is shared with the AI Foundry chart.

| Key | Type | Default | Description |
|---|---|---|---|
| `adkBeApp.config.googleCloudProject` | string | `"operations-lab"` | GCP project ID where Vertex AI agents are deployed. |
| `adkBeApp.config.googleCloudLocation` | string | `"europe-west1"` | GCP region. |
| `adkBeApp.config.googleGenaiUseVertexai` | boolean | `true` | Use Vertex AI as the GenAI backend. |
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

## doclingService

The document parsing service. Converts uploaded documents into structured content for AI agent context.

:::caution Resource requirements
`doclingService` pulls a **4.4 GB** image and loads PyTorch models at startup. Default resource allocation is `1–4` CPU and `1Gi–6Gi` memory. Disable it in lightweight environments where document ingestion is not needed.
:::

| Key | Type | Default | Description |
|---|---|---|---|
| `doclingService.enabled` | boolean | `true` | Enable or disable the Docling service. |

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
