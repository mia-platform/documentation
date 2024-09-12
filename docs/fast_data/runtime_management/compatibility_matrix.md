---
id: compatibility_matrix
title: Control Plane Compatibility Matrix
sidebar_label: Compatibility Matrix
---

This section guides you to understand whether your Project can support Control Plane and its features.

## Infrastructure

Here is described the compatibility between Fast Data Control Plane application components and the external systems they rely on.
Please ensure that versions shown in the matrix are respected in your deployed environments. 

| [Control Plane](/fast_data/runtime_management/control_plane.mdx) | MongoDB |          Redis           |          Kafka           |
|:----------------------------------------------------------------:|:-------:|:------------------------:|:------------------------:|
|                              x.y.z                               |  \>=5   |           \>=7           | <em>N/A</em><sup>*</sup> |
|                              1.1.0                               |  \>=5   | <em>N/A</em><sup>*</sup> |          \>=2.8          |
<p><sup>*</sup><em>N/A</em> means the service does not use the resource</p>

| [Fabric BFF](/fast_data/runtime_management/control_plane_fabric_bff.mdx) | MongoDB |
|:------------------------------------------------------------------------:|:-------:|
|                                 \>=1.0.0                                 |  \>=5   |

## Fast Data services

Here is provided the compatibility matrix between Control Plane Operator and the Fast Data services that need to talk to it. Please ensure that your services respects the following matrix. 

| [Control Plane Operator](/fast_data/runtime_management/control_plane_operator.mdx) | [PS](/fast_data/configuration/projection_storer.md#runtime-management-config) | [RTU](/fast_data/configuration/realtime-updater/realtime-updater.md#runtime-management) | [SVTG](/fast_data/configuration/single_view_trigger_generator.mdx#runtime-management) | [SVC](/fast_data/configuration/single_view_creator/index.md#runtime-management) |
|:----------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------:|
|                                       x.y.z                                        |                                   \>=1.2.0                                    |                                        \>=7.8.0                                         |                                       \>=3.3.1                                        |                                    \>=6.7.0                                     |

The initial release of Fast Data Control Plane solution allowed to manage only the single runtime where Control Plane service was deployed. Here is reported the corresponding compatibility matrix.

| Control Plane | [PS](/fast_data/configuration/projection_storer.md#runtime-management-config) | [RTU](/fast_data/configuration/realtime-updater/realtime-updater.md#runtime-management) | [SVTG](/fast_data/configuration/single_view_trigger_generator.mdx#runtime-management) | [SVC](/fast_data/configuration/single_view_creator/index.md#runtime-management) |
|:-------------:|:-----------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------:|
|     1.1.0     |                                   \>=1.1.1                                    |                                        \>=7.7.0                                         |                                       \>=3.3.0                                        |                                    \>=6.7.0                                     |

:::caution
We highly recommend to use the newer version of Fast Data Control Plane application, since it offers extended capabilities and allows managing multiple Fast Data runtime with a single deployment. In this improved solution the service that interacts with Fast Data workloads is the
Control Plane Operator.
:::