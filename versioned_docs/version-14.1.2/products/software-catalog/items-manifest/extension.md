---
id: extension
title: Extension
sidebar_label: Extension
---

import { catalogWellKnownItems } from "@mia-platform/console-types";
import SchemaViewer from "../snippets/schema_viewer.mdx";

Extensions are **custom pages** that enhances Console capabilities by integrating it into the sidebar navigation.

To [create or edit](/products/software-catalog/items-management/overview.md) an extension, you need to provide a [manifest](/products/software-catalog/items-manifest/overview.md), whose `resources` property should adhere to the following JSON schema.

:::tip
The JSON schemas of the [extension resources](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.39.2/packages/console-types/schemas/software-catalog/extension.resources.schema.json) and of the [full extension manifest](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.39.2/packages/console-types/schemas/software-catalog/extension.manifest.schema.json) are available on GitHub.
:::

<SchemaViewer schema={catalogWellKnownItems['extension'].resourcesSchema} />
