---
id: items-data-structure
title: Items
---

import { catalogItemSchema } from "@mia-platform/console-types"
import SchemaViewer from "../snippets/schema_viewer.mdx";

An **item** (also referred to as a **component**) is the basic unit of the Catalog and represents a software resource that can be utilized in Mia-Platform Projects.

An item is always defined in a **specific Company** (field `tenantId`) and must have an **identifier** (field `itemId`) that is unique for that Company (i.e., two items can have the same `itemId` as long as they have a different `tenantId`). 

On top of that, items have **[versions](/products/software-catalog/basic-concepts/20_items-versioning.md)** (filed `version.name`) and multiple instances of the same `tenantId` and `itemId` can occur for different `version.name` values.

:::info
To summarize, an item is **univocally defined** by the combination of its **`tenantId`**, **`itemId`**, and **`version.name`** fields.
:::

Another defining property of an item is the **type** (field `type` and `itemTypeDefinitionRef`) that determines how the item is handled by the Console. Types are defined and described by **[Item Type Definitions](/products/software-catalog/basic-concepts/10_items-types.md)**, another kind of user-controlled core Catalog entity.

Linked to the type are the **assets** (field `resources`), type-specific information needed to work with an item (e.g., the Docker image of a plugin, or the endpoints exposed by an application).

An item lives through different **[development phases](/products/software-catalog/basic-concepts/30_items-lifecycle.md)** (field `lifecycleStatus`), and its **[availability](/products/software-catalog/basic-concepts/40_items-visibility.md)** (field `visibility`) can be controlled for a better distribution.

## Item fields

Practically speaking, an item is a **JSON document** containing some defining keys, a set of metadata, and the resources needed to make use of it.

:::tip
The full JSON schema is available [on GitHub](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.39.2/packages/console-types/schemas/software-catalog/item.schema.json).
:::

<SchemaViewer schema={catalogItemSchema} />
