---
id: overview-mia-ctl-delete
title:  Delete item
sidebar_label:  Delete item
---

:::info
You need either the *Company Owner* or *Project Administrator* role at Company level to perform this action
:::

Imagine you notice that the service "My Awesome Service" is no longer useful for your Company and so you want to delete it.

You can delete an item from the Marketplace by means of the `delete` command:

```sh
miactl marketplace delete --object-id=<objectId>
```

> The `object-id` is the `ID` you get when you apply the template, it is not the `itemId`

The item is then deleted from the Marketplace.

The deletion is permanent, but the file on your machine will not be deleted.
If you want, you can recreate the item on the Marketplace again by applying the file.
