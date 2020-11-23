---
id: configure_real_time_updater
title: Real-Time Updater
sidebar_label: Configure Real-Time Updater
---
## Purpose of a Real-Time Updater

The component Real-Time Updater is in charge of keeping the projections tables up to date with the technical source. Single views creation and update are based on projections aggregation, for this reason we need to always have the most updated data in our projections tables. The component import all new changes (upsert, delete) and calculate which single views are impacted creating as much `projections changes` as many single views should be upserted or deleted.
To do so we need to define one strategy for each projection, because when the projection is affected by a change we need to calculate which single views are impacted. This is the task of the strategies.

For instance if we have a table A that when modified impact the table B and C, when receiving a change on table A we need to calculate also the impacted rows on table B and C and all the single views that depend on table A, B and C for some information.

Following this documentation you would be able to create and configure a `Real-Time Updater`

## Create Real-Time Updater Service

To create the **Real-Time Updater Service**, it is necessary to create a microservice starting from the `Node.js Template`, available in the Marketplace.

Mia-Platform team has developed a library called `kafka-importer-lib` - a library in **node.js** - to aid the developer in the implementation of the Real-Time Importer.

Install the lib with the following command:

```bash
npm i --save @mia-platform-internal/kafka-importer-lib
```

:::info
You can use the library **only under license**.
For further information contact your Mia Platform referent
:::

:::caution
To make the Service work with the `kafka-importer-lib` plugin, it is necessary to edit the `package.json` file.

All Node.js templates and examples on the Marketplace use `lc39` for the application startup (instead of `node`). However, `kafka-importer-lib` instantiates a Service with `lc39` as well.

`lc39` will start a web server, but in this case we are not developing a web server, still we need to expose some health check endpoints, this is left to the library which automatically exposes three endpoints:

* `/-/healthz` tell Kubernetes if the Service is healthy
* `/-/ready` tell Kubernetes if the Service is ready to receive some workload
* `/-/checkup` apply some custom login to check if all Service dependencies (Mongo, Kafka etc) are up and running

For more detailed information about `lc39` please take a look at [this](https://github.com/mia-platform/lc39)

Anyway, in order to avoid conflicts between the two, the `start` script in the `package.json` file must be edited as follows:

```json
"scripts": {
  ...
  "start": "node index.js"
  ...
}
```

:::

The `kafka-importer-lib` interface exposes a `kafkaImporterBuilder` to build a `kafkaImporter` and it needs several configurations to get it started, that are here reported:

```js
const kafkaImporterBuilder = new KafkaImporterBuilder()

kafkaImporterBuilder
  .setLogConfig({ level: LOG_LEVEL })
  .setProjectionsDbName(PROJECTIONS_DATABASE_NAME)
  .setProjectionsChangesCollectionName(PROJECTIONS_CHANGES_COLLECTION_NAME)
  .setProjectionsChangesEnabled(PROJECTIONS_CHANGES_ENABLED)
  .setMongoConfig({ uri: MONGODB_URL })
  .setTopicsList(topics)
  .setKafkaConfig({
    brokers: KAFKA_BROKERS,
    groupId: KAFKA_GROUP_ID,
    authentication: {
      username: KAFKA_SASL_USERNAME,
      password: KAFKA_SASL_PASSWORD,
      mechanism: 'plain',
    },
  })
  .setPartitionsConsumedConcurrently(KAFKA_CONCURRENCY)
  .setLC39Config({
    port: LC39_HTTP_PORT,
    livenessInterval: LIVENESS_INTERVAL_MS,
  })
  .setMappingTable(mapTable, namesConverter)
```

In particular:

* `setProjectionsDbName` sets the Mongo database name where the projections will be stored
* `setProjectionsChangesCollectionName` sets the name of the collection in which it will store the projections changes (i.e. the entity that triggers the Single View creation based on the modifications made on the projections)  
* `setProjectionsChangesEnabled` sets a boolean indicating if the projections changes are going to be generated after an event is received and imported in projections
* `setMongoConfig` sets the configuration for the MongoDb, that should contain the `uri` to the MongoDb on which projections and projections changes are going to be stored
* `setTopicsList` sets the list of the topics to which the importer needs to subscribe, that are the same topics configured in the Kafka configuration step
* `setKafkaConfig` sets the configuration for the Kafka client
* `setPartitionsConsumedConcurrently` sets the number of partitions than can be consumed concurrently (this increase the number of messages read concurrently)
* `setMappingTable` sets the configured mapping table and a take in input a function that will be applied to the entity name (see next section for forther information on ENTITY_NAME)
  
:::note
We advise the user to control the `setProjectionsChangesEnabled` parameter with a Service's environment variable. At the time of the massive import (when no data is available in the fast data system) it does not make sense to generate one `projection change` for each received message, instead it's worth waiting for the massive import to end and then run a massive generation of projections changes. During this (first) phase, by setting this flag to false, Service throughput will be increased.
:::

## Create MapTable

To import the projections, the Real-Time updater needs to know **how** to import them. For this reason, it needs a component called **MapTable**, that is a **JavaScript object** containing all the information to convert a message from Kafka to a record on the projections collections.

The basic structure of this object is the following:

```js
const mapTable = {
  'ENTITY_NAME': {
    destination: 'DESTINATION_PROJECTION_NAME',
    conversion: {
      'SOURCE_FIELD_NAME': {
        fieldName: 'DESTINATION_FIELD_NAME',
        cast: castFunction,
      },
      ...
    },
    changes: {
      'SINGLE_VIEW_TYPE': strategyToRetrieveIdentifier,
      ...
    }
  },
  ...
}
```

Where:

- `ENTITY_NAME` is the costant part of the topic name on which the CDC will send the modifications messages. A topic name may vary by environment, if so we want only the fixed part of the name, the prefix or suffix can be applied using the `namesConverter` function passed to the `setMappingTable`
- `destination` is the name of the destination projection's Mongo collection where this topic is mapped to
- `conversion` is an object in which all the fields need to be mapped, by specifying their name in the source database, their name in the destination projection and the cast function to convert them in a valid JavaScript/Mongo type
- `changes` is an object in which the key-value pairs describe the type of single views affected by a change on this specific projection.  For each type, it's indicated the correct [strategy](#define-strategies-and-design-projections-changes) that, if changes occur, will be executed to retrieve the related identifier from the current projection.  
  The  [Single View type](configure_single_view_creator#microservice-initialization) is an identifier for the Single View, which is stored in the projections changes and is used by the specific Single View Creator to be aware of the changes that concerns the related Single View.

Once the the Map Table is defined, it can be set to `kafkaImporterBuilder` as follows:

```js
kafkaImporterBuilder.setMappingTable(mapTable)
```

Alternatively, the `setMappingTable` can get a second parameter to convert the original table name to the Kafka topic name, in order to use the original table name as the key of `mapTable`:

```js
const mapTable = {
  'TABLE_NAME': { ... }
  ...
}

kafkaImporterBuilder.setMappingTable(mapTable, (tableName) => `kafka.topic.${tableName}`)
```

For instance let's say we have the Topic A that has two different name for `test` and `production` environment (`kafka.topic.topic-a-prod`, and `kafka.topic.topic-a-test`).
This translation can be achieved definit the ENTITY_NAME simply as `topic-a` and then passing a convert function like this

```js
kafkaImporterBuilder.setMappingTable(mapTable, (tableName) => `kafka.topic.${tableName}-${ENV}`)
```

## Define cast functions

The Map Table also take in input a cast function for each defined field. This give us the possibilities to define the output format and type of the imported fields. For example if we receive in a field a date with this format `YYYYMMDD` and we want to cast it to ISO format we can do it with a casting function. Such cast functions simply receive, as input, the value of the input field and are expected to return, as output, the converted value.

:::note
Since JavaScript is untyped, a conversion function needs some care to be implemented correctly
:::

Here are reported some example cast functions:

```js
// cast input value to string
function castToString(toBeCasted) {
  if (toBeCasted === null) {
    return null
  }
  if (typeof toBeCasted === 'number') {
    return `${toBeCasted}`
  }
  if (typeof toBeCasted === 'string') {
    return toBeCasted.trim()
  }
  return undefined
}

// cast input value to integer number
function castToInt(integer) {
  if (integer === null) {
    return null
  }

  const parsedInt = parseInt(integer, 10)
  return Number.isNaN(parsedInt) ? undefined : parsedInt
}

// cast input value to floating point number
function castToFloat(float) {
  if (float === null) {
    return null
  }
  const floatAsString = `${float}`.replace(',', '.')
  const parsedFloat = parseFloat(floatAsString)
  return Number.isNaN(parsedFloat) ? undefined : parsedFloat
}
```

## Define strategies and design projections changes

When the `Single View Creator` will be configured, it will look at the changes stored in the **projections changes collection**. In order to know which specific Single View needs to be updated, based on the projections records just modified by the importer, the Single View Creator will look at the projection change `identifier`.

In order to do so, some **strategies** need to be implemented. These strategies are basically the way to retrieve the affected single views identifiers from the projections stored in the database. The output of the strategies will be used by the `kafka-importer-lib` to create one `projection-change` for each identifier

The strategy function expected by the Kafka Importer is an `async` function that receives in input the updated projection document (the one received from Kafka) and it returns as output an array of identifiers.
In the simplest case the document already contains the projection identifier fields, so we can extract it from the input document.
For example the Single View identifier is:

```js
{
  field_a,
  field_b
}
```

and the input document is:

```js
{
  field_a: 'value_a',
  field_b: 'value_b',
  field_c: 'value_c',
  field_d: 'value_d'
}
```

we can extract the identifier from the document itself

```js
async function strategy(aDocument) {
  const {
    field_a,
    field_b
  } = aDocument

  const identifier = {
    field_a,
    field_b
  }

  return [identifier]
}

```

In a more complex situation we don't have all the information in the first document but we need to fetch more documents to get all fields.  
In this second scenario the input document is:

```js
const {
  field_a: 'value_a',
  field_c: 'value_c',
}
```

We don't have `field_b` and `field_d`,  so we need to fetch the table that contain first `field_d` and the the table that contain `field_b`

```js
function strategyBuilder(aMongoDb) {
  return async(aDocument) => {
    const {
      field_a,
      field_c
    } = aDocument
    // retrieve first document using aMongoDb
    const firstRetrieve = await aMongoDb.collection(startingProjection).findOne({
      field_c: field_c
    })

    // retrieve all documents that match field_d from the first retrieved document
    const results = await aMongoDb.collection(projectionWithKey).find({
      field_d: firstRetrieve.field_d
    })

  const identifiers = results.map(({ field_b }) => {
    return {
      field_a,
      field_b,
    }
  })

    return identifiers
  }
}
```

Since the strategy needs a MongoDb instance, this needs to be passed to the Map Table in some way. For this reason, a `mapTableBuiler` can be defined as well:

```js
function mapTableBuilder(aMongoDb) {
  return {
    'KAFKA_TOPIC_NAME': {
      destination: 'DESTINATION_PROJECTION_NAME',
      conversion: {
        'SOURCE_FIELD_NAME': {
          fieldName: 'DESTINATION_FIELD_NAME',
          cast: castFunction,
        }
      },
      changes: {
        'SINGLE_VIEW_TYPE': strategyBuilder(aMongoDb),
      }
    }
  }
}
```
