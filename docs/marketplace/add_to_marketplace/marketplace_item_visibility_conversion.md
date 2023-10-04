---
id: marketplace_items_visibility_conversion
title: How to change a Marketplace item visibility from private to public and vice versa
sidebar_label: How to change a Marketplace item visibility from private to public and vice versa
---

The marketplace is an essential tool within the development platform, designed to empower developers with maximum autonomy in their development activities. As such, it offers a vast library of ready-to-use components that are highly dynamic. Consequently, there may arise a need for an item that initially started as a public asset within the marketplace to be restricted for use by a single company. In the opposite scenario, an item that began as private for exclusive use by one company may need to become publicly available to all tenants.

This guide aims to assist the reader in transforming marketplace items concerning their visibility within companies: from public to private, or vice versa, from private to public.

:::info
To create a marketplace item, whether it's private or public, please follow [this](/marketplace/add_to_marketplace/contributing_overview.md) dedicated guide.
:::

### Porting an existing item in the Private Marketplace

In the event that you need to port an item originally available in the public marketplace to the private marketplace, the first step is to communicate this intention to Mia-Platform's maintenance team through a [service request](https://makeitapp.atlassian.net/servicedesk/customer/portal/21) or via a [GitHub Discussion](https://github.com/mia-platform/community).

Once the Mia-Platform team receives the request and assesses its feasibility, they will grant authorization to proceed with the porting and monitor migration activities. After obtaining the authorization to proceed with the porting, you will need to create a repository on your Git provider and migrate the code of the item you want to transfer. During this phase, if necessary, you will also need to configure your CI/CD pipelines.

Once the repository configuration is complete, the final operational step involves creating the Item Configuration following the [guide for creating marketplace items](/marketplace/add_to_marketplace/contributing_overview.md). At this point, it's essential to notify the Mia-Platform maintenance team of the completion of the preceding steps, either through the previously opened service request or GitHub discussion. This will allow them to proceed with the removal of the old item and its related configurations (repositories, pipelines, etc.) from the publicly accessible marketplace.

## Porting an existing item in the Public Marketplace

For porting a marketplace item from public to private, the procedure is very similar to the one previously discussed for porting an item from public to private. In this case, the first step is to create the new item in the public marketplace, following the procedure to make your marketplace item available to other companies as well.

Once this procedure is completed, and the item is effectively available on the public marketplace, you can proceed with retiring the private item. This involves removing the Item Configuration and its related configurations such as repositories and pipelines.

:::caution
The repositories and pipelines should only be deleted if they have not been reused in defining the new item in the public marketplace.
:::

