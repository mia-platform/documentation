---
id: manage_marketplace_items
title:  Manage Marketplace Items
sidebar_label:  Manage Marketplace Items
---

There are three main methods to create, modify and delete Marketplace items:

* (recommended) Use [`miactl`](/cli/miactl/10_overview.md), the Mia-Platform command line interface tool.
* Open an issue on Mia-Platform [Github community page](https://github.com/mia-platform/community).
* (deprecated) Use the [CMS](/business_suite/guide_cms.md).

## Use `miactl`


First of all, you need to setup `miactl`, as explained in the [dedicated doc](/cli/miactl/20_setup.md).

With the `miactl marketplace` subcommands, you can perform several actions, described here below.

### Create an item 

:::info

You need to have *Company Owner* or *Project Administrator* permission to perform this action

:::

First of all, you need to create a JSON file as explained in [this guide](/marketplace/add_to_marketplace/contributing_overview.md#how-to-configure-a-new-component). 
Save the file in the current directory, for example as `myMarketplaceItem.json` file.



To create the item on the Marketplace, simply run this command:

```sh
miactl marketplace apply -f myMarketplaceItem.json
```

A message will confirm the operation, returning some information:
```
1 of 1 items have been successfully applied:

  ITEM ID                   NAME        STATUS   

  65368hf0c91d871a87afbcbf  API Portal  Inserted  
```


If your object contains the `image` and/or the `supportedByImage` keys, such images will be uploaded along with the item.
The keys will be replaced with the `imageUrl` and the `supportedByImageUrl`, to obtain the updated version of the item use the `get` command: 
```sh
miactl marketplace get ITEM_ID > myMarketplaceItem.json
```

More information on this point can be found in the [dedicated doc](/cli/miactl/30_commands.md#apply).

### Update an item

:::info

You need to have *Company Owner* or *Project Administrator* role at Company level to perform this action

:::

To update an item already on the Marketplace you can download it and save it to a JSON file:

```sh
miactl marketplace get ITEM_ID > myMarketplaceItem.json
```
where `ITEM_ID` is an alphanumerical id of the Marketplace element. If you don't know the item id, use the `miactl marketplace list` command to list all the Marketplace Items. You can easily locate the one of interest by looking for its name.

:::tip

It is suggested to always download the Marketplace Item just before updating it to be sure to work on the latest version.

:::

Follow the steps in the [Modifying the Marketplace Item](#enabling-the-visibility-to-all-companies); once you have finished, save the file and apply it to the Marketplace:

```sh
miactl marketplace apply -f myMarketplaceItem.json
```

You will see the outcome of the operation in the command output:
```
1 of 1 items have been successfully applied:

  ITEM ID                   NAME        STATUS   

  65368hf0c91d871a87afbcbf  API Portal  Updated  
```

### Delete an item

:::info

You need either the *Company Owner* or *Project Administrator* role at Company level to perform this action

:::

You can delete an item from the Marketplace by means of the `delete` command:

```sh
miactl marketplace apply -f myMarketplaceItem.json
```

## Open an issue on Mia-Platform Github community page

To contribute to the Mia-Platform Marketplace using this method, start by opening an issue [here](https://github.com/mia-platform/community/issues/new?assignees=%40mia-platform%2Fsig-marketplace&labels=marketplace&projects=&template=marketplace-contribution.yaml&title=%5BNew+marketplace+item%5D%3A+). This issue will outline the necessary information for your request.  
Subsequently, a Mia-Platform representative will take over the issue and contact you to collaboratively plan the addition of the component to the Mia-Platform Marketplace, following the guidelines described on [this documentation page](/marketplace/add_to_marketplace/contributing_overview.md).

### Using the CMS

To make a Marketplace item of your Company accessible to other Companies, you first need to create it in the CMS. Follow the instructions on [this page](/marketplace/add_to_marketplace/contributing_overview.md#how-to-configure-a-new-component) to do so,

If the item is already present, just edit it, following the [related section](#enabling-the-visibility-to-all-companies).


