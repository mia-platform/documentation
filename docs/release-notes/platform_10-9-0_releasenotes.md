---
id: v10.9.0
title: Version 10.9.0 Release Notes
sidebar_label: v10.9.0
image: "img/release-note-link-preview.png"
---

_May 04, 2023_

## Console

### New Features

#### Selection of default providers for the Company's projects

Within the Providers section in the Company Overview area it is now possible to find a new feature that allows the user with Company Owner permissions to be able to set the Default providers that will use all the new projects created on the respective company.

![Default Providers Selection](./img/v10.9_defaultProviders.png)

This will enhance the governance for every Company Owner for company's projects and give better control over the management of company tools.
The provider for each capability (Git Provider, CI/CD and Secret Manager) can always be changed in any moment via CMS.

For more information,[go to the documentation](/development_suite/set-up-infrastructure/configure-provider.mdx)

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

The file picker of the DDL modal import now support `.sql` file 

### Improvements

The console automatic aggregation generation now represents one to one relationship configuration as object.

### Breaking Changes

#### Revamped Single View Trigger Generator
We're thrilled to announce the release of v.2.0.1 of the Single View Trigger Generator, one of the Fast Data component. In this release, we've given the component a complete overhaul to optimize its performance and streamline its functionality.

However, as with any major update, there are a few breaking changes to be aware of. We've renamed the `STRATEGIES_FOLDER` environment variable to `MANUAL_STRATEGIES_FOLDER` and the `CUSTOM_FUNCTIONS_FOLDER` environment variable to `TRIGGER_CUSTOM_FUNCTIONS_FOLDER`. We've also removed the `USE_AUTOMATIC` variable. Additionally, the `SINGLE_VIEW_NAME`,` ER_SCHEMA_FOLDER`, and `PROJECTION_CHANGES_SCHEMA_FOLDER` variables are now required. Check out the official documentation (TODO: add link)!

Do not forget to check out the [changelog](/runtime-suite/single-view-trigger-generator/changelog.md) for a full list of changes!

### Bug Fix

This version addressed a few bugs, here is a comprehensive list:

* The Projections and the SoR are now deleted from the No-Code ERSchema if deleted from their console sections
* The Single View Creator is not attachable to only one Single View
* Mongo operators are now properly interpolated in aggregations executed by the Single View Creator. This fix has been addressed in version 5.6.6 of the Single View Creator.

## Marketplace

### New Marketplace Components

### Marketplace Updates

#### CRUD Service - v6.5.1

CRUD Service collection definition has been revised, so that now it possible to configure it through a JSON schema definition.
This new feature for the moment does not supersede the previous collection definition, albeit it is recommended to transition to the latter one.
To tap into this new functionality it is necessary to define a new property in the collections definition, which is `schema`.
This new property expects to receive a JSON schema as representation of the collection data model. Previous property `field` is still accepted, though
it has a lower priority with respect to the newer one.

Furthermore, the following MongoDB operators for `PATCH` action were introduced:

- [`$addToSet`](https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/) (v6.4.0)
- [`$pull`](https://www.mongodb.com/docs/manual/reference/operator/update/pull/) (v6.5.0)

The full [changelog](https://docs.mia-platform.eu/docs/runtime_suite/crud-service/changelog) can be found in the plugin detail page.

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
