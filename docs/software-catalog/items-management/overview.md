---
id: overview
title: Items management
---

The **Items Management** section provides an overview of how to manage items within the Software Catalog.

Managing items involves the following main actions:

- **listing** existing items and their available versions,
- **creating** new items or new versions,
- **editing** existing items or versions, and
- **deleting** items or specific versions.

:::caution
An item can be **created**, **edited**, and **deleted** only by users with the **Company Owner** or **Project Administrator** [role](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#identity-capabilities-inside-console) in the Company the item belongs to.
:::

These actions apply to both **versioned** and **non-versioned** items. However, it's important to note:

- for **non-versioned items**, edits directly modify the item, and
- for **versioned items**, editing may result in the creation of a **new version**, since versioned items are immutable in their core structure and configuration.

### Management methods

There are several ways to manage Software Catalog items and their versions, depending on your preferred workflow and level of control:

- [**Software Catalog UI**](/software-catalog/items-management/ui.md): a user-friendly graphical interface within the Console, ideal for manual and quick operations,
- [**`miactl`**](/software-catalog/items-management/miactl.md), the official Mia-Platform command-line tool. Perfect for automation, scripting, and advanced workflows,
- [**Mia-Platform GitHub Community**](https://github.com/mia-platform/community): for community-driven contributions or support requests — such as proposing new items or requesting changes — you can open an issue on the [dedicated page](https://github.com/mia-platform/community), and
- [**API Access**](/software-catalog/items-management/api.md): you can interact directly with the underlying APIs to perform programmatic changes.
