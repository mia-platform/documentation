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
The service is multi-tenant and managed by Mia-Platform in a different location than the other project services, so check with your Mia-Platform referent if it is available for your project.

The service exposes the API `http://export-service/export` and its configuration is provided in the body of the POST Request.

### Use case
A use case would be to export a report containing the aggregation result which is needed in a particular file format like `xlsx`.

First thing is needed a route that returns a `jsonl` with the data to export.
The Crud Service `/export` API or the [MongoDB Reader](../mongodb-reader/configuration) can both be useful to this need. 
Once the jsonl endpoint is available add the `url` in the [configuration](#configuration) of the Export Service. 

:::caution
Since the Export Service is located in a different location after the hostname of the url add the following command `{{KUBE_NAMESPACE}}.svc.cluster.local`.
This way the service when will know where is located the data to retrieve.
:::

In case you want to export a file with a button in the [Headless CMS](../../business_suite/guide_cms) take note that it is only possible to make GET Requests, so you need a custom adapter service that transforms the POST Request to the Export Service and exposes a GET route returning the exported file.
