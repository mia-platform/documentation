---
id: azure-devops
title: Azure DevOps Connector
sidebar_label: Azure DevOps
---

# Azure DevOps Connector

The **Azure DevOps connector** ingests entities from an Azure DevOps organization into the Context Catalog, exposing projects, repositories, pipelines, and releases as first-class catalog items.

## What it ingests

Typical ingested entities include:

- **Organizations and projects**: the hierarchical structure of your Azure DevOps account.
- **Repositories (Azure Repos)**: name, default branch, visibility, owning project.
- **Pipelines (YAML and classic)**: pipeline definitions and recent runs.
- **Environments and releases**: declared environments and deployment history.
- **Service connections** (when authorized): useful to map dependencies on external systems.

Each entity becomes a catalog [item](../basic-concepts/10_items.md) of an [item type](../basic-concepts/20_item-types.md) registered by the connector. Custom ITDs can extend the model with additional Azure DevOps fields.

## Authentication

The connector authenticates via:

- a **Personal Access Token (PAT)** with the scopes required for the entities to ingest, or
- an **Azure AD application** configured to access the Azure DevOps APIs.

Credentials are stored as secrets at the company level.

## How synchronization works

- **Initial sync.** Walks the configured organization and creates a catalog item for every entity discovered.
- **Incremental sync.** Reconciles the catalog with Azure DevOps on a schedule, applying creations, updates, and deletions.
- **Event-driven updates.** When configured with service hooks, the connector reacts to Azure DevOps events (e.g. pipeline completed, release deployed) and refreshes affected items in near real time.

## Relationships

Out of the box the connector creates relationships such as:

- *Repository → Project* (containment),
- *Pipeline → Repository* (uses),
- *Release → Environment* (targets).

Custom relationship types can be defined to model your organization's specific connections.

## See also

- [Items](../basic-concepts/10_items.md)
- [Item Types](../basic-concepts/20_item-types.md)
- [API Interactions](../api-interactions.md)
