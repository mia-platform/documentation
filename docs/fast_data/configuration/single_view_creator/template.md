---
id: template
title: Single View Creator Template
sidebar_label: Template
---

:::caution Deprecated
The Single View Creator Template has been **deprecated** in favour of the [Single View Creator Plugin](/fast_data/configuration/single_view_creator/plugin.md), which supports both [Low Code and No Code features](/fast_data/no_code_overview.md).
:::

Search in the [Marketplace](/marketplace/overview_marketplace.md) for a `Single View Creator - Template` and create it.
Then go to the microservice page of the newly created Single View Creator and set the correct values to the environment variables containing a placeholder. 
Click on the repository link in the microservice page and clone on your computer the repository.

:::info
You can use the template and all of Mia-Platform libraries **only under license**.
For further information contact your Mia Platform representative.
:::

## Code overview

The service starts in `index.js` file.
First, the template uses the [Custom Plugin Lib](/development_suite/api-console/api-design/plugin_baas_4.md) to instantiate a service.
Inside its callback, the `single-view-creator-lib` is initialized to deal with the complexity of the Fast Data components.

```js
const singleViewCreator = getSingleViewCreator(log, config, customMetrics)

await singleViewCreator
  .initEnvironment() // connect Mongo, Kafka and create the patient instance
service.decorate('patient', singleViewCreator.k8sPatient)
```

`config` is an object whose fields represent the [Microservice environment variables](/development_suite/api-console/api-design/services.md#environment-variable-configuration).

Some environment variables will be pre-compiled when you create the service from template, others won't, but they will still have a placeholder as value. Replace it with the correct value.

### Initialization

Now, we start the Single View Creator:

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

- `strategy` is the function that performs the aggregation over the Projections
- `mapper` is the function that takes as input the raw aggregation result and maps the data to the final Single View
- `validator` is the validation function which determines if the Single View is valid (and thus inserted or updated in Mongo) or not (and thus deleted)
- `singleViewKeyGetter` is the function that, given the Projections changes identifier, returns the data used as selector to find the Single View document on Mongo to update or delete
- `upsertFnSv` is the function that updates or inserts the Single View to the Single Views collection on Mongo
- `deleteSingleView` is the function that deletes the Single View from the Single Views collection on Mongo. It uses the `deleteSV` function exported by the library.

:::note
The `deleteSV` function makes a *real delete* of the document on MongoDB. So, unlike the **Projections** deletion, it does *not* make a virtual delete.
:::

The value of `upsertFnSv` is based on the `UPSERT_STRATEGIES` environment variable. If its value is *update*, then the *updateOrInsertSV* function exported by the library is used, otherwise the function *replaceOrInsertSV* is used instead. The default upsert strategy is *replace*.

:::note
In the versions of the template prior to the `v3.1.0`, the UPSERT_STRATEGIES was missing, and it was used an alias function (*upsertSV*) of the *replaceOrInsertSV*.
:::

### Shutdown

The Single View Creator needs to be stopped when the process is stopping. To do that, we use the `onClose` hook:

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

## Validator

The `startCustom` function accepts a function in the configuration object called `validator`, which is the **validation function**.

The validation of a Single View determines what to do with the current update. If the Single View is determined as "non-valid", the delete function will be called. Otherwise, if the result of the validation is positive, it will be updated or inserted in the Single Views collection, through the upsert function. You can read about Delete and upsert functions [here](/fast_data/configuration/single_view_creator/upsert_delete_strategies.md).

The input fields of the validation function are the logger and the Single View, while the output is a boolean containing the result of the validation.

```js
// (logger: BasicLogger, singleView: Document) => Boolean
function singleViewValidator(logger, singleView) {
  // ... checks on singleView
  // returns a boolean
  return validationResult
}
```

## Upsert and Delete Strategies

You can either use the [provided upsert and delete strategies](/fast_data/configuration/single_view_creator/upsert_delete_strategies.md) or to pass your custom functions directly to the `startCustom` method.

```js title="index.js" {6-7} showLineNumbers
const resolvedOnStop = singleViewCreator.startCustom({
  strategy: aggregatorBuilder(projectionsDB),
  mapper,
  validator,
  singleViewKeyGetter: singleViewKey,
  upsertSingleView: upsertFnSV,
  deleteSingleView: deleteSV,
})
```
