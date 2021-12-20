---
id: v8.4.0
title: Version 8.4.0 Release Notes
sidebar_label: v8.4.0
image: "img/release-note-link-preview.png"
---

_December 21, 2021_

## Console

### New Features

#### Dev Portal v1.2

![dev-portal-application](../../dev_portal/img/dev_portal_application.png)

The [new version 1.2 of the Dev Portal](../../dev_portal/overview.md) application has been released!  
This version brings with it interesting new features: a new modern Marketplace to document and organize your APIs and Events;  a new concrete content management system built with Mia Backoffice; a system for managing requests integrated into the marketplace and many other features!

Run to the Console Marketplace and try it now!

#### Homepage switch

It is possible to switch between [Basic Homepage](../../development_suite/overview-dev-suite#basic-homepage) and [Metrics Homepage](../../development_suite/overview-dev-suite#homepage) using `command + k` interface.

#### Default branch selection

When opening the Design Area, the branch selection modal will show the default branch that you can set up in the CMS of your project with the property `defaultBranch`. If not set in the CMS, it will retrieve the default branch from the provider of your project.

### Bug Fix

#### Correct project homepage visualization

Fixed a bug that caused the homepage to show for a few seconds the information of a previously opened project when a new project is selected.  

#### Multiple configmaps files elimination

Fixed a bug that did not allow the elimination of files belonging to different configmaps.

### Marketplace updates

#### API Portal 1.14.3

In this version a series of bugs that affected the correct functioning of the API Portal have been fixed:

- a bug that slowed down and blocked the whole portal in the case of very large API responses;
- a bug that did not allow to modify and save changes in the request body;
- a bug that did not allow to correctly read the names of custom types as defined.

#### Swagger Aggregator 3.4.3

Improved and enhanced error logging.

#### CMS Site 9.14.3

It's now possible to configure different files services within a single CMS.

#### Auth0 Client v3.2.2

This version fixes a bug in user search query generation when a connection is specified.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.6.6`.
