---
id: configuration
title: API Portal Configuration
sidebar_label: Configuration
---
This service can be added to your project by visiting Mia-Platform [Marketplace](../../marketplace/overview_marketplace.md) and creating a new microservice from the **API Portal** plugin.

In order to access the [Documentation Portal](../../development_suite/api-portal/api-documentations.md) you should also [create an endpoint](../../development_suite/api-console/api-design/endpoints) that should expose your microservice at the following path: `/documentations/api-portal`. 

:::note
If you expose the Api Portal on a different path, you have to expose the Swagger Aggregator on the correct corresponding path. 
For instance, if you expose the Api Portal on `/my-api-portal`, then you need to expose the Swagger Aggregator on `/my-api-portal/api`. Otherwise, the Api Portal would not be able to get the swagger definitions.
:::

API Portal plugin does not require any configuration file.

## Environment variables

- HTTP_PORT (__required__, default `8080`): port where the web server is exposed.
