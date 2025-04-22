---
id: template
title: Template
sidebar_label: Template
---

import { catalogWellKnownItems } from "@mia-platform/console-types";
import SchemaViewer from "../snippets/schema_viewer.mdx";

Teamplates can be instantiated in Console the same as plugins. The difference is that they provide an **archive** that is cloned in the Project scope, instead of a Docker image, giving developers direct access to the codebase to evolve it at will.

Templates are meant to be starting points with the bear minimum needed to start a service. Just like plugins, templates may also come with some predefined configurations.

To [create or edit](/software-catalog/items-management/overview.md) a template, you need to provide a [manifest](/software-catalog/items-manifest/overview.md), whose `resources` property should adhere to the following JSON schema.

:::tip
The JSON schemas of the [template resources](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/template.resources.schema.json) and of the [full template manifest](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/heads/main/packages/console-types/schemas/catalog/template.manifest.schema.json) are available on GitHub.
:::

<SchemaViewer schema={catalogWellKnownItems['template'].resourcesSchema} />

<!-- ### Open Source item

If the repository hosting your item is public and openly accessible (i.e., open source), then you're all set — the item is now accessible and usable by other Companies via the Marketplace.

### Item hosted on a private repository

If your item is stored in a private repository, additional configuration is required to ensure the Console can access it.

1. **Create a Marketplace Provider**
You need to create a Provider for the Marketplace, where you'll configure the credentials required to access your Git Provider. Follow the instructions in [this guide](/console/company-configuration/providers/configure-marketplace-provider.mdx) to set it up.

The Provider must be created in the same Company where the item resides. This is defined by the `companyId` property in the item configuration.

:::info
To make Software Catalog resources accessible to other Companies, you must enable the "Allow access to all the Companies" option in the Provider settings, as explained [here](/console/company-configuration/providers/configure-marketplace-provider.mdx#step-2-provider-details).
This ensures the Console can access the item’s resources even when it belongs to a project in a different Company.
:::

2. **Link the Provider to the Item**
Once the Provider is created and connected:
- Go to the Providers section in the CMS.
- Locate your Provider and take note of its `providerId`.
- Go back to the Software Catalog and edit the item configuration.
- Add the `providerId` property with the corresponding value.

From this point on, your item will be available to all Companies across the platform! -->
