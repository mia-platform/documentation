---
id: v8.7.0
title: Version 8.7.0 Release Notes
sidebar_label: v8.7.0
image: "img/release-note-link-preview.png"
---

_March 3, 2022_

## Fast Data

### New Features

#### Import Fast Data Projections from DDL

The creation of multiple Projections in a System can be a tedious and error prone task, this is why we introduced a new functionality that allows you to import Projections directly from a DDL file, which you can easily produce directly from your DBMS. More information on how to use this feature can be found [here](/docs/fast_data/create_projection#import-multiple-projections-from-a-ddl-file)

## Console

### New features

#### Events and describe of each pod

Two precious new features have been introduced in the Runtime area: from today, in the Pod details, you can find the Pod Events and the Pod Describe (as JSON).

#### Events of the namespace

A new section has been introduced in the Runtime area that shows all the events of the namespace in a practical and intuitive way.

#### Microservices replicas now accept environment variable interpolation

In Microservices section, it is now possible to set the Static replicas field by interpolating an environment variable using `{{VAR}}` syntax.

### Bug Fix

#### Test output correctly cleaned on exit

Solved a problem that was keeping older logs from policy testing in RBAC section.

#### With HPA enabled, replicas on deploy are not downgraded to 1

For services with HPA enabled replicas won't be automatically set to 1 if no static replicas value is provided.

#### Safari issues on RBAC policy tab

Fixed some CSS issues affecting the Safari version in RBAC section

#### Headless CMS of the console

A bug in the file upload section of the Console CMS has been fixed.

### Breaking Changes

#### Realtime Updater v5.0.0

Due to security updates, when you create a new System of Records the Realtime Updater that will be created will be the v5.0.0. This version brings some breaking changes:

- update mongodb package from ^3.6.0 to ^4.3.1. Please, refer to official mongodb changelog to get more information.
- the `kafkaInfo` field has been renamed to `__internal__kafkaInfo` in Kafka Projection Changes.

Already existing Realtime Updater are not going to be afflicted in any way by this breaking change until you update their docker image.

### Improvements

#### Service changes calculation improved on deploy

Now, the contents of the subPaths of volumes mounted inside service, will be considered to comunicate if service will be released in the Deploy Compare table.

## Marketplace

### New Marketplace components

#### Added new RBAC service plugin in preview

The new RBAC service plugin has been added in the marketplace in preview for all the console users

### Security update for the following microservices

- api-portal: v1.15.1
- dev-portal-marketplace-backend: v0.1.1
- dev-portal-marketplace: v0.1.1
- microlc-docusaurus-adapter: v0.1.1
- micro-lc-rapidoc: v0.1.1
- microlc-redoc: v0.1.1

## Backoffice

### New features

#### Dependent lookup/multilookup fields

It is now possible to control how the options of lookup/multilookup fields are fetched parametrically to other fields in the form. This can be achieved with the field `lookupDeps` inside `lookupOptions` in the data schema. For more information, refer to the [documentation](https://git.tools.mia-platform.eu/platform/backoffice/headless-cms/-/blob/master/packages/bk-web-components/docs/layout.md#dependent-lookups)

#### Handle unresolved lookups

It is now possible to specify a value to be displayed for unresolved lookup values. This can be achieved setting the option `customMessageOnAbsentLookup` in the data schema.

### Improvements

#### Control trailing slash in lookup queries

New option `lookupAddTrailingSlash` has been added to `lookupOptions` in the data schema, controlling whether or not a trailing `/` is added to the endpoint for the lookup data query. Defaults to true. For more information, refer to the [documentation](https://git.tools.mia-platform.eu/platform/backoffice/headless-cms/-/blob/master/packages/bk-web-components/docs/layout.md#lookups).

#### Cache in lookup client

New option `allowLiveSearchCache` has been added to [bk-crud-lookup-client](https://git.tools.mia-platform.eu/platform/backoffice/headless-cms/-/blob/master/packages/bk-web-components/docs/components/clients.md#lookup-client)., controlling whether or not to allow caching queries for live-search operations. The option default is `false`.

#### Multilookups in-place visualization

It is now possible to display the content of multilookup fields in-place, joining their values and printing them as a string. To do so, the option `joinDelimiter` should be specified inside `visualizationOptions` for the multilookup field in the data schema. For more information, refer to the [documentation](https://git.tools.mia-platform.eu/platform/backoffice/headless-cms/-/blob/master/packages/bk-web-components/docs/layout.md#multilookup-styling).

### Bug Fix

#### Solved live-search in filters

Solved problem that prevented filter form from resolving lookups that were selected through live-search once re-opened.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.11.14`.
