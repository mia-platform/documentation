---
id: template
title: Template
sidebar_label: Template
---

import { catalogWellKnownItems } from "@mia-platform/console-types";
import SchemaViewer from "../snippets/schema_viewer.mdx";

A Template is a **base repository** from which users can build a new Microservice.

Teamplates can be instantiated in Console the same as plugins. The difference is that they provide an **archive** that is cloned in the Project scope, instead of a Docker image, giving developers direct access to the codebase to evolve it at will.

Templates are meant to be **starting points** with the bear minimum needed to start a service. Just like plugins, templates may also come with some predefined configurations.

To [create or edit](/products/software-catalog/items-management/overview.md) a template, you need to provide a [manifest](/products/software-catalog/items-manifest/overview.md), whose `resources` property should adhere to the following JSON schema.

:::tip
The JSON schemas of the [template resources](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.39.2/packages/console-types/schemas/software-catalog/template.resources.schema.json) and of the [full template manifest](https://raw.githubusercontent.com/mia-platform/console-sdk/refs/tags/%40mia-platform/console-types%400.39.2/packages/console-types/schemas/software-catalog/template.manifest.schema.json) are available on GitHub.
:::

<SchemaViewer schema={catalogWellKnownItems['template'].resourcesSchema} />

## The source repository

The template content must be hosted on a **remote Git repository**. Once a new microservice starting from the template is created, the Console clones the content of the repository in a new one under the Git provider of the user's project.

The URL to the repository must be specified in the `archiveUrl` filed of the item, and must point to the **tar.gz version** of a specific `sha` or `ref` of the Git project (e.g., `https://github.com/mia-platform-marketplace/crud-sql-template/archive/0.1.0.tar.gz`).

:::tip
For archives hosted on GitLab, if is better to use **API URLs** (e.g. `https://git.tools.mia-platform.eu/api/v4/projects/MY_PROJECT_ID/repository/archive.tar.gz?sha=main`), instead of UI-based URLs, since [group tokens](https://docs.gitlab.com/user/group/settings/group_access_tokens/) work properly with the API format but often fail with the UI path.
:::

### Private repositories

If the repository is public and openly accessible (i.e., **open source**), no further actions are required for the item to be accessible and usable by any Company.

However, if the item is stored in a **private repository**, some additional configurations are required to ensure the Console can access it.

Namely, you need to [create a provider for the Catalog](/products/console/company-configuration/providers/configure-marketplace-provider.mdx), where you'll configure the credentials required to access your Git Provider, and link the provider to the item through the [`providerId` field](/products/software-catalog/items-manifest/overview.md).

:::tip
To make Software Catalog resources **accessible to other Companies**, you must enable the "Allow access to all the Companies" option in the Provider settings, as explained [here](/products/console/company-configuration/providers/configure-marketplace-provider.mdx#step-2-provider-details). This ensures the Console can access the item’s resources even when it belongs to a project in a different Company.
:::

### Continuous integration

The service should ensure that **Continuous Integration** (CI) is set up, to update the service image any time its code is modified.

When creating a template item, you can either ship the CI with the archive itself, or use the `pipelines` field to reference an existing CI that will be generated alongside the service files.

:::tip
Mia-Platform provides some ready-to-use pipeline teamplates. Contact your referent to know how to configure them within your Console installation.
:::

### Special files and placeholders

Any of the archive file can contain some special placeholders that will be replaced by the Console at the creation of the new microservice. The available placeholders are:

- `mia_template_image_name_placeholder`: name of the docker image entered by the user;
- `%CUSTOM_PLUGIN_PROJECT_NAME%`: name (label) of the Console project;
- `mia_template_project_id_placeholder`: id of the Console project;
- `mia_template_service_name_placeholder`: service name chosen by the user;
- `%CUSTOM_PLUGIN_SERVICE_DESCRIPTION%`: description of the service chosen by the user;
- `%CUSTOM_PLUGIN_CREATOR_USERNAME%`: username of the user who created the service;
- `%CUSTOM_PLUGIN_PROJECT_GIT_PATH%`: full path of the repository of the Git provider;
- `%GIT_PROVIDER_PROJECT%`: name of the Git project entered by the user (e.g. GitHub repository or Gitlab project);
- `%GIT_PROVIDER_GROUP%`: name of the group of Projects entered by the user (e.g. GitHub organization or Gitlab group);
- `%GIT_PROVIDER_BASE_URL%`: URL base of the Git provider;
- `%NEXUS_HOSTNAME%`: Docker registry hostname;
- `%CUSTOM_PLUGIN_IMAGE_NAME%` (**deprecated**): name of the Docker image entered by the user;
- `%CUSTOM_PLUGIN_PROJECT_ID%` (**deprecated**): id of the Console project;
- `%CUSTOM_PLUGIN_PROJECT_NAMESPACE%` (**deprecated**): id of the Console project;
- `%CUSTOM_PLUGIN_SERVICE_NAME%` (**deprecated**): service name chosen by the user.

Moreover, in the archive you can make use of the **special root-level directory** `.mia-template/`. This folder will not be committed in the created repository: instead, its content will **overwrite** any file with the same name in the main directory (e.g., you can use it to provide a different `README` file to developers or to store the images and the marketplace item configuration).
