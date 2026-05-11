---
id: item-types
title: Item Types
sidebar_label: Item Types
---

# Item Types

Each item in the Context Catalog has a **type**. Items of the same type are a **family** and share a common schema that defines the shape of the data they carry. The catalog can manage items of a given type only if that type has been registered through an **Item Type Definition (ITD)**.

Mia-Platform provides a set of default ITDs that enable the catalog to function correctly out of the box. Users and external systems can extend the catalog's functionalities with custom ITDs that introduce new kinds of items.

## How a type is identified

The type of an item is the combination of its `apiVersion` and `kind` root-level fields. The family of an item is used in API paths and matches the `plural` name of its ITD.

The link between an item and its ITD is:

- `item.apiVersion` matches `itd.spec.group/itd.spec.versions.name`,
- `item.kind` matches `itd.spec.names.kind`,
- the family matches `itd.spec.names.plural`.

For example, a call to `/console.mia-platform.eu/v1/items/projects` returns all items having `apiVersion = console.mia-platform.eu/v1` and `kind = Project`.

:::note
Mia-Platform reserves the use of any group name ending in `mia-platform.eu`.
:::

## Defining a custom Item Type

Custom item types are added to an organization by creating an `ItemTypeDefinition` object. ITDs are themselves catalog objects, so they are created via the standard [Catalog API](../api-interactions.md).

:::note
All catalog resources, including the built-in ones, are defined through ItemTypeDefinitions. The only exception is the `ItemTypeDefinition` kind itself.

ITDs for built-in resources declare a reserved group with the form `*mia-platform.eu`.
:::

Example ITD that introduces a `DockerImage` kind:

```yaml
apiVersion: mia-platform.eu/v1alpha1
kind: ItemTypeDefinition
metadata:
  # Name must match the spec fields below, and be in the form `<plural>.<group>`.
  name: dockerimages.stable.example.com
spec:
  # Group name to use for REST API `/api/{group}/{version}/items/{plural}/*`.
  group: stable.example.com
  versions:
    - name: v1
      # Each version can be enabled/disabled by Served flag.
      served: true
      # One and only one version must be marked as the storage version.
      storage: true
      schema:
        openAPIV31Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                registry:
                  type: string
                name:
                  type: string
                tag:
                  type: string
              required:
                - name
  # Always equal to "Organization"
  scope: Organization
  names:
    # Plural name to use for REST API `/api/{group}/{version}/items/{plural}/*`.
    plural: dockerimages
    # Kind is normally the CamelCased singular type. Your resource manifests use this.
    kind: DockerImage
```

Posting this ITD creates a new organization-scoped REST endpoint at:

```text
/api/stable.example.com/v1/items/dockerimages/*
```

Items created through that endpoint will have:

- `kind = DockerImage` (from `spec.names.kind`),
- `apiVersion = stable.example.com/v1` (from `spec.group` and `spec.versions.name`),
- `spec` validated against the schema declared in `spec.versions.schema.openAPIV31Schema`.

When you create a new ITD, the API server creates a new RESTful resource path for each version. The path is constructed as:

```text
/api/{spec.group}/{spec.versions.name}/items/{spec.names.plural}/*
```

## The validation schema

Resources store structured data in custom fields under their `spec` root field (alongside the built-in `apiVersion`, `kind`, and `metadata`, validated implicitly). ITDs must declare a schema in `spec.versions.schema.openAPIV31Schema` against which items are validated on creation and update.

This *structural schema* is an [OpenAPI v3.1 validation schema](https://spec.openapis.org/oas/v3.1.0.html#schema-object) which:

- specifies `object` as the root type,
- must have the first-level property `spec` containing the validation schema for the custom resource's `spec`,
- can have the first-level property `metadata`, restricted to constraints on the `metadata.name` field of the custom resource.

For example, a valid structural schema may be:

```yaml
type: object
properties:
  metadata:
    type: object
    properties:
      name:
        description: It is represented in RFC 1123 DNS label format.
        type: string
        minLength: 1
        maxLength: 63
        pattern: "^[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?$"
  spec:
    type: object
    properties:
      registry:
        type: string
      name:
        type: string
      tag:
        type: string
    required:
      - name
```

:::caution
The validation schema of an ITD version cannot be modified after creation. This guarantees the stability of the interface so clients can safely cache ITD versions and always interpret the `spec` of custom resources. To change the schema, create a new version of the ITD.
:::

## Naming conventions

When choosing names for objects and fields:

- The term **kind** is reserved for top-level API types. Use **type** for sub-categories within objects.
- Group names are typically in domain-name form. We recommend a subdomain your group or organization owns (e.g. `widget.my-company.com`). The `mia-platform.eu` group is reserved.
- Field names should be PascalCase or camelCase; aside from the initial letter, the two should match.
- Names should be declarative, not imperative (`SomethingDoer`, `DoneBy`, `DoneAt`).
- Avoid abbreviations except for very common ones (`id`, `args`, `stdin`). Acronym casing matches the surrounding context (e.g. `httpGet`, constants `TCP`/`UDP`).
- Field referencing another resource of kind `Foo` by name → `fooName`. Field referencing it by object reference → `fooRef`.
- Time fields → `somethingTime`. Avoid `*Timestamp` suffixes for new fields.
- Durations use the `fooSeconds` convention. Prefer `fooPeriodSeconds` for periodic intervals, `fooTimeoutSeconds` for inactivity deadlines, `fooDeadlineSeconds` for activity completion deadlines.
- Boolean fields named `fooable` (not `isFooable`). Think twice before using booleans: many ideas evolve into a small set of mutually exclusive options.
- Do not use unsigned integers (inconsistent across languages). Validate non-negativity instead.
- Numbers exceeding 53 bits in magnitude or precision should be serialized as strings.
- Avoid floating-point values entirely in `spec`: they cannot be reliably round-tripped.
- Enumerations are CamelCase strings (no numeric enums); acronyms keep all letters uppercase (e.g. `ClientIP`, `TCPDelay`).
- When selecting fields, use standard JavaScript syntax (e.g. `metadata.name`).

### Error messages

- Be precise.
- Tell users what they CAN do, not just what they cannot.
- Use **must** for positive requirements (e.g. "must be greater than 0"). Avoid "should", which implies optionality.
- Use **must not** for negative formatting requirements (e.g. "must not contain '..'").
- Use **may not** for negative behavioral requirements (e.g. "may not be specified when otherField is empty").
- Quote literal strings with single quotes; reference field names with backticks.
- Use words for inequalities ("must be less than 256"), not symbols.
- Use inclusive ranges when possible.
