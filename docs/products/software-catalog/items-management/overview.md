---
id: overview
title: Software Catalog management
sidebar_label: Catalog management
---

Managing your Catalog boils down to permforming CRUD operations on [Item Type Definitions](/products/software-catalog/basic-concepts/10_items-types.md) and [items](/products/software-catalog/basic-concepts/05_items-data-structure.md).

There are several ways to manage Software Catalog entities, depending on your preferred workflow and level of control:

- [**Software Catalog UI**](/products/software-catalog/items-management/ui.md): a user-friendly graphical interface within the Console, ideal for manual and quick operations,
- [**`miactl`**](/products/software-catalog/items-management/miactl.md), the official Mia-Platform command-line tool. Perfect for automation, scripting, and advanced workflows,
- [**Mia-Platform GitHub Community**](https://github.com/mia-platform/community): for community-driven contributions or support requests — such as proposing new items or requesting changes — you can open an issue on the [dedicated page](https://github.com/mia-platform/community), and
- [**API Access**](/products/software-catalog/items-management/api.md): you can interact directly with the underlying APIs to perform programmatic changes.

## Permissions

To create, edit, and delete Catalog entities, users must have the [role](/products/console/identity-and-access-management/console-levels-and-permission-management.md#identity-capabilities-inside-console) of **Company Owner** or **Project Administrator** in the Company the entity belongs to.

On top of that, the specific permission [**`marketplace.root.manage`**](/products/console/identity-and-access-management/console-levels-and-permission-management.md#console-root-level-permissions) is needed to

- create or edit *ITDs* with `metadata.visibility.scope` set to `console`, and
- to set or edit these restricted properties of an *item*:
  - `supportedBy`
  - `supportedByImage`
  - `visibility`
