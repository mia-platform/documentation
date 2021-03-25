---
id: v7.2.x
title: Version 7.2.x Release Notes
sidebar_label: v7.2
image: "https://next.docs.mia-platform.eu/img/release-note-link-preview.png",
---

## v7.2.4

_March 24, 2021_

### Bug Fix

#### Delete last public variables

Resolved bug that prevented to delete all the [public variables](../development_suite/api-console/api-design/public_variables). Now the deletion of the last public variable works properly.

#### Warning for missing secret for environment variables

Before deploying, the warning message regarding [secrets](../development_suite/api-console/api-design/services#secrets) not found on cluster was not correctly signaling the absence of secrets when they had been added as source of a [microservice environment variable](../development_suite/api-console/api-design/services#environment-variable-configuration) value.

#### Microservice enviroment variable edit through drawer

When configuring a [microservice environment variable](../development_suite/api-console/api-design/services#environment-variable-configuration), opening the lateral drawer and saving without making any edit was causing the application to fail. The bug has now been fixed.

#### Marketplace sync

The Console Helm Chart has been updated to correctly synchronize all the properties of the microservices in the Marketplace when updating Mia-Platform Console in On Premise installations.

### Improvements

#### Textarea for every environment in Public Variable creation popover

The pop-over to create a new [Public Variable](../development_suite/api-console/api-design/public_variables) offers now a textarea field for every environment, to simplify the creation of variables with large values in projects with numerous environments.

#### OpenShift support for HPA and Log Parser

Configuration generated for OpenShift clusters now completely supports [HPA (Horizontal Pod Autoscaler)](../development_suite/api-console/api-design/replicas#what-needs-the-replicas-for) and Mia-Platform [standard log parser annotations](../development_suite/api-console/api-design/services#microservice-configuration).

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.5.5`.

## v7.2.3

_March 17, 2021_

### Improvements

#### Masked environment variables

In the [Environments area](../development_suite/set-up-infrastructure/env-var) variables are now hidden by default. You can show them by clicking the button "Show variables value" in the card top-right corner.

Additionally, the UI of the page has been revised:

- The "Add new environment variable" button has been moved to the top-right corner
- The Edit and Delete commands have been replaced by the dedicated icons

![Masked Environment Variables](img/environment-variables.jpg)

#### Public Variables drawer

[Public Variables](../development_suite/api-console/api-design/public_variables) are now editable using the drawer UI with textareas to make it easier to edit large variables. Inline editing is still possible.

![Public variables editing with drawer](img/public-variables-editing-with-drawer.gif)

#### Delete System of Record

[Systems of Record](../fast_data/create_projection#delete-a-system-of-record) can now be deleted when they have no projections. To do that, just click on the Delete button at the bottom-right corner of the System of Record detail page. If you delete **all the Systems of Records**, the default [Projections Changes](../fast_data/create_projection#projections-changes) collection will be deleted as well, because it is no more useful.  

### Bug Fix

#### MLP backslash escaping

Fixed a bug affecting Mia-Platform pipelines that caused Environment variables with backslash character to be improperly escaped. To take advantage of the fix you need to use Mia-Platform pipelines v3.  
Contact your Mia-Platform technical referent to update your pipelines.

#### API Portal with proper log parser

[API Portal](../development_suite/api-portal/api-documentations) is now configured to use proper `mia-nginx` log parser.

#### Backoffice endpoint permission conversion

It is now possible to set the [backoffice endpoint permissions](../development_suite/api-console/api-design/endpoints#manage-the-security-of-your-endpoints) to `0` avoiding the unintentional malfunctioning of the _Authorization Service_.
The preferred way to write the logical expression in the endpoint permission is still to use `true` or `false` instead of `1` or `0`.  

#### Validation on Fast Data Projections' name

Validation on [Fast Data Projections](../fast_data/create_projection#create-a-projection)' name was missing for projections belonging to different [Systems of Record](../fast_data/create_projection#create-a-system-of-record). The creation of Fast Data Projections in different Systems of Record with the same name is now forbidden.

### UI Improvements

#### Browser tab title revision

The browser tab title now shows the Console section and the project you are working on to speed up navigation across multiple tabs.  

![New browser tab title](img/Tabs.jpg)

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.5.2`.

## v7.2.2

_March 10, 2021_

### New Features

#### Real Time updater Request and Limit

After the initialization of the Real Time Updater, the Request and Limit parameters are set according to the following default values:

- Memory: 80Mi for Request and 250Mi for Limit
- CPU: 20 millicpu for Request and 100 millicpu for Limit

:::info
At the moment it is not possible to change these values through Mia-Platform Console. These default values are only modifiable for on-premise installations through the new helm chart configuration values.
:::

Check out Mia-Platform [documentation](../fast_data/create_projection#real-time-updater-cpu-and-memory-requests-and-limits) to know more.

#### Real Time updater Replicas

You can now set the number of replicas of the Real Time Updater using the Advanced section of the Design Area. Follow the [documentation](../fast_data/advanced#real-time-updater-replicas) for further details.

#### Definition of type property in Schema editor

When configuring the schema of a field of type object in the MongoDB CRUD page, the Schema Editor (accessible by clicking the row edit button) accepts JSON Schemas containing the `type` property. However the only accepted value for it is `object`. Check the Schema Editor [documentation](../development_suite/api-console/api-design/crud_advanced#create-nested-cruds) to know more.

### Library updates

Open source libraries [custom plugin lib](https://github.com/mia-platform/custom-plugin-lib), [lc39](https://github.com/mia-platform/lc39) and [glogger](https://github.com/mia-platform/glogger) received a minor update.
The new versions feature an improved logging format for `time` property that now shows timestamps with millisecond precision.

- `lc39` new version is `v3.3.0`
- `glogger` new version is `v2.1.1`
- `custom plugin lib` new version is `v2.3.0`

### Core services

The following services have been updated to use the latest versions of lc39, glogger and custom plugin lib:

- Client Credentials
- Authentication Service
- Authorization Service
- Auth0 Client
- IP Geolocation Service
- CMS Backend
- CRUD Service
- Microservice Gateway
- Session Manager
- Swagger Aggregator
- v1Adapter
- Flow Manager
- User Service
- Timer Service
- MongoDB Reader
- The following templates and examples of Mia-Platform [Marketplace](../marketplace/overview_marketplace.md):

  - Node.js Custom Plugin with Mongo Example
  - Slack Webhook Example
  - Node.js Template
  - Node.js HelloWorld Microservice Example

### Bug Fix

#### Environment variable creation

In a microservice, it is now possible to create a new environment variable without the definition of its value. Also, it is possible to empty its value through inline edit. Check out Mia-Platform [documentation](../development_suite/api-console/api-design/services#environment-variable-configuration) to know how to configure Microservices environment variables.

#### Geo indexes support for projection

The possibility to create an index of type `geo` in the [Projections](../fast_data/create_projection#create-a-projection) has been removed, since such type is not supported.

#### Gitlab Deploy token

Fixed a bug affecting the generation of the Gitlab token that enables the Deploy. The bug could potentially cause the inability to Deploy in projects involving a high number of users performing numerous deployments.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.5.0`.

## v7.2.1

_March 04, 2021_

### Bug Fix

#### System of record creation

The creation of a new system of record in the [Projection](../fast_data/create_projection.md) page caused the inability to commit, due to an incorrect configuration of the system.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.4.2`.

## v7.2.0

_March 03, 2021_

### New Features

#### Public Variables

The design section presents a new feature: **Public Variables**, a page where you can easily create branch level configurations with different values for each environment.  

![public-variables](img/public-variables.png)

You can have further details regarding this section on the public variables [documentation](../development_suite/api-console/api-design/public_variables.md) page.  
On Premise installations require specific changes to the deploy pipelines, please contact your technical referent to be supported for activation.

#### Real-time-updater authentication mechanism

You can now specify a custom Kafka authentication mechanism by supplying the `kafka.saslMechanism` property to your system advanced configuration in the console, check out the [documentation](../fast_data/advanced#kafka-configuration) for further information.

#### Fast Data CDC Events Management

The support for different format of Kafka messages has been implemented. You can now choose which format of Kafka message you expect to have for each system. If the format you need is not supported yet, you can create your own Kafka message adapter. Check out the [documentation](../fast_data/create_projection.md#kafka-messages-format) for configuration information.

#### Generate projection fields from data sample

After the creation of a projection, you can configure its fields by importing them from a JSON or a CSV. Check the [documentation](../fast_data/create_projection.md#generate-projection-fields-from-data-sample) to learn how to use the feature.

### Bug Fix

#### Cross Project Proxy

Fixed bugs regarding the configuration of proxies of Cross Project type:

- The creation of a cross-project proxy targeting the project itself was not possible when trying to save the configuration
- The edit of the namespace caused a wrong update of the port
- When using the default namespace at creation, the value was not correctly saved.

#### Duplicated Git repository owners

For certain projects, GitLab groups were being shown twice when selecting the Git repository owner during microservice creation; the issue has been resolved.

#### Disabled commit at index creation

During the index creation, commits were disabled if no index field was specified. Indexes now require to specify at least the first field before being created.

#### Secret fields validation for environment variables

Added missing validation on secret name and secret key during the creation and edit of environment variables from secret.
These two patterns follow [Kubernetes naming convention for secrets](https://kubernetes.io/docs/concepts/configuration/secret/#overview-of-secrets).  

### Breaking Changes

#### Fast Data virtual delete

Now the Real-Time updater of the Fast Data make always virtual delete of the projections instead of real delete. Check out the [documentation](../fast_data/create_projection#projection-fields).

### UI Improvements

- You can now use tags to organize and search your MongoDB CRUD collections.
- The pop-over warning at microservice creation has been revised.
- Added specification of unit of measure for TTL index Expire property, since it is expressed in _seconds_.
- Security Management infobox has been dismissed with a direct link to the related Mia-Platform documentation page.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.4.0`.
