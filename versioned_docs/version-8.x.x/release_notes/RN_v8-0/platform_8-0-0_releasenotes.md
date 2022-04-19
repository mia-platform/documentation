---
id: v8.0.0
title: Version 8.0.0 Release Notes
sidebar_label: v8.0.0
image: "img/release-note-link-preview.png"
---

_October 7, 2021_

### New Features

#### Added support to multi providers

Now is possible configure a list of providers. In this new collections you can configure multiple git providers where users can log in. [See how to setup](../../development_suite/set-up-infrastructure/create-project.md#create-a-provider).

#### Dashboards management

It is now possible to create, edit and delete a Dashboard from the [Dashboard Area](../../development_suite/monitoring/dashboard).

#### New projection field types

Four new types are now available for projection fields and cast functions, the new types are: `Array of String`, `Array of Number`, `ObjectId` and `GeoPoint`.

#### Added default cast function `defaultIdentity`

A new default cast function `defaultIdentity` is available, it can be applied to every field type in projections, and it is the default cast function for each new projection field.

#### New Mia-backoffice

The new [Mia-Platform Headless CMS](../../business_suite/backoffice/overview.md) is now available. 

### Bug Fix

#### Allow nested fields in CRUD import

Fixed a bug that prevented the CRUD creation via JSON Schema import in case it contained nested objects.

#### CRUD Schema Editor

A bug that caused a crash when emptying the content of the Schema Editor has been fixed.

#### Commit after advanced section file commit

A bug that prevented subsequent commits after committing a file modification in the advanced section has been fixed.

### Marketplace Updates

#### Authentication Service v2.3.0

This new [Authentication Service](../../runtime_suite/authentication-service/overview) version adds the ability to give to each provider in the gitProviders list an order property that will order your providers in the providers API result.

#### API Gateway v4.2.0

This [API Gateway](../../runtime_suite/api-gateway/overview) version uses nginx at 1.23.3 with various security fixes. It also adds `X-Real-IP` to proxy headers.

#### Function Service v2.2.0

The [Function Service](../../runtime_suite/function-service/configuration) now features new libraries: `mississipi@4.0.0` and `split2@3.2.2`.

#### Flow Manager Service v2.3.0

The [Flow Manager Service](../../runtime_suite/flow-manager-service/configuration) has been updated to support the `brokers` for Kafka Communication Protocols configuration to be either an array of strings or a string of comma-separated brokers.

#### CMS Site v9.14.2

The [CMS Site](../../runtime_suite/cms-site/overview) has been updated to add security fixes.

#### API Portal v1.13.9

The [API Portal](../../runtime_suite/api-portal/overview) image has been updated to add security fixes.

#### CRUD Service v4.4.0

The [CRUD Service](../../runtime_suite/crud-service/overview_and_usage) has been updated to the `v4.4.0` with some fixes to the jsonSchema, logs and to the Patch By Id that would not allow you to use the `$.merge` operator properly with nested array of object.

Also, has introduced the support for the [Client Side Field Level Encryption (**CSFLE**)](https://docs.mongodb.com/manual/core/security-client-side-encryption/), in order to encrypt fields in documents before transmitting them to Mongo.

#### Single View Creator Service v3.0.2

[Single View Creator](../../fast_data/single_view_creator/overview.md) Template and Plugin have been update to use `v3.0.2` of the Single View Creator Service, which offers the possibility to have CRUD fields in single view error documents.

#### Swagger Aggregator v3.4.1

[Swagger Aggregator](../../runtime_suite/swagger-aggregator/overview) Plugin has been updated to the `v3.4.1` with a fix to a bug that prevented the usage of json configmaps.

#### Files Service v2.3.0

The [Files Service](../../runtime_suite/files-service/configuration#environment-variables) Plugin has been updated to the `v2.3.0` featuring a new environment variable `FILE_TYPE_INCLUDE_LIST` that can be configured to prevent unrestricted file type uploads leading to potential security vulnerabilities.

#### TypeScript Template and Hello World Example

A new example and a new template using TypeScript have been added to the marketplace, for further information checkout their repositories:

- [TypeScript Template](https://github.com/mia-platform-marketplace/Typescript-LC39-Template)
- [TypeScript Hello World Example](https://github.com/mia-platform-marketplace/Typescript-LC39-Hello-World-Example)

### Improvements

#### Search by tenant name in projects page

In projects page it is possible to filter shown projects by tenant name in addition to project name.

#### UI Revision

The look of the section header has been revised to improve its appearance. Also, the space between the inputs in the Console forms has been standardized.

#### Real Time Updater v3.1.3

The new version of the Real Time Updater now adds the createdAt field in new projections to facilitate debugging. Systems of Record created with the Console will use such version, but you need to update the existing ones to take advantage of the feature.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.2.2`.
