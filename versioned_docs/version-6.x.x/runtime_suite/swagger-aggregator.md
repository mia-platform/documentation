---
id: swagger-aggregator
title: Swagger Aggregator
sidebar_label: Swagger Aggregator
---
## Overview

The Swagger Aggregator service is responsible for aggregating the individual [swaggers](https://swagger.io/docs/specification/2-0/what-is-swagger/) of all the microservices indicated in the configuration. He collects all paths from the specified microservice swaggers and merge them all on a single swagger definition. To correctly handle the possible rewrite of the gateways, this service can be configured to handle the swagger paths with the correct prefix.

This service allows you to always have the right version of documentation of your API. Aggregate documentation will be available in the [API Portal](../development_suite/api-portal/api-documentations).

You can expose documentation which implements [OpenApi 2.0](https://swagger.io/specification/v2/)/[OpenApi 3.0](https://swagger.io/specification/) specifications.

## Configuration

:::tip
Configure Swagger Aggregator directly from [Console](../development_suite/api-console/advanced-section/swagger-aggregator/configuration)
:::

This Microservice is configured via a configuration file similar to this:

```js
/*
 * Copyright © 2018-present Mia-Platform
 * All rights reserved
 */

module.exports = {
  title: 'Documentation',
  descriptionMarkdownFilePath: 'tests/DESCRIPTION.md',
  version: '1.0.0',
  services: [
    {
      type: 'url',
      url: 'http://localhost:3000/documentation/json',
      prefix: '/',
      includePaths: [
        {
          path: '/pathToInclude-1',
        },
        {
          path: '/pathToInclude-2',
        }
      ],
      excludePaths: [
        {
          path: '/pathToExclude-1',
        }
      ]
    },
    {
      type: 'url',
      url: 'http://petstore.swagger.io/v2/swagger.json',
      prefix: '/foo',
    },
    {
      type: 'file',
      path: 'tests/localSwaggers/localSwagger.yaml',
      prefix: '/v1',
      includePaths: [
        {
          path: '/pathToInclude-1',
        }
      ]
    },
  ],
  baseSwagger: {
    swagger: '2.0',
    consumes: [
      'application/json',
    ],
    produces: [
      'application/json',
    ],
    securityDefinitions: {
      APISecretHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'secret',
      },
    },
    security: [
      {
        APISecretHeader: [],
      },
    ],
  },
}
```

First, the swagger-aggregator configuration needs the generic information like **title**, **version** and **description**, that will generically describe the API set provided by all microservices.

:::note
There are two ways to provide a description:

* using the field `description`: requires a simple string;
* using the field `descriptionMarkdownFilePath`: requires the path of a _MarkDown_ file with the description of the swagger (if specified, the content will be shown in the Swagger UI instead of the description).
:::

The `baseSwagger` object contains the first-level configurations of the final merged swagger. Besides all the field defined by either [OpenApi 2.0](https://swagger.io/specification/v2/) or [OpenApi 3.0](https://swagger.io/specification/) specifications, this object can contain a `prefix` field that will be prepended to the paths of all the routes in the final merged swagger.

The `services` array contains the URLs and files list from which retrieve the swaggers of every microservice; in details, there are two ways to retrieve a microservice swagger:

* **_URL_**: by specifying `url` as type the swagger-aggregator will download the microservice swagger by the provided _url_ field;
* **_File_**: by specifying `file` as type the swagger-aggregator will take the microservice swagger configurations by the provided _path_ field.

In both of them the user can specify a `prefix` to place before.

In both of them, the user can specify an `includePaths` and an `excludePaths` to filter the paths to be accessible from outside. The filter will include first all the paths according to the object passed by `includePaths` then the result will be filtered by the `excludedPaths`.

:::caution
Please be sure to validate the configuration with the following <a download target="_blank" href="/docs_files_to_download/swagger-aggregator-config.jsonschema.js"> jsonschema</a> before run the service, otherwise the microservice will not correctly start.
:::

### Transform Paths

It is possible to transform paths and apply custom tags to them with an advanced configuration.

```json
{
  "transformPaths": {
    "/myPath": [{
      "path": "/my-path",
      "tags": ["Custom Tag"]
    }, {
      "path": "/my-path2",
      "tags": ["Some other custom tag"]
    }]
  }
}
```

This configuration will transform any path matching `/myPath` to two different paths `/my-path` and `/my-path2` with the specified tags.

## APIs

The two main APIs exposed by this service are:

- `/swagger/json`: it gives the JSON that aggregates the swagger definitions (specification [OpenApi 2.0](https://swagger.io/specification/v2/)) of the microservices listed in configuration.
- `/openapi/v3/json`: the same as above but the specification is [OpenApi 3.0](https://swagger.io/specification/).

The service also responds with the swagger static website at the path `/swagger/` (only OpenApi 2.0 v2 specification).

:::note
If you request for OpenAPI 3.0 definitions you will get OpenApi 2.0 definitions converted, the other way around you won't get the documentation for services that expose 2.0 definitions.
:::
