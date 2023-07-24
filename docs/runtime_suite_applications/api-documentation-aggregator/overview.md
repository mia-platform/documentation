---
id: overview
title: Overview
sidebar_label: Overview
---

The API documentation aggregator can be used to aggregate the individual [Open API](https://swagger.io/resources/open-api/) specifications of the microservices specified in its configuration, and to expose these specifications through a graphical interface.

### Usage

To reach the portal and visualize all the routes exposed by the endpoints, go to the "`Overview`" area of your project, and then click the "`Go to Documentation`" button within the table line related to the reference environment.

## Microservices

For further information regarding specific plugins composing the application, please refer to their documentation:
- [API Gateway](../../runtime_suite/envoy-api-gateway/overview)
- [API Portal](../../runtime_suite/api-portal/overview)
- [Swagger Aggregator](../../runtime_suite/swagger-aggregator/overview)

:::info
By default, the API documentation aggregator includes the [**Envoy**](../../runtime_suite/envoy-api-gateway/overview) implementation of the API gateway plugin. However, API gateway implementations leveraging [**NGINX**](../../runtime_suite/api-gateway/overview) can also be used with this application.
:::

## Endpoints

To correctly retrieve and expose the microservices specifications through the portal, the API documentation aggregator includes the following endpoints:

- /documentations/api-portal
- /documentations/api-portal/api
- /documentations/openapi
- /documentations/swagger
