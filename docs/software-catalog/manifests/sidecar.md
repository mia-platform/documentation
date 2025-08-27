---
id: sidecar
title: Sidecar
sidebar_label: Sidecar
---

import { catalogWellKnownItems } from "@mia-platform/console-types"
import SchemaViewer from "../snippets/schema_viewer.mdx";

Sidecars are secondary utility containers running side by side with the main container in the same host. They are **Docker images** that can be instantiated from the [dedicated section](/console/design-your-projects/sidecars.md) of the Console Design area.

To [create or edit](/software-catalog/items-management/overview.md) a sidecar, you need to provide a [manifest](/software-catalog/manifests/overview.md), whose `resources` property should adhere to the following JSON schema.

:::tip
The JSON schemas of the [sidecar resources](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.38.11/packages/console-types/schemas/catalog/sidecar.resources.schema.json) and of the [full sidecar manifest](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.38.11/packages/console-types/schemas/catalog/sidecar.manifest.schema.json) are available on GitHub.
:::

<SchemaViewer schema={catalogWellKnownItems['sidecar'].resourcesSchema} />
