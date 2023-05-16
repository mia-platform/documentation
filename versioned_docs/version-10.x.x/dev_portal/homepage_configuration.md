---
id: homepage_configuration
title: Homepage Configuration
sidebar_label: Homepage Configuration
---

Once you successfully followed the [steps](/dev_portal/application_creation.md) to create the Dev Portal application, you can start adding all information characterizing your organization at the endpoint `/back-office/`. 

Through the **Backoffice** section of the Dev Portal, you can easily access the repository that will contain the code of the Dev Portal homepage. This can be achieved by clicking the **Homepage** link inside the **Static files** section, displayed right after the marketplace and requests management.

:::note
Please make sure your **Homepage** link is correctly configured once you create the Dev Portal application. 

You can change this link by editing the `backoffice-micro-lc-backend` configuration. Move to the `configuration.json` file and update the `externalLink` field of the homepage plugin.
:::

### Homepage Overview

The homepage of the Dev Portal allows users to have a general overview of the different sections composing the Dev Portal and easily move to one of those sections, such as the marketplace, the functional documentation, or the API documentation.  

However, if this user experience we provided with the homepage does not correctly fit your needs, you can deeply customize this page both in terms of content and graphical design.

![homepage](./img/homepage.png)

### The Homepage Repository

When you create a Dev Portal application, you are also generating a Docusaurus template with a dedicated repository that will help you manage your Dev Portal documentation content.

In this repository, a dedicated section will allow you to access the content rendered on the homepage and modify it according to your requisites.

:::info
you can easily access the homepage code inside the repository at `src/pages/index.js`.
:::

### Edit Content

The Dev Portal homepage is a [React](https://reactjs.org/) based page, a common Javascript framework for realizing interactive web pages.

To customize the homepage, you can directly modify the content of the existing components (the cards redirecting to other sections), but you can also create new components to display more interactive information.

### Edit Homepage location

In general, both content and graphical appearance can be modified to any extent using the provided repository. However, you can also use an external repository to present your content.

If you need to change the repository used for the Dev Portal homepage, you just need to modify the `dev-portal-micro-lc-backend` [configuration](/dev_portal/application_creation.md#2-configure-dev-portal-micro-lc-backend) by updating the `logo/navigation_url` field of the `configuration.json` file.

:::caution
If you choose to use a different repository, or you simply want to edit the position of your homepage source code inside the Docusaurus repository, you also need to reflect this modification in the backoffice **Homepage** link.

In this way, you will still be able to access the exact homepage location from the backoffice section.
:::

As mentioned before, you can modify the **Homepage** link by editing the `backoffice-micro-lc-backend` configuration. Move to the `configuration.json` file and update the `externalLink` field of the homepage plugin.

