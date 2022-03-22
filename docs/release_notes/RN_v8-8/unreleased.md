---
id: v8.8.0
title: Version 8.8.0 Release Notes
sidebar_label: v8.8.0
image: "img/release-note-link-preview.png"
---

_March x, 2022_

## Fast Data

### New Features


## Console

### New features


### Bug Fix

### Breaking Changes

### Improvements

## Marketplace

### Flow Manager v2.4.0

The Flow Manager service will now notify kafka connection errors via its status routes, so if you need the service to restart when Kafka connection fails, make sure you have configured them correctly.

### Dev Portal Application Update 

With this update the dev portal application is enriched with many new features and improvements:

- The concept of Tag has been introduced in the Marketplace. It is now possible to assign more tags to each marketplace component, and at the same time the visualization of the cards has been improved;
- The consultation of your functional documentation is smarter! It is now possible to search very quickly pages or single paragraphs through the use of the search input in the documentation section;
- New configuration of the modal and drawer components! From now on, thanks to a confirmation modal, users editing content in the backoffice section are warned before losing their changes and protected from accidental mistakes;
- The Backoffice now offers the possibility to adopt a template for the Marketplace detail pages! It is now possible to use a predefined structure to fasten the creation of any components page. A default template is already included in the Dev Portal application, but it can be also modified as needed;
- The Marketplace now offers a new table of content! When opening the detail page of an API, the content created with the editor from the backoffice will automatically generate a navigable directory tree on the side of the page. Each option will be clickable, so you will not need to scroll all the way to a specific section anymore;
- The style of the topbar has been improved, in a modern and more linear way.

### RBAC Service v0.8.2

A new version of RBAC Service is available featuring some small bug fixes.

### CRUD Service v5.1.0

A new version of CRUD Service is available featuring support for MongoDB Views definitions

## Backoffice

### New features

### Improvements

### Bug Fix

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.x.x`.
