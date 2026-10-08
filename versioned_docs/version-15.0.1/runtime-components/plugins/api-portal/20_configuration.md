---
id: configuration
title: API Portal Configuration
sidebar_label: Configuration
---



The **API Portal** microservice can be added to your project by visiting Mia-Platform [Marketplace](/runtime-components/overview_marketplace.md). It works best with the [Swagger Aggregator](/runtime-components/plugins/swagger-aggregator/10_overview.md) but it's possible to use it with a custom microservice if the correct data are returned.

:::note
You can select the [API Documentation](/runtime-components/applications/api-documentation-aggregator/10_overview.md) application on the [Marketplace](/runtime-components/overview_marketplace.md) to have a ready-to-use `API Portal` that works with the `Swagger Aggregator` microservice.
:::

## Routes

The **API Portal** requires to expose two routes: `/api/openapi/`, `/api/openapi/raw/`

The main endpoints are:

* `/api/openapi/json`: it expects a compliant [Open API specification document](https://swagger.io/resources/open-api/). All versions are supported;

* `/api/openapi/subswaggers/`: it expects an array of objects like `[{"name": "<subswagger-name>", "categoryUrl": "<subswagger-url>"}]`. The `categoryUrl` is joined, using [path.join](https://www.npmjs.com/package/path), with `/api/openapi/json`. To understand what is a subswagger, please see [this page](/products/console/api-console/advanced-section/swagger-aggregator/configuration.md#subswaggers).

The endpoints regarding the downloads are:

* `/api/openapi/raw/swagger/json` and `/api/openapi/raw/swagger/yaml`: it expects a [Open API v2 (swagger)](https://swagger.io/specification/v2/) object in json and yaml format respectively

* `/api/openapi/raw/openapi/v3/json` and `/api/openapi/raw/openapi/v3/yaml`: it expects a [Open API v3](https://swagger.io/specification/v3/) object in json and yaml format respectively

* `/api/openapi/raw/openapi/v3-1/json` and `/api/openapi/raw/openapi/v3-1/yaml`: it expects a [Open API v3.1](https://swagger.io/specification/) object in json and yaml format respectively

When a category is selected, it calls all the paths above, except for the subswaggers endpoint, joined with the corresponding `categoryUrl`.
For example, if the selected category has `categoryUrl = ../category1.json`, the routes called will be:

* `/api/openapi/category1.json`
* `/api/openapi/raw/swagger/category1.json` and `/api/openapi/raw/swagger/category1.json/yaml`
* `/api/openapi/raw/openapi/v3/category1.json` and `/api/openapi/raw/openapi/v3/category1.json/yaml`
* `/api/openapi/raw/openapi/v3-1/category1.json` and `/api/openapi/raw/openapi/v3-1/category1.json/yaml`

Every time `/api/openapi/json` is called, the API Portal also calls GET `/api/openapi/raw/ui-config` to retrieve an optional UI configuration object (the call **is allowed to fail**). At the moment, the object should have only one optional property `oauthConfig` which should be and object containing a [swagger-ui OAuth 2.0 configuration](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/oauth2.md).

In addiction to these required endpoints, there is the `/documentations/api-portal/config` endpoint that expects a json with an `apiPrefix`, such as:

```json
{ "apiPrefix": "/custom-prefix" }
```

This prefix replaces the `/api` of every route. So, following the example, every `/api/openapi/...` will become `/custom-prefix/openapi/...`.

## Environment variables

The API Portal accepts the following environment variables:

- **HTTP_PORT** (default: 8080): defines the http port to use

## How to migrate to v2

To migrate from the `v1.16.14`, you can update the service and the `Swagger Aggregator` or remove it and use only the `Swagger Aggregator`.

Whichever option you choose, the first two things to do are:
1. Make sure to update the `Swagger Aggregator` microservice to a compatible version (`3.6.0` or above).
2. Remove the following endpoints:
    - `/documentations/api-portal/api/openapi/v3`
    - `/documentations/api-portal/api`
    - `/documentations/openapi`
    - `/documentations/swagger`

Now you can follow one of the two tutorials below to configure the new `API Portal`.

## How to configure

### Stand-alone API Portal

To configure the stand-alone `API Portal`, make sure to have the latest `Swagger Aggregator` and the latest `API Portal`. Now you have to configure the needed endpoints:

1. Add the following endpoints:
    - Endpoint 1:
      * Base path: `/api/openapi`
      * Type: `Microservice`
      * Microservice: `swagger-aggregator`
      * Rewrite base path: it depends on the documentation version you want to see.
        * `/openapi/v3-1` for Open API v3.1
        * `/openapi/v3` for Open API v3.0
        * `/openapi/v2` for Swagger v2
    - Endpoint 2:
      * Base path: `/api/openapi/raw`
      * Type: `Microservice`
      * Microservice: `swagger-aggregator`
      * Rewrite base path: `/`
2. Add the `/documentations/api-portal` endpoint with the following configuration:
    - Type: `Microservice`
    - Microservice: `api-portal`
    - Rewrite base path: `/`
    
    This is the endpoint from which the API Portal is reachable, you can change it and name it as you like.

### Embedded API Portal

It's possible to use the `Swagger Aggregator` microservice to serve the API Portal without the need of the `API Portal`.

:::info
This option is available only with `Swagger Aggregator` v3.7.0 or above.
:::

Once you have the `Swagger Aggregator`, you can configure the needed endpoints:

1. Add the following endpoints:
    - Endpoint 1:
      * Base path: `/api/openapi`
      * Type: `Microservice`
      * Microservice: `swagger-aggregator`
      * Rewrite base path: it depends on the documentation version you want to see.
        * `/openapi/v3-1` for Open API v3.1
        * `/openapi/v3` for Open API v3.0
        * `/openapi/v2` for Swagger v2
    - Endpoint 2:
      * Base path: `/api/openapi/raw`
      * Type: `Microservice`
      * Microservice: `swagger-aggregator`
      * Rewrite base path: `/`
2. Add `/documentations/api-portal` with the following configuration:
    - Type: `Microservice`
    - Microservice: `swagger-aggregator`
    - Rewrite base path: `/swagger`

    This is the endpoint from which the API Portal is reachable, you can change it and name it as you like.

### Reroute endpoints on a custom endpoint

If you need to change the endpoints, for example because you need to expose many API Portal or you have a gateway that redirects requests based on a certain prefix, you have to configure the `Swagger Aggregator` (read how to [here](/runtime-components/plugins/swagger-aggregator/20_configuration.md#customize-api-portal)) and configure the correct endpoints:

1. Add `/documentations/api-portal/config` with the following configuration:
    - Type: `Microservice`
    - Microservice: `swagger-aggregator`
    - Rewrite base path: `/api-portal/config`
    
    `/documentations/api-portal` is the url from which the API Portal is reachable, so it depends on the url you use.
2. Add the following endpoints:
    - Endpoint 1:
      * Base path: `/your-custom-prefix/openapi`
      * Type: `Microservice`
      * Microservice: `swagger-aggregator`
      * Rewrite base path: it depends on the documentation version you want to see.
        * `/openapi/v3-1` for Open API v3.1
        * `/openapi/v3` for Open API v3.0
        * `/openapi/v2` for Swagger v2
    - Endpoint 2:
      * Base path: `/your-custom-prefix/openapi/raw`
      * Type: `Microservice`
      * Microservice: `swagger-aggregator`
      * Rewrite base path: `/`
  
3. Delete `/api/openapi` and `/api/openapi/raw` endpoints if you have already configured them.

## Customize logo and/or favicon

[Here](/runtime-components/applications/api-documentation-aggregator/30_faqs.md#how-can-I-change-the-api-portal-logo-and-favicon) you can read how to customize the logo and/or the favicon of the `API Portal`

## FAQs

You can find some FAQs about Swagger Aggregator and API Portal at [this](/runtime-components/applications/api-documentation-aggregator/30_faqs.md) link.
