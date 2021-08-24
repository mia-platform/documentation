---
id: vX.X.X
title: Version X.X.X Release Notes
sidebar_label: vX.X.X
image: "img/release-note-link-preview.png"
---

_Month day, year_

### New Features

#### New Application section

In the Design menu, the new Application section is now available.

An **Application** represents a useful way to instantiate and configure in an unified experience a bundle of resources including Plugins, Examples and Templates. Thus, in a few clicks, an Application can offer a working system of resources.

In the Marketplace, it is now available the Dev Portal Application, our first application.

![Application Creation](../img/application.gif)

For more info, visit "LINK APPLICATION IN DOCS".

#### A New way to navigate the Console

The user experience of navigation within the Console has been improved, gaining a greater workspace area. Some features have been introduced and some other modified:

- **The main menu** that allows to navigate among Areas now is in a dedicated popover that can be opened through the apposite icon in the top left corner of the Topbar.
The user could also choose a bunch of shortcuts to navigate to favorite Areas that would be displayed in the Topbar. Read the [Console presentation](../../development_suite/overview-dev-suite) for more details.

![new-topbar-with-favorites](../img/new-topbar-with-favorites.png)

:::caution
Access to the API Portal documentation no longer occurs through the main menu, but through the relative table in the Envs section of the console. Remember that it is possible to manually customize the various links to be displayed in the table for each different runtime environment, [directly through the CMS](../../development_suite/set-up-infrastructure/runtime-environments).
:::

![runtime-environment-table](../img/envs_section.PNG)


- **The choice of the runtime environment** has been standardized and it is possible to select it from the dropdown menu in the right corner of the topbar in the sections Deploy, Dashboards, Runtime and Debug.

![runtime-environment-dropdown](../img/runtime-env-dropdown.jpg)

- **The "Select Runtime Environment" card** has been renamed in "Latest deployed version", and its appearance has been slightly changed. Now you can use the top right dropdown to select the Runtime Environment in which you want to deploy your branch.

- **The branch management** of the Design area is now accessible in the right corner of the topbar. 
    - Click on the branch name to load or create a new one,
    - You can see the last time changes have been saved at the mouseover
    - The circle icon shows you if there are any unsaved changes
    - Use the Commit&Generate button to save your work
More information can be found here in the Design documentation(TODO:link to ../../development_suite/api-console/api-design/overview.md)

![branch-commit-and-generate-in-main-topbar](../img/branch-commit-and-generate-in-main-topbar.png)

- **[Visualize](../../development_suite/api-console/api-design/miacraft) and Advanced sections** of the Design area have been moved in the main sidebar, as sub-sections of "Mode" and "Workload" respectively. Please note that these sections have a dedicated button to save changes, hence the Commit&Generate in the top right corner is disabled.

#### Fully manageable API Gateway

The [API Gateway](../../runtime_suite/api-gateway/overview), the core service that is responsible for:

- routing requests to the correct service inside Kubernetes;
- verify the need of authentication and orchestrate the conversation with Auth service;

is now visible in the Microservices area.

You can change CPU and memory request and limit, the number of static replicas, enable [autoscaling](../../development_suite/api-console/api-design/replicas), manage environment variables and [much more](../../development_suite/api-console/api-design/services#manage-microservices).

Configurations defined through the [Advanced](../../development_suite/api-console/advanced-section/dev-console-config/advanced_name_core) section will be inherited. From now on, the update of `api-console-config/core-service.json` for the `api-gateway` will not affect its configuration.

Extensions set from the [API Gateway Advanced files](../../development_suite/api-console/advanced-section/api-gateway/how-to) will keep working even though the service has become a custom service.

If the `API Gateway` service is absent in your project you can now autonomously add it to your branch by creating it from the Marketplace.

Although the `API Gateway` is a custom service, it is not possible to create an endpoint for it.

:::note
Only a single instance of `API Gateway` can exist for each branch. If `API Gateway` is already present among custom services, the marketplace will not show the `API Gateway` plugin.
:::

#### Authorization headers

It is possible to set the environment variable `AUTHORIZATION_HEADERS_TO_PROXY` as a comma separated list of headers which could contain the authorization token used by the user service called by the `USERINFO_URL` and `BACKOFFICE_USERINFO_URL`.

This env variable is not required, and if it is not set the user service is called for every incoming request.
If this env var is set, it brings an enhancement in performance for all APIs called without an authorization header since it avoids calling the user service: user is set as empty.

For more info, visit the [Authorization service documentation](https://docs.mia-platform.eu/docs/runtime_suite/authorization-service/configuration)

### Bug Fix

#### Real-Time Updater with projections changes generation disabled

A bug that prevented users to disable projections changes generation has been fixed. Now, if you set the environment variable `PROJECTIONS_CHANGES_ENABLED` to false, projections changes will not be generated when a projection is updated.

This fix is available with the version `3.1.1` of the Real-Time Updater. New systems will create Real-Time Updater services at this version. Real-Time Updater services already created need to be updated by hand in the dedicated detail page of the service.

https://makeitapp.atlassian.net/browse/RJSC-159

When adding a new Real Time Updater to your configuration, it will be created with the new v3.1.2 version by default.

This patch fixes a misconfiguration that prevented the correct set of boolean environment variables to the service. 
An improvement of the logs has also been made.

#### Correct Deploy Outcome when interpolated variable changes version

In Deploy Area, Deploy details card, a bug that caused the Deploy Outcome to be incorrectly set to "No Update" was fixed. The bug happened when the docker image was dependant on an interpolated variable.

TODO: Also with rtu version

### Breaking Changes 



### Improvements

#### Configmap and Secret Runtime Mount Path

The validation of Runtime Mount Path for configmaps and secrets is now more permissive. It is now possible to specify paths with dots `.` and other special characters.

#### Core services are not chosen during project creation

https://makeitapp.atlassian.net/browse/RJSC-160
https://makeitapp.atlassian.net/browse/RJSC-161 

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version X.X.X`.
