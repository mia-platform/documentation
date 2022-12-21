---
id: v10.2.0
title: Version 10.2.0 Release Notes
sidebar_label: v10.2.0
image: "img/release-note-link-preview.png"
---

_December 20, 2022_

## Console

### New Features

#### Cluster connection

The entire experience of connecting a cluster in Console has been improved and optimized, along with the editing of the respective details.
You can now choose from a predefined set of officially supported runtime services divided by vendor for a clearer and more intuitive experience.
For more details go to the [official documentation](/development_suite/clusters-management/add-edit-remove-cluster.md).

#### Save configuration from unsaved local changes

Now, from the modal of unsaved local changes, it is possible to go to the save configuration modal by clicking on a dedicated button. Moreover, the save configuration modal allows you to go and see your local changes.

#### Save configuration after Merge

The modal that appears after successfully completing a merge operation now contains a _Save configuration_ button, that allows you to easily go to save your configuration.

#### Repository URL for Microservice created from DockerImage

For a Microservice created from DockerImage, it is now possible to add the repository URL when creating it. Thus, this repository can be subsequently cloned and downloaded through Visual Studio Code and IntelliJ IDEA.

#### Selection of container ports in the microservice Metrics

Now, if I enable the Metrics on a specific microservice, inside of this card I can select any container port that has been added.

#### Support for Forward proxies and Certificate Authority

The following providers now support Forward proxies:

- GitLab
- GitHub
- Bitbucket

While the following providers now support custom Certification Authority:

- GitLab
- GitHub

### Improvements

#### Branch/tag name in the save configuration modal

Now, inside the save configuration modal, you can see the current branch from where you are saving.

### Bug Fix

#### Nginx API Gateway security headers

Nginx API Gateway now includes some important security headers to prevent by default content type sniffing and click jacking; this may cause issues if you were relying on one of the following headers default values it is recommended to verify
everything works as intended.

:::caution
The Backoffice application using micro-lc prior to v1.0.1 is incompatible with this security fix, make sure to update the service.
:::


#### Merge flow improvements

While still in BETA, there have been several improvements to the Merge experience:

- The Confirm merge button now appears as disabled for users that do not have the permission to perform such action.
- A bug affecting the configuration merge between two Fast Data single views has been fixed.

#### Public variables warning

A bug that caused a persistence of the warning in the Public variables section has been fixed.

#### Navigation with cmd/ctrl + K

It has been fixed a bug that prevented the correct visibility of different projects Runtime sections when navigating with cmd/ctrl+k.

#### Switch to project homepage

Only project admins can now switch the project homepage type.

#### Unexpected side effect when updating Quick Links

It has been fixed a bug that prevented to retrieve the information inside of the project environment cards when adding, editing or deleting a project Quick Link.

## Fast Data

### Improvements

#### Indexes in Projection Changes

The mechanism that generates the Projection Changes collection has been updated to have more efficient MongoDB Indexes.

### Bug Fix

#### Retrocompatibility fix for the Kafka Message Adapter

Fixed a retrocompatibility issue with the Kafka Message Adapter for already existing Real Time Updaters and System of Records.

#### TTL Indexes in Projections

Fixed a bug where MongoDB indexes of type _TTL_ in projections are saved as regular indexes.

## Marketplace

### New Marketplace Components

#### Payments Integration Hub application

The Payments Integration Hub application is a bundle of:

- payment gateway manager
- backoffice: overview of all transactions and related data and dashboards section to monitor key payment data KPIs.
- and various functionalities directly linked to the backoffice:
  - e-mail notification services: to notify the user of the payment status (success/failure)
  - invoice service: possibility to download or send a pdf of the purchase receipt to the user directly from the backoffice
  - refund management: possibility to refund the payment directly from the backoffice. When the refund is completed, a notification is sent to the user.

For more technical details please refer to the [documentation](/runtime_suite/payments-integration-hub/overview.md).

## Backoffice - 1.2.1

### New Features

#### bk-layout component

new component `bk-layout` is available, allowing plugins layout customization.

### Bug Fix

#### Tabs support "between" filter

`bk-tabs` correctly support `between` operator with date filters having offsets.

#### Fixed issue with long running queries

Lookups in form components are correctly resolved with long running queries.

#### Default values integrate with initial values in `add-new` payload

Form components integrate default values with initial values from `add-new` payload.

#### Fixed issue with bk-confirmation-modal

Buttons in `bk-confirmation-modal` do not hold state from previous renderings.

## How to update your Console

This release contains a potentially breaking change due to the presence of a new database index. For more information on how this might affect you, contact your administrator or your Mia Platform referent before upgrading the Console.
For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 8.2.8`.
