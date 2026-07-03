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

The Mia Platform product suite in scope comprises **Console**, **Homepage & RBAC**, **Catalog**, and **AI Foundry**. The AuthN/AuthZ tooling — Keycloak and Realm Management — is a platform-level prerequisite provisioned by Mia Platform; it enables the suite but is not a standalone business product.

## Cross-Product Dependencies

The **Auth tooling layer** (Keycloak and Realm Management) is the foundational prerequisite for the entire suite: every product requires a functioning Keycloak realm and OIDC issuer before it can be installed.

Among the business products, the installation order is:

1. **Homepage & RBAC** — provides the `authtool-bff` authorization service that Console and Catalog depend on.
2. **Console** and **Catalog** — can be installed in parallel after Homepage & RBAC is running.
3. **AI Foundry** — integrates with Catalog (shared agent backend and navigation links); Catalog must be in place first.

For the detailed installation map and product entry points, see the [Installation Guidelines](/requirements/installation-guidelines/00_overview.md).

## Shared Infrastructure Requirements

The following table highlights the main shared dependencies across products.

| Infrastructure / Tool | Homepage & RBAC | Catalog | AI Foundry | Console |
| --- | --- | --- | --- | --- |
| Traefik (IngressRoute) | ✅ (optional) | ✅ (optional)| ✅ (optional)| ✅ (optional)|
| AuthN/AuthZ platform tooling (Keycloak + Realm Management) | ✅ | ✅ | ✅ | ✅ |
| Container Registry | ✅ | ✅ | ✅ | ✅ |
| PostgreSQL | ❌ | ✅ | ✅ | ❌ |
| MongoDB | ❌ | ❌ | ❌ | ✅ |
| Redis | ✅ | ✅ | ✅ | ✅ |
| Kafka | ❌ | ✅ | ❌ | ❌ |
| Google Cloud / Vertex AI | ❌ | ❌ | ✅ *(adkBeApp)* | ❌ |

:::info
The provisioning and management of these tools depends on what distribution model has been chosen (see paragraph above).
:::

## Next Step

Continue with the [Installation Guidelines](/requirements/installation-guidelines/00_overview.md) to access the full product-by-product documentation tree.
