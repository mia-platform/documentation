---
id: nexus
title: Nexus Connector
sidebar_label: Nexus
---

# Nexus Connector

The **Nexus connector** ingests artifacts from a Sonatype Nexus Repository instance into the Context Catalog, so that the binaries and packages your platform produces and consumes become first-class catalog items.

## What it ingests

Typical ingested entities include:

- **Repositories**: hosted, proxy, and group repositories defined on the Nexus instance.
- **Components**: versioned units stored in a repository (e.g. a Maven `groupId:artifactId:version`, an npm package version, a Docker image tag).
- **Assets**: the individual files associated with each component (binary, sources, metadata).
- **Docker images**: when the Nexus instance hosts a Docker registry, image repositories and tags are surfaced as dedicated catalog items.

Each entity becomes a catalog [item](../basic-concepts/10_items.md) of an [item type](../basic-concepts/20_item-types.md) registered by the connector. Custom ITDs can extend the model with additional Nexus properties.

## Authentication

The connector authenticates via:

- a **dedicated user** with read access to the targeted repositories, or
- an **API token** issued by Nexus.

The connector also needs the base URL of the Nexus instance. Credentials are stored as secrets at the company level.

## How synchronization works

- **Initial sync.** Enumerates the configured repositories through the Nexus REST API and creates a catalog item for every component and asset discovered.
- **Incremental sync.** Reconciles the catalog with Nexus on a schedule, applying creations, updates, and deletions.
- **Event-driven updates.** When Nexus webhooks are configured, the connector reacts to component lifecycle events (e.g. `RepositoryItemEvent`) and refreshes affected items in near real time.

## Relationships

Out of the box the connector creates relationships such as:

- *Component → Repository* (containment),
- *Asset → Component* (containment),
- *Docker image → Tag* (versioning).

Custom relationship types can be defined to model your organization's specific connections, e.g. linking a Docker image to the service that consumes it.

## See also

- [Items](../basic-concepts/10_items.md)
- [Item Types](../basic-concepts/20_item-types.md)
- [API Interactions](../api-interactions.md)
