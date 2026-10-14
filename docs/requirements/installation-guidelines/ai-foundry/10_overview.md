---
id: overview
title: AI Foundry Overview
sidebar_label: Overview
---

# AI Foundry

AI Foundry is a Mia Platform product for managing and deploying AI agent applications. It provides a web interface for interacting with AI agents, orchestrates agent execution via [Google ADK](https://google.github.io/adk-docs/), runs Agentic Workflows, and manages user sessions through Keycloak OIDC. It relies on [AI Services](/requirements/installation-guidelines/ai-services/10_overview.md) for the AI gateway (LiteLLM), the workflow engine (Temporal), document conversion (Docling), the memory service, the trace and metric stores (Langfuse, Prometheus) and the OpenBao secret store.

## What the chart deploys

| Component | Image | Description |
|---|---|---|
| **accessControl** | `platform/auth/access-control/ext-authz` | OPA-based ext-authz service. Enforces RBAC policies on every request forwarded by the API gateway. Can optionally fetch external authorization context (`authzUrl`). |
| **adkBeApp** | `ai-foundry/adk-be-app` | ADK Backend App. Orchestrates AI agents using Google ADK and calls the models through the LiteLLM AI gateway of AI Services. Requires a PostgreSQL database for agent state persistence. |
| **aiFoundryBe** | `ai-foundry/ai-foundry-be` | PostgreSQL-backed implementation of the Catalog item API and read API for the observability screens. Uses the same database as `adkBeApp`. |
| **aiFoundryBff** | `ai-foundry/ai-foundry-bff` | AI Foundry BFF. Exposes the backend API consumed by the website and calls the Catalog, Authz and AI Services APIs on the user's behalf via token exchange. |
| **aiFoundryMcp** | `ai-foundry/ai-foundry-mcp-server` | MCP server over the Catalog and Agentic Workflows, served at `{url}/foundry/mcp`. |
| **aiFoundryProvisioner** | `ai-foundry/ai-foundry-provisioner` | `post-install`/`post-upgrade` hook Job that seeds and migrates the AI Foundry resources of every tenant. |
| **aiFoundryWorkflows** | `ai-foundry/ai-foundry-workflows` | Agentic Workflows engine: a REST API and a Temporal worker. Temporal is provided by AI Services. |
| **aiFoundryWebsite** | `ai-foundry/ai-foundry-website` | Frontend web application. Provides the AI Foundry UI with configurable links to other Mia Platform products and external AI tools. |
| **apiGateway** | `cache/envoyproxy/envoy` | Envoy reverse proxy. Routes all inbound traffic and validates JWT tokens against the Keycloak JWKS endpoint on every request. |
| **authtoolBff** | `platform/auth/authtool/authtool-bff` | OIDC Backend-for-Frontend. Manages the PKCE login/logout flow with Keycloak and issues signed, encrypted session cookies to the browser. Also runs two token-exchange clients used to call the Catalog and Authz APIs. |
| **cache** | `redis` | Redis instance used by `authtoolBff` to store and encrypt session tokens. |
| **redis** | `redis` | Shared application Redis of the AI Foundry services, used as a cache (no persistence). |
| **secretStoreService** | `ai-resources/secret-store-service` | Credential store in front of OpenBao (provided by AI Services) for the connections and keys configured in AI Foundry. |
| **workspaceService** | `ai-resources/workspace-service` | Ephemeral filesystem shared by the steps of a workflow run: a control plane plus one runner pod per workspace. Requires its own PostgreSQL database. |

Document conversion (Docling) is no longer deployed by this chart: the API gateway routes `/api/docling/` to the Docling instance of AI Services (`apiGateway.docling.url`).

## Architecture overview

```
  Browser ──► IngressRoute (Traefik)
                    │
              apiGateway (Envoy) ──────────────────► AI Services Docling (/api/docling/)
                    │
       ┌────────────┼────────────────┬──────────────────┬──────────────┬───────────────┐
       │            │                │                  │              │               │
  authtoolBff  aiFoundryBff   aiFoundryWebsite  aiFoundryWorkflows  aiFoundryMcp  accessControl
       │            │                                   │                              │
  cache (Redis)  aiFoundryBe ── adkBeApp                │                     authzUrl (external,
                    │              │                    │                      e.g. rbacManagement)
               PostgreSQL (external, shared by aiFoundryBe, adkBeApp, aiFoundryWorkflows)

  adkBeApp ──► AI Services: LiteLLM (AI gateway), memory service
  aiFoundryWorkflows ──► AI Services: Temporal; workspaceService (own PostgreSQL)
  secretStoreService ──► AI Services: OpenBao
  aiFoundryBe ──► AI Services: Langfuse, Prometheus (read)
  aiFoundryBff ──► catalogUrl / authzUrl / AI Services (token exchange)
```

The Envoy gateway validates JWT tokens on every request using the Keycloak realm OIDC metadata. Unauthenticated users are redirected to `authtoolBff`, which initiates the PKCE authorization code flow. Once authenticated, the website communicates with `aiFoundryBff` and `adkBeApp` to run and monitor AI agents.

## Token exchange and authorization context

`authtoolBff` runs four OIDC clients: `website` (browser login/logout), `exchangeCatalog` (token-exchange client aliased `catalog-api`), `exchangeAuthz` (token-exchange client aliased `authz-api`), and `exchangeAiServices` (token-exchange client aliased `ai-services-api`). `aiFoundryBff` uses the exchanged tokens to call the Catalog API (`catalogUrl`) and an external Authz API (`authzUrl`, e.g. the `services` chart's `rbacManagement` component) on the user's behalf, optionally routed through `authtoolBffUrl` for cross-cluster calls. Calls to AI Services (memory service, Docling, metrics) use the `aiServicesClientId` exchange (`ai-services-api`), because the AI Services gateway accepts only tokens issued for its audience.

Separately, `accessControl` can enrich its own policy evaluation with external authorization context fetched from `authzUrl`, authenticating as its own OIDC client (backed by `secrets.accessControlKeys`).

## Relationships with other Mia Platform products

AI Foundry integrates with several external systems and other Mia Platform products:

| Product / System | Integration | Configuration key |
|---|---|---|
| **Keycloak** | OIDC authentication. `authtoolBff` performs the PKCE flow with the Keycloak realm; Envoy validates JWTs against the realm's JWKS endpoint. | `authorizationServer.issuer` |
| **Mia Platform Catalog** | The AI Foundry website links to the Catalog for navigating platform components and marketplace items. When `catalogUrl` is set, `aiFoundryBff` and `adkBeApp` call the Catalog API using a token-exchange client; when it is empty, `aiFoundryBe` serves the items from PostgreSQL. | `catalogUrl`, `catalogClientId`, `aiFoundryWebsite.config.links.catalogHref` |
| **Services (Homepage / RBAC management)** | The website links back to the Mia Platform homepage. `aiFoundryBff` and `accessControl` can also call an external Authz API (e.g. the `services` chart's `rbacManagement` component, via its `apiGateway`) for authorization context. | `aiFoundryWebsite.config.links.homepageHref`, `authzUrl`, `authzClientId`, `accessControl.config.externalContext.*` |
| **Console** | A direct link to the Mia Platform Console is configurable in the website. | `aiFoundryWebsite.config.links.consoleHref` |
| **Mia Flow** | A direct link to Mia Flow for AI workflow authoring is configurable in the website. | `aiFoundryWebsite.config.links.miaFlowHref` |
| **AI Services** | Required. Provides the LiteLLM AI gateway used by `adkBeApp`, the Temporal engine used by `aiFoundryWorkflows`, the OpenBao store behind `secretStoreService`, the Docling route, the memory service, and the Langfuse and Prometheus stores read by the observability screens. | `adkBeApp.config.litellmProxyApiBase`, `aiFoundryWorkflows.config.temporalAddress`, `secretStoreService.config.storeAddr`, `apiGateway.docling.url`, `aiServicesClientId` |
| **PostgreSQL** | `adkBeApp`, `aiFoundryBe` and `aiFoundryWorkflows` share one external PostgreSQL database; `workspaceService` needs a database of its own. | `secrets.adkBeAppKeys`, `secrets.aiFoundryBeKeys`, `secrets.aiFoundryWorkflowsKeys`, `secrets.workspaceServiceKeys` (`postgresConnectionString`) |

Refer to the following installation guides to set up the required dependencies before installing AI Foundry:

- [Keycloak installation guide](/requirements/installation-guidelines/shared-services/authn/keycloak/15_getting-started.md)
- [Realm Management guide](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/15_getting-started.md)
- [AI Services installation guide](/requirements/installation-guidelines/ai-services/10_overview.md)

## Deployment models

| Model | When to use |
|---|---|
| **Standalone chart** | Install the `ai-foundry` chart directly with a custom `values.yaml`. Suitable for single-environment setups or quick evaluations. |
| **`ai-foundry-deployment` wrapper** | Use the wrapper repository that declares the chart as a Helm dependency (alias `aiFoundry`) and provides per-environment values files (`values/production.yaml`, `values/development.yaml`, etc.). Recommended for multi-environment GitOps workflows. |
