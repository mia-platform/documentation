---
id: items-versioning
title: Items versioning
sidebar_label: Items versioning
---

A versioned resource is a distinct, immutable snapshot of an item that captures a specific state of its configuration, metadata, and underlying components at a given point in time.

Versioning allows teams to:
- Evolve resources over time while maintaining consistency and traceability.
- Prevent unintended changes to resources already in use.
- Support multiple iterations of the same resource simultaneously.

:::info
Versioning is currently supported for the following [item types](./10_items-types.md):
- **Plugin**
- **Infrastructure Resource**
- **Template**
- **Example**
:::

To define a *version of a resource*, a few key properties must be configured:

- **Version name** (the `name` property inside the `version` object): a unique name that identifies the version of the resource. This typically follows [Semantic Versioning rules](https://semver.org/) (e.g. 1.0.0, 2.1.3).

- **Stable properties across versions**: the following properties must remain consistent across all versions of the same resource:
    - `itemId`
    - `tenantId`

These three properties together — `tenantId`, `itemId`, and `version.name` — form the unique identity of a versioned resource.

Refer to [this section](/software-catalog/items-management/overview.md) for implementation details.

:::info
Items that were created without a version will still appear in the Console. These are treated as non-versioned resources and will be shown with a version value of *N/A*.
:::

When multiple versions of an item exist, one of them is automatically considered the **latest** version:
- this version is used by default when creating new resources from the Catalog
- it is selected based on [Semantic Versioning rules](https://semver.org/), this meaning the highest valid version number becomes the latest.

:::info
If any resource attached to a Marketplace item has an available update, the Console will notify you.
You can find these updates:
- In the sidebar, at the bottom of your service list
- Within the detail page of the service that requires updating

 ![Design page with notifications of new Marketplace versions](./img/versions_notifications.png)
:::

### Editing a versioned resource

Versioned resources are designed to be **immutable**, meaning their core configuration cannot be changed once published. This guarantees reliability and consistency across environments. However, metadata such as a description or release notes may still be updated.

The following fields cannot be edited after publishing a version:
- `itemId`
- `tenantId`
- `version.name`
- `assets` (field `resources`)

Since items are defined by the `itemId`, the `tenantId` and the `version` name, attempting to modify one of these three properties will cause the creation of a new item, completely separated from the previous one.

Attemping to modify the `resources` property will cause an error, and the item will not be updated. In this case, you need to create a new version of the item.

Some examples:

- **Plugin**: The `dockerImage` field determines the version. Any update to this field requires creating a new version.
- **Infrastructure Resource**: Defined by the `apiVersion` and `kind` properties. Changes to these fields must also be handled via versioning.