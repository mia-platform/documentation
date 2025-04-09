---
id: items-data-structure
title: Items data structure
---

- struttura dell'item: +resources, isLatest, releaseDate, etc..
- primary key

An **Item** (also referred to as a **Component**) is the basic unit of creating a resource within the catalog and represents a software resource that can be utilized in Mia-Platform Projects.

Directly from the Marketplace, users can instantiate items into their Projects, integrating them to streamline development and configuration workflows.

In the following section we'll explore the structure of all items.

| **Name**              | **Type**   | **Required** | **Description**  |
|-----------------      |------------|--------------|------------------|
| `name`                | String     | Yes          | The item name    |
| `tenantId`            | String     | Yes          | The ID of the Company the item belongs to|
| `itemId`              | String     | Yes          | The unique ID of the item|
| `description`         | String     | No           | A brief description regarding the service functionalities|
| `type`                | String     | No           | The type of your item (plugin, template, example, application, proxy, etc...)|
| `documentation`       | Object     | No           | Information about the documentation of your item. It is an object composed by `type` and `url`|
| `releaseStage`        | String     | No           | Property to identify the release stage of the item (learn how to configure them in a [dedicated section](/old_software-catalog/manage-items/overview.md#the-release-stage-of-an-item)) |
| `categoryId`          | String     | No           | A label to help categorize items by their purpose or use case|
| `supportedBy`         | String     | No           | A label to identify the company that has produced the item (only used if `supportedByImage` is not provided)|
| `imageUrl`            | String     | No           | The image that will be associated with the item |
| `supportedByImageUrl` | String     | No           | The image that will be associated with the company that has produced the item|
| `version`             | Object     | No           | The version of the item. It is an object composed by the following properties: `name`, `releaseNote`, `security`|

:::info
Setting both the `releaseStage` and the `comingSoon` fields is not permitted and would lead to inconsistencies; please set either field or none according to the item lifecycle status.
:::

The documentation of the item is an object composed by `type` and `url`:

| **Name**              | **Type**   | **Required** | **Description**  |
| `documentation.type`  | String     | No           | The type of documentation. It can be `externalLink` or `markdown`|
| `documentation.url`   | String     | No           | The URL of the documentation|

The version of the item is an object composed by the following properties: `name`, `releaseNote`, `security`:

| **Name**              | **Type**   | **Required** | **Description**  |
| `name`                | String     | Yes          |The actual version of the item. You must use the [Semantic Versioning](https://semver.org/) format |
| `releaseNote`        | String     | No           |A release note that will be displayed to the user when selecting the item during creation or updates based on items in a Console project |
| `security`            | Boolean    | No           |A boolean to indicate if the item is security-related|


Each item is identified by the values of the **`tenantId`**, the **`itemId`** and the **`version.name`** properties. So, when you need to create a new item, be sure to provide unique values for these properties.

:::info
To upload the *image* and *supportedByImage*, you can also use the `miactl marketplace apply` command adding the respective `image` and `supportedByImage` keys to the object.

Refer to the [related miactl documentation](/cli/miactl/30_commands.md#apply) to know the exact specifications of such object.
:::