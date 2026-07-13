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

The Mia Platform product suite in scope comprises three products (**Console**, **Catalog**, and **AI Foundry**) backed by a shared services layer. The shared services layer includes the **Auth tooling** (Keycloak and Realm Management) and the **Homepage & RBAC** component (platform gateway, session management, and authorization). Both are platform-level prerequisites provisioned by Mia Platform; they enable the suite but are not standalone business products.

## Cross-Product Dependencies

The **Auth tooling layer** (Keycloak and Realm Management) is the foundational prerequisite for the entire suite: every product requires a functioning Keycloak realm and OIDC issuer before it can be installed.

The **shared services layer** must be fully operational before any product chart is installed. Within it, **Auth tooling** (Keycloak and Realm Management) provides the OIDC issuer required by all components. **Homepage & RBAC** follows: it provides the `authtool-bff` authorization service that Console and Catalog depend on.

Among the products, the installation order is:

1. **Console** and **Catalog**: can be installed in parallel once the shared services layer is running.
2. **AI Foundry**: integrates with Catalog (shared agent backend and navigation links); Catalog must be in place first.

For the detailed installation map and product entry points, see the [Installation Guidelines](/requirements/installation-guidelines/00_overview.md).

## Shared Infrastructure Requirements

The following table highlights the main shared dependencies across products.

| Infrastructure / Tool | Shared services & tools | Catalog | AI Foundry | Console |
| --- | --- | --- | --- | --- |
| AuthN/AuthZ platform tooling (Keycloak + Realm Management) | ✅ | ✅ | ✅ | ✅ |
| Container Registry | ✅ | ✅ | ✅ | ✅ |
| PostgreSQL | ✅ | ✅ | ✅ | ❌ |
| MongoDB | ❌ | ❌ | ❌ | ✅ |
| Redis | ✅ | ✅ | ✅ | ✅ |
| Kafka | ❌ | ✅ | ❌ | ❌ |
| Google Cloud / Vertex AI | ✅ | ✅ | ✅ | ✅ optional |

:::info
The provisioning and management of these tools depends on what distribution model has been chosen (see paragraph above).
:::

## Product-Specific Requirements

The following requirements complement the shared infrastructure prerequisites and are scoped to each product.

### Console

See the [Console self-hosted requirements](/requirements/installation-guidelines/console/self-hosted/self-hosted-requirements.md#architectural-prerequisites).

### Catalog

Kubernetes-centric architecture.

| Dependency | Version |
| --- | --- |
| PostgreSQL | >= 15 |
| Kafka | >= 2.x |
| Redis | >= 8.4 |
| Keycloak | >= 26.2 |
| Kubernetes | >= 1.34 |
| LLM API key / Service Account (optional) | Optional |
| S3-compatible bucket (optional) | Optional |


### IBDM

`ibdm` is the Context Catalog's connector engine, used to sync data from external systems. See the [Connectors Overview](/products/context-catalog/connectors/10_overview.md) for details.

Compatibility matrix:

| Provider | Version |
| --- | --- |
| GitLab | >= 17.11.7 |
| GitHub | API version >= 2026-03-10 |
| Nexus | >= 3.82.0-08 |
| Sysdig | Cloud SaaS |
| Mia-Platform Console | >= 14 |
| Bitbucket | >= 10.3.0 |
| Google Cloud (GCP) | Cloud SaaS |
| Azure | API version >= 2025-08-01 |
| Azure DevOps | Cloud SaaS |

### Flow

| Dependency | Version |
| --- | --- |
| Keycloak | >= 26.2 |
| Redis | >= 8.4 |
| MongoDB | Atlas, >= v7 |
| PostgreSQL | >= 16 |
| LLM API key / Service Account | N/A |
| Kubernetes | >= 1.34 |
| Mia-Platform Console | >= v15 |
| Mia-Platform Catalog | V2 |
| Mia-Platform AI Foundry | Required |
| SCM | Currently compatible only with GitLab, GitHub (SaaS), and Azure DevOps (SaaS) |
| CI/CD tool | Currently compatible only with GitLab, GitHub Actions (SaaS), and Azure Pipelines |


### Foundry

| Dependency | Version |
| --- | --- |
| Keycloak | >= 26.2 |
| Redis | >= 8.4 |
| PostgreSQL | >= 16 |
| LLM API key / Service Account | N/A |
| Kubernetes | >= 1.34 |
| Mia-Platform Catalog | V2 |
| Mia Flow (optional) | Optional |
| Grafana Tempo (optional) | Optional |

## Next Step

Continue with the [Installation Guidelines](/requirements/installation-guidelines/00_overview.md) to access the full product-by-product documentation tree.
