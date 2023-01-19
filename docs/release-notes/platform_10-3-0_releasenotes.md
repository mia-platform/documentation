---
id: v10.3.0
title: Version 10.3.0 Release Notes
sidebar_label: v10.3.0
image: "img/release-note-link-preview.png"
---

_January 19, 2023_

## Console

### New Features

#### Console Super User

From CMS, it is now possible to assign the Console Super User role, designed exclusively for backoffice administration purposes.
When assigned to a user, this role implies full visibility and management of all resources in the CMS.

#### User Companies section

From the new section `Your Companies`, users can now view the list of Companies they have access to, and decide to autonomously leave them.
You can find this section in the dropdown menu that appears when hovering over your profile picture.

#### Delete source branch after merge from another branch

In the `Merge from another branch` process, after merging the current configuration with a different configuration from another branch, users can now choose to delete the source branch.

#### Config Shepherd Open Source

This Mia-Platform component has finally been migrated to GitHub and is now open source!
To discover its functionalities, visit [Config Shepherd](https://github.com/mia-platform/config-shepherd#mia-config-shepherd) and contribute with new development proposals.

### Improvements

#### Authorization section

In the Design Area, the old `RBAC` section has been renamed in `Authorization` section.
In addition, the related documentation has also been updated, check it out [here](/development_suite/api-console/api-design/rbac.md).

#### Icons of Cluster Vendor and Runtime Service

In the cluster section of the company overview area, the respective icons of the chosen vendor and runtime services have been added to the table.
In addition, the respective icons have also been included in the detail of each cluster.
For more information, [go to the documentation](/development_suite/clusters-management/clusters-overview-setup.md).

#### Support of binary files at microservice creation

In service creation, the support for all binary files has been implemented.

#### Syntax highlighting extended support on merge modal

The support of syntax highlighting on merge modal has been extended to .yml and .js files.

#### Cronjob schedule field interpolation

Users can now set the CronJob schedule field by interpolating an environment variable.

#### Links to the Mia-Platform Help Center and Community

The links to the Mia-Platform Help Center have been better specified in the dropdown menu accessible from the Launchbar. Moreover, among those menu options, it has been introduced also the link to the Mia-Platform Community on GitHub.

### Bug Fix

#### Cmd/Ctrl+k navigation improvements

- A bug implying an improper loading of the same Console section though the Cmd+k navigation from a project to another has been solved.

- Through Cmd+k navigation, if users want to access a specific section of the Design Area, after the branch selection, they are now correctly redirected to that section, instead of being redirected to the Endpoints section.

#### Navigation from Metrics Homepage to Runtime Area

A bug causing a redirect to the first project environment when clicking on any runtime card into project Metrics Home Page has been solved.

#### Visualize section proper loading

A bug that prevented Visualize section from loading correctly if a branch included a slash in its name has been solved.

## Fast Data

### New Features

#### Real Time Updater v7.2.0 now supports OAuthbearer Kafka Authentication

Added the support to [**OAuthbearer** Kafka authentication](https://docs.confluent.io/platform/current/kafka/authentication_sasl/authentication_sasl_oauth.html) in Real-Time Updater `v7.2.0`.

### Improvements

#### Real Time Updater v7.2.0 better manages the strategies

Another _strategy for handling record processing errors_ was added. The default Real-Time Updater behavior was to restart itself due to the error, so that it could to re-process the failing record.
  Differently, the newer strategy stops the service reading from the topic containing the failed record, while it instead continues reading from all the other configured topics.  
  This newer strategy can be enabled setting environment variable `PAUSE_TOPIC_CONSUMPTION_ON_ERROR` to `true`.

:::note
When enabling such feature, it is advised to set an alarm on _consumer group lag accumulation_ to get notified when an error of this type occurs and near real-time property is lost for entailed topic. In this manner it is possible to timely react to the situation.
:::

#### Updated Kafka message adapter `Basic` label to `DB2`

The message adapter label is now reflecting the CDC that generates this message format (IBM InfoSphere Data Replication for DB2).

### Bug Fix

#### Fixed scroll of Edit SVC Configurations Modal inside Single Views section

The Edit SVC Configuration Modal is now correctly scrollable.

#### Fixed bug on MongoDB CRUD section by removing the `usePartialFilter` property from indexes when its value is false

The older CRUD service versions (before `v6.1.0`), when using partial indexes, are not crushing anymore after a wrong configuration of the partial indexes.

#### Real Time Updater v7.2.0 fixes the management of Dates in Primary keys

The dates in primary keys are now correctly handled.

#### Real Time Updater v7.2.0 fixes improper behavior of Kafka Projections Changes

Kafka Projections Changes are now correctly disabled when the variable `PROJECTIONS_CHANGES_ENABLED` is set to `false`.

#### Real Time Updater v7.2.0 fixes improper behavior of `upsert` mode

When the Real-Time Updater is configured in `upsert` mode, `DELETE` operations of records whose `__internal_counter` was lower than the one stored on the database resulted into `INSERT` operations with all the projections' field set to `null`. That situation could lead the Real-Time Updater to continuosly restard due to a _duplicate key error_. Now those `DELETE` operations are handled correctly.

## Marketplace

:::info
If you want to contribute with new components to our Marketplace, from Mia-Platform Community a proper template issue has been set up for you! For more information, please visit [here](https://github.com/mia-platform/community#mia-platform-marketplace).
:::

### New Marketplace Components

#### Pharma E-Commerce Backend - v1.0.0

The Pharma Ecommerce Backend is a plugin that provides APIs that can be used to create your own pharmaceutical e-commerce.

#### Therapy and Monitoring Manager - v0.1.0

The Therapy and Monitoring Manager (TMM) is a service that enables health care professionals to manage patients therapies and monitor patients health conditions, adherence and compliance to therapy.

### Marketplace Updates

#### CRUD Service - v6.2.0

The latest version of CRUD Service plugin introduces the support to MongoDB v6. In addition, it has been added the possibility
to use `$dateToString` operator in query paramerer `_rawp`, which manages projection operations,
while the `type` property is not required anymore in the MongoDB views configuration.  
Finally, a set of different bugfixes have been carried out to improve service stability.
More details can be found in the plugin [CHANGELOG](/runtime_suite/crud-service/changelog.md).

#### Single View Creator Plugin - v5.6.4

The latest version of Single View Creator brings a set of new bug fixes and improvements to the service.
See the [CHANGELOG](/runtime_suite/single-view-creator/changelog.md) for more details on the bugfixes.

#### Mia FHIR Server - v1.1.0

Added the capability to set the search result cache TTL through an environment variable.

#### User Manager Service - v1.3.0

Added the boolean `postponeAuthUserCreation` query parameter in the POST `/users` endpoint
to create a user only in the users' CRUD collection.
Added the `POST /users/register` endpoint that allows creating an existing CRUD user in the Auth Provider.

#### Appointment Manager - v2.0.0

The new Appointment Manager version introduces revised availabilities and improved endpoints,
along with the new exception concept.
See the [CHANGELOG](/runtime_suite/appointment-manager/changelog.md) for more details about the new features.

#### Form Service BE - v1.5.0

Added autosave feature (partially filled forms can be saved as drafts).

#### Form Service FE - v1.5.1

Added synchronous stylesheets loading.
Added form drafts to the frontend.

## Backoffice - 1.2.2

### Bug Fix

#### Fixed internationalization

Form components and `bk-calendar` component correctly support internatinalized texts.

## Backoffice - 1.2.3

### New Features

#### `bk-crud-client` allows to not reset page

`bk-crud-client` can be configured to stay on current page after successful CRUD operation.

#### `bk-calendar` default filters support custom names

`bk-calendar` allows to specify the name of default date filters.

### Bug Fix

#### Form supports file pickers

Form components support internationalized file picker fields.

## Backoffice - 1.3.0

### New Features

#### `bk-gallery` component

New component `bk-gallery` is available.

## Backoffice - 1.3.1

### New Features

#### List supports lookups

`bk-simple-list` component supports lookup values.

#### Form card supports header

`bk-form-card` component can be configured to render a custom card header.

## Backoffice - 1.3.2

### New Features

#### Filter operator `notBetween`

`notBetween` operator is available for filters on date / date-time / time fields.

#### Array of dates

Form components, `bk-table` and `bk-filter-drawer` components support arrays of date / date-time / time fields.

#### Hidden filters can be updated

filters on fields having `filtersOptions.hidden` set to true can be edited through events - `bk-calendar` works after setting `filtersOptions.hidden` to true for `startDate`, `endDate` 
fields.

### Bug Fix

#### `$today` filters correctly resolved

`$today` keyword in filters is correctly resolved based on the selected operator.

#### Date-time filters do not reset time

Filters on date-time fields do not automatically reset time.

#### Gallery component style

`bk-gallery` has updated style.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 8.2.13`.
