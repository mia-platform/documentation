---
id: application
title: Application
sidebar_label: Application
---

import { catalogWellKnownItems } from "@mia-platform/console-types";
import SchemaViewer from "../snippets/schema_viewer.mdx";

Applications are **bundles of resources** that brings together [services](/development_suite/api-console/api-design/services.md) (i.e., plugins, templates, and examples), [endpoints](/development_suite/api-console/api-design/endpoints.md), [CRUD collections](/development_suite/api-console/api-design/crud_advanced.md), and [public variables](/development_suite/api-console/api-design/public_variables.md) to ease the setup of large-scale artifacts.

To [create or edit](/software-catalog/items-management/overview.md) an application, you need to provide a [manifest](/software-catalog/items-manifest/overview.md), whose `resources` property should adhere to the following JSON schema.

:::tip
The JSON schemas of the [application resources](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/application.resources.schema.json) and of the [full application manifest](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/application.manifest.schema.json) are available on GitHub.
:::

<SchemaViewer schema={catalogWellKnownItems['application'].resourcesSchema} />
