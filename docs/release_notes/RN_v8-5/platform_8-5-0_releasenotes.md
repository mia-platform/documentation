---
id: v8.5.0
title: Version 8.5.0 Release Notes
sidebar_label: v8.5.0
image: "img/release-note-link-preview.png"
---

_January 13, 2022_

## Console

### New Features

#### New RBAC Section in Console

Inside the Design area, a new section is available to [**manage RBAC**](../../development_suite/api-console/api-design/rbac) configurations. This new section presents four different tabs:

- [**Overview**](../../development_suite/api-console/api-design/rbac#overview-tab): in this tab you can enable and configure the [RBAC sidecar](../../development_suite/api-console/api-design/rbac#rbac-service) for each service of your project;
- [**General Settings**](../../development_suite/api-console/api-design/rbac#general-settings-tab): in this tab you can control shared settings between all of your RBAC instances in the project (such as the version of the RBAC service or the [storage configuration](../../development_suite/api-console/api-design/rbac#rbac-storage))
- [**Permissions**](../../development_suite/api-console/api-design/rbac#permissions-tab): in this tab you can write and test your own permission policies (policies are written using Rego language, more info [here](https://www.openpolicyagent.org/docs/latest/policy-language/);
- [**Manual Routes**](../../development_suite/api-console/api-design/rbac#manual-routes-tab): in this tab you can manually configure the permissions required by your service APIs (useful when your service does not expose an OpenAPI Specification)

![RBAC-section-overview](../img/RBAC_section_overview.png)

:::caution

The new RBAC section is still in an early development stage under the `preview` tag, as it may be subjected to small bugs or breaking changes.

:::

#### Dev Portal

It is now possible to configure the Dev Portal so that when a new access request for a component is requested, the manager is automatically notified via e-mail.

#### Shared ConfigMaps

It is possible to configure a microservice using a Configmap which already exists inside the project. You can find [here](../../development_suite/api-console/api-design/services#shared-configmaps) more details.

#### Added link to Runtime Area in Homepage

Clicking on the number of pods in the pod status metric of one of the homepage environment cards in the project homepage will redirect to the corresponding environment Runtime Area.

#### Added link to Tenant Overview (Only for On-Premise installations)

Tenant Overview is now enabled as default on On-Premise installation as preview.
You can disable it by setting `enableTenantOverview` feature toggle to `false`.

If the feature is enabled, when you are in the Project choice page you can click on the icon near the Tenant name to go the the Tenant Overview page. This page give you an overview on all the endpoints of the projects of the tenant.

### Bug Fix

#### Generate a correct deployment configuration using log parser "Not Collected"

Setting the log parser in the microservice configuration on "Not Collected" and committing the changes, it is generated a correct deployment configuration.

#### Create a tag with a release note attached

A bug caused by Gitlab 14 breaking changes on API that caused the missing of the Release Note of the tag has been resolved.

#### Form input options filtered based on user input

All input form items that provide suggestions will filter them as the user types the value in the input.

## Marketplace

### Breaking Changes

#### Real Time Updater v4.0.0

Real Time Updater has been updated to the major version v4.0.0, which breaking change on the behavior when a Kafka group rebalancing happens. [Read more here](../../fast_data/real_time_updater/configuration#kafka-group-rebalancing-behavior).

Two more environment variables were added:

- FORCE_CHECK_ON_OFFSET environment variable to specify whether to check message offset is greater than the one saved on the projection or not.
- COMMIT_MESSAGE_LOGGING_INTERVAL to specify the interval of logging for committed messages

[Read more here](../../fast_data/real_time_updater/configuration##prevent-projection-to-be-overwritten).

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.8.3`.
