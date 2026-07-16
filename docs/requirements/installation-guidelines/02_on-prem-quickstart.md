---
title: On-Prem Quickstart
sidebar_label: On-Prem Quickstart
---

# On-Prem Quickstart

## The `on-prem-charts` reference repository

Mia-Platform maintains `on-prem-charts`, a repository that packages every product chart of the suite as a set of pre-wired Helm dependencies, in the correct installation order. It runs on a **local cluster** (e.g. via `kind`) and is meant to be used as a **reference implementation**: a concrete, working example of how the whole suite fits together, to take as a **blueprint** when planning an actual on-premise installation — not as a repository to deploy as-is against a production cluster.

> Repository: [github.com/mia-platform/on-prem-charts](https://github.com/mia-platform/on-prem-charts)

## What it is

`on-prem-charts` is **not** a single umbrella chart with one shared `values.yaml`. It's a repository that bundles, under `charts/<product>/`, one small wrapper chart per component — the same pattern used today by the per-product `*-deployment` repositories — each with its **own** `Chart.yaml` (declaring the real product chart as a Helm dependency) and its **own** `values.yaml`:

| Order | Wrapper folder | Chart dependency | Purpose |
|---|---|---|---|
| 1 | `charts/keycloak` | `keycloak-operator` | Auth tooling — Keycloak instance |
| 2 | `charts/keycloak-realms` | `keycloak-realm-management` | Auth tooling — realm/client provisioning |
| 3 | `charts/services` | `services` | Homepage & RBAC management |
| 4 | `charts/catalog` | `catalog` | Context Catalog product |
| 5 | `charts/ai-foundry` | `ai-foundry` | AI Foundry product |
| 6 | `charts/console` | `mia-console` | Console product |

What the repository adds on top is a single **root `Makefile`** that includes a `tools.mk` per component and exposes one target per step (`010_keycloak`, `020_keycloak_realms`, `030_home`, `040_catalog`, `050_ai_foundry`, `060_console`). Each target runs `helm upgrade --install` against the corresponding `charts/<product>/values.yaml` (plus any local secrets file), in the right dependency order, against the local cluster — giving you an end-to-end working example of the whole suite before you replicate the same approach on your own infrastructure.

This does **not** replace the per-product documentation: every dependency is the exact same chart described in the [Installation Guidelines](/requirements/installation-guidelines/00_overview.md), and the `values.yaml` of each `charts/<product>/` folder mirrors the same information (Keycloak realm, secrets, PostgreSQL/Kafka/Redis connection details, etc.) documented in each product's Getting Started guide. For the details of a specific chart, refer to its dedicated section in these Installation Guidelines.

## Prerequisites and installation procedure

`on-prem-charts` ships its own `docs/` folder, kept in sync with the Makefile and the chart wrappers in the same repository. Refer to it for the up-to-date prerequisites and the step-by-step procedure to run it locally (cloning the repo, configuring the `values.yaml` of each component, and running the ordered `make` targets), rather than to a copy of those steps here — this avoids two sources of truth drifting apart as the repository evolves.

## When to use this

| Use case | Why |
|---|---|
| **Learning / evaluating the suite** | Spin up the whole product suite on a local cluster in a few `make` commands, without provisioning any real infrastructure. |
| **Planning an on-premise installation** | Use the repository's structure, chart ordering, and `values.yaml` files as a blueprint: replicate the same approach against your real cluster and infrastructure, adapting values, secrets, and resource sizing to your environment. |
| **Production self-hosted rollout** | Use the per-product `*-deployment` wrapper repositories instead, which are designed for multi-environment GitOps workflows with per-environment values files and independent release cadence. |

Both approaches install the exact same underlying charts — `on-prem-charts` is a reference and starting point, not a substitute for a properly configured production deployment.
