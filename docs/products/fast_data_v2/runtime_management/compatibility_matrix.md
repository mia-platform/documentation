---
id: compatibility_matrix
title: Control Plane Compatibility Matrix
sidebar_label: Compatibility Matrix
---

This section guides you to understand whether your Project can support Fast Data v2 Control Plane and its features.

## Infrastructure

Here is described the compatibility between Fast Data v2 Control Plane application components and the external systems they rely on.
Please ensure that versions shown in the matrix are respected in your deployed environments.

| Service                 | Version | MongoDB |
|-------------------------|---------|---------|
| Control Plane           | 0.1.0   | \>=7.0  |

## Fast Data Services

Here is provided the compatibility matrix between Control Plane components and the Fast Data Engine v2 workloads that need to communicate with them.
Please ensure that your services respect the following matrix.

| [Control Plane Frontend](/products/fast_data_v2/runtime_management/application_configuration.md) | [Control Plane Piper](/products/fast_data_v2/runtime_management/application_configuration.md) | [Mongezium](/products/fast_data_v2/mongezium_cdc/10_Overview.md) | [Stream Processor](/products/fast_data_v2/stream_processor/10_Overview.md) | [Farm Data](/products/fast_data_v2/farm_data/10_Overview.md) | [Kango](/products/fast_data_v2/kango/10_Overview.md) |
|:----------------------:|:-------------------:|:----------------------------------------------------------:|:---------------------------------------------------------------------:|:------------------------------------------------------:|:----------------------------------------------:|
|         0.1.0          |        0.1.0        |                          \>=0.5.0                          |                                \>=0.6.0                                |                        \>=0.6.0                        |                    \>=0.6.0                    |

## Service Latest Versions

| Service                                                                                       | Version |
|-----------------------------------------------------------------------------------------------|---------|
| [Control Plane Frontend](/products/fast_data_v2/runtime_management/application_configuration.md)        | 0.1.0   |
| [Control Plane Piper](/products/fast_data_v2/runtime_management/application_configuration.md)  | 0.1.0   |
| [Mongezium](/products/fast_data_v2/mongezium_cdc/10_Overview.md)                                   | 0.5.0   |
| [Stream Processor](/products/fast_data_v2/stream_processor/10_Overview.md)                         | 0.6.0   |
| [Farm Data](/products/fast_data_v2/farm_data/10_Overview.md)                                       | 0.6.0   |
| [Kango](/products/fast_data_v2/kango/10_Overview.md)                                               | 0.6.0   |

## Internal Compatibility

| Service                    | Control Plane Frontend | Control Plane Piper | Mongezium | Stream Processor | Farm Data | Kango |
|---------------------------:|:----------------------:|:-------------------:|:---------:|:----------------:|:---------:|:-----:|
| Control Plane Frontend - 0.1.0 |         _N/A_          |        0.1.0        |   0.5.0   |      0.6.0       |   0.6.0   | 0.6.0 |
| Control Plane Piper - 0.1.0    |         0.1.0          |        _N/A_        |   0.5.0   |      0.6.0       |   0.6.0   | 0.6.0 |
| Mongezium - 0.5.0               |         0.1.0          |        0.1.0       |   _N/A_   |      0.6.0       |   0.6.0   | 0.6.0 |
| Stream Processor - 0.6.0        |         0.1.0         |        0.1.0       |   0.5.0   |      _N/A_       |   0.6.0   | 0.6.0 |
| Farm Data - 0.6.0               |         0.1.0          |        0.1.0        |   0.5.0   |      0.6.0       |   _N/A_   | 0.6.0 |
| Kango - 0.6.0                   |         0.1.0          |        0.1.        |   0.5.0   |      0.6.0       |   0.6.0   | _N/A_ |
