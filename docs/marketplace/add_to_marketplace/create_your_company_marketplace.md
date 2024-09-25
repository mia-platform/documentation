---
id: create_your_company_marketplace
title: Create your Company Marketplace
sidebar_label: Company Marketplace
---

In this section, we dive into the process of creating a new item for your **Company Marketplace**, analyzing the main differences between different types of items and providing some configuration examples.

## Public and Company Marketplace

As a Console user, you can access both Mia-Platform public Marketplace catalog and your Company Marketplace.
While the Mia-Platform public Marketplace is composed by all the items publicly available in the Mia-platform catalog, the **Company Marketplace** is a Company-specific private space where to create and manage the items which are available only for your Company.

The **Mia-Platform public Marketplace** is the place where every Company can find most of the items needed to set up its Project architecture. It is publicly available on Mia-Platform Console, meaning that all Companies can view and make use of its items.

However, a Company might want to have its own internal Marketplace, fulfilled also with items that must not be shared with everyone else outside the Company.

:::info
There are different methods to manage your Company Marketplace items. They are described in details in the [related page](/marketplace/add_to_marketplace/manage_marketplace_items.md)
:::

## Creation of an Company Marketplace item

Creation of a Marketplace item for your Company consists of two steps. The first is writing a Marketplace Item configuration file, then you have to upload it to the Console by using [`miactl`](/cli/miactl/10_overview.md), the official Mia-Platform CLI tool.

:::info
If you want to make your Marketplace item accessible to other Companies, you can visit [this page](/marketplace/add_to_marketplace/marketplace_items_accessibility.md).

Also, to learn how to migrate an item from the public to private internal Marketplace and vice versa, please refer to the [dedicated page](/marketplace/add_to_marketplace/change_marketplace_item_visibility.md).
:::

### Marketplace item visibility and the `tenantId` field

When creating a new Marketplace item, you always need to set the `tenantId` related to the Company you are creating the item in.

You can also contribute to the **Mia-Platform Marketplace** by making your Marketplace item accessible to other Companies: visit [this page](/marketplace/add_to_marketplace/marketplace_items_accessibility.md) for further information on this point.

:::caution
Not setting the `tenantId` is no longer supported and deprecated.
Elements without `tenantId` will be public even if the `visibility.public` field is not set.

This behavior might change in the next Console releases.

If you have any item without the `tenantId` property set, we recommend to do the following:

- set the `tenantId` to any of your companies;
- set the `visibility` field according to your needs. See the [related doc](/marketplace/add_to_marketplace/marketplace_items_accessibility.md#marketplace-item-visibility) for more information on this point.

:::

## Marketplace items

A Marketplace **Item** (also referred to as **Component**) is the basic unit of the Marketplace and represents a software resource available for use within Mia-Platform Projects.

These components provide various functionalities and can be integrated into Mia-Platform Projects to streamline development and configuration processes.

The Mia-Platform Marketplace contains items belonging to many types, with different use cases.

To use a Marketplace item in a Project, a user have to **create** it; depending on the type, the creation of an element has different consequences on the Project.

### Item Types

The Marketplace is composed of items with the following types.

- **Plugins**: items for which users have no access to the actual code. Users will still be able to download their Docker image, in order to configure and use them within their Projects.
- **Templates** and **Examples**: archives for which a new repository is generated. The developer will have direct access to the new repository (created in their Project scope) and will be able to evolve its code at will. A template is a repository that, net of the development environment and framework setup, is empty; an example, instead, also implements some features tailored to help the user better familiarize with the development environment.  
- **Applications**: bundles of resources that can be created and configured in the Mia-Platform Console within a few clicks. [Applications](/marketplace/applications/mia_applications.md) are composed of microservices (Plugins, Examples, and Templates), endpoints, CRUD collections, and public variables. Users can monitor if all the resources composing an application have been correctly set up inside the project, as well as access their corresponding repository or configuration.  
- **Proxies**: specific configurations used to invoke APIs that are not part of the current project but may be exposed by an external provider or another project. You can find more information about proxies in [this section](/development_suite/api-console/api-design/proxy.md).
- **Sidecars**: secondary utility containers running side by side with the main container in the same host. Find more [here](/marketplace/add_to_marketplace/add_item_by_type/add_sidecar.md)
- **Custom Resources**: custom objects that are not part of the standard Console supported resources. For more information, go to [this section](/marketplace/add_to_marketplace/add_item_by_type/add_custom_resource.md)

:::note
Marketplace items are identified by a **Category** (e.g. Data Stream, Data Visualization, Insurance, Healthcare... ).
:::

## How to configure a new item

In the following section we'll explore the common fields shared by all marketplace item types.

Refer to the [detailed explanation by type](#marketplace-items-example-and-explanation) for the type-specific fields and examples of working JSON marketplace items entities.

Here below are listed all the properties that must be provided for each type of item:

The service documentation of your plugin will be accessible from a specific link in the Marketplace, you also need to provide the documentation URL of your plugin and this must be inserted in the `documentation` field:

- **`name`** (required): the item name appearing in the Marketplace card
- **`tenantId`** (required): the ID of the Company the item belongs to
- **`itemId`** (required): the ID identifying the item in the Marketplace
- **`description`**: a brief description (10 to 20 words) regarding the service functionalities
- **`type`**: the type of your item (plugin, template, example, application, or proxy)
- **`documentation`**: information about the documentation of your item. It is an object composed by:
  - **`type`**: the type of documentation. It can be `externalLink` or `markdown`
  - **`url`**: the URL of the documentation. It can be an external URL or an internal one
- **`comingSoon`** and **`releaseStage`**: properties to identify the maturity of the item (learn how to configure them in a [dedicated section](/marketplace/add_to_marketplace/create_your_company_marketplace.md#the-release-stage-of-a-new-item) later on this page)
- **`categoryId`**: a label to help categorize items by their purpose or use case. As specified before, categories are only created internally at Mia-Platform. The `categoryId` of a item uniquely specifies both the specific category and sub-category (e.g. Start from Code (category) - Node.js (subcategory) will be identified by the `categoryId` "nodejs"). The [available category IDs](/marketplace/add_to_marketplace/create_your_company_marketplace.md#category-list) are listed below.
- **`supportedBy`**: a label to identify the company that has produced the item (only used if `supportedByImage` is not provided)
- **`imageUrl`** and **`supportedByImageUrl`**: respectively the image that will be associated with the item and the image that will be associated with the company that has produced it.
- **`version`**: the version of the item. It is an object composed by the following properties:
  - **`name`** (required): the actual version of the item. We suggest to use the [Semantic Versioning](https://semver.org/) format.
  - **`releaseNote`**: a release note that will be displayed to the user when selecting the item during creation or updates based on Marketplace items in a Console project; includes information about the changes introduced by the new version.
  - **`security`**: a boolean to indicate if the item is security-related

Each marketplace item is identified by the values of the **`tenantId`**, the **`itemId`** and the **`version`** name properties. So, when you need to create a new Marketplace item, be sure to provide unique values for these properties.

:::info
To upload the *image* and *supportedByImage*, you can use the `miactl marketplace apply` command adding the respective `image` and `supportedByImage` keys to the object.

Refer to the [related miactl documentation](/cli/miactl/30_commands.md#apply) to know the exact specifications of such object.
:::

### Set controlled versions for your Marketplace resources and make them available to users

:::info
This feature is currently available for the [Plugin](/marketplace/add_to_marketplace/add_item_by_type/add_plugin.md) and [Custom Resource](/marketplace/add_to_marketplace/add_item_by_type/add_custom_resource.md) types.
:::

Marketplace creators have now the possibility to manage some types of resources (at the moment, Plugins and Custom Resources of type k8s) through a governance based on a versioning system.

This means that, for these types of resources, it is possible to establish a more structured and transparent lifecycle management system, providing users access to all the versions of a resource and allowing them to see the release notes of each version and select and instantiate the version that best suits their configuration needs among the ones made available by the Marketplace creator.

This versioning system also provides significant advantages in a feature-branch design workflow, effectively leveraging different versions of the same Marketplace item across various branches of a project.

For instance, we imagine to have a project with three different revisions: *dev*, *stage* and *main*, with the latter being the branch with the official configuration. Let's also imagine to have installed in all the three revisions the *CRUD Service* plugin, which includes different versions.

In this scenario we can have:

- the `main` branch with the `6.6.0` version, which is the supported version in our project
- we can use the the version `6.10.0` in the `stage` branch where the latest manual tests and verifications are performed before to be included in the `main` branch
- at the same time we can experiment and test features using the version `7.0.0` in your `dev` branch without affecting the other branches and the existing configurations

This approach facilitates a smooth upgrade process, enables thorough testing of new features, and ensures compatibility across different stages of your project lifecycle. This flexibility allows for testing new versions in development environments while maintaining stable versions in production.
Such a structured approach will streamline resource management and ensure compatibility and stability across different use cases.

#### How to create a new version for your resource

To create a versioned resource, you need to set a specific value for the `name` property of the `version` object to the resource definition, as explained in the ["How to configure a new item" section](#how-to-configure-a-new-item).

Also, to provide continuity to the definition of the other versions of the same resource, the `tenantId` and the `itemId` properties must be the same for all the versions of the same resource.

You can create a new version of a Marketplace item either if there is already that resource on the Marketplace without a version. In that case the non-versioned item will be still available in the Console, where will be shown with a *N/A* value for the version.

#### Editing a versioned resource

Versioned resources are defined to be immutable, to avoid that updates might overwrite the previous configuration. However, it is possible to edit in case we need to update changes to their metadata (e.g. the release note or the description of the marketplace item - because of typos or other reasons).

Editing a versioned resource is possible via `miactl`, however the following fields cannot be edited:

- `itemId`
- `tenantId`
- the `name` property inside `version` object
- the `resources` property, that includes the specific resource definition

Since marketplace items are defined by the `itemId`, the `tenantId` and the `version` name, attempt to modifying one of these three properties will cause the creation of a completely new marketplace item, completely separated from the previous one.

Attemping to modify the `resources` property will cause an error, and the item will not be updated. In that case, you need to create a new version of the item.

Also, the following fields are editable only in case the permission `marketplace.root.manage` has been granted to the user:
- `supportedBy`
- `supportedByImage`
- `publishOnMiaDocumentation`
- `visibility`

More information about these permissions are available in the [](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#console-root-level-permissions)

#### Version dependent properties

Versioning of Marketplace resources implies that those resources under versioning governance are composed by some *dependent fields* that contribute to the definition of the version and which, therefore, cannot be changed “in place” by the user, but only through the creation of a new version of the resource.

For instance:

- a version of a Microservice Plugin is defined by its `dockerImage`. By following the resource versioning management, a change in this field will require the creation of a new version for such Plugin
- for Custom Resources of type K8s the governance is quite similar: since Custom Resources of type K8s are defined by their `apiVersion` and `kind`, in this scenario, the only way to be able to change them will be through the creation of a new version.

By defining these fields as *version dependent*, we ensure that these are not editable by the user when they add a marketplace item to their project: whenever a new Microservice is created starting from a versioned Marketplace plugin, the `dockerImage` field will be automatically shown as read-only, and the user will be able to change it only by actually checking for other versions of the plugin.

### The Release Stage of a Marketplace Item

When creating or updating a Marketplace item, the user can add information to help users identifying the maturity of the item.

There are 2 fields that define the release stage of an item:

- the `comingSoon` field is boolean, setting it to true will show the *Coming Soon* label and will prevent users to use the item
- the `releaseStage` field can have the following values:
  - *preview*
  - *beta*
  - *stable* (default)
  - *deprecated*
  a label will shown on the item according to the value of the field, except for the *stable* stage

:::info
Setting both the `releaseStage` and the `comingSoon` fields is not permitted and would lead to inconsistencies; please set either field or none according to the item lifecycle status.
:::

Refer to the [Items Lifecycle](/marketplace/overview_marketplace.md#marketplace-item-lifecycle) section for details about each specific release stage.

## Marketplace Items example and explanation

Refer to the detailed explanations and examples for each item type:

- [Plugins](/marketplace/add_to_marketplace/add_item_by_type/add_plugin.md)
- [Templates and Examples](/marketplace/add_to_marketplace/add_item_by_type/add_template_or_example.md)
- [Applications](/marketplace/add_to_marketplace/add_item_by_type/add_application.md)
- [Sidecars](/marketplace/add_to_marketplace/add_item_by_type/add_sidecar.md)
- [Custom Resources](/marketplace/add_to_marketplace/add_item_by_type/add_custom_resource.md)
