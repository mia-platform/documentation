---
id: v10.7.0
title: Version 10.7.0 Release Notes
sidebar_label: v10.7.0
image: "img/release-note-link-preview.png"
---

_March 30, 2023_

## Console

### New Features

#### Machine-to-Machine Authentication

<!-- TODO: add description -->

### Bug Fix

### Breaking Changes 

### Improvements
### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version ?.?.?`.

## Fast Data

### Improvements

#### Design improvements for the Fast Data Configuration for ER Schema

The Fast Data ER Schema No Code Configuration has been improved with design enhancements to display the ER Schema with a better appearance, larger buttons, and more useful descriptions to assist you in creating your ER Schema.

#### Single View Creators

The _Single View_ page has been updated with a new look for the Single View Creator section. This update features a clearer list of the microservices associated with the Single View, as well as a dedicated page for updating their configurations.

### Bug Fix

This version addressed a few bugs, here is a comprehensive list:
* A bug on the No Code configuration caused the Undo/Redo button to not be available when deleting a projection
* The condition panel in the No Code configuration is now scrollable

## Backoffice - 1.3.7

### New Features

#### `bk-antd-theme-manager` component

New component `bk-antd-theme-manager` is available, allowing micro-lc layout customization.

#### `bk-loading-animation` component

New component `bk-loading-animation` is availabe, allowing micro-lc layout customization, and bundled at `/dist/bk-loading-animation.esm.js`.

#### Support to http credentials
Components which perform http-calls (eg, `bk-crud-client`) have property `credentials`, which specifies credentials of http calls


### Bug Fix

#### Files are downloaded with correct name
Files are downloaded with correct name, instead of applying "_" at the beginning and end of it.

## Marketplace

## Backoffice