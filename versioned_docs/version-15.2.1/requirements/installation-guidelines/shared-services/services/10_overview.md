---
id: overview
title: Services Overview
sidebar_label: Overview
---

# Services: Homepage & RBAC Layer

The `services` Helm chart deploys the core infrastructure that powers the **Mia Platform homepage** and the **authentication and authorization layer** that protects it.

Every user who accesses the Mia Platform interface is routed through this stack: they are authenticated via Keycloak, their session is managed by `authtool-bff`, their requests are authorized by `access-control` (OPA-based ext-authz), and served by an Envoy API gateway.

## What the chart deploys

| Component | Image | Description |
|---|---|---|
| **apiGateway** | `envoyproxy/envoy` | Envoy reverse proxy. Routes all inbound traffic and delegates per-request authorization checks to `accessControl`. |
| **accessControl** | `platform/auth/access-control/ext-authz` | OPA-based ext-authz service. Enforces RBAC policies on every request forwarded by the API gateway. |
| **authtoolBff** | `platform/auth/authtool/authtool-bff` | OIDC Backend-for-Frontend. Manages the PKCE login/logout flow with Keycloak and issues signed, encrypted session cookies to the browser. |
| **cache** | `redis` | Redis instance used by `authtool-bff` to store and encrypt session tokens. |
| **homepageWebsite** | `console/homepage` | Mia Platform homepage frontend application, served at the configured `url`. |
| **rbacManagement** | `platform/services/rbac-management` | RBAC administration API (REST + gRPC). Manages roles, permissions, and product access backed by an external PostgreSQL database. Routed through the `apiGateway` alongside the other services. |
| **adkBeApp** | `ai-foundry/adk-be-app` | ADK Backend App. The same AI agent orchestration component used by Catalog and AI Foundry. Enabled by default: it reads its agents from the Catalog (`adkBeApp.config.catalogApiUrl` is required) and, by default, calls the models through the [AI Services](/requirements/installation-guidelines/shared-services/ai-services/10_overview.md) LiteLLM gateway. Can be disabled via `adkBeApp.enabled: false` if not needed at the Homepage level. |
| **swaggerAggregator** | `core/swagger-aggregator` | *(Optional, disabled by default.)* Aggregates OpenAPI specs from projects and exposes them in a unified API portal. |

The chart no longer deploys a Docling service. Document parsing for chat attachments is provided by [AI Services](/requirements/installation-guidelines/shared-services/ai-services/10_overview.md): set `apiGateway.docling.url` to route `/api/docling/` to it.

## Architecture overview

```
  Browser ──► IngressRoute
                   │
             apiGateway (Envoy)
                   │
          ┌────────┼───────────────────────────────────┐
          │        │                                   │
   accessControl   authtoolBff    homepageWebsite   rbacManagement
   (ext-authz)      │                                   │
                   cache (Redis)                 PostgreSQL (external)
                       │
              Keycloak (external)
```

The Envoy gateway evaluates every incoming request against the `accessControl` ext-authz service before forwarding it. For unauthenticated requests, `authtool-bff` initiates the OIDC authorization code flow (PKCE) with the configured Keycloak realm and returns a session cookie upon successful login.

## Relationship with Keycloak

The `services` chart connects to an **external Keycloak instance**. You need to provide:

1. **The Keycloak realm issuer URL** via `authorizationServer.issuer`, used by Envoy and `authtool-bff` to discover OIDC endpoints and validate tokens.
2. **An OIDC client** in Keycloak for `authtool-bff`, configured with:
   - Redirect URIs pointing to `<url>/callback` (and `<url>/silent-callback` for silent renew).
   - The token endpoint authentication method matching `authtoolBff.tokenAuthMethod` (`private_key_jwt` by default; the client's JWKS URI must be registered in Keycloak).

Refer to the [Keycloak installation guide](/requirements/installation-guidelines/shared-services/authn/keycloak/15_getting-started.md) and the [Realm Management guide](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/15_getting-started.md) to set up your Keycloak instance and configure the realm.

## SCIM endpoints

Starting from Mia-Platform v15.2.0, the API gateway exposes the SCIM 2.0 endpoints served by `rbacManagement`, used by external Identity Providers to provision users and groups automatically — see [Automatic Provisioning via SCIM](/products/mia-platform-suite/scim_provisioning.md).

| Path | Authorization |
|---|---|
| `/api/scim/v2/tenants/<tenant>/ServiceProviderConfig`, `/ResourceTypes`, `/Schemas` | Public (SCIM discovery). |
| `/api/scim/v2/tenants/<tenant>/Users` and `/Users/<id>` | Requires the `urn:mia-platform-internal:role:authz:provisioning:users` role. |
| `/api/scim/v2/tenants/<tenant>/Groups` and `/Groups/<id>` | Requires the `urn:mia-platform-internal:role:authz:provisioning:groups` role. |
| `/api/audit/scim/events` | Requires the Super Admin role. Lists the SCIM events received by the platform. |

The provisioning roles are held by the `scim-client` service account created by the [Realm Management chart](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/10_overview.md#scim-provisioning-client). No additional value of the `services` chart is required to enable the SCIM endpoints.

## Deployment models

| Model | When to use |
|---|---|
| **Standalone chart** | Install the `services` chart directly with a custom `values.yaml`. Suitable for single-environment setups. |
| **`services-deployment` wrapper** | Use the wrapper repository that declares the chart as a Helm dependency and provides per-environment values files (`values/production.yaml`, `values/development.yaml`, etc.). Recommended for multi-environment GitOps workflows. |
