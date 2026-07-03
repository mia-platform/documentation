---
title: Catalog Overview
sidebar_label: Overview
---

# Catalog

The Mia Platform **Context Catalog** is the central registry where platform components, marketplace items, and AI agent context are managed. It provides a web interface for browsing and publishing items, a REST API consumed by other platform products, and a Kafka-based event pipeline that keeps item state in sync across the platform.

The Catalog also exposes its API via the **Model Context Protocol (MCP)**, making it directly queryable by AI agents (Claude Code, GitHub Copilot, VS Code agents, Kiro IDE).

## What the chart deploys

| Component | Image | Description |
|---|---|---|
| **accessControl** | `platform/auth/access-control/ext-authz` | OPA-based ext-authz service. Enforces RBAC policies on every request forwarded by the API gateway. |
| **adkBeApp** | `ai-foundry/adk-be-app` | ADK Backend App. Orchestrates AI agents using Google Cloud ADK and Vertex AI. The same image is shared with the AI Foundry chart. |
| **apiGateway** | `cache/envoyproxy/envoy` | Envoy reverse proxy. Routes all inbound traffic, validates JWTs, and delegates per-request authorization to `accessControl`. |
| **authtoolBff** | `platform/auth/authtool/authtool-bff` | OIDC Backend-for-Frontend. Manages the PKCE login/logout flow with Keycloak and issues signed, encrypted session cookies to the browser. |
| **cache** | `redis` | Redis instance used by `authtoolBff` for session storage and by `policyEngine` for policy caching. |
| **catalogEngine** | `catalog/catalog-engine` | Core catalog REST API. Persists all catalog items in a PostgreSQL database. |
| **catalogWebsite** | `catalog/catalog-website` | Frontend web application. Provides the Catalog UI served at `<url>/website/`. |
| **doclingService** | `docling-project/docling-serve-cpu` | *(Optional, CPU-intensive.)* Document parsing service. Converts uploaded files (PDF, DOCX, etc.) into structured content for AI agent context. |
| **itemsCompressor** | `data-fabric/stream-processor` | Kafka consumer. Reads raw item events, compresses/merges them, and writes the result back to Kafka. Uses MongoDB as a temporary cache (PostgreSQL migration planned). |
| **itemsConsumer** | `catalog/items-consumer` | Kafka consumer. Processes catalog item events from Kafka and persists them to the catalog via `catalogEngine`. |
| **itemsProducer** | `catalog/items-producer` | Kafka producer. Publishes catalog item lifecycle events (create, update, delete) to the `catalog-events.input` topic. |
| **mcpServer** | `catalog/catalog-mcp-server` | Model Context Protocol server. Exposes the Catalog API as an MCP tool, making it directly queryable by AI coding assistants and agents. |
| **policyEngine** | `p4samd/core/policy-engine` | Authorization policy evaluation engine. Evaluates access policies against catalog items, using Redis for caching and integrating with `catalogEngine`. |
| **swaggerAggregator** | `core/swagger-aggregator` | *(Optional, disabled by default.)* Aggregates OpenAPI specs from platform projects and exposes a unified API portal. |

## Architecture overview

```
  Browser ──► IngressRoute (Traefik)
                    │
              apiGateway (Envoy)
                    │
       ┌────────────┼───────────────────────────────┐
       │            │           │          │         │
  authtoolBff  accessControl  catalogEngine  catalogWebsite  mcpServer
       │            │              │
  cache (Redis) policyEngine    PostgreSQL (external)
                    │
               cache (Redis)


  ── Kafka event pipeline ──────────────────────────────────
  itemsProducer ──► Kafka (catalog-events.input)
                         │
                    itemsConsumer ──► catalogEngine ──► PostgreSQL
                    itemsCompressor ──► MongoDB (temp cache)
  ──────────────────────────────────────────────────────────

  adkBeApp ──► Google Cloud (Vertex AI / ADK)
```

The Envoy gateway validates JWT tokens on every request and checks RBAC policies via `accessControl`. The `catalogEngine` is the authoritative store for all catalog data. The Kafka pipeline provides an event-driven path for bulk item ingestion and synchronisation.

## Relationships with other Mia Platform products

| Product / System | Integration | Configuration key |
|---|---|---|
| **Keycloak** | OIDC authentication. `authtoolBff` performs the PKCE flow; Envoy validates JWTs against the realm's JWKS. | `authorizationServer.issuer` |
| **AI Foundry** | `adkBeApp` is the same component used in the AI Foundry chart. The `mcpServer` exposes the Catalog API to AI tools so that AI Foundry agents (and other AI assistants) can query catalog context directly. | `adkBeApp.*`, `mcpServer.*` |
| **Console** | The Console generates and publishes catalog items via the `itemsProducer` / Kafka pipeline. Catalog items reflect Console-managed projects and components. | `catalogKafkaContext.*` |
| **Services (Homepage)** | The Catalog website is linked from the Mia Platform homepage deployed by the `services` chart. The homepage uses the Catalog as the primary navigation hub. | `url` |
| **PostgreSQL** | `catalogEngine` stores all catalog items in PostgreSQL. `adkBeApp` also connects to PostgreSQL for agent state. | `secrets.catalogEngineKeys`, `secrets.adkBeAppKeys` |
| **Kafka** | The items pipeline uses two Kafka topics (`catalog-events.input`, `catalog-events.output`). Can be deployed embedded (Strimzi Operator) or connected to an external cluster. | `kafka.*`, `secrets.kafkaKeys`, `catalogKafkaContext.*` |
| **MongoDB** | `itemsCompressor` temporarily uses MongoDB as a cache for item deduplication. A migration to PostgreSQL is planned. | `secrets.mongoKeys` |
| **Redis** | Used by `authtoolBff` for session token storage and by `policyEngine` for policy caching. | `cache.*`, `policyEngine.config.redisKeyNamespace` |
| **MCP-compatible AI tools** | `mcpServer` exposes the Catalog API via the Model Context Protocol. Compatible with Claude Code, GitHub Copilot, VS Code agents, and Kiro IDE. | `mcpServer.*` |

Refer to the following installation guides to set up the required dependencies before installing the Catalog:

- [Keycloak installation guide](/requirements/installation-guidelines/authn/keycloak/15_getting-started.md)
- [Realm Management guide](/requirements/installation-guidelines/authn/keycloak-realm-management/15_getting-started.md)

## Deployment models

| Model | When to use |
|---|---|
| **Standalone chart** | Install the `catalog` chart directly with a custom `values.yaml`. Suitable for single-environment setups. |
| **`catalog-deployment` wrapper** | Use the wrapper repository that declares the chart as a Helm dependency and provides per-environment values files (`values/production.yaml`, `values/development.yaml`, etc.). All values are nested under the `catalog:` key. Recommended for multi-environment GitOps workflows. |
