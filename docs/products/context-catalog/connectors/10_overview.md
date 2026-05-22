---
id: connectors-overview
title: Connectors Overview
sidebar_label: Overview
---

# Connectors Overview

Most catalogs are not populated by hand: they are kept in sync with the systems where the entities already live (source-code hosting, the Mia-Platform Console, cloud providers, artifact registries, security tools). The Context Catalog ingests data from those systems through a dedicated binary called **`ibdm`**.

`ibdm` (International Berthing and Docking Mechanism) is the connector engine. It is open-source software (AGPL-3.0) developed at [github.com/mia-platform/ibdm](https://github.com/mia-platform/ibdm). A single deployable binary can be configured as one of nine **sources** — each source talks to a specific upstream system — and pushes the resulting data into the Catalog as items.

## How a connector works

For every source, `ibdm` exposes two complementary modes:

| Mode | Command | Behavior |
| :--- | :------ | :------- |
| **Sync** (pull) | `ibdm sync <source> --mapping-file <path>` | Performs a one-off enumeration via the source's REST APIs and exits. Run it manually or on a schedule. |
| **Run** (push) | `ibdm run <source> --mapping-file <path>` | Starts a long-running process that reacts to events pushed by the source (inbound webhooks, message-queue subscriptions, or similar mechanisms) and updates the Catalog in near real time. |

Not every source supports every mode — see the per-source pages below for details.

There is no built-in "incremental sync" loop: incremental behavior is achieved by combining periodic `sync` runs with event-driven `run` mode.

## Mappings

`ibdm` does not hard-code the shape of the data it produces. Every source emits raw upstream payloads, which are then transformed into Catalog items through **mapping files** passed via `--mapping-file`. A mapping file is a YAML document with [Go templates](https://pkg.go.dev/text/template) that produce:

- an **`identifier`** template that resolves to the item's `metadata.name` — must be 1–253 characters, using only lowercase alphanumeric characters, `-`, and `.`, starting and ending with an alphanumeric character;
- a **`metadata`** block with the allowed metadata fields (`annotations`, `creationTimestamp`, `description`, `labels`, `links`, `name`, `tags`, `title`, `uid`);
- a **`spec`** block with the typed payload of the item;
- optional **`extra`** templates that produce additional items per mapping — typically `Relationship` objects to wire the ingested entity to others.

Each source page lists the **data types** it exposes inside the mapping context (e.g. for GitHub: `repository`, `workflow_run`, …). You declare in the mapping which data types you want to materialize, and `ibdm` does the rest.

## Wiring `ibdm` to the Catalog

`ibdm` writes into the Catalog over HTTP, using a client-credentials pair provisioned in the Catalog Administration.

1. **Register the connector in the Catalog Administration.** Open **Configuration → Connectors → Add connector**. You will be asked for a `Name`, an optional `Title` and `Description`, a `Client ID`, and a `Provider` / `Category` for UI filtering (see the [Connectors section](/products/context-catalog/catalog-administration.md#connectors) of the Catalog Administration reference). The Catalog Administration creates a *Connector* item in the catalog and surfaces a credentials pair you will use to authenticate `ibdm`.
2. **Configure the destination on `ibdm`.** Set the following environment variables before launching `ibdm`:

   | Variable | Description |
   | :------- | :---------- |
   | `MIA_CATALOG_ENDPOINT` | The Catalog ingestion endpoint, surfaced in the Catalog Administration connector form. |
   | `MIA_CATALOG_CLIENT_ID` | Client ID provisioned for this connector. |
   | `MIA_CATALOG_CLIENT_SECRET` | Client Secret provisioned for this connector. |
   | `MIA_CATALOG_AUTH_ENDPOINT` *(optional)* | Override of the OAuth token endpoint. Defaults to `<host of MIA_CATALOG_ENDPOINT>/oauth/token`. |

   Every item written through this credential pair is associated to the *Connector* item created in step 1, so you can always tell which connector ingested a given entity (visible in the **Connector items** tab of the Connector detail page).
3. **Configure the source.** Set the source-specific environment variables documented in the page for that source.
4. **Launch.** Run either `ibdm sync <source> --mapping-file <path>` or `ibdm run <source> --mapping-file <path>`.

Running `ibdm` with `--local-output` redirects results to stdout instead of pushing to the Catalog — useful for validating a mapping file before going live.

## Available sources

| Source | Modes | Typical entities |
| :----- | :---- | :--------------- |
| [Microsoft Azure](/products/context-catalog/connectors/azure.md) | `sync` (Resource Graph), `run` (EventHub) | Cloud resources (compute, networking, storage, …) |
| [Microsoft Azure DevOps](/products/context-catalog/connectors/azure-devops.md) | `sync`, `run` (webhooks) | Repositories, teams |
| [Bitbucket](/products/context-catalog/connectors/bitbucket.md) | `sync`, `run` (webhooks) | Repositories, pipelines |
| [GitHub](/products/context-catalog/connectors/github.md) | `sync`, `run` (webhooks) | Repositories, workflow runs, access-token requests, workflow dispatches |
| [GitLab](/products/context-catalog/connectors/gitlab.md) | `sync`, `run` (webhooks) | Projects, pipelines, access tokens |
| [Google Cloud](/products/context-catalog/connectors/google-cloud.md) | `sync` (Cloud Asset API), `run` (PubSub) | Cloud resources |
| [Mia-Platform Console](/products/context-catalog/connectors/mia-platform-console.md) | `sync`, `run` (webhooks) | Projects, revisions, services |
| [Sonatype Nexus](/products/context-catalog/connectors/nexus.md) | `sync`, `run` (webhooks) | Docker images |
| [Sysdig Secure](/products/context-catalog/connectors/sysdig.md) | `sync` (SysQL), `run` (webhooks) | Vulnerabilities |

## Installation

The recommended way to deploy `ibdm` in production is as a **Docker container**. Official images are published to both GitHub Container Registry and Docker Hub:

- `ghcr.io/mia-platform/ibdm`
- `docker.io/miaplatform/ibdm`

A typical deployment passes the source-specific and destination environment variables to the container and runs the appropriate `ibdm sync <source>` or `ibdm run <source>` command, mounting the mapping files at the path passed via `--mapping-file`. For example:

```sh
docker run --rm \
  -e MIA_CATALOG_ENDPOINT=... \
  -e MIA_CATALOG_CLIENT_ID=... \
  -e MIA_CATALOG_CLIENT_SECRET=... \
  -e GITHUB_TOKEN=... \
  -e GITHUB_ORG=my-org \
  -v "$PWD/mappings:/mappings:ro" \
  ghcr.io/mia-platform/ibdm:latest \
  ibdm sync github --mapping-file /mappings
```

For local development and ad-hoc usage you can also install the binary directly from source:

```sh
go install github.com/mia-platform/ibdm@main
```

See the [`ibdm` installation guide](https://github.com/mia-platform/ibdm/blob/main/docs/how-to/010_installation.md) for the full list of installation options.

## See also

- [Items](/products/context-catalog/basic-concepts/10_items.md) — the shape of the entities produced by `ibdm`.
- [Item Types](/products/context-catalog/basic-concepts/20_item-types.md) — how to register custom kinds the connector can populate.
- [Catalog Administration → Connectors](/products/context-catalog/catalog-administration.md#connectors) — how to create and inspect a connector record from the UI.
