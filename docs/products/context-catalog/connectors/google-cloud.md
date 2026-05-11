---
id: google-cloud
title: Google Cloud Connector
sidebar_label: Google Cloud
---

# Google Cloud Connector

The **Google Cloud connector** ingests resources from a Google Cloud organization into the Context Catalog, exposing your GCP footprint as catalog items that can be browsed, queried, and governed alongside the rest of your platform.

## What it ingests

Typical ingested entities include:

- **Organizations, folders, and projects**: the GCP resource hierarchy.
- **Compute resources**: Compute Engine instances, GKE clusters, Cloud Run services, App Engine apps.
- **Networking resources**: VPC networks, subnets, firewall rules, load balancers.
- **Storage and data resources**: Cloud Storage buckets, BigQuery datasets, Cloud SQL and Spanner instances, Pub/Sub topics.
- **IAM bindings** (when authorized): useful for ownership and access rules.

Each resource becomes a catalog [item](../basic-concepts/10_items.md) of an [item type](../basic-concepts/20_item-types.md) registered by the connector. Custom ITDs can extend the model with additional GCP properties.

## Authentication

The connector authenticates via:

- a **Service Account** (recommended) with read access scoped to the projects you want to ingest, or
- **Workload Identity** when running inside GCP-hosted infrastructure.

Credentials are stored as secrets at the company level.

## How synchronization works

- **Initial sync.** Walks the configured organization/folder/project tree through the Cloud Asset Inventory and resource-specific APIs, creating a catalog item for every resource discovered.
- **Incremental sync.** Reconciles the catalog with GCP on a schedule, applying creations, updates, and deletions.
- **Event-driven updates.** When configured with a Cloud Asset Inventory feed (Pub/Sub), the connector reacts to resource lifecycle events and refreshes affected items in near real time.

## Relationships

Out of the box the connector creates relationships such as:

- *Resource → Project* (containment),
- *Project → Folder* (containment),
- *Compute resource → VPC network* (network attachment).

Custom relationship types can be defined to model your organization's specific connections.

## See also

- [Items](../basic-concepts/10_items.md)
- [Item Types](../basic-concepts/20_item-types.md)
- [API Interactions](../api-interactions.md)
