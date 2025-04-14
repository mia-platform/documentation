---
id: items-visibility
title: Items visibility
sidebar_label: Items visibility
---

This guide aims to assist the user in managing the visibility of items across different visibility levels: from private to visible to all companies, from visible to all companies to public, or vice versa.

:::caution
The ability to modify the visibility of an item to other companies is restricted to users with the Company Owner or Project Administrator role. Additionally, users must have the [`marketplace.root.manage`](/development_suite/identity-and-access-management/console-levels-and-permission-management.md#console-root-level-permissions) permission to perform this action.
:::

## Public Visibility

To make an item accessible to the public, i.e. any user that access the Console, even if not authenticated, you can set the `visibility.public` field to `true`. The default value is `false`, meaning that an item will not be exposed to the public.

### Porting a public item to private

If you need to migrate an item from the public Marketplace to a private context, follow the steps below:

1. Start by notifying the Mia-Platform maintenance team of your intent to port the item. You can do this by submitting a [Service Request](https://makeitapp.atlassian.net/servicedesk/customer/portal/21) or by opening a [GitHub Discussion](https://github.com/mia-platform/community).

The Mia-Platform team will review the request and assess its feasibility. If approved, they will authorize the migration and provide support throughout the process.

2. After receiving approval:
- Create a new repository in your Git provider.
- Migrate the source code of the item you want to transfer.
- If required, configure the corresponding CI/CD pipelines to ensure proper automation and deployment.

3. Once the repository is ready:
- Create the item configuration by following the official [guide](/software-catalog/items-management/overview.md).
- Ensure that all necessary metadata and references are properly updated to reflect the private context.

4. When all steps above are completed, inform the Mia-Platform maintenance team (via the same service request or GitHub discussion thread). They will then proceed with:
- Removing the original item from the public Marketplace
- Cleaning up related resources, such as public repositories and pipelines

### Porting an existing item to the Public Marketplace

For porting an item from private to public, the procedure is very similar to the one previously discussed for porting an item from public to private. In this case, the first step is to create the new item in the public Marketplace, following the procedure to make your item available to other companies as well.

Once this procedure is completed, and the item is effectively available on the public Marketplace, you can proceed with retiring the private item. This involves removing the Item Configuration and its related configurations such as repositories and pipelines.

:::caution
The repositories and pipelines should only be deleted if they have not been reused in defining the new item in the public Marketplace.
:::

## Make your item accessible to other Companies

To make an item from your Company available to other Companies, you need to update its `visibility` settings.
If you're using miactl, you must edit the item's configuration file and set the a`allTenants` property within the `visibility` object to true:

```json
...
"visibility": {
    "allTenants": true
}
...
```
This allows the item to be visible to all Companies within the platform.

If you're using the Software Catalog UI, you can achieve the same result by selecting the `All Companies` option in the visibility settings.

Depending on whether the item is hosted in a public or private repository, additional actions may be required. These are explained in the following sections.

### Open Source item

If the repository hosting your item is public and openly accessible (i.e., open source), then you're all set — the item is now accessible and usable by other Companies via the Marketplace.

### Item hosted on a private repository

If your item is stored in a private repository, additional configuration is required to ensure the Console can access it.

1. **Create a Marketplace Provider**
You need to create a Provider for the Marketplace, where you'll configure the credentials required to access your Git Provider. Follow the instructions in [this guide](/console/company-configuration/providers/configure-marketplace-provider.mdx) to set it up.

The Provider must be created in the same Company where the item resides. This is defined by the `companyId` property in the item configuration.

:::info
To make Software Catalog resources accessible to other Companies, you must enable the "Allow access to all the Companies" option in the Provider settings, as explained [here](/console/company-configuration/providers/configure-marketplace-provider.mdx#step-2-provider-details).
This ensures the Console can access the item’s resources even when it belongs to a project in a different Company.
:::

2. **Link the Provider to the Item**
Once the Provider is created and connected:
- Go to the Providers section in the CMS.
- Locate your Provider and take note of its `providerId`.
- Go back to the Software Catalog and edit the item configuration.
- Add the `providerId` property with the corresponding value.

From this point on, your item will be available to all Companies across the platform!