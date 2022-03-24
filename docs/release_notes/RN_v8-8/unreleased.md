---
id: v8.8.0
title: Version 8.8.0 Release Notes
sidebar_label: v8.8.0
image: "img/release-note-link-preview.png"
---

_March x, 2022_

## Fast Data

### New Features

#### Fast Data services now support MongoDB v5

Since Single View Creator v3.5.1 and Realtime Updater v5.0.2 is officially supported MongoDB v5
In Single View Creator v3.5.1 adoption, remind to update MongoDB driver to v4.4.1.
Moreover, even MongoDB Query Exporter v1.0.0 belonging to Fast Data Monitoring Application now supports MongoDB v5.

#### Configure Kafka timeout and interval on Realtime Updater

Since v5.2.0 Kafka connection and session timeout, and Heartbeat interval can now be configured on [Realtime Updater](/docs/fast_data/real_time_updater/configuration#environment-variables)

#### Prevent projection overwrite by old message is not enabled by default

Since v5.0.2 the env FORCE_CHECK_ON_OFFSET to prevent projection to be overwritten by old message is now enabled by default.

#### Enrichment of Aggregation Low Code with Expression Logic features

Since v3.6.0 of Single View Creator Low Code, aggregation schema v1.1.0 supports now expression logic to make conditional behaviour on aggregation and dependency to use.    
Aggregation schema is not validated against a JSON Schema to ensure static correctness.

#### Test aggregation Low Code

Your aggregation schema can now be tested thanks to a Repository Template on [Github](https://github.com/mia-platform/fast-data-low-code-test-template)

#### The state of systems and projections are shown
Now, users can visualize the state of a projection or a system.
Moreover, projections that show a warning state are listed at on top to be more visible for user.

## Console

### New features

#### Improved navigation in the Runtime area

The status filter applied to the pod table is now maintained while navigating through the details of individual pods.

#### Dashboards can be opened on a new dedicated tab 

On Dashboard area, user can choose if a dashboard has to be opened on a new tab instead of iframe mode.

#### Endpoints labels of tag are editable

It is possible to edit tag labels for all Endpoints types.

#### Envs Area is changed in Project SETTINGS

From the project Overview, user can access to the Envs area by clicking on the Project Settings button.

#### Projects Overview does not show more the Last Deploy for each environment card

To performance reasons, the Last Deploy info is no more visible from the Environment cards in project Overview, but it is still visible on the Deploy area of the project.

### Bug Fix

#### Improved stability of console pages

A bug that caused the appearance of an endless-spinner at the scroll of some pages in the console has been fixed.

### Breaking Changes

### Improvements

#### Improvement in Overview page loading performances

THe loading time of the project Overview has been shortened and optimized.

#### Endpoints are searchable by inserting the microservice name 

From the Endpoints sidebar, user can search the endpoint by inserting the name of the microservice related to that endpoint.

## Marketplace

### Mia-Platform Marketplace now supports MongoDB v5

Here below, the list of services that have been updated for MongoDB v5 support:

| Services | Type | Version | MongoDB v5 support verified  |
|----------|------|---------|---------------------------|
|`v1-adapter`| core | - | ✅ |
|`auth0-client`| core | - | ✅ |
|`cms-backend`| core | - | ✅ |
|`mongodb-reader`| core | - | ✅ |
|`flow-manager`| core | - | ✅ |
|`mongo2kafka`| core | - | ✅ |
|`files-service`| plugin | - | ✅ |
|`Node.js-Custom-Plugin-Mongo-Example`| example | - | ✅ |
|`Single View Creator Plugin`| plugin | - | ✅ |
|`Single View Creator Template`| template | - | ✅ |
|`RealTime Updater`| plugin | - | ✅ |
|`MongoDB Query Exporter`| plugin | - | ✅ |

### Flow Manager v2.4.0

The Flow Manager service will now notify kafka connection errors via its status routes, so if you need the service to restart when Kafka connection fails, make sure you have configured them correctly.

### Dev Portal Application Update 

With this update the dev portal application is enriched with many new features and improvements:

- The concept of Tag has been introduced in the Marketplace. It is now possible to assign more tags to each marketplace component, and at the same time the visualization of the cards has been improved;
- The consultation of your functional documentation is smarter! It is now possible to search very quickly pages or single paragraphs through the use of the search input in the documentation section;
- New configuration of the modal and drawer components! From now on, thanks to a confirmation modal, users editing content in the backoffice section are warned before losing their changes and protected from accidental mistakes;
- The Backoffice now offers the possibility to adopt a template for the Marketplace detail pages! It is now possible to use a predefined structure to fasten the creation of any components page. A default template is already included in the Dev Portal application, but it can be also modified as needed;
- The Marketplace now offers a new table of content! When opening the detail page of an API, the content created with the editor from the backoffice will automatically generate a navigable directory tree on the side of the page. Each option will be clickable, so you will not need to scroll all the way to a specific section anymore;
- The style of the topbar has been improved, in a modern and more linear way.

### RBAC Service v0.8.2

A new version of RBAC Service is available featuring some small bug fixes.

### CRUD Service v5.1.0

A new version of CRUD Service is available featuring support for MongoDB Views definitions

### CMS Site v9.14.4

In the microservice configurations can now be defined the filesCollection property to choose the collection that will be used to store uploaded files. Default value is files.

## Backoffice v0.10.5

### New features

#### Nested objects

It is now possible to navigate and edit nested objects in `bk-table` component. For further details, refer to [the documentation](https://git.tools.mia-platform.eu/platform/backoffice/headless-cms/-/blob/master/packages/bk-web-components/docs/layout.md#nested-dataschemas).

#### Localized text

It is now possible to specify a format `localized-text` for `object`s in the `dataSchema` that renders the object according with the browser language. For more information, refer to [the documentation](https://git.tools.mia-platform.eu/platform/backoffice/headless-cms/-/blob/master/packages/bk-web-components/docs/layout.md#data-schema).

#### Export

It is now possible to perform native browser file download aliasing the export service using `nativeDownload` on `bk-export`. For further details, refer to [the documentation](https://git.tools.mia-platform.eu/platform/backoffice/headless-cms/-/blob/master/packages/lit-bk-web-components/docs/components/clients.md#bk-export).

### Improvements

#### Dynamic links

It is now possible to specify dynamic links for the `href` field in link addons using data from the current form inside `handle-bars`. Refer to [the documentation](https://git.tools.mia-platform.eu/platform/backoffice/headless-cms/-/blob/master/packages/bk-web-components/docs/concepts.md#links) for more information on filters.

#### Between filter

It is now possible to specify a `between` operator for date fields in filters. Refer to [the documentation](https://git.tools.mia-platform.eu/platform/backoffice/headless-cms/-/blob/master/packages/bk-web-components/docs/concepts.md#filters) for more information on filters.

### Bug Fix

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.x.x`.
