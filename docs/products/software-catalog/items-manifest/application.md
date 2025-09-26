---
id: application
title: Application
sidebar_label: Application
---

import { catalogWellKnownItems } from "@mia-platform/console-types";
import SchemaViewer from "../snippets/schema_viewer.mdx";

Applications are **bundles of resources** that brings together [services](/products/console/api-console/api-design/services.md) (i.e., plugins, templates, and examples), [endpoints](/products/console/api-console/api-design/endpoints.md), [CRUD collections](/products/console/api-console/api-design/crud_advanced.md), and [public variables](/products/console/api-console/api-design/public_variables.md) to ease the setup of large-scale artifacts.

To [create or edit](/products/software-catalog/items-management/overview.md) an application, you need to provide a [manifest](/products/software-catalog/items-manifest/overview.md), whose `resources` property should adhere to the following JSON schema.

:::tip
The JSON schemas of the [application resources](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.39.2/packages/console-types/schemas/software-catalog/application.resources.schema.json) and of the [full application manifest](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.39.2/packages/console-types/schemas/software-catalog/application.manifest.schema.json) are available on GitHub.
:::

<SchemaViewer schema={catalogWellKnownItems['application'].resourcesSchema} />
