---
id: overview
title: Swagger Aggregator
sidebar_label: Overview
---
The Swagger Aggregator service is responsible for aggregating the individual [Open APIs](https://swagger.io/resources/open-api/) of all the microservices indicated in the configuration. It collects all the paths from the specified microservice Open APIs and merges them all in a single Open API definition. To correctly handle the possible rewrite of the gateways, this service can be configured to handle the Open API paths with the correct prefixes.

This service allows you to always have the right version of documentation of your APIs. The aggregated documentation will be available in the [Documentation Portal](../../console/project-configuration/documentation-portal).

:::note
The aggregated Open API documentation generated by the Swagger Aggregator is shown by the graphical interface generated by the [API Portal](../../runtime_suite/api-portal/overview).
:::

You can expose documentation which implements [OpenApi 2.0](https://swagger.io/specification/v2/)/[OpenApi 3.0](https://swagger.io/specification/) specifications.
