---
id: configure_single_view_creator
title: Single View Creator
sidebar_label: Configure Single View Creator
---

## Microservice initialization

Each Single View needs a dedicated Microservice. This service will listen on the **Projections changes** that affect the Single view and consequently update its data. This service is the `Single View Creator`.

To start configure your Single View Creator, you can start from the *Single View Creator Template*.

## Single View Creator Template

### Initialize the service

The service starts in `index.js` file.
First of all, the template use the [Custom Plugin Lib](https://docs.mia-platform.eu/docs/development_suite/api-console/api-design/plugin_baas_4) to instantiate a service.
Inside its callback, the `single-view-creator-lib`  is initialized to deal with the complexity of the Fast-data components.

```js
const singleViewCreator = getSingleViewCreator(log, config, customMetrics)

await singleViewCreator.initEnvironment() // connect Mongo, Kafka and create the patient instance
service.decorate('patient', singleViewCreator.k8sPatient)
```

Where `config` is an object whose fields represent the [Microservice environment variables](../development_suite/api-console/api-design/services.md#environment-variable-configuration).

Some environment variable will be pre-compiled when you create the service from template, other will be not but will have a placeholder as value. Replace it with the correct value. 

Here some tips: 

- `TYPE`: should be the name of the single view which your single view creator is responsible for
- `SINGLE_VIEWS_COLLECTION`: should be the name of the single view which your single view creator is responsible for
- `PROJECTIONS_CHANGES_COLLECTION`: if you have set a custom projection change collection name from advanced, then set its name. Otherwise it is `fd-pc-SYSTEM_ID` where `SYSTEM_ID` is the id of the System of Records this single view creator is responsible for.
- `SINGLE_VIEWS_PORTFOLIO_ORIGIN`: should be equals to the `SYSTEM_ID` you have set in `PROJECTIONS_CHANGES_COLLECTION`
- `SINGLE_VIEWS_ERRORS_COLLECTION`: it is the name of a MongoDB Crud you want to use as collection for single view errors.

Now, we start the single-view-creator:

```js
await singleViewCreator.startCustom(
  aggregator,
  mapper,
  validator,
  singleViewKeyExtractor,
  upsertFunction,
  deleteFunction
)
```

- `aggregator` is the function that performs the aggregation over the projections
- `mapper` is the function that takes as input the raw aggregation result and maps the data to the final Single View
- `validator` is the validation function, which determines if the Single View is valid (and so upserted to Mongo) or not (and so deleted)
- `singleViewKeyExtractor` is the function that extracts, from the projections changes identifier record, the key used by the aggregator to identify the data to gather
- `upsertFunction` is the function that upsert the Single View to the Single Views collection on Mongo
- `deleteFunction` is the function that delete the Single View from the Single Views collection on Mongo

In this template we use `startCustom`:

```js
const resolvedOnStop = singleViewCreator.startCustom({
  strategy: aggregatorBuilder(projectionsDB),
  mapper,
  validator,
  singleViewKeyGetter: singleViewKey,
  upsertSingleView: upsertSV(),
  deleteSingleView: fullDeleteSV(),
})
```

`upsertSV` and `fullDeleteSV` are two utility functions that the library exports that handle the upsert and the delete of the single view. 

:::note
The `fullDeleteSV` function makes a *real delete* of the document on MongoDb. So, unlike the **projections** deletion, it does *not* make a virtual delete.
:::

The Single View creator needs to be stopped when the process is stopping. To do that, we use the `onClose` hook:

```js
service.addHook('onClose', async() => {
  log.fatal({ type: 'END' }, 'Single View Creator is stopping...')
  await singleViewCreator.stop()

  // this is a promised resolved when the infinite loop which processes the single views ends.
  // Here we wait for the resolving of the promise. You don't need to call it.
  await resolvedOnStop
  log.fatal({ type: 'END' }, 'Single View Creator stopped')
  await mongoClient.close()
})
```

:::info
You can use the template and all the Mia-Platform libraries **only under license**.
For further information contact your Mia Platform referent
:::

::note
This documentation refers to the `@mia-platform-internal/single-view-creator-lib` ^8.0.2
:: 

The core of your work on this service are the files inside the `src` folder. 

**singleViewKey.js**: It takes in input the identifier of the projection change and return the key object used to select the document of the Single View collection that need to be updated.   
In the example below, we expect to have the field `myId` as primary key of the Single View collection.   

```js
const get = require('lodash.get')

module.exports = function singleViewKeyGenerator(logger, projectionChangeIdentifier) {
  const IDENTIFIER_KEY = 'UNIQUE_ID'
  
  // get the single view id from the identifier
  const myId = projectionChangeIdentifier[IDENTIFIER_KEY]

  return {
    myId,
  }
}
```

**pipeline.js**: It takes as input a MongoDB instance and returns a function. This function takes as input the projection change identifier and returns an array.   
If it's empty, than it will be executed a delete on the single view identified by the singleViewKeyGenerator result. 
If it's not empty, than it will be executed an upsert on the single view identified by the singleViewKeyGenerator result. 

**Note**: If the pipeline returns an array with more than one element, only the first element will be used for the upsert.

```js
module.exports = (mongoDb) => {
  return async(logger, projectionChangeIdentifier) => {

    const uniqueId = projectionChangeIdentifier.UNIQUE_ID
    const MY_PROJECTION = 'projection-name'

    // retrieve data from all projections you need for your single view
    const projectionCollection = mongoDb.collection(MY_PROJECTION)
    const projectionDataById = await projectionCollection.findOne({
        UNIQUE_ID: uniqueId,
        __STATE__: 'PUBLIC'
    })

    if (!projectionDataById) {
      // it's expected to be a delete
      logger.debug({ UNIQUE_ID: uniqueId }, 'single view public data not found')
      return []
    }
    const singleViewData = projectionDataById
    logger.debug({ singleViewData }, 'single view retrieved data')

    return [
      singleViewData,
    ]
  }
}
```

**mapper.js**: It's a function that takes as argument the first element (if defined) of the result of the pipeline, and returns an object containing the value updated for the single view. The object returned should match the schema of the single view.

```js
module.exports = (logger, singleViewData) => {
  const { UNIQUE_ID, NAME } = singleViewData

  return {
    myId: UNIQUE_ID,
    name: NAME,
  }
}
```

Inside the mapper it can be applied a renaming and repositioning of the fields.

:::note
We suggest to implement inside the mapper all the aggregation logic that can be reused for all the clients that will read the Single Views, they should be as generic as possible.
It's good to have some calculation and aggregation logic inside Single View Creator as far as it is reusable.
If you have to apply some custom logic try to do it inside and API Adapter specific for the client.
:::

### Validate a Single View

The `startCustom` function accepts a function in the configuration object called `validator`, which is the validation function.

The validation of a Single View determines what to do with the current update. If the single  view is determined as "non-valid", the delete function will be called. Otherwise, if the result of the validation is positive, it will be updated or inserted in the Single Views collection, through the upsert function. Delete function and upsert function will be explained in the next paragraph.

For this reason, the validation procedure should not be too strict, since a Single View declared as "invalid" would not be upserted to the database. Rather, the validation is a check operation to determine if the current Single View should be handled with the upsert or delete functions.

As default, in this template we set as validator a function that returns always true. So we accept all kind of single views, but, if you need it, you can replace that function with your own custom validator.

The input fields of the validation function are the logger and the Single View, while the output is a boolean containing the result of the validation.

```js
function singleViewValidator(logger, singleView) {
  ... checks on singleView

  // returns a boolean
  return validationResult
}
```

### Customize Upsert and Delete functions

If you want, you can replace both `upsertSV` and `fullDeleteSV` with your own custom functions to perform those operations.

These functions represents the last step of the creation (or deletion) of a Single View, in which the Single View collection is actually modified.

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