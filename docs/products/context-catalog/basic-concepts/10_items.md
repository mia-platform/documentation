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

The `metadata` field has a fixed schema (independent of the item's kind) and declares a set of reserved fields. The most relevant ones are described below.

### `name`

The human- and machine-friendly identifier of the object. Names are unique among items of the same kind and are used as path parameters when retrieving an individual object. Names may be reused after deletion, must be set on creation, and cannot change afterwards.

Names follow the RFC 1035 DNS subdomain format:

- no more than 253 characters,
- only lowercase alphanumeric characters, `-`, or `.`,
- must start and end with an alphanumeric character.

Examples: `api-gateway`, `dockerimages.catalog.example.com`.

### `uid`

A server-assigned, universally unique identifier (UUID, RFC 4122) for the object. It is generated on successful creation and never changes. Every object created in the catalog has a distinct UID, which is used to distinguish between historical occurrences of similar entities.

### `creationTimestamp`

An RFC 3339 string with the date and time the object was created. Server-generated, immutable.

### `labels`

Key/value pairs identical in spirit to [Kubernetes labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). They are used for classifying and filtering objects.

- Both keys and values are strings.
- Label keys may have an optional prefix and a required name segment, separated by `/`. The name segment is at most 63 characters, must start and end with an alphanumeric character, and may contain `-`, `_`, `.` in between.
- The optional prefix must be a DNS subdomain (max 253 chars). If omitted, the key is considered private to the user. Automated components must specify a prefix.
- The `mia-platform.eu/` prefix is reserved.
- Label values are at most 63 characters; if non-empty they must start and end with an alphanumeric character and may contain `-`, `_`, `.` in between.

### `annotations`

Key/value pairs for arbitrary, non-identifying metadata, identical in use to [Kubernetes annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/). The key constraints match those of labels; values can be of any length but must be strings.

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

Items live inside an **organization**, which is a hard isolation boundary with its own database namespace. Resources of the same type must be unique within an organization. The only exception is the special `system` organization, which is consumable by everyone and used to provision official Mia-Platform ITDs to all organizations.

## Relationships

Items can be connected to one another through **relationships**: typed, directed links between a *source* and a *target* item. The catalog provides three built-in kinds (`RelationshipType`, `RelationshipConstraint`, and `Relationship`) that together model, govern, and record connections.
