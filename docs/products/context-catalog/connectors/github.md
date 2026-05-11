---
id: github
title: GitHub Connector
sidebar_label: GitHub
---

# GitHub Connector

The **GitHub connector** ingests entities from a GitHub organization into the Context Catalog so that repositories, environments, and related artifacts can be browsed, queried, and governed alongside the rest of your platform.

## What it ingests

The connector materializes GitHub objects as catalog items. Typical ingested entities include:

- **Repositories**: name, default branch, topics, visibility, owner.
- **Workflows and runs**: CI/CD pipeline configuration and recent execution outcomes.
- **Environments and deployments**: declared environments and the latest deployment for each.
- **Teams and members** (when authorized): organizational structure useful for ownership and access rules.

Each ingested entity is represented as a catalog [item](../basic-concepts/10_items.md) of an [item type](../basic-concepts/20_item-types.md) registered by the connector. Custom ITDs can extend the model to capture additional GitHub fields specific to your organization.

## Authentication

The connector authenticates against GitHub via:

- a **GitHub App** installed on the target organization (recommended: fine-grained permissions, organizational scope), or
- a **personal access token** with the scopes required by the entities you want to ingest.

Credentials are stored as secrets at the company level and consumed by the connector at runtime.

## How synchronization works

- **Initial sync.** On first run, the connector enumerates the configured organization(s) and creates a catalog item for every entity it finds.
- **Incremental sync.** Subsequent runs reconcile the catalog with GitHub: new entities are created, changed entities are updated, and entities removed from GitHub are removed from (or marked stale in) the catalog.
- **Event-driven updates.** When configured with a webhook, the connector reacts to GitHub events (e.g. repository created, deployment finished) and updates the catalog in near real time.

## Relationships

Ingested items participate in the catalog's [relationship](../basic-concepts/99_glossary.md#relationship) graph. Out of the box, the connector creates relationships such as:

- *Repository → Team* (ownership),
- *Workflow → Repository* (containment),
- *Deployment → Environment* (targets).

Custom relationship types can be defined to model your organization's specific connections.

## See also

- [Items](../basic-concepts/10_items.md): the shape of the entities ingested.
- [Item Types](../basic-concepts/20_item-types.md): how to extend the catalog with custom kinds.
- [API Interactions](../api-interactions.md): querying and managing ingested items via API.
