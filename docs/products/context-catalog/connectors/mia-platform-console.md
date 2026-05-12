---
id: mia-platform-console
title: Mia-Platform Console Connector
sidebar_label: Mia-Platform Console
---

# Console Connector

The **Mia-Platform Console connector** ingests entities from the Mia-Platform Console into the Context Catalog. It is the natural bridge between the platform engineering workspace where users design and operate projects and the catalog where everything that exists in the organization is recorded and governed.

## What it ingests

Typical ingested entities include:

- **Companies**: the top-level Console tenants.
- **Projects**: the projects defined inside each company, with their metadata (name, environments, repositories).
- **Environments**: the runtime environments declared per project.
- **Microservices, endpoints, CRUDs, public variables**: the design-time configuration that lives in the project model.
- **Deployments**: the history of deployments triggered from the Console.

Each entity becomes a catalog [item](../basic-concepts/10_items.md) of an [item type](../basic-concepts/20_item-types.md) registered by the connector under the `console.mia-platform.eu` group. Custom ITDs can extend the model to capture additional Console fields.

## Authentication

The connector authenticates against the Console API via:

- a **service account** registered on the Console, with the scopes required to read the targeted companies and projects.

Credentials are stored as secrets at the company level and consumed by the connector at runtime.

## How synchronization works

- **Initial sync.** On first run, the connector walks the configured companies and projects and creates a catalog item for every entity it finds.
- **Incremental sync.** Subsequent runs reconcile the catalog with the Console: new entities are created, changed entities are updated, and entities removed from the Console are removed from (or marked stale in) the catalog.
- **Event-driven updates.** When the connector subscribes to Console events, configuration and deployment changes are reflected in the catalog in near real time.

## Relationships

Ingested items participate in the catalog's [relationship](../basic-concepts/99_glossary.md#relationship) graph. Out of the box, the connector creates relationships such as:

- *Project → Company* (containment),
- *Microservice → Project* (containment),
- *Deployment → Environment* (targets).

Custom relationship types can be defined to model your organization's specific connections.

## See also

- [Items](../basic-concepts/10_items.md)
- [Item Types](../basic-concepts/20_item-types.md)
- [API Interactions](../api-interactions.md)
