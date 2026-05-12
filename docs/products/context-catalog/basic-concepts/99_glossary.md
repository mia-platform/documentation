---
id: glossary
title: Glossary
sidebar_label: Glossary
---

# Glossary

This page lists the foundational terms used across the Context Catalog. Cross-referenced concepts are linked to their dedicated documentation pages.

## Item

An **item** is an entity recorded on the catalog. Anything can be an item, from a piece of software to a tangible physical resource. See [Items](./10_items.md).

## Type and family

Each item has a **type**. Items of the same type form a **family** and share a common schema that defines the shape of their information (e.g., an item of type *Project* belongs to the *projects* family).

:::note Technical note
The type of an item is indicated by the combination of its `apiVersion` and `kind` root-level fields. The family is used to interact with items via API.

For example, a call to `/console.mia-platform.eu/v1/items/projects` returns all items having `apiVersion = console.mia-platform.eu/v1` and `kind = Project`.
:::

## Item Type Definition (ITD)

For the catalog to manage items of a given type, an **Item Type Definition (ITD)** must register that type in the system. Mia-Platform ships a set of default ITDs that enable core functionality; you can extend the catalog with custom ITDs of your own. See [Item Types](./20_item-types.md).

:::note Technical note
An ITD declares a *group*, a *kind*, a *family*, and one or more *versions*. The link between an item and its ITD is:
- `item.apiVersion` matches `itd.spec.group/itd.spec.versions.name`,
- `item.kind` matches `itd.spec.names.kind`,
- the item family matches `itd.spec.names.plural`.

Mia-Platform reserves the use of any group name ending in `mia-platform.eu`.
:::

## Object

Items and ITDs are stored as **objects**. Objects share a predictable structure built around root-level fields:

- `apiVersion`: the version of the schema for this object (e.g. `mia-platform.eu/v1`).
- `kind`: the schema identifier (e.g. `Service`).
- `metadata`: type-agnostic data identifying and describing the object.
- `spec`: the type-specific information of the object.

## Manifest

A **manifest** is the JSON or YAML representation of an object. The Catalog API exchanges JSON; descriptor files are typically YAML for readability, but the structure and semantics are identical.

## Relationship

A **relationship** is a typed, directed link between a *source* item and a *target* item. The catalog provides built-in kinds (`RelationshipType`, `RelationshipConstraint`, and `Relationship`) to model, govern, and record connections between items. See [Relationships](./60_relationships.md).

## Tags, labels, annotations, custom fields

Four different mechanisms to attach additional information to an item, each with a different audience and contract:

- **Tags**: free-form strings for human categorization (`metadata.tags`).
- **Labels**: structured key/value pairs used for filtering and identity (`metadata.labels`).
- **Annotations**: arbitrary key/value pairs reserved to automated systems (`metadata.annotations`).
- **Custom fields**: typed extensions stored in the top-level `customFields` map of an item, governed by separate `CustomField` definitions that declare a JSON Schema and the item types they apply to.

See [Items](./10_items.md#tags-labels-annotations-and-custom-fields) for the full comparison.

## Owner and follower

An **owner** is a User or Team responsible for an item, modeled as a built-in `ownership` relationship. A **follower** is any User who wants to receive compliance notifications about an item, modeled as a built-in `follow` relationship. Both relationships are surfaced in the UI and queried like any other relationship. See [Items](./10_items.md#ownership-and-followers).

## View

A **View** is a saved, named query that scopes the catalog to a subset of items. Views are themselves catalog items: they can be referenced by [Scorecards](./40_scorecards.md) and [Campaigns](./50_campaigns.md) to declare their scope, and they appear in the [Catalog Backoffice](../catalog-backoffice.md#views) sidebar as bookmarks.

## Selectable field

A `spec` field declared on an [Item Type Definition](./20_item-types.md#selectable-fields) as queryable. The catalog provisions an index on selectable fields so that `field=` and `rawq` filters can target them.

## Organization

An **organization** is a hard isolation boundary in the catalog: each organization has its own database namespace, and resources of the same type must be unique within it. The special `system` organization is consumable by anyone and is used to provision official Mia-Platform ITDs.

## URN (Item URN)

Items can be referenced by **URN** in the format:

```text
urn:mia-platform-catalog:<group>:<version>:<kind>:<name>
```

Examples:

- `urn:mia-platform-catalog:stable.example.com:v1:DockerImage:my-resource`
- `urn:mia-platform-catalog:mia-platform.eu:v1alpha1:RelationshipType:ownership`

Omitting the trailing `:<name>` yields an **item type URN**, which selects an entire family.

## Resource version

Each object carries a `resourceVersion` integer that uniquely identifies its current revision. The server changes it on every modification; clients pass it back unchanged on update, patch, and conditional delete operations to enable optimistic concurrency control.

## Compliance terms

- **Rule**: A deterministic condition evaluated against a Catalog item. See [Evaluation Criteria](./30_evaluation-criteria.md).
- **Rule-run**: The record of a single evaluation of a rule against a context of items.
- **Campaign**: A grouping of rules that must be satisfied by a set of items within a defined time window. See [Campaigns](./50_campaigns.md).
- **Scorecard**: A set of rules evaluated on a scope of items, used to express overall compliance posture. See [Scorecards](./40_scorecards.md).
