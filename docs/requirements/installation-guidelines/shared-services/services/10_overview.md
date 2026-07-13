---
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
| **swaggerAggregator** | `core/swagger-aggregator` | *(Optional, disabled by default.)* Aggregates OpenAPI specs from projects and exposes them in a unified API portal. |

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

## Deployment models

| Model | When to use |
|---|---|
| **Standalone chart** | Install the `services` chart directly with a custom `values.yaml`. Suitable for single-environment setups. |
| **`services-deployment` wrapper** | Use the wrapper repository that declares the chart as a Helm dependency and provides per-environment values files (`values/production.yaml`, `values/development.yaml`, etc.). Recommended for multi-environment GitOps workflows. |
