---
id: v7.5.x
title: Version 7.5.x Release Notes
sidebar_label: v7.5
image: "img/release-note-link-preview.png"
---

## v7.5.0

_April 22, 2021_

### New Features

#### Fast Data Single Views

In the Design area, you can now configure your Single Views, using the [Single Views](../fast_data/single_view) page of the Fast Data section.

![Fast Data Single Views](./img/fastdata-single_views.png)

Define the fields of the single view and which Single View Creators services will update the single view in the `Data Model` section.

You can also set the strategies for each projection directly in the [Strategies](../fast_data/single_view#strategies) section of the single view you need to update.

#### Large Configmaps support

Core services configuration now supports ConfigMaps larger than __1MB__ (this limit is imposed by Kubernetes). Large ConfigMaps will be automatically split into multiple parts and joined back together during deployment.


:::note
For technical reasons, ConfigMap resources cannot be split more than __20 times__, hence the current maximum supported size for a ConfigMap is __16MB__.
:::

#### Public Variables warning customization

In the [Public Variables](../development_suite/api-console/api-design/public_variables) section, an explanatory message with a documentation link is displayed anytime a user lands on that page for the first time. This message can now be personalized by the Console administrator directly from the notification section of the Console CMS.

![image.png](./img/public-variables-custom-warning.png)

### Marketplace

#### Single View Creator Plugin

The `Single View Creator Plugin` is now available in the Marketplace. The plugin helps you to easily keep your Single Views updated. You only need to write three configuration files and then you are ready to deploy.

When you create the service from the plugin, all the environment variables are already set. What you need to do is just to change some of them depending on your needs.

The plugin is available only on Mia-Platform PaaS Marketplace. In order to have it on your on-premise installation, please contact your Mia-Platform technical referent.

#### Possibility to display _Coming Soon_ microservices

In the [Marketplace](../marketplace/overview_marketplace), console administrators can add and show _Coming Soon_ templates, plugins and examples.

In order to add a Coming Soon service you need to create your service in the Console CMS of On Premise installations and set the **Coming Soon** label to `true`.

### Bug Fix

#### Environment Pods list

Switching between environments in the [_Logs_](https://docs.mia-platform.eu/docs/development_suite/monitoring/monitoring/) area could lead to a wrong Pod list visualization. This bug has now been fixed and the correct Pod are always listed.

### Improvements

#### Error message for malfunctioning Pods

A proper error message is displayed if something goes wrong during Pod container log retrieval.

#### New Deploy outcome option

A proper 'No info available' feedback is now provided in the Deploy Outcome column when there is not enough information to compute the preview. Read [Smart Deploy documentation](../development_suite/deploy/deploy#understanding-deploy-outcome-column) for additional information.

#### Release version visibility in the Deploy details

The Deploy section is now able to show services with versions coming from interpolated public variables. Once you have successfully configured your microservice, the value of the public variable corresponding to the selected environment will be displayed in the `New version` column of the Deploy Details.

#### Environment id and name display

Envs section now displays both the environment identifier and its label in the environments table.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.7.4`.
