---
id: projection_changes_schema
title: Projection Changes Schema Configuration
sidebar_label: Projection Changes Schema
---

## Overview

The Projection Changes Schema is a JSON file (`projectionChangesSchema.json`) which helps the strategy to find the right path from the *Initial projection*\* to the *Base projection*\*\* and then to the identifier used to match the single view document. This file is typically used by the [Real Time Updater](/fast_data/realtime_updater.md) or the [Single View Trigger Generator](/fast_data/single_view_trigger_generator.md) to execute the strategies.

## Syntax

The Projection Changes Schema is made of the following fields

```json title="projectionChangesSchema.json"
{
  "version": "N.N.N",
  "config": {
    "SINGLE_VIEW_NAME": {
      "paths": [
        {
          "path": [ "PROJECTION_2", "PROJECTION_1", "BASE_PROJECTION"],
          "identifier": {
            "IDENTIFIER_FIELD": "BASE_PROJECTION_FIELD"
          }
        }
      ]
    }
  }
}
```

* `version`: Current configuration version, which determines the syntax and semantics of the rest of the configuration. The following properties follow the `1.0.0` syntax version.
* `config`: The whole Projection Changes Schema config
* `SINGLE_VIEW_NAME`: The name of the single view we want to aggregate
* `paths`: An array of possible paths to generate an identifier capable to match a single view document
* `path`: An ordered array of projections for the strategy to reach the `BASE_PROJECTION`. For example if we receive an ingestion message on `PROJECTION_2` we know that in order to reach `BASE_PROJECTION` we must first look for all the documents of `PROJECTION_1` related to `PROJECTION_2` (the relationships are specified by the [ER Schema](/fast_data/configuration/config_maps/erSchema.md)).
* `identifier`: The projection changes identifier object that will be generated to match the single view document. Every key of the object will be a key of the identifier and every value of the object will be replaced with the `BASE_PROJECTION` documents found by the strategy

:::note
All the keys in uppercase are values that you must change depending on your data, while the keys in lowercase are keywords that should not be changed
:::

In some cases you may want a finer control on the creation of the projection changes identifier, for that you can use the `__fromFile__` function on the identifier property. Here's an example: 

```json title="projectionChangesSchema.json"
{
  "version": "N.N.N",
  "config": {
    "SINGLE_VIEW_NAME": {
      "paths": [
        {
          "path": [ "PROJECTION_2", "PROJECTION_1", "BASE_PROJECTION"],
          "identifier": "__fromFile__[CUSTOM_FUNCTION]"
        }
      ]
    }
  }
}
```

As you can see, in this example we're referencing a file called `CUSTOM_FUNCTION`. This file needs to a be a Javascript file exporting a default function with the following parameters:

- `logger`: [Pino](https://github.com/pinojs/pino) logger to print out on kubernetes logs
- `mongodbInstance`: Your [MongoDB Database](https://mongodb.github.io/node-mongodb-native/4.13/classes/Db.html) instance where the projections are stored
- `document`: The document of the *Base projection* \*\* found by the strategy

Here's an example of what that file could look like (let's say our `CUSTOM_FUNCTION` is called `myCustomFunction.js`):

```js title="myCustomFunction.js"
module.exports = async function myCustomFunction (logger, mongodbInstance, document) {
  const query = { SOME_FIELD: document.SOME_FIELD }
  const documentFound = await mongodbInstance.collection('SOME_COLLECTION').findOne(query)
  return [{
    IDENTIFIER_FIELD_1: documentFound.FIELD_1,
    IDENTIFIER_FIELD_2: documentFound.FIELD_2
  }]
}
```

---

\* The Initial projection is the projection modified by the ingestion message, ex. if we have an ingestion message that updates a  `pr_allergens` document, then our Initial projection will be `pr_allergens`.

\*\* The Base projection is the projection that correlates 1:1 to your single view, ex. if we have a single view for your users named `sv_registry`, the Base projection will most likely be a projection called `pr_registry`.
