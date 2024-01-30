---
id: homepage_configuration
title: Homepage Configuration
sidebar_label: Homepage Configuration
---

The homepage of the Dev Portal allows users to have a general overview of the different sections composing the Dev Portal and easily move to one of those sections, such as the marketplace, the functional documentation, or the API documentation.  

However, if this user experience we provided with the homepage does not correctly fit your needs, you can deeply customize this page both in terms of content and graphical design.

![homepage](./img/homepage.png)

### The Homepage Repository

When you create a Dev Portal application, you are also generating a Docusaurus template with a dedicated repository that will help you manage your Dev Portal documentation content.

In this repository, a dedicated sub-package will allow you to access the content rendered on the homepage and modify it according to your needs.

:::info
You can easily access the homepage code inside the repository at `packages/home/src`.
:::

### Edit Content

The Dev Portal homepage is a [React](https://reactjs.org/) based page, a common Javascript framework for realizing interactive web pages.

To customize the homepage, you can directly modify the content of the existing components (the cards redirecting to other sections), but you can also create new components to display more interactive information.

