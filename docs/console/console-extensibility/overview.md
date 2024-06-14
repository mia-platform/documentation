---
id: extensibility-overview
title: Overview
sidebar_label: Overview
---
# Overview

The Extensibility feature can simplify your development workflows and allow you to integrate external tools via iframes. In this way, the Console can incorporate additional features from external sources (or directly from other Console Projects) and thus become a single access point, making the developer experience more comfortable.

A correctly activated extension will appear as a new menu item on the Console main navigation. You can place extensions in different Console contexts such as within a Company or inside a specific Project. Furthermore, you can also specify restrictions using Console permissions so that the new menu item is visible only to a limited group of users.

## How to see your extension on Console?

The activation of a new extension in the Console involves two phases:

- [Registration](/console/console-extensibility/registration.md)
- [Activation](/console/console-extensibility/activation.md)

`Registration` allows you to add an extension for the first time and provide all the essential information necessary for the extension to work, such as the URL for fetching the iframe and the different locations where the new menu items should be placed.
`Activation`, on the other hand, allows you to activate an extension already registered on a specific Console context and in this way the same extension can be active on multiple contexts at the same time, such as multiple projects for example.

:::tip
**[Consult the tutorial to take your first steps.](/console/tutorials/create-extension.md)**
:::

## Advanced concepts: Security and Customization

The extension visibility can be based on IAM permissions and restricted only to specific users (see the security paragraph on the [registration page](/console/console-extensibility/registration.md#how-to-restrict-the-extension-usage)) and the activation could override some registered extension settings and apply these overrides only to a specific activation context (see the [overrides](/console/console-extensibility/activation.md#overrides) section for more information).   