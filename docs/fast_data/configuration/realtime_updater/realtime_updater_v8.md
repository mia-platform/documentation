---
id: realtime_updater_v8
title: Real-Time Updater Configuration
sidebar_label: v8+
---

Real-Time Updater is the service in charge of constantly keeping up-to-date projections records with respect to change events
that are received from the associated System of Records. Once modifications are stored to the database, the service
triggers downstream components with the proper mechanism, so that Single Views can be regenerated with the latest data. 

For having an overview of the features of the Real-Time Updater, you can go [here](/fast_data/configuration/realtime_updater/realtime_updater_v7.md).   
Below, instead, is explained how to configure the service starting from version `v8`. With this version the service
has been overhauled and polished to offer a more streamlined configuration experience, improved performances and higher reliability.

## Environment variables

| Name             | Required | Description                                                                                               | Default            |
|------------------|----------|-----------------------------------------------------------------------------------------------------------|--------------------|
| LOG_LEVEL        | &check;  | defines the service logger level, which can be `TRACE`, `DEBUG`, `INFO`, `WARN` or `ERROR`                | -                  |
| HTTP_PORT        | -        | defines the service HTTP port where status and metrics endpoints are exposed                              | 3000               |
| CONFIG_FILE_PATH | -        | defines the file path where the service configuration is found (it can either be a `json` or `yaml` file) | `conf/config.json` |

## Configuration File

In the following sections are described each configuration file section. It is important to notice that Fast Data configurator
will provide the option to configure the service without manually writing the file.

### Service Settings

Here are described the parameters intrinsic to service that specify its behaviors.

#### System Of Records

| Property          | Type     | Required | Default  |
|-------------------|----------|----------|----------|
| `systemOfRecords` | `string` | -        |          |

It is the data source identifier (a name) describing from which system the service is importing data.

#### Deletion Policy

| Property           | Type      | Required | Default |
|--------------------|-----------|----------|---------|
| `enableSoftDelete` | `boolean` | -        | `true`  |

Records on the origin system may get deleted and consequently a change event requesting the removal of a document from a projection
is produced. When the service reads this event, it is possible to define which behavior is adopted in processing the delete operation,
depending on your needs.  
Indeed, the service can be configured to apply a _soft delete_ policy, meaning that projections records are not delete from the storage system, but
they are marked as `DELETED`, so that downstream components would not read those records when aggregating the Single View records.
On the contrary, the service can also adopt a _hard delete_ policy, where there projection record is removed immediately from the storage system.

This flag determines whether the _soft delete_ policy is enabled, which by default it is.

#### Message Adapter

| Property            | Type     | Required | Default             |
|---------------------|----------|----------|---------------------|
| `dataSourceAdapter` | `object` | &check;  | `{ "type": "db2" }` |

When consuming change events from ingestion topics, the Real-Time Updater needs to know how to parse them. For
this reason it is provided a convenient manner to select the message adapter. Out of the box the service supports
message formats employed by some Change Data Capture systems (CDC), which are:

- `db2`, based on the [IBM InfoSphere Data Replication for DB2](https://www.ibm.com/docs/en/db2-for-zos/13?topic=getting-started-db2-zos) CDC

    ```json
    "dataSourceAdapter": { "type":  "db2"}
    ```
- `golden-gate`, based on the [Oracle GoldenGate](https://docs.oracle.com/goldengate/c1230/gg-winux/GGCON/introduction-oracle-goldengate.htm#GGCON-GUID-EF513E68-4237-4CB3-98B3-2E203A68CBD4) CDC

    ```json
    "dataSourceAdapter": { "type":  "golden-gate"}
    ```
- `debezium`, based on the [Debezium](https://debezium.io/documentation/reference/stable/tutorial.html) CDC

    ```json
    "dataSourceAdapter": { "type":  "debezium"}
    ```

In addition to the already existing message adapters, it is also possible to provide to the service a _user-defined function_
that acts as message adapter. This function takes as input the incoming message associated to a projection, the list of
primary key fields expected for that projection and the service logger. Its goal is to process the message and produce
an object containing the description of the parsed message in a common format.  
Here is described the interface of the
function:

**Input**

- `message` → byte array

**Output**

- `operation` →
- `key`
- `before`
- `after`


<details><summary>Custom Message Adapter Function (Javascript)</summary>
<p>

```javascript
'use strict'

function messageAdapter(kafkaMessage, primaryKeys, logger) {
  const payload = JSON.parse(kafkaMessage.toString('utf8'))
  const key = Object.fromEntries(
      Object.values(primaryKeys).map(keyEntry => [keyEntry, payload[keyEntry]])
  )

  logger.trace({ key, payload }, 'custom message adapter')

  return {
    operation: Boolean(payload) ? 'U' : 'D',
    key,
    before: undefined,
    after: payload
  }
}
```

</p>
</details>

<details><summary>Custom Message Adapter Function (Kotlin)</summary>
<p>

```kotlin
package customMessageAdapter

import org.slf4j.Logger

fun messageAdapter (message: ByteArray, primaryKeys: List<String>, logger: Logger): Any {
    return mapOf(
        "operation" to "I",
        "key" to mapOf("INT_KEY" to 123, "STR_KEY" to "id"),
        "before" to null,
        "after" to mapOf("INT_KEY" to 123, "STR_KEY" to "id", "STR_FIELD" to "value")
    )
}
```

</p>
</details>

#### Custom Cast Functions

| Property        | Type     | Required | Default |
|-----------------|----------|----------|---------|
| `castFunctions` | `object` | -        |         |

### Consumer

### Producer

### Storage

### Projections Config



## Configuration files

The Real-Time Updater accepts the following configurations:


#### Custom

If you have Kafka Messages that do not match one of the formats above, you can create your own custom adapter for the messages. 

To make this work, you need to create a `Custom Kafka Message Adapter` inside _Real Time Updater_ section of the related System of Records. The adapter must be a javascript function that converts Kafka messages as received from the Real-Time Updater to an object with a specific structure. This function must receives as arguments the Kafka message and the list of primary keys of the projection, and must return an object with the following properties:

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

To see the message's structure specification and some examples go to the [Inputs and Outputs page](/fast_data/inputs_and_outputs.md#custom) .

:::note
To support a Primary Key update, the `before`, `after` and `operationPosition` fields should be included in the adapter. (Hint: if not present, a simple `operationPosition` value might be the Kafka message timestamp).
:::

Inside configmap folder create your javascript file named `kafkaMessageAdapter.js`.

### CAST_FUNCTION configurations

The mount path used for these configurations is: `/home/node/app/configurations/castFunctionsFolder`.  
In this folder you have all the generated [Cast Functions](/fast_data/configuration/cast_functions.md) definitions. This configuration is read-only since you can configure it from its dedicated section of the Console.

### MAP_TABLE configurations

The mount path used for these configurations is: `/home/node/app/configurations/mapTableFolder`.  
Two mappings will be placed in this folder: one between cast functions and fields and another one between strategies and projections.
This configuration is read-only since it's configured automatically based on the projections and strategies you configure from the Fast Data section of the Console.

### Kafka Projection Updates configuration

Whenever the Real-Time Updater performs a change on Mongo on a projection, you can choose to send a message to a Kafka topic as well, containing information about the performed change and, if possible, the state of the projection *before* and *after* the change and the document ID of the document involved in the change.

:::info
This feature has been introduced since version v3.5.0 of the real time updater
:::

To activate this feature you need to set the following environment variables:
- `KAFKA_PROJECTION_UPDATES_FOLDER`: path to the folder that contains the file `kafkaProjectionUpdates.json`, containing configurations of the topic where to send the updates to, mapped to each projection.
- `GENERATE_KAFKA_PROJECTION_UPDATES`: defines whether the Real-Time Updater should send a message of update every time it writes the projection to Mongo. Default is `false`

:::info
From `v10.2.0` of Mia-Platform Console, a configuration for Kafka Projection Updates is automatically generated when creating a new Real Time Updater and saving the configuration. Further information about the automatic generation can be found inside the [Projection page](/fast_data/configuration/projections.md#pr-update-topic). If you prefer to create a custom configuration, please use the following guide.
:::

You need to create a configuration with the same path as the one you set in `KAFKA_PROJECTION_UPDATES_FOLDER`. Then, you have to create a configuration file `kafkaProjectionUpdates.json` inside that configuration.

:::warning
To prevent possible conflicts with the automatically created configuration, please set the `KAFKA_PROJECTION_UPDATES_FOLDER` to a value different from the default `/home/node/app/kafkaProjectionUpdates` path.
:::

To know more on how to configure the `kafkaProjectionUpdates.json` please refer to its [Configuration](/fast_data/configuration/config_maps/kafka_projection_updates.md) page.

:::info
Notice that you can either set the topics for all the projections, or for a subset of them.
So, for example, if you need to setup a [Single View Patch](#single-view-patch) operation, you may want to configure only the projections needed in such Single View.
:::

## Configuration File Example

Below is presented an example of Real-Time Updater working configuration, both `JSON` and `YAML` formats, which are the ones
supported by the service.

<details><summary>Real-Time Updater configuration (JSON)</summary>
<p>

```json
{
  "version": 2,
  "settings": {
    "systemOfRecords": "inventory",
    "enableSoftDelete": true,
    "dataSourceAdapter": {
      "type": "debezium"
    }
  },
  "consumer": {
    "type": "kafka",
    "configurations": {
      "client.id": "galaxy.fast-data.DEV.inventory-realtime-updater-consumer",
      "bootstrap.servers": "localhost:9092",
      "group.id": "galaxy.fast-data.DEV.inventory-realtime-updater",
      "auto.offset.reset": "earliest",
      "max.poll.records": 2000,
      "max.poll.timeout": 500,
      "sasl.jaas.config": "org.apache.kafka.common.security.scram.ScramLoginModule required username=\"<username>\" password=\"<password>\";",
      "sasl.mechanism": "SCRAM-SHA-256",
      "security.protocol": "SASL_SSL"
    }
  },
  "producer": {
    "type": "kafka",
    "configurations": {
      "client.id": "galaxy.fast-data.DEV.inventory-realtime-updater-producer",
      "bootstrap.servers": "localhost:9092",
      "sasl.jaas.config": "org.apache.kafka.common.security.scram.ScramLoginModule required username=\"<username>\" password=\"<password>\";",
      "sasl.mechanism": "SCRAM-SHA-256",
      "security.protocol": "SASL_SSL"
    }
  },
  "storage": {
    "type": "mongodb",
    "configurations": {
      "url": "mongodb://localhost:27017",
      "database": "fast-data-inventory-dev"
    }
  },
  "projections": {
    "pr_customers": {
      "topics": {
        "ingestion": {
          "name": "galaxy.fast-data.DEV.customers.ingestion",
          "active": true
        },
        "prUpdate": {
          "name": "galaxy.fast-data.DEV.customers.pr-update",
          "active": true
        }
      },
      "customStorageNamespace": "customers",
      "primaryKeys": [
        "id"
      ],
      "fieldsMapping": {
        "id": {
          "targetField": "id",
          "castFunction": "identity"
        },
        "first_name": {
          "targetField": "first_name",
          "castFunction": "castToString"
        },
        "last_name": {
          "targetField": "last_name",
          "castFunction": "castToString"
        },
        "email": {
          "targetField": "email",
          "castFunction": "castToString"
        },
        "bio": {
          "targetField": "bio",
          "castFunction": "castToString"
        }
      }
    },
    "pr_orders": {
      "topics": {
        "ingestion": {
          "name": "galaxy.fast-data.DEV.orders.ingestion",
          "active": true
        },
        "prUpdate": {
          "name": "galaxy.fast-data.DEV.orders.pr-update",
          "active": true
        }
      },
      "customStorageNamespace": "orders",
      "primaryKeys": [
        "order_number"
      ],
      "fieldsMapping": {
        "order_number": {
          "targetField": "order_number",
          "castFunction": "identity"
        },
        "order_date": {
          "targetField": "order_date",
          "castFunction": "castToDate"
        },
        "purchaser": {
          "targetField": "purchaser",
          "castFunction": "identity"
        },
        "quantity": {
          "targetField": "quantity",
          "castFunction": "castToInteger"
        },
        "product_id": {
          "targetField": "product_id",
          "castFunction": "identity"
        },
        "price": {
          "targetField": "price",
          "castFunction": "castToFloat"
        },
        "delivery": {
          "targetField": "delivery",
          "castFunction": "castToString"
        }
      }
    },
    "pr_products": {
      "topics": {
        "ingestion": {
          "name": "galaxy.fast-data.DEV.products.ingestion",
          "active": true
        },
        "prUpdate": {
          "name": "galaxy.fast-data.DEV.products.pr-update",
          "active": true
        }
      },
      "customStorageNamespace": "products",
      "primaryKeys": [
        "id"
      ],
      "fieldsMapping": {
        "id": {
          "targetField": "id",
          "castFunction": "identity"
        },
        "name": {
          "targetField": "name",
          "castFunction": "castToString"
        },
        "description": {
          "targetField": "description",
          "castFunction": "castToString"
        },
        "weight": {
          "targetField": "weight",
          "castFunction": "castToFloat"
        },
        "material": {
          "targetField": "material",
          "castFunction": "castToString"
        },
        "price": {
          "targetField": "price",
          "castFunction": "castToFloat"
        }
      }
    }
  }
}
```

</p>
</details>

<details><summary>Real-Time Updater configuration (YAML)</summary>
<p>

```yaml
version: 2
settings:
  systemOfRecords: inventory
  enableSoftDelete: true
  dataSourceAdapter:
    type: debezium
consumer:
  type: kafka
  configurations:
    "client.id": galaxy.fast-data.DEV.inventory-realtime-updater-consumer
    "bootstrap.servers": localhost:9092
    "group.id": galaxy.fast-data.DEV.inventory-realtime-updater
    "auto.offset.reset": earliest
    "max.poll.records": 2000
    "max.poll.timeout": 500
    "sasl.jaas.config": org.apache.kafka.common.security.scram.ScramLoginModule required username="<username>" password="<password>";
    "sasl.mechanism": SCRAM-SHA-256
    "security.protocol": SASL_SSL
producer:
  type: kafka
  configurations:
    "client.id": galaxy.fast-data.DEV.inventory-realtime-updater-producer
    "bootstrap.servers": localhost:9092
    "sasl.jaas.config": org.apache.kafka.common.security.scram.ScramLoginModule required username="<username>" password="<password>";
    "sasl.mechanism": SCRAM-SHA-256
    "security.protocol": SASL_SSL
storage:
  type: mongodb
  configurations:
    url: mongodb://localhost:27017
    database: fast-data-inventory-dev
projections:
  pr_customers:
    topics:
      ingestion:
        name: galaxy.fast-data.DEV.customers.ingestion
        active: true
      prUpdate:
        name: galaxy.fast-data.DEV.customers.pr-update
        active: true
    customStorageNamespace: customers
    primaryKeys:
      - id
    fieldsMapping:
      id:
        targetField: id
        castFunction: identity
      first_name:
        targetField: first_name
        castFunction: castToString
      last_name:
        targetField: last_name
        castFunction: castToString
      email:
        targetField: email
        castFunction: castToString
      bio:
        targetField: bio
        castFunction: castToString
  pr_orders:
    topics:
      ingestion:
        name: galaxy.fast-data.DEV.orders.ingestion
        active: true
      prUpdate:
        name: galaxy.fast-data.DEV.orders.pr-update
        active: true
    customStorageNamespace: orders
    primaryKeys:
      - order_number
    fieldsMapping:
      order_number:
        targetField: order_number
        castFunction: identity
      order_date:
        targetField: order_date
        castFunction: castToDate
      purchaser:
        targetField: purchaser
        castFunction: identity
      quantity:
        targetField: quantity
        castFunction: castToInteger
      product_id:
        targetField: product_id
        castFunction: identity
      price:
        targetField: price
        castFunction: castToFloat
      delivery:
        targetField: delivery
        castFunction: castToString
  pr_products:
    topics:
      ingestion:
        name: galaxy.fast-data.DEV.products.ingestion
        active: true
      prUpdate:
        name: galaxy.fast-data.DEV.products.pr-update
        active: true
    customStorageNamespace: products
    primaryKeys:
      - id
    fieldsMapping:
      id:
        targetField: id
        castFunction: identity
      name:
        targetField: name
        castFunction: castToString
      description:
        targetField: description
        castFunction: castToString
      weight:
        targetField: weight
        castFunction: castToFloat
      material:
        targetField: material
        castFunction: castToString
      price:
        targetField: price
        castFunction: castToFloat
```

</p>
</details>

## Advanced topics


### PR Update format 

* *type*: set **topic** type.
* *topic name*: new or existent one.
* *pattern type*: literal or prefixed. If you want to declare an ACL for each topic you should use **literal**.
* *operation*: for each topic, you should set **READ** and **WRITE** operation.
* *permission*: could be `ALLOW` or `DENY`. You should set **ALLOW**. Once created, by default permission are to deny all others operations.




### CA certs

Since service version `5.4.0`, you can set your CA certs by providing a path to the certification file in the environment variable `CA_CERT_PATH`.
