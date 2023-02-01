---
id: v10.4.0
title: Version 10.4.0 Release Notes
sidebar_label: v10.4.0
image: "img/release-note-link-preview.png"
---

_February 2, 2023_

## Console

### New Features

#### View all Kubernetes resources in the Runtime area

The Runtime area now features all the resources managed in Console that you can interact with, with these new sections you'll be able to view information for all running [Deployments](/development_suite/monitoring/resources/deployments.md), [Services](/development_suite/monitoring/resources/services.md), [CronJobs](/development_suite/monitoring/resources/cronjobs.md) and [Jobs](/development_suite/monitoring/resources/jobs.md).

:::tip
Check out the **[Runtime area documentation](/development_suite/monitoring/introduction.md)** to know more!
:::

#### Information tooltips in the Design sidebar menu

In the Design area, you can now display an information tooltip when hovering over the name of a specific section in the sidebar menu. 

### Security improvements 

#### Security issue on Dashboard Area

A security issue that allowed malicious scripts to be inserted into the Dashboard Area has been corrected.

### Improvements

#### Full-screen mode improvement

Editor full-screen mode is now limited in the tab context, allowing you to navigate your browser tabs without the need to exit the full-screen mode itself!

#### Update of the Deployment experience

The console deployment experience has been updated. It is now also possible to access the Runtime Area upon completion of the deployment by clicking on a button on the respective modal.

### Bug Fix

This version addressed a few bugs, here is a comprehensive list:

  * A bug affecting ConfigMap editors with many lines has been fixed
  * Project Template management from CMS has now been limited only to Company Owners and to Super Administrators through the addition of specific permissions

## Fast Data

### New Features

#### Single View Creator 5.6.5 support for MongoDB v6

Added support for MongoDB v6 in the Single View creator version 5.6.5.

### Improvements

#### Replace strategy in Single View Creator 5.6.5 now adds a `createdAt` field

From version 5.6.5 the Single View Creator having the `UPSERT_STRATEGY` environment variable set to `replace` adds a `createdAt` field in the Single View whenever a Single View is inserted or replaced.

#### Added prometheus metrics for the SV-patch operation

Single View Creator 5.6.4 now provides metrics for the SV-patch operation having added a prometheus label called `resolutionMethod` which can be `PATCH` or `AGGREGATION`.

### Bug Fix

#### Single View Creator 5.6.5 fixes SV-patch primary key date field

The Single View Creator in PATCH operation didn't handle dates as primary keys correctly which resulted in no Single View updated.
Now, from version 5.6.5 of the service, any kind of primary key field type it is properly handled.

#### Single View Creator 5.6.5 retries the message processing instead of skipping

From version 5.6.5 the Single View Creator retries the message processing when an unexpected error is thrown instead of skipping the message.

## Marketplace

### New Marketplace Components

### Marketplace Updates

## Backoffice

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 8.2.17`.
