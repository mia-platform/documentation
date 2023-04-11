---
id: v10.8.0
title: Version 10.8.0 Release Notes
sidebar_label: v10.8.0
image: "img/release-note-link-preview.png"
---

_April 13, 2023_

## Console

### New Features

#### Management of Providers trough the Console

Starting from today it will be possible to manage the creation, configuration and edit of the providers used by the Console (GitProvider, Secret Manager and CI/CD Tool) directly using the respective dedicated section in the "Company Overview" area.

Previously this was possible only through the use of specific APIs exposed on the API Portal, while now using a dedicated front-end on the console it will be possible to do it in a guided, simple and intuitive way.

![Providers Section](./img/10.8-providers-section.png)

To learn more about the providers supported by the Console and for a detailed explanation of the Section, [go to the official documentation](/development_suite/set-up-infrastructure/providers-management.md) page for more information.

### Improvements

### Bug Fix

## Fast Data

### New Features

#### Debezium PostgreSQL plugin

You can now find in the Marketplace the [Debezium connector plugin for PostgreSQL](/fast_data/connectors/debezium_cdc.md#postgresql) databases.

### Improvements

### Bug Fix

## Marketplace

### Marketplace Updates

## Backoffice - 1.3.8

### Bug Fix

#### `bk-card` correctly visualizes nested cards

`bk-card` component applies `visualizationOptions` to nested objects, which are rendered as nested cards

#### Components update nesting state in `bk-layout-container`

`bk-search-bar` and `bk-breadcrumb` correctly update their nesting state on layout change inside `bk-layout-container`


## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version X.X.X`.
