---
title: On-Prem Quickstart
sidebar_label: On-Prem Quickstart
---

# On-Prem Quickstart

## The `on-prem-deployment` umbrella repository

If you want to bootstrap a full self-hosted Mia Platform installation without assembling the per-product wrapper repositories yourself, Mia-Platform maintains an **umbrella repository** that packages every product chart as a Helm dependency, pre-wired in the correct installation order.

> Repository: [github.com/mia-platform/on-prem-deployment](https://github.com/mia-platform/on-prem-deployment) *(placeholder URL, repository not yet public)*

## What it is

`on-prem-deployment` is **not** a single umbrella chart with one shared `values.yaml`. It's a repository that bundles, under `charts/<product>/`, one small wrapper chart per component — the same pattern used today by the per-product `*-deployment` repositories — each with its **own** `Chart.yaml` (declaring the real product chart as a Helm dependency) and its **own** `values.yaml`:

| Order | Wrapper folder | Chart dependency | Purpose |
|---|---|---|---|
| 1 | `charts/keycloak` | `keycloak-operator` | Auth tooling — Keycloak instance |
| 2 | `charts/keycloak-realms` | `keycloak-realm-management` | Auth tooling — realm/client provisioning |
| 3 | `charts/services` | `services` | Homepage & RBAC management |
| 4 | `charts/catalog` | `catalog` | Context Catalog product |
| 5 | `charts/ai-foundry` | `ai-foundry` | AI Foundry product |
| 6 | `charts/console` | `mia-console` | Console product |

What the repository adds on top is a single **root `Makefile`** that includes a `tools.mk` per component and exposes one target per step (`010_keycloak`, `020_keycloak_realms`, `030_home`, `040_catalog`, `050_ai_foundry`, `060_console`). Each target runs `helm upgrade --install` against the corresponding `charts/<product>/values.yaml` (plus any local secrets file), in the right dependency order — so the whole suite can be installed with a handful of ordered `make` calls instead of cloning and running six separate repositories by hand.

This does **not** replace the per-product documentation: every dependency is the exact same chart described in the [Installation Guidelines](/requirements/installation-guidelines/00_overview.md), and the `values.yaml` of each `charts/<product>/` folder still needs the same information (Keycloak realm, secrets, PostgreSQL/Kafka/Redis connection details, etc.) documented in each product's Getting Started guide. Use the per-product pages as the **reference** for every field and secret.

## Installation prerequisites and procedure

`on-prem-deployment` ships its own `docs/` folder, kept in sync with the Makefile and the chart wrappers in the same repository. Refer to it for the up-to-date prerequisites and the step-by-step installation procedure (cloning the repo, configuring the `values.yaml` of each component, and running the ordered `make` targets), rather than to a copy of those steps here — this avoids two sources of truth drifting apart as the repository evolves.

## When to use this vs. the per-product wrapper repositories

| Approach | Best for |
|---|---|
| `on-prem-deployment` umbrella repo | A single self-hosted cluster where you want every product wrapper chart in one repository, driven by a single ordered `make` sequence, without cloning and coordinating five separate repositories. |
| Per-product `*-deployment` wrapper repositories | Multi-environment GitOps setups where each product is released independently, with its own values-per-environment files and release cadence. |

Both approaches install the exact same underlying charts — pick whichever matches your operating model.
