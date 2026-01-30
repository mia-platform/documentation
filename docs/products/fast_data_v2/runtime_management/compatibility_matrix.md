---
id: compatibility_matrix
title: Control Plane Compatibility Matrix
sidebar_label: Compatibility Matrix
---

This section guides you to understand whether your Project can support Fast Data v2 Control Plane and its features.

## Infrastructure

Here is described the compatibility between Fast Data v2 Control Plane application components and the external systems they rely on.
Please ensure that versions shown in the matrix are respected in your deployed environments.

| Service                                                                                       | Version | MongoDB | Redis  | Kafka |
|-----------------------------------------------------------------------------------------------|---------|---------|--------|-------|
| [Control Plane Frontend](/products/fast_data_v2/runtime_management/control_plane_ui)        | 0.1.0   | \>=5.0  | __N/A__ | __N/A__ |
| [Control Plane Piper](/products/fast_data_v2/runtime_management/application_configuration)  | 0.1.0   | \>=5.0  | __N/A__ | \>=2.8  |

<sup>*</sup><em>_N/A_</em> means the service does not depend on the resource

## Fast Data Workloads

Here is provided the compatibility matrix between Control Plane components and the Fast Data Engine v2 workloads that need to communicate with them.
Please ensure that your services respect the following matrix.

| Control Plane Frontend | Control Plane Piper | [Mongezium](/products/fast_data_v2/mongezium_cdc/overview) | [Stream Processor](/products/fast_data_v2/stream_processor/overview) | [Farm Data](/products/fast_data_v2/farm_data/overview) | [Kango](/products/fast_data_v2/kango/overview) |
|:----------------------:|:-------------------:|:----------------------------------------------------------:|:---------------------------------------------------------------------:|:------------------------------------------------------:|:----------------------------------------------:|
|         0.1.0          |        0.1.0        |                          \>=0.4.0                          |                                \>=0.5.0                                |                        \>=0.5.0                        |                    \>=0.5.0                    |

## Service Latest Versions

| Service                                                                                       | Version |
|-----------------------------------------------------------------------------------------------|---------|
| [Control Plane Frontend](/products/fast_data_v2/runtime_management/control_plane_ui)        | 0.1.0   |
| [Control Plane Piper](/products/fast_data_v2/runtime_management/application_configuration)  | 0.1.0   |
| [Mongezium](/products/fast_data_v2/mongezium_cdc/overview)                                   | 0.4.3   |
| [Stream Processor](/products/fast_data_v2/stream_processor/overview)                         | 0.5.6   |
| [Farm Data](/products/fast_data_v2/farm_data/overview)                                       | 0.5.5   |
| [Kango](/products/fast_data_v2/kango/overview)                                               | 0.5.2   |

## Internal Compatibility

| Service                    | Control Plane Frontend | Control Plane Piper | Mongezium | Stream Processor | Farm Data | Kango |
|---------------------------:|:----------------------:|:-------------------:|:---------:|:----------------:|:---------:|:-----:|
| Control Plane Frontend - 0.1.0 |         _N/A_          |        0.1.0        |   0.4.3   |      0.5.6       |   0.5.5   | 0.5.2 |
| Control Plane Piper - 0.1.0    |         0.1.0          |        _N/A_        |   0.4.3   |      0.5.6       |   0.5.5   | 0.5.2 |
| Mongezium - 0.4.3               |         0.1.0          |        0.1.0        |   _N/A_   |      0.5.6       |   0.5.5   | 0.5.2 |
| Stream Processor - 0.5.6        |         0.1.0          |        0.1.0        |   0.4.3   |      _N/A_       |   0.5.5   | 0.5.2 |
| Farm Data - 0.5.5               |         0.1.0          |        0.1.0        |   0.4.3   |      0.5.6       |   _N/A_   | 0.5.2 |
| Kango - 0.5.2                   |         0.1.0          |        0.1.0        |   0.4.3   |      0.5.6       |   0.5.5   | _N/A_ |
