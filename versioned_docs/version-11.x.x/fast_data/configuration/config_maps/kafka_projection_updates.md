---
id: kafka_projection_updates
title: Kafka Projection Updates Configuration
sidebar_label: Kafka Projection Updates
---

## Overview

The Kafka Projection Updates is a JSON file which describes for each projection a [Projection Updates](/fast_data/inputs_and_outputs.md#projection-update) topic and a [Strategy](/fast_data/configuration/strategies.md) to generate the projection changes identifier. This file is typically used by the [Real-Time Updater](/fast_data/realtime_updater.md) and the [Single View Trigger Generator](/fast_data/single_view_trigger_generator.md) to send the Projection Updates message to te right topic and apply the right Strategy.

## Configuration Properties

The Kafka Projection Updates is made of the following fields:

- `PROJECTION_NAME`: Name of the collection of the projection
- `updatesTopic`: The topic where the Projection Updates messages are sent, if you haven't created a topic for the projection yet take a look to our [naming conventions for the Projection Updates topics](/fast_data/inputs_and_outputs.md#topic-naming-convention-1).
- `strategy`: Strategy you want to use onto this projection. You can choose between `__automatic__` and `__fromFile__`


<details><summary>Projection Updates Configuration</summary>

<p>

```json title="kafkaProjectionUpdates.json"
{
  "PROJECTION_NAME": {
    "updatesTopic": "PROJECTION_UPDATE_TOPIC",
    "strategy": "STRATEGY"
  }
}
```

</p>
</details>

There will be different behaviors based on the strategy value:
- `__automatic__`: The automatic strategy handles the generation of the projection changes identifier automatically. This is the preferred method and in most cases it will be enough for your Strategy executions.
- `__fromFile__`: This lets you specify a Javascript file path which will execute the a custom Strategy on the Projection Updates message and return an array of projection change identifiers. This is the most customizable option and should only be used when the `__automatic__` Strategy is not enough for your case. This strategy expects a path to a Javascript file, like so `__fromFile__[CUSTOM_STRATEGY.js]`. 

  This Javascript file should export a default async generator function with the following parameters:

  - `strategyContext`: Strategy context object composed of two properties:
    - `logger`: [Pino](https://github.com/pinojs/pino) logger to print out useful service logs
    - `dbMongo`: the configured [MongoDB Database](https://mongodb.github.io/node-mongodb-native/5.2/classes/Db.html) instance where the projections are stored
  - `updateEvent`: The [Projection Updates](/fast_data/inputs_and_outputs.md#projection-update) message.

  Here's an example of what that file could look like (let's say our `CUSTOM_STRATEGY` is called `myCustomStrategy`):

  <details><summary>Custom Strategy</summary>

  <p>

  ```js
  // note: this has to be an AsyncGenerator
  module.exports = async function* myCustomStrategy ({ logger, dbMongo }, updateEvent) {
    yield { IDENTIFIER_FIELD: updateEvent.after.FIELD }
  }
  ```

  </p>
  </details>
