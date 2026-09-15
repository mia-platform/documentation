---
id: overview
title: Overview
sidebar_label: Overview
---



The API documentation aggregator can be used to aggregate the individual [Open API](https://swagger.io/resources/open-api/) specifications of the microservices specified in its configuration, and to expose these specifications through a graphical interface.

### Usage

To reach the portal and visualize all the routes exposed by the endpoints, go to the "`Overview`" area of your project, and then click the "`Go to Documentation`" button within the table line related to the reference environment.

## Microservices

Currently, there are two different API Documentation Aggregator applications in Mia-Platform Marketplace, differing in the type of API Gateway that have configured: one uses [Envoy API Gateway](/runtime-components/plugins/envoy-api-gateway/overview.md), the other uses [API Gateway (NGINX)](/runtime-components/plugins/api-gateway/10_overview.md).
Thus, it is possible to use the appropriate application depending on which API Gateway is configured on your Project.

In addition to the API Gateway (Envoy or NGINX), the [Swagger Aggregator](/runtime-components/plugins/swagger-aggregator/10_overview.md) plugin will be created with the application.

## Endpoints

To correctly retrieve and expose the microservices specifications through the portal, the API documentation aggregator includes the following endpoints:

- /documentations/api-portal
- /api/openapi
- /api/openapi/raw
