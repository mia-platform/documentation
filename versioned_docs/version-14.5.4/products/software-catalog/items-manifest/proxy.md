---
id: proxy
title: Proxy
sidebar_label: Proxy
---

import { catalogWellKnownItems } from "@mia-platform/console-types";
import SchemaViewer from "../snippets/schema_viewer.mdx";

Proxies are **specific configurations** used to invoke APIs that are not part of the current project but may be exposed by an external provider or another project. Proxies can be instantiated from the [dedicated section](/products/console/api-console/api-design/proxy.md) of the Console Design area.

To [create or edit](/products/software-catalog/items-management/overview.md) a proxy, you need to provide a [manifest](/products/software-catalog/items-manifest/overview.md), whose `resources` property should adhere to the following JSON schema.

:::tip
The JSON schemas of the [proxy resources](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.39.2/packages/console-types/schemas/software-catalog/proxy.resources.schema.json) and of the [full proxy manifest](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.39.2/packages/console-types/schemas/software-catalog/proxy.manifest.schema.json) are available on GitHub.
:::

<SchemaViewer schema={catalogWellKnownItems['proxy'].resourcesSchema} />
