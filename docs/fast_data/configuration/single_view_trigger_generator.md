---
id: single_view_trigger_generator
title: Single View Trigger Generator
sidebar_label: Single View Trigger Generator
---

:::caution
This Plugin is a BETA Plugin and, as such, is currently under active development. Pay attention using it.
:::

The Single View Trigger Generator has 3 fundamental parts:

- The consumption of pr-update messages
- The strategy execution
- The production of sv-trigger messages

For each part we will need to configure a set of [environment variables](#environment-variables) and [config maps](#config-maps).

:::caution
Remember that the Single View Trigger Generator uses Kafka throughout the whole cycle and must be configured accordingly. To know more about the main changes from the old architecture please read the [Single View Trigger Generator introduction](/fast_data/single_view_trigger_generator.md) page.
:::

## Environment variables

The following table indicates all the available environment variables for you to customize the service to your needs.

:::note
When creating the service from the marketplace the following environment variables will be added for you with some default values but you still need to properly update them to make the service work
:::

| Name                             | Required | Description                                                                                                                                                                                                                                | Default value |
| -------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| LOG_LEVEL                        | &check;  | Level to use for logging; to choose from: error, fatal, warn, info, debug, trace, silent                                                                                                                                                   | silent        |
| MONGODB_URL                      | &check;  | MongoDB URL where the projections are stored                                                                                                                                                                                               | -             |
| MONGODB_NAME                     | &check;  | MongoDB Database name where the projections are stored                                                                                                                                                                                     | -             |
| KAFKA_CLIENT_ID                  | &check;  | The Kafka client identifier                                                                                                                                                                                                                | -             |
| KAFKA_GROUP_ID                   | &check;  | Kafka consumer group ID                                                                                                                                                                                                                    | -             |
| KAFKA_BROKERS                    | &check;  | List of brokers the service needs to connect to                                                                                                                                                                                            | -             |
| KAFKA_SASL_MECHANISM             | -        | SASL Mechanism with which connect to Kafka. You can choose between plain, scram-sha-256, scram-sha-512.                                                                                                                                    | plain         |
| KAFKA_SASL_USERNAME              | -        | Username to use for logging into Kafka                                                                                                                                                                                                     | -             |
| KAFKA_SASL_PASSWORD              | -        | Password to use for logging into Kafka                                                                                                                                                                                                     | -             |
| KAFKA_CONNECTION_TIMEOUT         | -        | Timeout in milliseconds for the connection to Kafka                                                                                                                                                                                        | 10000         |
| KAFKA_AUTHENTICATION_TIMEOUT     | -        | Timeout in milliseconds for the authentication to Kafka                                                                                                                                                                                    | 10000         |
| KAFKA_REQUEST_TIMEOUT            | -        | Timeout in milliseconds for each request to Kafka                                                                                                                                                                                          | 30000         |
| KAFKA_SESSION_TIMEOUT            | -        | Timeout in milliseconds for the session expiration in Kafka                                                                                                                                                                                | 30000         |
| KAFKA_HEARTBEAT_INTERVAL         | -        | Interval in milliseconds to perform each heartbeat                                                                                                                                                                                         | 3000          |
| KAFKA_MAX_RETRY_TIME             | -        | Maximum wait time for a retry in milliseconds. For more info please refer to the [Kafka JS documentation](https://kafka.js.org/docs/configuration#default-retry)                                                                           | 30000         |
| KAFKA_INITIAL_RETRY_TIME         | -        | Initial value used to calculate the retry in milliseconds (This is still randomized following the randomization factor). For more info please refer to the [Kafka JS documentation](https://kafka.js.org/docs/configuration#default-retry) | 300           |
| KAFKA_RETRIES_FACTOR             | -        | Randomization factor. For more info please refer to the [Kafka JS documentation](https://kafka.js.org/docs/configuration#default-retry)                                                                                                    | 0.2           |
| KAFKA_RETRIES_MULTIPLIER         | -        | Exponential factor. For more info please refer to the [Kafka JS documentation](https://kafka.js.org/docs/configuration#default-retry)                                                                                                      | 2             |
| KAFKA_MAX_RETRIES                | -        | Max number of retries per call. For more info please refer to the [Kafka JS documentation](https://kafka.js.org/docs/configuration#default-retry)                                                                                          | 5             |
| CA_CERT_PATH                     | -        | The path to the CA certificate, which should include the file name as well, e.g. /home/my-ca.pem                                                                                                                                           | -             |
| READ_TOPIC_FROM_BEGINNING        | -        | If true the consumer will start reading messages from topics from the beginning, instead of the message with the latest committed offset. This will happen only the first time connecting to the topic.                                    | false         |
| KAFKA_PROJECTION_UPDATES_FOLDER  | &check;  | Path to the folder that contains the file `kafkaProjectionUpdates.json`.                                                                                                                                                                   | -             |
| TRIGGER_TOPIC                    | &check;  | Kafka topic to send the sv-trigger (Projection Change) messages. If you don't have it already, checkout out the [naming convention](/fast_data/inputs_and_outputs.md#topic-naming-convention-2)                                            | -             |
| SINGLE_VIEW_NAME                 | &check;  | The name of the Single View                                                                                                                                                                                                                | -             |
| ER_SCHEMA_FOLDER                 | &check;  | Path to the [ER Schema](/fast_data/configuration/config_maps/erSchema.md) folder                                                                                                                                                           | -             |
| PROJECTION_CHANGES_SCHEMA_FOLDER | &check;  | Path to the [Projection Changes Schema](/fast_data/configuration/config_maps/projection_changes_schema.md) folder                                                                                                                          | -             |
| MANUAL_STRATEGIES_FOLDER         | -        | Path to the custom strategies folder where the custom strategies scripts are stored                                                                                                                                                        | -             |
| TRIGGER_CUSTOM_FUNCTIONS_FOLDER  | -        | Path to the custom functions folder used in `__fromFile__` values                                                                                                                                                                          | ''            |

## Config Maps

The service can use the following 3 config maps:

:::note
When creating the service from the marketplace the following config maps will be created for you with some default values but you still need to properly configure them to make the service work
:::

### ER Schema

The ER Schema config map contains the `erSchema.json` file which describes the relationships between each projection of the [System of Records](/fast_data/the_basics.md#system-of-records-sor).

Remember to copy/paste the mount path into the `ER_SCHEMA_FOLDER` environment variable so the service can read the file.
To know more on how to configure the file please go to the [ER Schema](/fast_data/configuration/config_maps/erSchema.md) page.

### Projection Changes Schema

The Projection Changes Schema config map contains the `projectionChangesSchema.json` file which defines how to get to the base projection of the single view starting from the projection in which we received the ingestion message. 

Remember to copy/paste the mount path into the `PROJECTION_CHANGES_SCHEMA_FOLDER` environment variable so the service can read the file.
If you need more info on how to configure the `projectionChangesSchema.json` file, please refer to the [Projection Changes Schema](/fast_data/configuration/config_maps/projection_changes_schema.md) page.

### Kafka Projection Updates

The Kafka Projection Updates config map contains the `kafkaProjectionUpdates.json` file which defines the topics from where to consume the [Projection Updates](/fast_data/inputs_and_outputs.md#projection-update) and the strategy to apply to each message.

Remember to copy/paste the mount path into the `KAFKA_PROJECTION_UPDATES_FOLDER` environment variable so the service can read the file.
If you need more info on how to configure the `kafkaProjectionUpdates.json` file, please refer to the [Kafka Projection Updates](/fast_data/configuration/config_maps/kafka_projection_updates.md) page.

### ESP Config

The `ESP Config` is a JSON file containing the configuration of the consumer and producer of the service itself and it has the following format:

```json
{
  "consumer": {
    "kafka": {
      // Kafka consumer configuration (see below)
    }
  },
  "producer": {
    "<kafka | mongo>": {
      // Kafka or mongo producer configuration (see below)
    },
  }
}
```

:::caution
Mind that only one producer and consumer must be configured at a time so the service knows which kind to use. Providing more than one consumer or producer will fail the configmap validation and shut down the service at start up.
:::

**Consumers**

At the moment you can only configure your consumer with kafka which will read `pr-update` messages from the Real Time Updater. To configure it you must follow the JsonSchema specification below.

<details><summary>Kafka consumer config JsonSchema</summary>
<p>

```json
{
  "type": "object",
  "required": ["brokers", "consumerGroupId"],
  "properties": {
    "brokers": {
      "type": "array",
      "items": {
        "type": "string",
      },
    },
    "consumerGroupId": {
      "type": "string",
    },
    "consumeFromBeginning": {
      "type": "boolean",
      "default": false,
    },
    "ssl": {
      "type": "boolean",
    },
    "sasl": {
      "type": "object",
      "properties": {
        "mechanism": {
          "type": "string",
          "enum": ["plain", "scram-sha-256", "scram-sha-512"],
        },
        "username": {
          "type": "string",
        },
        "password": {
          "type": "string",
        },
      },
    },
    "clientId": {
      "type": "string",
    },
    "connectionTimeout": {
      "type": "number",
    },
    "authenticationTimeout": {
      "type": "number",
    },
    "reauthenticationThreshold": {
      "type": "number",
    },
    "requestTimeout": {
      "type": "number",
    },
    "enforceRequestTimeout": {
      "type": "boolean",
    },
    "retry": {
      "type": "object",
      "properties": {
        "maxRetryTime": {
          "type": "number",
        },
        "initialRetryTime": {
          "type": "number",
        },
        "factor": {
          "type": "number",
        },
        "multiplier": {
          "type": "number",
        },
        "retries": {
          "type": "number",
        },
      },
    },
    "logLevel": {
      "type": "number",
      "enum": [0, 1, 2, 4, 5],
    },
  },
}
```
</p>
</details>

**Producers**

For the producers you can choose between two options: Kafka or MongoDB ([`sv-trigger` vs. `pc`](/fast_data/single_view_trigger_generator.md#sv-trigger-vs-pc)).
With MongoDB you will save Projection Changes on the DB just like the Real Time Updater does. With Kafka instead it will send `sv-trigger` messages which will also be read by the Single View Creator by changing its configuration to do so. Here's the configuration specification for both:

<details><summary>MongoDB producer config JsonSchema</summary>
<p>

```json
{
  "type": "object",
  "required": ["url", "dbName"],
  "properties": {
    "url": {
      "type": "string",
    },
    "dbName": {
      "type": "string",
    },
  },
}
```
</p>
</details>

<details><summary>Kafka producer config JsonSchema</summary>
<p>

```json
{
  "type": "object",
  "required": ["brokers"],
  "properties": {
    "brokers": {
      "type": "array",
      "items": {
        "type": "string",
      },
    },
    "ssl": {
      "type": "boolean",
    },
    "sasl": {
      "type": "object",
      "properties": {
        "mechanism": {
          "type": "string",
          "enum": ["plain", "scram-sha-256", "scram-sha-512"],
        },
        "username": {
          "type": "string",
        },
        "password": {
          "type": "string",
        },
      },
    },
    "clientId": {
      "type": "string",
    },
    "connectionTimeout": {
      "type": "number",
    },
    "authenticationTimeout": {
      "type": "number",
    },
    "reauthenticationThreshold": {
      "type": "number",
    },
    "requestTimeout": {
      "type": "number",
    },
    "enforceRequestTimeout": {
      "type": "boolean",
    },
    "retry": {
      "type": "object",
      "properties": {
        "maxRetryTime": {
          "type": "number",
        },
        "initialRetryTime": {
          "type": "number",
        },
        "factor": {
          "type": "number",
        },
        "multiplier": {
          "type": "number",
        },
        "retries": {
          "type": "number",
        },
      },
    },
    "logLevel": {
      "type": "number",
      "enum": [0, 1, 2, 4, 5],
    },
  },
}
```
</p>
</details>

Note that Kafka log level works like the kafkajs enum object, so:

```js
NOTHING = 0,
ERROR = 1,
WARN = 2,
INFO = 4,
DEBUG = 5,
```

An example of a complete configuration would be:

```json
{
  "consumer": {
    "kafka": {
      "brokers": ["localhost:9092"],
      "clientId": "client-id",
      "consumerGroupId": "group-id",
      "consumeFromBeginning": true,
      "logLevel": 0
    }
  },
  "producer": {
    "mongo": {
      "url": "mongodb://localhost:27017",
      "dbName": "pc-sv-books-test"
    }
  }
}
```