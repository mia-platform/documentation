---
id: vX.X.X
title: Version X.X.X Release Notes
sidebar_label: vX.X.X
image: "img/release-note-link-preview.png"
---

_Month day, year_

### Breaking Changes 

### New Features

#### Dashboards categories

It is now possible to group dashboards in user defined categories.

#### Primary Key Index Automation

In Design Area, Projections Section, it is now possible to automatically generate and update a primary key index. The option is turned off by default on existing Projections, while it will be enabled on all Projections created from now on.

#### Configuration from tag

In addition to loading branches, it is now possible to load your project tags in Console. It is also possible to create a new branch from a chosen tag.

#### Pin environment card

On the projects homepage it is possible to pin on top one environment card at a time.

### Bug Fix

#### Malformed link urls in homepage

Fixed bug that caused to have multiple `/` characters in link urls of project homepage.

### Marketplace Updates

#### Auth0 Client v3.2.2

Implemented API to serve OpenAPI 3 documentation on `/documentation/json`.

#### Timer Service v2.1.0

Route _**/expirations**_ → REST outputMode updated:
- GET and DELETE methods added to the allowed HTTP methods
- payload now is not mandatory anymore and it's default value is `{}`

### Improvements

### Real Time Updater 3.3.1

Added new `USE_UPSERT` environment variable to specify whether or not to perform upsert when inserting and updating documents. The default behavior is to perform upsert on insert, keeping backwards compatibility.
Note that, when `USE_UPSERT` is set to `false`, the virtual delete functionality is disabled.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version X.X.X`.
