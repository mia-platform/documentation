---
id: v10.5.1
title: Version 10.5.1 Release Notes
sidebar_label: v10.5.1
image: "img/release-note-link-preview.png"
---

_March 02, 2023_

## Console

### New Features

#### ImagePullSecrets configured at Company and Project level 

Custom ImagePullSecrets can now be defined and configured for a specific Company and Project: this means that also PaaS users can now configure custom private image registries. Whenever a new project is created, these providers will be cloned from the company to be available on the project as well.

#### New permissions for create, edit and delete a project

A new set of permissions has been added to the Super User in order to better manage the whole lifecycle of a project. The newly introduced permissions are:

* `console.root.project.create`: allows the Super User to create any project
* `console.root.project.details.update`: allows the Super User to edit any project
* `console.root.project.delete`: allows the Super User to delete any project 

### Improvements

#### Mount Path preserve configuration 

Users who can add new elements to the Marketplace now have the possibility to configure the option "Preserve files and directories already existing in the Runtime Mount Path directory" already when creating the resource.

For more information, visit the documentation page to Add a new element to the Marketplace.

#### Response policy name in the Manual Routes table

Inside the Authorization section, now the "Manual Routes" table clearly shows the name of the Response policy. Furthermore, if a row filter on request has been set, it is now visible with a specific icon next to the Request policy name.

### Bug Fix

This version addressed a few bugs, here is a comprehensive list:

* We fixed a bug that forced saving to another branch if you saved after performing the merge of configurations within the same branch
* A bug introduced in the Console version 10.4.0 that prevented the correct visibility of the Debug section has been fixed

## Fast Data

### New Features

#### Bucket Storage Support (BSS)

We announce the release of the Bucket Storage Support New Feature! Do you need to manage data with different temperatures? You can now extend your Fast Data solution by adding the possibility to store raw data in a Bucket, re-ingest them in the system whenever needed and keep those data clean and organized. This solution requires 3 different plugins that can be found in Mia-Platform Marketplace. Check out the [official documentation](/docs/fast_data/bucket_storage_support/overview.md).
Buckets supported: Google Cloud Buckets and S3-compatible Buckets.

#### Single View Trigger Generator

:::info
This feature is still in BETA, and it is under active development. Pay attention using this feature.
:::

We announce the release of the new Single View Trigger Generator plugin. This plugin will replace the old Single View Trigger, which has been deprecated. This new plugin is a re-engineering of the old Single View Trigger and it will let you implement a full event-driven architecture for your Fast Data. Check out the [official documentation](/docs/fast_data/single_view_trigger_generator.md).

### Improvements

### Bug Fix

## Marketplace

### Marketplace New Components

### Marketplace Updates

## Backoffice - 1.3.5

### New Features

#### New component `bk-dropdown`
New component [`bk-dropdown`](/business_suite/backoffice/components/buttons.md#bk-dropdown) is available.

#### `bk-form-modal` with `extraEndpoint` injects `triggeredBy`
`bk-form-modal` with `extraEndpoint` property injects a `triggeredBy` key equal to `bk-form-modal-extra-endpoint` into `success`/`error` events.

#### `bk-simple-list` supports `height` property
`bk-simple-list` supports `height` property, controlling max-height of the list body

#### New Handlebars helper `nFormat`
New Handlebars helper `nFormat` allows to format fields of type `number` and format `currency`, specifying number of decimal places, decimal separator, group separator.

#### New component `bk-notification-center`
New component [`bk-notification-center`](/business_suite/backoffice/components/misc.md#bk-notification-center) is available.

#### Persisten filters are available
`bk-filters-manager` component allows persistent filters, which are registered into `localeStorage` and automatically applied.

### Bug Fix

#### Editor does not use custom tags
Output of fields with format `editor` do not use custom `quill` classes in form components. Refer to [this issue](https://github.com/zenoamaro/react-quill/issues/553) for further details


## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version X.X.X`.

