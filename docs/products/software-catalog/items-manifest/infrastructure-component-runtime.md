---
id: infrastructure-component-runtime
title: Infrastructure Component Runtime
sidebar_label: Infrastructure Component Runtime
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import { catalogWellKnownItems } from "@mia-platform/console-types";
import SchemaViewer from "../snippets/schema_viewer.mdx";

:::note
Infrastructure Component Runtime are available starting from the v14 of the Mia-Platform Console.
:::

Infrastructure Component Runtime items are meant to be used in the context of an [Infrastructure Project](/products/console/project-configuration/infrastructure-project.md)
to be able to collect [runtime data](/products/console/project-configuration/infrastructure-project.md#runtime-visibility) for visualization within Console.

To [create or edit](/products/software-catalog/items-management/overview.md) an infrastructure Component Runtime item, you need to provide a [manifest](/products/software-catalog/items-manifest/overview.md), whose `resources` property should adhere to the following JSON schema.

:::tip
The JSON schemas of the [infrastructure Component Runtime item](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.39.2/packages/console-types/schemas/software-catalog/infrastructure-component-runtime.resources.schema.json)
and its [full manifest](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.39.2/packages/console-types/schemas/software-catalog/infrastructure-component-runtime.manifest.schema.json)
are available on GitHub.
:::

<SchemaViewer schema={catalogWellKnownItems['infrastructure-component-runtime'].resourcesSchema} />
