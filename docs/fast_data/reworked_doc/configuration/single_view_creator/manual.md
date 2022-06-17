---
id: manual
title: Single View Creator Manual configuration
sidebar_label: Manual
---

Single View Creator can be configured as manual through a few Javascript files, mounted as Config Map to the service.

## Single View Key

It takes as input the identifier of the projection change and returns the key object used to select the document of the Single View collection that needs to be updated. This key corresponds to the query object fed to mongodb, therefore you can return any legal Mongo query.

In the example below, we expect to have the field `myId` as primary key of the Single View collection.

```js title="singleViewKey.js"
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

## Aggregation

### Pipeline

It takes as input a MongoDB instance and returns a function. This function takes as input the projection change identifier and returns an array.

If it is empty, a delete operation will be executed on the single view identified by the `singleViewKeyGenerator` result.
If it is not empty, an upsert operation will be executed on the single view identified by the `singleViewKeyGenerator` result.

:::note
If the pipeline returns an array with more than one element, only the first element will be used for the upsert.
:::

```js title="pipeline.js"
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

### Mapper

It is a function that takes as argument the first element (if defined) of the result of the pipeline, and returns an object containing the value updated for the single view. The object returned should match the schema of the single view.

```js title="mapper.js"
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
