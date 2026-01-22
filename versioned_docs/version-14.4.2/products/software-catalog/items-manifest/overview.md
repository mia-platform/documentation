---
id: overview
title: Software Catalog manifests
sidebar_label: Catalog manifests
---

import { catalogItemTypeDefinitionSchema, catalogItemManifestSchema } from "@mia-platform/console-types";
import SchemaViewer from "../snippets/schema_viewer.mdx";

A **manifest** is a JSON representation of an entity that can be [applied](/products/software-catalog/items-management/overview.md) to the Catalog.

## Item Type Definition

The manifest of an [ITD](/products/software-catalog/basic-concepts/10_items-types.md) contains metadata about the definition itself and specifications regarding the items of the defined type.

:::tip
The full JSON schema is available [on GitHub](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.39.2/packages/console-types/schemas/software-catalog/item-type-definition.schema.json).
:::

<SchemaViewer schema={catalogItemTypeDefinitionSchema} />

## Item

[Item](/products/software-catalog/basic-concepts/05_items-data-structure.md) manifests partially varies based on the referenced ITD: the **top-level structure** of the manifest is the same for any item, while the content of the **`resources` property** is specific for each ITD.

What follows is the formal definition of a generic manifest, with the other pages of this section documenting how the **assets** (field `resources`) should be shaped for each type.

:::tip
The full JSON schema is available [on GitHub](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.39.2/packages/console-types/schemas/software-catalog/item-manifest.schema.json).
:::

<SchemaViewer schema={catalogItemManifestSchema} />

### Categories

Items can be organized in categories with the field `catagoryId`. The available categories are pre-defined, and can be found [here](https://raw.githubusercontent.com/mia-platform-marketplace/public-catalog/refs/heads/main/assets/categories.json).
