---
id: connectors-overview
title: Connectors Overview
sidebar_label: Overview
---

# Connectors Overview

Most catalogs are not populated by hand: they are kept in sync with the systems where the entities already live — source-code hosting, the Mia-Platform Console, cloud providers, artifact registries, and security tools. **Connectors** are what keep the Catalog in step with those systems automatically, so the picture of your platform stays current.

Connectors are powered by an open-source (AGPL-3.0) engine called **`ibdm`** (International Berthing and Docking Mechanism), developed at [github.com/mia-platform/ibdm](https://github.com/mia-platform/ibdm). A single connector talks to one upstream system, reads the entities that live there, and writes them into the Catalog as items.

## What connectors give you

- **Automatic population.** Entities are ingested from their systems of record — you don't recreate or maintain them by hand in the Catalog.
- **Up to date.** Connectors can react to changes as they happen, so a new repository, a new image, or a new cloud resource is reflected shortly after the creation.
- **Provenance.** Every item written by a connector is associated to that connector, so you can always tell which integration ingested a given entity.
- **Relationships out of the box.** Beyond the entities themselves, connectors can emit the [relationships](/products/catalog/basic-concepts/60_relationships.md) that wire them together, feeding the Catalog graph rather than a flat list.

## Two ways to ingest

Each connector supports one or both of two complementary ingestion styles:

| Style | Command | What it does |
| :---- | :------ | :----------- |
| **Sync** (pull) | `ibdm sync <source>` | Enumerates the supported entities currently in the upstream system in one pass via the source's REST APIs and exits. Run it manually or on a schedule. |
| **Run** (push) | `ibdm run <source>` | Starts a long-running process that reacts to events pushed by the source (inbound webhooks, message-queue subscriptions, or similar mechanisms) and updates the Catalog in near real time. |

Not every source supports every mode — see the per-source pages below for details.

There is no built-in "incremental sync" loop: incremental behavior is achieved by combining periodic `sync` runs with event-driven `run` mode.

## What you can connect

Connectors are available for nine upstream systems, grouped below by the kind of context they bring into the Catalog. Each link points to the source's setup and configuration reference.

### Source-code hosting

| Source | Entities brought into the Catalog |
| :----- | :-------------------------------- |
| [GitHub](/requirements/installation-guidelines/catalog/connectors/github.md) | Repositories, workflow runs, access-token requests, workflow dispatches |
| [GitLab](/requirements/installation-guidelines/catalog/connectors/gitlab.md) | Projects, pipelines, access tokens |
| [Bitbucket](/requirements/installation-guidelines/catalog/connectors/bitbucket.md) | Repositories, pipelines |
| [Microsoft Azure DevOps](/requirements/installation-guidelines/catalog/connectors/azure-devops.md) | Repositories, teams |

### Cloud providers

| Source | Entities brought into the Catalog |
| :----- | :-------------------------------- |
| [Microsoft Azure](/requirements/installation-guidelines/catalog/connectors/azure.md) | Cloud resources (compute, networking, storage, …) |
| [Google Cloud](/requirements/installation-guidelines/catalog/connectors/google-cloud.md) | Cloud resources |

### Mia-Platform Console

| Source | Entities brought into the Catalog |
| :----- | :-------------------------------- |
| [Mia-Platform Console](/requirements/installation-guidelines/catalog/connectors/mia-platform-console.md) | Projects, revisions, services, clusters |

### Artifact registries

| Source | Entities brought into the Catalog |
| :----- | :-------------------------------- |
| [Sonatype Nexus](/requirements/installation-guidelines/catalog/connectors/nexus.md) | Docker images |

### Security

| Source | Entities brought into the Catalog |
| :----- | :-------------------------------- |
| [Sysdig Secure](/requirements/installation-guidelines/catalog/connectors/sysdig.md) | Container-image vulnerabilities |

## Shaping what lands in the Catalog

The shape of the items a connector produces isn't fixed by the connector itself: what a source's data becomes in the Catalog is decided by **mapping files**. There are two ways to get there:

- **Use the ready-made mappings.** Each connector ships mappings built for the Catalog's [built-in Item Types](/products/catalog/basic-concepts/20_item-types.md), ready to use out of the box. They live in the [`docs/mappings`](https://github.com/mia-platform/ibdm/tree/main/docs/mappings) folder of the `ibdm` repository, one set per source.
- **Map to your own Item Types.** Every source exposes a defined set of *data types* (for example, GitHub's `repository` and `workflow_run`). Starting from the data a source delivers, you can define [custom Item Types](/products/catalog/basic-concepts/20_item-types.md) and write your own mappings that `ibdm` manages.

The mapping-file format and the full setup are covered in the configuration reference.

## Where to go next

- [Connectors configuration & installation](/requirements/installation-guidelines/catalog/connectors/00_overview.md) — how to deploy `ibdm`, wire it to the Catalog, and write mapping files, plus the per-source configuration references.
- [Items](/products/catalog/basic-concepts/10_items.md) — the shape of the entities produced by connectors.
- [Item Types](/products/catalog/basic-concepts/20_item-types.md) — how to register custom kinds a connector can populate.
- [Relationships](/products/catalog/basic-concepts/60_relationships.md) — the graph connectors can feed.
- [Catalog App → Connectors](/products/catalog/usage/catalog-app.md#connectors) — how to create and inspect a connector record from the UI.
