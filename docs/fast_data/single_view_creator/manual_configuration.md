---
id: manual-configuration
title: Single View Creator Manual configuration
sidebar_label: Manual configuration
---

In this page, we discuss how to configure the Template. You can find more information about the configuration of the simple Plugin at this [link](../../runtime_suite/single-view-creator/configuration).

## Single View Creator Template

### Initialize the service

The service starts in `index.js` file.
First, the template uses the [Custom Plugin Lib](https://docs.mia-platform.eu/docs/development_suite/api-console/api-design/plugin_baas_4) to instantiate a service.
Inside its callback, the `single-view-creator-lib` is initialized to deal with the complexity of the Fast Data components.

```js
const singleViewCreator = getSingleViewCreator(log, config, customMetrics)

await singleViewCreator.initEnvironment() // connect Mongo, Kafka and create the patient instance
service.decorate('patient', singleViewCreator.k8sPatient)
```

Where `config` is an object whose fields represent the [Microservice environment variables](../../development_suite/api-console/api-design/services.md#environment-variable-configuration).

Some environment variables will be pre-compiled when you create the service from template, others won't, but they will still have a placeholder as value. Replace it with the correct value.

Here are some tips:

- `TYPE`: should be the name of the single view which your single view creator is responsible for
- `SINGLE_VIEWS_COLLECTION`: should be the name of the single view which your single view creator is responsible for
- `PROJECTIONS_CHANGES_COLLECTION`: if you have set a custom projection change collection name from advanced, then set its name. Otherwise, it is `fd-pc-SYSTEM_ID` where `SYSTEM_ID` is the id of the System of Records this single view creator is responsible for.
- `SINGLE_VIEWS_PORTFOLIO_ORIGIN`: should be equals to the `SYSTEM_ID` you have set in `PROJECTIONS_CHANGES_COLLECTION`
- `SINGLE_VIEWS_ERRORS_COLLECTION`: it is the name of a MongoDB CRUD you want to use as collection for single view errors.
- `KAFKA_BA_TOPIC`: topic where to send the `before-after`, which is the single view document before and after a change
- `SEND_BA_TO_KAFKA`: true if you want to send to Kafka the `before-after` information about the update changes of the single view
- `KAFKA_SVC_EVENTS_TOPIC`: topic used to queue Single View Creator state changes (e.g. single view creation)
- `UPSERT_STRATEGIES`: (v3.1.0 or higher of the template) If it is set to "replace", the whole Single View document will be replaced with the new one. If it 
is set to "update", the existing one will be updated with the new one, but fields not present in the latter will be kept. Default is "replace".
- `SINGLE_VIEWS_MAX_PROCESSING_MINUTES`: (v3.4.2 or higher) time to wait before processing again a Projection with state IN_PROGRESS
- `CA_CERT_PATH`: the path to the CA certificate, which should include the file name as well, e.g. `/home/my-ca.pem`

If you do not want to use Kafka in the Single View Creator, you can just not set the environment variable *KAFKA_CLIENT_ID* or *KAFKA_BROKERS_LIST*. If one of them is missing, Kafka will not be configured by the service (requires *single-view-creator-lib* v9.1.0 or higher)

Now, we start the single-view-creator:

```js
const resolvedOnStop = singleViewCreator.startCustom({
  strategy: aggregatorBuilder(projectionsDB),
  mapper,
  validator,
  singleViewKeyGetter: singleViewKey,
  upsertSingleView: upsertFnSv(),
  deleteSingleView: deleteSV(),
})
```

- `strategy` is the function that performs the aggregation over the projections
- `mapper` is the function that takes as input the raw aggregation result and maps the data to the final Single View
- `validator` is the validation function which determines if the Single View is valid (and thus inserted or updated in Mongo) or not (and thus deleted)
- `singleViewKeyGetter` is the function that, given the projections changes identifier, returns the data used as selector to find the single view document on Mongo to update or delete
- `upsertFnSv` is the function that updates or inserts the Single View to the Single Views collection on Mongo
- `deleteSingleView` is the function that deletes the Single View from the Single Views collection on Mongo. It's used the `deleteSV` exported by the library.

:::note
The `deleteSV` function makes a *real delete* of the document on MongoDB. So, unlike the **projections** deletion, it does *not* make a virtual delete.
:::

The value of `upsertFnSv` is based on the `UPSERT_STRATEGIES` environment variable. If its value is *update*, then the *updateOrInsertSV* function exported by the library is used, otherwise the function *replaceOrInsertSV* is used instead. The default upsert strategy is *replace*.

:::note
In the versions of the template prior to the `v3.1.0`, the UPSERT_STRATEGIES was missing, and it was used an alias function (*upsertSV*) of the *replaceOrInsertSV*.
:::

The Single View creator needs to be stopped when the process is stopping. To do that, we use the `onClose` hook:

```js
service.addHook('onClose', async() => {
  log.fatal({ type: 'END' }, 'Single View Creator is stopping...')
  await singleViewCreator.stop()

  // this is a promise resolved when the infinite loop which processes the single views ends.
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

:::note
This documentation refers to the `@mia-platform-internal/single-view-creator-lib` ^9.x.x.
:::

The core of your work on this service are the files inside the `src` folder.

**singleViewKey.js**: It takes as input the identifier of the projection change and returns the key object used to select the document of the Single View collection that needs to be updated. This key corresponds to the query object fed to mongodb, therefore you can return any legal Mongo query.

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

If it is empty, a delete operation will be executed on the single view identified by the `singleViewKeyGenerator` result.
If it is not empty, an upsert operation will be executed on the single view identified by the `singleViewKeyGenerator` result.

:::note
If the pipeline returns an array with more than one element, only the first element will be used for the upsert.
:::

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

**mapper.js**: It is a function that takes as argument the first element (if defined) of the result of the pipeline, and returns an object containing the value updated for the single view. The object returned should match the schema of the single view.

```js
module.exports = (logger, singleViewData) => {
  const { UNIQUE_ID, NAME } = singleViewData

  return {
    myId: UNIQUE_ID,
    name: NAME,
  }
}
```

Inside the mapper a renaming and repositioning of the fields can be applied.

:::note
We suggest implementing inside the mapper all the aggregation logic that can be reused for all the clients that will read the Single Views, they should be as generic as possible.
It is a good practice to have some calculation and aggregation logic inside Single View Creator as far as it is reusable.
If you have to apply some custom logic try to do it inside and API Adapter specific for the client.
:::

### Validate a Single View

The `startCustom` function accepts a function in the configuration object called `validator`, which is the validation function.

The validation of a Single View determines what to do with the current update. If the single view is determined as "non-valid", the delete function will be called. Otherwise, if the result of the validation is positive, it will be updated or inserted in the Single Views collection, through the upsert function. Delete function and upsert function will be explained in the next paragraph.

For this reason, the validation procedure should not be too strict, since a Single View declared as "invalid" would not be updated or inserted to the database. Rather, the validation is a check operation to determine if the current Single View should be handled with the upsert or delete functions.

By default, in this template we set as validator a function that returns always true. So we accept all kinds of single views, but, if you need it, you can replace that function with your own custom validator.

The input fields of the validation function are the logger and the Single View, while the output is a boolean containing the result of the validation.

```js
function singleViewValidator(logger, singleView) {
  ... checks on singleView

  // returns a boolean
  return validationResult
}
```

Since version v3.5.0, it is possible to specify a custom validator function inside the configuration folder (`CONFIGURATION_FOLDER`).

The file must be named `validator.js` and must export a function that will take as arguments the same as the default validator explained above.

```js
module.exports = function validator(logger, singleView) {
  ... custom validation logic on singleView

  // returns a boolean
  return customValidationResult
}
```

:::warning
When the update of an existing Single View is triggered and the validation has a negative outcome, the Single View won't be updated, and instead it will be deleted.
:::

### Customize Upsert and Delete functions

If you want, you can replace both upsert and delete functions with your own custom functions to perform those operations.

These functions represent the last step of the creation (or deletion) of a Single View, in which the Single View collection is actually modified.

In case the validation is succeeded, the upsert function will be called with the following arguments:

- `logger` is the logger
- `singleViewCollection` is the Mongo collection object
- `singleView` is the result of the mapping operation
- `singleViewKey` is the Single View key

On the other hand, if the validation has a negative result, the delete function will be called with the same arguments, except for the `singleView`, which will not be handled by the delete function.

In both cases, some operation should be done on `singleViewCollection` in order to modify the Single View with the current `singleViewKey`, with the idea of "merging" the current result with the one already present in the database.

For example, we have a Customer Single View with a list of products the customer bought from different e-commerce, and we receive an update for a new object on a specific shop, in that case we don't want to replace the list of bought products with the last one arrived, but we want to push the product in the list in order to have the complete history of purchases.

For both functions, the output is composed of an object containing two fields:

- `old` which contains the old Single View
- `new` which contains the new Single View

These values will respectively be the `before` and the `after` of the message sent to the `KAFKA_BA_TOPIC` topic, that is the topic responsible for tracking any result of the Single View creator. The naming convention for this topic can be found [here](../setup_fast_data.md#topic-for-verified-update-of-the-sv).

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

### Error handling

When generating a Single View, every error that occurs is saved in MongoDB, with a format that satisfies the schema requirements of the CRUD service, so that you can handle those errors using the Console. The fields of the error messages when they are first created are:

- `_id`: a unique identifier of the record, automatically generated
- `portfolioOrigin`: a value concerning the origin of the error, defaults to `UNKNOWN_PORTFOLIO_ORIGIN`
- `type`: the Single View type
- `identifier`: id of the projection changes
- `errorType`: the error details
- `createdAt`: time of creation
- `creatorId`: set to `single-view-creator`
- `__STATE__`: set to `PUBLIC`
- `updaterId`: set to `single-view-creator`
- `updatedAt`: time of creation

It is highly recommended using a TTL index to enable the automatic deletion of older messages, which can be done directly using the Console, as explained [here](../../../docs/development_suite/api-console/api-design/crud_advanced.md#indexes).

### CA certs

Since service version `3.9.0`, you can set your CA certs by providing a path to the certification file in the environment variable `CA_CERT_PATH`.
