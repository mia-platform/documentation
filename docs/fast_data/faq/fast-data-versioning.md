---
id: fast_data_versioning
title: Fast Data Versioning
sidebar_label: Fast Data Versioning
---

In this page are reported the details regarding the version of each Fast Data Service to provide a reference
on which service is compatible with the others.

## Latest Stable Services Version

| Real-Time-Updater | Single View Trigger Generator | Single View Creator |
|:-----------------:|:-----------------------------:|:-------------------:|
|       7.5.6       |             3.1.2             |        6.2.1        |

## Event Driven Architecture Support

### Minimum Services Version

| Real-Time-Updater | Single View Trigger Generator | Single View Creator |
|:-----------------:|:-----------------------------:|:-------------------:|
|       7.4.0       |             3.0.0             |        5.6.5        |

:::caution
In case it is selected `debezium` as message adapter, the minimum service version for the Real-Time Updater plugin
is `v7.5.4`
:::

### Recommended Services Version

| Real-Time-Updater | Single View Trigger Generator | Single View Creator |
|:-----------------:|:-----------------------------:|:-------------------:|
|       7.5.6       |             3.1.2             |        6.2.1        |

## Projection Storer Support

Projection Storer is a new service that can be employed as a replacement of Real-Time Updater
in the Fast Data _event-driven_ architectures, that is in conjunction with both Single View Trigger Generator
and Single View Creator plugins.

### Minimum Services Version

| Projection Storer | Single View Trigger Generator | Single View Creator |
|:-----------------:|:-----------------------------:|:-------------------:|
|       1.0.0       |             3.1.2             |        6.2.1        |


### Minimum Services Version

| Projection Storer | Single View Trigger Generator | Single View Creator |
|:-----------------:|:-----------------------------:|:-------------------:|
|       1.0.0       |             3.1.2             |        6.2.1        |

## Deprecated Services Versions

Here are listed all the services version that are deprecated because they are affected by a known bug and
do not work as intended.

### Real-Time Updater

### Single View Trigger Generator

- `v3.1.0`: the introduction of message validation on existing messages was too strict causing the discard of all the
`pr-update` events using the `v1` schema. Please upgrade to `v3.1.1`

### Single View Creator

- `v6.2.0`: affected by a bug on the Kafka Consumer. Please upgrade to `v6.2.1`

