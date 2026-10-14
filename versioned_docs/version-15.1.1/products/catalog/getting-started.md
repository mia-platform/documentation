---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started with the Catalog

This page walks you through the very first interactions with the Catalog, from opening the Catalog App to your first item, first relationship and first compliance check. It assumes the catalog is already provisioned for your organization; if it is not, contact your platform administrator.

## Prerequisites

To get started you need:

- access to the [Catalog App](/products/catalog/usage/catalog-app.md) — the web UI is the easiest entry point;
- an **organization** in which to operate (the catalog isolates everything per organization, see [Items](/products/catalog/basic-concepts/10_items.md#organizations));
- optionally, credentials for the [Catalog API](/products/catalog/usage/catalog-api.md) if you plan to script ingestion or queries.

## 1. Explore what is already there

When you open the Catalog App you land on the **Homepage**: a dashboard that gives you an at-a-glance overview of your catalog. From here you can see counters for total items, item types, connectors and items added in the current month, plus quick-action buttons (*View catalog*, *View item types*, *Create new item*, *Create scorecard*, *Create campaign*) and panels listing your **Scorecards**, **Campaigns**, **Recently added items**, and **Recently updated items**.

From the left sidebar, you can browse the following:

- **Items** → filter by kind to see what already exists.
- **Configuration → Item Types** to see which kinds are registered in your organization.
- **Configuration → Relationship Types** to see the connection types you can use to wire items together (see [Relationships](/products/catalog/basic-concepts/60_relationships.md)).
- **Configuration → Connectors** to see if any external system is already feeding the catalog automatically (see step 6 below).

## 2. Create your first custom Item Type

Most useful catalogs start by introducing a few **custom item types** specific to your domain. For example, you may want to track *Docker images* with their registry and tag.

From the Catalog App, go to **Configuration → Item Types → Create item type** and fill in:

- **Group** — a DNS-like name your team owns, e.g. `stable.acme.com`.
- **Scope** — `Organization` or `Project`, depending on whether items of this type should be visible catalog-wide or scoped to a single project.
- **Kind** and **Plural** — e.g. `DockerImage` and `dockerimages`.
- **Version name** — e.g. `v1`, following the `v<number>` (optionally `alpha<number>`/`beta<number>`) pattern.
- **Validation Schema** — the OpenAPI-style JSON schema for the `spec` of the items (see [Item Types](/products/catalog/basic-concepts/20_item-types.md#the-validation-schema)).
- **Selectable fields** — the `spec` fields you want to filter on later (see [Selectable Fields](/products/catalog/basic-concepts/20_item-types.md#selectable-fields)).

Creating an ITD provisions a brand-new REST endpoint at `/{group}/{version}/items/{plural}`.

## 3. Create your first item

From **Items → Create item**, pick the type you just defined, and fill in:

- [metadata](/products/catalog/basic-concepts/10_items.md#metadata): [`title`](/products/catalog/basic-concepts/10_items.md#title), [`name`](/products/catalog/basic-concepts/10_items.md#name), [`description`](/products/catalog/basic-concepts/10_items.md#description), [`tags`](/products/catalog/basic-concepts/10_items.md#tags), [owner](/products/catalog/basic-concepts/10_items.md#ownership-and-followers)
- [`spec`](/products/catalog/basic-concepts/10_items.md#required-fields) (the type-specific payload validated against the ITD's [schema](/products/catalog/basic-concepts/20_item-types.md#the-validation-schema)).

The wizard validates the `spec` against the ITD schema as you type.

You can do the same thing via API by sending a `POST` request to the resource path; see [Catalog API](/products/catalog/usage/catalog-api.md).

## 4. Connect items with a relationship

Open the detail page of an item, jump to the **Relationships** tab, and link it to another item using one of the [built-in relationship types](/products/catalog/basic-concepts/60_relationships.md#built-in-relationship-types) (e.g. `part-of`, `dependency`) or one you have defined yourself. From now on, you can navigate that connection from either endpoint, both in the table view and in the graph view.

## 5. Run a compliance check

Once you have a few items, you can express compliance rules over them.

1. Go to **Governance → Evaluation Criteria → Create evaluation criteria** and write a rule (e.g. *"every DockerImage must have a tag"*). The rule body can be authored visually, as JSON, or in CEL — see [Evaluation Criteria](/products/catalog/basic-concepts/30_evaluation-criteria.md).
2. On the rule detail page, click **Evaluate** to trigger an ad-hoc run against your items. The run appears in the **Runs** tab and is polled to completion.

To go further, bundle multiple rules into a [Scorecard](/products/catalog/basic-concepts/40_scorecards.md) to express a multi-level compliance posture, or into a [Campaign](/products/catalog/basic-concepts/50_campaigns.md) to drive a time-bounded compliance program with notifications.

## 6. Plug in external data with connectors

Most catalogs are not populated by hand: they are kept in sync with the systems where the entities already live (source-code hosting, the Mia-Platform Console, cloud providers, artifact registries, security tools). The Catalog ingests data from dedicated connectors — see the [Connectors Overview](/products/catalog/connectors/10_overview.md) for the full picture. Our connector implementation is called `ibdm`.

In short, Mia-Platform connectors:

- are deployed alongside your platform and run in **sync** mode (a one-off pull from the upstream REST APIs) or **run** mode (an event-stream integration that, depending on the source, either listens for webhooks or polls the upstream system);
- transform upstream payloads into Catalog items through user-provided **mapping files** (YAML with Go templates);
- write into the Catalog authenticated with a Client ID / Secret pair.

The high-level setup is:

1. **Register a matching service account.** The Client Secret (or key pair, for `private_key_jwt`) is not set in the Catalog App — a platform Super Admin registers it separately, with the *same* Client ID, as a **service account** in Platform Administration. See [Registering a service account](/products/mia-platform-suite/rbac_management.md#registering-a-service-account).

2. **Register the connector in the Catalog App.** Open **Configuration → Connectors → Add connector** to create a *Connector* item and give it a Client ID — every item it later syncs in will be attributed to this ID (see [Connectors section](/products/catalog/usage/catalog-app.md#connectors) of the Catalog App reference). This step is only about attribution/labeling; it does not create any credential.
3. **Configure `ibdm`.** Set `MIA_CATALOG_ENDPOINT`, `MIA_CATALOG_CLIENT_ID` (matching the Client ID from step 1), and `MIA_CATALOG_CLIENT_SECRET` for the destination, plus the source-specific variables documented on each connector page.
4. **Add a mapping file.** Reference mappings are provided in the [`ibdm` repository examples](https://github.com/mia-platform/ibdm/tree/main/docs/examples); you can use them as-is or customize them.
5. **Launch `ibdm`.** Either `ibdm sync <source> --mapping-file mapping.yaml` for a one-off pull, or `ibdm run <source> --mapping-file mapping.yaml` to start the event-stream integration.
6. **Inspect what came in.** Open the connector's detail page in the Catalog App and switch to the **Imported items** tab to browse the items it has synchronized.
7. **Wire compliance on top.** Point your [Evaluation Criteria](/products/catalog/basic-concepts/30_evaluation-criteria.md), [Scorecards](/products/catalog/basic-concepts/40_scorecards.md), and [Campaigns](/products/catalog/basic-concepts/50_campaigns.md) at the ingested items just like at hand-created items.

The available sources and the upstream system each one targets are listed in the [Connectors Overview](/products/catalog/connectors/10_overview.md).

## Where to go next

- [Items](/products/catalog/basic-concepts/10_items.md) and [Item Types](/products/catalog/basic-concepts/20_item-types.md) — the data model.
- [Relationships](/products/catalog/basic-concepts/60_relationships.md) — the graph layer.
- [Query Language](/products/catalog/basic-concepts/70_query-language.md) — how to search and scope.
- [Connectors](/products/catalog/connectors/10_overview.md) — feed the catalog from external systems through `ibdm`.
- [Catalog API](/products/catalog/usage/catalog-api.md) — when you graduate from clicks to scripts.
- [Catalog App](/products/catalog/usage/catalog-app.md) — the UI reference.
