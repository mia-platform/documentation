---
id: fast_data_versioning
title: Fast Data Versioning
sidebar_label: Fast Data Versioning
---

In this page are reported for each Fast Data service its version details. This information should provide a reference
on which service is compatible with the others, which versions should be skipped and which one enables certain features.

## Fast Data

### Services Changelogs

- [Real-Time Updater](/runtime_suite/real-time-updater/changelog.md)
- [Projection Storer](/runtime_suite/projection-storer/changelog.md)
- [Single View Trigger Generator](/runtime_suite/single-view-trigger-generator/changelog.md)
- [Single View Creator](/runtime_suite/single-view-creator/changelog.md)

### Latest Stable Services Version

| Real-Time-Updater | Projection Storer | Single View Trigger Generator | Single View Creator |
|:-----------------:|:-----------------:|:-----------------------------:|:-------------------:|
|       7.9.x       |       1.3.x       |             3.3.x             |        6.7.x        |

### Compatibility Matrix

| Real-Time Updater | Projection Storer | Single View Trigger Generator | Single View Creator |
|:-----------------:|:-----------------:|:-----------------------------:|:-------------------:|
|      >=5.0.0      |         -         |               ❌               |       >=5.2.0       |
|      >=7.0.0      |         -         |            >=3.0.0            |       >=5.6.5       |
|         -         |      >=1.0.0      |            >=3.1.3            |       >=6.2.2       |

### Event Driven Architecture Support

#### Minimum Services Version

| Real-Time-Updater | Single View Trigger Generator | Single View Creator |
|:-----------------:|:-----------------------------:|:-------------------:|
|       7.4.0       |             3.0.0             |        5.6.5        |

:::caution
In case it is selected `debezium` as message adapter, the minimum service version for Real-Time Updater plugin
is `v7.5.4`
:::

#### Recommended Services Version

| Real-Time-Updater | Single View Trigger Generator | Single View Creator |
|:-----------------:|:-----------------------------:|:-------------------:|
|       7.9.0       |             3.3.2             |        6.7.1        |

### Projection Storer Support

Projection Storer is a new service that can be employed as a replacement of Real-Time Updater
when Fast Data is configured for adopting the _event-driven_ architecture. This service works in conjunction with both
Single View Trigger Generator and Single View Creator plugins to transform change events from the System of Record into
the final aggregated Single View.

#### Minimum Services Version

| Projection Storer | Single View Trigger Generator | Single View Creator |
|:-----------------:|:-----------------------------:|:-------------------:|
|       1.0.0       |             3.1.3             |        6.2.2        |

#### Recommended Services Version

| Projection Storer | Single View Trigger Generator | Single View Creator |
|:-----------------:|:-----------------------------:|:-------------------:|
|       1.3.0       |             3.3.2             |        6.7.1        |


### Runtime Management Support

With the introduction of Fast Data Control Plane, it is possible to send specific commands to manage services behavior
at runtime. In the table below is described which service versions support being controlled by Fast Data Control Plane.

### Compatibility Matrix

Please visit the [dedicated page](/fast_data/runtime_management/compatibility_matrix.md) where further compatibility details are explained.

## Bucket Storage Support

### Services Changelogs

- [Ingestion Storer](/runtime_suite/ingestion-storer/changelog.md)
- [Ingestion Reloader](/runtime_suite/ingestion-reloader/changelog.md)

### Recommended Services Version

| Ingestion Storer | Ingestion Reloader |
|:----------------:|:------------------:|
|      1.5.2       |       1.4.1        |

## Known issues

Here are listed all the services version that are affected by a known issue that prevents the plugins
from working as intended.

### Single View Trigger Generator

- `v3.1.0`: the introduction of message validation on existing messages was too strict causing the discard of all the
`pr-update` events using the `v1` schema. Please upgrade to `v3.1.1` or newer

### Single View Creator

- `v6.2.0`: affected by a bug on the Kafka Consumer. Please upgrade to `v6.2.2` or newer
- `v6.2.1`: unintended breaking change found for user that exploited `ramda` dependency in SVC user-defined functions. Please upgrade to `v6.2.2` or newer

### Ingestion Storer

- `v1.3.1`: native image failed to build correctly. Please upgrade to `v1.3.2` or newer
