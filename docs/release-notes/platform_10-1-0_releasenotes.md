---
id: v10.1.0
title: Version 10.1.0 Release Notes
sidebar_label: v10.1.0
image: "img/release-note-link-preview.png"
---

_November 10th, 2022_

## Console

### New Features

#### Merge editor Revert button

Inside the Merge editor modal, the Revert button makes it possible to discard all changes applied to the current section since the start of the Merge process. If you think you made some mistakes in the section you are currently working on and want to start over, the button allows you to do so without having to cancel the entire Merge process. Find out more [here](../development_suite/api-console/api-design/merge_collaboration).

#### New permission for creating and deleting companies

A new set of permissions has been added to protect company creation and deletion; these permissions are setting the ground for administrative capabilities across the whole Console installation. You can find more info in the [documentation page](../development_suite/console-levels-and-permission-management), but make sure to update your Console administrators users by removing the `create_company` group and granting them the new permissions by creating a specific binding. The newly introduced permissions are:

* `console.root.company.create`: allows the user to create any Company (a Company Owner role is granted to the user on the newly created Company)
* `console.root.company.delete`: allows the user to delete any Company
* `console.root.view`: allows the user to view all the Companies even without a binding on it

#### Partial Indexes configurable from Console in MongoDB CRUD section

You can now configure the Partial Indexes of a CRUD Collection from the Console. Find out more [here](../development_suite/api-console/api-design/crud_advanced).

### Improvements

#### Reorganization of detail and settings on Endpoints section

The information regarding specific settings on individual endpoints has been reorganized into handy tabs within the card. Find out more [here](../development_suite/api-console/api-design/endpoints#endpoint-settings).

#### Branch selection modal

From the branch selection modal you can now open a branch or tag in a new tab by using the shortcut cmd/ctrl + click.

### Bug Fix

#### Branch selection modal

When opening a project for the first time after the login, if a new branch is created from the branch selection modal, the modal now closes correctly and the user is redirected to the Design section of the new branch.

#### Saving invalid configuration to a new branch

If you try to create a new branch starting from an invalid configuration, an error message is displayed and the branch is not created.

#### Projects with providers from other companies

Accessing a project using a provider not associated with your company is no longer possible.

#### Permissions on the Environment section

A bug that made Project Administrators unable to create a new environment has been fixed.

## Fast Data

### Breaking Changes

#### Before and after fields are not included by default

A new environment variable called `ADD_BEFORE_AFTER_CONTENT` must be set to `true` to include `before` and `after` data in `sv-update` messages in the Single View Creator.

#### Kafka Message sv-update changed format

Changed [`sv-update` kafka message format](../../docs/fast_data/inputs_and_outputs#single-view-update) sent from the Single View Creator.

### New Features

#### Projections and Single Views in the MongoDB Views starting collection

You can now choose Projections and Single Views as starting collection when creating/editing a MongoDB View.

#### Partial Indexes configurable from Console for Projections and Single Views fields

You can now configure the Partial Indexes of a Single View or a Projection from the Console. 

#### Kafka Message Adapter configurable from Fast Data section

You can now configure the Kafka Message Adapter of your Real Time Updater by going to the System of Records detail page and clicking on the new tab `Real Time Updater`. Moreover, you can also specify which Kafka Message Adapter you would like to use upon creation of a new System of Records.

#### Bulk delete action in Projections

Now you can delete multiple Projections at once from the System of Records detail page.

#### Single View Creator doesn't read topic from the beggining by default

A new environment variable has been added (`READ_TOPIC_FROM_BEGINNING`) in the Single View creator to decide if to start reading topics from the beginning when starting the service, with `false` as a default value. This makes it possible to skip a malformed message when the service restarts, instead of crash-looping due to not being able to process the message.

#### Support for Single View Patch (sv-patch)

Support for Single View Patch, in order to perform custom patch actions on the Mongo document without having to re-aggregate the entire single view. This avoids the strategy execution and sends the `pr-update` message directly to the Single View Creator.

#### Support for Projection primary keys update

The Real Time Updater now supports the update of the projections' primary keys when using the Golden Gate message adapter.

### Improvements

#### Removed manual option in the SoR

From now on, each new System of Records created from the Console will be low code.

#### Added header in `pr-update` message

The `pr-update` messages have now the `messageSchema` header to explicitly indicate they are `pr-update` messages and specify their format version.

#### `sv-update` messages cleanup

The fields `documentId`, `before` and `after` will not be present in `sv-update` messages when their values are null.

### Bug Fix

#### CA certificate is now used when PC come from Kafka

When the `PROJECTIONS_CHANGES_SOURCE` environment variable is set to `KAFKA`, the CA cert defined in the `CA_CERT_PATH_SET` environment variable is now used by the Kafka consumer.

#### Fixed metric in the Single View Creator

The `svc_projection_to_single_view_time` metric in the Single View Creator now retrieves starting time correctly.

#### Single View Creator sends sv-update even when KAFKA_SVC_EVENTS_TOPIC is not defined

The Single View Creator now sends `sv-update` messages even when `KAFKA_SVC_EVENTS_TOPIC` is not defined.

#### Missing field `__internal__kafkaInfo` in record won't restart the RTU

Now if a record doesn't have the `__internal__kafkaInfo` field, the Real Time Updater won't throw an error and restart the service, but it will just skip the operation.

## Marketplace

### New Marketplace Components

#### Chat Service Frontend v1.0.0

This plugin uses the Stream React Library to provide a custom micro-frontend to chat with users registered on a target application.

#### Chat Service Backend v1.0.0

This plugin act as a proxy between your project's microservices and the [Stream Chat APIs](https://getstream.io/chat/docs/rest/).

### Updated Marketplace Components

#### CRUD Service v6.0.2

Added a new environment variable `ALLOW_DISK_USE_IN_QUERIES` to set `allowDiskUse` option in MongoDB queries, useful when working with MongoDB Views (works with MongoDB >= 4.4).

#### Teleconsultation service Backend v1.2.1

Bug fix on the immutable period management.

#### Mia FHIR Server v1.0.0

First stable major version released.

#### Mia FHIR Adapter v1.0.0

First stable major version released.

## Backoffice - 1.1.2

### New Features

#### `bk-button` enables bulk actions

Component `bk-button` can be configured to perform bulk actions.

#### New component available: `bk-expanded-filter`

Component `bk-expanded-filter` can be added to page configuration, to allow users to easily apply multiple filters.

#### `bk-table` accepts nested object as data source

Component `bk-table` allows to use nested objects as data source by specifying a nesting path.

### Bug Fix

#### `bk-table` correctly renders nested objects

Component `bk-table` correctly indexes rows if `primaryKey` property is not defined (fixes rendering errors with nested objects).

#### Drawers follow Antd standard styling

Header in drawer components is aligned with Antd design systems styling.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 8.1.5`.
