---
id: catalog-integration
title: Catalog Integration
sidebar_label: Catalog Integration
---

:::caution Beta

Composable is in **beta**. We are actively shaping the product, so things may change as we iterate. Your feedback is welcome.

:::

# Catalog Integration

Composable does not keep its own copy of your infrastructure. The [Catalog](/products/catalog/overview.md) is its data source and its single source of truth: everything you design, save, or approve in Composable is stored there as items and relationships.

## What lives in the Catalog

- **Systems and Solutions**, with their revisions and lifecycle states.
- **Components and Models**, the reusable building blocks published by the Platform Team.
- **Resources and their relationships**, the nodes and edges you draw on the canvas, with typed, directional links.
- **The layout** of each canvas and its visual layers.

Because these are ordinary Catalog items, you can browse, filter, and query them with the same tools used for the rest of your platform. See [Items](/products/catalog/basic-concepts/10_items.md) and [Relationships](/products/catalog/basic-concepts/60_relationships.md).

## A digital twin of your ecosystem

Every action in Composable, such as saving a node, changing a parameter, or moving a Solution to another state, updates the Catalog right away. The Catalog therefore acts as a digital twin of your infrastructure that always matches what teams have designed and approved, and it notifies other systems through [webhooks](/products/catalog/basic-concepts/62_webhooks.md) without any polling.

## Governance from the Catalog

Composable benefits from the governance features of the Catalog, applied to the resources you design:

- **Scorecards.** Declarative rules, with no code, assign each resource a maturity level (for example Bronze, Silver, or Gold): a compute instance with a valid cost-center label, a data store with an encryption key, a service with up-to-date API documentation. While composing on the canvas, you get immediate feedback and can fix a configuration before it is deployed. See [Scorecards](/products/catalog/basic-concepts/40_scorecards.md).
- **Campaigns.** A campaign requires the adoption of a new directive by a deadline, such as upgrading a runtime version after a vulnerability, and tracks progress across all Systems. See [Campaigns](/products/catalog/basic-concepts/50_campaigns.md).
- **Audit log.** Every interaction is recorded with its author, timestamp, and type of change, in an open format. See [Audit logs](/products/catalog/basic-concepts/68_audit-logs.md).

## Access control

What each person can do in Composable follows the roles assigned to them in the Catalog, so permissions are managed in one place for the whole platform.

## Where to go next

- **[Overview](/products/composable/overview.md)**: who Composable is for and the problems it solves.
- **[Integrations](/products/composable/integrations.md)**: ITSM, GitOps, cloud connectors, webhooks, API, and MCP.
