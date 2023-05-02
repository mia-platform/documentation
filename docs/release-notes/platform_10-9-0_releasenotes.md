---
id: v10.9.0
title: Version 10.9.0 Release Notes
sidebar_label: v10.9.0
image: "img/release-note-link-preview.png"
---

_May 04, 2023_

## Console

### New Features

#### Managing Service Accounts at Console level

It is possible to create [Company-independent service accounts](TO-DO link) in case you need to give them privileges to perform [root-level operations](/development_suite/identity-and-access-management/console-levels-and-permission-management.md).

:::info
Only Console Super Users can [add](TO-DO link) or [delete](TO-DO link) Company independent service accounts, manageable exclusively at back-office level.
:::

### Bug Fix

This version addressed a few bugs, here is a comprehensive list:

* 

## Fast Data

### New Features

### Improvements

### Breaking Changes

#### Revamped Single View Trigger Generator
We're thrilled to announce the release of v.2.0.1 of the Single View Trigger Generator, a vital component of Fast Data. In this release, we've given the component a complete overhaul to optimize its performance and streamline its functionality.

However, as with any major update, there are a few breaking changes to be aware of. We've renamed the `STRATEGIES_FOLDER` environment variable to `MANUAL_STRATEGIES_FOLDER` and the `CUSTOM_FUNCTIONS_FOLDER` environment variable to `TRIGGER_CUSTOM_FUNCTIONS_FOLDER`. We've also removed the `USE_AUTOMATIC` variable. Additionally, the `SINGLE_VIEW_NAME`,` ER_SCHEMA_FOLDER`, and `PROJECTION_CHANGES_SCHEMA_FOLDER` variables are now required.

In addition to these changes, we've also upgraded some service dependencies, including `@mia-platform-internal/fast-data-automation-lib@v3` and `mongodb@v5`. We've also simplified the configuration loading process and refactored the core logic and service dependencies to improve performance and remove the need for `fastify-pluging`.

Check out the [changelog](/runtime-suite/single-view-trigger-generator/changelog.md) for a full list of changes!

### Bug Fix

#### Fix for Mongo operators in aggregations in Single View Creator

We have resolved a bug that prevented Mongo operators from being properly interpolated in aggregations executed by the Single View Creator. This issue has been addressed in version 5.6.6 of the Single View Creator. With this fix, users can now rely on the full functionality of Mongo operators in their aggregations. For more info check the [changelog](/runtime-suite/single-view-creator/changelog.md).

## Marketplace

### New Marketplace Components

### Marketplace Updates

## Backoffice - 1.3.9

### Bug Fix

### New Features

#### `bk-crud-client` allows to disable url writing

New property `reflectToUrl` allows to control whether `bk-crud-client` reflects its state to the URL with a `window.history.pushState`

#### New component `bk-layout-swap`

New component [`bk-layout-swap`](/business_suite/backoffice/components/misc.md#bk-layout-swap) is available. It performs a layout change listening to `layout/change` event. The payload of the event is the layout rendered by the component. It is bundled separately.

### Bug Fix

#### Form components resolve lookups on creation

Form components correctly resolve lookups in initial values from `add-new` event payload

## How to update your Console

For on-premise Console installations, please contact your Mia-Platform referent to know how to use the `Helm chart version X.X.X`.
