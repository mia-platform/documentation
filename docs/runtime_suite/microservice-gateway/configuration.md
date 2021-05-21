---
id: configuration
title: Microservice Gateway configuration
sidebar_label: Configuration
---

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
- the `router`, where you can define the basics of each [endpoint](../../development_suite/api-console/api-design/endpoints.md#what-is-an-endpoint),
  and attach a [`pre` and `post` decorator](overview.md#pre-and-post-hooks);
- the `preDecorators` and `postDecorators`, where you define the behaviour of each decorator.


