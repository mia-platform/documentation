---
id: migration
title: Migration
sidebar_label: Migration
---



This document provides information to migrate from a previous version of the service.

## 0.5.1

No change required from previous version.

If you use the [`ck-threshold-modal` Care Kit component][care-kit-ck-threshold-modal] and any of your prototypes includes the `values` field, please note that this version of the TMM is not compatible with Care Kit v2.9.0.

## 0.5.0

### CRUD collections

Add the following fields to the [detections CRUD collection][crud-detections]:

| Name               | Type              | Required (Yes/No) | Nullable (Yes/No) |
|--------------------|-------------------|-------------------|-------------------|
| thresholds         | `Array of object` | No                | No                |
| thresholdsExceeded | `Boolean`         | No                | No                |

## 0.4.0

### CRUD collections

- Add the following fields to the [detections CRUD collection][crud-detections]:

| Name     | Type     | Required (Yes/No) | Nullable (Yes/No) |
|----------|----------|-------------------|-------------------|
| deviceId | `String` | No                | No                |

- Add the following fields to the [monitorings CRUD collection][crud-monitorings]:

| Name            | Type              | Required (Yes/No) | Nullable (Yes/No) |
|-----------------|-------------------|-------------------|-------------------|
| assignedDevices | `Array of string` | No                | No                |


[crud-detections]: /runtime_suite/therapy-and-monitoring-manager/20_configuration.md#detections
[crud-monitorings]: /runtime_suite/therapy-and-monitoring-manager/20_configuration.md#monitorings

[care-kit-ck-threshold-modal]: /runtime_suite/care-kit/20_components/50_ck-threshold-modal.md
