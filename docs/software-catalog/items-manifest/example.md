---
id: example
title: Example
sidebar_label: Example
---

import { catalogWellKnownItems } from "@mia-platform/console-types";
import SchemaViewer from "../snippets/schema_viewer.mdx";

Examples works no differently than [templates](/software-catalog/items-manifest/template.md), in the sense that they too provide an **archive** with base configurations. Unlike templates, examples should come with some features already implemented and tailored to help the user better familiarize with the development environment.

:::tip
Any additional information presented in the [template section](/software-catalog/items-manifest/template.md) will work for example items.
:::

To [create or edit](/software-catalog/items-management/overview.md) an example, you need to provide a [manifest](/software-catalog/items-manifest/overview.md), whose `resources` property should adhere to the following JSON schema.

:::tip
The JSON schemas of the [example resources](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/example.resources.schema.json) and of the [full example manifest](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/example.manifest.schema.json) are available on GitHub.
:::

<SchemaViewer schema={catalogWellKnownItems['example'].resourcesSchema} />
