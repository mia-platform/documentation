---
id: items-visibility
title: Items visibility
sidebar_label: Items visibility
---

The visibility of an item refers to the **possibility of controlling who can see** and utilize it.

Items are always - and, by default, only - visible to the users of the Company to which they belong. Through the `visibility` field, items can be open to other Console users, and, potentially, even to non-authenticated users.

:::caution
The ability to modify the visibility of an item to other companies is restricted to users with the Company Owner or Project Administrator role. Additionally, users must have the [`marketplace.root.manage`](/products/console/identity-and-access-management/console-levels-and-permission-management.md#console-root-level-permissions) permission to perform this action.
:::

The `visibility` field is an object that adheres to the following schema:

```json
{
  "type": "object",
  "properties": {
    "public": {
      "type": "boolean",
      "default": false
    },
    "allTenants": {
      "type": "boolean",
      "default": false
    }
  },
  "additionalProperties": false
}
```

Changing the values of the properties you can achieve one of the three possible states of visibility of an item: *private*, *all companies*, and *public*.

:::caution
An item based on a **private [ITD](/products/software-catalog/basic-concepts/10_items-types.md)** can only have **private visibility**.
:::

#### Private

A private item can **only be accessed by users of the company** it belongs to. This is the default visibility and corresponds to the following value of the `visibility` field:

```json
{
  "public": false, // or undefined
  "allTenants": false // or undefined
}
```

Since the `visibility` field is not mandatory in the [item data structure](/products/software-catalog/basic-concepts/05_items-data-structure.md), an item without it is considered to be private.

#### All companies

An item with this visibility can be **accessed by all authenticated users of Mia-Platform Console**. It corresponds to the following value of the `visibility` field:

```json
{
  "public": false, // or undefined
  "allTenants": true
}
```

#### Public

A public item can be **accessed by anyone**, even non-authenticated users. It corresponds to the following value of the `visibility` field:

```json
{
  "public": true,
  "allTenants": false // or true, or undefined
}
```
