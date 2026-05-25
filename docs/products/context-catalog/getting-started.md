---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started with the Context Catalog

This page walks you through the very first interactions with the Context Catalog, from opening the Catalog Administration to your first item, first relationship and first compliance check. It assumes the catalog is already provisioned for your organization; if it is not, contact your platform administrator.

## Prerequisites

To get started you need:

- access to the [Catalog Administration](/products/context-catalog/catalog-administration.md) — the web UI is the easiest entry point;
- an **organization** in which to operate (the catalog isolates everything per organization, see [Items](/products/context-catalog/basic-concepts/10_items.md#organizations));
- optionally, credentials for the [Catalog API](/products/context-catalog/api-interactions.md) if you plan to script ingestion or queries.

## 1. Explore what is already there

When you open the Catalog Administration you land on the **Homepage**: a dashboard that gives you an at-a-glance overview of your catalog. From here you can see counters for total items, item types, connectors and items added in the current month, plus quick-action buttons (*View catalog*, *View item types*, *Create new item*, *Create scorecard*, *Create campaign*) and panels listing your **Scorecards**, **Campaigns**, **Recently added items**, and **Recently updated items**.

From the left sidebar, you can browse the following:

- **Items** → filter by kind to see what already exists.
- **Configuration → Item Types** to see which kinds are registered in your organization.
- **Configuration → Relationship Types** to see the connection types you can use to wire items together (see [Relationships](/products/context-catalog/basic-concepts/60_relationships.md)).
- **Configuration → Connectors** to see if any external system is already feeding the catalog automatically (see step 6 below).

## 2. Create your first custom Item Type

Most useful catalogs start by introducing a few **custom item types** specific to your domain. For example, you may want to track *Docker images* with their registry and tag.

From the Catalog Administration, go to **Configuration → Item Types → Create item type** and fill in:

- **API group** — a DNS-like name your team owns, e.g. `stable.example.com`.
- **Kind** and **plural** — e.g. `DockerImage` and `dockerimages`.
- **OpenAPI v3.1 schema** — the validation schema for the `spec` of the items (see [Item Types](/products/context-catalog/basic-concepts/20_item-types.md#the-validation-schema)).
- **Selectable fields** — the `spec` fields you want to filter on later (see [Selectable Fields](/products/context-catalog/basic-concepts/20_item-types.md#selectable-fields)).

Creating an ITD provisions a brand-new REST endpoint at `/{group}/{version}/items/{plural}`.

## 3. Create your first item

From **Items → Create item**, pick the type you just defined, fill in the [metadata](/products/context-catalog/basic-concepts/10_items.md#metadata) — [`title`](/products/context-catalog/basic-concepts/10_items.md#title), [`name`](/products/context-catalog/basic-concepts/10_items.md#name), [`description`](/products/context-catalog/basic-concepts/10_items.md#description), [`tags`](/products/context-catalog/basic-concepts/10_items.md#tags), [owner](/products/context-catalog/basic-concepts/10_items.md#ownership-and-followers) — and the [`spec`](/products/context-catalog/basic-concepts/10_items.md#required-fields) (the type-specific payload validated against the ITD's [schema](/products/context-catalog/basic-concepts/20_item-types.md#the-validation-schema)). The wizard validates the `spec` against the ITD schema as you type.

You can do the same thing via API by `POST`ing to the resource path; see [API Interactions](/products/context-catalog/api-interactions.md).

## 4. Connect items with a relationship

Open the detail page of an item, jump to the **Relationships** tab, and link it to another item using one of the [built-in relationship types](/products/context-catalog/basic-concepts/60_relationships.md#built-in-relationship-types) (e.g. `ownership`, `part-of`, `depends-on`) or one you have defined yourself. From now on, you can navigate that connection from either endpoint, both in the table view and in the graph view.

## 5. Run a compliance check

Once you have a few items, you can express compliance rules over them.

1. Go to **Governance → Evaluation Criteria → Create evaluation criteria** and write a rule (e.g. *"every DockerImage must have a tag"*). The rule body can be authored visually, as JSON, or in CEL — see [Evaluation Criteria](/products/context-catalog/basic-concepts/30_evaluation-criteria.md).
2. On the rule detail page, click **Evaluate** to trigger an ad-hoc run against your items. The run appears in the **Runs** tab and is polled to completion.

To go further, bundle multiple rules into a [Scorecard](/products/context-catalog/basic-concepts/40_scorecards.md) to express a multi-level compliance posture, or into a [Campaign](/products/context-catalog/basic-concepts/50_campaigns.md) to drive a time-bounded compliance program with notifications.

## 6. Plug in external data with connectors

Most catalogs are not populated by hand: they are kept in sync with the systems where the entities already live (source-code hosting, the Mia-Platform Console, cloud providers, artifact registries, security tools). The Context Catalog ingests data from dedicated connectors — see the [Connectors Overview](/products/context-catalog/connectors/10_overview.md) for the full picture. Our connector implementation is called `ibdm`.

In short, Mia-Platform connectors:

- are deployed alongside your platform and runs in **sync** mode (pull from the upstream REST APIs) or **run** mode (listen for webhooks);
- transform upstream payloads into Catalog items through user-provided **mapping files** (YAML with Go templates);
- write into the Catalog using a Client ID / Secret pair 

The high-level setup is:

1. **Register the connector in the Catalog Administration.** Open **Configuration → Connectors → Add connector** to create a *Connector* item and manually specify a Client ID / Secret pair (see [Connectors section](/products/context-catalog/catalog-administration.md#connectors) of the Catalog Administration reference).
2. **Configure `ibdm`.** Set `MIA_CATALOG_ENDPOINT`, `MIA_CATALOG_CLIENT_ID`, `MIA_CATALOG_CLIENT_SECRET` for the destination, plus the source-specific variables documented on each connector page.
3. **Pick a mapping file.** Reference mappings are provided in the [`ibdm` repository examples](https://github.com/mia-platform/ibdm/tree/main/docs/examples); you can use them as-is or customize them.
4. **Launch `ibdm`.** Either `ibdm sync <source>` for a one-off pull, or `ibdm run <source>` to expose a webhook listener.
5. **Inspect what came in.** Open the connector's detail page in the Catalog Administration and switch to the **Connector items** tab to browse the items it has synchronized.
6. **Wire compliance on top.** Point your [Evaluation Criteria](/products/context-catalog/basic-concepts/30_evaluation-criteria.md), [Scorecards](/products/context-catalog/basic-concepts/40_scorecards.md), and [Campaigns](/products/context-catalog/basic-concepts/50_campaigns.md) at the ingested items just like at hand-created items.

The available sources and the upstream system each one targets are listed in the [Connectors Overview](/products/context-catalog/connectors/10_overview.md).

## Where to go next

- [Items](/products/context-catalog/basic-concepts/10_items.md) and [Item Types](/products/context-catalog/basic-concepts/20_item-types.md) — the data model.
- [Relationships](/products/context-catalog/basic-concepts/60_relationships.md) — the graph layer.
- [Query Language](/products/context-catalog/basic-concepts/70_query-language.md) — how to search and scope.
- [Connectors](/products/context-catalog/connectors/10_overview.md) — feed the catalog from external systems through `ibdm`.
- [API Interactions](/products/context-catalog/api-interactions.md) — when you graduate from clicks to scripts.
- [Catalog Administration](/products/context-catalog/catalog-administration.md) — the UI reference.
