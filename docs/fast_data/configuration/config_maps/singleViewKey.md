---
id: singleViewKey
title: Single View Key Configuration
sidebar_label: Single View Key
---

The Single View Key is a configuration file used by the Single View Creator part to identify the Single View document that needs to be updated (or if a new document must be created) as a consequence of an event that the service has consumed. 

## Overview 

The Single View Creator updates Single View documents every time a [Projection Changes document](/fast_data/configuration/realtime_updater.md) is received via Kafka or found in the MongoDB protection changes collection, depending on the service configuration. The content of the `identifier` property includes the list of fields and their values to be matched to the Single View document found.

In case the following Projection Changes document has been received:
```json
{
    "type": "sv_customer",
    "identifier": {
        "ID_USER": "123",
    },
    "changes": [{
        "state": "NEW",
        "topic": "my-topic.development.my-system.my-projection.ingestion",
        "partition": 0,
        "timestamp": "2021-11-19T16:22:07.031Z",
        "offset": "14",
        "key": {
            "ID_USER": "123",
        },
    }],
}
```
The Service understands that a projection with the identifier `ID_USER` with the value `123` must be updated by performing an aggregation because one or more values inside the Single View have been updated. However the Single View might have fields with different names, therefore a configuration to understand which field of the Single View should be compared with the `123` value to understand the document to update. This configuration is the Config Map named _Single View Key_.

The Single View Key can be a JavaScript file, which must be named `singleViewKey.js` and will perform customized logic to retrieve the document to update, or a JSON file named `singleViewKey.json` with a predefined structure to simplify the relationship between the fields of the Projection Changes and the Single View.

:::info
When a Single View Creator is created from Mia Marketplace it will automatically include a `singleViewKey.json` file. If you prefer to use a JavaScript function, that file should be deleted and a `singleViewKey.js` file must be created in its place.
:::

## Using a JavaScript function

The JavaScript file takes as input the identifier of the Projection change and returns the key object used to select the document of the Single View collection that needs to be updated. This key corresponds to the query object fed to MongoDB, therefore you can return any legal Mongo query.

In the example below, we expect to have the field `myId` as the primary key of the Single View collection.

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

While the file must be created in the Single View Creator page inside the _Microservices_ section, it can be modified inside the Single View page (selecting the tab `Single View Creators` and selecting the service that contains said file).

## Using a JSON definition

When creating a Single View Creator from the Mia Marketplace, a `singleViewKey.json` file will be automatically created. The aforementioned file can be modified right away or inside the Single View page (selecting the tab `Single View Creators` and selecting the service that contains said file).

An example of a defined JSON file is the following:

```json
{
  "version": "1.0.0",
  "config": {
    "sv_id": "ID_USER"
  }
}
```

where:

- `sv_id` is the name of the Single View field (ideally the primary key defined in the [Single View Data model page](/fast_data/configuration/single_views.md#single-view-data-model)) 
- `ID_USER` is the field name expected inside the Projection Changes document that triggers the update of the Single View. Most of the time this field will be the same name as the field inside the projection from which will start the aggregation of the Single View, but it might differ in case a [Projection Changes Schema](/fast_data/configuration/config_maps/projection_changes_schema.md) with customized names has been created.

:::info
It is possible to include more relationships between fields

```json
{
  "version": "1.0.0",
  "config": {
    "first_name": "FIRST_NAME",
    "last_name": "LAST_NAME"
  }
}
```
:::

## Using the No Code

Your project might be enabled to configure the Single View Key with the No Code feature included in the _Single View_ section. This feature allows the selection of the fields from the available fields defined in the Single View data model and the fields available from the Base Projection.

The feature is included in the _Single View_ section. After selecting the Single View and then the Single View Creator attached, the _Settings_ tab will contain a card that recaps the information regarding the current Single View Key configured.

![Recap of the configured Single View Key](../../img/no_code_single_view_key/single_view_key_card.png)

:::info
Before to configure the Single View Key, the [ER Schema](/fast_data/configuration/config_maps/erSchema.md) and the [Aggregation](/fast_data/configuration/config_maps/aggregation.md) must be configured as well.
:::

A click on the `Edit` button will open a modal that allows the user to add more relationships with the help of two fields:
- the first field, to the left, can be populated with one of the available fields defined in the Single View data model.
- the second field, to the right, can be populated with one of the available fields defined in the data model of the projection [defined as "Base Projection" in the Aggregation](/fast_data/configuration/config_maps/aggregation.md#selection-of-the-base-projection) or a custom value (in case the Projection Changes Schema includes customized names).

:::info
In case there's no Single View Key configured, a placeholder will inform the user that a new Single View Key must be created. A click on the attached button will automatically create an empty `singleViewKey.json` that will be automatically attached to the config maps of your Single View Creator.
:::

In this modal there's a toggle button, at the bottom left, that moves to the _Advanced Mode_ of the Single View Key. Here it is possible to manually modify the JSON of the Single View Key in case the user wants to review the content of the config map.

![Advanced Mode](../../img/no_code_single_view_key/single_view_key_advanced_mode.png)

### Review the JavaScript Single View Key with the No Code

The Single View Key configured as a JavaScript file can be also modified with the No Code feature active. The _Settings_ tab will contain the same card but with a different placeholder that informs that the Single View Key is, indeed, included in a JavaScript file. A click on the `Configure` button will open a modal that contains a Code Editor that will allow the user to review and modify the JavaScript file to its needs.
