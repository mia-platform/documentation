---
id: overview-catalog-and-marketplace
title: Software Catalog and Mia-Platform Marketplace Items Visibility
sidebar_label: Items Visibility
---

As a Console user, you can access both Mia-Platform public Marketplace and your Company Software Catalog.
While the Mia-Platform public Marketplace is composed by all the items publicly available in the Mia-platform catalog, the **Software Catalog** is a Company-specific private space where to create and manage the items which are available only for your Company.

The **Mia-Platform public Marketplace** is a key resource within the development platform, providing a vast library of ready-to-use components designed to support the setup of a Company's project architecture. Since it is publicly accessible, all Companies can view and utilize the items it contains.

However, while the **Software Catalog** is intended for Company-specific, private use, there may be scenarios where a Company wants to make an item available to all Companies or even publish it to the public **Mia-Platform Marketplace**. This allows for greater sharing and collaboration across Companies. Conversely, there might also be cases where an item initially available in the Mia-Platform Marketplace needs to be restricted to a single Company, making it private and exclusive to that Company’s catalog.

This guide aims to assist the reader in managing the visibility of items across different visibility levels: from private to visible to all companies, from visible to all companies to public, or vice versa.

:::caution

The ability to modify the visibility of an item to other companies is restricted to users with the Company Owner or Project Administrator role. Additionally, users must have the `marketplace.root.manage` permission to perform this action.

:::

:::info
To create an item, please follow [this](/software-catalog/manage-items/overview.md) dedicated guide.
:::

## How to manage items visibility 

Managing the visibility of items can be done through three main methods:

- PaaS Console installation:
  - open an issue on Mia-Platform [Github community page](https://github.com/mia-platform/community) or contact your Mia-Platform referent.
- On-Premise Console installation:
  - assign the [`marketplace.root.manage`](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#console-root-level-permissions) permission
  and use one of the following two methods:
    - the metadata section of the item in the Software Catalog to adjust visibility settings.
    - [`miactl apply`](/cli/miactl/30_commands.md#apply-1) to change the item visibility
  - (_Deprecated_): use the [Console Backoffice](/microfrontend-composer/previous-tools/cms/guide_cms.md) to make your item accessible to other Companies.


## Public Visibility

To make an item accessible to the public, i.e. any user that access the Console, even if not authenticated, you can set the `visibility.public` field to `true`. The default value is `false`, meaning that an item will not be exposed to the public.

:::caution
By default, for retrocompatibility reasons, items without the `tenantId` are exposed to the public, regardless of the presence of the `visibility.public` field.

Since v12.4.0, **the `tenantId` field is mandatory**; the upgrade script will take care of adding a default `tenantId` and `visibility.public: true` only to Mia-Platform supported Marketplace items.

If you have any Marketplace item supported by you without a `tenantId`, **you have the responsibility to set a `tenantId`** to them. Failing to do so may result in errors in the next Console releases. Remember also to update their `visibility` according to your needs
:::

### Porting a public Marketplace item to the Private Catalog

In the event that you need to port an item originally available in the public Marketplace to the private Marketplace, the first step is to communicate this intention to Mia-Platform maintenance team through a [Service Request](https://makeitapp.atlassian.net/servicedesk/customer/portal/21) or via a [GitHub Discussion](https://github.com/mia-platform/community).

Once the Mia-Platform team receives the request and assesses its feasibility, they will grant authorization to proceed with the porting and monitor migration activities. After obtaining the authorization to proceed with the porting, you will need to create a repository on your Git Provider and migrate the code of the item you want to transfer. During this phase, if necessary, you will also need to configure your CI/CD pipelines.

Once the repository configuration is complete, the final operational step involves creating the Item Configuration following the [guide for creating items](/software-catalog/manage-items/overview.md). At this point, it's essential to notify the Mia-Platform maintenance team of the completion of the preceding steps, either through the previously opened service request or GitHub discussion. This will allow them to proceed with the removal of the old item and its related configurations (repositories, pipelines, etc.) from the publicly accessible Marketplace.

### Porting an existing item to the Public Marketplace

For porting an item from private to public, the procedure is very similar to the one previously discussed for porting an item from public to private. In this case, the first step is to create the new item in the public Marketplace, following the procedure to make your item available to other companies as well.

Once this procedure is completed, and the item is effectively available on the public Marketplace, you can proceed with retiring the private item. This involves removing the Item Configuration and its related configurations such as repositories and pipelines.

:::caution

The repositories and pipelines should only be deleted if they have not been reused in defining the new item in the public Marketplace.

:::

## Enabling the visibility to all Companies

To make an item from your Company accessible to other Companies, you need to modify its `visibility` property. Specifically, set the `allTenants` property within the `visibility` object to "true".

After editing, the visibility property should look like this:

```json
...
"visibility": {
    "allTenants": true
}
...
```

Depending on whether the item is hosted on a public or private repository, you may have to perform additional actions, as described here below.

### Open Source item

If the repository where your item is located is public and freely accessible (open source), then you have completed the process, and your item can now be accessed and used by other Companies!

### Item hosted on a private repository

To allow the Console to access the private repository, you need to create a **Provider for Marketplace**, in which you will specify the credentials to access the Git Provider. Follow [these steps](/console/company-configuration/providers/configure-marketplace-provider.mdx) to learn how to create it.

The Provider has to be created in the same Company where the item is created (defined in the property `companyId` of the item).

:::info
Please note that, in order for your Software Catalog resources to be visible to other Companies, yor need to enable the *Allow access to all the Companies* switch, as explained [here](/console/company-configuration/providers/configure-marketplace-provider.mdx#step-2-provider-details).  
This allows the Console to access Software Catalog items resources when they are created within a Project belonging to any Company.
:::

After creating and connecting your Provider, locate it in the Providers section of the CMS and take note of the `providerId`; go back to the Software Catalog and edit the item that you want to publish, and set to it the property `providerId` with the value you copied from the provider.

From this moment, your new item should be available to any Company!