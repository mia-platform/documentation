---
id: v10.0.0
title: Version v10.0.0 Release Notes
sidebar_label: v10.0.0
image: "img/release-note-link-preview.png"
---

_October 20th, 2022_

## Console

### New Features

#### Self-service Cluster Management

Through a brand new section in the console it’s possible to manage the infrastructure on which to deploy the Projects: in fact, it is possible to connect and manage Kubernetes Clusters through a handy interface and view some details about it, regardless of the Vendor and Kubernetes distribution installed. Find out more [here](../../development_suite/clusters-management).

#### Self-service Project Environment management

The Environment section of the console has been enhanced, providing the ability for a user with respective permissions to be able to add, edit and delete an environment directly through a dedicated graphical interface on console. Find out more [here](../../development_suite/set-up-infrastructure/runtime-environments).

#### Project Quick Links

Now, inside the Metrics Homepage, a Project Administrator (or Company Owner) can set up some Project Quick Links that will make it easy for you to access other tools related to your project. These links can help teams to better structure developer workflows and speed up their processes. Find out more [here](../../development_suite/overview-dev-suite#project-links-and-dashboards).

![Mia-Platform Console Metrics Homepage](../img/10.0/Mia-Platform-metrics-homepage.png)

### Bug Fix

#### Merge flow improvements

While still in BETA, there have been several improvements to the Merge experience:

- ConfigMaps files are correctly deleted after you've merged
- CronJobs and Advanced Services are now correctly supported in the merge flow, allowing you to save your configuration with ease

#### Visibility of more than 20 branches from the selection branch modal

It has been fixed a bug that prevented viewing and browsing more than 20 branches inside of the selection branch modal.

#### Fixed the view of long environment names

Now it has been fixed a bug of displaying long environment names on the environment selection

## Marketplace

### CRUD Service v6.0.1

A new version of the CRUD Service has been released, including fixes on nullable fields and the complete support for Mongo partial indexes.

## Backoffice

### New Features

#### Enable `urlMask` in `bk-table` buttons
`bk-button` components now allow to utilize `urlMask` parameters within `actionConfig` when used as `customActions` inside a `bk-table` component

### Bug Fix

#### Correct date format in readonly forms
`bk-form-drawer` and `bk-form-modal` show `readOnly` dates with correct format, specified in `dateOptions`

#### Components load until lookups aren't solved
`bk-crud-lookup-client` emits loading events so that components load until lookups aren't solved

#### Query correctly sets skip parameter
skip query parameter (`_sk`) is reset when fetching data (unless query was triggered by pagination update)

#### Fixed filters on date fields
`bk-filters-drawer` correctly filters fields with format `date`

#### `bk-layout-container` allows to disable shadow-dom
`bk-layout-container` supports disabling its render root as shadow dom. Useful to embed `bk-calendar`

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 8.1.0`.
