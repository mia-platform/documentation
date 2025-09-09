---
id: apis
title: APIs
sidebar_label: APIs
---



The three main APIs exposed by this service are:

- `/swagger/json`: it gives the JSON that aggregates the swagger definitions (specification [OpenApi 2.0](https://swagger.io/specification/v2/)) of the microservices listed inside the configuration.
- `/openapi/v3/json`: the same as above but the specification is [OpenApi 3.0](https://swagger.io/specification/v3/).
- `/openapi/v3-1/json`: the same as above but the specification is [OpenApi 3.1](https://swagger.io/specification/).

The service also responds with the swagger static website at the path `/swagger/` (only OpenApi 2.0 v2 specification).

:::note
Depending on the version requested, any specification provided by your services will be converted if it has a lower version. However it does not work the other way around: for example, when requiring for OpenAPI 2.0, any definition following OpenAPI 3.0 or 3.1, will not be featured in the documentation API response.
:::
