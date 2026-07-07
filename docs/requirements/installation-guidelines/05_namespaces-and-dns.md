---
id: namespaces-and-dns
title: Namespace and DNS Layout
sidebar_label: Namespace & DNS Layout
sidebar_position: 0.5
---

# Namespace and DNS Layout

This page describes the recommended Kubernetes namespace and DNS naming conventions for a Mia Platform v15 self-hosted installation.

The layout below reflects the Mia Platform SaaS reference topology. Self-hosted installations should adapt domain names and tier names to their own conventions, while keeping the logical separation between:

- a dedicated **Auth tooling cluster** (or namespace) for Keycloak
- one or more **product clusters** with separate namespaces per product per tier

## Naming conventions

### Namespace pattern

```
{product}-{tier}
```

Examples: `console-production`, `catalog-development`, `ai-foundry-preproduction`, `services-lts`.

Keycloak lives in its own `keycloak` namespace, independent of the product tier pattern.

### DNS pattern

```
{tier-prefix}.{product}.{cluster-domain}
```

The **production** tier has no prefix; the bare product subdomain is production (e.g. `catalog.cloud.example.com`). All other tiers use a short prefix (e.g. `dev.catalog.gcp.example.com`).

### Tier glossary

| Tier | Description |
|---|---|
| `production` | Live production traffic. No prefix in DNS. |
| `demo` | Persistent demo environment, production-like. |
| `preview` | Next-version preview / canary slot. |
| `lts` | Long-term support, pinned to a stable release. |
| `preproduction` | Staging environment mirroring production. |
| `development` | Active development / integration testing. |
| `experimental` | Feature branches and experimental builds. |

---

## Reference cluster topology (Mia Platform SaaS)

### Cluster `tools`: Auth tooling (production)

This cluster runs only Keycloak. It is isolated from product clusters to limit the blast radius of any Keycloak change and to allow independent operator/Keycloak upgrades.

#### Keycloak

| DNS | Namespace |
|---|---|
| `auth.tools.mia-platform.eu` | `keycloak` |

---

### Cluster `console`: Products (production tiers)

Hosts production, demo, and preview environments for all business products.

#### Console

| DNS | Tier | Namespace |
|---|---|---|
| `console.cloud.mia-platform.eu` | production | `console-production` |
| `demo.console.gcp.mia-platform.eu` | demo | `console-demo` |
| `next.console.cloud.mia-platform.eu` | preview | `console-preview` |

#### Catalog

| DNS | Tier | Namespace |
|---|---|---|
| `catalog.cloud.mia-platform.eu` | production | `catalog-production` |
| `demo.catalog.cloud.mia-platform.eu` | demo | `catalog-demo` |
| `next.catalog.cloud.mia-platform.eu` | preview | `catalog-preview` |

#### AI Foundry

| DNS | Tier | Namespace |
|---|---|---|
| `ai-foundry.cloud.mia-platform.eu` | production | `ai-foundry-production` |
| `demo.ai-foundry.cloud.mia-platform.eu` | demo | `ai-foundry-demo` |
| `next.ai-foundry.cloud.mia-platform.eu` | preview | `ai-foundry-preview` |

#### Homepage & RBAC (Services)

| DNS | Tier | Namespace |
|---|---|---|
| `home.cloud.mia-platform.eu` | production | `services-production` |
| `demo.home.cloud.mia-platform.eu` | demo | `services-demo` |
| `next.home.cloud.mia-platform.eu` | preview | `services-preview` |

---

### Cluster `console-noprod`: Products (non-production tiers)

Hosts LTS, preproduction, development, and experimental environments. Also runs the non-production Keycloak instance.

#### Keycloak (non-production)

| DNS | Namespace |
|---|---|
| `keycloak-dev.console.gcp.mia-platform.eu` | `keycloak` |

#### Console

| DNS | Tier | Namespace |
|---|---|---|
| `lts.console.gcp.mia-platform.eu` | lts | `console-lts` |
| `preprod.console.gcp.mia-platform.eu` | preproduction | `console-preproduction` |
| `test.console.gcp.mia-platform.eu` | development | `console-development` |
| `exp.console.gcp.mia-platform.eu` | experimental | `console-exp` |

#### Catalog

| DNS | Tier | Namespace |
|---|---|---|
| `lts.catalog.gcp.mia-platform.eu` | lts | `catalog-lts` |
| `preprod.catalog.gcp.mia-platform.eu` | preproduction | `catalog-preproduction` |
| `dev.catalog.gcp.mia-platform.eu` | development | `catalog-development` |
| `exp.catalog.gcp.mia-platform.eu` | experimental | `catalog-experimental` |

#### AI Foundry

| DNS | Tier | Namespace |
|---|---|---|
| `lts.ai-foundry.gcp.mia-platform.eu` | lts | `ai-foundry-lts` |
| `preprod.ai-foundry.gcp.mia-platform.eu` | preproduction | `ai-foundry-preproduction` |
| `dev.ai-foundry.gcp.mia-platform.eu` | development | `ai-foundry-development` |
| `exp.ai-foundry.gcp.mia-platform.eu` | experimental | `ai-foundry-experimental` |

#### Homepage & RBAC (Services)

| DNS | Tier | Namespace |
|---|---|---|
| `lts.home.gcp.mia-platform.eu` | lts | `services-lts` |
| `preprod.home.gcp.mia-platform.eu` | preproduction | `services-preproduction` |
| `dev.home.gcp.mia-platform.eu` | development | `services-development` |
| `exp.home.gcp.mia-platform.eu` | experimental | `services-experimental` |

---

## Notes for self-hosted installations

- **Keycloak cluster isolation** is recommended for production but not required. Keycloak can run in a dedicated namespace on the same cluster as the products if cluster-per-tier is not feasible.
- **Realm-to-tier mapping:** In a multi-tier setup, each tier environment typically has its own set of Keycloak realms. The non-production Keycloak instance (`keycloak-dev.*`) serves all non-production tiers.
- **DNS naming** is flexible. What matters is that each product deployment references the correct `urls.keycloak` in its Realm Management values file, and the correct `configurations.keycloak.host` in its Helm values.
- **Network policies** should restrict product namespaces from talking directly to the production Keycloak, and vice versa; use the Keycloak instance appropriate for each environment tier.
