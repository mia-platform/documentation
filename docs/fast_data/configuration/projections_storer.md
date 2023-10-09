---
id: projections_storer
title: Projections Storer Configuration
sidebar_label: Projections Storer
---

Projections Storer is the service in charge of constantly keeping up-to-date projections records with respect to change events
that are received from the associated System of Records. Once modifications are stored to the database, the service
triggers downstream components with the proper mechanism, so that Single Views can be regenerated with the latest data. 

This service partially overlap with the concerns of Real-Time Updater plugin, in particular converting in near real-time
change events into projections records. Nonetheless, it has been designed to offer a more streamlined configuration experience,
improved performances and higher reliability.

For an overview of which are Real-Time Updater's features, it is possible to read the introduction documentation [here](/fast_data/realtime_updater.md).

<!--TODO: add page describing the differences between PS and RTU-->

:::danger
Projections Storer plugin does not support the Fast Data [standard architecture](/fast_data/architecture.md#standard-architecture).
However, it supports all the others architecture where Projection Records Updates messages are emitted by the service as
triggers for the Fast Data downstream components. This means that, in order to use the Projections Storer, it will
be necessary to instantiate a [Single View Trigger Generator](/fast_data/single_view_trigger_generator.md) plugin to actually trigger the generation of Single Views.
:::

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

Here are described the parameters intrinsic to service that specify its behaviors. An example of service configuration
can be the following one:

```json
"settings": {
  "systemOfRecords": "inventory",
  "enableSoftDelete": true,
  "dataSourceAdapter": {
    "type": "debezium"
  },
  "castFunctions": {
    "mapToAddressType": "/app/extensions/mapToAddressType.kts",
  }
}
```

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
| `dataSourceAdapter` | `object` | -        | `{ "type": "db2" }` |

When consuming change events from ingestion topics, the Real-Time Updater needs to know how to parse them. For
this reason it is provided a convenient manner to select the message adapter. Out of the box the service supports
message formats employed by some Change Data Capture systems (CDC), which are:

- `db2`, based on the [IBM InfoSphere Data Replication for DB2](https://www.ibm.com/docs/en/db2-for-zos/13?topic=getting-started-db2-zos) CDC

    ```json
    "dataSourceAdapter": { "type":  "db2" }
    ```
- `golden-gate`, based on the [Oracle GoldenGate](https://docs.oracle.com/goldengate/c1230/gg-winux/GGCON/introduction-oracle-goldengate.htm#GGCON-GUID-EF513E68-4237-4CB3-98B3-2E203A68CBD4) CDC

    ```json
    "dataSourceAdapter": { "type":  "golden-gate" }
    ```
- `debezium`, based on the [Debezium](https://debezium.io/documentation/reference/stable/tutorial.html) CDC

    ```json
    "dataSourceAdapter": { "type":  "debezium" }
    ```

In addition to the already existing message adapters, it is also possible to provide to the service a _user-defined function_
that acts as message adapter. This function takes as input the incoming message associated to a projection, the list of
primary key fields expected for that projection and the service logger. Its goal is to process the message and produce
an object containing the description of the parsed message in a common format.  
Thus, besides defining the usage of `custom` message adapter type, in the configuration it is also necessary to provide the location of the file
containing the custom message adapter function. For example:

```json
"dataSourceAdapter": {
  "type":  "custom "
  "filepath": "/app/extensions/messageAdapter.kt"
}
```

:::note
It is important to remember to mount the custom message adapter within the plugin instance to the same location that it is defined
in the `dataSourceAdapter` configuration.
:::

Here is described the interface of the custom message adapter function:

**Input**

- `messageKey` → `ByteArray` (Kotlin) / `Buffer` (Javascript) → the raw message key of the incoming message from the ingestion topic  
- `payload` → `Map<String, Any>?` → a map object that contains the payload of the incoming message from the ingestion topic.  
**Note:** in Javascript it is necessary to use the Kotlin Map methods to access the key / value entries of the object.
- `primaryKeys` → `List<String>` → the list of fields that compose the primary key identifier for that specific projection
- `logger` → service logger instance which exports leveled output functions (e.g. `info()`, `debug()`, ...)

**Output**

- `operation` → the identifier of the operation applied on the record, which can be `I` (insertion), `U` (update) or `D` (deletion)
- `key` → an object/map that contains the primary key fields for the record matching their value
- `before` → an object/map or `null`, which represents the record before the last change occurred 
- `after` → an object/map or `null`, which represents the record obtained after applying the change that triggered the ingestion event

Taking into account the above details, it is possible to implement _user-defined functions_ either in Javascript or Kotlin.
Below is provided an example for each supported programming language.

<details><summary>Custom Message Adapter Function (Kotlin - messageAdapter.kt)</summary>
<p>

```kotlin
package customMessageAdapter

import org.slf4j.Logger

// NOTE: the message adapter entry point function must be named `messageAdapter`
fun messageAdapter(messageKey: ByteArray?, payload: Map<String, Any>?, primaryKeys: List<String>, logger: Logger): Any {
  val key = primaryKeys
    .filter { payload?.containsKey(it) ?: false }
    .associateWith { payload?.get(it) }

  logger.debug("key: $key")

  return mapOf(
    "operation" to (if (payload.isNullOrEmpty()) { "D" } else "I"),
    "key" to key,
    "before" to null,
    "after" to payload,
  )
}
```

</p>
</details>

<details><summary>Custom Message Adapter Function (Javascript - messageAdapter.js)</summary>
<p>

```javascript
'use strict'

// NOTE: the message adapter entry point function must be named `messageAdapter`
function messageAdapter(messageKey, payload, rawPrimaryKeys, logger) {
  // rawPrimaryKeys arrives as object -> to get a list it is necessary to extract its values
  const primaryKeys = Object.values(rawPrimaryKeys)

  // use a convenience function to extract the event key
  // from any nested field (here the whole payload object has been used)
  const key = extractKey(payload, primaryKeys)

  logger.debug(JSON.stringify(key))

  return {
    operation: Boolean(payload) ? 'I' : 'D',
    key,
    before: undefined,
    after: payload
  }
}

function extractKey(obj, wantedKeys) {
  return Object.fromEntries(
      wantedKeys
        .filter(keyEntry => obj.containsKey(keyEntry))
        .map(keyEntry => [keyEntry, obj.get(keyEntry)])
  )
}
```

</p>
</details>

:::caution
Within the custom message adapter script file it is possible to define multiple functions. However, it is mandatory
to define a function named `messageAdapter`, which will be treated as entry point for the custom message adapter.
:::

#### Cast Functions and Additional Cast Functions

| Property        | Type     | Required | Default |
|-----------------|----------|----------|---------|
| `castFunctions` | `object` | -        |         |

Real-Time Updater service allows to perform basic transformation logic on each field of projection records before writing
them onto the storage system. By default, it offers a set of predefined functions that convert a projection record field from one type
into another. For example, it allows to convert a string containing a number into an integer. Below it is shown the list of
existing functions:

- `identity` → applies the identity function (no change occurs)
- `castToString` → convert the input value into a string
- `castToInteger` → convert the input value into an integer number
- `castToFloat` → convert the input value into a decimal number
- `castUnixTimestampToISOString` → convert the input value from a Unix timestamp (e.g. `1695141357284`) to the same timestamp in ISO 8601 format (e.g. `2023-09-19T16:35:57.284Z`)
- `castStringToBoolean` → convert the string value `true` and `false` to their corresponding boolean value
- `castToDate` → convert a string or a number into a Date object
- `castToObject` → parse a JSON object represented as string into a JSON object 
- `castToArrayOfObject` → parse a JSON array represented as string into a JSON array

Whenever these functions do not cover a particular use case, it is possible configure additional _user-defined functions_
as custom cast functions. These cast functions can be implemented either in Kotlin or Javascript, each of them written in
their own file. When the files containing the _user-defined functions_ are loaded, the service will search within them
for a function named as the key name in the configuration. The function with such name **must** exist otherwise the service will
encounter a processing error.   

The `castFunctions` property is then configurable as follows: it should be a mapping between names of custom cast functions
and the path on the service where to find the file containing its implementation.  
Here it is shown a possible example of configuring two custom cast functions:

```json
"castFunctions": {
  "mapToAddressType": "/app/extensions/mapToAddressType.kts",
  "castToTitleCase": "/app/extensions/castToTitleCase.js"
}
```

:::note
It is important to remember to mount each custom cast function or the folder containing them within the plugin instance.
Then in the `castFunctions` property they should be properly named and set the correct location to each file containing
the function's implementation. 
:::

Considering the implementation of these cast functions, they expect as input two parameters, that are the _value_ the field
to be transformed and the _field name_ represented as `string`. The output of the cast functions should be a single value
in the type expected by the data model for that specific field on which the cast function is applied.

Below is provided an example of cast functions implementation, one for each supported programming language.

<details><summary>Custom Cast Function (Kotlin - mapToAddressType.kts)</summary>
<p>

```kotlin
package castFunctions

val addressMapping = mapOf(
  1 to "SHIPPING",
  2 to "BILLING",
  3 to "LIVING",
)

// NOTE: the name of the function must correspond to
//       the key associated to the file containing it
fun mapToAddressType(value: Any, fieldName: String): String? {
  return when (value) {
    is String -> addressMapping[value.toInt()]
    is Int, is Long -> addressMapping[value]
    else -> {
      // NOTE: a basic logger can be accesses via internal binding
      logger.debug("not an address type code: $value - fieldName: $fieldName")
      
      null
    }
  }
}
```

</p>
</details>

<details><summary>Custom Cast Function (Javascript - castToTitleCase.js)</summary>
<p>

```javascript
'use strict'

// NOTE: the name of the function must correspond to
//       the key associated to the file containing it
function castToTitleCase(value, fieldName) {
  const str = value.toString()
  
  str[0].toUpperCase() + str.slice(1).toLowerCase()
}
```

</p>
</details>

### Consumer

| Property        | Type     | Required | Default |
|-----------------|----------|----------|---------|
| `type`          | `string` | &check;  | `kafka` |
| `configuration` | `object` | &check;  |         |

Describe which type of consumer and its configuration properties the service should employ to read ingestion messages
as input events. Currently only Kafka (and platforms adopting Kafka APIs) is supported as consumer.

#### Kafka Configuration

When Kafka is selected as consumer for the Real-Time Updater service, it is possible to provide most of the Kafka Consumer
properties that are defined in the [Apache Kafka documentation](https://kafka.apache.org/documentation/#consumerconfigs).

This is an example of consumer configuration when `kafka` is selected as type: 

```json
"consumer": {
  "type": "kafka",
  "configuration": {
    "client.id": "galaxy.fast-data.DEV.inventory-realtime-updater-consumer",
    "bootstrap.servers": "localhost:9092",
    "group.id": "galaxy.fast-data.DEV.inventory-realtime-updater",
    "auto.offset.reset": "latest",
    "max.poll.records": 2000,
    "max.poll.timeout.ms": 500
  }
}
```

:::info
The consumer property `max.poll.timeout.ms` is an ad-hoc property, which does not belong to the set of Kafka Consumer properties.
In fact, it is employed by the service to set the maximum number of milliseconds the consumers waits for a poll operation
before returning any event (in case `max.poll.records` or `message.max.bytes` are not reached earlier than the configured timeout).
:::

:::note
The following Kafka Consumer properties cannot be customized by the user, since are managed by the service:
- `enable.auto.commit`
- `allow.auto.create.topics`
- `key.deserializer`
- `value.deserializer`
:::

### Producer

| Property        | Type     | Required | Default |
|-----------------|----------|----------|---------|
| `type`          | `string` | &check;  | `kafka` |
| `configuration` | `object` | &check;  |         |

Describe which type of consumer and its configuration properties the service should employ to trigger change 
as input events. Currently only Kafka (and platforms adopting Kafka APIs) is supported as consumer.

#### Kafka Configuration

When Kafka is selected as producer for the Real-Time Updater service, it is possible to provide most of the Kafka Producer
properties that are defined in the [Apache Kafka documentation](https://kafka.apache.org/documentation/#producerconfigs).

This is an example of producer configuration when `kafka` is selected as type:

```json
"producer": {
  "type": "kafka",
  "configuration": {
    "client.id": "galaxy.fast-data.DEV.inventory-realtime-updater-producer",
    "bootstrap.servers": "localhost:9092"
  }
}
```

:::note
The following Kafka Producer properties cannot be customized by the user, since are managed by the service:
- `acks`
- `enable.idempotence`
- `key.deserializer`
- `value.deserializer`
:::

### Storage

| Property        | Type     | Required | Default   |
|-----------------|----------|----------|-----------|
| `type`          | `string` | &check;  | `mongodb` |
| `configuration` | `object` | &check;  |           |

Describe which type of storage system is employed by the service for writing the projections records and
which are its configuration properties. Currently only MongoDB is supported as storage system.

#### MongoDB Configuration

When MongoDB is selected as a storage system for the Real-Time Updater service, it requires the [_connections string_](https://www.mongodb.com/docs/manual/reference/connection-string/)
and the _name_ of the database the service will connect to. The database name is not necessary in case it is already
specified in the connection string, although it would be recommended to set it in case the connection string is shared
among multiple 

This is an example of storage configuration when `mongodb` is selected as type:

```json
"storage": {
  "type": "mongodb",
  "configuration": {
    "url": "mongodb://localhost:27017/fast-data-inventory-local",
    "database": "fast-data-inventory-local"
  }
}
```

### Projections Config

This section of the configuration provides all the details related to each projection associated to an instance of the
Real-Time Updater service. The content of this property is mapping between projection names and their configuration the input and output specification together with the mapping configuration that
instructs the service on how to transform each ingestion event into a projection record and where to store it.

#### Topics

| Property    | Type     | Required | Default |
|-------------|----------|----------|---------|
| `ingestion` | `object` | &check;  |         |
| `prUpdate`  | `object` | &check;  |         |

In this section are specified for each projection their input channel (_ingestion_), from which change events on the source
system (System Of Records) will be read, and the output channel (_prUpdate_), where update notifications will be emitted
to trigger Fast Data downstream components.

##### Ingestion

```json
{
  "ingestion": {
    "name": "galaxy.fast-data.DEV.orders.ingestion"
  }
}
```

##### Projection Record Update

```json
{
  "prUpdate": {
    "name": "galaxy.fast-data.DEV.customers.pr-update"
  }
}
```

#### Custom Storage Namespace

| Property                 | Type     | Required | Default             |
|--------------------------|----------|----------|---------------------|
| `customStorageNamespace` | `string` | -        | `<projection-name>` |

Represents the name employed on the storage system for knowing where to store the records of this projection. By default,
this value corresponds to the name of the projection itself.

For example, when using MongoDB as storage system, this field allows to define a custom name for the collection where the
records of this projection will be saved.

#### Primary Keys

| Property      | Type       | Required | Default |
|---------------|------------|----------|---------|
| `primaryKeys` | `string[]` | &check;  |         |

It is the list of fields names that identifies a record for this projection. The names contained in this list are relative
to the fields of the source record contained in the ingestion event. There should always be at least one name in
this list, so that it is possible to uniquely connect records of different projections among them.

:::caution
Primary keys array **must** contain the names of the fields that are found on the ingestion event document. In case
`targetField` property is employed in the fields mapping section to rename the primary key fields that will be
stored in the projection record, then the service will properly forward the updated list when it emits the corresponding
projection-record update events.
:::

#### Fields Mapping

| Property        | Type     | Required | Default |
|-----------------|----------|----------|---------|
| `fieldsMapping` | `object` | &check;  |         |

This projection configuration property describe which fields of in the incoming record are interested. Indeed, not all
the fields of those documents coming from the System Of Records may be necessary to construct the projection. From this,
here it is applied a _"projection"_ (filter) operation on the names of the record fields.  
For each of these fields of interest of this projection it is necessary to configure the following two settings:

- `targetField` → the name for this specific field to be employed when storing the projection record on the storage system.
It can potentially be different from the original name, although by default the system tend to match the name from the
incoming document with the one saved on the projections storage system to avoid possible confusion.
- `castFunction` → the identifier of the function to be applied on the value of this field. For a reference of possible
values that this property can get, please refer to [cast functions](/fast_data/configuration/projections_storer.md#cast-functions-and-additional-cast-functions) section.

---

Considering all the settings explained above, here is displayed a configuration for a projection named
`pr_products`. It has its own ingestion and prUpdate topic, its records will be stored on the storage system
under the namespace `products` and its fields will maintain the same naming with their value transformed according to
defined cast function.

```json
"projections": {
  "pr_products": {
    "topics": {
      "ingestion": {
        "name": "galaxy.fast-data.DEV.products.ingestion"
      },
      "prUpdate": {
        "name": "galaxy.fast-data.DEV.products.pr-update"
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
```

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
    "configuration": {
      "client.id": "galaxy.fast-data.DEV.inventory-realtime-updater-consumer",
      "bootstrap.servers": "localhost:9092",
      "group.id": "galaxy.fast-data.DEV.inventory-realtime-updater",
      "auto.offset.reset": "latest",
      "max.poll.records": 2000,
      "max.poll.timeout.ms": 500,
      "sasl.jaas.config": "org.apache.kafka.common.security.scram.ScramLoginModule required username=\"<username>\" password=\"<password>\";",
      "sasl.mechanism": "SCRAM-SHA-256",
      "security.protocol": "SASL_SSL"
    }
  },
  "producer": {
    "type": "kafka",
    "configuration": {
      "client.id": "galaxy.fast-data.DEV.inventory-realtime-updater-producer",
      "bootstrap.servers": "localhost:9092",
      "sasl.jaas.config": "org.apache.kafka.common.security.scram.ScramLoginModule required username=\"<username>\" password=\"<password>\";",
      "sasl.mechanism": "SCRAM-SHA-256",
      "security.protocol": "SASL_SSL"
    }
  },
  "storage": {
    "type": "mongodb",
    "configuration": {
      "url": "mongodb://localhost:27017",
      "database": "fast-data-inventory-dev"
    }
  },
  "projections": {
    "pr_customers": {
      "topics": {
        "ingestion": {
          "name": "galaxy.fast-data.DEV.customers.ingestion"
        },
        "prUpdate": {
          "name": "galaxy.fast-data.DEV.customers.pr-update"
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
          "name": "galaxy.fast-data.DEV.orders.ingestion"
        },
        "prUpdate": {
          "name": "galaxy.fast-data.DEV.orders.pr-update"
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
          "name": "galaxy.fast-data.DEV.products.ingestion"
        },
        "prUpdate": {
          "name": "galaxy.fast-data.DEV.products.pr-update"
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
  configuration:
    "client.id": galaxy.fast-data.DEV.inventory-realtime-updater-consumer
    "bootstrap.servers": localhost:9092
    "group.id": galaxy.fast-data.DEV.inventory-realtime-updater
    "auto.offset.reset": latest
    "max.poll.records": 2000
    "max.poll.timeout.ms": 500
    "sasl.jaas.config": org.apache.kafka.common.security.scram.ScramLoginModule required username="<username>" password="<password>";
    "sasl.mechanism": SCRAM-SHA-256
    "security.protocol": SASL_SSL
producer:
  type: kafka
  configuration:
    "client.id": galaxy.fast-data.DEV.inventory-realtime-updater-producer
    "bootstrap.servers": localhost:9092
    "sasl.jaas.config": org.apache.kafka.common.security.scram.ScramLoginModule required username="<username>" password="<password>";
    "sasl.mechanism": SCRAM-SHA-256
    "security.protocol": SASL_SSL
storage:
  type: mongodb
  configuration:
    url: mongodb://localhost:27017
    database: fast-data-inventory-dev
projections:
  pr_customers:
    topics:
      ingestion:
        name: galaxy.fast-data.DEV.customers.ingestion
      prUpdate:
        name: galaxy.fast-data.DEV.customers.pr-update
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
      prUpdate:
        name: galaxy.fast-data.DEV.orders.pr-update
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
      prUpdate:
        name: galaxy.fast-data.DEV.products.pr-update
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