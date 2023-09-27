---
id: overview
title: Export Service
sidebar_label: Overview
---
Export Service is a service that exposes an API that allows to export the given input data source in different formats.
The input data source to be exported format must be a [JSON line](https://jsonlines.org/).

The supported output formats are:
* JSON
* CSV
* HTML
* XLSX

## How it works
The service exposes the API `/export` and its configuration is provided in the body of the POST Request.

### Use case
A use case would be to export a report containing the aggregation result which is needed in a particular file format like `xlsx`.

First thing is needed a route that returns a `jsonl` with the data to export.
The CRUD Service `/export` API or the [MongoDB Reader](../mongodb-reader/configuration) can both be useful to this need. 
Once the jsonl endpoint is available add the `url` in the [configuration](#configuration) of the Export Service. 

In case you want to export a file with a button in the [Headless CMS](../../microfrontend-composer/previous-tools/cms/guide_cms.md) take note that it is only possible to make GET Requests, so you need a custom adapter service that transforms the POST Request to the Export Service and exposes a GET route returning the exported file.

## Setup

The Export Service can be used in single, stand-alone projects, released alongside other services, or can be shared among different projects; while the first setup is as easy as adding a new service from the marketplace like [Flow Manager](../flow-manager-service/model_your_first_flow#add-plugin-from-marketplace), the latter may require additional configurations.

### Stand-alone project

This service can be used and installed on any project following this steps:

 1. Add a new microservice using the plugin `Export Service` in the marketplace
 2. Verify default environment variables and resources are correctly configured for your needs
 3. Save configuration and deploy

### Multi-projects Tenant

When your tenant is composed of many projects you may want to share a single export-service among different projects; in order to do so you have to:

 1. decide which should be the project hosting the export-service
 2. in that project, add the export-service plugin from the marketplace and configure it properly

Now that you have created the export-service in one of your projects you can use [cross-project proxies](../../development_suite/api-console/api-design/proxies#create-a-new-cross-projects-proxy) to let other projects, needing export-service capabilities, contact the export-service.
