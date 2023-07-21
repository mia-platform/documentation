---
id: marketplace_items_accessibility
title: Make your Marketplace items available to others
sidebar_label: Make your Marketplace items available to others
---

You can contribute to the public Mia-Platform Marketplace with your own Marketplace items. This section will guide you on how to do so, offering two main methods:

* (recommended) Use the [CMS](/business_suite/guide_cms.md) to make your Marketplace item public.
* Open an issue on Mia-Platform [Github community page](https://github.com/mia-platform/community).

Both methods will be explained in the following paragraphs.

## Use the CMS to make your Marketplace item public

To make your marketplace item public, you first need to create it in the CMS. Follow the instructions on [this page](/marketplace/add_to_marketplace/contributing_overview.md#how-to-configure-a-new-component) to do so.  
Once you have created your Marketplace item in the CMS, you can make it public by editing its `visibility` property. Specifically, set the `allTenants` property inside the `visibility` object to "true".  
After editing, the visibility property should look like this:

```json
{
    "allTenants": true
}
```

If the repository where your Marketplace item is located is open source, then you have completed the process, and your marketplace item can now be accessed and used by other Companies!

Otherwise, to allow others to access it, you should provide them with a public provider that has the necessary permissions to access your Marketplace item repository.  

Firstly, you need to connect the provider you wish to use for this purpose to your company using the Mia-Platform Console. You can find detailed instructions on how to do so on [this page](/development_suite/set-up-infrastructure/configure-provider.mdx#connect-a-provider).  
For this specific case, you should select only the "Git Provider" capability with the "Marketplace" functionality in the "Provider Services" step. Then, set the accessibility of the provider to be public in the "Provider Details" step.

After creating and connecting your provider, you can return to the CMS and edit the `providerId` property (using the providerId of the provider you connected in the step before) of the marketplace item that you wish to publish.

After completing the previous step, your marketplace item should be available to any Company since it is now publicly accessible!

## Open an issue on Mia-Platform Github community page

To contribute to the Mia-Platform Marketplace using this method, start by opening an issue [here](https://github.com/mia-platform/community/issues/new?assignees=%40mia-platform%2Fsig-marketplace&labels=marketplace&projects=&template=marketplace-contribution.yaml&title=%5BNew+marketplace+item%5D%3A+). This issue will outline the necessary information for your request.  
Subsequently, a Mia-Platform representative will take over the issue and contact you to collaboratively plan the addition of the component to the Marketplace, following the guidelines described on [this documentation page](/marketplace/add_to_marketplace/contributing_overview.md).
