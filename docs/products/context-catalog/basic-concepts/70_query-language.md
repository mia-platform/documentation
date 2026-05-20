---
id: query-language
title: Query Language
sidebar_label: Query Language
---

# Query Language

The Catalog exposes a query language to express filters that go beyond the simple `label=` and `field=` query parameters of the [REST API](../api-interactions.md). Queries are written as JSON, sent to the API through the `rawq` query parameter (URL-safe base64 encoded), and used internally by [Views](../catalog-administration.md#views), [Scorecards](./40_scorecards.md), and [Campaigns](./50_campaigns.md) to declare their scope.

This page describes the grammar of the query language and gives concrete examples.

:::tip
The full JSON schema describing the Catalog query language is [available to download](https://cdn.mia-platform.eu/catalog/v1alpha1/mia-platform.eu.v1alpha1.CatalogQuery.json).
:::

## Where it is used

- **`rawq` API parameter** on any `list` endpoint, for ad-hoc queries.
- **Scope** of a [View](../catalog-administration.md#views).
- **Scope** of a [Scorecard](./40_scorecards.md) or a [Campaign](./50_campaigns.md).

The same JSON shape is accepted everywhere; the only thing that differs is how it is transported (encoded as a query string for `rawq`, or stored verbatim on the catalog object for scopes).

## Query shape

A query is one of four node types:

| Node | Purpose |
| :--- | :------ |
| **Field predicate** | Test the value of one field on the item. |
| `and` | Logical AND of two or more sub-queries. |
| `or` | Logical OR of two or more sub-queries. |
| `related` | Select items that are related to a given item through a relationship type. |

The same query can mix all four nodes freely, with the following limits applied by the server:

- at most 20 sub-queries per `and` / `or` node,
- at most 6 levels of nesting,
- at most 3 `related` nodes per query,
- decoded JSON must not exceed roughly 4 KiB.

### Field predicates

A field predicate has the shape:

```json
{ "<json-path>": { "<operator>": <value> } }
```

Supported operators:

| Operator | Applies to | Meaning |
| :------- | :--------- | :------ |
| `eq`     | any primitive | equal to |
| `notEq`  | any primitive | not equal to |
| `gt`, `gte`, `lt`, `lte` | numbers | numeric comparison |
| `contains` | arrays | the array contains the given primitive |
| `notContains` | arrays | the array does not contain the given primitive |
| `matches` | strings | matches a regex of the form `/pattern/[i]` |
| `exists` | any field | field is present (`true`) / absent (`false`) |

Field paths reach into items with dot notation, the same way the simpler `field=` parameter does: e.g. `metadata.name`, `metadata.labels.env`, `spec.registry`. Predicates on `spec.*` fields require that those fields are declared as [selectable](./20_item-types.md#selectable-fields) on the item's ITD.

### Logical composition

`and` and `or` group one or more predicates:

```json
{ "and": [ <query>, <query>, ... ] }
{ "or":  [ <query>, <query>, ... ] }
```

### `related`: navigate the relationship graph

The `related` operator selects items that are connected to a given item through a relationship type:

```json
{
  "related": {
    "type": "<RelationshipType URN>",
    "as":   "source" | "target",
    "where": { "ref": "<item URN>" }
  }
}
```

- `type` is the URN of the `RelationshipType` (see [Relationships](./60_relationships.md)).
- `as` declares the role the *matched item* plays in the relationship: `source` means "match items that are the source of a relationship pointing to `where.ref`"; `target` means "match items that are the target of a relationship coming from `where.ref`".
- `where.ref` is the URN of the *other* endpoint.

For example, *"all items owned by the team `platform-team`"* — i.e. items that are the *target* of an `ownership` relationship whose source is `platform-team`:

```json
{
  "related": {
    "type": "urn:mia-platform-catalog:mia-platform.eu:v1alpha1:RelationshipType:ownership.mia-platform.eu",
    "as":   "target",
    "where": { "ref": "urn:mia-platform-catalog:mia-platform.eu:v1:Team:platform-team" }
  }
}
```

## Example: complex query

A non-trivial query that combines AND / OR and a regex:

```json
{
  "and": [
    { "spec.registry":  { "eq": "nexus.mia-platform.eu" } },
    { "spec.replicas":  { "gt": 0 } },
    {
      "or": [
        { "metadata.labels.env": { "eq": "production" } },
        { "metadata.tags":       { "contains": "critical" } }
      ]
    },
    { "metadata.name": { "matches": "/^api-.*/i" } }
  ]
}
```

To send this as `rawq`, URL-safe base64-encode the JSON and pass it:

```http
GET /stable.example.com/v1/items/dockerimages?rawq=<base64-of-the-JSON-above>
```

## Relationship with `label=` and `field=`

`rawq` is a superset of the simpler parameters:

- `label=<key>=<value>` is equivalent to `{ "metadata.labels.<key>": { "eq": "<value>" } }`.
- `field=<path>=<value>` is equivalent to `{ "<path>": { "eq": "<value>" } }`.

Use `label=` and `field=` for one-liner filters; reach for `rawq` when you need disjunctions, relationship navigation, or nested logic.

## See also

- [API Interactions](../api-interactions.md): how `rawq` is transported on the wire.
- [Relationships](./60_relationships.md): the relationship types `related` can traverse.
- [Item Types](./20_item-types.md#selectable-fields): how to make a `spec` field queryable.
