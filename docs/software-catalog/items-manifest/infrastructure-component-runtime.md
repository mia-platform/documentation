---
id: infrastructure-component-runtime
title: Infrastructure Component Runtime
sidebar_label: Infrastructure Component Runtime
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import { catalogWellKnownItems } from "@mia-platform/console-types";
import SchemaViewer from "../snippets/schema_viewer.mdx";

Infrastructure Component Runtime items are meant to be used in the context of an [Infrastructure Project](/console/project-configuration/infrastructure-project.md)
to be able to collect [runtime data](/console/project-configuration/infrastructure-project.md#runtime-visibility) for visualization within Console.

:::tip
The JSON schemas of the [infrastructure Component Runtime item](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/infrastructure-component-runtime.resources.schema.json)
and its [full manifest](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/infrastructure-component-runtime.manifest.schema.json)
are available on GitHub.
:::

<SchemaViewer schema={catalogWellKnownItems['infrastructure-component-runtime'].resourcesSchema} />
