---
id: v7.8.1
title: Version 7.8.1 Release Notes
sidebar_label: v7.8.1
image: "img/release-note-link-preview.png"
---

_July 15, 2021_

### New Features

#### Configuration upgrade during save

Saving a configuration with an older version than the current one will not display an error anymore. The configuration will be updated to the most recent version and then saved.

:::note
The following alert may show up after having saved your project:  

*Your configuration has been saved successfully.  
You need to reload this page in order to use Mia-Platform Console correctly and take advantage of the latest features.*

If it does, it is strongly recommended to reload the page you are in. In this way, you will align the Console to the most updated version of your project.
:::

#### Fully manageable authorization service

The [authorization service](../../runtime_suite/authorization-service/overview), the core service that controls access to endpoints, is now visible in the Microservices area.
You can change CPU and memory request and limit, the number of static replicas, enable [autoscaling](../../development_suite/api-console/api-design/replicas), manage environment variables and configuration and [much more](../../development_suite/api-console/api-design/services#manage-microservices).

Configurations defined through the [Advanced](../../development_suite/api-console/advanced-section/authorization-service/configuration) section will be inherited. From now on, the update of `api-console-config/core-service.json` for the `authorization-service` will not affect its configuration.

If the `Authorization Service` service is absent in your project you can now autonomously add it to your branch by creating it from the Marketplace.

:::info
For more information on how to configure the Authorization Service correctly visit this [link](../../runtime_suite/authorization-service/configuration).
:::

#### Authentication service new env variable

Added environment variable `ADDITIONAL_HEADERS_TO_PROXY` to `authentication service` to set additional header to proxy when crud service is called.

#### Retry system during deploy

Added a retry system during [project deployment](../../development_suite/deploy/deploy) that will attempt to get the pipeline status of the project multiple times in case of network errors before displaying an error to the user.

### Marketplace

New template and example services have been added to the Marketplace:

#### Welcome Swift

A new Hello World application is now available, the first one in the Swift programming language, leveraging Vapor framework. Checkout [_Vapor Hello World Example_](https://github.com/mia-platform-marketplace/Vapor-Hello-World-Example) in the Mia-Platform PaaS marketplace

#### Microservice Gateway update

[Microservice Gateway](../../runtime_suite/microservice-gateway/overview) v6.0.6 is now available, this version brings several important security patches and the ability to load large configuration files.

#### Files Service and MongoDB Reader use MongoDB unified topology

By using the MongoDB unified topology connection pattern, Files Service and MongoDB Reader will not restart anymore when a connection error occurs. Instead, the connection will be automatically re-established as soon as possible.

#### Single View Creator Plugin and Template update

The [Single View Creator](../../runtime_suite/single-view-creator/configuration) plugin and template have been updated to bring you many logs improvements.  
The new version of the plugin is `2.0.0`, which has a breaking change because the docker-image has been changed into `nexus.mia-platform.eu/fast-data/single-view-creator-plugin`.

#### Added Crud Service support to projection on nested object

The projection regex pattern on request JSON-Schema has been removed in order to allow the projection with _p query parameter on nested fields.   
The new version of the Crud Service is 4.1.0.

### Preview Features

#### Cross Project Proxy through Service of Kubernetes

Cross Project Proxy can now be made using the Service of Kubernetes, instead of doing so through the API Gateway.  
This feature is available in preview. Please, visit [this page](../../development_suite/api-console/api-design/proxies#create-a-new-cross-projects-proxy) to know more about Cross Project Proxy and to find out how you can enable this feature.

### Bug Fix

#### Menu scroll

Console menu now supports scrolling when a single item is hovered

#### Endpoint of Type Single View

Fixed a bug that prevented user to be able to edit some information of an Endpoint of Type Single View

#### Docusaurus Microlc template creation

Fixed a bug that did not allow to correctly create the template service.

### Improvements

#### Changed position of deploy submenu

Now [Deploy](../../development_suite/deploy/deploy) area does not have a topbar anymore. "Deploy" and "History" have been moved to the sidebar.

![sidebar-deploy](../img/sidebar-deploy.png)

#### Runtime Environments table

[Runtime environments](../../development_suite/set-up-infrastructure/runtime-environments) table in Envs area has new `Documentation`, `CMS` and `Application` columns instead of the previous `Hosts`, `Master Cluster IP` and `Description`. These new columns contain useful links to the related sections for each environment that you have defined for your project.  
These links can be set by modifying the `hosts` and `links` properties of your project in the CMS. In case you do not have access to it, please contact your Mia Platform referent.  
Moreover, table rows are now expandable and will show more information, like the `Cluster Namespace` or additional links that you may need for your project.

#### Visualize relocation

[Visualize](../../development_suite/api-console/api-design/miacraft) has been moved from the topbar of the Design section to the top of the main sidebar.

![new_position_visualize](../img/new_position_visualize.png)

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.12.6`.
