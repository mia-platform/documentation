---
id: vX.X.X
title: Version X.X.X Release Notes
sidebar_label: vX.X.X
image: "img/release-note-link-preview.png"
---

_Month day, year_

## Console

### New Feature

#### Configuration from tag

In addition to loading branches, it is now possible to load your project tags in Console. It is also possible to create a new branch from a chosen tag. (quesdto vedere se c'è la doc)

#### Shortcut to easily navigate among Console projects and sections

Users can easily switch among Console sections or can choose among different projects thanks to a simple shortcut: `⌘ K`. 
![](../../img/shortcut.jpg) (aggiungere la dodc all'homepage)

#### Dashboards categories

It is now possible to group dashboards in user defined categories. (vedere se c'è la doc su come funzionano e mettere il link)

#### Pin environment card + Aggiungere refresh rate, link al marketplace a agli envs, view all dashboard

On the projects homepage it is possible to pin on top one environment card at a time. (aggiungere alla doc dell'homepage)


### Bug Fix

#### Malformed link urls in homepage

Fixed bug that caused to have multiple `/` characters in link urls of project homepage.

#### Public Variables with ending slash character

Fixed a bug that caused the loss of all public variables if one of them contained a `/` character at the ending.

#### API Gateway fix 


## Fast Data

### New Feature
 
#### Primary Key Index Automation

In Design Area, Projections Section, it is now possible to automatically generate and update a primary key index. The option is turned off by default on existing Projections, while it will be enabled on all Projections created from now on. (vedere se è stata scritta la doc)

#### RTU su Kafka
#### track id 
####max waite time

### Bug Fix

## Marketplace 

#### Timer Service v2.1.0

Route _**/expirations**_ → REST outputMode updated:
- GET and DELETE methods added to the allowed HTTP methods
- payload now is not mandatory anymore and it's default value is `{}`

#### Api-Gateway v5.0.0

Now `X-Forwarded-For` header supports a list of IP address

#### Proxy Manager v1.3.0

Now the service supports an optimized proxy methods configurable by environment variable without saving anything in memory

#### IP Geolocation Service v2.0.2

The service supports a list of ip in the X-Forwarded-For header

#### Auth0 Client

With version v3.2.2 Auth0 Client now provides its OpenAPI Specification through the `/documentation/json` API.

### Improvements

### Real Time Updater 3.5.1

Added new `USE_UPSERT` environment variable to specify whether or not to perform upsert when inserting and updating documents. The default behavior is to perform upsert on insert, keeping backwards compatibility.
Note that, when `USE_UPSERT` is set to `false`, the virtual delete functionality is disabled.   
Added new environment variable KAFKA_CONSUMER_MAX_WAIT_TIME to define the maximum wait time for the Kafka Consumer for new data in batch. Default is 500ms.

### How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version X.X.X`.
