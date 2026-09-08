---
id: on-prem-quickstart
title: On-Prem Quickstart
sidebar_label: On-Prem Quickstart
---

# On-Prem Quickstart

## The `on-prem-charts` reference repository

Mia-Platform maintains `on-prem-charts`, a repository that packages every product chart of the suite as a set of pre-wired Helm dependencies, in the correct installation order. It runs on a **local cluster** (e.g. via `kind`) and is meant to be used as a **reference implementation**: a concrete, working example of how the whole suite fits together, to take as a **blueprint** when planning an actual on-premise installation — not as a repository to deploy as-is against a production cluster.

> Repository: [github.com/mia-platform/on-prem-charts](https://github.com/mia-platform/on-prem-charts)

## What it is

`on-prem-charts` is **not** a single umbrella chart with one shared `values.yaml`. It's a repository that bundles, under `charts/<product>/`, one small wrapper chart per component — each with its **own** `Chart.yaml` (declaring the real product chart as a Helm dependency) and its **own** `values.yaml`:

| Order | Component | Wrapper folder |
|---|---|---|
| 1 | Keycloak | `charts/keycloak` |
| 2 | Keycloak Realms | `charts/keycloak-realms` |
| 3 | Services (Homepage & RBAC) | `charts/services` |
| 4 | Catalog | `charts/catalog` |
| 5 | AI Foundry | `charts/ai-foundry` |
| 6 | Console | `charts/console` |

A root `Makefile` orchestrates the installation of every component in dependency order, wrapping `helm upgrade --install` for each `charts/<product>/` folder against its `values.yaml` (plus any local secrets file). This does **not** replace the per-product documentation: every dependency is the exact same chart described in the [Installation Guidelines](/requirements/installation-guidelines/00_overview.md); for the configuration, secrets, and values of a specific chart, use its dedicated section in these Installation Guidelines.

## What this repository is *not*

The repository also ships local-cluster provisioning tooling (a `hacks/` folder and dedicated `Makefile` targets) to stand up a throwaway `kind` cluster. That tooling is **not** part of the product suite — it only stands in for infrastructure you are expected to already have in your real environment. See the repository's own `docs/` folder (linked below) for the full detail, including which default settings are dev-only and must be reconsidered before production.

## Prerequisites and installation procedure

`on-prem-charts` ships its own `docs/` folder, kept in sync with the Makefile and the chart wrappers in the same repository. Refer to it for the up-to-date prerequisites and the step-by-step procedure (cloning the repo, configuring the `values.yaml` of each component, and running the ordered `make` targets), rather than to a copy of those steps here — this avoids two sources of truth drifting apart as the repository evolves.

## When to use this vs. the per-product wrapper repositories

| Approach | Best for |
|---|---|
| `on-prem-charts` | Learning/evaluating the suite end-to-end on a local cluster, or as a blueprint to plan your own on-premise installation. |
| Per-product `*-deployment` wrapper repositories | Production self-hosted rollouts: multi-environment GitOps workflows, each product released independently with its own per-environment values files and release cadence. |

Both approaches install the exact same underlying charts — `on-prem-charts` is a reference and starting point, not a substitute for a properly configured production deployment.
