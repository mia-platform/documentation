---
id: items-types
title: Item Type Definitions
---

Each item of the Catalog has a certain **type**. Different types represents different artifacts that are handled in specific ways by the Console.

The Catalog comes with a set of pre-defined [well-known types](#well-known-itds), but users can extend the Catalog capabilities setting up custom types through **Item Type Definitions** (*ITDs* from now on). An ITD is an entity that both *makes a new type available for use* and *outlines how items of that type should look like*.

As for items, an ITD exists in the context of a **specific Company** (field `metadata.namespace`) and must have an **identifier** (field `metadata.name`) that is unique for that Company (i.e., two ITDs can have the same `metadata.name` as long as they have a different `metadata.namespace`). The namespace and the identifier are what items use to **reference the ITD** they are build upon (field [`itemTypeDefinitionRef`](/software-catalog/basic-concepts/05_items-data-structure.md#item-fields). 

Through the content of the `spec` field, an ITD provides details on how the items of its type should behave. The most important information are conveyed by the field `spec.isVersioningSupported`, which specifies whether items support [versioning](/software-catalog/basic-concepts/20_items-versioning.md), and by the field `spec.validation` that shapes and validates the content of the items `resources` field.

For a full overview of the ITD data structure, refer to the [manifest page](/software-catalog/items-manifest/overview.md#item-type-definition)

## Well-known ITDs

The Catalog is shipped with a set of ITDs **essential for the operation of the Console** that are maintained directly by Mia-Platform.

The full list of well-known ITDs can be found in the [items manifest](/software-catalog/items-manifest/overview.md) section.

:::warning
The well-known ITDs are protected by a strict layer of permissions. In any case, please **refrain from tampering with them** in any way to avoid disrupting the correct functioning of the Console.
:::
