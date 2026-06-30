---
id: infrastructure_overview
title:  Mia-Platform Infrastructure overview
sidebar_label: Infrastructure overview
---

With v15, Mia-Platform is delivered as a product suite composed of multiple Helm charts.

Installation for self-hosted setups is no longer based on a single console-only path: each product has its own installation and upgrade track, with shared infrastructure requirements and explicit cross-product dependencies.

## Global Installation Dependencies

Use this high-level order before entering product-specific guides:

1. Install Keycloak first.
2. Install Catalog before AI Foundry.
3. Install the remaining product charts according to your target architecture.

## Shared Infrastructure Requirements

The following table highlights the main shared dependencies across products.

| Infrastructure / Tool | Keycloak | Console | Services | Catalog | AI Foundry |
| --- | --- | --- | --- | --- | --- |
| Traefik (IngressRoute) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Keycloak (Authorization Server) | — | ✅ | ✅ | ✅ | ✅ |
| PostgreSQL | ✅ | ❌ | ❌ | ✅ | ✅ |
| MongoDB | ❌ | ✅ | ❌ | ✅ | ❌ |
| Redis | ❌ | ✅ | ✅ | ✅ | ✅ |
| Kafka | ❌ | ❌ | ❌ | ✅ (optional) | ❌ |
| Catalog dependency | ❌ | ❌ | ❌ | — | ✅ |

## Next Step

Continue with the [Installation Guidelines](/requirements/installation-guidelines/00_overview.md) to access the full product-by-product documentation tree.
