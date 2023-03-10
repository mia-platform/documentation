---
id: v8.6.1
title: Version 8.6.1 Release Notes
sidebar_label: v8.6.1
image: "img/release-note-link-preview.png"
---

_February 14, 2022_

:::danger
This version is affected by a security vulnerability, update to [v8.6.2](./v8.6.2).
:::

### New Features

#### RBAC Manual Routes support also the response filtering

In RBAC section it is now possible to configure a response filtering policy from the Manual Routes tab.
For more information, visit RBAC configuration [documentation](../../development_suite/api-console/api-design/rbac#rbac-response-filtering).

#### RBAC Service v0.5.0

* Added support for response filtering policy, useful to manipulate response data before it is sent to the client.
* Added support for `find_one` and `find_many` builtin functions, useful to fetch data from MongoDB.

### Bug Fix

#### Showing custom routes on API Portal

A bug in the API Portal, which prevented the possibility to include only specific routes of an endpoint, has been corrected. Disable the 'Show in API portal' checkbox for the endpoint and make sure to enable it for the specific route you want: in this way only the route you specified will appear.

#### Import of a schema with an encrypted custom field

A bug, which prevented the possibility to import a collection from JSON with the default fields encrypted, has been corrected.

#### Endpoints Overview

* A bug that made unusable the Section when a tenant had a project with no production environment has been solved. Now an explanatory message error is returned.
* Fixed a broken link to documentation

#### Metrics Area Environment Selection

A bug that caused the selected environment to be reset when entering the Metrics Area has been solved. Now you can access the Metrics Area while keeping the currently selected environment.

### Breaking Changes

#### mlp

The Mia-Platform Launchpad deploy tool, `mlp`, source code is now generally available open source [on GitHub](https://github.com/mia-platform/mlp).
kubernetes supported versions are now increased to cover versions between 1.19 and 1.22.

To install, use the new docker image `ghcr.io/mia-platform/mlp` in your pipelines. 
These changes are totally backward compatible, except only for the removal of `kubectl` from the Docker image of `mlp`. If you are using `kubectl` in the project pipeline you have to install it by yourself.

### Improvements

### Marketplace

#### Single View Creator Low Code

A patch update has been made to fix a bug that caused the generation of a wrong Single View due to an error in the managing of the reference of the dependencies resolution.  
The fix is available since version 3.3.1 of the Single View Creator.
If you are using the Single View Creator Template for the Low Code aggregation instead, the fix is available since version ^1.0.1 of the fast-data-automation-lib library.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.11.3`.
