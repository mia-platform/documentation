---
id: faqs
title: FAQs
sidebar_label: FAQs
---



### How can I change the title?

The title is related to the documentation version and it corresponds to the `title` key in the `info` object of the [Open Api specification document](https://swagger.io/resources/open-api/).
To change it, you have to edit the Swagger Aggregator [configuration](/products/console/api-console/advanced-section/swagger-aggregator/configuration.md).

Example of `swagger-aggregator.json`:

```json
{
  "title": "Your Custom Title"
}
```

### How can I change the grey badge next to the title?

The grey badge next to the title is related to the documentation version and it corresponds to the `version` key in the `info` object of the [Open Api specification document](https://swagger.io/resources/open-api/). To change it, you have to edit the Swagger Aggregator [configuration](/products/console/api-console/advanced-section/swagger-aggregator/configuration.md).

Example of `swagger-aggregator.json`:

```json
{
  "version": "1.0"
}
```

### How can I add the terms of service, a contact link or a license link?

Those information are related to the `info` object of the [Open Api specification document](https://swagger.io/resources/open-api/).

To change it, you have to edit the Swagger Aggregator [configuration](/products/console/api-console/advanced-section/swagger-aggregator/configuration.md): you have to add the `info` key in the `baseSwagger` object and make sure to write a compliant Open API [info](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.0.md#info-object) object

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

By default, the API Portal is exposed on `/documentations/api-portal`. You can change it going to the [Endpoints](/products/console/api-console/api-design/endpoints.md) section:
1. Delete the `/documentations/api-portal` endpoint
2. Create a new endpoint with you custom route, with type `Microservice` and `api-portal` as microservice.

### How can I use only one microservice to show the API Portal?

If you already have the `swagger-aggregator` and the `api-portal` microservices on your project, you have to:

1. Change the `swagger-aggregator` version and set the `3.7.0` or one above.
2. Delete the `api-portal` microservice

Then go to the [Endpoints](/products/console/api-console/api-design/endpoints.md) section and:

1. Delete the endpoint on which the `API Portal` is exposed.
2. Create a new endpoint with the same route on which the `API Portal` was exposed, with type `Microservice` and `swagger-aggregator` as microservice.
3. Edit the `Rewrite Base Path` of the endpoint just created and set it to `/swagger`

:::note
Using this option, you can't control the `API Portal` version. To see which version you are using, check the [Changelog](/runtime-components/plugins/swagger-aggregator/changelog.md)
:::

### How can I authenticate my endpoints with OAuth 2.0?

To enable OAuth 2.0 authentication you need to edit the Swagger Aggregator [configuration](/products/console/api-console/advanced-section/swagger-aggregator/configuration.md) by adding inside the `baseSwagger`:

1. the [`securityDefinition` object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#security-definitions-object) configured with the correct **Swagger 2.0 compliant**
2. the `security` array listing the [security requirements](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#security-requirement-object)

For example:
```json
{
  "baseSwagger": {
    "swagger": "2.0",
    "security": [
      { 
        "oidc": ["openid"]
      }
    ],
    "securityDefinitions": {
      "oidc": {
        "authorizationUrl": "your-authorization-url",
        "flow": "accessCode",
        "scopes": {
          "openid": "openId scope",
        },
        "tokenUrl": "your-token-url",
        "type": "oauth2",
      },
    }
  }
}
```

### How can I configure my OAuth 2.0 flow?

:::caution
The following information are applicable to a Swagger Aggregator version greater or equal than `3.8.0` and an API Portal version greater or equal than `2.1.0`.
:::

To enable OAuth 2.0 authentication you need to edit the Swagger Aggregator [configuration](/products/console/api-console/advanced-section/swagger-aggregator/configuration.md) by adding at the first level the `oauthConfig` object containing the desired [swagger-ui OAuth 2.0 configuration](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/oauth2.md).

For example:
```json
{
  "baseSwagger": {
    "swagger": "2.0",
    "security": [
      { 
        "oidc": ["openid"]
      }
    ],
    "securityDefinitions": {
      "oidc": {
        "authorizationUrl": "your-authorization-url",
        "flow": "accessCode",
        "scopes": {
          "openid": "openId scope",
        },
        "tokenUrl": "your-token-url",
        "type": "oauth2",
      },
    }
  },
  "oauthConfig": {
    "clientId": "my-client-id",
    "usePkceWithAuthorizationCodeGrant": true,
    "scopes": ["openid"]
  }
}
```

### How can I change the API Portal logo and favicon?

:::info
This feature is available from `Swagger Aggregator v3.9.0` and `API Portal v2.2.0`.
:::

To customize the `API Portal` logo and favicon, you have to simply edit the Swagger Aggregator [configuration](/products/console/api-console/advanced-section/swagger-aggregator/configuration.md) by adding at the first level the `apiPortalConfig` object, and setting the `logoUrl` and `faviconUrl`. You should write something like this:
  ```
  {
    ...
    "apiPortalConfig": {
      "logoUrl": "/your-logo-url",
      "faviconUrl": "/your-favicon-url"
    },
  }
  ```

### How can I change the prefix of API Portal endpoints?

:::info
This feature is available from `Swagger Aggregator v3.9.0` and `API Portal v2.2.0`.
:::

By default, `API Portal` endpoints have the `/api` prefix but you can change it by:
1. Set the custom prefix in the Swagger Aggregator [configuration](/products/console/api-console/advanced-section/swagger-aggregator/configuration.md)
```json
{
  ...
  "apiPortalConfig": {
    "apiPrefix": "/custom-prefix",
  }
}
```
2. Follow the [guide](/runtime-components/plugins/api-portal/20_configuration.md#reroute-endpoints-on-a-custom-endpoint) on the API Portal

### How can I add the global servers options in the API Portal?

:::info
This feature is available from `Swagger Aggregator v3.9.0` and `API Portal v2.2.0`.
:::

To add the global servers options, you have to add them in the `baseSwagger` object of the Swagger Aggregator [configuration](/products/console/api-console/advanced-section/swagger-aggregator/configuration.md).
The `servers` list comes from [OpenApi 2.0](https://swagger.io/specification/v2/).

You should write something like this:
```json
{
  ...
  "baseSwagger": {
    "version": "2.0",
    "servers:" [
      {
        "url": "http://your-first-server"
      },
      {
        "url": "http://your-second-server",
        "description": "A nice description"
      }
    ]
  }
}
```
