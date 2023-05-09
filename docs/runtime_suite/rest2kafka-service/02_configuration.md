---
id: configuration
title: Configuration
sidebar_label: Configuration
---
In order to successfully deploy and use the `Rest2Kafka` service it requires a global
configuration and an endpoints' configuration map. The former one is enabled by means of
environmental variables concerning Kafka related details and the endpoints' configuration
map location, while the latter defines for each endpoint its specific settings.

## Environment

In this section are listed and explained the environmental variables needed to run
an instance of `Rest2Kafka` service.

- `REST2KAFKA_CONFIG_FILE_PATH`: the path where is located the endpoints' configuration map
- `KAFKA_CLIENT_ID`: the identifier which can be employed to recognize this service within Kafka environment
- `KAFKA_BROKERS_LIST`: a string containing a comma (`,`) separated list of Kafka brokers addresses. At least one broker should be provided
- `KAFKA_AUTH_METHOD`: the authentication method adopted by the service to connect to Kafka brokers. It can assume one of the following values, depending on your credentials:
  - `plain`
  - `scram-sha-256`
  - `scram-sha-512`
- `KAFKA_SASL_USERNAME`: the username key used by the service to authenticate onto Kafka brokers
- `KAFKA_SASL_PASSWORD`: the secret used by the service to authenticate onto Kafka brokers

## Endpoints Config Map

In this section is described how the endpoints' configuration map should be populated and the
meaning of each field. It is also included an example of it, so that it should be easier to
get the service up and running.

This is the JSON schema of the configuration map:

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "required": [
      "path",
      "topic",
      "keyField",
      "schema"
    ],
    "properties": {
      "path": {
        "type": "string",
        "description": "the route exposed to convert expected payload into a Kafka message"
      },
      "topic": {
        "type": "string",
        "description": "the name of the Kafka topic onto which messages should be published when the endpoint is called"
      },
      "keyField": {
        "type": "string",
        "description": "a JSON path to select which field of the payload should be employed as key of the Kafka message"
      },
      "schema": {
        "type": "object",
        "description": "a JSON schema employed to validate the incoming payload of POST HTTP requests to this endpoint"
      }
    }
  }
}
```

An example of an endpoints' configuration map is the following one:

```json
[
  {
    "path": "/hello-there",
    "topic": "ext.greetings.dev",
    "keyField": "greeting.id",
    "schema": {
      "body": {
        "type": "object",
        "required":
        [
          "greeting"
        ],
        "properties": {
          "greeting": {
            "type": "object",
            "required": [
              "msg"
            ],
            "properties": {
              "id": { "type": "string" },
              "msg": { "type": "string" },
              "lang": { "type": "string" }
            }
          },
          "sender": {
            "type": "string"
          }
        }
      },
      "response": {
        "202": {
          "type": "object",
          "properties": {}
        }
      }
    }
  },
  {
    "path": "/notification",
    "topic": "ext.notify.dev",
    "keyField": "notify-id",
    "schema": {
      "body": {
        "type": "object",
        "required":
        [
          "notify-id",
          "message"
        ],
        "properties": {
          "notify-id": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "response": {
        "204": {
          "type": "object",
          "properties": {}
        }
      }
    }
  }
]
```
