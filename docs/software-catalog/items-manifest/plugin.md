---
id: plugin
title: Plugin
sidebar_label: Plugin
---

import { catalogWellKnownItems } from "@mia-platform/console-types";
import SchemaViewer from "../snippets/schema_viewer.mdx";

Plugins are services that can be instantiated from the [microservices](/development_suite/api-console/api-design/services.md) section of the Console Design area.
Practically speaking, plugins are **Docker images** that comes with some predefined configurations to make them work in Console projects (e.g., environment variables, config maps, probes...).

To [create or edit](/software-catalog/items-management/overview.md) a plugin, you need to provide a [manifest](/software-catalog/items-manifest/overview.md), whose `resources` property should adhere to the following JSON schema.

:::tip
The JSON schemas of the [plugin resources](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/plugin.resources.schema.json) and of the [full plugin manifest](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/plugin.manifest.schema.json) are available on GitHub.
:::

<SchemaViewer schema={catalogWellKnownItems['plugin'].resourcesSchema} />
