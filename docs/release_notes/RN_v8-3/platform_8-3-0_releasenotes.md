---
id: v8.3.0
title: Version 8.3.0 Release Notes
sidebar_label: v8.3.0
image: "img/release-note-link-preview.png"
---

_December 1, 2021_

## Console

### New Feature

#### Configuration from tag

In addition to loading branches, it is now possible to load your project tags in Console. It is also possible to create a new branch from a chosen tag.

#### Shortcut to easily navigate among Console projects and sections

Users can easily switch among Console sections or can choose among different projects thanks to a simple shortcut: `⌘ + K` (alternatively, `ctrl + K`).

![Navigation shortcut](./../img/shortcut.jpg)

#### Dashboards categories

It is now possible to group dashboards in user defined [categories](../../development_suite/monitoring/dashboard#add-a-dashboard).

### Improvements

#### Project Homepage

The project homepage has been improved with the following new features:

- It is possible to pin on top one environment card at a time.
- Buttons to **Marketplace** and **Environments & Private Variables** sections have been added for easier navigation.
- It is now possible to automatically refresh the content of the environment cards to see updated statistics of your pods.
- **View All** link has been added to all environment cards to directly redirect to the **Dashboards** section.

### Bug Fix

#### Malformed link urls in homepage

Fixed bug that caused to have multiple `/` characters in link urls of project homepage.

#### Public Variables with ending slash character

Fixed a bug that caused the loss of all public variables if one of them contained a `/` character at the ending.

#### API Gateway fix

## Fast Data

### Real Time Updater

The Real Time Updater service has been updated to v3.5.1.

#### Upsert your projection or handle whether it is an insert or an update separately

Added new `USE_UPSERT` environment variable to specify whether or not to perform upsert when inserting and updating documents. The default behavior is to perform upsert on insert, keeping backwards compatibility.
Note that, when `USE_UPSERT` is set to `false`, the virtual delete functionality is disabled.  

#### Set the maximum wait time for new data for the Real Time Updater Kafka consumer

A new environment variable KAFKA_CONSUMER_MAX_WAIT_TIME is now available to define the maximum wait time for the Kafka Consumer for new data in batch. Default is 500ms.

#### Track which is the topic that triggered the changes

Projections and projection changes have now new fields which contain the information about the Kafka Topic that triggered the change. [Read more](../../fast_data/real_time_updater/configuration#tracking-the-changes).

#### Projection changes to Kafka

You can configure the Real Time Updater to send the projection changes to a Kafka topic as well. [Click here](../../fast_data/real_time_updater/configuration#kafka-projection-changes-configuration) to know how to do that.

### New Feature

#### Primary Key Index Automation

In Design Area, Projections Section, it is now possible to automatically generate and update a primary key index. The option is turned off by default on existing Projections, while it will be enabled on all Projections created from now on.

## Marketplace

### Improvements

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

#### Auth0 Client v3.2.2

Auth0 Client now provides its OpenAPI Specification through the `/documentation/json` API.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.5.4`.
