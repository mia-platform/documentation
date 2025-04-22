---
id: infrastructure-resource
title: Infrastructure resource
sidebar_label: Infrastructure resource
---

import { catalogWellKnownItems } from "@mia-platform/console-types";
import SchemaViewer from "../snippets/schema_viewer.mdx";

Infrastructure resources are **custom objects** that are not part of the standard Console supported resources. They can be managed from the [dedicated section](/console/design-your-projects/custom-resources/custom-resources.md) of the Console Design area.

To [create or edit](/software-catalog/items-management/overview.md) an infrastructure resource, you need to provide a [manifest](/software-catalog/items-manifest/overview.md), whose `resources` property should adhere to the following JSON schema.

:::tip
The JSON schemas of the [infrastructure resource resources](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/custom-resource.resources.schema.json) and of the [full infrastructure resource manifest](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/custom-resource.manifest.schema.json) are available on GitHub.
:::

<SchemaViewer schema={catalogWellKnownItems['custom-resource'].resourcesSchema} />
