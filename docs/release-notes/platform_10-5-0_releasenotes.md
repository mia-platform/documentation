---
id: v10.5.0
title: Version 10.5.0 Release Notes
sidebar_label: v10.5.0
image: "img/release-note-link-preview.png"
---

_February 16, 2023_

## Console

### New Features

#### Backoffice Low Code Configuration

:::info
This feature is still in BETA, do not miss out the official documentation page for further information.
:::

The Backoffice Low Code Configuration is now generally available for all the Console users!
In the dedicated Console section, it is possible to configure your Backoffice pages and layouts, using a Json configuration. It is fitted with a fancy and fully functional preview tool that allows direct interactions with your designed frontend.

[![Mia Platform Backoffice Low Code Configuration](./img/10.5/backoffice-config-low-code.png)]


Don't miss all the other Backoffice improvements in the [dedicated section](#backoffice)!

### Improvements 

### Bug Fix

This version addressed a few bugs, here is a comprehensive list:

* A bug causing a log out when rapidly opening multiple Console tabs has been fixed
* Now, when opening a Console URL, you are correctly redirected to the specific resource even when you have to login first
* Debug section now appears correctly visible again

## Fast Data

### New Features

#### Automatic generation of Aggregation

A basic Aggregation configuration can be automatically generated starting from an ER Schema. The file is intended to be a basic file that must be modified by the user in order to complete all the needed configurations. Check the [official documentation](../fast_data/configuration/single_view_creator/low_code#aggregation) for any further details.

### Improvements

### Deprecations

Starting from this Console release the configuration of Fast Data projections from the Console _Advanced Section_ is considered deprecated.
From now onward we strongly recommend using only the Console pages dedicated to Fast Data in the design section.  
Consequently, please consider verifying whether any of your project is using such section to define Fast Data projections and migrate
them to the supported page. 

Below is reported a screenshot of the section that is going to be deprecated:

[![Mia Platform Advanced Section - Fast Data section highlighted in orange](./img/10.5/advanced_section_fast_data.jpg)]

#### PR update topics are now editable

The PR update topic table inside each Projection page now allows topics to be updated.
 
### Bug Fix

## Marketplace

### New Marketplace Components

### Marketplace Updates

## Backoffice 

### New Features

### Improvements

### Bug Fix

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version X.X.X`.
