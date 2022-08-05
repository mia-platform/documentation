---
id: inputs_and_outputs
title: Inputs and Outputs
sidebar_label: Inputs and Outputs
---

<head>
   <meta name="robots" content="noindex, nofollow" />
</head>

This page presents all the different inputs and outputs that revolve around the Fast Data ecosystem, including both the core user data in Projections and Single Views, and the events concerning errors, successful data generation, and so on.

Throughout the document we will describe the messages providing a natural language description, an **example**, and for Kafka messages an [AsyncApi](https://www.asyncapi.com/) specification.

In order to work properly, the Fast Data infrastructure will need multiple Kafka topics, hence any time we will discuss a Kafka Topic, a naming convention will be suggested.

For MongoDB based architectures, please check the Mongo paragraph on the entries, while for Kafka based ones, check the message structure and the topic naming convention.

## Data Ingestion

Here, we will discuss the inputs and outputs related to data ingestion.

### Data Change Message

This is a kind of Kafka message that is going to be sent when a System of Record is updated.
This message is then read by the Real Time Updater, which uses it to update the Projections.

Based on how the syncing system is set up, the format can be one of three possible types:

* Basic
* Golden Gate
* Custom

#### Basic

This is the default format, that only has 2 different operation types: Upsert and Delete. The message format consists of four fields:

* `key`: the identifier (primary key) of the projection that has been updated
* `value`: if the message is a **delete** operation, it is **null**; if it is an insert or update operation, the value is a JSON containing the object with all its new fields.
* `timestamp`: the timestamp of the Kafka message, it has to be a stringified integer greater than zero.
* `offset`: the Kafka offset

**Message Example**:

Upsert operation:

```yaml
key: `{"USER_ID": 123, "FISCAL_CODE": "ABCDEF12B02M100O"}`
value: `{"NAME": 456}`
timestamp: '1234556789'
offset: '100'
```

Delete operation:

```yaml
key: `{"USER_ID": 123, "FISCAL_CODE": "ABCDEF12B02M100O"}`
value: null
timestamp: '1234556789'
offset: '100'
```

**AsyncApi specification**:

```yaml
asyncapi: 2.4.0
info:
  title: Basic Data Change Producer
  version: "1.0.0"
channels:
  BasicDataChangeChannel:
    publish:
      message:
        name: basic data change
        payload:
          type: object
          additionalProperties: false
          properties:
            key: {}
            value:
              type: object
              additionalProperties: true
            timestamp:
              type: string
            offset:
              type: integer
          required: ["key", "value", "timestamp", offset]
```

#### Golden Gate

This format has 3 possible operation types: Insert, Update, Delete. On top of that, it can provide information about the previous state of the data. Its fields are:

* `key`: the identifier (primary key) of the projection that has been updated
* `value`: it is an object representing the change that happened, containing the following fields:
  * `op_type`: the type of operation (`I` for insert, `U` for update, `D` for delete).
  * `before`: the data values before the operation execution (null or not set if it is an insert operation)
  * `after`:the data values after the operation execution (null or not set if it is a delete operation)
* `timestamp`: the timestamp of the Kafka message, it has to be a stringified integer greater than zero.
* `offset`: the Kafka offset

**Message Example**:

```yaml
key: `{"USER_ID": 123, "FISCAL_CODE": "ABCDEF12B02M100O"}`
value: `{
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
}`
timestamp: '1234556789'
offset: '100'
```

**AsyncApi specification**:

```yaml
asyncapi: 2.4.0
info:
  title: Golden Gate Data Change Producer
  version: "1.0.0"
channels:
  GoldenGateDataChangeChannel:
    publish:
      message:
        name: golden gate data change
        payload:
          type: object
          additionalProperties: false
          properties:
            key: {}
            value:
              type: object
              additionalProperties: false
              properties:
                op_type:
                  type: string
                  enum: ["I", "D", "U"]
                before:
                  type: object
                  additionalProperties: true
                after:
                  type: object
                  additionalProperties: true
            timestamp:
              type: string
            offset:
              type: integer
          required: ["key", "value", "timestamp", offset]
```

#### Custom

If none of the above formats applies for your use case, you can use your custom format and specify custom adapter that will make the message ready to be processed by the Real Time Updater service.

#### Topic naming convention

**producer**: the system producing its own events

`<tenant>.<environment>.<source-system>.<projection>.ingestion`

An example:

```sh
test-tenant.PROD.system-name.test-projection.ingestion
```

### Projection

A Projection is an updated and **standardized** copy of the data coming from the System of Records.
Projections are always stored on MongoDB.
The fields of each Projection document are the ones defined in the Console. On top of user-defined properties, you will also find the default CRUD fields: `_id`, `creatorId`, `createdAt`, `updaterId`, `updatedAt`, `__STATE__`.

### Projection Update

A `Projection Update` is a Kafka event that informs the listener that a Projection has been changed.
Its value field contains the following fields:

| Field                   | Required | Description                                                                                                                                             |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `__internal__kafkaInfo` | Yes      | The Kafka information of the initial Data Change message that caused the Projection to update. Its fields are: topic, partition, offset, key, timestamp |
| `before`                | No       | It contains the value of the Projection before its change.                                                                                              |
| `after`                 | No       | It contains the value of the Projection after the operation execution.                                                                                  |
| `key`                   | Yes      | The key of the Projection that has been updated.                                                                                                        |

**Message Example**:

<details><summary>Click here to show/hide the long message example</summary>
<p>

```yaml
key: '{"ID_USER":"ebc12dc8-939b-447e-88ef-6ef0b802a487"}'
value: {
  "operationType":"INSERT",
  "operationTimestamp": "2022-05-20T10:25:56.401Z",
  "documentId": null,
  "projectionName": "pr_registry",
  "source": "food-delivery",
  "primaryKeys":[
    "$or"
  ],
  "before":{
    "_id":"62876cb2adb982a6195d26f9",
    "ID_USER":"ebc12dc8-939b-447e-88ef-6ef0b802a487",
    "TAX_CODE":"tax_code",
    "NAME":"MARIO",
    "SURNAME":"ROSSI",
    "EMAIL":"email_mario",
    "ADDRESS":"address_1",
    "PHONE":"phone_number_1653042354472",
    "PROFESSION":"profession 1",
    "__STATE__":"DELETED",
    "__internal__counter":466,
    "__internal__kafkaInfo":{
      "offset":"466",
      "partition":0,
      "timestamp":"2022-05-20T10:25:55.751Z",
      "topic":"kafka-topic-here",
      "key":{
        "ID_USER":"ebc12dc8-939b-447e-88ef-6ef0b802a487"
      }
    },
    "timestamp":"2022-05-20T10:25:55.751Z",
    "updatedAt":"2022-05-20T10:25:55.760Z"
   },
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
  }
  "__internal__kafkaInfo":{
    "offset":"467",
    "partition":0,
    "timestamp":"2022-05-20T10:25:56.323Z",
    "topic":"kafka-topic-here",
    "key":{
      "ID_USER":"ebc12dc8-939b-447e-88ef-6ef0b802a487"
    }
  },
}
```

</p>
</details>

**AsyncApi specification**:

```yaml
asyncapi: 2.4.0
info:
  title: Projection Update Producer
  version: "1.0.0"
channels:
  projectionUpdateChannel:
    subscribe:
      message:
        name: Projection Update
        payload:
          type: object
          additionalProperties: false
          properties:
            key:
              type: object
            value:
              type: object
              additionalProperties: false
              properties:
                operationType:
                  type: string
                  enum: ["INSERT", "UPDATE", "DELETE", "UPSERT"]
                operationTimestamp:
                  type: number
                documentId:
                  type: string
                projectionName:
                  type: string
                primaryKeys:
                  type: Array
                source:
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
          required: ["key", "value"]
```

#### Topic naming convention

**producer** Real Time Updater

`<tenant>.<environment>.<mongo-database>.<collection>.pr-update`

An example:

```sh
test-tenant.PROD.restaurants-db.reviews-collection.pr-update
```

### Projection Change

A `Projection Change` is an event that informs the listener that a Single View should be updated.
It can be stored on either MongoDB or Kafka, depending on your architecture.

Its value has the following fields:

* `type`: either `aggregation` or `patch`. The former triggers a specific Single View to be generated from scratch, the latter is used to only update one field of all Single View documents.
* `singleViewIdentifier`: only present if type is `aggregation`. It is the ID of the Single View to update.
* `change`: all the information needed to start the update process:
  * `projection`: the name of the Projection that generated the change
  * `data`: the content of the Projection document that generated the name
* `__internal__kafkaInfo`: the Kafka information of the initial Data Change message that caused the Projection to update. Its fields are:
  * topic
  * partition
  * offset
  * key
  * timestamp

**Kafka Message Example**:

```yaml
key: '{"ID_USER":"ebc12dc8-939b-447e-88ef-6ef0b802a487"}'
value: '{
  "type":"aggregation",
  "singleViewIdentifier":{
    "ID_USER":"ebc12dc8-939b-447e-88ef-6ef0b802a487"
  },
  "change":{
    "projection":"pr_registry",
    "data":{
        "ID_USER":"ebc12dc8-939b-447e-88ef-6ef0b802a487",
        "TAX_CODE":"tax_code",
        "NAME":"MARIO",
        "SURNAME":"ROSSI",
        "EMAIL":"email_mario",
        "ADDRESS":"address_1",
        "PHONE":"phone_number_1653041524454",
        "PROFESSION":"profession 1",
        "timestamp":"2022-05-20T10:12:06.019Z",
        "updatedAt":"2022-05-20T10:12:06.027Z",
        "__STATE__":"PUBLIC",
        "__internal__counter":463,
        "__internal__kafkaInfo":{
          "offset":"463",
          "partition":0,
          "timestamp":"2022-05-20T10:12:06.019Z",
          "topic":"kafka-topic-here",
          "key":{
              "ID_USER":"ebc12dc8-939b-447e-88ef-6ef0b802a487"
          }
        }
    }
  },
  "__internal__kafkaInfo":{
    "offset":"463",
    "partition":0,
    "timestamp":"2022-05-20T10:12:06.019Z",
    "topic":"kafka-topic-here",
    "key":{
        "ID_USER":"ebc12dc8-939b-447e-88ef-6ef0b802a487"
    }
  }
}'
```

**MongoDB Record Example**:

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
      "updatedAt": "2022-05-20T10:25:35.567Z",
      "offset": "402",
      "partition": 0,
      "timestamp": "2022-04-28T12:22:12.994Z",
      "topic": "kafka-topic-here",
      "key": {
        "ID_USER": "ebc12dc8-939b-447e-88ef-6ef0b802a487"
      }
    }
  ],
  "doneAt": "2022-05-20T10:25:35.656Z"
}
```

**AsyncApi specification**:

```yaml
asyncapi: 2.4.0
info:
  title: Projection Change Producer
  version: "1.0.0"
channels:
  projectionChangesChannel:
    subscribe:
      message:
        name: projection change
        payload:
          type: object
          additionalProperties: false
          properties:
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
            type:
              type: string
              enum: ["aggregation", "patch"]
            singleViewIdentifier: {}
            change:
              type: object
              additionalProperties: false
              properties:
                projection:
                  type: string
                data:
                  type: object
                  additionalProperties: true
          required: ["type", "__internal__kafkaInfo", "change"]
          if:
            properties:
              type:
                const: "aggregation"
          then:
            required: ["singleViewIdentifier"]
```

#### Topic naming convention

**producer**: Single View Trigger

`<tenant>.<environment>.<mongo-database>.<single-view-name>.sv-trigger`

An example:

```sh
test-tenant.PROD.restaurants-db.reviews-sv.sv-trigger
```

## Aggregation

This section covers the outputs concerning the aggregation.

### Single View

A Single View is an aggregated MongoDB Collection that keeps all the data necessary for your business in a ready-to-use format. On top of user-defined properties, you will also find the default CRUD fields: `_id`, `creatorId`, `createdAt`, `updaterId`, `updatedAt`, `__STATE__`.

### Single View Error

A `Single View Error` is an error message that warns us that something went wrong with the Single View update, and a Single View has not been changed.
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
  "_id": { "$oid": "619790cbc17eea00122a0796" },
  "portfolioOrigin": "users",
  "type": "sv_customers",
  "identifier": {
    "ID_USER": "ebc12dc8-939b-447e-88ef-6ef0b802a487"
  },
  "errorType": "NO_SV_GENERATED",
  "createdAt": { "$date": "2021-11-19T11:55:55.337Z" },
  "creatorId": "single-view-creator",
  "__STATE__": "PUBLIC",
  "updaterId": "single-view-creator",
  "updatedAt": { "$date": "2021-11-19T11:55:55.337Z" }
}
```

### Single View Event

A `Single View Event` event is a Kafka message that informs the listener that a single view has been successfully updated.

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
key: { "idCustomer": "ebc12dc8-939b-447e-88ef-6ef0b802a487" }
value:
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

### Single View Before After

:::note
This event is deprecated. Please, use the Single View Update event to get these information.
:::

An additional event used for debugging purposes, which contains both the previous and the current state of the Single View once it has been updated.

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
key: `{ "idCustomer": "ebc12dc8-939b-447e-88ef-6ef0b802a487" }`
value: `{
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
}`
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

### Single View Update

An event which contains both the previous and the current state of the Single View once it has been updated.

Its fields are:

* `key`: the Single View ID
* `value`:
  * `operationType`: one of
    * `INSERT`
    * `UPDATE`
    * `DELETE`
  * `operationTimestamp`: timestamp of the operation
  * `documentId`: id of the document taken from after
  * `singleViewName`: name of the Single View
  * `source`: the portfolio the Single View was originated from
  * `before`: the value of the Single View before the change occurred
  * `after`: the value of the Single View after the change occurred (which is the state at the time the message is sent)
  * `__internal__kafkaInfo`: the Kafka information of the initial Data Change message that caused the Projection to update

**Message Example**:

<details><summary>Click here to show/hide the long message example</summary>
<p>

```yaml
key: { "idCustomer": "ebc12dc8-939b-447e-88ef-6ef0b802a487" }
value:
  {
    "operationType": "UPDATE",
    "operationTimestamp": 1234567,
    "documentId": null,
    "singleViewName": "sv_customers",
    "source": "food-delivery",
    "before": { "COD_FISCALE": "cod1", "NAME": "Gandalf" },
    "after": { "COD_FISCALE": "cod1", "NAME": "Mithrandir" },
    "__internal__kafkaInfo":
      {
        "topic": "original-topic-1",
        "partition": 0,
        "timestamp": 1234567,
        "offset": 0,
        "key": { "originalKey1": "123" },
      },
  }
```

</p>
</details>

**AsyncApi specification**:

```yaml
asyncapi: 2.4.0
info:
  title: Single View Update Producer
  version: "1.0.0"
channels:
  SingleViewUpdateChannel:
    subscribe:
      message:
        name: single view Update
        payload:
          type: object
          additionalProperties: false
          properties:
            key:
              type: object
            value:
              type: object
              additionalProperties: false
              properties:
                operationType:
                  type: string
                  enum: ["INSERT", "UPDATE", "DELETE"]
                operationTimestamp:
                  type: number
                documentId:
                  type: string
                singleViewName:
                  type: string
                source:
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
          required: ["key", "value"]
```

#### Topic naming convention

**producer**: Single View Creator

`<tenant>.<environment>.<mongo-database>.<single-view-name>.sv-update`

An example:

```sh
test-tenant.PROD.restaurants-db.reviews-sv.sv-update
```
