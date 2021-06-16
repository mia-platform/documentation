---
id: configuration
title: API Portal Configuration
sidebar_label: Configuration
---
This service can be added to your project by visiting Mia-Platform [Marketplace](../../marketplace/overview_marketplace.md) and creating a new microservice from the **API Portal** plugin.

In order to access the [Documentation Portal](../../development_suite/api-portal/api-documentations.md) you should also [create an endpoint](../../development_suite/api-console/api-design/endpoints) that should expose your microservice at the following path: `/documentations/api-portal`. For this endpoint you should also **unset** the following flags:

* **Show in API Portal** (_Details_ card)
* **Support only JSON format on request** (_Configure microservice gateway_ card)
* **Support only JSON format on response** (_Configure microservice gateway_ card)

After this, in the _Security Management_ card you should also set the **User Group Permission** to `false`.

Lastly, in the _Routes_ card, you should create a route with `GET` as http verb and `/` as route path. For this newly created route uncheck the `inherited` checkbox for the **User Group Permission** and set its value to `true`.

:::note
If you want to expose the Api Portal on an additional path, you have also to expose the Swagger Aggregator on the correct corresponding path.
For instance, if you expose the Api Portal on `/my-api-portal`, then you need to expose the Swagger Aggregator on `/my-api-portal/api`. Otherwise, the Api Portal would not be able to get the swagger definitions.
:::

API Portal plugin does not require any configuration file.

## Environment variables

- HTTP_PORT (__required__, default `8080`): port where the web server is exposed.
