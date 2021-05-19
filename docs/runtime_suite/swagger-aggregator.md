---
id: swagger-aggregator
title: Swagger Aggregator
sidebar_label: Swagger Aggregator
---

## Overview

The Swagger Aggregator service is responsible for aggregating the individual [swaggers](https://swagger.io/docs/specification/2-0/what-is-swagger/) of all the microservices indicated in the configuration. It collects all the paths from the specified microservice swaggers and merges them all in a single swagger definition. To correctly handle the possible rewrite of the gateways, this service can be configured to handle the swagger paths with the correct prefixes.

This service allows you to always have the right version of documentation of your APIs. The aggregated documentation will be available in the [API Portal](../development_suite/api-portal/api-documentations).

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
  title: "Documentation",
  descriptionMarkdownFilePath: "tests/DESCRIPTION.md",
  version: "1.0.0",
  services: [
    {
      type: "url",
      url: "http://localhost:3000/documentation/json",
      prefix: "/",
      includePaths: [
        {
          path: "/pathToInclude-1",
        },
        {
          path: "/pathToInclude-2",
        },
      ],
      excludePaths: [
        {
          path: "/pathToExclude-1",
        },
      ],
    },
    {
      type: "url",
      url: "http://petstore.swagger.io/v2/swagger.json",
      prefix: "/foo",
    },
    {
      type: "file",
      path: "tests/localSwaggers/localSwagger.yaml",
      prefix: "/v1",
      includePaths: [
        {
          path: "/pathToInclude-1",
        },
      ],
    },
  ],
  baseSwagger: {
    swagger: "2.0",
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
      APISecretHeader: {
        type: "apiKey",
        in: "header",
        name: "secret",
      },
    },
    security: [
      {
        APISecretHeader: [],
      },
    ],
  },
};
```

First, the swagger-aggregator configuration needs generic information like **title**, **version**, and **description**, that will generically describe the API set provided by all microservices.

:::note
There are two ways to provide a description:

- using the field `description`: requires a simple string;
- using the field `descriptionMarkdownFilePath`: requires the path of a _MarkDown_ file with the description of the swagger (if specified, the content will be shown in the Swagger UI instead of the description).
  :::

The `baseSwagger` object contains the first-level configurations of the final merged swagger. Besides all the fields defined by either [OpenApi 2.0](https://swagger.io/specification/v2/) or [OpenApi 3.0](https://swagger.io/specification/) specifications, this object can contain a `prefix` field that will be prepended to the paths of all the routes in the final merged swagger.

The `services` array contains the URLs and files list from which retrieve the swaggers of every microservice; in details, there are two ways to retrieve a microservice swagger:

- **_URL_**: by specifying `url` as `type` property the swagger-aggregator will download the microservice swagger from the provided `url` property. For this service type, the required properties will be `type`, `url`, and `prefix`.
- **_File_**: by specifying `file` as `type` property the swagger-aggregator will take the microservice swagger configurations from the provided `path` property. For this service type, the required properties will be `type`, `path`, and `prefix`.

In both of them, the user must specify a `prefix` that will be placed before the url or the file path. Any string that begins with `/` is accepted.

:::info
Passing the string `/` as `prefix` means that no prefix will be added to your service URLs or paths.
:::

In both service types, the user can specify `includePaths` and `excludePaths` optional properties to filter the routes to be accessible in the swagger documentation. The filter will include first all the routes according to the objects present in the `includePaths` property, then the result will be filtered by the objects present in the `excludedPaths` property.

Both properties should be an array of objects and each object requires a `path` property.
In each object, it is also possible to define a `verb` property that specifies which verb of that specific path should be included/excluded.

```json
{
  "type": "url",
  "url": "http://petstore.swagger.io/v2/swagger.json",
  "prefix": "/foo",
  "includePaths": [
    {
      "path": "/pathToInclude-1"
    },
    {
      "path": "/pathToInclude-2",
      "verb": "get"
    }
  ],
  "excludePaths": [
    {
      "path": "/pathToInclude-1/pathToExclude-1"
    }
  ]
}
```

Here there is a list of the routes that will or will not be shown in the aggregated swagger documentation based on the example above:

- `/pathToInclude-1/clients` with any route verb: this route will be shown since the first part of the route path is present in the includePaths array.
- `/pathToInclude-3` with any route verb: this route will **not** be shown since the first part of the route path is not present in the includePaths array.
- `/pathToInclude-1/pathToExclude-1/managers` with any route verb: this route will **not** be shown since the first part of the route path is present in the excludePaths array.
- `/pathToInclude-2` with `get` verb: this route will be shown since the route path precisely matches the one present in the includePaths array with the same verb.
- `/pathToInclude-2` with `post` verb: this route will **not** be shown because, even if the route path precisely matches the one present in the includePaths array, the specified verb is different.
- `/pathToInclude-2/customers` with `get` verb: this route will **not** be shown because the route path does not precisely match the one present in the includePaths array, even if the specified verb is the same.

:::caution
It is important to notice that the behavior of these two properties changes depending on the presence of the `verb` property. If `verb` property is not defined all sub-routes that match the `path` property will be included/excluded.

Otherwise, if `verb` property is defined, only the routes that exactly match the `path` and `verb` property will included/excluded.
:::

It is also possible to transform paths and apply custom tags to them with `transformPaths` property.

```json
{
  "type": "url",
  "url": "http://petstore.swagger.io/v2/swagger.json",
  "prefix": "/foo",
  "transformPaths": {
    "/myPath": [
      {
        "path": "/my-path",
        "tags": ["Custom Tag"],
        "verbsToTransform": ["get", "post"]
      },
      {
        "path": "/my-path2",
        "tags": ["Some other custom tag"]
      }
    ]
  }
}
```

Here is a list of the routes that will or will not be transformed in the aggregated swagger documentation based on the example above:

- `/myPath` with `get` verb: this route will be transformed into two different routes `/my-path` and `/my-path2` with the specified tags and `get` verb.
- `/myPath` with `delete` verb: this route will be transformed into another route `/my-path2` with `Some other custom tag` as tag and `delete` verb.
- `/yourPath` with any verb: this route will not be transformed since it does not match any transformPath.
- `/myPath/customers` with `get` verb: this route will be transformed into another route `/my-path2/customers` with `Some other custom tag` as tag and `get` verb. It will not be transformed into `/my-path/customers` because it does not exactly match `path` property.

:::caution
It is important to notice that the behavior of `transformPaths` property changes depending on the presence of `verbsToTransform` property. If `verbsToTransform` property is not defined all sub-routes that match the `path` property will be transformed.

Otherwise, if `verbsToTransform` property is defined, only the routes that exactly match the `path` and `verb` properties will be transformed.
:::

:::caution
Please be sure to validate the configuration with the following <a download target="_blank" href="/docs_files_to_download/swagger-aggregator-config.jsonschema.js"> JSON schema</a> before running the service, otherwise the microservice will not correctly start.
:::

:::info
For additional information about more advanced properties that can be defined in the swagger-aggregator configuration (e.g., `subSwaggers` property) visit [this page](../development_suite/api-console/advanced-section/swagger-aggregator/configuration).
:::

## APIs

The two main APIs exposed by this service are:

- `/swagger/json`: it gives the JSON that aggregates the swagger definitions (specification [OpenApi 2.0](https://swagger.io/specification/v2/)) of the microservices listed inside the configuration.
- `/openapi/v3/json`: the same as above but the specification is [OpenApi 3.0](https://swagger.io/specification/).

The service also responds with the swagger static website at the path `/swagger/` (only OpenApi 2.0 v2 specification).

:::note
If you request for OpenAPI 3.0 definitions you will get OpenApi 2.0 definitions converted, the other way around you won't get the documentation for services that expose 2.0 definitions.
:::
