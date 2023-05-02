---
id: v10.9.0
title: Version 10.9.0 Release Notes
sidebar_label: v10.9.0
image: "img/release-note-link-preview.png"
---

_May 04, 2023_

## Console

### New Features

#### Managing Service Accounts at Console level

It is possible to create [Company-independent service accounts](TO-DO link) in case you need to give them privileges to perform [root-level operations](/development_suite/identity-and-access-management/console-levels-and-permission-management.md).

:::info
Only Console Super Users can [add](TO-DO link) or [delete](TO-DO link) Company independent service accounts, manageable exclusively at back-office level.
:::

### Bug Fix

This version addressed a few bugs, here is a comprehensive list:

* 

## Fast Data

### New Features

### Improvements

### Bug Fix

## Marketplace

### New Marketplace Components

### Marketplace Updates

## Backoffice - 1.3.9

### Bug Fix

### New Features

#### `bk-crud-client` allows to disable url writing

New property `reflectToUrl` allows to control whether `bk-crud-client` reflects its state to the URL with a `window.history.pushState`

#### New component `bk-layout-swap`

New component [`bk-layout-swap`](/business_suite/backoffice/components/misc.md#bk-layout-swap) is available. It performs a layout change listening to `layout/change` event. The payload of the event is the layout rendered by the component. It is bundled separately.

### Bug Fix

#### Form components resolve lookups on creation

Form components correctly resolve lookups in initial values from `add-new` event payload

## How to update your Console

For on-premise Console installations, please contact your Mia-Platform referent to know how to use the `Helm chart version X.X.X`.
