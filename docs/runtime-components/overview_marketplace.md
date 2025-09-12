---
id: overview_marketplace
title: Overview
sidebar_label: Overview
---

This section provides documentation for the available **runtime components** that can be used within your projects on Mia-Platform Console.

Runtime components are ready-to-use building blocks that can be added to your projects directly from the **Console Design area**, thanks to a guided UI that simplifies setup and configuration.
Each component is designed to solve specific runtime needs, from service communication to data processing, and is built to integrate seamlessly with the Mia-Platform ecosystem.

All components are maintained by **Mia-Platform** or trusted **technology partners**, and are published in the public 👉 [GitHub repository](https://github.com/mia-platform-marketplace/public-catalog)

#### Want to propose a change or add a new item?

All updates must go submitted via a Pull Request (PR) on the [public-catalog](https://github.com/mia-platform-marketplace/public-catalog) repository — ensuring transparency and consistency across the Catalog.

Explore the sections below to discover what’s available and how to use each component effectively.

## Edit Mia-Platform Catalog items

:::caution
This section only applies to **on-prem Console installations**.
:::

There may be cases in which you need to make changes to the Mia-Platform-supported Catalog items (e.g., you want to change the registry of a plugin's Docker image).

This can be accomplished through two different approaches:

- **Startup modification**: Applied during **Console installation**, does not require the concept of Company to apply modifications
- **Runtime modification**: Performed by users through the **Console interface** using specific Companies, changes are still global to Console

### Via Console Installation

There are update scripts that allow you to customize the resources of the **public catalog**. One particular customization is the modification of the image registry, which can be done through full path rewriting or regex usage for greater flexibility.

More information about this type of customization can be found in the [marketplace][resources-customization] related documentation page, and additional examples and usage details are available in the [public catalog][public-catalog] repository.

### Via Console Interface

Even if they are provided automatically on Console installations and updates, Mia-Platform items are still standard Catalog items. This means that they belong to a specific Company, and thus can be edited through the [Software Catalog](/products/software-catalog/overview.md) of that Company.

The Company in question is the **default one** of the Console installation, specified in the the `configurations.miaPlatformDefaultCompanyId` key of the [installation Helm chart](/infrastructure/self-hosted/installation-chart/helm-values/10_installation-chart-example.md) (defaults to `mia-platform`). However, by default, nobody has access to this default Company: a **binding** need to be created on the **Console Backoffice** to give access to a user who can then add other users through the IAM section of the Company.

Specifically, the steps to achieve this are:

1. identify the name of the default Company by looking at the Chart key (if it's not present, the value is `mia-platform`), and
2. create a new binding in the `Bindings` page of the Console CMS with:
   - `binding Identifier` set to any unique code,
   - `roles` set to `Company Owner`,
   - `subjects` set the first user you want to be Company Owner of the default Company, and
   - `resources` set to

      ```json
      {
        "resourceType": "company",
        "resourceId": "default_company_name"
      }
      ```

Once the binding is added, the chosen user should be able to see with the default Company in the Console and interact with its Catalog to change any of the Mia-Platform items.

:::danger
Any change made to Mia-Platform items will be **reverted** by the synchronization job on the next Console update.
:::

[resources-customization]: /infrastructure/self-hosted/installation-chart/helm-values/45_marketplace.md
[public-catalog]: https://github.com/mia-platform-marketplace/public-catalog