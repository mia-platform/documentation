---
id: common
title: Real-Time Updater Common Configuration
sidebar_label: Common
---

Real-Time Updater is the service in charge of keeping up to date the projections with the data sent by the connected system.   
Optionally, the service can generates several events so that your services can consume these events and react when projections are updated. 

For having an overview of the features of the Real-Time Updater, you can go [here](../../realtime_updater.md).   
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
    <tr><td>KAFKA_GROUP_ID</td><td>true</td><td>defines the Kafka group id</td><td>-</td></tr>
    <tr><td>KAFKA_SASL_USERNAME</td><td>true</td><td>defines the Kafka SASL username</td><td>-</td></tr>
    <tr><td>KAFKA_SASL_PASSWORD</td><td>true</td><td>defines the Kafka SASL password</td><td>-</td></tr>
    <tr><td>LIVENESS_INTERVAL_MS</td><td>true</td><td>defines the liveness interval in milliseconds</td><td>-</td></tr>
    <tr><td>INVARIANT_TOPIC_MAP</td><td>true</td><td>defines an object that maps the topic to the projection</td><td>-</td></tr>
    <tr><td>KAFKA_USE_LATEST_DEQUEUE_STRATEGY</td><td>false</td><td>defines latest dequeue strategy or not</td><td>-</td></tr>
    <tr><td>KAFKA_ADAPTER_FOLDER</td><td>false</td><td>defines the path to the Kafka adapter folder</td><td>-</td></tr>
    <tr><td>CAST_FUNCTIONS_FOLDER</td><td>false</td><td>defines the path to the cast-functions folder</td><td>-</td></tr>
    <tr><td>MAP_TABLE_FOLDER</td><td>false</td><td>defines the path to the map table folder</td><td>-</td></tr>
    <tr><td>STRATEGIES_FOLDER</td><td>false</td><td>defines the path to the strategies' folder</td><td>-</td></tr>
    <tr><td>KAFKA_SASL_MECHANISM</td><td>false</td><td>defines the authentication mechanism. It can be one of: `plain`, `scram-sha-256` or `scram-sha-512`.</td><td>plain</td></tr>
    <tr><td>USE_UPSERT</td><td>false</td><td>defines whether to use [upsert](#Upsert) or not when performing insert and update operations.</td><td>true</td></tr>
    <tr><td>KAFKA_MESSAGE_ADAPTER</td><td>false</td><td>defines which Kafka message adapter to use. Its value can be one of the following: `basic`, `golden-gate`, `custom`.</td><td>basic</td></tr>
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
</table>

## How data are managed on MongoDB

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

Once you have created a System, you need to select the format of the Kafka messages sent by the system.
To do that, you must correctly configure the Kafka Message Adapter, changing the value of the Real Time Updater's `KAFKA_MESSAGE_ADAPTER` environment variable, which should be one of the following: `basic`, `golden-gate`, `custom`.

Another option that you should be aware of when thinking about the format of your Kafka messages is the "upsert" or "insert".
By default, the real-time-updater will perform upsert operations, but you can optionally decide to perform inserts that will fail if the document already exists, instead of updating it.

#### Basic

It's the default one.

The `timestamp` of the Kafka message has to be a stringified integer greater than zero. This integer has to be a valid timestamp.
The `key` of the Kafka message has to be a stringified object containing the primary key of the projection, if `value` also contains the primary key of the projection this field can be an empty string.
The `value` is **null** if it's a *delete* operation, otherwise it contains the data of the projection.
The `offset` is the offset of the Kafka message.

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

#### Golden Gate

The `timestamp` of the Kafka message is a stringified integer greater than zero. This integer has to be a valid timestamp.  
The `offset` is the offset of the Kafka message.
The `key` can have any valid Kafka `key` value.  
The `value` of the Kafka message instead needs to have the following fields:

- `op_type`: the type of operation (`I` for insert, `U` for update, `D` for delete).
- `after`: the data values after the operation execution (`null` or not set if it's a delete operation)
- `before`: the data values before the operation execution (`null` or not set if it's an insert)

Example of `value` for an insert operation:

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
To do that, you need to create a `Custom Kafka Message Adapter` inside the Kafka Adapters configmap. The adapter is a javascript function that converts Kafka messages as received from the real-time updater to an object with a specific structure. This function that accepts as arguments the Kafka message and the list of primary keys of the projection, and returns an object with the following properties:

- **offset**: the offset of the Kafka message
- **timestampDate**: an instance of `Date` of the timestamp of the Kafka message.
- **keyObject**: an object containing the primary keys of the projection. It is used to know which projection document needs to be updated with the changes set in the value.
- **value**: the data values of the projection, or null
- **operation**: optional value that indicates the type of operation (either `I` for insert, `U` for update, or `D` for delete). It is not needed if you are using an upsert on insert logic (the default one), while it is required if you want to differentiate between insert and update messages.

If the `value` is null, it is a delete operation.
The `keyObject` **cannot** be null.

Inside configmap folder create your javascript file named `kafkaMessageAdapter.js`.

The file should export a simple function with the following signature:

```js
module.exports = function kafkaMessageAdapter(kafkaMessage, primaryKeys, logger) {
  const {
    value: valueAsBuffer, // type Buffer
    key: keyAsBuffer, // type Buffer
    timestamp: timestampAsString, // type string
    offset: offsetAsString, // type string
    operation: operationAsString // type string
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
In this folder you have all the generated [Cast Functions](../cast_functions) definitions. This configuration is read-only since you can configure it from its dedicated section of the Console.

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
                "topic": "MY_TOPIC",
            }
        }
    }
}
```

where:

- `MY_PROJECTION` is the name of the collection whose topic has received the message from the CDC.
- `MY_SINGLE_VIEW` is the single view that have to be updated
- `MY_TOPIC` is the topic where the projection change need to be sent (for further information about the naming convention adopted for this topic, [click here](../../inputs_and_outputs.md#topic-for-svc-trigger))

Example:

```json
{
    "registry-json": {
        "projectionChanges": {
            "sv_pointofsale": {
                "topic": "my-tenant.development.my-database.sv-pointofsale.sv-trigger",
            }
        }
    },
    "another-projection": {
        "projectionChanges": {
            "sv_customer": {
                "topic": "my-tenant.development.my-database.sv-customer.sv-trigger"
            }
        }
    }
}
```

When a message about `registry-json` happens, the projection changes will be saved on MongoDB, and it will be sent to the Kafka topic `my-tenant.development.my-database.sv-pointofsale.sv-trigger` as well.

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


## Advanced topics

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
