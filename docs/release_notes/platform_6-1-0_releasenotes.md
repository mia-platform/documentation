---
id: v6.1.0
title: v6.1.0
sidebar_label: v6.1.0
---

_October 12, 2020_

## New Features

### Marketplace categories

In the marketplace of the DevOps Console services are grouped by categories based on their functionality.
Services can be filtered by category as well as by service type.

:::info
It is possible for on-premise installations to add categories and assign them to your services from the CMS.
:::

![Marketplace Categories](./img/v6.1.0-marketplace-categories.png)

### Text Plain log parser

A new log parser is available for plain text logs, available options are now: `mia-json`, `mia-nginx`, `mia-plain`, `Not Collected`.

### Project homepage cards revision

The cards in your project homepage have been revised, the Marketplace card has a new logo, while documentations cards have been collapsed in a single one.

![New project homepage cards](./img/v6.1.0-projects-docs-and-marketplace-cards.png)

## Bug fix

### Duplicate environment variables crash

Fixed a bug that caused an application crash when entering two duplicate environment variables for a custom microservice.

### Auth0 token refresh for password grant type

Fixed a bug preventing token refresh when using `grant_type` password

### App crash on Endpoint without tags

Fixed a bug that caused application crash when an endpoint had no existing tag. 

## Library updates

### Logging update

Open source libraries [custom plugin lib](https://github.com/mia-platform/custom-plugin-lib), [lc39](https://github.com/mia-platform/lc39) and [glogger](https://github.com/mia-platform/glogger) received a major update.

The new versions feature new logging format based on [Mia-Platform guidelines](../development_suite/monitoring-dashboard/dev_ops_guide/log.md).

See library changelogs to find out more.

### Welcome .Net library! 🎉

A new service library for **.Net** has been released!

Checkout [Mia Service .Net Library](https://github.com/mia-platform/Mia-service-Net-Library) on GitHub.

### Backoffice CRUD Rewrite

A bug affecting the CMS was preventing display and export of collections with rewrite between the exposed endpoint and the configured internal CRUD route.

## How to update your DevOps Console?

For on-premise Console installations, you have to use the [Helm chart](https://git.tools.mia-platform.eu/platform/devops/console-helm-chart) version `2.4.5`.

:::note
The following _Feature Toggles_ have been removed:

* `FT_ENABLE_CRONJOB` 
* `FT_ENABLE_CREATE_CONFIG_MAP_CUSTOM_SERVICE` 
* `FT_ENABLE_MICROSERVICE_GATEWAY_SKIP`
* `FT_ENABLE_CREATE_PROJECT_ON_INFRASTRUCTURE_WEBSITE`
:::
