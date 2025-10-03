---
id: compatibility_matrix
title: Control Plane Compatibility Matrix
sidebar_label: Compatibility Matrix
---

This section guides you to understand whether your Project can support Control Plane and its features.

## Infrastructure

Here is described the compatibility between Fast Data Control Plane application components and the external systems they rely on.
Please ensure that versions shown in the matrix are respected in your deployed environments. 

| Service                                                                  | Version | MongoDB | Redis  |
|--------------------------------------------------------------------------|---------|---------|--------|
| [Control Plane](/products/fast_data/runtime_management/control_plane.mdx)         | 0.1.0   | \>=5.0  | \>=7.0 |
| [Fabric BFF](/products/fast_data/runtime_management/control_plane_fabric_bff.mdx) | 0.1.x   | \>=5.0  | __N/A__  |
| [Fabric Admin](/products/data_catalog/database_setup.mdx)                         | 0.1.x - 0.4.x   | \>=5.0  | __N/A__  |
<sup>*</sup><em>_N/A_</em> means the service does not depend on the resource

## Fast Data services

Here is provided the compatibility matrix between Control Plane Operator and the Fast Data services that need to talk with it.
Please ensure that your services respects the following matrix. 

| [Control Plane Operator](/products/fast_data/runtime_management/control_plane_operator.mdx) | [PS](/products/fast_data/configuration/projection_storer.md#runtime-management-config) | [RTU](/products/fast_data/configuration/realtime-updater/realtime-updater.md#runtime-management) | [SVTG](/products/fast_data/configuration/single_view_trigger_generator.mdx#runtime-management) | [SVC](/products/fast_data/configuration/single_view_creator/index.md#runtime-management) |
|:----------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------:|
|                                       0.1.0                                        |                                   \>=1.2.0                                    |                                        \>=7.8.0                                         |                                       \>=3.3.1                                        |                                    \>=6.7.0                                     |
|                                       0.1.1                                        |                                   \>=1.2.0                                    |                                        \>=7.8.0                                         |                                       \>=3.3.1                                        |                                    \>=6.7.0                                     |
|                                       0.3.0                                        |                                   \>=1.4.0                                    |                                        \>=7.11.0                                         |                                       \>=3.4.0                                        |                                    \>=6.8.0                                     |

## Service Latest Versions

| Service                                                                            | Version |
|------------------------------------------------------------------------------------|---------|
| [Fabric BFF](/products/fast_data/runtime_management/control_plane_fabric_bff.mdx)           | 0.3.0   |
| [Control Plane](/products/fast_data/runtime_management/control_plane.mdx)                   | 0.3.1   |
| [Control Plane Operator](/products/fast_data/runtime_management/control_plane_operator.mdx) | 0.3.0   |
| [Control Plane Frontend](/products/fast_data/runtime_management/control_plane_frontend.mdx) | 0.4.3   |
| [Fabric Admin](/products/fast_data/runtime_management/database_setup.mdx)                   | 0.4.0   |

## Internal Compatibility

| Service                                                                                      | Fabric BFF | Control Plane | Control Plane Operator | Control Plane Frontend | Fabric Admin |
|---------------------------------------------------------------------------------------------:| :-: | :-: | :-: | :-: | :-: |
| [Fabric BFF](/products/fast_data/runtime_management/control_plane_fabric_bff.mdx)           - 0.3.0   | _N/A_ | 0.3.1 | 0.3.0 | 0.4.3 | 0.4.0 |
| [Control Plane](/products/fast_data/runtime_management/control_plane.mdx)                   - 0.3.1   | 0.3.0 | _N/A_ | 0.3.0 | 0.4.3 |0.4.0|
| [Control Plane Operator](/products/fast_data/runtime_management/control_plane_operator.mdx) - 0.3.0   | 0.3.0 |0.3.1| _N/A_ |0.4.3| 0.4.0|
| [Control Plane Frontend](/products/fast_data/runtime_management/control_plane_frontend.mdx) - 0.4.3   | 0.3.0 |0.3.1| 0.3.0| _N/A_ |0.4.0|
| [Fabric Admin](/products/fast_data/runtime_management/database_setup.mdx)                   - 0.4.0   | 0.3.0 | 0.3.1| 0.3.0|0.4.3| _N/A_ |
