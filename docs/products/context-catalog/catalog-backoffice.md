---
id: catalog-backoffice
title: Catalog Backoffice
sidebar_label: Catalog Backoffice
---

# Catalog Backoffice

The **Catalog Backoffice** is the web interface that lets operators and platform users browse the Context Catalog, inspect the entities it tracks, and oversee compliance activities. It is the human-facing complement to the [Catalog API](./api-interactions.md).

## What you can do

- **Browse items.** Navigate the catalog by item type, filter by labels and fields, and inspect the full manifest of any item.
- **Explore relationships.** Traverse the directed graph of relationships between items to perform impact analysis or discover dependencies.
- **Monitor compliance.** View the results of [Evaluation Criteria](./basic-concepts/30_evaluation-criteria.md) (rule runs) attached to your items, follow [Campaigns](./basic-concepts/50_campaigns.md), and check [Scorecards](./basic-concepts/40_scorecards.md) progress.
- **Curate data.** Edit metadata, labels, and annotations on items where the model allows it, and trigger ad-hoc rule evaluations.

## Architecture

The backoffice is the entry point of a small set of cooperating services:

| Component | Role |
| :-------- | :--- |
| **catalog-frontend** | Web UI for the catalog. Lets users browse items, view rule evaluation results, and monitor campaign progress. |
| **catalog-bff** | Backend-for-Frontend between the UI and the Catalog Engine. Aggregates and adapts data for UI consumption. |
| **catalog-engine** | Core catalog backend. Stores and manages items and exposes the [Catalog API](./api-interactions.md). |
| **policy-engine** | Stateless rule-evaluation engine that drives compliance evaluations. |
| **mail-notification-service** | Sends notifications to followers of catalog items (e.g. when a campaign ends with non-compliant items). |
| **postgresql** | Relational store backing the catalog and the compliance manager. |

The backoffice never talks to the Catalog Engine directly: every read or write goes through the catalog-bff, which mediates authorization, performs aggregations, and adapts the underlying API to the UI's needs.

## Items, types, and extensions

The backoffice renders any kind defined in the catalog: both Mia-Platform's built-in kinds and any custom [Item Types](./basic-concepts/20_item-types.md) you have introduced through Item Type Definitions. As soon as a new ITD is registered, the corresponding family becomes browsable in the UI without redeploying the frontend.

## Where to go next

- See [API Interactions](./api-interactions.md) for the underlying API the backoffice consumes.
- See [Items](./basic-concepts/10_items.md) and [Item Types](./basic-concepts/20_item-types.md) to understand what you are looking at in the UI.
- See [Connectors](./connectors/github.md) to learn how external systems feed data into the catalog.
