---
id: contributing_overview
title:  Contributing to the Marketplace
sidebar_label:  Contributing to the Marketplace
---

As a Console user, you can contribute to the Marketplace by creating new items of any kind. You can choose to make them available on the internal Company, or request for them to be published.

In this section, we dive into the process of creating a new item for the Marketplace, analyzing the main differences between different types of items and providing some configuration examples.

:::info

There are different methods to manage Marketplace items, described in details in the [related page](/marketplace/add_to_marketplace/manage_marketplace_items.md)

:::

## Public and Internal Company Marketplace

The **Mia-Platform public Marketplace** is the place where every Company can find most of the items needed to set up its Project architecture. It is publicly available on Mia-Platform Console, meaning that all Companies can view and make use of its items.

However, a Company might want to have its own internal Marketplace, fulfilled also with items that must not be shared with everyone else outside the Company.



## Creation of a Marketplace Item

Creation of a Marketplace item consists of two steps. The first is writing a Marketplace Item configuration file, then you have to upload it to the Console.

You have to ways to upload the item file:

- by using [`miactl`](/cli/miactl/10_overview.md), the official Mia-Platform CLI tool (recommended)
- by creating it in the CMS

Company Owners and Project Administrators can create, delete and update those Marketplace items exclusively available for their Company, but they cannot manage public Marketplace items.  
The Console Super User role, instead, has permission to manage all Marketplace items from the CMS without any limitations.

### Deciding whether to create a private or public Marketplace item

The choice between a private and public Marketplace involves benefits on both sides that should be carefully analyzed before making a decision.

Creating an item within the private Marketplace is undoubtedly the better choice when you want to make something highly specialized available for the specific use cases of your Company. If the item cannot be generalized and would have little value for other Companies, then a private Marketplace is the way to go. Additionally, in this case, creating items within the private Marketplace allows for complete ownership in managing them, resulting in a faster maintenance process.

On the other hand, publishing your items in the private Marketplace leads to a loss of corporate visibility that you would otherwise have by making your item publicly available in the Marketplace. It also means missing out on the opportunity to receive reviews from the Mia-Platform team and potential external contributions that can help your product grow and improve more rapidly.

:::info

To create Marketplace items you need to be a *Company Owner* or a *Project Administrator* at Company level.

Company Owners and Project Administrators can create, delete and update those Marketplace items exclusively available for their Company, but they cannot manage public Marketplace items.  
The Console Super User role, instead, has permission to manage all Marketplace items from the CMS without any limitations.

If you want to contribute to the **Mia-Platform Marketplace** by making your Marketplace item accessible to other Companies, you can visit [this page](/marketplace/add_to_marketplace/marketplace_items_accessibility.md).

:::

:::info

To learn how to migrate an item from the public to private Marketplace and vice versa, please refer to the [dedicated page](/marketplace/add_to_marketplace/change_marketplace_item_visibility.md).

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
- **Proxy**: specific configurations used to invoke APIs that are not part of the current project but may be exposed by an external provider or another project. You can find more information about proxies in this [section](/development_suite/api-console/api-design/proxy.md).  

:::note

Marketplace items are identified by a **Category** (e.g. Data Stream, Data Visualization, Insurance, Healthcare... ).

:::

## How to configure a new item

Each Marketplace item is identified by a specific data model (a JSON document).

In the following section we'll explore the common fields shared by all marketplace item types.

Refer to the [detailed explanation by type](#marketplace-items-example-and-explanation) for the type-specific fields and examples of working JSON marketplace items entities.

Here below are listed all the properties that must be provided for each type of item:

- **`name`** (required): the item name appearing in the Marketplace card
- **`description`**: a brief description (10 to 20 words) regarding the service functionalities
- **`type`**: the type of your item (plugin, template, example, application, or proxy)
- **`comingSoon`** and **`releaseStage`**: properties to identify the maturity of the item (learn how to configure them in a [dedicated section](#the-release-stage-of-a-new-item) later on this page)
- **`categoryId` **: a label to help categorize items by their purpose or use case. As specified before, categories are only created internally at Mia-Platform. The `categoryId` of a item uniquely specifies both the specific category and sub-category (e.g. Start from Code (category) - Node.js (subcategory) will be identified by the `categoryId` "nodejs"). The [available category IDs](#category-list) are listed below.
- **`supportedBy`**: a label to identify the company that has produced the item (only used if `supportedByImage` is not provided)
- **`tenantId`** (required): the ID of the Company the item belongs to
- **`imageUrl`** and **`supportedByImageUrl`**: respectively the image that will be associated with the item and the image that will be associated with the company that has produced it.
  
### Adding images

The procedure of adding images differs if you are using CMS or `miactl`.

#### With `miactl`

To upload the *image* and *supportedByImage* with the `miactl marketplace apply` command, you need to add the respective `image` and `supportedByImage` keys to the object.

Refer to the [related miactl documentation](/cli/miactl/30_commands.md#apply) to know the exact specifications of such object.

#### With the CMS

It is possible to add images using dedicated input fields:  

![upload-images](img/cms-upload-image.png) ![upload-images](img/cms-upload-supported-by-image.png)

The final result will be as follows:  

![Console-custom-service](img/dev-console-custom-service.png)

### Category List

The category list is constantly updated, check with your Mia-Platform referent for the updated list.

| ID                | Description                            |
|-------------------|----------------------------------------|
| `notification`    | Core Plugins - Notifications           |
| `kotlin`          | Start From Code - Java/Kotlin          |
| `spa`             | Start From Code - SPA - Angular/React  |
| `rust`            | Start From Code - Rust/C/Swift         |
| `nodejs`          | Start From Code - Node.js              |
| `golang`          | Start From Code - Go                   |
| `python`          | Start From Code - Python               |
| `code`            | Start From Code                        |
| `business`        | Add-ons - Data Visualization           |
| `addonsecurity`   | Add-ons - Security                     |
| `stream`          | Add-ons - Data Stream                  |
| `monitoring`      | Add-ons - Monitoring                   |
| `addgeo`          | Add-ons - Geolocation                  |
| `payments`        | Add-ons - Payments                     |
| `fast-data`       | Add-ons - Fast Data                    |
| `frontendbuilder` | Add-ons - Frontend Builders            |
| `healthcare`      | Add-ons - Healthcare                   |
| `utility`         | Add-ons - Utilities                    |
| `scoring`         | Add-ons - Scoring Manager              |
| `data-catalog`    | Add-ons - Data Catalog                 |
| `fast-data-connectors` | Add-ons - Fast Data Connectors    |

### The Release Stage of a new item and Coming Soon

From the CMS of the Console, users can associate items with a **release stage** label that will help users identify the maturity of the item.

There are 2 fields that define the release stage of an item: `comingSoon` and `releaseStage`.

The `comingSoon` field is boolean, setting it to true will show the "Coming Soon" label and will prevent users to use the item.

The `releaseStage` field can have the following values

- preview
- beta
- stable
- deprecated

The fields are not required: if not specified, no label will be shown on the item.

:::info

Setting both the `releaseStage` and the `comingSoon` fields is not permitted and would lead to inconsistencies; please set either field or none according to the item lifecycle status.

:::

Refer to the [Items Lifecycle](/marketplace/overview_marketplace.md#marketplace-item-lifecycle) section for details about each specific release stage.

## Marketplace Items example and explanation

Refer to the detailed explanations and examples for each item type:

- [Plugins](/marketplace//add_to_marketplace/add_item_by_type/add_plugin)
- [Templates and Examples](/marketplace//add_to_marketplace/add_item_by_type/add_template_or_example)
- [Plugins](/marketplace//add_to_marketplace/add_item_by_type/add_application)
