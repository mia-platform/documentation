---
id: v7.7.x
title: Version 7.7.x Release Notes
sidebar_label: v7.7
image: "img/release-note-link-preview.png"
---

## v7.7.2

_June 3, 2021_

### New Features

#### Fully manageable swagger-aggregator

The swagger-aggregator, the  core service that is responsible for aggregating the individual [Open APIs](https://swagger.io/resources/open-api/) is now visible in the Microservices area. You can change CPU and memory request and limit, the number of static replicas, enable [autoscaling](../development_suite/api-console/api-design/replicas), manage environment variables and [much more](../development_suite/api-console/api-design/services#manage-microservices).

Configurations defined through the [Advanced](../development_suite/api-console/advanced-section/dev-console-config/advanced_name_core) section will be inherited. From now on, the update of `api-console-config/core-service.json` for the `swagger-aggregator` will not affect its configuration.

Extensions set from the [Swagger Aggregator Advanced files](../development_suite/api-console/advanced-section/swagger-aggregator/configuration) will keep working even though the service has become a custom service.

If the `Swagger Aggregator` service is absent in your project you can now autonomously add it to your branch by creating it from the Marketplace.

:::note
Only a single instance of `Swagger Aggregator` can exist for each branch. If `Swagger Aggregator` is already present among custom services, the marketplace will not show the `Swagger Aggregator` plugin.
:::

#### Preserving files and directories already existing in the Runtime Mount Path directory

When a ConfigMap is mounted, user can decide to preserve files and directories already existing in the Runtime Mount Path directory by enabling a checkbox placed into the configuration section of a ConfigMap.

Into the deployment file, the new subPath property related to an added file is determined by the file name, thus the mountPath is completed by the addition of the subpath.

### Bug Fix

#### Delete CRUD dependencies

The deletion of a CRUD will now delete correctly all of its dependencies: `endpoints`, `pages` and `analytics`.

#### CMS try to refresh expired cookies, or force you to re-login

`mia_client_key` cookie now expire after 15 minutes and the CMS try to refresh it automatically: if you are still authorized, the cookie is refreshed; otherwise, you are redirected to log-in page.

#### Compare table in the Deploy area

Resolved a bug preventing the compare table to display cronjobs with new version even if already present on cluster. Now the table shows the correct cronjob version. In case of on-premise installations, it is necessary to give read access to the cronjob list to the console service account.

Microservices interpolating their version from public variables could cause the compare table not to be render correctly if the public variable did not present a value for the selected environment. Now the compare table shows the interpolated variable instead.

#### Project Creation

Fixed a bug affecting the environment variables configuration after the creation of projects containing only the `crud service`.

### Improvements

#### Advanced services version in deploy table

The Deploy compare table now displays version changes even for advanced services by searching for the docker image of the first existing container.

#### All hosts in Envs area are now external links

In Envs area, Runtime Environments table, every host is now an external link.

#### Pods table

Old column status has been changed into phase and the current column status represents a general overview of the status of a single pod. Columns Memory and CPU have been deleted.

### Marketplace

Java Hello World Template has been updated to Java lts version.

:::caution For on-premise Console installations
Templates and examples using the **Java lts version** require a newly created pipeline to be correctly deployed.

Please contact your Mia Platform referent to make sure you have the **pipeline templates latest version** before running the marketplace sync script.
:::

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.11.3`.

## v7.7.1

_June 1, 2021_

### Bug fix

#### Crud Service environment variables

When porting `crud-service` from core to custom service the MongoDB connection string environment variable used is now `MONGODB_SHORT_URL`, this fixes a breaking change introduced with v7.7.0 were the used variable was set to `MONGODB_URL` instead.

:::note
If you saved a project with v7.7.0 we strongly suggest you to review the variable used by the `crud-service` to make sure is properly configured.
:::
### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.10.1`.

## v7.7.0

_May 26, 2021_

### New Features

#### Mia-Platform core services configuration

The `core services` are the microservices that enable the Mia-Platform Console functionalities. Starting from today, we will progressively give you the power to configure them with all the options available in the microservices area: core services will be converted into custom services in continuous roll-out. This change allows you to make the Console fit your needs as much as possible and increase your visibility on the behavior of your project.

#### Fully manageable crud-service

The [crud-service](../runtime_suite/crud-service/overview_and_usage), the service that allows you to configure collections on MongoDB through the section [MongoDB CRUD](../development_suite/api-console/api-design/crud_advanced), is now visible in the Microservices area. You can change CPU and memory request and limit, the number of static replicas, enable [autoscaling](../development_suite/api-console/api-design/replicas), manage environment variables and configuration and [much more](../development_suite/api-console/api-design/services#manage-microservices).

Configurations defined through the [Advanced](../development_suite/api-console/advanced-section/dev-console-config/advanced_name_core) section will be inherited. From now on, the update of `api-console-config/core-service.json` for the `crud-service` will not affect its configuration.

If the MongoDB CRUD section in your project is disabled because the `crud-service` had not been added during project creation, you can now autonomously add it to your branch by creating it from the Marketplace.

:::note
Only a single instance of `Crud Service` can exist for each branch. If `Crud Service` is already present among custom services, the marketplace will not show the `Crud Service` plugin.
:::

#### Multiline Public Variables

It is now possible to write, save, use, and read multiline [Public Variables](../development_suite/api-console/api-design/public_variables#where-public-variables-are-saved). The Public Variables table has readonly entries for variables which contain a new line, so that they are only editable in the drawer.

#### Static Replicas

In the [Microservice Configuration](../development_suite/api-console/api-design/services#microservice-configuration) section, you can manage the number of static replicas of your microservices.

#### Enabled HPA for microservices configured in Advanced mode

In [Replicas section](../development_suite/api-console/api-design/replicas), it is now possible to manage dynamic replicas with the Kubernetes Horizontal Pod Autoscaler even for those microservices that are configured in Advanced mode.

### Bug Fix

#### Service selectors matching against Deploy labels

When using `service.yaml` and `deploy.yaml` files for custom configuration of an advanced service, the former selectors are checked to be a subset of the latter labels, instead of checking for complete equality.

### Marketplace

Springboot template and springboot decorator example have been updated to Java lts version.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.10.0`.
