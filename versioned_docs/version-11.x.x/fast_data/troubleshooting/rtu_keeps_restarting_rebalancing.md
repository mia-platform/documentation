---
id: rtu_keeps_restarting_rebalancing
title: The Real-Time Updater keeps restarting or rebalancing
sidebar_label: RTU restarting/rebalancing
---

## Problem

The Real-Time Updater begins to restart or rebalance in an infinite loop; Usually this happens when you have a peak of input data from the ingestion topics, like in an Initial Load case for example.

## Cause

**The Real-Time Updater keeps restarting:** If it keeps restarting itself it's because the [health routes](/getting-started/guidelines//microservice-vademecum.md#health-routes) are unreachable, meaning the service is too busy running strategies (CPU consumption too high).

**The Real-Time Updater keeps rebalancing:** If it keeps rebalancing without restarting it's because the strategies are taking too much time to complete (usually due to long waiting times between responses from MongoDB queries) and the consumer can't emit the hearbeat in time. This results in the Real-Time Updater's consumer being kicked out by the group coordinator, outputting and error similar to this: `kafkajs error: Group coordinator is not aware of this member`.

## Solution

Since the problem comes from the strategies' performance, the first solution we recommend is to  [optimize them](#how-do-i-optimize-my-strategies).

But you might be in the middle of a production incident and you don't have time for that, or optimizing the strategies is just not feasible for your specific case. 
In that case, here's a simple temporary solution:

1. Stop the strategy execution mechanism
2. Consume all the ingestion messages in queue
3. Manually generate the Projection Changes to trigger all the Single Views' regeneration
4. Let the Single View Creators regenerate all the Single Views' documents
5. Restore the normal Fast Data flow

### 1. Stop the strategy execution mechanism

To stop running the strategies you must disable the projections changes generation on the Real-Time Updaters (env var `PROJECTIONS_CHANGES_ENABLED=false`). This will apply the incoming updates (ingestion messages) on the Projections but won't trigger the Single Views' regeneration

### 2. Consume all the ingestion messages in queue

Wait for the Real-Time Updaters to consume all the ingestion messages in queue (if possible, scale up the Real-Time Updaters to do it faster). Once the consumer lag is at 0, make sure no more messages are consumed while performing the Single View regeneration. To do so, scale the Real-Time Updaters replicas down to 0. This will accumulate the incoming ingestion messages in their topics, so you can resume the consumption later. To verify the consumers' lag we recommend to use our Grafana dashboards for [Kafka Messages](/fast_data/monitoring/dashboards/kafka_messages.md) or [Real-Time Updaters](/fast_data/monitoring/dashboards/real_time_updater.md) (v7.5.5+).

### 3. Manually generate the Projection Changes to trigger all the Single Views' regeneration

Here you need to create a custom script that calculates the identifiers for each Single View document, maps them in the [Projection Change](/fast_data/inputs_and_outputs.md#projection-change) format and inserts them into your MongoDB. [Check out our example NodeJS script](#custom-script-example).

### 4. Let the Single View Creators regenerate all the Single Views' documents

After generating the Projection Changes, scale up (if possible) the Single View Creators so we can process all the Projection Changes faster.

### 5. Restore the normal Fast Data flow

Once all the Single Views have been regenerated, restore the Fast Data's normal flow. To do so you should:
1. Scale down the Single View Creators if you scaled them up before
2. Re-enable the Projections Changes generation on the Real-Time Updaters (env var `PROJECTIONS_CHANGES_ENABLED=true`)
3. Scale up the Real-Time Updaters to the normal replicas count

:::tip
You may have accumulated a great amount of messages in the ingestion topics during this process, so you may need to apply this solution again until normality is restored.
:::

## Useful resources

### Custom script example

This script creates the identifiers from the Single View's documents and inserts them on MongoDB in the Projection Change format. This script should be enough to be used in simple use cases by just changing `myId` with your identifier.

```javascript
const { MongoClient } = require('mongodb')

const MONGODB_URL = 'mongo-url'
const PROJECTION_COLLECTION = 'pr-collection'
const PROJECTION_CHANGES_COLLECTION = 'pc-collection'
const SINGLE_VIEW_NAME = 'sv-name'

async function main() {
  const client = new MongoClient(MONGODB_URL)
  await client.connect()

  const prCollection = client.db().collection(PROJECTION_COLLECTION)
  const pcCollection = client.db().collection(PROJECTION_CHANGES_COLLECTION)

  // get the projections' documents' cursor
  const cursor = prCollection.find({})

  // for each document
  while (cursor.hasNext()) {
    // create the identifier object
    const doc = await cursor.next()
    const identifier = {
      myId: doc.myId // Change this!
    }

    // map the identifier to the projection change object
    const projectionChange = {
      identifier,
      type: SINGLE_VIEW_NAME,
      changes: [{ state: "NEW" }]
    }

    // insert the projection change
    await pcCollection.updateOne({
      type: SINGLE_VIEW_NAME,
      identifier,
    }, { $set: projectionChange }, { upsert: true })  }

  await client.close()
}

main()
```

### How do I optimize my strategies

**Low Code strategies**:
- Make sure you create an index for each foreign key defined in you ER Schema. You'll also want to add the `__STATE__` field in those indexes so you'll need to create [Compound Indexes](https://www.mongodb.com/docs/manual/core/index-compound/).
- Try to reduce the number of steps in the paths of the Projections Changes Schema

**Custom strategies' functions**:
- Try to improve the overall performance of the function, like reducing the number of queries to MongoDB or creating an index for every field you use in the MongoDB queries
