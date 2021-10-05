---
id: v7.8.0
title: Version 7.8.0 Release Notes
sidebar_label: v7.8.0
image: "img/release-note-link-preview.png"
---

_June 29, 2021_

### New Features

#### Fully manageable microservice-gateway

The [microservice-gateway](../../runtime_suite/microservice-gateway/overview), the core service that provides you the ability to specify [decorators](../../development_suite/api-console/api-design/decorators#decorators) to be invoked before and after each request is now visible in the Microservices area.
You can change CPU and memory request and limit, the number of static replicas, enable [autoscaling](../../development_suite/api-console/api-design/replicas), manage environment variables and configuration and [much more](../../development_suite/api-console/api-design/services#manage-microservices).

Configurations defined through the [Advanced](../../development_suite/api-console/advanced-section/dev-console-config/advanced_name_core) section will be inherited. From now on, the update of `api-console-config/core-service.json` for the `microservice-gateway` will not affect its configuration.

If the `Microservice Gateway` service is absent in your project you can now autonomously add it to your branch by creating it from the Marketplace.

:::info
For more information on how to configure the Microservice Gateway correctly visit this [link](../../runtime_suite/microservice-gateway/configuration).
:::

#### Runtime section

The Logs section has been renamed in Runtime, bringing with it some functional and graphic improvements

##### Pods area

**Progress bars:** The resources of a whole pod are now visualized with a progress bar and the data of the containers are shown directly on the page

**New functions on the pod rows:** "View Log" and "View previous log" functions has been introduced in the option menù of a single pod at the end of each row

**Feedback of restarting:** Visualization of restarting pod in the modal warning with info of their status

##### Detail of pods

**Previous log:** Previous log section to consult the logs of a previously terminated container has been introduced

**Logs of a specific container:** Clicking on container name the user is redirected to the specific logs

**Refresh button:** A new button for refreshing the information of the pod in the Overview tab has been added

#### Flow Manager Fullscreen and Expand/Collapse mode

The default visual setting about the aggregated events and the closed channel panels of the states can be easily switched on/off using the button "Collapse/Expand All", also in highlight mode.

#### Flow Manager Business States

The Flow Manager visualizer is now able to display colorful business states configurations.

With this functionality, services leveraging the Flow Manager can now create groups of states representing a single business entity and visualize them using different colors.

Learn more about using business states in the Flow Manager [configuration section](../../runtime_suite/flow-manager-service/how_it_works#business-states).

![flow-manager-business-states](../img/flow-manager-business-states.png)

#### Projection field new types

[Projection fields](../../fast_data/create_projection#projection-fields) can now be of two new types: `Object` and `Array of object`. Two new [default cast functions](../../fast_data/cast_functions#cast-function-default) have been added for the new types. This feature requires the [Real Time Updater](../../fast_data/real_time_updater/overview) to be updated at version v3.1.0.

### Bug Fix

#### Microservices Runtime card

The measure of unit label displayed at the end of the numeric inputs for `successThreshold` and `failureThreshold` have been removed since these are absolute values.

#### Real-Time Updater Projections being edited before Projection Changes

Fixed a bug that caused Single Views to be only partially updated due to the fact that the Projection Changes were updated right before the Projections deletion operations were carried out. This feature requires the [Real Time Updater](../../fast_data/real_time_updater/overview) to be updated at version v3.1.0.

### Marketplace Updates

#### CRUD, v1-Adapter and CMS-Backend services use MongoDB unified topology

By using the MongoDB unified topology connection pattern, CRUD Service, v1Adapter and CMS-Backend services will not restart anymore when a connection error occurs. Instead, the connection will be automatically re-established as soon as possible.

#### CRUD Service v4.0.0

This new [CRUD service](../../runtime_suite/crud-service/overview_and_usage) version adds the ability to use the STATE change API for bulk state changes using all the properties in filters, before this version the filter only accepts the `_id`.

#### Files Service v2.2.0

With the `files-service` update to v2.2.0 you will be able to define a custom cache mechanism using the configuration file. The feature is opt-in, [check the documentation](../../runtime_suite/files-service/configuration) for further information

#### Microservice Gateway v6.0.5

The Microservice Gateway plugin is now available in the marketplace with default environment variables, default configmap `microservice-gateway-config` and default resources already set.

#### Custom Plugin Lib v3.0.0

The Node.js library has been updated to feature fastify v3 and many other updated libraries check out the library [CHANGELOG](https://github.com/mia-platform/custom-plugin-lib/blob/master/CHANGELOG.md) for further details.

#### Resolved floating dropdown when choosing Secret name

The dropdown of the autocomplete for choosing the secret name when creating a new secret custom configuration [Custom Configuration](../../development_suite/api-console/api-design/services#custom-configuration) now scrolls correctly with the page.

### Improvements

#### Security Management card flags text change

The **Public** and **Only with an API Key** flags present in the [Security Management card](../../development_suite/api-console/api-design/endpoints#manage-the-security-of-your-endpoints) of the Endpoints section have been renamed into **Authentication required** and **API Key required**.

:::note
If an endpoint previously had the **Public** flag set, it will now have the **Authentication required** unset automatically, and vice versa.
:::

#### Link to Microservice detail page in the Replicas section

In [Replicas section](../../development_suite/api-console/api-design/replicas), the name of a microservice is now a direct link to easily visit the [detail page of a specific service](../../development_suite/api-console/api-design/services#microservice) by entering Microservices section.

#### Default Real-Time Updater version updated to v3.1.0

When adding a new [Real Time Updater](../../fast_data/real_time_updater/overview) to your configuration, it will be created with the new v3.1.0 version by default.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.12.2`.
