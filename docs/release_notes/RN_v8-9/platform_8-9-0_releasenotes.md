---
id: v8.9.0
title: Version v8.9.0 Release Notes
sidebar_label: v8.9.0
image: "img/release-note-link-preview.png"
---

_RELEASE_DATE_

## Fast Data

### New Features

## Console

### New features

#### Logs of multiple pods

The Runtime area has been enriched! It is now possible to monitor the logs of multiple pods at the same time, for a maximum of 5 selected containers.

### Bug Fix

### Breaking Changes

### Improvements

## Marketplace

### New Marketplace components

### React App Template

Update Template to new version of React and migrate testing suite from enzyme to react testing library.

[Visit template repository to this link](https://github.com/mia-platform-marketplace/React-App-Template)

### Typescript React App Template

Added new marketplace component to handle React based webpage with TypeScript from the DevOps Console

[Visit template repository to this link](https://github.com/mia-platform-marketplace/Typescript-React-App-Template)
### Security update for the following microservices

#### Crud Service v5.2.1

Fixed a bug that caused null values in _q query filter to not being handled correctly for GET endpoints

Also, support for $first project operator in _rawp query param has been added.

### Single View Creator v3.7.2

Single View Creator plugin and template have been updated to v3.7.2. This version fixes a bug that could cause a Projection changes to not be processed due to starvation. Projection changes are now read in order of creation, thus granting they will eventually be read.

This fix is also available for Single View Creator template updating the library @mia-platform-internal/single-view-creator-lib to ^9.7.1.

### API Portal v1.16.0

The API Portal has a new cleaner look! Request and response tabs have been redesigned to include their own example and now it possible to switch between codes and content-types.

## Backoffice

### New features

### Improvements

### Bug Fix

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.13.4`.
