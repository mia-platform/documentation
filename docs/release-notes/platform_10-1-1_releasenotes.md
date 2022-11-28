---
id: v10.1.1
title: Version 10.1.1 Release Notes
sidebar_label: v10.1.1
image: "img/release-note-link-preview.png"
---

_November 28, 2022_

## Console

### New Features

#### Container Ports management

A [new section](../development_suite/api-console/api-design/microservice-container-ports) named "Container ports" has been added to the microservice detail page. In this section, the user can now add, edit or delete the microservice container ports.

### Improvements

#### Shortcut cmd/ctrl + enter for Deploy, Branch creation & Advanced configurations

We have implemented the shortcut cmd/ctrl + enter to:

- trigger a Deploy
- create a new Branch 
- save the extensions in the Advanced configurations section

#### Tenant name in the Company Overview launcher

Now, the launcher of the Company Overview always shows the Tenant name.

### Bug Fix

#### Merge flow improvements

While still in BETA, there have been several improvements to the Merge experience:

- The validation error banner in the Merge editor is now correctly configured and shows if there is a resource with dependencies when trying to delete it
- The Merge editor now better supports the Merge of configurations with different Console versions 

#### Changes in the Microservice Runtime Resources 

In the Design section, it has been fixed a bug that prevented the correct viewing and saving of local changes made inside the Runtime card of Microservices created from DockerImage.

#### Error in loading clusters of a Company

Fixed a bug that caused a malfunction in Company Overview when loading clusters of a specific Company in succession to having loaded the same section on a previous Company.

#### RBAC Manual routes header name

Inside the RBAC manual routes, it has been fixed a bug that prevented the correct update of the header name for row filter.

#### Service replicas hpa files deletion

When deleting multiple service replicas, their related `hpa.yml` files are now all correctly deleted.

#### Last deploy from a user no longer registered in Console

It has been fixed a bug that occurred when the last deploy was made by a user no longer registered in Console.

#### Moving among Console sections after saving on a new branch

A bug that prevented users from remaining in the same branch after saving on a new branch and moving among Console sections has been fixed.

#### Selected lines of editors in Console

The content of each line inside some types of editor in Console appeared fully selected. This bug has now been fixed. 

#### Displaying of Pods container status

It has been fixed a bug that caused an error when displaying the container status on the detail page of Pods.

#### Request and Limit in Microservice configuration

Now, when altering the values of Request and Limit of each resource, the validation error correctly reports whether the Limit threshold has been exceeded.

## Fast Data

### New Features

#### ER Schema naming convention for new System of Records

When creating a new System of Record, the related Config Map of the ER Schema will have the following naming convention: `fast-data-{System-of-Records-name}-er-schema`.

### Bug Fix

#### Selection of the message adapter type when importing Projections from file

During the import of Projections from file, the message adapter type is not requested anymore, since it is now selected when creating the System of Records.

## Marketplace

### New Marketplace Components

#### Kafka to Rest Plugin v1.0.0 (kafka2rest)
A microservice which enables the conversion of Kafka messages into REST HTTP requests that are executed towards configured targets.

Check the [official documentation](https://docs.mia-platform.eu/docs/runtime_suite/kafka2rest-service/overview) for more.

#### Rest to Kafka Plugin v1.0.0 (rest2kafka)
A microservice which enables the conversion of REST HTTP requests into messages produced on Kafka topics.

Check the [official documentation](https://docs.mia-platform.eu/docs/runtime_suite/rest2kafka-service/overview) for more.

#### Care Kit v2.0.4
A plugin which provides a library of Web Components, designed by Mia Care, that can be used to compose your Backoffice.

#### Data Analytics application
The data analytics application provides two dashboards, Users and Services, that can immediately give feedback about the active users of the platform and details about the offered services.

### Updated Marketplace Components

#### Single View Creator Service - 5.6.2

A new version has been released to support the `MAX_INTERVAL_BETWEEN_FETCHES_TO_BE_ALIVE_IN_MS` environment variable (interval of time in which is verified if the service is still working) and includes minor updates to increase performance of the Single View patch strategy in case is not required to send `sv-update` events.

## Backoffice - 1.2.0

### New Features

#### File download with POST requests

Support for `downloadAsFile` option in `bk-button` component is extended to POST requests.

#### Configurable editor height in form

Components `bk-filter-drawer`, `bk-form-drawer`, `bk-form-modal` and `bk-form-card` support `editorHeight` property, controlling monaco-editor height.

#### Table supports custom actions in nested levels

`bk-table` custom actions can be configured on a per-nested-level basis.

#### `bk-file-client` supports latest interface of `files-service`

`bk-file-client` forwards `useOriginalName` query parameter to `files-service` (needs `files-service` 2.6.4+).

#### Numeric values can be represented as date fields

Fields of type `number` support `date-time`, `date`, `time` formats in data-schema.

#### Lookups can be sorted

`sortOption` is supported in `lookupOptions`, controlling `_s` parameter in  lookup fetching call.

### Bug Fix

#### Card has no border by default

`bk-card` with default role doesn't show border.

#### Table correctly shows nested levels

Nested objects are shown in `bk-table` component without the need to include `bk-pagination` in the page.

#### Between filter with same date is handled

When begin and end dates are the same in a `between` filter in `bk-expanded-filters` component, an `equal` filter is created instead.

#### Download requests for non existing file is handled

Fixed endless loading caused by non-existing file specified in `download-file` event payload.

#### Table performs navigation on row click

`bk-table` correctly performs `pushState` and `replaceState` when `browseOnRowSelect` property has `navigationType` set to "push" or "replace".

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 8.1.14`.
