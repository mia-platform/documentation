---
id: items-data-structure
title: Items data structure
---

import { catalogItemSchema } from "@mia-platform/console-types"
import SchemaViewer from "../snippets/schema_viewer.mdx";

An **item** (also referred to as a **component**) is the basic unit of the Catalog and represents a software resource that can be utilized in Mia-Platform Projects.

An item is always defined in a **specific Company** (field `tenantId`) and must have an **identifier** (field `itemId`) that is unique for that Company (i.e., two items can have the same `itemId` as long as they have a different `tenantId`). 

On top of that, items have **[versions][items-versioning]** (filed `version.name`) and multiple instances of the same `tenantId` and `itemId` can occur for different `version.name` values.

:::info
To summarize, an item is **univocally defined** by the combination of its **`tenantId`**, **`itemId`**, and **`version.name`** fields.
:::

Another defining property of an item is the **[type][items-type]** (field `type`) that determines how the item is handled by the Console.
Linked to the type are the **assets** (field `resources`), type-specific information needed to work with an item (e.g., the Docker image of a plugin, or the endpoints exposed by an application).

An item lives through different **[development phases][items-lifecycle]** (field `lifecycleStatus`), and its **[availability][items-visibility]** (field `visibility`) can be controlled for a better distribution.

## Item fields

Practically speaking, an item is a **JSON document** containing some defining keys, a set of metadata, and the resources needed to make use of it.

:::tip
The full JSON schema is available [on GitHub](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/item.schema.json).
:::

<SchemaViewer schema={catalogItemSchema} />

[items-type]: ./10_items-types.md
[items-versioning]: ./20_items-versioning.md
[items-lifecycle]: ./30_items-lifecycle.md
[items-visibility]: ./40_items-visibility.md
