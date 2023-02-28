---
id: single_view_trigger_generator
title: Single View Trigger Generator
sidebar_label: Single View Trigger Generator
---

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

| Name                             | Required                     | Description                                                                                                                                                                                                                                | Default value |
| -------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| LOG_LEVEL                        | true                         | Level to use for logging; to choose from: error, fatal, warn, info, debug, trace, silent                                                                                                                                                   | silent        |
| MONGODB_URL                      | true                         | MongoDB URL where the projections are stored                                                                                                                                                                                               | -             |
| MONGODB_NAME                     | true                         | MongoDB Database name where the projections are stored                                                                                                                                                                                     | -             |
| KAFKA_CLIENT_ID                  | true                         | The Kafka client identifier                                                                                                                                                                                                                | -             |
| KAFKA_GROUP_ID                   | true                         | Kafka consumer group ID                                                                                                                                                                                                                    | -             |
| KAFKA_BROKERS                    | true                         | List of brokers the service needs to connect to                                                                                                                                                                                            | -             |
| KAFKA_SASL_MECHANISM             | false                        | SASL Mechanism with which connect to Kafka. You can choose between plain, scram-sha-256, scram-sha-512.                                                                                                                                    | plain         |
| KAFKA_SASL_USERNAME              | false                        | Username to use for logging into Kafka                                                                                                                                                                                                     | -             |
| KAFKA_SASL_PASSWORD              | false                        | Password to use for logging into Kafka                                                                                                                                                                                                     | -             |
| KAFKA_CONNECTION_TIMEOUT         | false                        | Timeout in milliseconds for the connection to Kafka                                                                                                                                                                                        | 10000         |
| KAFKA_AUTHENTICATION_TIMEOUT     | false                        | Timeout in milliseconds for the authentication to Kafka                                                                                                                                                                                    | 10000         |
| KAFKA_REQUEST_TIMEOUT            | false                        | Timeout in milliseconds for each request to Kafka                                                                                                                                                                                          | 30000         |
| KAFKA_SESSION_TIMEOUT            | false                        | Timeout in milliseconds for the session expiration in Kafka                                                                                                                                                                                | 30000         |
| KAFKA_STRATEGY_HEARTHBEAT        | false                        | Interval in milliseconds to perform each heartbeat                                                                                                                                                                                         | 30000         |
| KAFKA_MAX_RETRY_TIME             | false                        | Maximum wait time for a retry in milliseconds. For more info please refer to the [Kafka JS documentation](https://kafka.js.org/docs/configuration#default-retry)                                                                           | 30000         |
| KAFKA_INITIAL_RETRY_TIME         | false                        | Initial value used to calculate the retry in milliseconds (This is still randomized following the randomization factor). For more info please refer to the [Kafka JS documentation](https://kafka.js.org/docs/configuration#default-retry) | 300           |
| KAFKA_RETRIES_FACTOR             | false                        | Randomization factor. For more info please refer to the [Kafka JS documentation](https://kafka.js.org/docs/configuration#default-retry)                                                                                                    | 0.2           |
| KAFKA_RETRIES_MULTIPLIER         | false                        | Exponential factor. For more info please refer to the [Kafka JS documentation](https://kafka.js.org/docs/configuration#default-retry)                                                                                                      | 2             |
| KAFKA_MAX_RETRIES                | false                        | Max number of retries per call. For more info please refer to the [Kafka JS documentation](https://kafka.js.org/docs/configuration#default-retry)                                                                                          | 5             |
| KAFKA_PROJECTION_UPDATES_FOLDER  | true                         | Path to the folder that contains the file `kafkaProjectionUpdates.json`.                                                                                                                                                                   | -             |
| TRIGGER_TOPIC                    | true                         | Kafka topic to send the sv-trigger (Projection Change) messages. If you don't have it already, checkout out the [naming convention](/fast_data/inputs_and_outputs.md#topic-naming-convention-2)                                            | -             |
| CA_CERT_PATH                     | false                        | The path to the CA certificate, which should include the file name as well, e.g. /home/my-ca.pem                                                                                                                                           | -             |
| STRATEGIES_FOLDER                | false                        | Path to the custom strategies folder where the custom strategies scripts are stored                                                                                                                                                        | -             |
| USE_AUTOMATIC                    | false                        | Enables the automatic strategy execution                                                                                                                                                                                                   | false         |
| SINGLE_VIEW_NAME                 | true when USE_AUTOMATIC true | The name of the Single View                                                                                                                                                                                                                | -             |
| ER_SCHEMA_FOLDER                 | true when USE_AUTOMATIC true | Path to the [ER Schema](/fast_data/configuration/config_maps/erSchema.md) folder                                                                                                                                                           | -             |
| PROJECTION_CHANGES_SCHEMA_FOLDER | true when USE_AUTOMATIC true | Path to the [Projection Changes Schema](/fast_data/configuration/config_maps/projection_changes_schema.md) folder                                                                                                                          | -             |
| CUSTOM_FUNCTIONS_FOLDER          | false                        | Path to the custom functions folder used in `__fromFile__` values                                                                                                                                                                          | ''            |
| READ_TOPIC_FROM_BEGINNING        | false                        | If true the consumer will start reading messages from topics from the beginning, instead of the message with the latest committed offset. This will happen only the first time connecting to the topic.                                    | false         |

## Config Maps

The service can use the following 3 config maps:

:::note
When creating the service from the marketplace the following config maps will be created for you with some default values but you still need to properly configure them to make the service work
:::

### ER Schema

The ER Schema config map contains the `erSchema.json` file which describes the relationships between each projection of the [System of Record/s](/fast_data/the_basics.md#system-of-records-sor).

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
