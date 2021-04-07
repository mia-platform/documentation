---
id: v7.4.x
title: Version 7.4.x Release Notes
sidebar_label: v7.4
image: "img/release-note-link-preview.png"
---

## v7.4.0

_April 8, 2021_

### New Features

#### Smart Deploy

A new deployment functionality is now accessible from the Deploy page. By toggling the dedicated switch, users can now selectively release only the services whose configuration has been updated since the last deployment.  

![Service To Deploy](./img/service-to-deploy-column.png)

Check out the [smart deploy documentation](../development_suite/deploy/deploy#smart-deploy) for further details on how to use this feature.  

Please note smart deployments require **mlp**, the Mia-Platform official command line deployment tool. Contact your Mia-Platform referent to make sure this feature is enabled and ready to use for your projects.

:::caution
To take full advantage of the feature you're required to save the configuration; also, the first smart deploy will necessarely trigger a deploy of all the services.
:::

#### Public Variables configuration

On-Premise installations can now configure a custom name for the folder where Public Variables are stored by setting the desired value to `publicVariablesFolderName` in Helm Chart configuration.

### Marketplace

#### Marketplace update customization

On-Premise installations can now specify which types of marketplace services should be updated; by properly configuring the `marketplaceSyncFilters` property of the Helm Chart it is now possible to limit the synchronization to specific types of microservices (*example*, *template* or *plugin*)

### Bug Fix

#### Indexes on nested fields

Creating a new index with a field from a property of a nested object was prevented by the input field validation function. This validation function has been changed and it admits nested object properties.

### Improvements

#### Microservices order at endpoint creation

When creating a new endpoint of type microservice, the available microservices are ordered by decreasing creation date during the working session, so that the last microservice you have created is the first you can choose.

#### Project environment `value` field deprecation

Project environments in the console database used to have a `value` property that is now officially deprecated, it should be migrated to `envId` property instead.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.7.1`.
