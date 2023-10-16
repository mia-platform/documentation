---
id: marketplace_items_accessibility
title: Make your Marketplace items available to other Companies
sidebar_label: Make your Marketplace items available to other Companies
---

## Enabling the visibility to all Companies

You can make a Marketplace item accessible to other companies by editing its `visibility` property. Specifically, the `allTenants` property inside the `visibility` object must be set to "true".  
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