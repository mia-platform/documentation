---
id: relationships
title: Relationships
sidebar_label: Relationships
---

# Relationships

A **relationship** is a typed, directed link between a *source* item and a *target* item. Relationships form a graph layered on top of the catalog's items: they let you traverse from a service to its owners, from a deployment to the environment it targets, from a vulnerability to the artifacts it affects, and so on.

The catalog models relationships with three built-in kinds:

- `RelationshipType` — declares a *type* of connection (its semantic, plus the labels used to read it in each direction).
- `RelationshipConstraint` — declares which item kinds *may* participate as source and target of a given relationship type.
- `Relationship` — the actual instance linking two specific items through a relationship type.

All three are themselves catalog items, governed by Item Type Definitions under the `mia-platform.eu/v1alpha1` group, and exposed at fixed paths on the [Catalog API](../api-interactions.md#resource-uris).

## RelationshipType

A `RelationshipType` defines the *vocabulary* of a connection. It carries the labels used by the UI to phrase the relationship from each endpoint's perspective.

```yaml
apiVersion: mia-platform.eu/v1alpha1
kind: RelationshipType
metadata:
  name: part-of.mia-platform.eu
spec:
  names:
    sourceToTarget: is part of
    targetToSource: contains
```

Required fields:

- `spec.names.sourceToTarget` — how the relationship reads from the source toward the target (e.g. *"is part of"*, *"depends on"*, *"owns"*).
- `spec.names.targetToSource` — the reverse reading (e.g. *"contains"*, *"is a dependency of"*, *"is owned by"*).

### Built-in relationship types

The catalog ships with a small set of relationship types under the `mia-platform.eu` group:

| Name | source → target | target → source | Typical use |
| :--- | :-------------- | :-------------- | :---------- |
| `ownership.mia-platform.eu` | owns | is owned by | Connects a User or Team to the items they own. Surfaced by the UI as the item's *owner*. |
| `follow.mia-platform.eu` | follows | is followed by | Connects a User to an item they want to be notified about (see [Campaigns](./50_campaigns.md)). |
| `part-of.mia-platform.eu` | is part of | contains | Models containment (e.g. a Microservice *is part of* a Project). |
| `dependency.mia-platform.eu` | depends on | is a dependency of | Models runtime or build-time dependencies. |
| `affect.mia-platform.eu` | affects | is affected by | Connects a finding (e.g. a vulnerability) to the items it impacts. |
| `origin.mia-platform.eu` | originates from | is the origin of | Records provenance (e.g. an item ingested from a connector). |

You can introduce custom relationship types by creating additional `RelationshipType` items.

## RelationshipConstraint

A `RelationshipConstraint` declares which item kinds may legitimately participate in a relationship of a given type. It is the catalog's way to *document* the intended shape of the graph.

```yaml
apiVersion: mia-platform.eu/v1alpha1
kind: RelationshipConstraint
metadata:
  name: ownership-team-owns-service
spec:
  relationshipTypeRef: urn:mia-platform-catalog:mia-platform.eu:v1alpha1:RelationshipType:ownership.mia-platform.eu
  sourceType: urn:mia-platform-catalog:mia-platform.eu:v1:Team
  targetType: urn:mia-platform-catalog:mia-platform.eu:v1:Service
```

Required fields:

- `spec.relationshipTypeRef` — URN of the relationship type the constraint is about.
- `spec.sourceType` *(optional)* — URN of an item type (a *family selector*: URN without the trailing `:<name>`) that the source must belong to.
- `spec.targetType` *(optional)* — same, for the target item type.

Omitting `sourceType` or `targetType` leaves the corresponding side unconstrained.

:::note
Constraints are **permissive, not restrictive**: the catalog does not reject a `Relationship` whose source/target kinds do not match any registered constraint. Constraints are intended to (a) document intent for humans and tooling, and (b) drive graph traversal heuristics in the Backoffice. They are not a validation gate.
:::

## Relationship

A `Relationship` is the actual edge: it pairs a source item URN with a target item URN through a relationship type URN.

```yaml
apiVersion: mia-platform.eu/v1alpha1
kind: Relationship
metadata:
  name: api-gateway-owned-by-platform-team
spec:
  relationshipTypeRef: urn:mia-platform-catalog:mia-platform.eu:v1alpha1:RelationshipType:ownership.mia-platform.eu
  sourceRef: urn:mia-platform-catalog:mia-platform.eu:v1:Team:platform-team
  targetRef: urn:mia-platform-catalog:console.mia-platform.eu:v1:Service:api-gateway
```

Required fields:

- `spec.relationshipTypeRef` — URN of the `RelationshipType`.
- `spec.sourceRef` — URN of the source item.
- `spec.targetRef` — URN of the target item.

### Validation

When a `Relationship` is created or updated, the catalog validates only the **URN format** of `sourceRef` and `targetRef`. It does *not* check that the referenced items actually exist, nor that their kinds satisfy any matching `RelationshipConstraint`. This is consistent with the broader [item-reference policy](./10_items.md#referencing-other-items): references are loosely coupled by design, so that items can be created in any order and dangling references can be repaired without coordinated writes.

## Querying the graph

Once relationships exist, you can navigate them through:

- the **Relationships** tab of any item in the [Catalog Backoffice](../catalog-backoffice.md), as a table or as a visual graph;
- the `related` operator of the Catalog [Query Language](./70_query-language.md), to express queries such as *"all services owned by team X"* or *"all items affected by vulnerability Y"*.

## See also

- [Items](./10_items.md): the entities relationships connect.
- [Item Types](./20_item-types.md): how to introduce new kinds that participate in the graph.
- [Query Language](./70_query-language.md): how to traverse relationships in queries.
