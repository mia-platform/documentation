---
id: configuration
title: Real-Time Updater Configurations
sidebar_label: Configuration
---

The Real-Time Updater needs some environment variables and some configurations file to work.

## Environment variables

- LOG_LEVEL (__required__): defines the level of the logger  
- MONGODB_URL (__required__):  defines the mongodb url to contact  
- PROJECTIONS_DATABASE_NAME (__required__): defines the name of the projections database  
- PROJECTIONS_CHANGES_COLLECTION_NAME (__required__): defines the name of the projections changes collection  
- PROJECTIONS_CHANGES_ENABLED: defines whether you want to generate projections changes, default is **true**,
- LC39_HTTP_PORT (__required__): defines the lc39 http port
- STRATEGIES_MAX_EXEC_TIME_MS (__required__): defines the maximum time for which a strategy is executed
- KAFKA_BROKERS (__required__): defines the kafka brokers
- KAFKA_GROUP_ID (__required__): defines the kafka group id
- KAFKA_SASL_USERNAME (__required__): defines the kafka sasl username
- KAFKA_SASL_PASSWORD (__required__): defines the kafka sasl password
- LIVENESS_INTERVAL_MS (__required__) defines the liveness interval in milliseconds
- INVARIANT_TOPIC_MAP (__required__): defines an object that maps the topic to the projection
- KAFKA_USE_LATEST_DEQUEUE_STRATEGY:  defines latest dequeue strategy or not
- KAFKA_ADAPTER_FOLDER: defines the path to the kafka adapter folder
- CAST_FUNCTIONS_FOLDER: defines the path to the cast-functions folder
- MAP_TABLE_FOLDER: defines the path to the map table folder
- STRATEGIES_FOLDER: defines the path to the strategies folder
- KAFKA_SASL_MECHANISM: defines the authentication mechanism. It can be one of: `plain`, `scram-sha-256` or `scram-sha-512`. The default value is `plain`
- USE_UPSERT: defines whether to use upsert or not when performing insert and update operations. Defaults to true
- KAFKA_MESSAGE_ADAPTER: defines which Kafka message adapter to use. Its value can be one of the following: `basic`, `golden-gate`, `custom`.
- KAFKA_PROJECTION_CHANGES_FOLDER: path where has been mounted the `kafkaProjectionChanges.json` configuration (v3.4.0 or above).
- GENERATE_KAFKA_PROJECTION_CHANGES: defines whether the projection changes have to be send to Kafka too or not. Default is `false`(v3.4.0 or above).
- KAFKA_CONSUMER_MAX_WAIT_TIME: defines the maximum waiting time of Kafka Consumer for new data in batch. Default is 500 ms.
- COMMIT_MESSAGE_LOGGING_INTERVAL: specify the interval in *ms* of logging the info that messages have been committed. Default is 3000.

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

- *name* `type`, *order* `ASCENDENT`
- *name* `changes.state`, *order* `ASCENDENT`

Add another index with *name* `type_identifier`, *type* `normal`, *unique* `true`.  
You need to add the following index fields:

- *name* `type`, *order* `ASCENDENT`
- *name* `identifier`, *order* `ASCENDENT`

After that, you need to set your collection as the one to be used by the Real-Time Updater. To do so, set the name of the collection you want to use as value of the `PROJECTIONS_CHANGES_COLLECTION_NAME` environment variable of the service.

## Configuration files

The Real-Time Updater accepts the following configurations:

### KAFKA_ADAPTER configurations

The mount path used for these configurations is: `/home/node/app/configurations/kafkaAdapterFolder`.  
This folder contains the configurations for your kafka adapters.

### CAST_FUNCTION configurations

The mount path used for these configurations is: `/home/node/app/configurations/castFunctionsFolder`.  
In this folder you have all the generated [Cast Functions](../cast_functions) definitions.

### STRATEGIES configuration

The default mount path used for these configuration is: `/home/node/app/configurations/strategies`.  
In this folder you have all the generated [Strategies](../single_view#strategies) which you have defined in your gitlab project inside the `fast-data-files/strategies` directory.

### MAP_TABLE configurations

The mount path used for these configurations is: `/home/node/app/configurations/mapTableFolder`.  
Two mappings will be placed in this folder: one between cast functions and fields and another one between strategies and projections.

An example:

```json
{
    "projection-name": {
        "destination": "projection-name",
        "conversion": {
            "UNIQUE_ID": {
                "fieldName": "UNIQUE_ID",
                "cast": "__fromFile__[defaultCastToString]"
            },
            "NAME": {
                "fieldName": "NAME",
                "cast": "__fromFile__[defaultCastToString]"
            },
            "ADDRESS": {
                "fieldName": "ADDRESS",
                "cast": "__fromFile__[defaultCastToString]"
            }
        },
        "fieldsInKey": ["UNIQUE_ID"],
        "changes": {
            "sv_single_views": "__fromFile__[getIdUniqueFromSingleView]"
        }
    }
}
```

### Kafka Projection Changes configuration

Projection changes are saved on mongo, but from version v3.4.0 and above, you can send them to Kafka as well.

This feature enables you to send the projection changes to a topic kafka you want to. This is useful if you want to have an history of the projection changes thanks to the Kafka retention of messages.   
You can also make your own custom logic when a projection change occurs by setting a Kafka consumer attached to the topic kafka you set.


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
- `MY_TOPIC` is the topic where the projection change need to be sent

Example:
```json
{
    "registry-json": {
        "projectionChanges": {
            "sv_pointofsale": {
                "topic": "my-project.development.sv-pointofsale-pc-json",
            }
        }
    },
    "another-projection": {
        "projectionChanges": {
            "sv_customer": {
                "topic": "my-project.development.sv-customer-pc-json"
            }
        }
    }
}
```

When a message about `registry-json` happens, the projection changes will be saved on mongo and it will be sent to the Kafka topic `my-project.development.sv-pointofsale-pc-json` as well.


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
        "topic": "my-topic.development.foobar-json",
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
These information are saved inside a field named `__internal__kafkaInfo` in order to prevent collision with others projection fields. 

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
        "topic": "my-topic.development.foobar-json",
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

To prevent that old messages that have already updated the projection, overwrite the projection again, you can set the environment variable `FORCE_CHECK_ON_OFFSET` to `true`.   

This setting is **strongly** recommended when you have both insert/update and delete operations.

:::caution
In future versions of the Real-Time Updater this feature will be turned on as default, with no chance of turning off. 
At the moment, you can keep it turned off just to be able to adapt your services in case they need some fix.
:::

### Kafka group rebalancing behavior

If a Kafka group rebalancing happens after that a projection has already been updated, projection changes will be generated anyway and the Real Time updater will still try to commit though.

:::note
This behavior has been introduced from v4.0.0 and above. In previous versions instead, a rebalancing check was made after each operation, and when it happened, th service would stop without generating any projection change.
:::
