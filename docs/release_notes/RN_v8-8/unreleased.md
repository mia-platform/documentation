---
id: v8.8.0
title: Version 8.8.0 Release Notes
sidebar_label: v8.8.0
image: "img/release-note-link-preview.png"
---

_March x, 2022_

## Fast Data

### New Features

#### MongoDB v5 support

Since Single View Creator v3.5.1 and Realtime Updater v5.0.2 is officially supported MongoDB v5
>>>>>[DA DETTAGLIARE - Fast Data supporta Mongo 5] Se utilizzi il SVC, aggiornare driver Mongoa a 4.4.1.
Vedi la lista di tutti i ms che supportano Mongo 5 qui sotto [link]

#### Configure Kafka timeout and interval on Realtime Updater

Since v5.2.0 Kafka connection and session timeout, and Heartbeat interval can now be configured on [Realtime Updater](/docs/fast_data/real_time_updater/configuration#environment-variables)

#### Prevent projection overwrite by old message is not enabled by default

Since v5.0.2 the env FORCE_CHECK_ON_OFFSET to prevent projection to be overwritten by old message is now enabled by default.

#### Enrichment of Aggregation Low Code with Expression Logic features

Since v3.6.0 of Single View Creator Low Code, aggregation schema v1.1.0 supports now expression logic to make conditional behaviour on aggregation and dependency to use.    
Aggregation schema is not validated against a JSON Schema to ensure static correctness.

#### Test aggregation Low Code

Your aggregation schema can now be tested thanks to a Repository Template on [Github](https://github.com/mia-platform/fast-data-low-code-test-template)

>>>>>>>Visualizzo lo stato di una projection o di un sistema
Descrizione: le projection che presentano un warning sono le prime mostrate nella tabella delle projection

## Console

### New features

#### Improved navigation in the Runtime area

The status filter applied to the pod table is now maintained while navigating through the details of individual pods.

#### Dashboards can be opened on a new dedicated tab 

On Dashboard area, user can choose if a dashboard has to be opened on a new tab instead of in iframe mode.

>>>>>>>>>Posso modificare i tag per tutte le tipologie di endpoint

### Bug Fix

#### Improved stability of console pages

A bug that caused the appearance of an endless-spinner at the scroll of some pages in the console has been fixed.

### Breaking Changes

### Improvements

>>>>>>>>Migliorato il tempo di caricamento dell'Overview di progetto

>>>>>>>>>Cercare gli endpoint scrivendo il nome del microservizio

## Marketplace

>>>>>>>> LISTA SERVIZI CHE SUPPORTANO MONGO 5

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

### CMS Site v9.14.4

In the microservice configurations can now be defined the filesCollection property to choose the collection that will be used to store uploaded files. Default value is files.

>>>>>>>>>>Mongo DB Query Exporter supporta Mongo 5
!! VEDI SOPRA, mettiamo lista

## Backoffice

### New features

### Improvements

### Bug Fix

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.x.x`.
