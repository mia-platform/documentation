---
id: extension
title: Extension
sidebar_label: Extension
---

import { catalogWellKnownItems } from "@mia-platform/console-types";
import SchemaViewer from "../snippets/schema_viewer.mdx";

Extensions are **custom pages** that enhances Console capabilities by integrating it into the sidebar navigation. Since extensions have their own [dedicated section](/console/company-configuration/extensions.md), they are left out by the [Software Catalog UI][ui]. Extensions can still be managed with [miactl][miactl], and API calls.

To [create or edit](/software-catalog/items-management/overview.md) an extension, you need to provide a [manifest](/software-catalog/items-manifest/overview.md), whose `resources` property should adhere to the following JSON schema.

:::tip
The JSON schemas of the [extension resources](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/extension.resources.schema.json) and of the [full extension manifest](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/extension.manifest.schema.json) are available on GitHub.
:::

<SchemaViewer schema={catalogWellKnownItems['extension'].resourcesSchema} />
