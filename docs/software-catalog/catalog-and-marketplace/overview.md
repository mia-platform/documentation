---
id: catalog-and-marketplace
title: Catalog and Marketplace Items Visibility
sidebar_label: Catalog and Marketplace Items Visibility
---

## Company Software Catalog and Mia-Platform Marketplace

As a Console user, you can access both Mia-Platform public Marketplace and your Company Software Catalog.
While the Mia-Platform public Marketplace is composed by all the items publicly available in the Mia-platform catalog, the **Company Software Catalog** is a Company-specific private space where to create and manage the items which are available only for your Company.

The **Mia-Platform public Marketplace** is the place where every Company can find most of the items needed to set up its Project architecture. It is publicly available on Mia-Platform Console, meaning that all Companies can view and make use of its items.

However, a Company might want to have its own internal Catalog, fulfilled also with items that must not be shared with everyone else outside the Company.

---

The Marketplace is an essential tool within the Development Platform, designed to empower developers with maximum autonomy in their development activities. As such, it offers a vast library of ready-to-use components that are highly dynamic. Consequently, there may arise a need for an item that initially started as a public asset within the Marketplace to be restricted for use by a single Company. In the opposite scenario, an item that began as private for exclusive use by one Company may need to become publicly available to all Companies.

This guide aims to assist the reader in transforming Marketplace items concerning their visibility within Companies: from public to private, or vice versa, from private to public.

:::info

To create a Marketplace item, please follow [this](/marketplace/add_to_marketplace/create_your_company_marketplace.md) dedicated guide.

:::

### Porting an existing item to the Private Marketplace

In the event that you need to port an item originally available in the public Marketplace to the private Marketplace, the first step is to communicate this intention to Mia-Platform maintenance team through a [Service Request](https://makeitapp.atlassian.net/servicedesk/customer/portal/21) or via a [GitHub Discussion](https://github.com/mia-platform/community).

Once the Mia-Platform team receives the request and assesses its feasibility, they will grant authorization to proceed with the porting and monitor migration activities. After obtaining the authorization to proceed with the porting, you will need to create a repository on your Git Provider and migrate the code of the item you want to transfer. During this phase, if necessary, you will also need to configure your CI/CD pipelines.

Once the repository configuration is complete, the final operational step involves creating the Item Configuration following the [guide for creating Marketplace items](/marketplace/add_to_marketplace/create_your_company_marketplace.md). At this point, it's essential to notify the Mia-Platform maintenance team of the completion of the preceding steps, either through the previously opened service request or GitHub discussion. This will allow them to proceed with the removal of the old item and its related configurations (repositories, pipelines, etc.) from the publicly accessible Marketplace.

## Porting an existing item to the Public Marketplace

For porting a Marketplace item from private to public, the procedure is very similar to the one previously discussed for porting an item from public to private. In this case, the first step is to create the new item in the public Marketplace, following the procedure to make your Marketplace item available to other companies as well.

Once this procedure is completed, and the item is effectively available on the public Marketplace, you can proceed with retiring the private item. This involves removing the Item Configuration and its related configurations such as repositories and pipelines.

:::caution

The repositories and pipelines should only be deleted if they have not been reused in defining the new item in the public Marketplace.

:::

## Enabling the visibility to all Companies

* (recommended) Use the [CMS](/microfrontend-composer/previous-tools/cms/guide_cms.md) to make your Marketplace item accessible to other Companies.
* Open an issue on Mia-Platform [Github community page](https://github.com/mia-platform/community).

Both methods will be explained in the following paragraphs.

## Marketplace item visibility

### Accessibility to other Companies

To make a Marketplace item of your Company accessible to other Companies, you first need to create it. Follow the instructions on [this page](/marketplace/add_to_marketplace/create_your_company_marketplace.md#how-to-configure-a-new-item) to do so.

When creating your Marketplace item, you can make it accessible to other companies by editing its `visibility` property. Specifically, set the `allTenants` property inside the `visibility` object to "true".  
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