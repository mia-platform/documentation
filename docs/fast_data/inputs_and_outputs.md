---
id: inputs_and_outputs
title: Inputs and Outputs
sidebar_label: Inputs and Outputs
---

The fast-data has an Event Driven Architecture, as such there are many events that make everything work. In this page we will explore these events in detail to understand better the whole fast-data lifecycle.

## Projection

Here, we will discuss the inputs and outputs related to the Projection management.

### Ingestion Message

**System**: Apache Kafka

**Producer**: The CDC Connectors of the source databases

**Definition**:
The ingestion message is the message that allows us to mantain the Projections synchronized with the Source Databases since it contains the data of each record that gets inserted, updated or deleted.

When entering our systems, the message is read by the [Kafka Message Adapter](/fast_data/configuration/realtime_updater/common.md#kafka-adapters-kafka-messages-format) of the Real Time Updater, which uses it to update the Projections.

Based on how the ingestion system is set up, the format can be one of three possible types:

* [IBM InfoSphere Data Replication for DB2](#ibm-infosphere-data-replication-for-db2)
* [Oracle Golden Gate](#oracle-golden-gate)
* [Debezium](#debezium)

You can also specify a [custom adapter](/fast_data/configuration/realtime_updater/common.md#custom) to handle any other message formats you need.
This format is always configurable in the System of Records page on the console, on the _Real Time Updater_ tab.

Here's the AsyncApi specification of the message and some examples of the different formats.

#### IBM InfoSphere Data Replication for DB2

```yaml
asyncapi: 2.6.0
info:
  title: Data Change API
  version: 1.0.0
channels:
  DB2:
    publish:
      message:
        name: DB2 data change message
        payload:
          type: object
          required:
            - key
            - value
            - timestamp
            - offset
          properties:
            key:
              type: object
              additionalProperties: true
              description: Record's primary keys
            value:
              type: object
              additionalProperties: true
              oneOf:
                - type: object
                  additionalProperties: true
                  description: Whole record (including primary and foreign keys) in case of *insert/update* operation
                - type: "null"
                  description: null in case of delete operation
            timestamp:
              type: integer
              description: Kafka message Unix timestamp
            offset:
              type: integer
              description: Kafka message offset
          additionalProperties: false
```

Upsert operation:

```json
{
  "key": {
    "USER_ID": 123,
    "TAX_CODE": "ABCDEF12B02M100O"
  },
  "value": {
    "USER_ID": 123,
    "TAX_CODE": "ABCDEF12B02M100O",
    "NAME": 456
  },
  "timestamp": "1234556789",
  "offset": 100
}
```

Delete operation:

```json
{
  "key": {
    "USER_ID": 123,
    "TAX_CODE": "ABCDEF12B02M100O"
  },
  "value": null,
  "timestamp": "1234556789",
  "offset": 100
}
```

#### Oracle Golden Gate

```yaml
asyncapi: 2.6.0
info:
  title: Data Change API
  version: "1.0.0"
channels:
  GoldenGate:
    publish:
      message:
        name: Golden Gate data change message
        payload:
          type: object
          required:
            - key
            - value
            - timestamp
            - offset
          properties:
            key: 
              type: string
              description: String of the primary keys values joined by underscores
              examples:
                - pkValue1_pkValue2
            value:
              type: object
              additionalProperties: false
              required:
                - op_type
                - pos
              properties:
                op_type:
                  type: string
                  description: Operation type. Can be *insert*, *update* or *delete*
                  enum:
                    - I
                    - U
                    - D
                before:
                  type: object
                  description: Whole record **before** the changes were applied (including the primary and foreign keys). This field is not defined with insert operation
                  additionalProperties: true
                after:
                  type: object
                  description: Whole record **after** the changes were applied (including the primary and foreign keys). This field is not defined with delete operation
                  additionalProperties: true
                pos:
                  type: integer
                  description: Position of the message, similar to the kafka message's offset
            timestamp:
              type: integer
              description: Kafka message Unix timestamp
            offset:
              type: integer
              description: Kafka message offset
          additionalProperties: false
```

Insert operation:

```json
{
  "key": "123",
  "value": {
    "op_type": "I",
    "before": null,
    "after": {
      "USER_ID": 123,
      "TAX_CODE": "the-fiscal-code-123",
      "COINS": 300000000
    }
  },
  "timestamp": "1234556789",
  "offset": 100
}
```

Delete operation:

```json
{
  "key": "123",
  "value": {
    "op_type": "D",
    "before": {
      "USER_ID": 123,
      "TAX_CODE": "the-fiscal-code-123",
      "COINS": 300000000
    },
    "after": null
  },
  "timestamp": "1234556789",
  "offset": 100
}
```

#### Debezium

```yaml
asyncapi: 2.6.0
info:
  title: Data Change API
  version: 1.0.0
channels:
  Debezium:
    publish:
      message:
        name: Debezium data change message
        payload:
          type: object
          required:
            - key
            - value
            - timestamp
            - offset
          properties:
            key: 
              type: object
              description: Record's primary keys
              additionalProperties: true
            value:
              type: object
              required:
                - op
                - source
              properties:
                op:
                  type: string
                  description: Operation type. Can be *create/snapshot(r)*, *update* or *delete*
                  enum:
                    - c
                    - r
                    - u
                    - d
                before:
                  type: object
                  description: Whole record **before** the changes were applied (including the primary and foreign keys). This field is not defined with insert operation
                  additionalProperties: true
                after:
                  type: object
                  description: Whole record **after** the changes were applied (including the primary and foreign keys). This field is not defined with delete operation
                  additionalProperties: true
                source:
                  type: object
                  description: Metadata about the origin of the message (db, table, query...)
                  additionalProperties: true
              additionalProperties: false
            timestamp:
              type: string
            offset:
              type: integer
          additionalProperties: false
```

Insert operation:

```json
{
  "key": {
    "USER_ID": 123,
    "TAX_CODE": "ABCDEF12B02M100O"
  },
  "value": {
    "op": "c",
    "before": null,
    "after": {
      "USER_ID": 123,
      "TAX_CODE": "the-fiscal-code-123",
      "COINS": 300000000
    }
  },
  "timestamp": "1234556789",
  "offset": 100
}
```

Delete operation:

```json
{
  "key": {
    "USER_ID": 123,
    "TAX_CODE": "ABCDEF12B02M100O"
  },
  "value": {
    "op": "d",
    "before": {
      "USER_ID": 123,
      "TAX_CODE": "the-fiscal-code-123",
      "COINS": 300000000
    },
    "after": null
  },
  "timestamp": "1234556789",
  "offset": 100
}
```

#### Topic naming convention
`<tenant>.<environment>.<source-system>.<projection>.ingestion`

Example: `test-tenant.PROD.system-name.test-projection.ingestion`

### Projection Update Message

**System**: Apache Kafka

**Producer**: Real Time Updater

**Definition**: The Projection Update or `pr-update` message informs the listener (typically the Single View Trigger Generator) that a Projection's record has been updated, inserted or deleted.

**AsyncApi specification**:
```yaml
asyncapi: 2.6.0
info:
  title: Projection Update API
  version: 1.0.0
channels:
  pr-update:
    publish:
      message:
        name: Projection update message
        payload:
          type: object
          required:
            - key
            - value
            - timestamp
            - offset
          properties:
            key:
              type: object
              description: Record's primary keys
              additionalProperties: true
            value:
              type: object
              required:
                - operationType
                - operationTimestamp
                - documentId
                - projectionName
                - source
                - primaryKeys
              properties:
                operationType:
                  type: string
                  enum: ["INSERT", "UPDATE", "DELETE", "UPSERT"]
                  description: Type of operation applied on the Projection's record
                operationTimestamp:
                  type: integer
                  description: Unix timestamp of the time at which the MongoDB operation on the projection's record has been carried out
                documentId:
                  description: Equals to the _id of the Projection's record on MongoDB
                  type: string
                projectionName:
                  description: Projection's name
                  type: string
                source:
                  description: Name of the System of Records
                  type: string
                primaryKeys:
                  description: Array of the primary key field names
                  type: array
                after:
                  type: object
                  description: Value of the MongoDB record **after** the changes have been applied. In case of a delete operation this field is not defined
                  additionalProperties: true
                __internal__kafkaInfo:
                  type: object
                  description: Metadata about the ingestion message that triggered the whole fast-data flow
                  required:
                   - topic
                   - partition
                   - offset
                   - key
                   - timestamp
                  properties:
                    topic:
                      type: string
                      description: Ingestion topic's name
                    partition:
                      type: integer
                      description: Topic's partition
                    offset:
                      description: Message's offset
                      type: integer
                    key:
                      description: Message's key. The structure could be from any of the ingestion message key's formats
                    timestamp:
                      description: ISO 8601 date string of the kafka message timestamp
                      type: string
                  additionalProperties: false
              additionalProperties: false
            timestamp:
              type: integer
              description: Kafka message Unix timestamp
            offset:
              type: integer
              description: Kafka message offset
          additionalProperties: false
```

**Reinsertion operation example**:

```json
{
  "key": {
    "ID_USER": "ebc12dc8-939b-447e-88ef-6ef0b802a487"
  },
  "value": {
    "operationType":"INSERT",
    "operationTimestamp": "2022-05-20T10:25:56.401Z",
    "documentId": "62876cb2adb982a6195d26f9",
    "projectionName": "pr_registry",
    "source": "food-delivery",
    "primaryKeys":[
      "ID_USER"
    ],
    "after":{
      "ID_USER":"ebc12dc8-939b-447e-88ef-6ef0b802a487",
      "TAX_CODE":"tax_code",
      "NAME":"MARIO",
      "SURNAME":"ROSSI",
      "EMAIL":"email_mario",
      "ADDRESS":"address_1",
      "PHONE":"phone_number_1653042354472_last",
      "PROFESSION":"profession 1",
      "timestamp":"2022-05-20T10:25:56.323Z",
      "updatedAt":"2022-05-20T10:25:56.380Z",
      "__STATE__":"PUBLIC",
      "__internal__counter":467,
      "__internal__kafkaInfo":{
        "offset":"467",
        "partition":0,
        "timestamp":"2022-05-20T10:25:56.323Z",
        "topic":"kafka-topic-here",
        "key":{
          "ID_USER":"ebc12dc8-939b-447e-88ef-6ef0b802a487"
        }
      },
      "createdAt":"2022-05-20T10:25:56.380Z"
    },
    "__internal__kafkaInfo": {
      "offset": 467,
      "partition":0,
      "timestamp":"2022-05-20T10:25:56.323Z",
      "topic":"kafka-topic-here",
      "key":{
        "ID_USER":"ebc12dc8-939b-447e-88ef-6ef0b802a487"
      }
    }
  }
}
```

#### Topic naming convention
`<tenant>.<environment>.<mongo-database>.<collection>.pr-update`

Example: `test-tenant.PROD.restaurants-db.reviews-collection.pr-update`

## Single View

This section covers the inputs and outputs concerning the Single View's aggregation.

### Projection Changes

**System**: MongoDB

<!-- TODO: Add the SVTG when ready -->
**Producer**: Real Time Updater

**Definition**: The Projection Changes or `pc` informs the listener (generally the Single View Creator) that a Single View should be updated.
This event is created as a result of a strategy execution.
It is stored on MongoDB and is very similar to the [Single View Trigger Message](#single-view-trigger-message) on Kafka.

**JsonSchema specification**:
```json
{
  "type": "object",
  "required": [
    "identifier",
    "changes",
    "createdAt"
  ],
  "properties": {
    "type": {
      "type": "string",
      "description": "Identifier of for the Single View Creator service that should take care of the changes"
    },
    "identifier": {
      "type": "object",
      "description": "Identifier of the Projection Changes that should match with the Single View Keys fields or the identifierQueryMapping ones from the aggregation.json",
      "additionalProperties": true
    },
    "changes": {
      "type": "array",
      "description": "Array that keeps track of the changes requested for the Single View related to the identifier",
      "items": {
        "type": "object",
        "required": [
          "state"
        ],
        "properties": {
          "state": {
            "type": "string",
            "enum": [
              "NEW",
              "IN_PROGRESS"
            ],
            "description": "State of the change. State NEW means that the single view needs to be re-aggregated, state IN_PROGRESS means that the Single View Creator is already doing it."
          },
          "topic": {
            "type": "string",
            "description": "Ingestion topic that started the cycle"
          },
          "timestamp": {
            "type": "integer",
            "description": "Unix timestamp of the ingestion kafka message"
          },
          "partition": {
            "type": "integer",
            "description": "Partition number of the ingestion kafka message"
          },
          "offset": {
            "type": "integer",
            "description": "Offset of the ingestion kafka message"
          },
          "key": {
            "type": "object",
            "additionalProperties": true,
            "description": "Key of the ingestion kafka message"
          },
          "updatedAt": {
            "type": "object",
            "description": "MongoDB date object of the time the change has been updated",
            "additionalProperties": true
          },
          "inProgressAt": {
            "type": "object",
            "description": "MongoDB date object of the time the Single View Creator has started processing the change",
            "additionalProperties": true
          }
        },
        "additionalProperties": true
      }
    },
    "createdAt": {
      "type": "object",
      "description": "MongoDB date object of the time the record has been created",
      "additionalProperties": true
    },
    "updatedAt": {
      "type": "object",
      "description": "MongoDB date object of the time the record has been updates, most of the times it means the moment when a change has been registered.",
      "additionalProperties": true
    },
    "doneAt": {
      "type": "object",
      "description": "MongoDB date object of the time that the last change was processed by the Single View Creator",
      "additionalProperties": true
    }
  }
}
```

**Record example**:

```json
{
  "_id": "627935df1810010012b0a328",
  "identifier": {
    "ID_USER": "ebc12dc8-939b-447e-88ef-6ef0b802a487"
  },
  "type": "sv_customers",
  "changes": [
    {
      "state": "NEW",
      "topic": "original-topic-2",
      "timestamp": 1234567,
      "partition": 0,
      "offset": 2,
      "key": {
        "originalKey2": "123",
      }
    }
  ],
  "createdAt": "2022-05-20T10:25:35.656Z",
  "updatedAt": "2022-05-20T10:25:35.656Z",
  "doneAt": "2022-05-20T10:25:35.656Z"
}
```

### Single View Trigger Message

**System**: Apache Kafka

**Producer**: Single View Trigger Generator

**Definition**: The Single View Trigger Message or `sv-trigger` informs the listener that a Single View must be regenerated. This event is also created as a result of a strategy execution so you should configure your fast-data system to generate either Single View Trigger Messages or [Projection Changes](#projection-changes).

**AsyncApi specification**:
```yaml
asyncapi: 2.6.0
info:
  title: Single View Trigger API
  version: 1.0.0
channels:
  sv-trigger:
    subscribe:
      message:
        name: Single View Trigger message
        payload:
          type: object
          required:
            - key
            - value
            - timestamp
            - offset
          properties:
            key:
              type: object
              description: Identifier of the Single View or the Projection (depending on the value.type)
              additionalProperties: true
            value:
              type: object
              required:
                - type
                - __internal__kafkaInfo
                - change
              properties:
                type:
                  type: string
                  description: Type of change requested. Aggregation means the Single View must be regenerated, patch means an update must be done among all Single Views matching a certain query
                  enum:
                    - aggregation
                    - patch
                singleViewIdentifier:
                  type: object
                  description: Identifier of the Single View just like the Projection Changes Identifier. Mind that this field will be set only in case of type aggregation and not patch
                  additionalProperties: true
                change:
                  type: object
                  description: Contains information about the projection record that triggered the strategy
                  additionalProperties: false
                  properties:
                    projectionName:
                      description: Name of the projection
                      type: string
                    projectionIdentifier:
                      type: object
                      description: Primary keys of the projection record
                      additionalProperties: true
                    data:
                      type: object
                      description: Data of the projection record after the changes were applied
                      additionalProperties: true
                __internal__kafkaInfo:
                  type: object
                  description: Metadata about the ingestion message that triggered the whole fast-data flow
                  required:
                    - topic
                    - partition
                    - offset
                    - key
                    - timestamp
                  properties:
                    topic:
                      type: string
                      description: Ingestion topic's name
                    partition:
                      type: integer
                      description: Topic's partition
                    offset:
                      description: Message's offset
                      type: integer
                    key:
                      description: Message's key. The structure could be from any of the ingestion message key's formats
                    timestamp:
                      description: ISO 8601 date string of the ingestion Message
                      type: string
                  additionalProperties: false
            timestamp:
              type: integer
              description: Kafka message Unix timestamp
            offset:
              type: integer
              description: Kafka message offset
          additionalProperties: false
```

**Example**:
```json
{
  "key": {
    "bookId": "29EMA5BtaKhM6fipPIRDJWec"
  },
  "value": {
    "type": "aggregation",
    "singleViewIdentifier": {
      "bookId": "29EMA5BtaKhM6fipPIRDJWec"
    },
    "change": {
      "data": {
        "__STATE__": "PUBLIC",
        "__internal__counter": 1685118744745,
        "__internal__counterType": "timestamp",
        "__internal__kafkaInfo": {
          "key": {
            "authorId": "7P3P9Pag59nxpOhfNMIweE0H"
          },
          "offset": "151",
          "partition": 0,
          "timestamp": "2023-05-26T16:32:24.745Z",
          "topic": "some.ingestion.topic"
        },
        "authorId": "7P3P9Pag59nxpOhfNMIweE0H",
        "bio": "episode lover, designer",
        "name": "Caitlyn",
        "surname": "Hettinger",
        "timestamp": "2023-05-26T16:32:24.745Z",
        "updatedAt": "2023-05-26T16:32:24.845Z"
      },
      "projectionIdentifier": {
        "authorId": "7P3P9Pag59nxpOhfNMIweE0H"
      },
      "projectionName": "authors"
    },
    "__internal__kafkaInfo": {
      "key": {
        "authorId": "7P3P9Pag59nxpOhfNMIweE0H"
      },
      "offset": "151",
      "partition": 0,
      "timestamp": "2023-05-26T16:32:24.745Z",
      "topic": "some.ingestion.topic"
    }
  }
}
```

#### Topic naming convention
`<tenant>.<environment>.<mongo-database>.<single-view-name>.sv-trigger`

Example: `test-tenant.PROD.restaurants-db.reviews-sv.sv-trigger`

### Single View Update Message

**System**: Apache Kafka

**Producer**: Single View Creator

**Definition**: The Single View Update or `sv-update` informs the listener that a specific Single View record has been updated. This is used generally for statistical purposes, like knowing how many Single Views per minute our system can process, but it can also be used to keep a history of the changes since it can contain (although disabled by the default) the before and after values of the Single View record.

**AsyncApi specification**:
```yaml
asyncapi: 2.6.0
info:
  title: Single View Update API
  version: 1.0.0
channels:
  sv-update:
    subscribe:
      message:
        name: Single View Update message
        payload:
          type: object
          required:
            - key
            - value
            - timestamp
            - offset
          properties:
            key:
              type: object
              description: Primary keys of the updated Single View
              additionalProperties: true
            value:
              type: object
              required:
                - operationType
                - operationTimestamp
                - singleViewName
                - source
                - __internal__kafkaInfo
              properties:
                operationType:
                  type: string
                  description: Type of operation applied to the Single View record
                  enum:
                    - INSERT
                    - UPDATE
                    - DELETE
                operationTimestamp:
                  type: string
                  description: ISO 8601 date string of the ingestion Message
                documentId:
                  type: string
                  description: MongoDB _id of the Single View document
                singleViewName:
                  type: string
                  description: Single View name of the record
                source:
                  type: string
                  description: Equivalent to the SINGLE_VIEWS_PORTFOLIO_ORIGIN env var of the Single View Creator that took care of the Single View aggregation
                before:
                  type: object
                  description: Value of the Single View record **before** it was updated/deleted. In case of an insert the field won't be defined. Mind that both before and after values won't be defined by default so you need to configure the Single View Creator if you wish to include them
                  additionalProperties: true
                after:
                  type: object
                  description: Value of the Single View record **after** it was updated/inserted. In case of a delete the field won't be defined. Mind that both before and after values won't be defined by default so you need to configure the Single View Creator if you wish to include them
                  additionalProperties: true
                __internal__kafkaInfo:
                  type: object
                  description: Metadata about the ingestion message that triggered the whole fast-data flow
                  required:
                    - topic
                    - partition
                    - offset
                    - key
                    - timestamp
                  properties:
                    topic:
                      type: string
                      description: Ingestion topic's name
                    partition:
                      type: integer
                      description: Topic's partition
                    offset:
                      description: Message's offset
                      type: integer
                    key:
                      description: Message's key. The structure could be from any of the ingestion message key's formats
                    timestamp:
                      description: ISO 8601 date string of the ingestion Message
                      type: string
                  additionalProperties: false
              additionalProperties: false  
            timestamp:
              type: integer
              description: Kafka message Unix timestamp
            offset:
              type: integer
              description: Kafka message offset        
          additionalProperties: false
```

**Example**:
```json
{
  "key": {
    "bookId": "9GQ4btTZk9L3bOKybn973Ph2"
  },
  "value": {
    "__internal__kafkaInfo": {
      "key": {
        "libraryId": "roG7Hrmobde8PImFo3KCIRBp"
      },
      "offset": 123,
      "partition": 0,
      "timestamp": "2023-06-01T10:05:51.442Z",
      "topic": "gt.fd-tests.DEV.libraries.ingestion"
    },
    "operationTimestamp": "2023-06-01T10:05:51.442Z",
    "operationType": "UPDATE",
    "singleViewName": "sv_books",
    "source": "library"
  }
}
```

#### Topic naming convention
`<tenant>.<environment>.<mongo-database>.<single-view-name>.sv-update`

Example: `test-tenant.PROD.restaurants-db.reviews-sv.sv-update`

### Single View Error

A Single View Error is an error event that warns us that something went wrong with the Single View update, and a Single View has not been changed.
It is stored on MongoDB.

Its fields are the default CRUD fields, and:

* `portfolioOrigin`: information on which Single View Creator "group" generated the error. Each Single View Creator service has an environment variable in which this value is specified.
* `type`: the name of the Single View that needed to be generated when the error occurred.
* `identifier`: the ID of the Single View
* `errorType`: the type of error. Can be one of:
  * `NO_SV_GENERATED`: if the Single View was not generated
  * `VALIDATION_ERROR`: if the Single View that was generated does not conform to the declared fields
  * `MORE_SVS_GENERATED_FROM_ONE_PROJECTION_CHANGE`: if the Projection Change caused more than one Single View to be generated
  * `ERROR_SEND_SVC_EVENT` if the Single View was correctly generated, but the creation event could not be generated

**MongoDB Record Example**:

```json
{
  "_id": {
    "$oid": "619790cbc17eea00122a0796"
  },
  "portfolioOrigin": "users",
  "type": "sv_customers",
  "identifier": {
    "ID_USER": "ebc12dc8-939b-447e-88ef-6ef0b802a487"
  },
  "errorType": "NO_SV_GENERATED",
  "createdAt": {
    "$date": "2021-11-19T11:55:55.337Z"
  },
  "creatorId": "single-view-creator",
  "__STATE__": "PUBLIC",
  "updaterId": "single-view-creator",
  "updatedAt": {
    "$date": "2021-11-19T11:55:55.337Z"
  }
}
```

### Others

#### Single View Events Message

A Single View Events or `svc-events` is a Kafka message that informs the listener that a single view has been successfully updated.

Its fields are:

* `key`: the Single View ID
* `headers`:
  * `type`: always set to `event`. New values might be added in the future.
  * `name`: the type of operation that was successful. Can be one of:
    * `singleViewCreated`
    * `singleViewUpdated`
    * `singleViewDeleted`
* `value`:
  * `type`: the name of the Single View collection
  * `portfolioOrigin`: the portfolio the Single View was originated from

**Message Example**:

```yaml
key: | 
  {
    "idCustomer": "ebc12dc8-939b-447e-88ef-6ef0b802a487"
  }
value: |
  {
    "type": "sv_customers",
    "portfolioOrigin": "food-delivery",
    "__internal__kafkaInfo":
      {
        "topic": "kafka-topic-here",
        "partition": 0,
        "key": "Amatriciana_id",
        "offset": "466",
        "timestamp": "1653039238727",
      },
  }
```

**AsyncApi specification**:

```yaml
asyncapi: 2.4.0
info:
  title: Single View Event Producer
  version: "1.0.0"
channels:
  SingleViewUpdatesChannel:
    subscribe:
      message:
        name: single view event
        payload:
          type: object
          additionalProperties: false
          properties:
            key: {}
            headers:
              type: object
              additionalProperties: false
              properties:
                type:
                  type: string
                  enum: ["event"]
                name:
                  type: string
                  enum:
                    [
                      "singleViewCreated",
                      "singleViewUpdated",
                      "singleViewDeleted",
                    ]
            value:
              type: object
              additionalProperties: false
              properties:
                type:
                  type: string
                portfolioOrigin:
                  type: string
                __internal__kafkaInfo:
                  type: object
                  additionalProperties: false
                  properties:
                    topic:
                      type: string
                    partition:
                      type: integer
                    offset:
                      type: string
                    key: {}
                    timestamp:
                      type: string
          required: ["key", "headers", "value"]
```

#### Single View Before After Message

:::note
This event is deprecated. Please, use the Single View Update event to get these information.
:::

The Single View Before After Message is an additional event used for debugging purposes, which contains both the previous and the current state of the Single View once it has been updated.

Its fields are:

* `key`: the Single View ID
* `value`:
  * `key`: the Single View ID
  * `before`: the value of the Single View before the change occurred
  * `after`: the value of the Single View after the change occurred (which is the state at the time the message is sent)
  * `type`: the name of the Single View collection
  * `__internal__kafkaInfo`: the Kafka information of the initial Data Change message that caused the Projection to update
  * `opType`: one of the following
    * `NON_EXISTING_SV`
    * `INSERT_SV`
    * `DELETE_SV`
    * `UPDATE_SV`

**Message Example**:

<details><summary>Click here to show/hide the long message example</summary>
<p>

```yaml
key: | 
  { 
    "idCustomer": "ebc12dc8-939b-447e-88ef-6ef0b802a487"
  }
value: | 
  {
    "key": {
      "idCustomer": "ebc12dc8-939b-447e-88ef-6ef0b802a487"
    },
    "before": {
      "_id": "6287a74d2931f4cc7356e505",
      "idCustomer": "ebc12dc8-939b-447e-88ef-6ef0b802a487",
      "taxCode": "tax_code",
      "name": "MARIO",
      "surname": "ROSSI",
      "email": "email_mario",
      "address": "address_1",
      "telephone": "phone_number_1653057355131_last",
      "orders": [
        {
          "id": "d2829a1d-80ca-4eff-a93a-e97c83a5550f",
          "orderDate": "2007-12-03T02:55:44.000Z",
          "totalPrice": "52.54",
          "paymentType": "Cash",
          "orderStatus": "In shipping",
          "dishes": [
            {
              "id": "Cotoletta_id",
              "description": "a splendid dish",
              "price": "12"
            }
          ]
        }
      ],
      "allergens": [
        {
          "id": "eggs",
          "comments": "this is another comment change",
          "description": "it works!"
        }
      ],
      "foodPreferences": [
        {
          "id": "preference_1",
          "comments": "this is a comment",
          "description": "this is the preference_1"
        },
        {
          "id": "preference_2",
          "comments": "i really love this",
          "description": "this is the preference_2"
        }
      ],
      "reviews": [
        {
          "id": "review_1",
          "text": "Spectacular!",
          "stars": "5"
        },
        {
          "id": "review_2",
          "text": "Tasteless!",
          "stars": "1"
        }
      ],
      "updatedAt": "2022-05-20T14:35:58.943Z",
      "__STATE__": "PUBLIC",
      "__internal__kafkaInfo": {
        "topic": "kafka-topic-here",
        "partition": 0,
        "key": "Amatriciana_id",
        "offset": "475",
        "timestamp": "1653057358783"
      }
    },
    "after": {
      "idCustomer": "ebc12dc8-939b-447e-88ef-6ef0b802a487",
      "taxCode": "tax_code",
      "name": "MARIO",
      "surname": "ROSSI",
      "email": "email_mario",
      "address": "address_1",
      "telephone": "phone_number_1653057355131_last",
      "orders": [
        {
          "id": "d2829a1d-80ca-4eff-a93a-e97c83a5550f",
          "orderDate": "2007-12-03T02:55:44.000Z",
          "totalPrice": "52.54",
          "paymentType": "Cash",
          "orderStatus": "In shipping",
          "dishes": [
            {
              "id": "Amatriciana_id",
              "description": "a delicious dish",
              "price": "12"
            },
            {
              "id": "Cotoletta_id",
              "description": "a splendid dish",
              "price": "12"
            }
          ]
        }
      ],
      "allergens": [
        {
          "id": "eggs",
          "comments": "this is another comment change",
          "description": "it works!"
        }
      ],
      "foodPreferences": [
        {
          "id": "preference_1",
          "comments": "this is a comment",
          "description": "this is the preference_1"
        },
        {
          "id": "preference_2",
          "comments": "i really love this",
          "description": "this is the preference_2"
        }
      ],
      "reviews": [
        {
          "id": "review_1",
          "text": "Spectacular!",
          "stars": "5"
        },
        {
          "id": "review_2",
          "text": "Tasteless!",
          "stars": "1"
        }
      ],
      "updatedAt": "2022-05-20T14:35:59.488Z",
      "__STATE__": "PUBLIC",
      "__internal__kafkaInfo": {
        "topic": "kafka-topic-here",
        "partition": 0,
        "key": "Amatriciana_id",
        "offset": "476",
        "timestamp": "1653057359355"
      }
    },
    "type": "sv_customers",
    "__internal__kafkaInfo": {
      "topic": "kafka-topic-here",
      "partition": 0,
      "key": "Amatriciana_id",
      "offset": "476",
      "timestamp": "1653057359355"
    },
    "opType": "UPDATE_SV"
  }
```

</p>
</details>

**AsyncApi specification**:

```yaml
asyncapi: 2.4.0
info:
  title: Single View Before After Producer
  version: "1.0.0"
channels:
  SingleViewBeforeAfterChannel:
    subscribe:
      message:
        name: single view before after
        payload:
          type: object
          additionalProperties: false
          properties:
            key: {}
            value:
              type: object
              additionalProperties: false
              properties:
                key: {}
                type:
                  type: string
                before:
                  type: object
                  additionalProperties: true
                after:
                  type: object
                  additionalProperties: true
                __internal__kafkaInfo:
                  type: object
                  additionalProperties: false
                  properties:
                    topic:
                      type: string
                    partition:
                      type: integer
                    offset:
                      type: string
                    key: {}
                    timestamp:
                      type: string
            opType:
              type: string
              enum: ["NON_EXISTING_SV", "INSERT_SV", "DELETE_SV", "UPDATE_SV"]
          required: ["key", "value", "opType"]
```
