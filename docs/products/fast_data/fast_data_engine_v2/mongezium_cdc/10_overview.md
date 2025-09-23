---
id: overview
title: Mongezium CDC Overview
sidebar_label: Mongezium CDC
---



__Mongezium__ is a CDC (Change Data Capture) application from MongoDB to Kafka.
It can be used to track changes in a set of MongoDB collection and broadcast events to 
downstream consumers.

Common use cases for this application include:

- **Data Replication**: Clone and/or Import/Export of a MongoDB collection.
- **Event Sourcing**: Capture changes in a MongoDB collection and push them to a Kafka topic.
- **Aggregation**: Prepare collection documents for aggregation with other data sources.

Internally Mongezium uses MongoDB change streams to listen for changes in the collections and
maps MongoDB events into schemaless [Debezium-like messages](https://debezium.io/documentation/reference/stable/connectors/mongodb.html#mongodb-events).

Mongezium recognize 4 different types of events:

- **create** as `c`: corresponding to MongoDB [`create` event](https://www.mongodb.com/docs/manual/reference/change-events/create/)
- **read** as `r`: corresponding to MongoDB [`replace` event](https://www.mongodb.com/docs/manual/reference/change-events/replace/) or to an **initial snapshot**
- **update** as `u`: corresponding to MongoDB [`update` event](https://www.mongodb.com/docs/manual/reference/change-events/update/)
- **delete** as `d`: corresponding to MongoDB [`delete` event](https://www.mongodb.com/docs/manual/reference/change-events/delete/)

Mongezium can be configured with different startup behaviors, such as performing always an initial snapshot
on startup, or resuming the change stream from the last known resume token.

Mongezium stores its state (Mongodb collection `oplog.rs`) in the production output topic using Kafka headers.
