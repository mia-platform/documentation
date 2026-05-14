---
id: items
title: Items
sidebar_label: Items
---

# Items

An **item** is the unit of information stored in the Context Catalog. It is an *object* whose schema depends on its kind, plus a fixed set of metadata that the catalog uses to identify, describe, and govern it.

This page focuses on items themselves: their shape, the meaning of each field, and how clients should reference them. Item *types*, the schemas that an item must respect, are described in [Item Types](./20_item-types.md).

## Describing an item

When you create an item, you must provide its specification together with a small amount of metadata. The same shape applies to objects exchanged with the [Catalog API](../api-interactions.md) and to descriptor files (manifests) on disk.

Example manifest of a Catalog item:

```yaml
apiVersion: servicecatalog.example.com/v1
kind: DockerImage
metadata:
  name: mia-api-gateway-100
spec:
  imageName: api-gateway
  registry: nexus.mia-platform.eu
  tag: 1.0.0
resourceVersion: 1
```

## Required fields

Every item manifest must declare:

- **`apiVersion`**: the version of the object schema, written as `{group}/{version}` (e.g. `mia-platform.eu/v1`). Group names are typically in domain-name form. Mia-Platform reserves use of any group ending in `mia-platform.eu`.
- **`kind`**: the high-level type of the object (e.g. `Service`).
- **`metadata`**: type-agnostic data that helps identify and describe the object (see below).
- **`spec`**: the type-specific data describing the state of the object. Its precise shape depends on the `apiVersion` + `kind` combination.
- **`resourceVersion`**: the internal version of the object. It is opaque to clients and must be passed back unmodified on update, patch, and conditional delete.

The pair `(apiVersion, kind)` must be enough for a parser to interpret the rest of the data, so it must be unique within an organization.

:::caution
Re-defining a core kind under a different API version is technically possible but strongly discouraged: it leads to confusion and misinterpretation.
:::

## Metadata

The `metadata` field has a fixed schema (independent of the item's kind) and declares a set of reserved fields. They are described below.

### `name`

The human- and machine-friendly identifier of the object. Names are unique among items of the same kind and are used as path parameters when retrieving an individual object. Names may be reused after deletion, must be set on creation, and cannot change afterwards.

Names follow the RFC 1035 DNS subdomain format:

- no more than 253 characters,
- only lowercase alphanumeric characters, `-`, or `.`,
- must start and end with an alphanumeric character.

Examples: `api-gateway`, `dockerimages.catalog.example.com`.

### `uid`

A server-assigned, universally unique identifier (UUID, RFC 4122) for the object. It is generated on successful creation and never changes. Every object created in the catalog has a distinct UID, which is used to distinguish between historical occurrences of similar entities.

### `urn`

A server-derived stable reference for the object, in the form `urn:mia-platform-catalog:<group>:<version>:<kind>:<name>`. Clients use it to reference an item unambiguously across the catalog (for example in relationships and in `CustomField.spec.applicableTo`). See [Primary key and Item URN](#primary-key-and-item-urn) for details.

### `creationTimestamp`

An RFC 3339 string with the date and time the object was created. Server-generated, immutable.

### `updateTimestamp`

An RFC 3339 string with the date and time the object was last modified. Server-generated and refreshed on every successful update or patch.

### `title`

A free-form, human-readable display name for the object. Unlike `name`, the title is not used as an identifier and can be changed at any time. Both filtering (`field=metadata.title=...`) and sorting (`sort=metadata.title`) honor this field.

### `description`

A free-form, human-readable description of the object. Useful to surface context for browsers of the [Catalog Administration](../catalog-administration.md).

### `tags`

A flat list of short strings used to categorize the item. Tags are the lightest form of classification the catalog offers and are intended to be set and consumed by humans directly through the UI. The Catalog API exposes them as a filterable field (`field=metadata.tags=...`).

### `labels`

Key/value pairs identical in spirit to [Kubernetes labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). They are used for classifying and filtering objects.

- Both keys and values are strings.
- Label keys may have an optional prefix and a required name segment, separated by `/`. The name segment is at most 63 characters, must start and end with an alphanumeric character, and may contain `-`, `_`, `.` in between.
- The optional prefix must be a DNS subdomain (max 253 chars). If omitted, the key is considered private to the user. Automated components must specify a prefix.
- The `mia-platform.eu/` prefix is reserved.
- Label values are at most 63 characters; if non-empty they must start and end with an alphanumeric character and may contain `-`, `_`, `.` in between.

### `annotations`

Key/value pairs for arbitrary, non-identifying metadata, identical in use to [Kubernetes annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/). The key constraints match those of labels; values can be of any length but must be strings.

Annotations are intended to be written and read by automated systems that need to attach side information to an item without altering its `spec` (for example, a connector recording the upstream entity ID, or a tool stamping a last-seen timestamp).

### `links`

A list of URL references attached to the object (e.g. dashboards, documentation pages, runbooks). Each link is a `{ url, title }` pair. Links are surfaced in the Catalog Administration and have no effect on the catalog logic itself.

## Tags, labels, annotations and custom fields

The catalog offers four different ways to attach additional information to an item. They are not interchangeable and serve different audiences:

| Mechanism | Lives in | Schema | Intended audience | Typical use |
| :-------- | :------- | :----- | :---------------- | :---------- |
| **Tags** | `metadata.tags` (array of strings) | None | Humans | Quick, free-form categorization from the UI. |
| **Labels** | `metadata.labels` (string→string map) | Format constraints on keys/values | Both humans and automation | Identifying classification used to query and filter items in bulk (e.g. `env=production`). |
| **Annotations** | `metadata.annotations` (string→string map) | Format constraints on keys; any string value | Automation | Side information stored by external systems on existing items, with no effect on identity. |
| **Custom fields** | `customFields` (top-level map on the item) | Typed JSON Schema, declared once by a `CustomField` entity and shared across multiple item types | Both humans and automation | Typed, validated extensions that live alongside the item without changing its ITD's `spec` schema. |

In short: pick **tags** for casual categorization, **labels** for structured identity, **annotations** for "stuff a system put here", and **custom fields** when you want a typed, validated extension that the ITD's `spec` schema does not describe.

### Custom fields in detail

Custom fields are stored on the item as a **top-level `customFields` map**:

```yaml
apiVersion: stable.example.com/v1
kind: DockerImage
metadata:
  name: mia-api-gateway-100
spec:
  imageName: api-gateway
  registry: nexus.mia-platform.eu
  tag: 1.0.0
customFields:
  sensitivity: confidential
  runtime/java-version: "21"
resourceVersion: 1
```

Each key in `customFields` corresponds to the `spec.key` of a separate `CustomField` catalog entity (kind `CustomField`, family `custom-fields`, group `mia-platform.eu/v1alpha1`). The `CustomField` declares:

- **`spec.key`** — the unique key used in items' `customFields` map. May be plain (e.g. `sensitivity`) or prefixed (e.g. `runtime/java-version`).
- **`spec.schema`** — a JSON Schema (Draft 2020-12) that validates the value of the field on items.
- **`spec.applicableTo`** *(optional)* — the list of item-type URNs this field applies to. If omitted, the field applies to **all** item types; an empty array means it applies to **none**.

Example `CustomField` declaration:

```yaml
apiVersion: mia-platform.eu/v1alpha1
kind: CustomField
metadata:
  name: sensitivity
spec:
  key: sensitivity
  schema:
    type: string
    enum: ["public", "internal", "confidential", "secret"]
  applicableTo:
    - urn:mia-platform-catalog:example.com:v1alpha1:Database
    - urn:mia-platform-catalog:example.com:v1alpha1:Service
```

Unlike an ITD's `spec` schema — which is fixed at the ITD-version level — a `CustomField` can be introduced or deprecated independently and reused across many item types. This makes custom fields the right tool when you want to attach an attribute (e.g. data sensitivity, runtime version, business owner) consistently across several otherwise unrelated kinds.

#### Patching custom fields

The `customFields` map has a dedicated endpoint that uses [JSON Merge Patch (RFC 7396)](https://www.rfc-editor.org/rfc/rfc7396) semantics:

```http
PATCH /{group}/{version}/items/{family}/{name}/custom-fields
Content-Type: application/merge-patch+json

{
  "sensitivity": "confidential",
  "runtime/java-version": null
}
```

- A non-null value **inserts or replaces** the entry for that key.
- A `null` value **removes** the entry from the map.
- Keys not mentioned in the body are left unchanged.

Every non-null key in the body must match an existing `CustomField` whose `spec.applicableTo` includes the item's type (or is omitted), and each value is validated against that `CustomField`'s `spec.schema`. Unknown or non-applicable keys return `400 Bad Request`.

:::note
Because the lifecycle of `CustomField` entities is independent from the items that use them, clients should not assume that a given key in `customFields` still corresponds to a live `CustomField` definition: a definition may be deleted while items still carry values for it. Handle missing definitions defensively.
:::

## Ownership and followers

Two relationships are central to the way the catalog associates people with items. Both Users and Teams are themselves first-class items in the catalog (built-in kinds under the `mia-platform.eu` group), so the relationships below are just ordinary Relationship objects between items, there is no special "principal" concept.

- **Owner.** Every item can have an *owner*, which is either a User or a Team. Ownership is modeled as a built-in relationship of type `ownership.mia-platform.eu` between the item and the User/Team. The Catalog Administration exposes ownership as a first-class field on the item form, but on the wire it is just a Relationship object — see [Relationships](./60_relationships.md).
- **Follower.** Any user can additionally *follow* an item to be notified about compliance events that involve it. Following is modeled as a built-in relationship of type `follow.mia-platform.eu` between the User and the item. Owners are implicitly considered followers.

## Primary key and Item URN

Each object has a server-assigned primary key in `metadata.uid` that is guaranteed unique across the system. Clients also provide an identifying key, `metadata.name`, which is unique across all API versions of the same resource. Only one object of a given kind can have a given name at a time; reusing a name after deletion creates a new object with a different UID.

Items can be referenced via URN:

```text
urn:mia-platform-catalog:<group>:<version>:<kind>:<name>
```

URN regex (named groups):

```text
^urn:mia-platform-catalog:(?<group>[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*):(?<version>v[0-9]+(?:alpha[0-9]+|beta[0-9]+)?):(?<kind>[a-zA-Z][a-zA-Z0-9]*):(?<name>[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?)$
```

Examples:

- `urn:mia-platform-catalog:stable.example.com:v1:DockerImage:my-resource`
- `urn:mia-platform-catalog:mia-platform.eu:v1alpha1:RelationshipType:ownership`

Omitting the trailing `:<name>` yields a **family selector**:

```text
urn:mia-platform-catalog:<group>:<version>:<kind>
```

## Referencing other items

When a field of one item points to another item, use the URN format and a key ending in `Ref` (e.g. `sourceRef`). The catalog validates only the URN format: it does not check that the referenced object actually exists.

## Organizations

Items live inside an **organization**, which is a hard isolation boundary with its own database namespace. Resources of the same type must be unique within an organization.

## Relationships

Items can be connected to one another through **relationships**: typed, directed links between a *source* and a *target* item. The catalog provides three built-in kinds (`RelationshipType`, `RelationshipConstraint`, and `Relationship`) that together model, govern, and record connections. See [Relationships](./60_relationships.md) for the full model, the built-in relationship types, and examples.

## See also

- [Item Types](./20_item-types.md): the schemas that an item's `spec` must respect.
- [Relationships](./60_relationships.md): how items reference one another, including ownership and follow.
- [Catalog Administration](../catalog-administration.md): where items are browsed, edited, and tagged in the UI.
