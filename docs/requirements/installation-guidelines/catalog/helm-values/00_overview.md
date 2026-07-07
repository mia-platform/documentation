---
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
| `environment` | string | `""` | ❌ | Logical environment name (e.g. `production`, `development`). |

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

| Key | Type | Default | Description |
|---|---|---|---|
| `secrets.mongoKeys.enabled` | boolean | `false` | When `true`, the chart creates a Secret named `mongo-keys`. |
| `secrets.mongoKeys.connectionString` | string | `""` | MongoDB connection string used by `itemsCompressor` as a temporary deduplication cache. A migration to PostgreSQL is in progress. |

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

## authtoolBff

The OIDC Backend-for-Frontend. Manages session lifecycle and the PKCE login/logout flow.

| Key | Type | Default | Description |
|---|---|---|---|
| `authtoolBff.tokenAuthMethod` | string | `"private_key_jwt"` | Authentication method for the OIDC client. Options: `private_key_jwt`, `client_secret_post`, `client_secret_basic`. |
| `authtoolBff.config.clientId` | string | `~` | OIDC client ID registered in Keycloak for `authtool-bff`. |
| `authtoolBff.config.userClaims` | array | `[]` | Additional JWT claims to propagate as user context within the session. |

## apiGateway

The Envoy API gateway. Validates JWTs and routes traffic to backend services.

| Key | Type | Default | Description |
|---|---|---|---|
| `apiGateway.logLevel` | string | `"info"` | Envoy log level. |
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
`doclingService` pulls a **4.4 GB** image and loads PyTorch models at startup. Default resource allocation is `500m–2000m` CPU and `2Gi–4Gi` memory. Disable it in lightweight environments where document ingestion is not needed.
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

| Key | Type | Default | Description |
|---|---|---|---|
| `itemsCompressor.config.kafkaConsumerConfig.group.id` | string | `""` | Kafka consumer group ID. |
| `itemsCompressor.config.kafkaConsumerConfig.auto.offset.reset` | string | `"earliest"` | Offset reset policy. |
| `itemsCompressor.config.mongoConfig.databaseName` | string | `"catalog-system"` | MongoDB database name used as deduplication cache. |
| `itemsCompressor.config.mongoConfig.cache.enabled` | boolean | `true` | Enable MongoDB-backed cache. |
| `itemsCompressor.config.mongoConfig.cache.collectionName` | string | `"item-compressor-cache"` | MongoDB collection for the cache. |

:::info
The MongoDB dependency in `itemsCompressor` is temporary. A migration to PostgreSQL is in progress; the `secrets.mongoKeys` block and this configuration will be removed in a future chart version.
:::

### itemsConsumer

| Key | Type | Default | Description |
|---|---|---|---|
| `itemsConsumer.config.kafkaConfig.group.id` | string | `""` | Kafka consumer group ID. |
| `itemsConsumer.config.kafkaConfig.auto.offset.reset` | string | `"earliest"` | Offset reset policy. |
| `itemsConsumer.config.kafkaConfig.enable.auto.commit` | string | `"true"` | Enable automatic offset commit. |

### itemsProducer

`itemsProducer` has no additional configuration beyond the common microservice fields. It reads Kafka credentials from the `kafka-keys` secret and writes to the `catalogKafkaContext.topics.output` topic.

This page is a placeholder for Catalog Helm values documentation.
