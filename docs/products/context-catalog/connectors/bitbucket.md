---
id: bitbucket
title: Bitbucket Connector
sidebar_label: Bitbucket
---

# Bitbucket Connector

The **Bitbucket connector** ingests entities from Bitbucket (Cloud or Data Center) into the Context Catalog, making workspaces, repositories, pipelines, and deployments part of your platform's unified inventory.

## What it ingests

Typical ingested entities include:

- **Workspaces and projects**: the organizational hierarchy of your Bitbucket account.
- **Repositories**: name, default branch, visibility, owning project.
- **Pipelines and pipeline runs**: Bitbucket Pipelines configuration and recent execution outcomes.
- **Deployments and environments**: declared environments and the latest deployment for each.

Each entity becomes a catalog [item](../basic-concepts/10_items.md) of an [item type](../basic-concepts/20_item-types.md) registered by the connector. Custom ITDs can extend the model with additional Bitbucket fields.

## Authentication

The connector authenticates via:

- an **App password** (Bitbucket Cloud), or
- a **personal/repository access token** (Bitbucket Data Center), or
- an **OAuth client** registered on the workspace.

For Bitbucket Data Center the connector also needs the base URL of the instance. Credentials are stored as secrets at the company level.

## How synchronization works

- **Initial sync.** Walks the configured workspace and creates a catalog item for every entity discovered.
- **Incremental sync.** Reconciles the catalog with Bitbucket on a schedule, applying creations, updates, and deletions.
- **Event-driven updates.** With workspace or repository webhooks configured, the connector reacts to Bitbucket events (e.g. pipeline finished, deployment created) and refreshes affected items in near real time.

## Relationships

Out of the box the connector creates relationships such as:

- *Repository → Project* (containment),
- *Pipeline → Repository* (containment),
- *Deployment → Environment* (targets).

Custom relationship types can be defined to model your organization's specific connections.

## See also

- [Items](../basic-concepts/10_items.md)
- [Item Types](../basic-concepts/20_item-types.md)
- [API Interactions](../api-interactions.md)
