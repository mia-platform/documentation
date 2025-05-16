---
id: overview
title: Items manifest
---

import { catalogItemManifestSchema } from "@mia-platform/console-types"
import SchemaViewer from "../snippets/schema_viewer.mdx";

The information needed to [create or edit an item][items-managements] (or, better yet, an item release) must be provided through a **manifest**, a JSON representation of the [data][items-data-structure] to store on the database.

Manifests top-level structure is the same for any item, while the content of the `resources` property is specific for each [item type][items-type].

What follows is the formal definition of a generic manifest, with the other pages of this section documenting how the **assets** (field `resources`) should be shaped for each type.

:::tip
The full JSON schema is available [on GitHub](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/item-manifest.schema.json).
:::

<SchemaViewer schema={catalogItemManifestSchema} />

## Categories

Items can be organized in categories with the field `catagoryId`. The available categories are pre-defined, and can be found [here](https://raw.githubusercontent.com/mia-platform-marketplace/public-catalog/refs/heads/main/assets/categories.json).

## Permissions

To create or edit items, users must have the [role](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#identity-capabilities-inside-console) of **Company Owner** or **Project Administrator** in the Company the item belongs to.

On top of that, the specific permission [**`marketplace.root.manage`**](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#console-root-level-permissions) is needed to set or edit these restricted properties:

- `publishOnMiaDocumentation`
- `supportedBy`
- `supportedByImage`
- `visibility`

[items-data-structure]: ../basic-concepts/05_items-data-structure.md
[items-type]: ../basic-concepts/10_items-types.md
[items-managements]: ../items-management/overview.md
