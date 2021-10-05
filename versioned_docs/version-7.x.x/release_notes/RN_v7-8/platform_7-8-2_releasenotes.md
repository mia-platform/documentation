---
id: v7.8.2
title: Version 7.8.2 Release Notes
sidebar_label: v7.8.2
image: "img/release-note-link-preview.png"
---

_July 16, 2021_

### Bug Fix

#### Authorization Service Environment Variables

The environment variables defined through the Advanced section in the core-services.json file for the authorization service were not correctly inherited once it had been converted to custom service in Mia-Platform v7.8.1.

:::caution
In case you had defined the environment variables of the Authorization Service from Advanced and you saved your configuration with Mia-Platform v7.8.1, you need to align their values to the ones in the authorization service manageable from the Microservices page.
:::

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.12.7`.
