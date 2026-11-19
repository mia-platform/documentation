---
id: connectors-installation-overview
title: Installation Overview
sidebar_label: Installation Overview
---

# Installation Overview

This guide covers how to deploy **`ibdm`** — the engine that powers the Catalog's connectors — wire it to the Catalog, and configure each source. For what connectors are and when to use them, see the [Connectors Overview](/products/catalog/connectors/10_overview.md) first.

`ibdm` (International Berthing and Docking Mechanism) is open-source software (AGPL-3.0) hosted at [github.com/mia-platform/ibdm](https://github.com/mia-platform/ibdm). The single deployable binary can be configured as one of several **sources**, each talking to a specific upstream system and pushing the resulting data into the Catalog as items.

## How a connector works

For every source, `ibdm` exposes two complementary modes:

| Mode | Command | Behavior |
| :--- | :------ | :------- |
| **Sync** (pull) | `ibdm sync <source> --include-internal-mappings=all` | Performs a one-off enumeration via the source's REST APIs and exits. Run it manually or on a schedule. |
| **Run** (push) | `ibdm run <source> --include-internal-mappings=all` | Starts a long-running process that reacts to events pushed by the source (inbound webhooks, message-queue subscriptions, or similar mechanisms) and updates the Catalog in near real time. |

Not every source supports every mode — see the per-source pages below for details.

There is no built-in "incremental sync" loop: incremental behavior is achieved by combining periodic `sync` runs with event-driven `run` mode.

## Mappings

`ibdm` does not hard-code the shape of the data it produces. Every source emits raw upstream payloads, which are transformed into Catalog items by **mappings**: YAML documents with [Go templates](https://pkg.go.dev/text/template) that produce:

- an **`identifier`** template that resolves to the item's `metadata.name` — must be 1–253 characters, using only lowercase alphanumeric characters, `-`, and `.`, starting and ending with an alphanumeric character;
- a **`metadata`** block with the allowed metadata fields (`annotations`, `creationTimestamp`, `description`, `labels`, `links`, `name`, `tags`, `title`, `uid`);
- a **`spec`** block with the typed payload of the item;
- optional **`extra`** templates that produce additional items per mapping — typically `Relationship` objects to wire the ingested entity to others.

A run uses two kinds of mappings:

- **Internal mappings** are built into the `ibdm` binary, one set per source. They write the Catalog's [built-in Item Types](/products/catalog/basic-concepts/20_item-types.md) and need no file to deploy.
- **External mappings** are files you write and pass with `--mapping-file`. They write [Item Types of your own](/products/catalog/basic-concepts/20_item-types.md).

### Selecting the internal mappings

Internal mappings are only used when you select them, by name:

| Command | Internal mappings used |
| :------ | :--------------------- |
| `ibdm sync console --include-internal-mappings=all` | every internal mapping of the source |
| `ibdm sync console --include-internal-mappings=projects,services` | `projects` and `services` |
| `ibdm sync console --include-internal-mappings=all --exclude-internal-mappings=revisions` | every one except `revisions` |
| `ibdm sync console` | none: with no mapping selected, the command logs `console: no mappings selected, nothing to do` and exits |

`ibdm mappings list <source>` prints the names of the internal mappings of a source, and `ibdm mappings show <source> <name>` prints one of them, as a starting point for a mapping of your own. Each source page lists its internal mappings and how they depend on each other: some produce items only when another one is selected too, and relationships can point at items of a mapping you did not select. Excluding a mapping does not delete the items it already published.

A name that is not an internal mapping of the source, `all` mixed with other names, and `--exclude-internal-mappings=all` are errors. Before any work begins, `ibdm` logs the internal and external mappings the run uses.

### External mappings

External mappings are loaded from the files and directories passed with `--mapping-file`, which can be repeated. They are always loaded in full and **added** to the selected internal mappings:

```sh
# external mappings only
ibdm sync github --mapping-file ./my-mappings/

# every internal mapping, plus the external ones
ibdm sync github --include-internal-mappings=all --mapping-file ./my-mappings/
```

A few rules stop the start when they are not met:

- **Reserved domains.** An external mapping cannot write a built-in Item Type: it is refused when the group of its root `apiVersion` (the part before the first `/`) is `mia-platform.eu`, `mia-care.io`, `mia-fintech.io`, or a subdomain of one of them. Entries of `mappings.extra` can still create `mia-platform.eu/v1` `relationships` items, because relationships are how items are linked.
- **Unique names.** Every mapping of a run, internal or external, has a unique `name`, which defaults to its file name without the extension. A file named like a selected internal mapping, such as a copy of `projects.yaml`, needs a different `name`.
- **One writer per Item Type.** When several mappings of a run write the same `apiVersion` and `itemFamily`, their items may overwrite each other, so `ibdm` refuses to start. Pass `--allow-shared-item-types` to start anyway. The generic `mia-platform.eu/v1` `relationships` Item Type is exempt.

An external mapping can render the same data type as an internal one: each of them then produces its own item from every payload of that type. A mapping that declares `syncable: false` is skipped by `sync` and used by `run` only.

The full rules are in [Internal and External Mappings](https://github.com/mia-platform/ibdm/blob/main/docs/how-to/015_internal-and-external-mappings.md), the mapping file fields in the [mapping reference](https://github.com/mia-platform/ibdm/blob/main/docs/reference/10_mappings.md), and every internal mapping of every source in the [Internal Mappings](https://github.com/mia-platform/ibdm/blob/main/docs/reference/20_internal-mappings.md) reference.

### Upgrading from mapping files

Before version 0.16, the mappings for the built-in Item Types were files under `docs/mappings` of the `ibdm` repository, passed with `--mapping-file`. They are now internal mappings, and a copy of one passed with `--mapping-file` is refused because of its reserved domain:

| Before | Now |
| :----- | :-- |
| `ibdm sync gitlab --mapping-file docs/mappings/gitlab/` | `ibdm sync gitlab --include-internal-mappings=all` |
| `ibdm sync gitlab --mapping-file docs/mappings/gitlab/projects.yaml` | `ibdm sync gitlab --include-internal-mappings=projects` |
| a mounted or baked-in copy of the shipped mappings | remove it and select the internal mappings |
| a modified copy of a shipped mapping | move it to an Item Type of your own domain and keep passing it with `--mapping-file` |

The same files are still published with every [`ibdm` release](https://github.com/mia-platform/ibdm/releases) as `default-itds-mappings.tar.gz`.

## Wiring `ibdm` to the Catalog

`ibdm` writes into the Catalog over HTTP, authenticating with a Client ID that must be registered in **two separate places**: a *Connector* item in the Catalog App, used purely for attribution/labeling, and a matching **service account** in Platform Administration, which is where the actual credential (an RSA key pair) is minted.

1. **Register a matching service account.** A Super Admin registers a service account with the *same* Client ID through Platform Administration, providing an RSA key pair (for `private_key_jwt`) as its credential — see [Registering a service account](/products/mia-platform-suite/rbac_management.md#registering-a-service-account). This is the actual credential `ibdm` will authenticate with. In the case of `ibdm` wired to the catalog the needed scopes are `"scope": "service_account mia:catalog"`.
2. **Add Item Ingestor role to the matching service account.** Open [Administration Section](/products/mia-platform-suite/rbac_management.md#how-to-assign-roles-and-permissions) find the created service account and add the needed role `Item Ingestor`.
3. **Register the connector in the Catalog App.** Open **Configuration → Connectors → Add connector**. You will be asked for a `Name`, an optional `Title` and `Description`, a `Client ID`, and a `Provider` / `Category` for UI filtering (see the [Connectors section](/products/catalog/usage/catalog-app.md#connectors) of the Catalog App reference). This only creates the *Connector* item used to attribute ingested items — it does **not** generate any credential.
4. **Configure the destination on `ibdm`.** The endpoint is always required:

   | Variable | Description |
   | :------- | :---------- |
   | `MIA_CATALOG_ENDPOINT` | The Catalog ingestion endpoint, surfaced in the Catalog App connector form. This refers to the publish API of the catalog architecture that typically has this shape [BASE_CATALOG_URL]/api/publish/[SERVICE_ACCOUNT_CLIENT_ID]. |

   `ibdm` itself supports two generic authentication mechanisms (client-credentials with a client secret, or private-key JWT), but **when wiring to the Catalog only private-key JWT is supported**: Catalog service accounts are registered with an RSA key pair (see step 1) and have no client secret, so `MIA_CATALOG_CLIENT_SECRET`/`MIA_CATALOG_AUTH_ENDPOINT` cannot be used against the Catalog target — those variables only apply when pointing `ibdm` at a different, client-secret-based OAuth server.

   Set `MIA_CATALOG_PRIVATE_KEY_PATH` together with `MIA_CATALOG_CLIENT_ID`. You must also configure at least one of `MIA_CATALOG_ISSUER`, `MIA_CATALOG_ISSUER_METADATA`, or `MIA_CATALOG_TOKEN_ENDPOINT`:

   | Variable | Description |
   | :------- | :---------- |
   | `MIA_CATALOG_CLIENT_ID` | Client ID provisioned for this connector. |
   | `MIA_CATALOG_PRIVATE_KEY_PATH` | Path to a PEM-encoded private key file, used with `MIA_CATALOG_CLIENT_ID` to authenticate via private-key JWT. |
   | `MIA_CATALOG_ISSUER` | OIDC issuer URL used as both the discovery base and the expected issuer; the discovery document is looked up relative to this value. |
   | `MIA_CATALOG_ISSUER_METADATA` *(optional)* | Custom URL for the OIDC discovery document used to resolve the token endpoint. Defaults to a lookup relative to `MIA_CATALOG_ISSUER`. |
   | `MIA_CATALOG_TOKEN_ENDPOINT` *(optional)* | Custom token endpoint. When set, OIDC discovery is skipped entirely and this endpoint is used directly. |
   | `MIA_CATALOG_CUSTOM_SCOPE` *(optional)* | Scope requested during the token exchange. When unset, no scope is sent. `ibdm` correctly considers this optional to stay general, but in the context of catalog wiring it is needed to configure it (see **Info** below). |
   | `OIDC_DISCOVERY_PATH` *(optional)* | Well-known path suffix joined to `MIA_CATALOG_ISSUER` to fetch the OIDC discovery document. Defaults to `.well-known/openid-configuration`; has no effect when `MIA_CATALOG_ISSUER_METADATA` or `MIA_CATALOG_TOKEN_ENDPOINT` is set. |

   Every item written through this connector is associated to the *Connector* item created in step 1, so you can always tell which connector ingested a given entity (visible in the **Connector items** tab of the Connector detail page).
5. **Configure the source.** Set the source-specific environment variables documented in the page for that source.
6. **Launch.** Run either `ibdm sync <source>` or `ibdm run <source>`, selecting the internal mappings with `--include-internal-mappings` and passing your own with `--mapping-file`, as described in [Mappings](#mappings).

Running `ibdm` with `--local-output` redirects results to stdout instead of pushing to the Catalog — useful for checking what a selection of mappings produces before going live.

:::info
The credentials above are only for pushing items into the Catalog. If your `ibdm` deployment also needs to call other RBAC-protected Mia Platform APIs directly, register it as a **service account** instead — see [Registering a service account](/products/mia-platform-suite/rbac_management.md#registering-a-service-account).

**On the On-Prem installations**, the scope must comprehend `service_account` and the product-specific scope of the catalog that is `mia:catalog` (e.g. `scope=service_account mia:catalog`).

**On the Mia-Platform PaaS**, the `organization:*` scope must also be included in every token request, in addition to `service_account` and the product-specific scope of the catalog that is `mia:catalog` (e.g. `scope=service_account mia:catalog organization:*`). Without it, the PaaS token endpoint will not issue a usable token.
:::

## Available sources

| Source | Modes | Typical entities |
| :----- | :---- | :--------------- |
| [Microsoft Azure](/requirements/installation-guidelines/catalog/connectors/azure.md) | `sync` (Resource Graph), `run` (EventHub) | Cloud resources (compute, networking, storage, …) |
| [Microsoft Azure DevOps](/requirements/installation-guidelines/catalog/connectors/azure-devops.md) | `sync`, `run` (webhooks) | Repositories, teams |
| [Bitbucket](/requirements/installation-guidelines/catalog/connectors/bitbucket.md) | `sync`, `run` (webhooks) | Repositories, pipelines |
| [GitHub](/requirements/installation-guidelines/catalog/connectors/github.md) | `sync`, `run` (webhooks) | Repositories, workflow runs, access-token requests, workflow dispatches |
| [GitLab](/requirements/installation-guidelines/catalog/connectors/gitlab.md) | `sync`, `run` (webhooks) | Projects, pipelines, access tokens |
| [Google Cloud](/requirements/installation-guidelines/catalog/connectors/google-cloud.md) | `sync` (Cloud Asset API), `run` (PubSub) | Cloud resources |
| [Kubernetes](/requirements/installation-guidelines/catalog/connectors/kubernetes.md) | `sync`, `run` (watch) | Cluster, namespaces, workloads, pods, services, network policies, Helm releases, Traefik ingress routes, cert-manager certificates |
| [Mia-Platform Console](/requirements/installation-guidelines/catalog/connectors/mia-platform-console.md) | `sync`, `run` (webhooks) | Projects, revisions, services, clusters |
| [Sonatype Nexus](/requirements/installation-guidelines/catalog/connectors/nexus.md) | `sync`, `run` (webhooks) | Docker images |
| [Sysdig Secure](/requirements/installation-guidelines/catalog/connectors/sysdig.md) | `sync` (SysQL), `run` (webhooks) | Vulnerabilities |

## Installation

The recommended way to deploy `ibdm` in production is as a **Docker container**. Official images are published to both GitHub Container Registry and Docker Hub:

- `ghcr.io/mia-platform/ibdm`
- `docker.io/miaplatform/ibdm`

A typical deployment passes the source-specific and destination environment variables to the container, mounts the private key used to authenticate to the Catalog, and runs the appropriate `ibdm sync <source>` or `ibdm run <source>` command. The internal mappings are part of the image; mount a directory only for your external mappings, and pass it with `--mapping-file`. For example:

```sh
docker run --rm \
  -e MIA_CATALOG_ENDPOINT=... \
  -e MIA_CATALOG_CLIENT_ID=... \
  -e MIA_CATALOG_PRIVATE_KEY_PATH=/keys/private-key.pem \
  -e MIA_CATALOG_ISSUER=... \
  -e MIA_CATALOG_CUSTOM_SCOPE="service_account mia:catalog" \
  -e GITHUB_TOKEN=... \
  -e GITHUB_ORG=my-org \
  -v "$PWD/private-key.pem:/keys/private-key.pem:ro" \
  ghcr.io/mia-platform/ibdm:latest \
  ibdm sync github --include-internal-mappings=all
```

For local development and ad-hoc usage you can also install the binary directly from source:

```sh
go install github.com/mia-platform/ibdm@main
```

See the [`ibdm` installation guide](https://github.com/mia-platform/ibdm/blob/main/docs/how-to/010_installation.md) for the full list of installation options.

## See also

- [Items](/products/catalog/basic-concepts/10_items.md) — the shape of the entities produced by `ibdm`.
- [Item Types](/products/catalog/basic-concepts/20_item-types.md) — how to register custom kinds the connector can populate.
- [Catalog App → Connectors](/products/catalog/usage/catalog-app.md#connectors) — how to create and inspect a connector record from the UI.
