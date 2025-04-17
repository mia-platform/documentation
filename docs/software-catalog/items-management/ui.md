---
id: ui
title: Software Catalog UI
sidebar_label: Software Catalog UI
---

:::info
You need to have *Company Owner* or *Project Administrator* role at Company level to perform the following actions
:::

## List item

Go to **Software Catalog > All Items** to view and explore catalog items.

![List of software catalog items](./img/software-catalog-overview.png)

The main catalog page includes a search bar and advanced filters to narrow results by:

- **type**: filter item by their specific type
- **lifecycle status**: e.g., Coming Soon, Draft, Published, etc..
- **availability**: this filter determines whether an item is public, accessible to all companies, or restricted to the current company only.

Additionally, users can also toggle between company-specific and all available items.

Each item has a detail page with two tabs:

- **General**: this tab presents an initial Details section containing [metadata][items-data-structure] about the item, including its name, general information, and useful links.
- **Assets**: this tab displays a JSON representation of the [`resources` property][items-manifest] specific to the item.

### Versions

If versioning is supported, the first page lists all versions with release dates and notes.

![item versions](./img/version-overview.png)

Selecting a version opens its details. Breadcrumbs at the top help navigate between versions and related items.

## Create item

To create a new item in the catalog, click on the "Add Item" button. This will open a user interface that guides you through the item creation process. The process is divided into the following steps:

1. **select the [item type][items-type]**: choose the type of item you want to create from the available options. This will determine the set of fields and attributes you need to provide during the creation process;

2. **enter [metadata][items-data-structure]**: fill in the necessary metadata for the item. This typically includes basic information such as the name, description, category, and any other required attributes;

3. **enter [assets][items-manifest]**: after entering the metadata, you will need to specify additional details (`resources` property) for the item type. A default schema of resources will be provided to assist you in adding the relevant specifics. This schema serves as a template to help ensure all necessary information is included and formatted correctly.

Once all steps are completed, you can save and submit the item to be added to the catalog.

![create item](./img/software-catalog-create-item.png)

#### Create a New Version

Create a new version is available only for items that support versioning. You can start the creation of a new version from either of the following options:

##### From the Version Overview Page
On the item’s overview page, you can create a new version by selecting the "Add new version" option. Here, you can choose whether to start from an existing version or create the new version from scratch.

![create new version](./img/software-catalog-create-new-version.png)

##### From the Version Detail Page
You can also create a new version directly from the version detail page. Click on the button with the three dots to open the option to create a new version based on the version you are currently viewing.

![create new version](./img/software-catalog-create-version-from-this.png)

## Edit item

To edit an item, an `Edit` button is available in the relevant tab (such as metadata or assets). The availability of this button depends on whether the item is versioned and which section you're attempting to edit.

![update item](./img/update-item.png)

1. **Item without versioning support**: for items that do not support versioning, you have full editing access to all fields, including the technical details (e.g., a`assets`). No version history to manage, so changes are immediate and permanent

2. **Item With Versioning Support**: for items that support versioning, editing capabilities are more restricted to ensure version control. Specifically, only the `metadata` of the item can be edited, such as the name, description, etc.

If you need to update or change the `assets` of a versioned item, you must create a new version of the item. This ensures that the `assets` are updated while keeping the version history intact.

Even in cases where the version is marked as `N/A`, it behaves the same as any other version — only metadata can be edited, and assets cannot be modified.

## Delete item

If an item is versionable, you can delete any specific version of the item by using the dedicated `Delete` button available for each version. This allows you to remove individual versions without affecting the entire item or other versions.

![delete version](./img/delete-version.png)

For items that are not versionable, you can delete the entire item by using the `Delete Item` button. This will permanently remove the item from the catalog.

Both actions are irreversible, so be sure to confirm your decision before proceeding with deletion.

[items-data-structure]: ../basic-concepts/05_items-data-structure.md
[items-type]: ../basic-concepts/10_items-types.md
[items-manifest]: ../items-manifest/overview.md