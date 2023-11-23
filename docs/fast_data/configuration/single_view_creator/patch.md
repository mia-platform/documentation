---
id: patch
title: Single View Patch
sidebar_label: Patch
---

# Single View Patch

:::info
This feature is supported from version `5.6.1` of the Single View Creator
:::

To configure a Single View Creator dedicated to [Single View Patch](/fast_data/configuration/single_views.md#single-view-patch) operations, some steps have to be followed:

* Set the env var `KAFKA_PROJECTION_UPDATE_TOPICS` with the comma separated list of the `pr-update` topics corresponding to the SV-Patch Projection.
* Configure the service to consume from Kafka (see the [Consuming from Kafka](/fast_data/configuration/single_view_creator/index.md#consuming-from-kafka) section)
* Set the env var `SV_TRIGGER_HANDLER_CUSTOM_CONFIG` with the path to the main file defining SV-Patches actions, for example `/home/node/app/svTriggerHandlerCustomConfig/svTriggerHandlerCustomConfig.json`
* Create a new ConfigMap with this Runtime Mount Path: `/home/node/app/svTriggerHandlerCustomConfig`

This last config map is composed by a main file, `svTriggerHandlerCustomConfig.json`, which defines where to read the Patch Action for each Projection.

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
    }
    // You can define more than one patch action for each projection too!
  ]
}
```

In the same config map, we have to insert the other files that are defined in the `patchRules` of the `svTriggerHandlerCustomConfig.json` (in the above example `customPatchForA.js` and `customPatchForB.js`).

They are structured as following:

```javascript
'use strict'

module.exports = (logger, projection) => {
  logger.info('Function custom patch for projection A')
  return {
    filter: { 'sv-field': projection['projection-field'] },
    update: { $set: { 'field-0': projection['changed-field'] } },
  }
}
```

Basically we can define any update operation we want. This operation will be performed on all the Single Views matching the filter.

## Filtering which elements to update inside arrays

If the update must happen inside an array, you'll probably need to filter which elements need to be updated. To do that you can use the `arrayFilters` option inside the `patchAction` Javascript file, which behaves exactly like the [`arrayFilters`](https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/#---identifier--) option in a MongoDB operation.

Example of its usage:

```javascript
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
