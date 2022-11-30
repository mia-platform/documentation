---
id: api_documentation_configuration
title: API Documentation Configuration
sidebar_label: API Documentation Configuration
---

The Dev Portal uses the [Swagger Aggregator](/runtime_suite/swagger-aggregator/overview.md) to make all your OpenAPI specifications,
even the ones spread across different projects, available in a unique place.

:::caution
As mentioned [here](/dev_portal/application_creation.md#2-configure-api-portal), the version of your **api-portal** needs to be at least **1.14** in order to configure the api documentation correctly.
:::

## Configure the API Documentation in Try/View Mode

The API documentation can be configured in two possible ways: 
- **Try Mode**: allows users to interact with the APIs the Dev Portal application expose;
- **View Mode**: allows users only to visualize the available APIs and their specifications.

:::info
By default, the Dev Portal application configures the API documentation in **view mode**.
:::

If you wish to change this behavior, you can modify the `configuration.json` file of the `dev-portal-micro-lc-backend` microservice in the design area of the console. 

You should be able to find the API documentation plugin configuration:

```json
{
  "id": "api-portal",
  "label": "API Documentation",
  "icon": "fas fa-code",
  "order": 3,
  "integrationMode": "qiankun",
  "pluginRoute": "/api-portal/",
  "pluginUrl": "/documentations/api-portal/",
  "props": {
    "isViewMode": true
  }
}
```

Edit the `isViewMode` boolean field to switch between one of the two aforementioned configurations.

## Merge the APIs of multiple projects

To include specifications from different projects, you can import them by URL using the Advanced section of the Design Area of the Console.

![Advanced console area Swagger Aggregator](img/swagger-aggregator-advanced-area.png)

Check the [Swagger Aggregator Advanced Config](/development_suite/api-console/advanced-section/swagger-aggregator/configuration.md#servicesurlsbefore-and-servicesurlsafter)
for more details.

:::caution
Remember to set appropriate **request** and **limits** levels to the Swagger Aggregator microservice in order to avoid performance issues.

Check out the dedicated [section](/tutorial/requests_limits/requests_limits_tutorial.mdx) for more information regarding requests and limits.
:::
