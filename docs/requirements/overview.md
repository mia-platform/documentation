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

<table>
  <thead>
    <tr>
      <th>Domain</th>
      <th>Tooling Scope</th>
      <th>PaaS</th>
      <th>BYOI</th>
      <th>Self-Hosted</th>
    </tr>
  </thead>
  <tbody>
    <tr style={{backgroundColor: "var(--ifm-table-stripe-background)"}}>
      <td rowspan="2"><strong>Runtime</strong></td>
      <td>Kubernetes runtime and networking</td>
      <td><strong>Managed by Mia-Platform</strong></td>
      <td><strong>Customer managed</strong> infrastructure, Mia-Platform supported integration</td>
      <td><strong>Customer managed</strong></td>
    </tr>
    <tr style={{backgroundColor: "var(--ifm-table-stripe-background)"}}>
      <td>Ingress layer (Traefik / IngressRoute)</td>
      <td><strong>Managed by Mia-Platform</strong></td>
      <td><strong>Customer managed</strong> infrastructure, Mia-Platform supported integration</td>
      <td><strong>Customer managed</strong></td>
    </tr>
    <tr style={{backgroundColor: "transparent"}}>
      <td><strong>Data</strong></td>
      <td>Data services (PostgreSQL, MongoDB, Redis, Kafka)</td>
      <td><strong>Managed by Mia-Platform</strong></td>
      <td><strong>Customer managed</strong> infrastructure, Mia-Platform supported integration</td>
      <td><strong>Customer managed</strong></td>
    </tr>
    <tr style={{backgroundColor: "var(--ifm-table-stripe-background)"}}>
      <td rowspan="2"><strong>Identity and Security</strong></td>
      <td>AuthN/AuthZ tooling (Keycloak, Keycloak Realm Management)</td>
      <td><strong>Shared responsibility</strong></td>
      <td><strong>Shared responsibility</strong></td>
      <td><strong>Customer managed</strong></td>
    </tr>
    <tr style={{backgroundColor: "var(--ifm-table-stripe-background)"}}>
      <td>Secrets management and key material</td>
      <td><strong>Shared responsibility</strong></td>
      <td><strong>Shared responsibility</strong></td>
      <td><strong>Customer managed</strong></td>
    </tr>
    <tr style={{backgroundColor: "transparent"}}>
      <td rowspan="2"><strong>Delivery</strong></td>
      <td>CI/CD and Git provider integration</td>
      <td><strong>Shared responsibility</strong></td>
      <td><strong>Shared responsibility</strong></td>
      <td><strong>Customer managed</strong></td>
    </tr>
    <tr style={{backgroundColor: "transparent"}}>
      <td>Container registry and image lifecycle</td>
      <td><strong>Shared responsibility</strong></td>
      <td><strong>Customer managed</strong> infrastructure, Mia-Platform supported integration</td>
      <td><strong>Customer managed</strong></td>
    </tr>
    <tr style={{backgroundColor: "var(--ifm-table-stripe-background)"}}>
      <td><strong>Operations</strong></td>
      <td>Observability and operational monitoring</td>
      <td><strong>Managed by Mia-Platform</strong></td>
      <td><strong>Shared responsibility</strong></td>
      <td><strong>Customer managed</strong></td>
    </tr>
  </tbody>
</table>

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
| MongoDB | ❌ | ❌ | ❌ | ✅ |
| Redis | ✅ | ✅ | ✅ | ✅ |
| Kafka | ❌ | ✅ (optional) | ❌ | ❌ |

## Next Step

Continue with the [Installation Guidelines](/requirements/installation-guidelines/00_overview.md) to access the full product-by-product documentation tree.
