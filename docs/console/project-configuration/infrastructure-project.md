---
id: infrastructure-project
title: Infrastructure Projects
sidebar_label: Infrastructure Projects
sidebar_order: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**Infrastructure Projects** are a dedicated Project type in Console specifically dedicated to the provisioning and management of infrastructure, following the *Infrastructure as Code* paradigm.

They are designed primarily for **Operations teams**, who can use them to define, version,
and deploy infrastructure resources while ensuring consistency, transparency, and control over infrastructure changes.

These Projects are distinct from traditional [Application Projects](/docs/console/project-configuration/application-project.md) as they are specifically designed to manage infrastructure resources,
enabling better control, automation, and governance in the context of Infrastructure as Code.

:::info
Infrastructure Projects are currently a [**BETA** feature](/docs/info/version_policy.md#feature-preview-and-beta), as such they are under development as we are adding new features and improvements.

At this time they only support **GitLab** repositories with a specific pipeline configuration, the support for other providers will come with the next Console releases.
You can find out more in the [technical limitations](#technical-limitations) section below.

If you want to share your feedback you can head to the [Community discussion post](https://github.com/mia-platform/community/discussions/612).
:::

## Creating an Infrastructure Project

When creating a new Project in your Company, you can select the **Infrastructure** type.  
This option unlocks a dedicated setup flow and enables the creation of a Project tailored to infrastructure workflows.

![Infrastructure Project selection](./img/infrastructure-project-selection.png)

## Managing Infrastructure Components

Each Infrastructure Project includes a specific section for managing **infrastructure components**.

You can currently create an infrastructure component only from scratch.

To create a new infrastructure component from scratch, you need to provide the following information:

- **Name**: The name of the component.  
- **Repository URL**: The URL of the Git repository where the component's code is hosted. This is used to provide a reference to the user.
- **Git Ref Name**: The Git branch, tag, or commit that the deployment pipeline will run on.  
- **Repository Project ID**: The project ID associated with the Git repository. This is actually used to interact with the Git Provider.

<Tabs>
<TabItem value="GitLab-Example" label="GitLab" default>

- **Repository URL**: `https://my.gitlab.host/some/repo`
- **Repository Project ID**: `some/repo` (or the numeric ID that can be copied from the GitLab UI)

</TabItem>
</Tabs>

![Add Infrastructure Component](./img/add-infrastructure-component.png)

## Deploying your Infrastructure

From within your Project, you can manage the deployment flow of your infrastructure components by:

- Running a **plan** to preview proposed infrastructure changes  
- Executing an **apply** to confirm and release your infrastructure changes

This enables control and consistency in your infrastructure.

## Runtime Visibility

After the deployment of your infrastructure components, runtime data retrieval can be integrated in the Console by leveraging the [Infrastructure Component Runtime Software Catalog item type](/docs/software-catalog/items-manifest/infrastructure-component-runtime.md).

:::tip
You can later access the data via API or by creating a custom extension using the [Composer extensions](/docs/console/company-configuration/extensions.md#add-new-extension)
:::

## Access and Permissions

Currently, all members of a Company can view Infrastructure Projects.  
However, only users with the role of **Project Administrator** or **Company Owner** are allowed to perform changes within them.

## Technical limitations

As mentioned above, there are still some technical limitations that repositories must conform to in order for Infrastructure Projects to work.

:::note
All of the following limitations will be soon resolved
:::

- the repository must be on GitLab and use GitLab CI
- the repository must hold a [Terraform](https://www.hashicorp.com/en/products/terraform)/[OpenTofu](https://opentofu.org/) project
- the GitLab CI pipeline must be composed of two separate jobs named `plan` and `apply`
- creation from Marketplace is not supported yet, so you need to create your repository beforehand
