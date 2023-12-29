---
id: overview
title: Overview
sidebar_label: Overview
---

The API documentation aggregator can be used to aggregate the individual [Open API](https://swagger.io/resources/open-api/) specifications of the microservices specified in its configuration, and to expose these specifications through a graphical interface.

### Usage

To reach the portal and visualize all the routes exposed by the endpoints, go to the "`Overview`" area of your project, and then click the "`Go to Documentation`" button within the table line related to the reference environment.

## Microservices

Currently, there are two different API documentation aggregator applications in Mia-Platform Marketplace, differing in the type of API Gateway that have configured: one uses [Envoy API Gateway]((/runtime_suite/envoy-api-gateway/overview.md)), the other uses [API Gateway (NGINX)](/runtime_suite/api-gateway/10_overview.md).
Thus, it is possible to use the appropriate application depending on which API Gateway is configured on your Project.

In addition to the API Gateway (Envoy or NGINX), the following two plugins will be created with the application:

- [API Portal](/runtime_suite/api-portal/10_overview.md)
- [Swagger Aggregator](/runtime_suite/swagger-aggregator/10_overview.md)

## Endpoints

To correctly retrieve and expose the microservices specifications through the portal, the API documentation aggregator includes the following endpoints:

- /documentations/api-portal
- /documentations/api-portal/api
- /documentations/openapi
- /documentations/swagger
