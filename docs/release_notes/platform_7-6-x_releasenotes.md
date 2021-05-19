---
id: v7.6.x
title: Version 7.6.x Release Notes
sidebar_label: v7.6
image: "img/release-note-link-preview.png"
---

## v7.6.0

_May 19, 2021_

### New Features

#### Flow Manager Visualizer

A whole new section is now available in the Design Area featuring the finite state machine representation of any service based on the Flow Manager Service Plugin from marketplace.

![Flow Manager main area](../development_suite/api-console/api-design/img/flow-manager/main-area.png)

To learn more on the section and the available features check out the [documentation page](../development_suite/api-console/api-design/flow-manager-visualizer).

#### Addition of external services to a Mia-Craft visualization

It is now possible to add an external service in your Mia-Craft visualization.
In particular, Kafka, MongoDB and Redis, respectively with ad-hoc designed icons, can be added into your visualization.
Moreover, it is possible to add a custom external service with a custom name.

![External service addition](./img/add.gif)

Lastly, user can delete an external custom added into the visualization with a right click on it.

#### Large Configmaps support

Custom services configuration now supports [ConfigMaps](../development_suite/api-console/api-design/services#configmaps) larger than __1MB__ (this limit is imposed by Kubernetes). Large ConfigMaps will be automatically split into multiple parts and joined back together during deployment.

#### Create a cms page using a fast-data-projection endpoint

It is now possible to create a cms page using a [fast-data-projection endpoint](../fast_data/create_projection) by configuring it through the [CMS extensions](../business_suite/cms_configuration/conf_cms#configure-pages).

:::caution
A cms page of a fast-data-projection endpoint is **read-only**. You are not allowed to make any changes.
:::

#### MIA_ prefix management for Public Variables

It is now possible to avoid the addition of the `MIA_` prefix to [public variables keys](../development_suite/api-console/api-design/public_variables.md#where-public-variables-are-saved) when they are saved in the public variables folder. To do so, console administrators can access the Console [CMS](../business_suite/guide_cms) and add to your project `deploy` object the following property `useMiaPrefixEnvs` set to `false`. After this, remove from the public variables folder all `MIA_` prefixes from all public variables keys of all `.env` files.

:::caution
`MIA_` prefix is necessary for projects that use bash script for their deploy pipelines. Therefore, this property should be set to `true` only for projects that use mlp.
:::

### Bug Fix

#### V1-Adapter check required service

Added validation to check whether all the services that the `V1-Adapter` needs are enabled as core services of the project. If one of them is disabled, an error will be thrown when saving the configuration. Please contact your Mia-Platform referent to enable the required services in your project.

#### 404 page for non existing collections

Replaced the malfunctioning "Something went wrong" screen with a 404 error-page when trying to access the URL of not existing collections.

#### Validation for configMap file names

Fixed bug that caused the pipeline to fail if a configMap file name contained a blank space. Now the validation is the same regex used by kubernetes.

#### MongoDB Index fields update

Fixed an error preventing the MongoDB indexes to be properly updated after eliminating or creating fields in an existing index.

#### Configmap file recreation

Fixed a bug causing the Console to save an incorrect project configuration in case a user deletes a ConfigMap file and recreates it with the same name.

#### Burger icon menu actions for cms analytics

Removed the malfunctioning features `Print Chart` and `View Data Table` of the analytics that caused an incorrect visualization.

#### Cms card images crop

Fixed bug that was preventing the display of card images with the right size. The fix is available in cms-site v9.14.0. Please update your project to take advantage of it.

### Improvements

#### CMS link in Environments details

In the Environments table of Envs area, the hosts related to the project's CMS are now links that open the CMS in a new tab.

#### Last build information always available in Deploy area

In [Deploy details](../development_suite/deploy/deploy#deploy-details) table of Deploy area, the Last build always contains some information, displaying "No build available" when no other option applies.

#### Increased Real-Time Updater resources

It's been increased the CPU request to `40m` and limit to `200m` of the [Real-Time Updater](../fast_data/create_projection#real-time-updater-cpu-and-memory-requests-and-limits).

#### Missing service placeholder for MongoDB CRUD section

If the [Crud Service](../runtime_suite/crud-service/overview_and_usage) is not enabled as a core service in the project, the [MongoDB CRUD](development_suite/api-console/api-design/crud_advanced) section displays a placeholder to signal the need for the service configuration.

### Marketplace

#### MessageId log for Mail Notification Service

The [Mail Notification Service](../runtime_suite/ses-mail-notification-service/configuration) has been updated to v2.0.4. A debug log which provides a messageId for each email sent has been added.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.9.1`.
