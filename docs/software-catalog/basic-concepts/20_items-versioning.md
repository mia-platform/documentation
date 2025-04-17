---
id: items-versioning
title: Items versioning
sidebar_label: Items versioning
---

A **version of an item** is a distinct, immutable snapshot of an item that captures a specific state of its configuration, metadata, and resources at a given point in time.

Versioning allows teams to:
- evolve resources over time while maintaining consistency and traceability,
- prevent unintended changes to items already in use, and
- support multiple iterations of the same item simultaneously.

:::info
Versioning is currently supported for the following [item types](./10_items-types.md):
- **Plugin**
- **Infrastructure Resource**
- **Template**
- **Example**
:::

To define a *version of an item*, a few key properties must be configured:

- **version name** (the `name` property inside the `version` object): a unique name that identifies the version of the item. This typically follows [Semantic Versioning rules](https://semver.org/) (e.g. 1.0.0, 2.1.3).

- **stable properties across versions**: the following properties must remain consistent across all versions of the same item:
    - `itemId`
    - `tenantId`

These three properties together — `tenantId`, `itemId`, and `version.name` — form the unique identity of a versioned item.

Refer to [this section][items-management] for implementation details.

:::info
Items that were created without a version will still appear in the Console and will be shown with a version value of *N/A*.
:::

When multiple versions of an item exist, one of them is automatically considered the **latest** version:
- this version is used by default when creating new items from the Catalog
- it is selected based on [Semantic Versioning rules](https://semver.org/), this meaning the highest valid version number becomes the latest.

:::info
If any resource attached to a Marketplace item has an available update, the Console will notify you.
You can find these updates:
- in the sidebar, at the bottom of your service list, and
- within the detail page of the service that requires updating

 ![Design page with notifications of new Marketplace versions](./img/versions_notifications.png)
:::

### Editing a versioned item

The following fields define a version of an item:
- `itemId`
- `tenantId`
- `version.name`
- `assets` (field `resources`)

As long as the item is in the **draft stage** (according to the [lifecycle stage][items-lifecycle]), the `assets` can still be modified. Once the item moves to the **published stage**, the `assets` become immutable. Attempting to modify it will result in an error, and the item will not be updated. In this case, you need to create a *new version* of the item.

Some examples:

- **Plugin**: The `dockerImage` field determines the version. Any update to this field requires creating a new version.
- **Infrastructure Resource**: Defined by the `apiVersion` and `kind` properties. Changes to these fields must also be handled via versioning.

[items-management]: ../items-management/overview.md
[items-lifecycle]: ../basic-concepts/30_items-lifecycle.md