---
id: apis
title: APIs
sidebar_label: APIs
---
The two main APIs exposed by this service are:

- `/swagger/json`: it gives the JSON that aggregates the swagger definitions (specification [OpenApi 2.0](https://swagger.io/specification/v2/)) of the microservices listed inside the configuration.
- `/openapi/v3/json`: the same as above but the specification is [OpenApi 3.0](https://swagger.io/specification/).

The service also responds with the swagger static website at the path `/swagger/` (only OpenApi 2.0 v2 specification).

:::note
If you require for OpenAPI 3.0 definitions, any OpenApi 2.0 definition provided by your services will be converted; however when requiring for OpenAPI 2.0 any definition following OpenAPI 3.0 will not be featured in the documentation API response.
:::
