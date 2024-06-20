---
id: faqs
title: FAQs
sidebar_label: FAQs
---

### How can I change the title?

The title is related to the documentation version and it corresponds to the `title` key in the `info` object of the [Open Api specification document](https://swagger.io/resources/open-api/).
To change it, you have to edit the Swagger Aggregator [configuration]((https://docs.mia-platform.eu/docs/development_suite/api-console/advanced-section/swagger-aggregator/configuration)).

Example of `swagger-aggregator.json`:

```json
{
  "title": "Your Custom Title"
}
```

### How can I change the grey badge next to the title?

The grey badge next to the title is related to the documentation version and it corresponds to the `version` key in the `info` object of the [Open Api specification document](https://swagger.io/resources/open-api/). To change it, you have to edit the Swagger Aggregator [configuration]((https://docs.mia-platform.eu/docs/development_suite/api-console/advanced-section/swagger-aggregator/configuration)).

Example of `swagger-aggregator.json`:

```json
{
  "version": "1.0"
}
```

### How can I add the terms of service, a contact link or a license link?

Those information are related to the `info` object of the [Open Api specification document](https://swagger.io/resources/open-api/).

To change it, you have to edit the Swagger Aggregator [configuration]((https://docs.mia-platform.eu/docs/development_suite/api-console/advanced-section/swagger-aggregator/configuration)): you have to add the `info` key in the `baseSwagger` object and make sure to write a compliant Open API [info](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.0.md#info-object) object

Example of `swagger-aggregator.json`:

```json
{
  "baseSwagger": {
    "swagger": "2.0",
    "consumes": [
      "application/json"
    ],
    "produces": [
      "application/json"
    ],
    "securityDefinitions": {
      "APISecretHeader": {
        "type": "apiKey",
        "in": "header",
        "name": "secret"
      }
    },
    "info": {
      "termsOfService": "<termsOfService-link>",
      "license": {
        "name": "License Name",
        "url": "<license-link>"
      },
    }
  }
}
```

:::warning
If you edit the `baseSwagger` object, you have to include ALL the information needed or the configuration will be incorrect.
:::

### How can I change the route to which is exposed the API Portal?

By default, the API Portal is exposed on `/documentations/api-portal`. You can change it going to the [Endpoints](https://docs.mia-platform.eu/docs/development_suite/api-console/api-design/endpoints) section:
1. Delete the `/documentations/api-portal` endpoint
2. Create a new endpoint with you custom route, with type `Microservice` and `API Portal` as microservice.
