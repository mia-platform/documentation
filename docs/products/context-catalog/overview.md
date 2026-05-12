---
id: overview
title: Context Catalog Overview
sidebar_label: Overview
---

# Context Catalog Overview

The **Context Catalog** is Mia-Platform's system to record, classify, and connect any entity that lives in your organization, from software components and infrastructure resources to business artifacts and processes. It provides a unified, queryable model of your platform's "context" so that humans and automations can reason about what exists, how it relates, and whether it complies with the rules you care about.

## Core ideas

- **Items.** Anything tracked by the catalog is an *item*. Items can represent a piece of software (a service, a Docker image), a physical or cloud resource, a campaign, a rule, really anything you want to model.
- **Item Types.** Each item has a *type*. Items of the same type share a schema and form a *family*. Mia-Platform ships a set of default types and you can extend the catalog with your own through *Item Type Definitions* (ITDs).
- **Objects and manifests.** Both items and ITDs are stored as *objects* with a predictable shape (`apiVersion`, `kind`, `metadata`, `spec`). Their JSON/YAML representation is called a *manifest*.
- **Relationships.** Items can be connected through *typed, directed relationships*, modeled with the built-in `RelationshipType`, `RelationshipConstraint`, and `Relationship` kinds. Relationships form a graph that powers traversal, impact analysis, and discovery.
- **Organizations.** The catalog is scoped by *organizations*: each organization is an isolated namespace whose items are visible only within it (with the exception of the special `system` organization that ships shared, official ITDs).

## What you can do with it

- Build a single source of truth for the entities that matter to your platform.
- Extend the model with custom kinds and custom relationship types tailored to your domain.
- Query and filter items via a [REST API](./api-interactions.md) using labels, fields, or a Catalog-specific query language.
- Ingest data automatically from external systems through dedicated [connectors](./connectors/10_overview.md).
- Govern compliance by attaching rules, scorecards, and campaigns to your items (see [Campaigns](./basic-concepts/50_campaigns.md), [Evaluation Criteria](./basic-concepts/30_evaluation-criteria.md), [Scorecards](./basic-concepts/40_scorecards.md)).
- Browse and curate everything from the [Catalog Backoffice](./catalog-backoffice.md).

## Where to go next

- New to the catalog? Start with the [Getting Started](./getting-started.md) walkthrough, then the [Glossary](./basic-concepts/99_glossary.md) and the concepts of [Items](./basic-concepts/10_items.md) and [Item Types](./basic-concepts/20_item-types.md).
- Wiring items together? See [Relationships](./basic-concepts/60_relationships.md).
- Searching, scoping, filtering? See the [Query Language](./basic-concepts/70_query-language.md).
- Integrating with the API? Jump to [API Interactions](./api-interactions.md).
- Wiring data sources? See the [Connectors](./connectors/10_overview.md) section.
