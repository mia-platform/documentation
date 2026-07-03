---
title: Overview
sidebar_label: Overview
---

# Installation Guidelines

This section provides Helm chart installation guides for each component of the Mia Platform v15 product suite in self-hosted and BYOI deployments.

For the infrastructure model overview, distribution responsibility breakdown, and the shared infrastructure requirements matrix (PostgreSQL, Kafka, Redis, etc. per product), refer to the [Infrastructure Overview](/requirements/overview.md).

## Required tooling

The following tools must be available on the operator's workstation before installing any product chart:

| Tool | Minimum version | Notes |
|---|---|---|
| [kubectl](https://kubernetes.io/docs/tasks/tools/) | — | Configured to access the target cluster. |
| [Helm](https://helm.sh/docs/intro/install/) | v3 | |
| [helm-secrets](https://github.com/jkroepke/helm-secrets) *(optional)* | — | Required only when using SOPS-encrypted values files, as in the `*-deployment` wrapper repositories. |
| Kubernetes cluster | 1.23+ | |
| [Traefik](https://doc.traefik.io/traefik/) | — | Required for `IngressRoute` resources. Other ingress controllers can be used but require custom configuration. |
| Container registry access | — | Credentials for `nexus.mia-platform.eu`, provided by Mia Platform. |

## Installation map

The only hard sequencing constraint across the entire suite is that the **Auth tooling layer** (Keycloak + Realm Management) must be operational before any product chart is installed — all products require a valid OIDC issuer URL at install time.

Among the business products, the only installation-time dependency is between **AI Foundry** and **Catalog**: AI Foundry integrates with the Catalog for agent context and navigation, so Catalog must be deployed first.

```
┌──────────────────────────────────────────────────────────────────────┐
│  1 — Auth tooling  (prerequisite for all products)                   │
│                                                                      │
│       Keycloak  ──►  Realm Management                                │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
   │  2 — Console     │  │  2 — Homepage    │  │  2 — Catalog     │
   │                  │  │      & RBAC      │  │                  │
   └──────────────────┘  └──────────────────┘  └────────┬─────────┘
                                                         │
                                             ┌───────────▼──────────┐
                                             │  3 — AI Foundry      │
                                             │  (requires Catalog)  │
                                             └──────────────────────┘
```

Console, Homepage & RBAC, and Catalog are fully independent of each other — they can be installed in any order after the Auth tooling is ready.

## Product index

| Product | Helm chart | Deployment wrapper | Documentation |
|---|---|---|---|
| **Auth tooling — Keycloak** | `keycloak-operator` | — | [Overview](/requirements/installation-guidelines/authn/keycloak/10_overview.md) · [Getting Started](/requirements/installation-guidelines/authn/keycloak/15_getting-started.md) |
| **Auth tooling — Realm Management** | `keycloak-dev-realms` | — | [Overview](/requirements/installation-guidelines/authn/keycloak-realm-management/10_overview.md) · [Getting Started](/requirements/installation-guidelines/authn/keycloak-realm-management/15_getting-started.md) |
| **Console** | `console` | `paas-console-deployment` | [Overview](/requirements/installation-guidelines/console/infrastructure_overview.md) · [Getting Started](/requirements/installation-guidelines/console/self-hosted/15_getting-started.md) |
| **Homepage & RBAC** | `services` | `services-deployment` | [Overview](/requirements/installation-guidelines/services/10_overview.md) · [Getting Started](/requirements/installation-guidelines/services/15_getting-started.md) |
| **Catalog** | `catalog` | `catalog-deployment` | [Overview](/requirements/installation-guidelines/catalog/10_overview.md) · [Getting Started](/requirements/installation-guidelines/catalog/15_getting-started.md) |
| **AI Foundry** | `ai-foundry` | `ai-foundry-deployment` | [Overview](/requirements/installation-guidelines/ai-foundry/10_overview.md) · [Getting Started](/requirements/installation-guidelines/ai-foundry/15_getting-started.md) |
