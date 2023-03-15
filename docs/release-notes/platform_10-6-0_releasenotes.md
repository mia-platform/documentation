---
id: v10.6.0
title: Version 10.6.0 Release Notes
sidebar_label: v10.6.0
image: "img/release-note-link-preview.png"
---

_March 16, 2023_

## Console

### New Features

### New Features (only available for PaaS users)

Along with the traditional Console New Features, we want to dedicate a specific section for all those new features which are exclusive for PaaS users. You can read about them here below:

#### Feature Preview section

PaaS users can now have visibility of features in Console that are still under development and decide to try out them and give us precious feedback.
For instance, once entered this section, PaaS users can now try the `Dynamic Sidebar` of the Design Area. 
To discover more, let's try this feature and tell us what you think! 
This section can be accessed from the Launchbar by clicking on the `Feature Preview` item inside the dropdown menu that appears when hovering over the user avatar. 

![Feature Preview Modal - Feature Preview modal with some features enabled](./img/10.6/feature-preview.png)

#### User Preferences section

We have introduced a new section named `User Preferences` in which PaaS users can customize their experience in Console according to their own preferences. For instance, inside this section, it is now possible to manage the receipt of an invitation email that is sent when added to a Company. This section is accessible from the Launchbar when hovering over the user avatar.

![User Preferences](./img/10.6/user-preferences.png)

### Improvements

#### Improved filtering in the Manual Routes table

In the Authorization section, inside the Manual Routes table, you can now filter specifically by Microservice and Policy type thanks to two new appropriate filters.

### Bug Fix

This version addressed a few bugs, here is a comprehensive list:

* It has been fixed a bug that prevented users from properly displaying their favorite sections in the Console Launchbar
* We fixed a behavior that, for certain projects, wrongly showed the floppy save icon when selecting a CronJob

## Fast Data

### New Features

#### Fast Data No Code Configuration for ER Schema (only available for PaaS users)

:::info This feature is still in BETA, it is under active development. :::

Are you tired of writing ER Schemas manually? The new Fast Data ER Schema No Code Configuration is now generally available! It is possible to create and generate relationships between Projections using a simple and easy to use no code configuration. The tool is capable to generate a JSON that will be used by the Single View Creator. This generated JSON is exactly the same JSON that would have been written manually in the Low Code Configuration. In order to exploit this functionality you have to open the Projections section and navigate in the new ER Schema tab. You can create a new ER Schema and starting designing it! When configuring the Single View Creator, in the Single Views section, you just have to select one of the ER Schemas created in the aforementioned section from a dropdown list.
This feature will only be available for PaaS users and it can be activated only for specific projects. If you want to try it out, contact your system administrator!
Do not miss out the official documentation here! (<TODO add documentation link>)
(<TODO add screenshot>)

### Improvements

Upgraded Real-Time Updater to version v7.4.1. This newer version come with a revised mechanism for writing projection changes
onto underlying database, slightly speeding it up.

Added link to the Fast Data Low Code Test Template repository inside the Single View section. This repository is used to test and generate configurations for the Single View Creator.

The `Import from DDL` feature on the Projections page now returns a list of projections and evaluates potential duplicates. In that case, an error message is displayed.

### Bug Fix

Newer version v7.4.1 of the Real-Time Updater fixes a bug that caused the generation of multiple projections changes records
when no unique index was set on the projections changes collection.

It is now possible to correctly scroll inside the Single View section when the number of Single Views exceeds the browser window height.

A bug on the index creation inside the Single Views section has been fixed. It is now possible to correctly add several fields without having them disappear. 

## Marketplace

### Marketplace Updates

#### Files Service - v2.6.5

Added support to multi bucket. The Files Service can now be configured with multiple bucket instances.

Also, the new route `GET - /files/` has been added to get the list of files present in a bucket.

## Backoffice

### New Features

### Bug Fix

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version X.X.X`.

