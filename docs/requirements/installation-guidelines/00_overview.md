---
title: Overview
sidebar_label: Overview
---

# Installation Guidelines

This section provides Helm chart installation guides for each component of the Mia Platform v15 product suite in self-hosted and BYOI deployments.

For the infrastructure model overview, distribution responsibility breakdown, and the shared infrastructure requirements matrix (PostgreSQL, Kafka, Redis, etc. per product), refer to the [Infrastructure Overview](/requirements/overview.md).

## Required tooling

The following tools must be available on the operator's workstation before installing any product chart:

| Tool | Version | Notes |
|---|---|---|
| [kubectl](https://kubernetes.io/docs/tasks/tools/) | — | Configured to access the target cluster. |
| [Helm](https://helm.sh/docs/intro/install/) | v3 | |
| [helm-secrets](https://github.com/jkroepke/helm-secrets) *(optional)* | — | Required only when using SOPS-encrypted values files, as in the `*-deployment` wrapper repositories. |
| Kubernetes cluster | 1.32 – 1.34 | |
| [Traefik](https://doc.traefik.io/traefik/) | — | Required for `IngressRoute` resources. Other ingress controllers can be used but require custom configuration. |
| Container registry access | — | Credentials for `nexus.mia-platform.eu`, provided by Mia Platform. |

## Installation map

All components in the **shared services layer** must be operational before any product chart is installed.

Within the shared services layer, **Auth tooling** (Keycloak + Realm Management) must come first: it provides the OIDC issuer URL required by every other component. **Homepage & RBAC** follows: it provides the authorization service (`authtool-bff`) and the OPA-based access control layer that both Console and Catalog depend on.

Once the shared services layer is running, **Console** and **Catalog** can be installed in parallel. AI Foundry depends on Catalog (shared agent backend and navigation links) and must be installed last.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Shared services layer                                               │
│                                                                      │
│  1 — Auth tooling  (prerequisite for all)                            │
│       Keycloak  ──►  Realm Management                                │
│                              │                                       │
│                              ▼                                       │
│  2 — Homepage & RBAC  (gateway + authorization layer)                │
└────────────────────────────────┬─────────────────────────────────────┘
                                 ▼
                    ┌────────────┴─────────────┐
                    ▼                          ▼
         ┌──────────────────┐         ┌──────────────────┐
         │  3 — Console     │         │  3 — Catalog     │
         └──────────────────┘         └────────┬─────────┘
                                               ▼
                                   ┌────────────────────────┐
                                   │  4 — AI Foundry        │
                                   │  (requires Catalog)    │
                                   └────────────────────────┘
```
## Component index

:::tip Before you start — Auth architecture
If this is your first self-hosted Mia Platform installation, read the [Authentication Architecture overview](/requirements/installation-guidelines/shared-services/authn/10_overview.md) and the [Federation Strategies guide](/requirements/installation-guidelines/shared-services/authn/20_federation-strategies.md) before touching any product chart. These decisions (realm layout, IdP federation model) propagate to every product's `configurations.keycloak` block.
:::

### Shared services & tools

| Component | Helm chart | Deployment wrapper | Documentation |
|---|---|---|---|
| **Auth — Keycloak** | `keycloak-operator` | — | [Overview](/requirements/installation-guidelines/shared-services/authn/keycloak/10_overview.md) · [Getting Started](/requirements/installation-guidelines/shared-services/authn/keycloak/15_getting-started.md) |
| **Auth — Realm Management** | `keycloak-dev-realms` | — | [Overview](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/10_overview.md) · [Getting Started](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/15_getting-started.md) |
| **Homepage & RBAC** | `services` | `services-deployment` | [Overview](/requirements/installation-guidelines/shared-services/services/10_overview.md) · [Getting Started](/requirements/installation-guidelines/shared-services/services/15_getting-started.md) |

### Products

| Product | Helm chart | Deployment wrapper | Documentation |
|---|---|---|---|
| **Console** | `console` | `console-deployment` | [Overview](/requirements/installation-guidelines/console/infrastructure_overview.md) · [Getting Started](/requirements/installation-guidelines/console/self-hosted/15_getting-started.md) |
| **Catalog** | `catalog` | `catalog-deployment` | [Overview](/requirements/installation-guidelines/catalog/10_overview.md) · [Getting Started](/requirements/installation-guidelines/catalog/15_getting-started.md) |
| **AI Foundry** | `ai-foundry` | `ai-foundry-deployment` | [Overview](/requirements/installation-guidelines/ai-foundry/10_overview.md) · [Getting Started](/requirements/installation-guidelines/ai-foundry/15_getting-started.md) |
