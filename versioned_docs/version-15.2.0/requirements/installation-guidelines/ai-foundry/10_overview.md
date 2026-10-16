---
id: overview
title: AI Foundry Overview
sidebar_label: Overview
---

# AI Foundry

AI Foundry is a Mia Platform product for managing and deploying AI agent applications. It provides a web interface for interacting with AI agents, orchestrates agent execution via [Google ADK](https://google.github.io/adk-docs/), runs Agentic Workflows, and manages user sessions through Keycloak OIDC. It relies on [AI Services](/requirements/installation-guidelines/shared-services/ai-services/10_overview.md) for the AI gateway (LiteLLM), the workflow engine (Temporal), document conversion (Docling) and the memory service. It also needs an OpenBao secret store and can read traces and metrics from Langfuse and Prometheus.

:::info
The installation of Langfuse, OpenBao and Prometheus is not covered by these guides yet: we are working to provide the documentation to install these components as well.
:::

## What the chart deploys

| Component | Image | Description |
|---|---|---|
| **accessControl** | `platform/auth/access-control/ext-authz` | OPA-based ext-authz service. Enforces RBAC policies on every request forwarded by the API gateway. Fetches the external authorization context from Homepage & RBAC (`rbacAuthzServiceUrl` or `authzUrl`). |
| **adkBeApp** | `ai-foundry/adk-be-app` | ADK Backend App. Orchestrates AI agents using Google ADK and calls the models through the LiteLLM AI gateway of AI Services. Requires a PostgreSQL database for agent state persistence. |
| **aiFoundryBe** | `ai-foundry/ai-foundry-be` | PostgreSQL-backed implementation of the Catalog item API and read API for the observability screens. Uses the same database as `adkBeApp`. |
| **aiFoundryBff** | `ai-foundry/ai-foundry-bff` | AI Foundry BFF. Exposes the backend API consumed by the website and calls the Catalog, Authz and AI Services APIs on the user's behalf via token exchange. |
| **aiFoundryMcp** | `ai-foundry/ai-foundry-mcp-server` | MCP server over the Catalog and Agentic Workflows, served at `{url}/foundry/mcp`. |
| **aiFoundryProvisioner** | `ai-foundry/ai-foundry-provisioner` | `post-install`/`post-upgrade` hook Job that seeds and migrates the AI Foundry resources of every tenant. |
| **aiFoundryWorkflows** | `ai-foundry/ai-foundry-workflows` | Agentic Workflows engine: a REST API and a Temporal worker. Temporal is provided by AI Services. |
| **aiFoundryWebsite** | `ai-foundry/ai-foundry-website` | Frontend web application. Provides the AI Foundry UI with configurable links to other Mia Platform products and external AI tools. |
| **apiGateway** | `cache/envoyproxy/envoy` | Envoy reverse proxy. Routes all inbound traffic and validates JWT tokens against the Keycloak JWKS endpoint on every request. |
| **authtoolBff** | `platform/auth/authtool/authtool-bff` | OIDC Backend-for-Frontend. Manages the PKCE login/logout flow with Keycloak and issues signed, encrypted session cookies to the browser. Also runs three token-exchange clients used to call the Catalog, Authz and AI Services APIs. |
| **cache** | `redis` | Redis instance used by `authtoolBff` to store and encrypt session tokens. |
| **redis** | `redis` | Shared application Redis of the AI Foundry services, used as a cache (no persistence). |
| **secretStoreService** | `ai-resources/secret-store-service` | Credential store in front of OpenBao for the connections and keys configured in AI Foundry. |
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
  secretStoreService ──► OpenBao
  aiFoundryBe ──► Langfuse, Prometheus (read, optional)
  aiFoundryBff ──► catalogUrl / authzUrl / AI Services (token exchange)
```

The Envoy gateway validates JWT tokens on every request using the Keycloak realm OIDC metadata. Unauthenticated users are redirected to `authtoolBff`, which initiates the PKCE authorization code flow. Once authenticated, the website communicates with `aiFoundryBff` and `adkBeApp` to run and monitor AI agents.

## Token exchange and authorization context

`authtoolBff` runs four OIDC clients: `website` (browser login/logout), `exchangeCatalog` (token-exchange client aliased `catalog-api`), `exchangeAuthz` (token-exchange client aliased `authz-api`), and `exchangeAiServices` (token-exchange client aliased `ai-services-api`). `aiFoundryBff` uses the exchanged tokens to call the Catalog API (`catalogUrl`) and the authorization API of Homepage & RBAC (`authzUrl`, the `services` chart's `rbacManagement` component) on the user's behalf. The services reach `authtool-bff` at `authtoolBffUrl` (for example `http://authtool-bff`): the token exchange happens only when it is set, otherwise the caller's token is forwarded unchanged. Calls to AI Services (memory service, Docling, central secret store) use the `aiServicesClientId` exchange (`ai-services-api`), because the AI Services gateway accepts only tokens issued for its audience: without `authtoolBffUrl` and `aiServicesClientId` these calls are refused.

Separately, `accessControl` enriches its own policy evaluation with external authorization context fetched from Homepage & RBAC (`rbacAuthzServiceUrl` or `authzUrl`), authenticating as its own OIDC client (backed by `secrets.accessControlKeys`).

## Relationships with other Mia Platform products

AI Foundry integrates with several external systems and other Mia Platform products:

| Product / System | Integration | Configuration key |
|---|---|---|
| **Keycloak** | OIDC authentication. `authtoolBff` performs the PKCE flow with the Keycloak realm; Envoy validates JWTs against the realm's JWKS endpoint. | `authorizationServer.issuer` |
| **Mia Platform Catalog** | The AI Foundry website links to the Catalog for navigating platform components and marketplace items. When `catalogUrl` is set, `aiFoundryBff` and `adkBeApp` call the Catalog API using a token-exchange client; when it is empty, `aiFoundryBe` serves the items from PostgreSQL. | `catalogUrl`, `catalogClientId` |
| **Homepage & RBAC (`services`)** | Required. `aiFoundryBff`, `aiFoundryBe`, `aiFoundryProvisioner` and `accessControl` call its authorization API (the `rbacManagement` component, via its `apiGateway`) for users, tenants, roles and permissions. It also serves the product configuration of the organization, from which the website menu takes the links to the other products. | `authzUrl`, `rbacAuthzServiceUrl`, `authzClientId`, `accessControl.config.externalContext.*` |
| **Console** | The website menu links to the Console when it is enabled in the product configuration of the organization. | Product configuration of the organization (Homepage & RBAC) |
| **Mia Flow** | The website menu links to Mia Flow when it is enabled in the product configuration of the organization. | Product configuration of the organization (Homepage & RBAC) |
| **AI Services** | Required. Provides the LiteLLM AI gateway used by `adkBeApp` (and administered by `aiFoundryBe` for model providers, model catalogue and spend), the Temporal engine used by `aiFoundryWorkflows`, the Docling route and the memory service. | `adkBeApp.config.litellmProxyApiBase`, `aiFoundryBe.config.litellmBaseUrl`, `aiFoundryWorkflows.config.temporalAddress`, `apiGateway.docling.url`, `authtoolBffUrl`, `aiServicesClientId` |
| **OpenBao** | Required. Secret store behind `secretStoreService`. | `secretStoreService.config.*`, `secrets.secretStoreServiceKeys` |
| **Langfuse / Prometheus** | Optional. Trace and metric stores read by the observability screens. | `aiFoundryBe.config.langfuseBaseUrl`, `aiFoundryBe.config.prometheusBaseUrl`, `adkBeApp.config.langfuseBaseUrl`, `adkBeApp.config.prometheusBaseUrl` |
| **PostgreSQL** | `adkBeApp`, `aiFoundryBe` and `aiFoundryWorkflows` share one external PostgreSQL database; `workspaceService` needs a database of its own. | `secrets.adkBeAppKeys`, `secrets.aiFoundryBeKeys`, `secrets.aiFoundryWorkflowsKeys`, `secrets.workspaceServiceKeys` (`postgresConnectionString`) |

Refer to the following installation guides to set up the required dependencies before installing AI Foundry:

- [Keycloak installation guide](/requirements/installation-guidelines/shared-services/authn/keycloak/15_getting-started.md)
- [Realm Management guide](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/15_getting-started.md)
- [Homepage & RBAC installation guide](/requirements/installation-guidelines/shared-services/services/15_getting-started.md)
- [AI Services installation guide](/requirements/installation-guidelines/shared-services/ai-services/10_overview.md)

## Deployment models

| Model | When to use |
|---|---|
| **Standalone chart** | Install the `ai-foundry` chart directly with a custom `values.yaml`. Suitable for single-environment setups or quick evaluations. |
| **`ai-foundry-deployment` wrapper** | Use the wrapper repository that declares the chart as a Helm dependency (alias `aiFoundry`) and provides per-environment values files (`values/production.yaml`, `values/development.yaml`, etc.). Recommended for multi-environment GitOps workflows. |
