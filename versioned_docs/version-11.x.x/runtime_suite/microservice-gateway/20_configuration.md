---
id: configuration
title: Microservice Gateway configuration
sidebar_label: Configuration
---
This service can be added to your project by visiting Mia-Platform Marketplace and creating a new microservice from the Microservice Gateway plugin.

:::info
The Microservice Gateway supports custom CA certs. If you want to learn more about these certificates and how to configure them in your Microservice Gateway visit [this page](../../development_suite/api-console/api-design/services#provide-a-ca-certificate-to-a-custom-service)
:::

## Environment variables

- CONFIGURATION_PATH (__required__): defines the path of the configuration file
- TRUSTED_PROXIES: defines a list of trusted proxies ips
- DISABLE_STRICT_CONTENT_TYPE_CHECK: disable the strict content type check (default true)

## Configuration

The configuration must adhere to the following schema:

```json
{
  "type": "object",
  "required": [ "router", "preDecorators", "postDecorators" ],
  "properties": {
    "router": {
      "type": "object",
      "patternProperties": {
        "^\/": {
          "type": "object",
          "patternProperties": {
            "^(GET|POST|PATCH|PUT|DELETE|\\*|FALLBACK)$": {
              "type": "object",
              "required": [ "protocol", "service", "port", "path", "pre", "post" ],
              "properties": {
                "protocol": { "enum": [ "http:" ] },
                "service": { "type": "string" },
                "port": { "type": "integer" },
                "path": { "type": "string", "pattern": "^\/" },
                "pre": { "type": "array", "items": { "type": "string" } },
                "post": { "type": "array", "items": { "type": "string" } },
                "catchHttpErrors": { "type": "string" },
                "allowUnknownRequestContentType": { "type": "boolean" },
                "allowUnknownResponseContentType": { "type": "boolean" }
              },
              "additionalProperties": false
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "preDecorators": {
      "type": "object",
      "patternProperties": {
        ".*": {
          "type": "object",
          "required": [  "protocol", "service", "port", "path" ],
          "properties": {
            "protocol": { "enum": [ "http:" ] },
            "service": { "type": "string" },
            "port": { "type": "integer" },
            "path": { "type": "string" },
            "requireRequestBody": { "type": "boolean" }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "postDecorators": {
      "type": "object",
      "patternProperties": {
        ".*": {
          "type": "object",
          "required": [  "protocol", "service", "port", "path" ],
          "properties": {
            "protocol": { "enum": [ "http:" ] },
            "service": { "type": "string" },
            "port": { "type": "integer" },
            "path": { "type": "string" },
            "requireRequestBody": { "type": "boolean" },
            "requireResponseBody": { "type": "boolean" }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

In this configuration, you can specify:
- the `router`, where you can define the basics of each [endpoint](../../development_suite/api-console/api-design/endpoints#what-is-an-endpoint),
  and attach a [`pre` and `post` decorator](./10_overview.md#pre-and-post-hooks);
- the `preDecorators` and `postDecorators`, where you define the behavior of each decorator.
