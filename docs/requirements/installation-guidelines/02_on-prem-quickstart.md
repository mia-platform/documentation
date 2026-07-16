---
title: On-Prem Quickstart
sidebar_label: On-Prem Quickstart
---

# On-Prem Quickstart

## The `on-prem-deployment` umbrella repository

If you want to bootstrap a full self-hosted Mia Platform installation without assembling the per-product wrapper repositories yourself, Mia-Platform maintains an **umbrella repository** that packages every product chart as a Helm dependency, pre-wired in the correct installation order.

:::info Work in progress
`on-prem-deployment` is still evolving: **Console** is not yet integrated as a dependency. Until it lands, install Console separately following the [Console installation guide](/requirements/installation-guidelines/console/self-hosted/15_getting-started.md), then come back to this repo for the rest of the suite.
:::

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

What the repository adds on top is a single **root `Makefile`** that includes a `tools.mk` per component and exposes one target per step (`010_keycloak`, `020_keycloak_realms`, `030_home`, `040_catalog`, `050_ai_foundry`). Each target runs `helm upgrade --install` against the corresponding `charts/<product>/values.yaml` (plus any local secrets file), in the right dependency order — so the whole suite can be installed with a handful of ordered `make` calls instead of cloning and running five separate repositories by hand.

This does **not** replace the per-product documentation: every dependency is the exact same chart described in the [Installation Guidelines](/requirements/installation-guidelines/00_overview.md), and the `values.yaml` of each `charts/<product>/` folder still needs the same information (Keycloak realm, secrets, PostgreSQL/Kafka/Redis connection details, etc.) documented in each product's Getting Started guide. Use this page as the **procedural fast path**; use the per-product pages as the **reference** for every field and secret.

## Prerequisites

Before starting, make sure you have everything listed in the [Requirements overview](/requirements/overview.md) and in the [Installation Guidelines overview](/requirements/installation-guidelines/00_overview.md):

- An external **IdP** to federate with the Keycloak instance.
- An external **PostgreSQL** instance, reachable from the cluster.
- Image pull credentials for the private container registry.
- A **Kafka** cluster (optional, only required by Catalog, can also be deployed embedded via Strimzi).
- `kubectl`, `Helm` v3, and (optionally) `helm-secrets` on the operator's workstation.

## Procedure

### Step 1: Clone the repository

```bash
git clone https://github.com/mia-platform/on-prem-deployment.git
cd on-prem-deployment
```

### Step 2: Configure values per component

Each component has its own `values.yaml` under `charts/<product>/` (e.g. `charts/catalog/values.yaml`, scoped under the `catalog:` key). Populate each file using the **Getting Started** guide of the corresponding product:

- [Keycloak](/requirements/installation-guidelines/shared-services/authn/keycloak/15_getting-started.md)
- [Keycloak Realm Management](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/15_getting-started.md)
- [Homepage & RBAC (`services`)](/requirements/installation-guidelines/shared-services/services/15_getting-started.md)
- [Catalog](/requirements/installation-guidelines/catalog/15_getting-started.md)
- [AI Foundry](/requirements/installation-guidelines/ai-foundry/15_getting-started.md)

Create the secrets required by each component (as described in the guides above) in their respective namespaces before running the corresponding `make` target.

### Step 3: Install the shared services layer

As in the [Installation Guidelines](/requirements/installation-guidelines/00_overview.md#installation-map), the **shared services layer** covers both the auth tooling and Homepage & RBAC — install them in this order:

```bash
make 010_keycloak          # auth tooling: deploys Keycloak
make 020_keycloak_realms   # auth tooling: configures the master realm and the production realm
make 030_home              # Homepage & RBAC (services)
```

### Step 4: Install the products

```bash
make 040_catalog     # Context Catalog
make 050_ai_foundry   # AI Foundry (depends on Catalog)
```

Console is not yet part of this umbrella: install it separately for now, following the [Console installation guide](/requirements/installation-guidelines/console/self-hosted/15_getting-started.md). Once Console lands as a dependency, an additional ordered target (e.g. `060_console`) will be documented here.

### Step 5: Verify the installation

Check that every workload is running and that each product is reachable via its configured hostname, then follow the [Namespace and DNS Layout](/requirements/installation-guidelines/01_namespaces-and-dns.md) guidance for any additional environment you plan to roll out.

## When to use this vs. the per-product wrapper repositories

| Approach | Best for |
|---|---|
| `on-prem-deployment` umbrella repo | A single self-hosted cluster where you want every product wrapper chart in one repository, driven by a single ordered `make` sequence, without cloning and coordinating five separate repositories. |
| Per-product `*-deployment` wrapper repositories | Multi-environment GitOps setups where each product is released independently, with its own values-per-environment files and release cadence. |

Both approaches install the exact same underlying charts — pick whichever matches your operating model.
