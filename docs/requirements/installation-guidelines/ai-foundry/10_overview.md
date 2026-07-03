---
title: AI Foundry Overview
sidebar_label: Overview
---

# AI Foundry

AI Foundry is a Mia Platform product for managing and deploying AI agent applications. It provides a web interface for interacting with AI agents, orchestrates agent execution via [Google Cloud ADK](https://google.github.io/adk-docs/) and Vertex AI, manages user sessions through Keycloak OIDC, and collects agent execution traces for observability.

## What the chart deploys

| Component | Image | Description |
|---|---|---|
| **adkBeApp** | `ai-foundry/adk-be-app` | ADK Backend App. Orchestrates AI agents using Google Cloud ADK and Vertex AI. Requires GCP credentials and a PostgreSQL database for agent state persistence. |
| **aiFoundryBff** | `ai-foundry/ai-foundry-bff` | AI Foundry BFF. Exposes the backend API consumed by the website. Connects to Tempo for agent trace collection and to PostgreSQL for persistence. |
| **aiFoundryWebsite** | `ai-foundry/ai-foundry-website` | Frontend web application. Provides the AI Foundry UI with configurable links to other Mia Platform products and external AI tools. |
| **apiGateway** | `cache/envoyproxy/envoy` | Envoy reverse proxy. Routes all inbound traffic and validates JWT tokens against the Keycloak JWKS endpoint on every request. |
| **authtoolBff** | `platform/auth/authtool/authtool-bff` | OIDC Backend-for-Frontend. Manages the PKCE login/logout flow with Keycloak and issues signed, encrypted session cookies to the browser. |
| **cache** | `redis` | Redis instance used by `authtoolBff` to store and encrypt session tokens. |
| **doclingService** | `docling-project/docling-serve-cpu` | *(Optional, CPU-intensive.)* Document ingestion and conversion service. Parses uploaded files for use as agent context. Disabled by default in lightweight environments. |

## Architecture overview

```
  Browser ──► IngressRoute (Traefik)
                    │
              apiGateway (Envoy)
                    │
       ┌────────────┼──────────────────────┐
       │            │                      │
  authtoolBff  aiFoundryBff         aiFoundryWebsite
       │            │
  cache (Redis)  adkBeApp ──────► Google Cloud (Vertex AI / ADK)
                    │
               PostgreSQL (external)
               doclingService (optional)

  aiFoundryBff ──► Tempo (external, OTEL traces)
```

The Envoy gateway validates JWT tokens on every request using the Keycloak realm OIDC metadata. Unauthenticated users are redirected to `authtoolBff`, which initiates the PKCE authorization code flow. Once authenticated, the website communicates with `aiFoundryBff` and `adkBeApp` to run and monitor AI agents.

## Relationships with other Mia Platform products

AI Foundry integrates with several external systems and other Mia Platform products:

| Product / System | Integration | Configuration key |
|---|---|---|
| **Keycloak** | OIDC authentication. `authtoolBff` performs the PKCE flow with the Keycloak realm; Envoy validates JWTs against the realm's JWKS endpoint. | `authorizationServer.issuer` |
| **Mia Platform Catalog** | The AI Foundry website links to the Catalog for navigating platform components and marketplace items. The ADK backend can connect to a specific catalog cluster. | `catalogUrl`, `catalogCluster`, `aiFoundryWebsite.config.links.catalogHref` |
| **Services (Homepage)** | The AI Foundry website includes a configurable link back to the Mia Platform homepage deployed by the `services` chart. | `aiFoundryWebsite.config.links.homepageHref` |
| **Console** | A direct link to the Mia Platform Console is configurable in the website. | `aiFoundryWebsite.config.links.consoleHref` |
| **Mia Flow** | A direct link to Mia Flow for AI workflow authoring is configurable in the website. | `aiFoundryWebsite.config.links.miaFlowHref` |
| **Google Cloud / Vertex AI** | `adkBeApp` runs AI agents using Google Cloud ADK. Requires a GCP project, a region, and a service account with Vertex AI permissions. | `adkBeApp.config.googleCloudProject`, `adkBeApp.config.googleCloudLocation`, `secrets.adkBeAppKeys` |
| **PostgreSQL** | `adkBeApp` and `aiFoundryBff` persist agent state and trace data in an external PostgreSQL database. | `secrets.adkBeAppKeys.postgresConnectionString`, `secrets.aiFoundryBffKeys.postgresPassword` |
| **Tempo (OpenTelemetry)** | `aiFoundryBff` ships agent execution traces to a Tempo backend. Authentication to Tempo is provided via a bearer token. | `aiFoundryBff.config.tempoBaseUrl`, `secrets.aiFoundryBffKeys.tempoAuthHeader` |

Refer to the following installation guides to set up the required dependencies before installing AI Foundry:

- [Keycloak installation guide](/requirements/installation-guidelines/authn/keycloak/15_getting-started.md)
- [Realm Management guide](/requirements/installation-guidelines/authn/keycloak-realm-management/15_getting-started.md)

## Deployment models

| Model | When to use |
|---|---|
| **Standalone chart** | Install the `ai-foundry` chart directly with a custom `values.yaml`. Suitable for single-environment setups or quick evaluations. |
| **`ai-foundry-deployment` wrapper** | Use the wrapper repository that declares the chart as a Helm dependency (alias `aiFoundry`) and provides per-environment values files (`values/production.yaml`, `values/development.yaml`, etc.). Recommended for multi-environment GitOps workflows. |
