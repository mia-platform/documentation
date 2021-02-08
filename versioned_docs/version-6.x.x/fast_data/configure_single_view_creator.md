---
id: configure_single_view_creator
title: Single View Creator
sidebar_label: Configure Single View Creator
---
## Single View

A Single View allows to aggregate data from different sources in order to have a single collection that includes all needed entity information (e.g customers, policies, etc. ).

Once a projections has been modified and some **Projections Changes** has been created the **Single Views** must be updated or deleted, to do so you have to create and configure the Single View Creator.
In this section we'll see how to do this.

## Microservice initialization

Each Single View needs a dedicated Microservice. This service will listen on the **Projections changes** that affect the Single view and consequently update its data.

At the moment there is not a dedicated Microservice template in the Marketplace. So it is necessary to create a Microservice [starting from the Node.js Template](../development_suite/api-console/api-design/plugin_baas_4.md).

To deal with the complexity of the Fast-data components, Mia-Platform team has developed a **Node.js** library called `single-view-creator-lib`.

You can install the library with the following command:

```bash
npm i --save @mia-platform-internal/single-view-creator-lib
```

:::info
You can use the library **only under license**.
For further information contact your Mia Platform referent
:::

:::caution
To make the service work with the `single-view-creator-lib` plugin, it is necessary to edit the `package.json` file.

All Node.js templates and examples on the Marketplace use `lc39` for the application startup (instead of `node`). However, `single-view-creator-lib` instantiates a service with `lc39` as well.

`lc39` will start a web server, but in this case we are not developing a web server, still we need to expose some health check endpoints, this is left to the library which automatically expose three endpoints:

* `/-/healthz` tell Kubernetes if the service is healthy
* `/-/ready` tell Kubernetes if the service is ready to receive some workload
* `/-/checkup` apply some custom login to check if all service dependencies (Mongo, Kafka etc) are up and running

For more detailed information about `lc39` please take a look at [this](https://github.com/mia-platform/lc39)

Anyway in order to avoid conflicts between the two, the `start` script in the `package.json` file must be edited as follows:

```json
"scripts": {
  ...
  "start": "node index.js"
  ...
}
```

:::

## Setup and use Single View Creator Library

To use the `single-view-creator-lib` library, it is necessary to instantiate an object with the correct configuration:

```js
const singleViewCreator = singleViewCreatorLib(logger, config)
```

Where `config` is an object with the following required fields that represent the required [Microservice environment variables](../development_suite/api-console/api-design/services.md#environment-variable-configuration):

```js
const config = {
  SINGLE_VIEWS_MONGODB_URL,
  PROJECTIONS_MONGODB_URL,
  PROJECTIONS_CHANGES_DATABASE,
  SINGLE_VIEWS_DATABASE,
  SINGLE_VIEWS_BEFORE_AFTER_COLLECTION,
  PROJECTIONS_CHANGES_COLLECTION,
  SINGLE_VIEWS_COLLECTION,
  SINGLE_VIEWS_ERRORS_COLLECTION,
  TYPE,
  PROJECTIONS_CHANGES_MONGODB_URL,
  SCHEDULING_TIME,
  PROJECTIONS_DATABASE,
  PROJECTIONS_CHANGES_STARTING_COLLECTION,
  BEFORE_AFTER_PORTFOLIO_ORIGIN,
  SEND_SV_CREATION_TO_KAFKA,
  KAFKA_TOPIC,
  KAFKA_CONF_PATH,
}
```

* `SINGLE_VIEWS_MONGODB_URL` the URL of MongoDb for Single Views collection
* `PROJECTIONS_MONGODB_URL` the URL of MongoDb for projections collection
* `PROJECTIONS_CHANGES_DATABASE` the Projection Changes database name (e.g projections)
* `SINGLE_VIEWS_DATABASE` the Single Views database name (e.g singleViews)
* `SINGLE_VIEWS_BEFORE_AFTER_COLLECTION`  the Single Views before after collection (e.g before_after)
* `PROJECTIONS_CHANGES_COLLECTION` the projections changes collection name (e.g projections_changes)
* `SINGLE_VIEWS_COLLECTION` the Single Views collection name (e.g insurances)
* `SINGLE_VIEWS_ERRORS_COLLECTION` the name of the collection where the library will insert the error detected when creating Single Views
* `PROJECTIONS_CHANGES_MONGODB_URL` the URL of MongoDb for projections changes collection
* `SCHEDULING_TIME` a quantity of time in milliseconds, every X milliseconds the service wake up and check if there are some projections changes in `NEW` state to work on. The service continue working until no more new projections changes are found, if so he goes to sleep for X milliseconds.
* `PROJECTIONS_DATABASE` the projections database name (e.g projections)
* `PROJECTIONS_CHANGES_STARTING_COLLECTION` the starting collection for the aggregation pipeline (e.g policy)
* `BEFORE_AFTER_PORTFOLIO_ORIGIN` the source of the Single Views (in case a Single View is generated from more than one different source) (e.g SAP, Example, PASS)
* `SEND_SV_CREATION_TO_KAFKA` a boolean flag to define if an event should be sent to Kafka when a Single View is upserted/deleted
* `KAFKA_TOPIC` optional, Kafka `topic name` should be set only if `SEND_SV_CREATION_TO_KAFKA` is set to true
* `KAFKA_CONF_PATH` optional, Kafka configuration path (the file should contain the information to connect to Kafka)

`singleViewCreator` can be started in two way: using `startAggregation` or `startCustom`. Both take in input the same parameter but with different meanings:

```js
await singleViewCreator.startAggregation(
  aggregator, // Aggregation Pipeline
  mapper,
  validator,
  singleViewKeyExtractor,
  upsertFunction,
  deleteFunction
)
```

```js
await singleViewCreator.startCustom(
  aggregator, // Custom Aggregator
  mapper,
  validator,
  singleViewKeyExtractor,
  upsertFunction,
  deleteFunction
)
```

- `aggregator` is the function that performs the aggregation over the projections, it can be a Mongo aggregation pipeline or a series of find and some other cus`tom logics` the output should be a RAW Single View
- `mapper` is the function that takes as input the raw aggregation result and maps the data to the final Single View
- `validator` is the validation function, which determines if the Single View is valid (and so upserted to Mongo) or not (and so deleted)
- `singleViewKeyExtractor` is the function that extracts, from the projections changes identifier record, the key used by the aggregator to identify the data to gather
- `upsertFunction` is the function that upsert the Single View to the Single Views collection on Mongo
- `deleteFunction` is the function that delete the Single View from the Single Views collection on Mongo

:::caution
The Single View creator needs to be stopped when the process is stopping. So it is necessary to add this piece of code **before** the aggregation begins:

```js
process.on('SIGTERM', async() => {
  logger.fatal({ type: 'SIGTERM' }, 'Single View Creator')
  await singleViewCreator.stop()
})
```

:::

## Single View Key Extractor

The Single View key is the starting point for the aggregation pipeline. The `start` method expects a function that takes in input the logger and the identifier read from the Projection Changes, and generate the key used by the aggregator to start the aggregation. The aggregation should start to fetch data from a `starting collection`, the SingleViewKey is thus used for the first fetch.

```js
function singleViewKeyExtractor(logger, identifier) {
  const singleViewKeyField1 = identifier.field1
  const singleViewKeyField2 = identifier.field2

  return {
    singleViewKeyField1,
    singleViewKeyField2,
  }
}
```

## Aggregator

The aggregation pipeline is the part of the Single View creation process in which all the data from all the projections involved are gathered together starting from the Single View key.

Based on the start strategy choosen (startAggregation or startCustom) the aggregator should be a Mongo aggregation pipeline or a custom function.

### StartAggregation

The aggregator function needs to be an async function that takes in input a `logger` and the `Single View Key`, and output an array containing all the pipeline stages.
The library will execute the aggregation pipeline and will automatically take the result

```js
async function aggregator(logger, key) {
  const aggregationPipeline = [
    {
      $match: {
        field_1: key.field_1
      }
    },
    ...
    // other stages
    ...
  ]
  return aggregationPipeline
}
```

### StartCustom

In this case the aggregator function need to be an async function that takes in input a `logger` and the `Single View Key` and directly return the aggregation results.
To do so we could need a MondoDb instance, to do so it can be useful to create an aggregator builder as follows:

```js
function aggregatorBuilder(aMongoDb) {
  return async(logger, key) {
    const aggregation = []

    // using aMongoDb to retrieve the data from firstProjection
    const results = await aMongoDb.collection(firstProjection).find({
        PROJECTION_KEY_FIELD: key.KeyField,
      }).toArray()

    // retrieving related records in secondProjection
    for (const first of results) {
      const second = await aMongoDb.collection(secondProjection).findOne({
          PROJECTION2_KEY_FIELD: firstProj.FIELD
        })

      aggregation.push({ first, second })
    }

    return aggregation
  }
}
```

And then use it to generate the aggregator function:

```js
const mongoClient = new MongoClient(MONGODB_URL, { useNewUrlParser: true })
mongoDb = mongoClient.db(PROJECTIONS_DATABASE)
aggregator = aggregatorBuilder(mongoDb)
```

### Which one to use

If you want to work with MongoDb Aggregation Pipeline you should always go for the `startAggregation`.  

If you need to apply some custom logic to the aggregation, for example, if some external information is needed and an HttpClient should be interrogated, you will need to implement a custom aggregator (use the builder to get access to the HttpClient).

:::caution
In both cases is essential to create the correct indexes on MongoDb, otherwise the performance will be heavily affected
:::

## Mapping

The mapping function needs to receive as input the RAW aggregation output and maps it to an object with the correct Single View fields, which will be the output of the function.

```js
function mapper(logger, aggregationResult) {
  const singleView = {
    field1: aggregationResult.TableA.fieldX,
    field2: aggregationResult.TableB.fieldY,
    field3: aggregationResult.TableC.fieldZ,
    ...
  }

  return singleView
}
```

Inside the mapper it can be applied a renaming and repositioning of the fields.
:::note
We suggest to implement inside the mapper all the aggregation logic that can be reused for all the clients that will read the Single Views, they should be as generic as possible.
It's good to have some calculation and aggregation logic inside Single View Creator as far as it is reusable.
If you have to apply some custom logic try to do it inside and API Adapter specific for the client.  
:::

## Validation

The validation of a Single View determines what to do with the current update. If the single  view is determined as "non-valid", the delete function will be called. Otherwise, if the result of the validation is positive, it will be updated or inserted in the Single Views collection, through the upsert function. Delete function and upsert function will be explained in the next paragraph.

For this reason, the validation procedure should not be too strict, since a Single View declared as "invalid" would not be upserted to the database. Rather, the validation is a check operation to determine if the current Single View should be handled with the upsert or delete functions.

The input fields of the validation function are the logger and the Single View, while the output is an object containing two fields:

- `ok`: a boolean indicating if the Single View is valid or not
- `error`: a string containing an error in case the Single View is not valid

```js
function singleViewValidator(logger, singleView) {
  ... checks on singleView

  return {
    ok: validationResult,
    error: errors
  }
}
```

## Upsert and Delete functions

The last two arguments of the start functions are the upsert and delete functions. They are the operations made respectively before upserting and before deleting the Single View on/from the Single Views collection on Mongo. This represents the last step of the creation of a Single View, in which the Single View collection is actually modified.

In case the validation is succeded, the upsert function will be called with the following arguments:

- `logger` is the logger
- `singleViewCollection`is the the Mongo collection object
- `singleView` is the result of the mapping operation
- `singleViewKey` is the Single View key

On the other hand, if the validation has a negative result, the delete function will be called with the same arguments, expect from `singleView`, which will not be handled by the delete function.

In both cases, some operation should be done on `singleViewCollection` in order to modify the Single View with the current `singleViewKey`, with the idea of "merging" the current result with the one already present in the database.

For example, we have a Customer Single View with a list of products the customer bought from different e-commerce and we receive an update for a new object on a specific shop, in that case we don't want to replace the list of bought products with the last one arrived but we want to push the product in the list in order to have the complete history of purchases.

For both functions, the output is composed of an object containing two fields:

- `old` which contains the old Single View
- `new` which contains the new Single View

These values will be the respective `old` and `new` fields of the `before_after` collection, that is the collection to track any result of the Single View creator.

```js
async function upsertSingleViewFunction(
  logger,
  singleViewCollection,
  singleView,
  singleViewKey)
{
  logger.trace('Upserting Single View...')
  const oldSingleView = await singleViewCollection.findOne(singleViewKey)

  await singleViewCollection.replaceOne(
    singleViewKey,
    singleView,
    { upsert: true }
  )

  logger.trace({ isNew: Boolean(oldSingleView) }, 'Updated Single View')
  return {
    old: oldSingleView,
    new: singleView,
  }
}

async function deleteSingleViewFunction(
  logger,
  singleViewCollection,
  singleViewKey)
{
  logger.trace('Deleting Single View...')
  const oldSingleView = await singleViewCollection.findOne(singleViewKey)

  if (oldSingleView !== null) {
    try {
      await singleViewCollection.deleteOne(singleViewKey)
    } catch (ex) {
      logger.error(`Error during Single View delete: ${ex}`)
    }
  }

  logger.trace('Single view deletion procedure terminated')
  return {
    old: oldSingleView,
    new: null,
  }
}
```
