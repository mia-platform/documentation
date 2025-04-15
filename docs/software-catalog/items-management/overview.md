---
id: overview
title: Items management
---

The **Items Management** section provides an overview of how to manage items within the Software Catalog.

Managing items involves three main actions:
- **Listing** existing items and their available versions
- **Creating** new items or new versions
- **Editing** existing items or version metadata
- **Deleting** items or specific versions

These actions apply to both **versioned** and **non-versioned** items. However, it's important to note:
- For **non-versioned items**, edits directly modify the item
- For **versioned items**, editing may result in the creation of a **new version**, since versioned resources are immutable in their core structure and configuration.

### Management methods

There are several ways to manage Software Catalog items and their versions, depending on your preferred workflow and level of control:

- [**Software Catalog UI**](./ui.md): a user-friendly graphical interface within the Console, ideal for manual and quick operations
- [`miactl`](./miactl.md), the official Mia-Platform command-line tool. Perfect for automation, scripting, and advanced workflows
- **Mia-Platform GitHub Community**: for community-driven contributions or support requests — such as proposing new items or requesting changes — you can open an issue on the [Mia-Platform Github community page](https://github.com/mia-platform/community)
- **API Access**: you can interact directly with the underlying APIs to perform programmatic changes. The API documentation is available [here](Link to API Portal?)
