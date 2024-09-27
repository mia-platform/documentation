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
| [Control Plane](/fast_data/runtime_management/control_plane.mdx)         | 0.1.0   | \>=5.0  | \>=7.0 |
| [Fabric BFF](/fast_data/runtime_management/control_plane_fabric_bff.mdx) | 0.1.0   | \>=5.0  | \>=7.0 |

## Fast Data services

Here is provided the compatibility matrix between Control Plane Operator and the Fast Data services that need to talk with it.
Please ensure that your services respects the following matrix. 

| [Control Plane Operator](/fast_data/runtime_management/control_plane_operator.mdx) | [PS](/fast_data/configuration/projection_storer.md#runtime-management-config) | [RTU](/fast_data/configuration/realtime-updater/realtime-updater.md#runtime-management) | [SVTG](/fast_data/configuration/single_view_trigger_generator.mdx#runtime-management) | [SVC](/fast_data/configuration/single_view_creator/index.md#runtime-management) |
|:----------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------:|
|                                       0.1.0                                        |                                   \>=1.2.0                                    |                                        \>=7.8.0                                         |                                       \>=3.3.1                                        |                                    \>=6.7.0                                     |
