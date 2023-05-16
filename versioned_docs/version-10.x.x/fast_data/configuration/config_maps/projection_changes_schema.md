---
id: projection_changes_schema
title: Projection Changes Schema Configuration
sidebar_label: Projection Changes Schema
---

## Overview

The Projection Changes Schema is a JSON file (`projectionChangesSchema.json`) which helps the [strategy](/fast_data/the_basics.md#strategies) to find the right path from the [initial projection](/fast_data/glossary.mdx)
to the [base projection](/fast_data/glossary.mdx) and then to the identifier used to match the single view document. This file is typically used
by the [Real Time Updater](/fast_data/realtime_updater.md) or the [Single View Trigger Generator](/fast_data/single_view_trigger_generator.md) to execute the strategies.

## Syntax

The Projection Changes Schema is made of the following fields

```json title="projectionChangesSchema.json"
{
  "version": "N.N.N",
  "config": {
    "SINGLE_VIEW_NAME": {
      "paths": [
        {
          "path": [ "<PROJECTION_2>", "<PROJECTION_1>", "<BASE_PROJECTION>"],
          "identifier": {
            "<IDENTIFIER_FIELD>": "<BASE_PROJECTION_FIELD>"
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

An example of a configuration can be:

```json title="projectionChangesSchema.json"
{
  "version": "1.0.0",
  "config": {
    "sv_books": {
      "paths": [
        {
          "path": [ "pr_libraries", "pr_book_libraries", "pr_books"],
          "identifier": {
            "bookID": "ID_BOOK"
          }
        }
      ]
    }
  }
}
```

In some cases you may want a finer control over the creation of the projection changes identifier. Such control can be achieved within service configuration providing a _custom function_,
which is applied to each document retrieved by the last step of the strategy path (in this case records extracted from `BASE_PROJECTION` collection).
The custom function file can be loaded as a config map of the service, while in the `projectionChangesSchema` configuration file
each path that requires using a custom function should specify as identifier the `__fromFile__[<filename>]` keyword,
where within squared brackets is provided the filename containing the custom function. Here's an example: 

```json title="projectionChangesSchema.json"
{
  "version": "N.N.N",
  "config": {
    "SINGLE_VIEW_NAME": {
      "paths": [
        {
          "path": [ "PROJECTION_2", "PROJECTION_1", "BASE_PROJECTION"],
          "identifier": "__fromFile__[myCustomFunction.js]"
        }
      ]
    }
  }
}
```

As you can see, in this example we're referencing a file called `myCustomFunction.js`. This file needs to a be a Javascript file exporting a default async generator function with the following parameters:

- `strategyContext`: strategy context object composed of two properties:
  - `logger`: [Pino](https://github.com/pinojs/pino) logger to print out useful service logs
  - `dbMongo`: the configured [MongoDB Database](https://mongodb.github.io/node-mongodb-native/5.2/classes/Db.html) instance where the projections are stored
- `document`: the document of the *base projection* found by the strategy up to this point

Here's an example of what that file containing the custom function could look like:

```js title="myCustomFunction.js"
// note: this has to be an AsyncGenerator
module.exports = async function* myCustomFunction ({ logger, dbMongo }, document) {
  const query = { SOME_FIELD: document.SOME_FIELD }
  const documentFound = await dbMongo.collection('SOME_COLLECTION').findOne(query)
  
  yield {
    IDENTIFIER_FIELD_1: documentFound.FIELD_1,
    IDENTIFIER_FIELD_2: documentFound.FIELD_2
  }
}
```
