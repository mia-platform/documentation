---
id: v7.4.x
title: Version 7.4.x Release Notes
sidebar_label: v7.4
image: "img/release-note-link-preview.png"
---

## v7.4.1

_April 14, 2021_

### Marketplace

#### HTTP Proxy Manager

The HTTP Proxy Manager, a microservice which acts as a proxy between client and external services, is now available on the Marketplace. Check out its [documentation](../runtime_suite/http-proxy-manager/overview) to know more.

#### Single View Creator Template

It's now available on the Marketplace the [Single View Creator Template](../fast_data/configure_single_view_creator) which enables you to start to work on your Single View Creator with most of the code already configured.    

When you create the service from the template, all the environment variables are already set. What you need to do is just to change some of them depending on your needs. Also, the repository of your Single View Creator will be created, with all the code and tests already written. Most of the code is ready to use, you just need to change three functions which depend on your own data.    

The template is available only on Mia-Platform PaaS Marketplace. If you want to have it on your on-premise installation, please contact your Mia-Platform technical referent.

### New Features

### Bug Fix

#### Show in API Portal flag visibility

The [Show in API Portal](../development_suite/api-console/api-design/endpoints#manage-the-visibility-of-your-endpoints) flag was displayed even for endpoints that do not feature any documentation; the flag has been removed in those circustamces and kept only where needed (e.g. CRUD endpoints and Endpoints towards custom services).

#### Empty Public Variables file issues

Project configuration is now properly loaded even when public variables file is empty.

#### Public Variables folder creation

Some on-premise installations featured the creation of the Public Variables folder even though the feature toggle was disabled. The folder is now created only when the feature toggle is active.

#### Public Variables prefix trim

As of now, for backward compatibility reasons, Public Variables *must* start with the `MIA_` prefix; if a file features a different prefix it is kept as-is during configuration load but will be prefixed with `MIA_` upon configuration save.

:::note
As of now, the `MIA_` prefix is handled by the Console, so you **don't have to insert it the Public Variable section**, however if you're manually setting the variabile inside the `.env` file you should prefix it.

For instance if you're manually editing the `.env` file to insert the variable `MY_CUSTOM_VARIABLE` you should write it as `MIA_MY_CUSTOM_VARIABLE`.
:::

#### Logs environment `value` field deprecation

In [Logs](../development_suite/monitoring/monitoring) area, project environments were handled using the deprecated `value` property, preventing the Pods list to be rendered properly. The are now using the correct `envId` property instead.

### Improvements

#### Logs search filter preserved

When using the [Logs](../development_suite/monitoring/monitoring) section filter and navigate through pod details and logs the search query filter is now preserved, meaning that if you open one and then go back, the list will still be filtered.

#### Logs section sticky header

To improve usability of the Pod table in the [Logs](../development_suite/monitoring/monitoring) section the header has been changed to always be visible.

#### Use Real-Time Updater without Kafka Authentication

Set the `saslPassword` and `saslUsername` of your Real-Time Updater to empty if you don't want to use a kafka authentication for the service.

### BaaS deprecation

It is not possible to create a project that uses the services `Authentication with BaaS` and `Login Site` anymore.

[Endpoints](../development_suite/api-console/api-design/endpoints) of type Mia-Platform BaaS are now officially deprecated.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.7.2`.

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
