---
id: patch
title: Single View Patch
sidebar_label: Patch
---

:::info
This feature is supported from version `5.6.1` of the Single View Creator
:::

## Pre Requisites
To configure a Single View Creator dedicated to [Single View Patch](/fast_data/configuration/single_views.md#single-view-patch) operations, some steps have to be followed:

* Set the env var `KAFKA_PROJECTION_UPDATE_TOPICS` with the comma separated list of the `pr-update` topics corresponding to the SV-Patch Projection.
* Configure the service to consume from Kafka (see the [Consuming from Kafka](/fast_data/configuration/single_view_creator/index.md#consuming-from-kafka) section)
* Create a new ConfigMap with this Runtime Mount Path: `/home/node/app/svTriggerHandlerCustomConfig`
* Set the env var `SV_TRIGGER_HANDLER_CUSTOM_CONFIG` with the path to the main file defining SV-Patches actions, for example `/home/node/app/svTriggerHandlerCustomConfig/svTriggerHandlerCustomConfig.json`


## Main Configuration

The main file, usually referred to as `svTriggerHandlerCustomConfig.json`, assign to each Projection one or more Patch Actions.

It is structured as following: 

```json
{
  "patchRules": [
    {
      "projection": "projection_A",
      "patchAction": "__fromFile__[customPatchForA.js]"
    },
    {
      "projection": "projection_B",
      "patchAction": "__fromFile__[customPatchForB.js]"
    },
    {
      "projection": "projection_B",
      "patchAction": "__fromFile__[secondCustomPatchForB.js]"
    }
  ]
}
```

## Patch Action

In the same config map, we can insert the other files that are defined in the `__fromFile__` directive of the `patchActions` field in the `patchRules` array from the `svTriggerHandlerCustomConfig.json` (in the above example, `customPatchForA.js` and `customPatchForB.js`).

They are structured as following:

```javascript title=customPatchForA.js
'use strict'

module.exports = (logger, projection) => {
  logger.info('Function custom patch for projection A')
  return {
    filter: { 'sv-field': projection['projection-field'] },
    update: { $set: { 'sv-field-to-update': projection['changed-field'] } },
  }
}
```

A Patch Action works as follows: the MongoDB `update` object will be applied to all single view records matching the MongoDB query defined in the `filter` object.

### Filtering which elements to update inside arrays

To patch fields of specific elements within an array, you can add the `arrayFilters` property inside the object returned by your patch action: this field behaves exactly like the [`arrayFilters`](https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/#---identifier--) option while using the positional operator `$[]`.

```javascript title=patchActionWithArrayFilters.js {12-14}
'use strict'

module.exports = (logger, projection) => {
  logger.info('Function custom patch for projection A')
  return {
    filter: { 'sv-field': 'someValue' }, // This can be an empty object if needed
    update: {
      $set: {
        "array-field.$[item-name].array-item-field": projection['changed-field']
      }
    },
    arrayFilters: [{
      "item-name.array-item-field-id": projection['projection-A-field-id']
    }]
  }
}
```
