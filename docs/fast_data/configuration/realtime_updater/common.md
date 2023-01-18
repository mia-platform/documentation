---
id: common
title: Real-Time Updater Common Configuration
sidebar_label: Common
---

Real-Time Updater is the service in charge of keeping up to date the projections with the data sent by the connected system.   
Optionally, the service can generate several events so that your services can consume these events and react when projections are updated. 

For having an overview of the features of the Real-Time Updater, you can go [here](/fast_data/realtime_updater.md).   
Here below, instead, all the configurations the service accepts are explained. 

## Environment variables

<table>
    <tr><th>Name</th><th>Required</th><th>Description</th><th>Default value</th></tr>
    <tr><td>LOG_LEVEL</td><td>true</td><td>defines the level of the logger  </td><td>-</td></tr>
    <tr><td>MONGODB_URL</td><td>true</td><td>defines the mongodb URL to contact  </td><td>-</td></tr>
    <tr><td>PROJECTIONS_DATABASE_NAME</td><td>true</td><td>defines the name of the projections' database  </td><td>-</td></tr>
    <tr><td>PROJECTIONS_CHANGES_COLLECTION_NAME</td><td>true</td><td>defines the name of the projections changes collection  </td><td>-</td></tr>
    <tr><td>PROJECTIONS_CHANGES_ENABLED</td><td>false</td><td>defines whether you want to generate projections changes</td><td>true</td></tr>
    <tr><td>LC</td><td>true</td><td>defines the lc39 HTTP port</td><td>-</td></tr>
    <tr><td>STRATEGIES_MAX_EXEC_TIME_MS</td><td>true</td><td>defines the maximum time for which a strategy is executed</td><td>-</td></tr>
    <tr><td>KAFKA_BROKERS</td><td>true</td><td>defines the Kafka brokers</td><td>-</td></tr>
    <tr><td>KAFKA_GROUP_ID</td><td>true</td><td>defines the Kafka group id (it is suggested to use a syntax like <code>{'{tenant}.{environment}.{projectName}.{system}.real-time-updater'}</code>)</td><td>-</td></tr>
    <tr><td>KAFKA_SASL_USERNAME</td><td>true</td><td>defines the Kafka SASL username</td><td>-</td></tr>
    <tr><td>KAFKA_SASL_PASSWORD</td><td>true</td><td>defines the Kafka SASL password</td><td>-</td></tr>
    <tr><td>LIVENESS_INTERVAL_MS</td><td>true</td><td>defines the liveness interval in milliseconds</td><td>-</td></tr>
    <tr><td>INVARIANT_TOPIC_MAP</td><td>true</td><td>defines an object that maps the topic to the projection</td><td>-</td></tr>
    <tr><td>KAFKA_USE_LATEST_DEQUEUE_STRATEGY</td><td>false</td><td>defines latest dequeue strategy or not</td><td>-</td></tr>
    <tr><td>KAFKA_ADAPTER_FOLDER</td><td>false</td><td>defines the path to the Kafka adapter folder</td><td>-</td></tr>
    <tr><td>CAST_FUNCTIONS_FOLDER</td><td>false</td><td>defines the path to the cast-functions folder</td><td>-</td></tr>
    <tr><td>MAP_TABLE_FOLDER</td><td>false</td><td>defines the path to the map table folder</td><td>-</td></tr>
    <tr><td>STRATEGIES_FOLDER</td><td>false</td><td>defines the path to the strategies' folder</td><td>-</td></tr>
    <tr><td>KAFKA_SASL_MECHANISM</td><td>false</td><td>defines the authentication mechanism. It can be one of: `plain`, `scram-sha-256`, `scram-sha-512`, `oauthbearer`.</td><td>plain</td></tr>
    <tr><td>KAFKA_SASL_OAUTH_BASE_URL</td><td>false</td><td>In case of `oauthbearer` mechanism, it defines the base URL of the endpoint for fetching the OAuth2 token.</td><td>-</td></tr>
    <tr><td>KAFKA_SASL_OAUTH_PATH</td><td>false</td><td>In case of `oauthbearer` mechanism, it defines the path of the endpoint for fetching the OAuth2 token.</td><td>-</td></tr>
    <tr><td>KAFKA_SASL_OAUTH_GRANT_TYPE</td><td>false</td><td>In case of `oauthbearer` mechanism, it defines the grant type for fetching the OAuth2 token. Only grant type `password` is supported</td><td>password</td></tr>
    <tr><td>KAFKA_SASL_OAUTH_CLIENT_ID</td><td>false</td><td>In case of `oauthbearer` mechanism, it defines the client id for fetching the OAuth2 token.</td><td>-</td></tr>
    <tr><td>KAFKA_SASL_OAUTH_CLIENT_SECRET</td><td>false</td><td>In case of `oauthbearer` mechanism, it defines the client secret for fetching the OAuth2 token.</td><td>-</td></tr>
    <tr><td>KAFKA_SASL_OAUTH_TOKEN_EXPIRATION_MARGIN_MS</td><td>false</td><td>In case of `oauthbearer` mechanism, it defines time window before the actual expiration of the token during which the token will be considered expired (it is recommended to set this value not less than 1 minute)</td><td>60000</td></tr>
    <tr><td>USE_UPSERT</td><td>false</td><td>defines whether to use <a href="./common#upsert">upsert</a> or not when performing insert and update operations.</td><td>true</td></tr>
    <tr><td>KAFKA_MESSAGE_ADAPTER</td><td>false</td><td>defines which Kafka message adapter to use. Its value can be either `basic` (DB2 adapter), `golden-gate` or `custom`. This value can be changed only in the related System of Records, on the _Projections_ page. Any manual update from the Environment Variables table will be loss when saving. Further details on the <a href="./common#kafka-adapters-kafka-messages-format">Kafka Adapters: Kafka messages format</a> paragraph.</td><td>basic</td></tr>
    <tr><td>KAFKA_PROJECTION_CHANGES_FOLDER</td><td>false</td><td>path where has been mounted the `kafkaProjectionChanges.json` configuration (v3.4.0 or above).</td><td>-</td></tr>
    <tr><td>GENERATE_KAFKA_PROJECTION_CHANGES</td><td>false</td><td>defines whether the projection changes have to be sent to Kafka too or not. (v3.4.0 or above).</td><td>false</td></tr>
    <tr><td>KAFKA_CONSUMER_MAX_WAIT_TIME</td><td>false</td><td>defines the maximum waiting time of Kafka Consumer for new data in batch.</td><td>500</td></tr>
    <tr><td>COMMIT_MESSAGE_LOGGING_INTERVAL</td><td>false</td><td>specify the interval in ms of logging the info that messages have been committed.</td><td>3000</td></tr>
    <tr><td>KAFKA_CONNECTION_TIMEOUT_MS</td><td>false</td><td>Time in milliseconds to wait for a successful connection.</td><td>10000</td></tr>
    <tr><td>KAFKA_SESSION_TIMEOUT_MS</td><td>false</td><td>Timeout in milliseconds used to detect failures.</td><td>30000</td></tr>
    <tr><td>KAFKA_HEARTBEAT_INTERVAL_MS</td><td>false</td><td>The expected time in milliseconds between heartbeats to the consumer coordinator.</td><td>3000</td></tr>
    <tr><td>FORCE_CHECK_ON_OFFSET</td><td>false</td><td>Force check that incoming message has offset greater or equal than the one of the projection to update.</td><td>true</td></tr>
    <tr><td>KAFKA_PROJECTION_UPDATES_FOLDER</td><td>false</td><td>path to the folder that contains the file `kafkaProjectionUpdates.json`, containing configurations of the topic where to send the updates to, mapped to each projection. (v5.3.0 or above).</td><td>-</td></tr>
    <tr><td>GENERATE_KAFKA_PROJECTION_UPDATES</td><td>false</td><td>defines whether the realtime updater should send a message of update every time it writes the projection to Mongo.</td><td>false</td></tr>
    <tr><td>CA_CERT_PATH</td><td>false</td><td>the path to the CA certificate, which should include the file name as well, e.g. `/home/my-ca.pem`</td><td>-</td></tr>
    <tr><td>SYSTEM_OF_RECORDS</td><td>true</td><td>the name of the system of records associated to the Real Time Updater</td><td>-</td></tr>
    <tr><td>PAUSE_TOPIC_CONSUMPTION_ON_ERROR</td><td>false</td><td>
    If set to true, in case of an error while consuming an ingestion message, the service will pause the topic's consumption while keep consuming the other ones. More info on the feature <a href="./common#pause-single-topics-consumption-on-error">here</a>
    </td><td>false</td></tr>
</table>

## How data is managed on MongoDB

### Projection Deletion

When the Real-Time Updater deletes a document, it actually makes a **virtual delete** instead of a real document deletion. (the `__STATE__` field is set to `DELETED`)

### Upsert

When performing Insert and Update operations, Real-Time Updater will perform an upsert operation as default. This means that if the document matching the key of the message does not exist, it will be created; otherwise, if it already exists, it will just be updated. 

If you want to change this behavior, you can set the environment variable `USE_UPSERT` of the Real-Time Updater to false. Doing so, for the Insert operation the service will fail to insert documents that already exist, causing the service to stop. For the Update operation it will fail when trying to update non-existing documents, causing the service to stop.

## Configuration files

The Real-Time Updater accepts the following configurations:

### Kafka Adapters: Kafka messages format

In the Fast Data architecture CDC, iPaaS, APIs and sFTP publish messages on Kafka topic to capture change events. However, these messages could be written in different formats.
The purpose of the Kafka adapter is allowing the correct reading of these messages in order to be properly consumed by the Real-Time Updater.

Since a Real Time Updater is connected to one System of Records, when creating a new System you will be asked to select the type of message adapter you want to use, between one of the following three options (further details in the paragraphs below):
- `DB2`, based on the [IBM InfoSphere Data Replication for DB2](https://www.ibm.com/docs/en/db2-for-zos/13?topic=getting-started-db2-zos) type CDC;
- `Golden Gate`, based on the [Oracle GoldenGate](https://docs.oracle.com/goldengate/c1230/gg-winux/GGCON/introduction-oracle-goldengate.htm#GGCON-GUID-EF513E68-4237-4CB3-98B3-2E203A68CBD4) type CDC;
- `Custom`, in case you need a completely customized message adapter (you'll be requested to write the implementation code); 

When the System of Records has been created, saving the configuration will automatically create a new Real Time Updater service, which can be viewed in the _Microservices_ section of the console.

In case you need to change the type of adapter to use in the Real Time Updater, you can easily do that from the System of Records page in the _Projection_ section of the console: after selecting your System (the same one associated to the Real Time Updater), click on the _Real Time Updater_ tab, then select the adapter type you want to use.

Another option that you should be aware of when thinking about the format of your Kafka messages is the "upsert" or "insert".
By default, the real-time-updater will perform upsert operations, but you can optionally decide to perform inserts that will fail if the document already exists, instead of updating it.

#### IBM InfoSphere Data Replication for DB2

It's the default one, it is based on the [IBM InfoSphere Data Replication engine](https://www.ibm.com/docs/en/idr/11.4.0?topic=console-overview-cdc-replication).

The message should include the following properties:
- `timestamp`: a stringified integer greater than zero. This integer has to be a valid timestamp.
- `key`: it has to be a stringified object containing the primary key of the projection, if `value` also contains the primary key of the projection this field can be an empty string.
- `value`: it is **null** if it's a *delete* operation, otherwise it contains the data of the projection.
- `offset`: it is the offset of the Kafka message.

Example of a delete operation

```text
key: `{"USER_ID": 123, "FISCAL_CODE": "ABCDEF12B02M100O"}`
value: null
timestamp: '1234556789'
offset: '100'
```

Example of an upsert:
```text
key: `{"USER_ID": 123, "FISCAL_CODE": "ABCDEF12B02M100O"}`
value: `{"NAME": 456}`
timestamp: '1234556789'
offset: '100'
```

These are the only fields needed to configure correctly the message adapter. For more details and further explanations, you can read the [documentation page about the supported JSON format](https://www.ibm.com/docs/en/idr/11.4.0?topic=kcop-write-json-format-records).

:::warning
This Kafka message format does not support a Primary Key update. For additional information, please check the [Primary Key update](#primary-key-update) section.
:::

#### Oracle GoldenGate

This Kafka Message Adapter has been created to have a format supported by [Oracle Golden Gate](https://docs.oracle.com/en/middleware/goldengate/big-data/21.1/gadbd/using-kafka-connect-handler.html#GUID-81730248-AC12-438E-AF82-48C7002178EC). 

In this Golden Gate adapter, we expect that the message includes data as explained in the [JSON Formatter page of the official documentation](https://docs.oracle.com/goldengate/bd1221/gg-bd/GADBD/GUID-F0FA2781-0802-4530-B1F0-5E102B982EC0.htm#GADBD501).

The following is an example of `value` for an insert operation:

```JSON
{
  'table': 'MY_TABLE',
  'op_type': 'I',
  'op_ts': '2021-02-19 16:03:27.000000',
  'current_ts': '2021-02-19T17:03:32.818003',
  'pos': '00000000650028162190',
  'after': {
    'USER_ID': 123,
    'FISCAL_CODE': 'the-fiscal-code-123',
    'COINS': 300000000,
  },
}
```

#### Custom

If you have Kafka Messages that do not match one of the formats above, you can create your own custom adapter for the messages. 

To make this work, you need to create a `Custom Kafka Message Adapter` inside _Real Time Updater_ section of the related System of Records. The adapter must be a javascript function that converts Kafka messages as received from the real-time updater to an object with a specific structure. This function must receives as arguments the Kafka message and the list of primary keys of the projection, and must return an object with the following properties:

- **offset**: the offset of the Kafka message
- **timestampDate**: an instance of `Date` of the timestamp of the Kafka message.
- **keyObject**: an object containing the primary keys of the projection. It is used to know which projection document needs to be updated with the changes set in the value.
- **value**: the data values of the projection, or null
- **operation**: optional value that indicates the type of operation (either `I` for insert, `U` for update, or `D` for delete). It is not needed if you are using an upsert on insert logic (the default one), while it is required if you want to differentiate between insert and update messages.
- **before**: optional value that indicates the data values before the operation execution
- **after**: optional value that indicates the data values after the operation execution
- **operationPosition**: optional value that indicates a positive integer, usually a timestamp, which ensures messages are processed in the correct order

If the `value` is null, it is a delete operation.
The `keyObject` **cannot** be null.

:::note
To support a Primary Key update, the `before`, `after` and `operationPosition` fields should be included in the adapter. (Hint: if not present, a simple `operationPosition` value might be the Kafka message timestamp).
:::

Inside configmap folder create your javascript file named `kafkaMessageAdapter.js`.

The file should export a simple function with the following signature:

```js
module.exports = function kafkaMessageAdapter(kafkaMessage, primaryKeys, logger) {
  const {
    value: valueAsBuffer, // type Buffer
    key: keyAsBuffer, // type Buffer
    timestamp: timestampAsString, // type string
    offset: offsetAsString, // type string
  } = kafkaMessage

  // your adapting logic

  return {
    keyObject: keyToReturn, // type object (NOT nullable)
    value: valueToReturn, // type object (null or object)
    timestampDate: new Date(parseInt(timestampAsString)), // type Date
    offset: parseInt(offsetAsString), // type number
    operation: operationToReturn, // type string (either I, U, or D)
  }
}
```

The `kafkaMessage` argument is the Kafka message as received from the `real-time-updater`.  
The fields `value` and `key` are of type *Buffer*, `offset` and `timestamp` are of type *string*.

The `primaryKeys` is an array of strings which are the primary keys of the projection whose topic is linked.

### CAST_FUNCTION configurations

The mount path used for these configurations is: `/home/node/app/configurations/castFunctionsFolder`.  
In this folder you have all the generated [Cast Functions](/fast_data/configuration/cast_functions.md) definitions. This configuration is read-only since you can configure it from its dedicated section of the Console.

### MAP_TABLE configurations

The mount path used for these configurations is: `/home/node/app/configurations/mapTableFolder`.  
Two mappings will be placed in this folder: one between cast functions and fields and another one between strategies and projections.
This configuration is read-only since it's configured automatically based on the projections and strategies you configure from the Fast Data section of the Console.

### Kafka Projection Changes configuration

Projection changes are saved on Mongo, but from version v3.4.0 and above, you can send them to Kafka as well.

This feature enables you to send the projection changes to a topic Kafka you want to. This is useful if you want to have a history of the projection changes thanks to the Kafka retention of messages.
You can also make your own custom logic when a projection change occurs by setting a Kafka consumer attached to the topic Kafka you set.

:::info
This feature is available from the version v3.4.0 or above of the service
:::

To do that, you need to set two environment variables:

- `KAFKA_PROJECTION_CHANGES_FOLDER`: path where has been mounted the `kafkaProjectionChanges.json` configuration (v3.4.0 or above).
- `GENERATE_KAFKA_PROJECTION_CHANGES`: defines whether the projection changes have to be sent to Kafka too or not. Default is `false`(v3.4.0 or above).

You have to create a *configuration* with the same path as the one defined by the environment variable `KAFKA_PROJECTION_CHANGES_FOLDER`.
Then, you have to create a configuration file `kafkaProjectionChanges.json` inside that configuration. The configuration is a json file like the following one:

```json
{
    "MY_PROJECTION": {
        "projectionChanges": {
            "MY_SINGLE_VIEW": {
                "strategy": "MY_STRATEGY", 
                "topic": "MY_TOPIC",
            }
        }
    }
}
```

where:

- `MY_PROJECTION` is the name of the collection whose topic has received the message from the CDC.
- `MY_SINGLE_VIEW` is the single view that have to be updated
- `MY_STRATEGY` is the strategy to be used to get the identifier of the Single View to update. It could be the name of a file or, in case an automatic strategy, the string `__automatic__`.
- `MY_TOPIC` is the topic where the projection change need to be sent (for further information about the naming convention adopted for this topic, [click here](/fast_data/inputs_and_outputs.md#topic-for-svc-trigger))

Example:

```json
{
    "registry-json": {
        "projectionChanges": {
            "sv_pointofsale": {
                "strategy": "__automatic__",
                "topic": "my-tenant.development.my-database.sv-pointofsale.sv-trigger",
            }
        }
    },
    "another-projection": {
        "projectionChanges": {
            "sv_customer": {
                "strategy": "__fromFile__[myStrategy]",
                "topic": "my-tenant.development.my-database.sv-customer.sv-trigger"
            }
        }
    }
}
```

When a message about `registry-json` happens, the projection changes will be saved on MongoDB, and it will be sent to the Kafka topic `my-tenant.development.my-database.sv-pointofsale.sv-trigger` as well.

## Custom Projection Changes Collection

You can choose to use a collection you have already created in the CRUD section.  

In order to do that, your collection is supposed to have the following fields (apart from the default ones):

```json
[
    {"name":"type","type":"string","required":false,"nullable":false},
    {"name":"changes","type":"Array_RawObject","required":false,"nullable":false},
    {"name":"identifier","type":"RawObject","required":true,"nullable":false},
    {"name":"doneAt","type":"Date","required":false,"nullable":false}
]
```

You also need to have the following additional indexes:

Add an index with *name* `type_change_state`, *type* `normal`, *unique* `false`.  
You need to add the following index fields:

- *name* `changes.state`, *order* `ASCENDENT`
- *name* `type`, *order* `ASCENDENT`

Add another index with *name* `type_identifier`, *type* `normal`, *unique* `true`.  
You need to add the following index fields:

- *name* `identifier`, *order* `ASCENDENT`
- *name* `type`, *order* `ASCENDENT`

After that, you need to set your collection as the one to be used by the Real-Time Updater. To do so, set the name of the collection you want to use as value of the `PROJECTIONS_CHANGES_COLLECTION_NAME` environment variable of the service.

:::note
To allow the Single View Creator to read from the Projection Changes, the collection name should also be set in the `PROJECTIONS_CHANGES_COLLECTION` environment variable of your Single View Creator service. 
:::

### Kafka Projection Updates configuration

Whenever the real-time updater performs a change on Mongo on a projection, you can choose to send a message to a Kafka topic as well, containing information about the performed change and, if possible, the state of the projection *before* and *after* the change and the document ID of the document involved in the change.

:::info
This feature has been introduced since version v3.5.0 of the real time updater
:::

To activate this feature you need to set the following environment variables:
- KAFKA_PROJECTION_UPDATES_FOLDER: path to the folder that contains the file `kafkaProjectionUpdates.json`, containing configurations of the topic where to send the updates to, mapped to each projection.
- GENERATE_KAFKA_PROJECTION_UPDATES: defines whether the real-time updater should send a message of update every time it writes the projection to Mongo. Default is `false`

#### Message schema

The message produced adheres to the following schema:

```json
{
    "type": "object",
    "required": [
        "projection",
        "operationType",
        "operationTimestamp",
        "primaryKeys"
    ],
    "properties": {
        "projection": {
            "type": "string",
            "description": "The name of the projection"
        },
        "operationType": {
            "type": "string",
            "description": "The type of operation performed on the collection",
            "enum": ["INSERT", "UPDATE", "DELETE"]
        },
        "operationTimestamp": {
            "type": "date",
            "description": "The timestamp at the operation execution"
        }
        "primaryKeys": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "The primary keys of the projection"
        },
        "documentId": {
            "type": "_id_",
            "description": "The _id of the Mongo document"
        }
        "before": {
            "type": "object",
            "description": "The projection document as found on the database before the execution of the operation. `null` after an `INSERT`, `undefined` when not available."
        },
        "after": {
            "type": "object",
            "description": "The projection document as found on the database after the execution of the operation. `null` after a `DELETE`."
        },
        "__internal__kafkaInfo": {
            "type": "object",
            "description": "The __internal__kafkaInfo field of the document, if available."
        }
    }
}
```

:::info
The `operationType` describes the *raw* operation executed on Mongo, and can be different from the input operation type; for example an input UPSERT operation either results in a `UPDATE` message, or an `INSERT` message, depending on the existence of the document before the operation.  
A virtual delete always results in an `UPDATE`, because the document still exists on Mongo after the execution with `__STATE__: "DELETED"`, while an input *real delete* always results in a `DELETE`.
:::

:::warning
For performance reasons, the projection state `before` of the projection is not returned after an update operation, because a costly `find` operation would be necessary to retrieve such information from the database. The only exception is an UPDATE resulting from a virtual delete: in this case the `before` is returned entirely.

For the same reason, the fields `createdAt` and `documentId` of the projections are returned only after an upsert inserting a new document or after a virtual delete.
:::

#### Configuration

You need to create a configuration with the same path as the one you set in `KAFKA_PROJECTION_UPDATES_FOLDER`. Then, you have to create a configuration file `kafkaProjectionUpdates.json` inside that configuration. The json configuration should look like this one:
```json
{
    "MY_PROJECTION": {
        "updatesTopic": "MY_UPDATES_TOPIC"
    }
}
```
where
- `MY_PROJECTION` is the name of the collection whose topic has received the message from the CDC.
- `MY_UPDATES_TOPIC` is the topic where the updates message will be sent to.

Notice that you need to set a topic for each projection in the system. Different projection can share the same topic.

For example:

```json
{
    "registry-json": {
        "updatesTopic": "registry-json.update"
    },
    "another-projection": {
        "updatesTopic": "another-projection.update"
    }
}
```

When the real time updater writes to Mongo in reaction to a CDC update, a message is sent to the related topic. For example, if a new projection is saved to the `registry-json`, an `INSERT` message is generated to the topic `registry-json.update`. The key of the resulting Kafka message will be the stringified JSON of the projection key value.

:::info
Notice that you can either set the topics for all the projections, or for a subset of them.
So, for example, if you need to setup a [Single View Patch](#single-view-patch) operation, you may want to configure only the projections needed in such Single View.
:::

## Advanced topics

### Primary Key update

Starting from `v7.1.0`, the Real-Time Updater supports the update of a Primary Key. In particular, it detects if received ingestion messages contain an updated Primary Key. In that case, the Real-Time updater automatically handles updating events on the existing records without requiring additional messages.

When the Real-Time Updater receives a Primary Key update, it triggers two different actions:
1. the deletion of the old record with the old Primary Key
2. the creation of a new record with the updated content and the updated Primary Key

:::note
In order to handle a Primary Key update, the Real-Time Updater needs to receive the following data:
- a positional information about the current operation
- the data values before the update
- the data values after the update

More details about the configuration of these fields can be found inside each Kafka message format paragraph in this page.
:::

:::warning
The Kafka message format based on the _IBM InfoSphere Data Replication for DB2_ CDC does not support the Primary Key update.
:::

### Snappy compression

Snappy is a compression and decompression library whose aim is to offer high speed data flow while still maintaining a reasonable compression ratio. Among the various types of compression supported by Kafka for its messages, there is also Snappy.

The main advantages of Snappy are:

* Fast compression speed (around 250 MB/sec)
* Moderate CPU usage
* Stability and robustness to prevent crashing while still maintaining the same bitstream format among different versions
* Free and open source

> *Note*: For further information about Snappy, check the official [GitHub page](https://github.com/google/snappy) of the library.

Provided that the client's **CDC** (Change Data Capture) supports Snappy compression, the console is already predisposed for it.

:::caution
Snappy, like every other compression and decompression algorithm, will always increase the delay between production and consumption of the message, hence it is not advised for strong real-time relying applications; on the other hand it is well recommended for initial loads which tend to be a lot heavier.
:::

#### Create ACL rules

It is possible to create ACL rules, you can set from user interface:

* *type*: set **topic** type.
* *topic name*: new or existent one.
* *pattern type*: literal or prefixed. If you want to declare an ACL for each topic you should use **literal**.
* *operation*: for each topic, you should set **READ** and **WRITE** operation.
* *permission*: could be `ALLOW` or `DENY`. You should set **ALLOW**. Once created, by default permission are to deny all others operations.

### Tracking the changes

From the **v3.2.0** of the Real-Time Updater, inside the Projections and Projection Changes additional information about the Kafka message that triggered the Real-Time Updater are saved. This allows you to track the changes made as consequence of a Kafka message.

In particular, the following information are saved:

#### Projection changes

Into each element of the `changes` array of the projection change document are inserted the information about the message that triggered the projection change

- topic: is the topic from which the Kafka message has been consumed
- partition: is partition from which the Kafka message has been consumed
- offset: is the offset of the message
- key: is the key of the Kafka message
- timestamp: is the timestamp of the message

Example:

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

#### Projection

Into the projection is saved information about the last Kafka message that updated the projection.
This information is saved inside a field named `__internal__kafkaInfo` in order to prevent collision with others projection fields.

The information saved are:

- topic: is the topic from which the Kafka message has been consumed
- partition: is partition from which the Kafka message has been consumed
- offset: is the offset of the message
- key: is the key of the Kafka message
- timestamp: is the timestamp of the message

Example:

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

### Prevent projection to be overwritten

During a rebalancing or a massive initial load with multiple replicas of the real time updater, a batch of old messages that have not been committed yet could be read by the real time updater. In fact, Kafka ensures that messages are received, in order, at least once.

To prevent that old messages that have already updated the projection, overwrite the projection again, the environment variable `FORCE_CHECK_ON_OFFSET` is set by default to `true`.

This setting is **strongly** recommended when you have both insert/update and delete operations.

:::caution
At the moment this variable is set to `true` by default, but you can turn it off in order to adapt your services in case they need some fix.
:::

### Kafka group rebalancing behavior

If a Kafka group rebalancing happens after that a projection has already been updated, projection changes will be generated anyway and the Real Time updater will still try to commit though.

:::note
This behavior has been introduced from v4.0.0 and above. In previous versions instead, a rebalancing check was made after each operation, and when it happened, the service would stop without generating any projection change.
:::

### CA certs

Since service version `5.4.0`, you can set your CA certs by providing a path to the certification file in the environment variable `CA_CERT_PATH`.

### Single View Patch

:::info
This feature is supported from version `7.1.2` of the Real-Time Updater
:::

As explained [here](/fast_data/configuration/single_views.md#single-view-patch), in order to arrange the Real-Time Updater for this specific operation, it's important to understand which are the projections impacted. Then, the following steps have to be followed:

* Activate Projection Updates with the env `GENERATE_KAFKA_PROJECTION_UPDATES`
* Configure the [Projection Updates](#kafka-projection-updates-configuration) only for the specific Projection

### Pause single topic's consumption on error

:::info
This feature is supported from version `7.1.4` of the Real-Time Updater
:::

When the Real Time Updater encounters an error while consuming an ingestion message it will just pause the topic's consumption of that message, instead of crashing. This feature is disabled by default, to enable it use the <code>PAUSE_TOPIC_CONSUMPTION_ON_ERROR</code> environment variable.

To use this feature make sure you have properly configured your alerts in your grafana dashboards so you can quickly detect pauses on topics' consumption and act on the problematic message to resume the consumption.
The ideal for that would be to set up some alerts based on the <code>kafka_consumergroup_lag</code> metric exposed by the <code>kafka-exporter</code> service configured in your project.
More on configuring alarms on grafana [here](https://grafana.com/docs/grafana/latest/alerting/alerting-rules/create-grafana-managed-rule/)
