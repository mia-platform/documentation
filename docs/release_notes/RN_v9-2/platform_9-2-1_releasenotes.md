---
id: v9.2.1
title: Version v9.2.1 Release Notes
sidebar_label: v9.2.1
image: "img/release-note-link-preview.png"
---

_June, 9th 2022_

## Fast Data

### Breaking Changes

#### Kafka Adapters are no longer configurable from advanced

Any changes to the [Kafka Adapters](../../fast_data/configuration/realtime_updater/common.md#kafka-adapters-kafka-messages-format) must now be made from the Microservices Section of the Design Area, directly in the Kafka Adapters `ConfigMap`.    
Any Kafka Adapter custom you have already configured from the Git `fast-data-files` folder will be automatically ported to the related ConfigMap in the Microservice page of the RealTime Updater.

## Console

### New features

#### Discard changes

It is now possible to discard all unsaved changes from the save configuration area!

### Improvements

#### Branch and Tags selection UI review

Branch and Tags selection modal UI has been revised!

:::info
To open the desired branch simply click on it or navigate to it using `Tab` and press `Enter`.
:::

<div style={{display: 'flex', flexDirection: 'row', gap: '8px'}}>
<div>

![branch selection](../img/9.2.1/branch-selection-modal.png)

</div>
<div>

![new branch selection](../img/9.2.1/tag-selection-modal.png)

</div>
</div>

## Marketplace

### Marketplace updates

#### API Gateway compatibility with Pod Security Policies on EKS

Nginx API Gateway has been fixed to support Security Context configurations when running on EKS.

#### File service v2.5.0

Added New API to download multiple files, [check out the documentation for further details](../../runtime_suite/files-service/usage#download-many-get-download).

### Security update for the following microservices

 * Swagger aggregator v3.4.5

## Backoffice v1.0.3

### New features

Forms and modals now support geolocation data with maps.

### Improvements

 - Buttons and actions now support `danger` mode;
 - Buttons can now be configured to achieve browser-native file download.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 6.1.10`.
