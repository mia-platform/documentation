---
id: v8.6.0
title: Version 8.6.0 Release Notes
sidebar_label: v8.6.0
image: "img/release-note-link-preview.png"
---

_January 27, 2022_

## Console

### New features

#### Fast data No code

In this new version of the console we are glad to announce the [Fast Data Low Code](../../fast_data/no_code_overview.md), a completely new customer experience studied to reduce the development time of your Fast Data project.

With Fast Data Low Code, the console will support you as it has never done before. The Real Time Updater Low Code and the Single View Creator Low Code could be configured with a few clicks. Moreover, with the v8.6.0 it is possible to write the configuration files such as `erSchema`, `projectionchanges`, `singleviewKey` and `aggregation` in .json format inside the console, significantly reducing the setup complexity.
Even the strategies could be automatically managed by clicking on the "Low Code" button, allowing the console to do the dirty work for you.  

#### Rbac support filtering on response body

Rbac service now can manipulate the body of a response through the use of a proper configuration and policy

#### Shared ConfigMaps now show the services they are shared with

When viewing a ConfigMap related to a microservice or cronjob, if it is shared with other services, you will see some text on the top right corner of the card. With this new feature, you can click there, opening a dropdown menu that will let you navigate to one of the services the ConfigMap is shared with.

#### Support dropdown menu in Launcher

The support icon in the Console launcher will now open a menu with multiple links to Mia Platform support.

#### Endpoints Overview

The previous tool *Tenant Overview* has been renamed in *Endpoint Overview*, and now it is possible access to the related section by clicking on the related button in the project page. Moreover, we introduce the filtering on endpoints through the new *Proxied By* feature. Click [here](../../development_suite/endpoint-overview/endpoint-overview) for more information. 

### Bug Fix

#### Project Page

- Fixed bug related the warning "we could not retrieve metrics data". It was based on production data. Now the project cards will display an environment with at least one deploy.

#### Policy testing in RBAC section

Now it is possible to test policies that adopt custom builtin functions.

#### Projection fields table hidden import warning

When importing an incorrect JSON file into the projection fields table an alert message is shown. If another alert was already displayed, the import warning will be hidden behind the other alert. Now both alerts are displayed correctly.

#### Save on another existing branch error

Saving any change from a branch to another existing one is not allowed and caused an error to be displayed. Now it is only possible to save on the current branch or on a new one.

#### Popup on the sidebars of the console

A malfunction on the pop-up displayed when the sidebar were collapsed has been fixed. This error was reported for deploy area, design area and runtime area.

#### Link `View Flow Manager`

`View Flow Manager` link that was in the detail page of Flow Manager microservices return to be visible and working

#### Create service from docker image

Now, when clicking Create from docker image, the form validation errors are not displayed before the user writes their configuration

### Improvements

#### Console Editors component

We have added support to `Rego` language, to improve the user experience in reading and editing policies.

#### Table pagination for collections

CRUD, projection and single view tables are now paginated and display a limited amount of items per page. This has been done in order to avoid performance reductions when many table rows should be displayed.

#### Logger for Kafka message adapters

Now the basic and golden-gate kafka-message-adapters will have by default a debug level logger.
The custom kafka-message-adapter will now support a logger that can be fully customizable.

## Marketplace

### New marketplace services

#### Export service v1.0.5

Export Service is a service that exposes an API that allows to export the given input data source in different formats.
Read more about our service at this [link](https://docs.mia-platform.eu/docs/runtime_suite/export-service/overview)

### Marketplace updates

#### Drools Application

Now it's possible to create a Drools application composed by a Workbench and a Kie server from the Marketplace.

#### Client Credentials to v3.1.0

Added the optional allowedCustomClaims property to clients, to allow clients that use the private_key_jwt authentication method to add custom claims into the client_assertion, that will be added into returned the JWT claims.
Added possibility to set a clock skew, that will be used in the /oauth/token request to validate the `iat` and `notBefore` claim timestamps.

#### API Portal v1.15.0

The stability and general reliability of the API portal has been increased allowing a correct visualization of the APIs even if the service of a specific API does not respond or has an invalid definition.
Furthermore, with this version, API routes are now saved in the url. In this way, links containing a specific route will scroll the page to the apposite section, opening the relative API route explorer.

#### Swagger Aggregator v3.4.4

Functional modification to allow a correct visualization of the APIs in the API Portal even if the service of a specific API does not respond or has an invalid definition.

## How to update your Console

For on-premise Console installations, please contact your Mia Platform referent to know how to use the `Helm chart version 5.10.0`.
