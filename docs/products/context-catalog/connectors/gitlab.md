---
id: gitlab
title: GitLab Connector
sidebar_label: GitLab
---

# GitLab Connector

The **GitLab connector** ingests entities from a GitLab instance (SaaS or self-hosted) into the Context Catalog, so that projects, pipelines, and related artifacts can be browsed, queried, and governed alongside the rest of your platform.

## What it ingests

Typical ingested entities include:

- **Groups and subgroups**: the organizational hierarchy of your GitLab namespace.
- **Projects**: name, default branch, topics, visibility, namespace.
- **Pipelines and jobs**: CI/CD configuration and recent execution outcomes.
- **Environments and deployments**: declared environments and the latest deployment for each.
- **Members** (when authorized): useful for ownership and access rules.

Each ingested entity is materialized as a catalog [item](../basic-concepts/10_items.md) of an [item type](../basic-concepts/20_item-types.md) registered by the connector. Custom ITDs can extend the model to capture additional GitLab fields specific to your organization.

## Authentication

The connector authenticates via:

- a **personal or group access token** with the scopes required for the entities you want to ingest, or
- an **OAuth application** registered on the GitLab instance.

For self-hosted GitLab, the connector also needs the base URL of the instance. Credentials are stored as secrets at the company level and consumed by the connector at runtime.

## How synchronization works

- **Initial sync.** On first run, the connector walks the configured namespace and creates a catalog item for every entity it finds.
- **Incremental sync.** Subsequent runs reconcile the catalog with GitLab: new entities are created, changed entities are updated, and entities removed from GitLab are removed from (or marked stale in) the catalog.
- **Event-driven updates.** When configured with system or project hooks, the connector reacts to GitLab events (e.g. pipeline finished, deployment created) and updates the catalog in near real time.

## Relationships

Ingested items participate in the catalog's [relationship](../basic-concepts/99_glossary.md#relationship) graph. Out of the box, the connector creates relationships such as:

- *Project → Group* (containment),
- *Pipeline → Project* (containment),
- *Deployment → Environment* (targets).

Custom relationship types can be defined to model your organization's specific connections.

## See also

- [Items](../basic-concepts/10_items.md): the shape of the entities ingested.
- [Item Types](../basic-concepts/20_item-types.md): how to extend the catalog with custom kinds.
- [API Interactions](../api-interactions.md): querying and managing ingested items via API.
