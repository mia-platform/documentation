---
id: apis
title: APIs
sidebar_label: APIs
---



### Main Endpoints

The three main APIs exposed by this service are:

- `/swagger/json`: it gives the JSON that aggregates the swagger definitions (specification [OpenApi 2.0](https://swagger.io/specification/v2/)) of the microservices listed inside the configuration.
- `/openapi/v3/json`: the same as above but the specification is [OpenApi 3.0](https://swagger.io/specification/v3/).
- `/openapi/v3-1/json`: the same as above but the specification is [OpenApi 3.1](https://swagger.io/specification/).

They accept the boolean query parameter `subswaggersInDescription`. If `true`, the subswaggers list is added in the final JSON/yaml as a series of links. By default it's `true`.

It's possible to get the aggregated documentation in Yaml format by substituting `json` with `yaml` in the above endpoints.

:::note
Depending on the version requested, any specification provided by your services will be converted if it has a lower version. However it does not work the other way around: for example, when requiring for OpenAPI 2.0, any definition following OpenAPI 3.0 or 3.1, will not be featured in the documentation API response.
:::

### Subswaggers endpoints

The service exposes three routes to get the subswaggers list:

- `/swagger/subswaggers/`
- `/openapi/v3/subswaggers/`
- `/openapi/v3-1/subswaggers/`

They accept the boolean query parameter `includeAll`. If `true`, the subswaggers list includes the option `ALL`. By default it's `true`.

### Other endpoints

It also exposes a route to get the API Portal UI config:

- `/ui-config`

And a route to get the API Portal config:

- `/api-portal/config`

### Static route

The service also responds with the swagger static website at the path `/swagger/` showing the API Portal v2.0.1.
