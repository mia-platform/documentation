---
id: v6.4.0
title: Version 6.4.x Release Notes
sidebar_label: v6.4.x
---

## v6.4.2

_January 20, 2021_

### Improvements

Microservice-gateway node version has been updated to `lts Node 14`.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.0.15`.

## v6.4.1

_January 14, 2021_

### New features

#### Files deletion from Git repository

Service related files deletion is now supported: when a service is deleted from the console, all of its files will be deleted from git repos.  
For instance, the files list includes:

- in `/configuration` folder:
  - `service` and `deployment` YAML files for the deleted service
  - configmaps YAML files
- in `/config-maps` folder:  
  - folders related to the deleted configmaps for the service  

Specific file deletion is supported too, without the needing to delete an entire service.

Also *HPA* YAML files will be deleted for services whose replicas generation has been disabled.

### Bug fix

#### Advanced files shown as empty content

When using the *Advanced Section* in the *Design Area* of the Console, some files where shown as *Empty Content* in the sidebar even if they had content, the bug has been fixed.

#### CMS User search with multiple Auth0 connections

User search from the CMS has been fixed for projects having multiple users connections.

### Improvements

#### Proxy page

Information displayed in the [Proxies](../development_suite/api-console/api-design/proxy.md) page are now editable.

#### General UX/UI improvements

A new icon has been introduced for external links, forms now properly feature field autofocus to help usability and many more minor improvements has been introduced.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.0.14`.

## v6.4.0

_January 07, 2021_

### New features

#### Management of endpoint visibility in the API Portal

The endpoints and routes now can be hidden from the [API Portal documentation](../development_suite/api-portal/api-documentations.md).
You can do this in the [Management section](../development_suite/api-console/api-design/endpoints.md#manage-the-visibility-of-your-endpoints) of the endpoint you want to hide.

#### New icons

The Console now features a new set of icons and colors 🎉

#### Data of type Number can be added trough Date Time interface

The CMS can be configured in order to use _Date Time interface type_ for data of type _Number_.

### Marketplace updates

The markeplace has been thoroughly updated as many services received security udpates, bug fixes and new features.

* ACL Service v2.0.1 `nexus.mia-platform.eu/core/acl-service:2.0.1`
* ANIA Service v4.0.1 `nexus.mia-platform.eu/plugins/ania-service:4.0.1`
* Auth0 Client v3.1.0 `nexus.mia-platform.eu/core/auth0-client:3.1.0`
* Authentication Service v2.0.0 `nexus.mia-platform.eu/core/authentication-service:2.0.0`
* Client Credentials v2.0.1 `nexus.mia-platform.eu/core/client-credentials:2.0.1`
* CRUD Service v3.2.0 `nexus.mia-platform.eu/core/crud-service:3.2.0`
* Data Visualization v1.7.1 `nexus.mia-platform.eu/backoffice/data-visualization:1.7.1`
* Charts Service v2.0.1 `nexus.mia-platform.eu/core/charts-service:2.0.1`
* Doctor Service v2.0.0 `nexus.mia-platform.eu/core/doctor-service:2.0.0`
* Files Service v2.1.0 `nexus.mia-platform.eu/plugins/files-service:2.1.0`
* Flow Manager v2.1.1 `nexus.mia-platform.eu/core/flow-manager:2.1.1`
* Function Service v2.1.0 `nexus.mia-platform.eu/core/function-service:2.1.0`
* IP Geolocation Service v2.0.0 `nexus.mia-platform.eu/plugins/ip-geolocation-service:2.0.0`
* Kafka2Firebase v1.0.2 `nexus.mia-platform.eu/plugins/kafka2firebase:1.0.2`
* Mongo2Kafka v1.0.3 `nexus.mia-platform.eu/core/mongo2kafka:1.0.3`
* MongoDB Reader v2.0.1 `nexus.mia-platform.eu/core/mongodb-reader:2.0.1`
* Push Notifications Manager v2.0.1 `nexus.mia-platform.eu/plugins/notifications-manager:2.0.1`
* Push Notification Sender v2.0.1 `nexus.mia-platform.eu/plugins/notifications-service:2.0.1`
* SES Mail Notification Service v2.0.2 `nexus.mia-platform.eu/plugins/ses-mail-notification-service:2.0.2`
* SMTP Mail Notification Service v2.0.2 `nexus.mia-platform.eu/plugins/smtp-mail-notification-service:2.0.2`
* SQL DB Reader v3.0.0 `nexus.mia-platform.eu/core/db-sql-reader:3.0.0`
* Timeline Viewer v2.1.0 `nexus.mia-platform.eu/backoffice/timeline:2.1.0`
* Timer Service v2.0.1 `nexus.mia-platform.eu/core/timer-service:2.0.1`
* Token Service v2.0.0 `nexus.mia-platform.eu/plugins/token-service:2.0.0`

### Bug fix

#### Data visualization [0,0] coordinates

Fixed a bug causing a page crash when using bubble chart map with Highmaps data format and some data has **[0,0]** coordinates.

Use `DataVisualization v1.7.1` to take advantage of the fix.

#### CMS

Custom default zoom for GeoPoint interface types has been fixed.

Use `CMS Site v9.12.4` to take advantage of the fix, make sure you follow the guide about [how to update your CMS](../business_suite/update_cms).

#### Client Credentials

Fix issues of clients with public key set as empty object when auth method is `client_secret_basic`. Now the request is correctly handled.

Use `Client Credentials service v2.0.1` to take advantage of the fix.

### Improvements

#### Marketplace documentation

Code snippets have now a different layout to better differentiate them from regular text.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 3.0.13`.
