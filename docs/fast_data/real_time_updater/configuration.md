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
- KAFKA_MESSAGE_ADAPTER (__required__):  defines the kafka message adapter
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


