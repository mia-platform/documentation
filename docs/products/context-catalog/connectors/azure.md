---
id: azure
title: Azure Connector
sidebar_label: Azure
---

# Azure Connector

The **Azure connector** ingests cloud resources from a Microsoft Azure tenant into the Context Catalog, so that the cloud footprint of your platform becomes part of the same inventory you use for software components and compliance.

## What it ingests

Typical ingested entities include:

- **Subscriptions and resource groups**: the organizational containers used to group cloud resources.
- **Compute resources**: virtual machines, AKS clusters, App Service instances, function apps.
- **Networking resources**: virtual networks, subnets, load balancers, public IPs.
- **Storage and data resources**: storage accounts, managed databases (SQL, Cosmos DB), key vaults.
- **Tags and policies**: Azure tags and the policy assignments that govern them.

Each resource becomes a catalog [item](../basic-concepts/10_items.md) of an [item type](../basic-concepts/20_item-types.md) registered by the connector. Custom ITDs can extend the model with additional Azure properties.

## Authentication

The connector authenticates via:

- a **Service Principal** (recommended) with read access scoped to the subscriptions you want to ingest, or
- a **Managed Identity** when running inside Azure-hosted infrastructure.

Credentials are stored as secrets at the company level.

## How synchronization works

- **Initial sync.** Enumerates the configured subscriptions through the Azure Resource Manager API and creates a catalog item for every resource discovered.
- **Incremental sync.** Reconciles the catalog with Azure on a schedule, applying creations, updates, and deletions.
- **Event-driven updates.** When configured with Azure Event Grid or activity-log-based subscriptions, the connector reacts to resource lifecycle events and refreshes affected items in near real time.

## Relationships

Out of the box the connector creates relationships such as:

- *Resource → Resource group* (containment),
- *Resource group → Subscription* (containment),
- *Compute resource → Virtual network* (network attachment).

Custom relationship types can be defined to model your organization's specific connections.

## See also

- [Items](../basic-concepts/10_items.md)
- [Item Types](../basic-concepts/20_item-types.md)
- [API Interactions](../api-interactions.md)
