---
id: marketplace_items_accessibility
title: Make your Marketplace items available to other Companies
sidebar_label: Make your Marketplace items available to other Companies
---

You can contribute to the Mia-Platform Marketplace with the Marketplace items of your Company, by deciding to make them accessible also to other Companies. This section will guide you on how to do so, offering two main methods:

* (recommended) Use the [CMS](/microfrontend-composer/previous-tools/cms/guide_cms.md) to make your Marketplace item accessible to other Companies.
* Open an issue on Mia-Platform [Github community page](https://github.com/mia-platform/community).

Both methods will be explained in the following paragraphs.

## Use the CMS to make your Marketplace item accessible to others

To make a Marketplace item of your Company accessible to other Companies, you first need to create it in the CMS. Follow the instructions on [this page](/marketplace/add_to_marketplace/contributing_overview.md#how-to-configure-a-new-component) to do so.  
Once you have created your Marketplace item in the CMS, you can make it accessible to other companies by editing its `visibility` property. Specifically, set the `allTenants` property inside the `visibility` object to "true".  
After editing, the visibility property should look like this:

```json
{
    "allTenants": true
}
```

If the repository where your Marketplace item is located is freely accessible (open source), then you have completed the process, and your marketplace item can now be accessed and used by other Companies!

Otherwise, in order to grant access to other Companies, you should provide them with a **Provider** that has the required permissions to access your Marketplace item repository and make it accessible to other Companies.

First, you need to connect to your Company the Provider you want to use for this purpose, by using the Mia-Platform Console. Detailed instructions on how to connect a Provider for Marketplace purposes can be found on [this page](/development_suite/set-up-infrastructure/configure-provider.mdx#connect-a-provider-for-marketplace).  

:::info
Remember to set the accessibility of the Provider in the "**Provider Details**" step or by editing the existing Provider, in order to make it accessible by other Companies.
:::

After creating and connecting your Provider, you can return to the CMS and edit the `providerId` property (using the providerId of the Provider you have previously connected in the step before) of the Marketplace item that you want to publish.

After completing the previous step, your Marketplace item should be available to any Company!

## Open an issue on Mia-Platform Github community page

To contribute to the Mia-Platform Marketplace using this method, start by opening an issue [here](https://github.com/mia-platform/community/issues/new?assignees=%40mia-platform%2Fsig-marketplace&labels=marketplace&projects=&template=marketplace-contribution.yaml&title=%5BNew+marketplace+item%5D%3A+). This issue will outline the necessary information for your request.  
Subsequently, a Mia-Platform representative will take over the issue and contact you to collaboratively plan the addition of the component to the Mia-Platform Marketplace, following the guidelines described on [this documentation page](/marketplace/add_to_marketplace/contributing_overview.md).
