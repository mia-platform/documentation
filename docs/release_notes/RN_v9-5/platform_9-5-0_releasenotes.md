---
id: v9.5.0
title: Version 9.5.0 Release Notes
sidebar_label: v9.5.0
image: "img/release-note-link-preview.png"
---

_September 22nd, 2022_

## Console

### New Features

#### Merge of configurations is out!

:::info
This feature is still in BETA, checkout the [official documentation page](/docs/development_suite/api-console/api-design/merge_collaboration) for further information.
:::

At branch level, it is now possible to merge project configurations directly from the Design area of the Console. More specifically, users can now:

- Have visibility if other users have committed new changes to the configuration of the branch they are also working on
- Be aligned to the latest changes remotely committed by starting a merge flow that will allow you to identify diffs between compared configurations and to resolve changes/conflicts
- Align the configurations of two different branches within the same project
- Have visibility of all the configuration changes made locally before committing them

#### Vault as secret manager in Console

It is now possible to configure the Console in order to manage your secreted variables through Vault. For further details take a look at the [official documentation](/docs/development_suite/set-up-infrastructure/env-var-vault).

#### Timeout, Rate limit and Request body size for Endpoints

It is now possible to [set a custom value of Timeout, Rate limit and Request body size](/docs/development_suite/api-console/api-design/endpoints#manage-general-parameters-and-visibility-of-your-endpoints) ​​directly in the detail of each Endpoint configured with the Console.

#### Filtered project templates when creating a project

When creating a project, the available templates are filtered on the basis of the company that the user has previously selected.  

### Bug Fix

#### Maintainers cannot edit dashboards anymore

Fixed a bug that was still allowing maintainers to access the edit dashboard UI even though this feature is only available to Project Administrator and Company Owners.

#### Fixed the automatic selection of the last used branch in the Design Area

In the case in which the last used branch is no more existing, now user entering Design area can correctly see the selection branch modal to choose another existing branch. Moreover, in the case of a refresh in any other Console Area, the last used branch will be correctly loaded when returning to the Design section.

#### Fixed the multi-button bug in RBAC section

A bug that recreates useless copies of a button in the RBAC section has been fixed if refresh the browser after the configuration save.

### Improvements

#### Improved the branch management UI

Now the branch management popover has a revised design that helps users both to better identify the branch configuration status and to allow new useful actions to be performed at the branch level (e.g. starting a merge process, pulling from the last commit).

#### Removed the redirection to Endpoints section after the configuration save

When saving the branch configuration in any section of the Design Area, with the exception for RBAC and Fast Data sections, the browser remains on the same section.
This behavior will also be applied to these two sections on next Console versions.

#### The roles of a user on all resources can be defined during the creation

On Project Admin Portal, when adding a new user, it will be possible to assign user roles on all resources (company, project and environments).

#### Error placeholder in case branch load fails

When loading a branch, a new error placeholder will be displayed if the branch configuration retrieval fails.

#### Improved the validation error message during the endpoint creation

During the creation of an endpoint, the validation error message about the base path field is clearer than the previous regex pattern.

#### Error page for failures in loading project configuration

After the branch choice, if the configuration is not correctly retrieved, now users can see a dedicated error page wherein it is possible to try to reload the configuration, to change branch or to contact the support.

#### New feedback for the delete of components

Messages on the elimination of components within the Design area have been revised with a more detailed design.

## Fast Data

### New Features

#### Sticky tab for Single View Creator configuration modal

Configuration modal of Single View Creator, when opened, appears on the same tab that was selected outside the modal, and its content is now scrollable.

### Bug Fix

#### Fixed renaming custom function in Single View Creator configuration tab

Fixed a bug that could let the user rename a custom function in the Single View Creator config section with an empty string or with a name of an already existing custom function.

#### Fixed full screen editor bug in Single View Creator configuration tab

Fixed a bug in the Single View Creator configuration tab edit modal that, in full screen mode, caused the non-usability of half of the screen.

### Breaking Changes

#### Improved pr-update message

Changed `pr-update` message format produced by the Real Time Updater to [this format](../../fast_data/inputs_and_outputs.md#projection-update).

#### Added new required environment variable for RTU

It has been added the new required environment variable `SYSTEM_OF_RECORDS` for Real Time Updater. Please add the variable if the version of an already existing Real Time Updater is updated to `7.0.0`

### Improvements

#### Allow the users to generate projection fields from JSON

Now the user can generate projection fields from JSON object sample data, not only from Arrays.

#### Added confirmation popover when discarding changes in aggregation tab

Now, when discarding changes in the aggregation tab of the Single View Creator, a popover is shown to confirm or not the cancellation.

## Marketplace

### Updates

#### Proxy Manager v1.5.0

- Added support to dynamic proxy configuration: proxy's configurations are fetched from a CRUD collection.

#### Appointment Manager v1.3.5

- Bug fix for long queries in `POST /availabilities/state` e `DELETE /availabilities`.

#### User Manager Service v1.1.0

- Rönd integration for binding creation.

### Bug Fix

#### Removed useless UX components during the creation of Application and Proxies

The Marketplace does not show the disabled select to filter by microservice type when creating an application or a proxy in the relative Design sections.

## Backoffice - 1.0.9

### New Features

#### Bulk actions

Components `bk-bulk-delete` and `bk-bulk-actions` are now available to perform actions on multiple data at once.

#### Support to `exists` operator in filter

The new operator `exists` can be used to filter for the existence of a particular field. 

### Bug Fix

#### Ampersand visualization in table cells

Special characters will not be HTML encoded in table cells.

#### Date fields filtering

Filters of fields with format `date` using `equal` and `notEqual` operators will now take in account the whole day.

## Backoffice - 1.0.8

### New Features

#### Confirmation on submit

Components `bk-form-drawer` and `bk-form-modal` can be configured to require confirmation before submission through the property `requireConfirm`.

#### Array content popover

Component `bk-table` allows to display a popover on hovering array cells containing the elements of the array.

### Bug Fix

#### Date fields formatting

Fixed `time`/`date`/`date-time` read-only field not being displayed in the correct format in forms.

#### `bk-pdf-viewer` opens under `bk-form-modal`

Fixed `z-index` properties of components `bk-pdf-viewer` and `bk-form-modal`.

#### `bk-button` does not emit events

Fixed `bk-button` not emitting events after changing plugin.

## Backoffice - 1.0.7

### New Features

#### Introduced new components for data export

New components `bk-export-client` and `bk-export-modal` are available, allowing to perform collection export in both CSV and XLSX formats using the `Export Service`.

#### Exposed danger colors variables

Danger colors can be controlled by global CSS variables.

#### Resizable columns

`bk-table` allows to resize columns by dragging their headers when property `resizableColumns` is set to true.

#### Confirmation modal supports dynamic title and content

Title and content of confirmation modals of `bk-table`'s `rowActions` can now use the content of the row via Handlebars.

#### File picker supports file arrays

`bk-file-picker` can be used to update fields of type `array` and format `file`.

#### New `currency` format is available for number fields

Fields with type `number` support `currency` format, automatically formatting the number value according to the browser locale, anc allowing customized value display via `template` in both form and table components.

### Bug Fix

#### Filters on hidden properties are not displayed

`bk-filters-manager` does not display filters with properties having `filtersOptions.hidden` set to true.

#### Extra trailing comma is no longer added in queries

Fixed trailing comma bug in `bk-crud-client` while adding MongoDB query filters in "$and" clauses, which caused the HTTP call to fail.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 8.0.10`.
