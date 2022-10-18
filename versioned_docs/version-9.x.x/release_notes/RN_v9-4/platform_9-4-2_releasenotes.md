---
id: v9.4.2
title: Version 9.4.2 Release Notes
sidebar_label: v9.4.2
image: "img/release-note-link-preview.png"
---

_July 21st, 2022_

## Console

### Security Fix

A potential leak of the Provider access tokens associated with a specific Project has been fixed; prior this version it was possible for a malicious actor to exfiltrate the Provider access token by forging a specific API request. Such API has been properly protected to prevent this from happening.
To obtain the token, the malicious actor must be authenticated and must have access to the project.

:::warning
Anyone using Console v9 or above is affected by this vulnerability so update as soon as possible
:::

### Bug Fix

#### Marketplace filters cleared correctly

Fixed a bug that prevented the filters to be cleared correctly when clicking on the marketplace button.

#### Microservice Annotations and Labels description

Fixed a bug that prevented to correctly edit the description of microservice annotation and labels.

### Improvements

#### CRUD service removal error message

When CRUD service is removed while having type CRUD or MongoView endpoints a more self-explanatory error is shown when saving the configuration.

#### Open project on the branch you used most recently

When opening any project that you have previously opened you will be automatically redirected to the last branch you used.

#### Marketplace filters automatically applied based on console section

Marketplace items are now automatically filtered based on the console section in which you currently are.

## Backoffice - 1.0.6

### New features

#### Support for file arrays

New format `file` is supported for `array` fields: multiple files are visualized in `bk-table` through a pop-over, it is possible to update multiple files at the same time through forms.

### Improvements

#### `bk-table` allows to download / preview files

`bk-table` property `openFileInViewerRegex` was updated to also allowing to specify `download` or `view` mode when clicking file cells

#### Fields shadow color can be controlled

In forms, selected fields box-shadow color can be controlled by global CSS variables

#### New property `appendTrailingSlash` on `bk-crud-client`

A new property `appendTrailingSlash` was added to `bk-crud-client`, controlling whether or not to add a trailing slash `/` to the endpoint when performing HTTP calls

#### Updated Files Service interface on `bk-file-client`

Files Service interface on `bk-file-client` was updated, allowing for download with actual filename in Content-Disposition header field

### Bug Fix

#### Fixed radius in multilookup

Fixed multilookup field not fully containing all selected entries in forms

#### Fixed duplicate filters

Inputting the same filter multiple times now resolves in a single filter

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 7.2.4`.
