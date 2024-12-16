---
id: overview-mia-ctl-update
title:  Update item
sidebar_label:  Update item
---

:::info
You need to have *Company Owner* or *Project Administrator* role at Company level to perform this action
:::

Imagine now that you noticed that the description of "My Awesome Service" is not correct and you want to change it.

First of all, download and save the latest version of the item configuration:

```sh
miactl marketplace get ITEM_ID > myAwesomeService.json
```

where `ITEM_ID` is an alphanumerical id of the Marketplace item.  
If you don't know the item id, use the `miactl marketplace list` command to list all the Marketplace Items. You can easily locate the one of interest by looking for its name.

:::tip

It is suggested to always download the Marketplace item just before updating it to make sure it works on the latest version.

:::

Edit your file following the steps described in the [Modifying the Marketplace Item](#enabling-the-visibility-to-all-companies);
once you are happy with the changes, save the file and apply it to the Marketplace:

```sh
miactl marketplace apply -f myAwesomeService.json
```

You will see the outcome of the operation in the command output:

```sh
1 of 1 items have been successfully applied:

  ID                        ITEM ID             NAME                 STATUS   

  65368hf0c91d871a87afbcbf  my-awesome-service  My Awesome Service   Updated
```

The changes are now reflected to the Console.

### Update of versioned items

Marketplace items of type *Plugin* and *Custom Resources* require a *version* object to determine the differences of the plugin definition over time.
In case you need to update the definition, you can update a versioned item only if you need to change some base fields (more details on the [Create your Company Marketplace](/software-catalog/manage-items/overview.md) page), otherwise you can do so by creating a new version.

You can create a new version of the plugin via [miactl](/cli/miactl/10_overview.md) by simply executing the [`apply`](/cli/miactl/30_commands.md#apply) command, in the same way as explained above, ensuring that the `itemId` and `tenantId` are the same but with a new version, and of course the `resource` object updated.

As explained in the [Create your Company Marketplace](/software-catalog/manage-items/overview.md) page, you must follow the [Semantic Versioning](https://semver.org/) convention when defining the version of your item.
This will help you to keep track of the changes you made to the item over time, and help you understand the best version to use when configuring your project.
