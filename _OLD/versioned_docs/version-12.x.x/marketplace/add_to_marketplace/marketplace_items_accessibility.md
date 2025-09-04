---
id: marketplace_items_accessibility
title: Make your Marketplace items available to other Companies
sidebar_label: Make your Marketplace items available to other Companies
---

## Enabling the visibility to all Companies

* (recommended) Use the [CMS](/microfrontend-composer/previous-tools/cms/guide_cms.md) to make your Marketplace item accessible to other Companies.
* Open an issue on Mia-Platform [Github community page](https://github.com/mia-platform/community).

Both methods will be explained in the following paragraphs.

## Marketplace item visibility

### Accessibility to other Companies

To make a Marketplace item of your Company accessible to other Companies, you first need to create it in the CMS. Follow the instructions on [this page](/marketplace/add_to_marketplace/contributing_overview.md#how-to-configure-a-new-component) to do so.

Once you have created your Marketplace item in the CMS, you can make it accessible to other companies by editing its `visibility` property. Specifically, set the `allTenants` property inside the `visibility` object to "true".  
After editing, the visibility property should look like this:

```json
...
"visibility": {
    "allTenants": true
}
...
```

Depending on whether the item is hosted on a public or private repository, you may have to perform additional actions, as described here below.

#### Open Source item

If the repository where your Marketplace item is located is public and freely accessible (open source), then you have completed the process, and your marketplace item can now be accessed and used by other Companies!

#### Item hosted on a private repository

To allow the Console to access the private repository, you need to create a **Provider for Marketplace**, in which you will specify the credentials to access the Git Provider. Follow [these steps](/console/company-configuration/providers/configure-marketplace-provider.mdx) to learn how to create it.

The Provider has to be created in the same Company where the item is created (defined in the property `companyId` of the item).

:::info

Please note that, in order for the Marketplace resources to be visible to other Companies, yor need to enable the *Allow access to all the Companies* switch, as explained [here](/console/company-configuration/providers/configure-marketplace-provider.mdx#step-2-provider-details).  
This allows the Console to access Marketplace items resources when they are created within a Project belonging to any Company.

:::

After creating and connecting your Provider, locate it in the Providers section of the CMS and take note of the `providerId`; go back to the CMS and edit the Marketplace item that you want to publish, and set to it the property `providerId` with the value you copied from the provider.

From this moment, your new Marketplace item should be available to any Company!

### Public Visibility

To make a Marketplace item accessible to the public, i.e. any user that access the Console, even if not authenticated, you can set the `visibility.public` field to `true`. The default value is `false`, meaning that an item will not be exposed to the public.

:::caution

By default, for retrocompatibility reasons, Marketplace items without the `tenantId` are exposed to the public, regardless of the presence of the `visibility.public` field.

Since v12.x.x, **the `tenantId` field is mandatory**; the upgrade script will take care of adding a default `tenantId` and `visibility.public: true` only to Mia-Platform supported Marketplace items.

If you have any Marketplace item supported by you without a `tenantId`, **you have the responsibility to set a `tenantId`** to them. Failing to do so may result in errors in the next Console releases. Remember also to update their `visibility` according to your needs

:::