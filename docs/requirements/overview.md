---
id: infrastructure_overview
title:  Mia-Platform Infrastructure overview
sidebar_label: Infrastructure overview
---

With v15, Mia-Platform is delivered as a product suite composed of multiple Helm charts.

The Mia-Platform Product Suite can be distributed in three different operating models, depending on your governance, compliance, and infrastructure strategy.

## Distribution Models

- **Platform as a Service (PaaS)**: Mia-Platform provides and operates the platform runtime stack, so your teams can focus primarily on product configuration and application delivery.
- **Bring Your Own Infrastructure (BYOI)**: Mia-Platform delivers and supports the product suite while your organization manages the target runtime infrastructure and selected operational tooling.
- **Self-Hosted**: your organization installs and operates the full platform stack in your own environments, with responsibility on infrastructure and day-2 operations.

## Responsibility by Tooling Area

The ownership model changes according to the selected distribution type.

| Domain | Tooling Scope | PaaS | BYOI | Self-Hosted |
| --- | --- | --- | --- | --- |
| Runtime | Kubernetes runtime and networking | Managed by Mia-Platform | Customer managed infrastructure, Mia-Platform supported integration | Customer managed |
| Runtime | Ingress layer (Traefik / IngressRoute) | Managed by Mia-Platform | Customer managed infrastructure, Mia-Platform supported integration | Customer managed |
| Data | Data services (PostgreSQL, MongoDB, Redis, Kafka) | Managed by Mia-Platform | Customer managed infrastructure, Mia-Platform supported integration | Customer managed |
| Identity and Security | AuthN/AuthZ tooling (Keycloak, Keycloak Realm Management) | Shared responsibility | Shared responsibility | Customer managed |
| Delivery | CI/CD and Git provider integration | Shared responsibility | Shared responsibility | Customer managed |
| Delivery | Container registry and image lifecycle | Shared responsibility | Customer managed infrastructure, Mia-Platform supported integration | Customer managed |
| Identity and Security | Secrets management and key material | Shared responsibility | Shared responsibility | Customer managed |
| Operations | Observability and operational monitoring | Managed by Mia-Platform | Shared responsibility | Customer managed |

`Shared responsibility` indicates areas where platform-level integration is provided by Mia-Platform, while infrastructure provisioning and/or day-2 operations remain in customer scope.

Products in scope are **Console**, **Homepage**, **Catalog**, and **AI Foundry**.

## Cross-Product Dependencies

Use this high-level order before entering product-specific guides:

1. Install Keycloak first.
2. Install Catalog before AI Foundry.
3. Install the remaining product charts according to your target architecture.

## Shared Infrastructure Requirements

The following table highlights the main shared dependencies across products.

| Infrastructure / Tool | Homepage | Catalog | AI Foundry | Console |
| --- | --- | --- | --- | --- |
| Traefik (IngressRoute) | ✅ | ✅ | ✅ | ✅ |
| AuthN/AuthZ platform tooling (Keycloak + Realm Management) | ✅ | ✅ | ✅ | ✅ |
| Container Registry | ✅ | ✅ | ✅ | ✅ |
| PostgreSQL | ❌ | ✅ | ✅ | ❌ |
| MongoDB | ❌ | ✅ | ❌ | ✅ |
| Redis | ✅ | ✅ | ✅ | ✅ |
| Kafka | ❌ | ✅ (optional) | ❌ | ❌ |

## Next Step

Continue with the [Installation Guidelines](/requirements/installation-guidelines/00_overview.md) to access the full product-by-product documentation tree.
