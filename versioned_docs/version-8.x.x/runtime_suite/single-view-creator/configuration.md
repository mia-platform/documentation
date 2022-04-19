---
id: configuration
title: Single View Creator plugin
sidebar_label: Configuration
---
This service allows you to update the Single View when a new projection change occurs.

It requires MongoDB and Kafka to be installed in your platform. The former is used to read the projections changes and update the Single View, the latest is used to notify the events happening, like a Single View creation.  

:::info
If you want to write your own code for your Single View Creator service we suggest you to start from our [Single View Creator Template](../../fast_data/single_view_creator/manual-configuration#single-view-creator-template)) which contains several utilities that can help you.
:::

## Environment variables

  * **LOG_LEVEL**
  * **MICROSERVICE_GATEWAY_SERVICE_NAME**
  * **TRUSTED_PROXIES**
  * **HTTP_PORT**
  * **USERID_HEADER_KEY**
  * **GROUPS_HEADER_KEY**
  * **CLIENTTYPE_HEADER_KEY**
  * **BACKOFFICE_HEADER_KEY**
  * **USER_PROPERTIES_HEADER_KEY**
  * **TYPE**: Identifies the type of projection changes that need to be read. It should be set equals to the Single View name you want to update.
  * **SCHEDULING_TIME**: an amount of time in milliseconds, every X milliseconds the service wake up and check if there are some projectionschanges in `NEW` state to work on. The service continue working until no more new projections changes are found, if so he goes to sleep for X milliseconds."
  * **PROJECTIONS_MONGODB_URL**
  * **SINGLE_VIEWS_MONGODB_URL**
  * **PROJECTIONS_DATABASE**
  * **PROJECTIONS_CHANGES_DATABASE**
  * **PROJECTIONS_CHANGES_COLLECTION**: If not customized from Advanced: fd-pc-SYSTEM_ID where SYSTEM_ID is the name of the System of Records this Single View Creator is responsible for.
  * **SINGLE_VIEWS_DATABASE**
  * **SINGLE_VIEWS_COLLECTION**: the name of the Single View which this service is responsible for
  * **SINGLE_VIEWS_ERRORS_COLLECTION**: a MongoDB collection where you want to save the errors the occurs
  * **SINGLE_VIEWS_PORTFOLIO_ORIGIN**: Identifies the System ID of the System of Records which this Single View Creator is responsible for.
  * **KAFKA_CLIENT_ID**"
  * **KAFKA_BROKERS_LIST**
  * **KAFKA_SVC_EVENTS_TOPIC**: topic where to send the events that happens to the single view
  * **KAFKA_BA_TOPIC**: topic where to send the 'before-after' (data before and after the changes)
  * **SEND_BA_TO_KAFKA**: true if you want to send to Kafka the 'before-after' information about the update changes of the single view
  * **KAFKA_SASL_USERNAME**
  * **KAFKA_SASL_PASSWORD**
  * **UPSERT_STRATEGY**: If it's set to "replace", the whole Single view document will be replaced with the new one. If it's set to "update", the existing one will be update with the new one but field not present in the new one will be kept. Default is "replace".

## Configuration file

The Single View creator need a Configuration, named as you prefer, mounted on the path `/home/node/app/src` with the following files:

### singleViewKey.js

It takes in input the identifier of the projection change and return the key object used to select the document of the Single View collection that need to be updated.  
In the example below, we expect to have the field `myId` as primary key of the Single View collection.  

```javascript
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

### pipeline.js

It takes as input a MongoDB instance and returns a function. This function takes as input the projection change identifier and returns an array.
If it's empty, than it will be executed a delete on the single view identified by the singleViewKeyGenerator result.
If it's not empty, than it will be executed an upsert on the single view identified by the singleViewKeyGenerator result.

**Note**: If the pipeline returns an array with more than one element, only the first element will be used for the upsert.

```javascript
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

### mapper.js

It's a function that takes as argument the first element (if defined) of the result of the pipeline, and returns an object containing the value updated for the single view. The object returned should match the schema of the single view.

```javascript
module.exports = (logger, singleViewData) => {
  const { UNIQUE_ID, NAME } = singleViewData

  return {
    myId: UNIQUE_ID,
    name: NAME,
  }
}
```
