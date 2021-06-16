---
id: v7.7.x
title: Version 7.7.x Release Notes
sidebar_label: v7.7
image: "img/release-note-link-preview.png"
---

## v7.7.3

_June 16, 2021_

### New Features

#### Fully manageable API Portal

The [API Portal](../runtime_suite/api-portal/overview), the  core service that is responsible for showing the graphical interface for your [Open Api specification document](https://swagger.io/resources/open-api/) in the [Documentation Portal](../development_suite/api-portal/api-documentations) is now visible in the Microservices area. You can change CPU and memory request and limit, the number of static replicas, enable [autoscaling](../development_suite/api-console/api-design/replicas), manage environment variables and [much more](../development_suite/api-console/api-design/services#manage-microservices).

Configurations defined through the [Advanced](../development_suite/api-console/advanced-section/dev-console-config/advanced_name_core) section will be inherited. From now on, the update of `api-console-config/core-service.json` for the `api-portal` will not affect its configuration.

If the `API Portal` service is absent in your project you can now autonomously add it to your branch by creating it from the Marketplace.

:::info
For more information on how to configure the API Portal correctly visit this [link](../runtime_suite/api-portal/configuration).
:::

#### Customizable Swagger Aggregator endpoints

The [Swagger Aggregator](../runtime_suite/swagger-aggregator/overview) endpoints are now customizable.

Moreover, these endpoints can be used together with the API Portal endpoint to expose the Open API Documentation on an additional path of your choice. To learn how to do so, visit both the configuration page of [Swagger Aggregator](../runtime_suite/swagger-aggregator/configuration) and [Api Portal](../runtime_suite/api-portal/configuration) plugins.

#### Configure Readiness and Liveness probes, and Termination Grace Period

Now it is possible to customize `httpGet path`, `initalDelaySeconds`, `periodSeconds`, `timeoutSeconds`, `successThreshold`, `failureThreashold` in new Runtime card into the detail page of a custom microservice.
Moreover, into new Runtime card, it is also possible to configure in seconds the termination Grace Period.

See more information in our [doc](../development_suite/api-console/api-design/microservice-runtime-resources).

#### Real Time Updater as a custom service

[Real Time Updaters](../fast_data/overview#real-time-updater) in charge of handling the projections are now visible in the Microservices area. You can edit their environment variables and replicas without passing through the Advanced section.

The following custom settings from Advanced file `fast-data` will be automatically inherited by the service and any change made from Advanced will not affect the service anymore:

- **projectionsChangesCollectionName**: mapped into environment variable `PROJECTIONS_CHANGES_COLLECTION_NAME` of the service
- **saslUsername**: mapped into environment variable `KAFKA_SASL_USERNAME` of the service
- **saslPassword**: mapped into environment variable `KAFKA_SASL_PASSWORD` of the service
- **saslMechanism**: mapped into environment variable `KAFKA_SASL_MECHANISM` of the service
- **messageAdapter**: mapped into environment variable `KAFKA_MESSAGE_ADAPTER` of the service
- **replicas**: mapped into the field `replicas` of the service

:::note
Real Time Updater services are created and deleted when you save the configuration. You cannot delete directly the service itself, just delete the System associated and the service will be removed when you save.
:::

#### Microservice resource support to Public Variables

You can now use [Public Variable](../development_suite/api-console/api-design/public_variables) to value the [Memory Resource](../development_suite/api-console/api-design/microservice-memory-resources) and [CPU Resource](../development_suite/api-console/api-design/microservices-cpu-resources) of your service.

#### Logs page improvements

##### New look of the Monitoring section

The [Logs](../development_suite/monitoring/monitoring) area now has a new sidebar and a different look. When you press on the name of the pods, now the first information displayed is its general status: everything has been reorganized in a tab container, where you can also find the logs of its containers.
Furthermore, the logs section of each pod is now inserted into a tab container.

##### Pod area

**Filter:** In the pods section, a new input select has been added in order to filter pods based on some fields such:

- Status: OK/Warning
- Phase: completed/running/pending/error
- Containers: Restart

**Go to microservice:** At the end of each row, is now available a menu to restart each pod and to navigate to the microservice section in design: this one just for pods that are not core.

**Watch Mode:** Now you can choose the period that can be used to automatically refresh the data in the pods section.

**Multiselect:** At the beginning of each row is now available a checkbox to select multiple pods and restart them with a single click. Also, has been implemented a switch button to let the user see only the selected pods.

**Tooltip:** When the user hovers the status icon or the phase label a tooltip is showed with more information on the specific field

**Modal:** When restarting one or more Pods a modal view appears informing the user about the risks of restarting and allowing him to proceed

##### Logs area

**Prettify of logs:** Is now available a toggle to prettify each log row. The toggle status persisted also between different pods.

### Bug fix

#### Import crud fields from file

The import of CRUD fields from a json file now works as intended. The "Import fields from file" button can be found in Design area, CRUD section, Fields card.

#### Special characters support for branch names

Branches with special characters in their name (e.g. `/`) are now correctly encoded when retrieving their configuration after pressing "Commit & Generate". This solved a bug in the Design area which caused the configuration to appear empty after committing.

#### Security patch

Security in accessing some endpoints has been reviewed and strengthened.

#### Documentation Portal route exposure

Solved a bug that caused the exposure of microservice routes in the Documentation Portal when the microservice endpoint was configured to not show them.

### Improvements

#### Logs area

Old column status changed into phase and the current column status represents a general overview of the status of a single pod. Columns Memory and CPU have been deleted.

#### Beautify json files

The json files generated by the console are now beautified before saving into gitlab.
This helps the user to easily see the differences between two configuration files, if the diff is not too large.

#### Marketplace - Auth0 service

The Auth0 Service plugin is now updated with default `SERVICE_CONFIG_FILE_NAME` and `SERVICE_CONFIG_PATH` value, and a default configmap `auth0-client-config` with `config.json` file.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.11.4`.

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
