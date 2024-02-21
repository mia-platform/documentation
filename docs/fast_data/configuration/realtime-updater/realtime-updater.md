---
id: overview
title: Real-Time Updater Configuration
sidebar_label: Real-Time Updater
---

Real-Time Updater is the service in charge of keeping up-to-date the projections with the data sent by the connected system.   

Optionally, the service can generate [Projection Update messages](/fast_data/inputs_and_outputs.md#projection-update-message) so that your services can consume these events and react when projections are updated. 

For having an overview of the features of the Real-Time Updater, you can go [here](/fast_data/realtime_updater.md).  

## Environment variables

| Name                                        | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                             | Default  |
|---------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| LOG_LEVEL                                   | &check;  | defines the logger level                                                                                                                                                                                                                                                                                                                                                                                                                                | -        |
| HTTP_PORT                                   | &check;  | defines the HTTP port where status and metrics routes are exposed                                                                                                                                                                                                                                                                                                                                                                                       | -        |
| SYSTEM_OF_RECORDS                           | &check;  | the name of the system of record associated to the Real Time Updater                                                                                                                                                                                                                                                                                                                                                                                   | -        |
| MONGODB_URL                                 | &check;  | defines the mongodb URL to contact                                                                                                                                                                                                                                                                                                                                                                                                                      | -        |
| PROJECTIONS_DATABASE_NAME                   | &check;  | defines the name of the projections database                                                                                                                                                                                                                                                                                                                                                                                                            | -        |
| PROJECTIONS_CHANGES_COLLECTION_NAME         | &check;  | defines the name of the projections changes collection                                                                                                                                                                                                                                                                                                                                                                                                  | -        |
| PROJECTIONS_CHANGES_ENABLED                 | -        | defines whether you want to generate projections changes                                                                                                                                                                                                                                                                                                                                                                                                | `true`     |
| GENERATE_KAFKA_PROJECTION_CHANGES           | -        | defines whether the projection changes have to be sent to Kafka too or not. (v3.4.0 or above).                                                                                                                                                                                                                                                                                                                                                          | `false`    |
| GENERATE_KAFKA_PROJECTION_UPDATES           | -        | defines whether the realtime updater should send a message of update every time it writes the projection to Mongo.                                                                                                                                                                                                                                                                                                                                      | `false`    |
| KAFKA_BROKERS                               | &check;  | defines the Kafka brokers                                                                                                                                                                                                                                                                                                                                                                                                                               | -        |
| KAFKA_GROUP_ID                              | &check;  | defines the Kafka group id (it is suggested to use a syntax like ```{'{tenant}.{environment}.{projectName}.{system}.real-time-updater'}```)                                                                                                                                                                                                                                                                                                             | -        | KAFKA_SASL_USERNAME | &check;| defines the Kafka SASL username | - |
| KAFKA_SASL_USERNAME                         | &check;  | defines the Kafka SASL username                                                                                                                                                                                                                                                                                                                                                                                                                         | -        |
| KAFKA_SASL_PASSWORD                         | &check;  | defines the Kafka SASL password                                                                                                                                                                                                                                                                                                                                                                                                                         | -        |
| KAFKA_SASL_MECHANISM                        | -        | defines the authentication mechanism. It can be one of: ```plain```, ```scram-sha-256```, ```scram-sha-512```, ```oauthbearer```.                                                                                                                                                                                                                                                                                                                       | `plain`    |
| KAFKA_SASL_OAUTH_BASE_URL                   | -        | In case of ```oauthbearer``` mechanism, it defines the base URL of the endpoint for fetching the OAuth2 token.                                                                                                                                                                                                                                                                                                                                          | -        |
| KAFKA_SASL_OAUTH_PATH                       | -        | In case of ```oauthbearer``` mechanism, it defines the path of the endpoint for fetching the OAuth2 token.                                                                                                                                                                                                                                                                                                                                              | -        |
| KAFKA_SASL_OAUTH_GRANT_TYPE                 | -        | In case of ```oauthbearer``` mechanism, it defines the grant type for fetching the OAuth2 token. Only grant type ```password``` is supported                                                                                                                                                                                                                                                                                                            | `password` |
| KAFKA_SASL_OAUTH_CLIENT_ID                  | -        | In case of ```oauthbearer``` mechanism, it defines the client id for fetching the OAuth2 token.                                                                                                                                                                                                                                                                                                                                                         | -        |
| KAFKA_SASL_OAUTH_CLIENT_SECRET              | -        | In case of ```oauthbearer``` mechanism, it defines the client secret for fetching the OAuth2 token.                                                                                                                                                                                                                                                                                                                                                     | -        |
| KAFKA_SASL_OAUTH_TOKEN_EXPIRATION_MARGIN_MS | -        | In case of ```oauthbearer``` mechanism, it defines time window before the actual expiration of the token during which the token will be considered expired (it is recommended to set this value not less than 1 minute)                                                                                                                                                                                                                                 | `60000`    |
| KAFKA_USE_LATEST_DEQUEUE_STRATEGY           | -        | defines whether to use `latest` strategy as auto offset reset when consumer group did not previously exists                                                                                                                                                                                                                                                                                                                                             | -        |
| KAFKA_MESSAGE_ADAPTER                       | -        | defines which Kafka message adapter to use. Its value can be either```basic``` or `db2` (DB2 adapter), ```golden-gate```, ```debezium``` or ```custom```. This value can be changed only in the related System of Record, on the _Projections_ page. Any manual update from the Environment Variables table will be loss when saving. Further details on the [Kafka Adapters: Kafka messages format](#kafka-adapters-kafka-messages-format) paragraph. | `basic`    |
| KAFKA_CONSUMER_MAX_WAIT_TIME                | -        | defines the maximum waiting time of Kafka Consumer for new data in batch.                                                                                                                                                                                                                                                                                                                                                                               | `500`      |
| KAFKA_CONNECTION_TIMEOUT_MS                 | -        | Time in milliseconds to wait for a successful connection.                                                                                                                                                                                                                                                                                                                                                                                               | `10000`    |
| KAFKA_SESSION_TIMEOUT_MS                    | -        | Timeout in milliseconds used to detect failures.                                                                                                                                                                                                                                                                                                                                                                                                        | 30000    |
| KAFKA_HEARTBEAT_INTERVAL_MS                 | -        | The expected time in milliseconds between heartbeats to the consumer coordinator.                                                                                                                                                                                                                                                                                                                                                                       | `3000`     |
| KAFKA_ADAPTER_FOLDER                        | -        | defines the path to the Kafka adapter folder                                                                                                                                                                                                                                                                                                                                                                                                            | -        |
| KAFKA_PROJECTION_CHANGES_FOLDER             | -        | path where has been mounted the ```kafkaProjectionChanges.json``` configuration (v3.4.0 or above).                                                                                                                                                                                                                                                                                                                                                      | -        |
| KAFKA_PROJECTION_UPDATES_FOLDER             | -        | mount path of the [Projection Updates](/fast_data/configuration/config_maps/kafka_projection_updates.md) config map.                                                                                                                                                                                                                                             | -        |
| CAST_FUNCTIONS_FOLDER                       | -        | defines the path to the cast-functions folder                                                                                                                                                                                                                                                                                                                                                                                                           | -        |
| MAP_TABLE_FOLDER                            | -        | defines the path to the map table folder                                                                                                                                                                                                                                                                                                                                                                                                                | -        |
| STRATEGIES_FOLDER                           | -        | defines the path to the strategies folder                                                                                                                                                                                                                                                                                                                                                                                                              | -        |
| ER_SCHEMA_FOLDER                    | -        | Mount path of the [ER Schema](/fast_data/configuration/config_maps/erSchema.md) config map.                                                                                                                                                                                                                                                                                                                                                                                                                                                                | -                   |
| PROJECTION_CHANGES_SCHEMA_FOLDER                    | -        | Mount path of the [Projection Changes Schema](/fast_data/configuration/config_maps/projection_changes_schema.md) config map.                                                                                                                                                                                                                                                                                                                                                                                                                                                           | -                   |
| INVARIANT_TOPIC_MAP                         | &check;  | defines an object that maps the topic to the projection                                                                                                                                                                                                                                                                                                                                                                                                 | -        |
| USE_UPSERT                                  | -        | defines whether to use [upsert](#upsert) or not when performing insert and update operations.                                                                                                                                                                                                                                                                                                                                                           | `true`     |
| USE_AUTOMATIC_STRATEGIES                    | &check;  | When `true` the Real Time Updater will work in Low Code mode, supporting the Config Maps of ER Schema and Projection Changes Schema, and allowing configuration of the associated System of Record to automatically update in the service                                                                                                                                                                                                              | `false`    | 
| STRATEGIES_MAX_EXEC_TIME_MS                 | &check;  | defines the maximum time for which a strategy is executed                                                                                                                                                                                                                                                                                                                                                                                               | -        |
| COMMIT_MESSAGE_LOGGING_INTERVAL             | -        | specify the interval in ms of logging the info that messages have been committed.                                                                                                                                                                                                                                                                                                                                                                       | `3000`     |
| FORCE_CHECK_ON_OFFSET                       | -        | Force check that incoming message has offset greater or equal than the one of the projection to update.                                                                                                                                                                                                                                                                                                                                                 | `true`     |
| CA_CERT_PATH                                | -        | the path to the CA certificate, which should include the file name as well, e.g. ```/home/my-ca.pem```                                                                                                                                                                                                                                                                                                                                                  | -        |
| PAUSE_TOPIC_CONSUMPTION_ON_ERROR            | -        | If set to true, in case of an error while consuming an ingestion message, the service will pause the topic's consumption while keep consuming the other ones. More info on the feature [here](#pause-single-topics-consumption-on-error)                                                                                                                                                                                                                | `false`    |
| USE_POS_AS_COUNTER                          | -        | If ```KAFKA_MESSAGE_ADAPTER``` is set to ```golden-gate``` it will use the ```pos``` field as timestamp for ingestion kafka messages. When set to ```false``` it will use the default ```timestamp``` property in the message provided by kafka like the other adapters do. Setting this property to ```true``` with a ```KAFKA_MESSAGE_ADAPTER``` **different** from ```golden-gate``` will have no effect.                                            | `true`     |
| PRODUCER_COMPRESSION                          | -        | Starting from `v7.5.8`, is possible to choose the type of compression that can be applied to `pr-update` messages. Possible values are: `gzip`, `snappy` or `none`                                     | `none`     |

## Attach to System of Record

To evaluate data from external CDC, the Projections included in the System of Record must be attached to one or more [Projection Storer](/fast_data/projection_storer.md) or Real-Time Updater. Services must be created in advance and they can be attached moving to the _Services_ tab of the selected System of Record.

![Services in System of Record configuration page](./../img/system-services.png)

Please remember that, after attaching a Real-Time Updater to the Systems of Record, you must select the projections that the service should evaluate to ensure the service updates those projections. To do that, you can use to the table in the _Projections attached to services_ section to search the projection and attach to a specific service. Otherwise, you can access to the service configuration page by clicking to the button next to the service name and configure the list of projections from there.

:::info
Additionally, note that each projection can be evaluated by only one service.
:::

### Read only Environment Variables 

When a System of Record is attached to a Real-Time Updater, some of its config maps are automatically updated and set as read-only. These configurations are managed by the console. Any updates made to the _System of Record_ (e.g., adding, removing, or updating a projection, or modifying the Message Adapter) will trigger the update of these configuration maps upon saving the configuration.

The following variables will be managed by the Fast Data Section and cannot be changed from the micro-service section:
* `KAFKA_MESSAGE_ADAPTER`
* `INVARIANT_TOPIC_MAP`
* `SYSTEM_OF_RECORDS`
* `CAST_FUNCTIONS_FOLDER`
* `MAP_TABLE_FOLDER`
* `STRATEGIES_FOLDER`
* `KAFKA_ADAPTER_FOLDER`
* `ER_SCHEMA_FOLDER`
* `PROJECTION_CHANGES_SCHEMA_FOLDER`
* `KAFKA_PROJECTION_UPDATES_FOLDER`

### Usage of the Low Code

The Low Code features of the Real-Time Updater is available since version `4.2.0`. This means that any configuration update on the related System of Record (selection of the Message Adapter, any update of projections, their fields or the topic definitions) will be automatically reflected in the service config maps.

Also, it allows the possibility to fully configure the service with the usage of JSON files, as example for the [ER Schema](#er-schema-configuration) and the [Projection Changes Schema](#projection-changes-schema) 

:::info
You can quickly convert a System of Record from Manual to Low code by changing the `USE_AUTOMATIC_STRATEGIES` to _true_. Then, you should follow the next steps to set up your Fast Data Low Code project properly.
:::

## How data is managed on MongoDB

### Projection Deletion

When the Real-Time Updater deletes a document, it actually makes a **virtual delete** instead of a real document deletion. (the `__STATE__` field is set to `DELETED`)

### Upsert

When performing Insert and Update operations, Real-Time Updater will perform an upsert operation as default. This means that if the document matching the key of the message does not exist, it will be created; otherwise, if it already exists, it will just be updated. 

If you want to change this behavior, you can set the environment variable `USE_UPSERT` of the Real-Time Updater to `false`. Doing so, for the Insert operation the service will fail to insert documents that already exist, causing the service to stop. 

For the Update operation, it will fail when trying to update non-existing documents, causing the service to stop.

### Primary Key update

Starting from `v7.1.0`, the Real-Time Updater supports the update of a Primary Key. In particular, it detects if received ingestion messages contain an updated Primary Key. In that case, the Real-Time Updater automatically handles updating events on the existing records without requiring additional messages.

When the Real-Time Updater receives a Primary Key update, it triggers two different actions:
1. the deletion of the old record with the old Primary Key
2. the creation of a new record with the updated content and the updated Primary Key

:::caution
Mind that these two actions create two `pr-update` messages when the emission of Projection Update is enabled
:::

In order to handle a Primary Key update, the Real-Time Updater needs to receive the following data:
- a positional information about the current operation
- the data values before the update
- the data values after the update

More details about the configuration of these fields can be found inside each Kafka message format paragraph in this page.

:::danger
The Kafka message format based on the _IBM InfoSphere Data Replication for DB2_ CDC does not support the Primary Key update.
:::


### Prevent projections to be overwritten

During a rebalancing or a massive initial load with multiple replicas of the Real-Time updater, a batch of old messages that have not been committed yet could be read by the Real-Time updater. In fact, Kafka ensures that messages are received, in order, at least once.

To prevent that old messages that have already updated the projection, overwrite the projection again, the environment variable `FORCE_CHECK_ON_OFFSET` is set by default to `true`.

This setting is **strongly** recommended when you have both insert/update and delete operations.

:::caution
At the moment this variable is set to `true` by default, but you can turn it off in order to adapt your services in case they need some fix.
:::

### Tracking the Changes

Into all the projections are saved information about the last Kafka message that updated the projection.

Those information are saved inside a field named `__internal__kafkaInfo` in order to prevent collision with others projection fields.

The information saved are:

- `topic`: is the topic from which the Kafka message has been consumed
- `partition`: is partition from which the Kafka message has been consumed
- `offset`: is the offset of the message
- `key`: is the key of the Kafka message
- `timestamp`: is the timestamp of the message

<details>
<summary>Projection Record with metadata</summary>
<p>

```json
{
    "ID_USER": "123",
    "ADDRESS": "address_1",
    "SURNAME": "ROSSI",
    "TAX_CODE": "tax_code",
    "__STATE__": "PUBLIC",
    "createdAt":  "2021-10-19T13:39:47.589Z",
    "timestamp": "2021-11-19T16:22:07.031Z",
    "updatedAt": "2021-11-19T16:22:07.052Z",
    "__internal__kafkaInfo": {
        "topic": "my-topic.development.my-system.my-projection.ingestion",
        "partition": 0,
        "timestamp": "2021-11-19T16:22:07.031Z",
        "offset": "14",
        "key": {
            "ID_USER": "123",
        },
    }
}
```

</p>
</details>

## Projection Changes Collection

[Projection Changes](/fast_data/inputs_and_outputs.md#projection-changes) (**PC**) are records generated from each Real-Time Updater service attached to a [System of Record](/fast_data/the_basics.md#system-of-record-sor), after the execution of a strategies. 

This records will be consumed by the [Single View Creator](/fast_data/single_view_creator.md), to start the aggregation process to aggregate a [Single View](/fast_data/configuration/single_views.md).

If the environment variable `PROJECTIONS_CHANGES_ENABLED` is set to `true`, you have to include also the Projection Changes collection name (as a value of the environment variable `PROJECTIONS_CHANGES_COLLECTION_NAME`).

If the name of the collection name will follow the convention for collection names defined in the Mia-Platform Console (a text of maximum 80 characters, only lowercase letters, number, underscores and hyphens, starting with a lowercase letter), then saving the configuration will automatically generate the collection in the _MongoDB CRUD_ section for you, if it doesn't exist yet. 

This collection will contain all the default indexes and can be customized by you in any moment after.

:::caution
If you wish to delete a Real-Time Updater or change the desired name of the Projection Changes collection, please remember that the existing CRUD collection will not be automatically removed. You have to do it manually from the _MongoDB CRUD_ section.
:::


### Changes Array

Into each element of the `changes` array of the projection change document are inserted the information about the message that triggered the projection change:

- `topic`: is the topic from which the Kafka message has been consumed
- `partition`: is partition from which the Kafka message has been consumed
- `offset`: is the offset of the message
- `key`: is the key of the Kafka message
- `timestamp`: is the timestamp of the message

<details>
<summary>Example PC Metadata</summary>
<p>

```json
{
    "type": "sv_pointofsale",
    "identifier": {
        "ID_USER": "123",
    },
    "changes": [{
        "state": "NEW",
        "topic": "my-topic.development.my-system.my-projection.ingestion",
        "partition": 0,
        "timestamp": "2021-11-19T16:22:07.031Z",
        "offset": "14",
        "key": {
            "ID_USER": "123",
        },
    }],
}
```

</p>
</details>


### Custom Projection Changes Collection

If you're using a different pattern or you're using a public or secret environment variable, you will have to manually create a collection to configure its properties (indexes, schemas, etc.) and to potentially use it in with the CRUD Service.

```json
[
  {
    "name": "type",
    "type": "string",
    "required": false,
    "nullable": false
  },
  {
    "name": "changes",
    "type": "Array_RawObject",
    "required": false,
    "nullable": false
  },
  {
    "name": "identifier",
    "type": "RawObject",
    "required": true,
    "nullable": false
  },
  {
    "name": "doneAt",
    "type": "Date",
    "required": false,
    "nullable": false
  }
]
```

The collection also needs to have the following indexes, to support the queries made by the RTU to update the collection's records.


| Index name          | Type             | Fields             | Unique |
|---------------------|------------------|--------------------|--------|
| `type_change_state` | `normal`         |<table><thead><tr><th>name</th><th>order</th></tr></thead><tbody><tr><td>`changes.state`</td><td>`ASCENDENT`</td></tr><tr><td>`type`</td><td>`ASCENDENT`</td></tr></tbody></table>| `false`       |
| `type_identifier`   | `normal`         |<table><thead><tr><th>name</th><th>order</th></tr></thead><tbody><tr><td>`identifier`</td><td>`ASCENDENT`</td></tr><tr><td>`type`</td><td>`ASCENDENT`</td></tr></tbody></table>|  `true`           |

:::note
To allow the Single View Creator to read from the Projection Changes collection, its name should also be set in the `PROJECTIONS_CHANGES_COLLECTION` environment variable of your Single View Creator service. 
:::
