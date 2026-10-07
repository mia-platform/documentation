---
id: index
title: Shared services & tools
sidebar_label: Shared services & tools
---

# Shared services & tools

This section covers the foundational platform-layer components that must be deployed before any Mia Platform product (Console, Catalog, AI Foundry). These components are not standalone business products; they form the shared infrastructure that authenticates users, enforces authorization, and exposes the platform entry point.

## Auth

The Auth section covers the identity and OIDC layer of the platform:

- **Keycloak**: deployed via the `keycloak-operator` Helm chart. It acts as an *Identity Broker* for the platform, supporting *OpenID Connect* and federating with external identity providers to authenticate platform users.
- **Realm Management**: the `keycloak-realm-management` chart that manages Mia Platform realm configuration declaratively via `keycloak-config-cli`.

Auth must be fully operational before any other component is installed.

[Go to Auth →](/requirements/installation-guidelines/shared-services/authn/10_overview.md)

## Homepage & RBAC

The Homepage & RBAC section covers the `services` Helm chart, which deploys the shared gateway and authorization layer:

- **Envoy API gateway**: routes all inbound traffic and delegates per-request authorization to the ext-authz service.
- **Access Control** (OPA-based ext-authz): enforces RBAC policies on every request. Console and Catalog both delegate authorization to this service.
- **authtool-bff**: the OIDC Backend-for-Frontend that manages browser sessions and PKCE flows with Keycloak.
- **Mia Platform homepage** frontend.

This layer must be running before installing Console or Catalog, both of which depend on `authtool-bff` for session management and on `access-control` for request authorization.

[Go to Homepage & RBAC →](/requirements/installation-guidelines/shared-services/services/10_overview.md)
