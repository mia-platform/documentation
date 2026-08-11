---
id: mongodb
title: MongoDB
sidebar_label: MongoDB
---

Fast Data v2 uses [MongoDB](https://www.mongodb.com/) as its primary storage layer. Depending on the workload, MongoDB is used as a CDC source, an intermediate aggregation state store, a final output sink, or a stateful processing cache. This page is the central reference for MongoDB roles, connection configuration, index requirements, and operational guidance within Fast Data v2.

:::tip New to MongoDB?
If you are not yet familiar with MongoDB, the [MongoDB introduction](https://www.mongodb.com/docs/manual/introduction/) is a good starting point. In short: MongoDB is a document-oriented database where data is stored in flexible, JSON-like documents grouped into collections, inside databases.
:::

## Overview

Each Fast Data v2 workload uses MongoDB in a different way:

| Workload | MongoDB role | Direction |
|---|---|---|
| [Mongezium](/products/fast_data_v2/mongezium_cdc/10_Overview.md) | CDC **source** — captures change events from MongoDB collections and produces them onto Kafka topics | Reads from MongoDB |
| [Farm Data](/products/fast_data_v2/farm_data/10_Overview.md) | Aggregation **persistence** — stores intermediate aggregated documents used for stateful processing | Reads and writes |
| [Kango](/products/fast_data_v2/kango/10_Overview.md) | Output **sink** — persists Kafka records into MongoDB collections as the final destination | Writes to MongoDB |
| [Stream Processor](/products/fast_data_v2/stream_processor/10_Overview.md) | Optional stateful **cache** — stores processing state to enable stateful transformations across events | Reads and writes |

## Connections Configuration

All Fast Data v2 services that connect to MongoDB expose a `connections` map in their `config.json` for centralizing connection details. A MongoDB connection entry looks like this:

```json
{
  "connections": {
    "mongodb": {
      "type": "mongodb",
      "config": {
        "url": "<mongodb_connection_string>"
      }
    }
  }
}
```

The connection name (here `"mongodb"`) is referenced from the persistence or cache configuration.

The `url` field — and other connection properties — support [**secret resolution**](/products/fast_data_v2/secrets_resolution.md), so you can inject credentials at runtime without storing sensitive data in plain text:

```json
{
  "connections": {
    "mongodb": {
      "type": "mongodb",
      "config": {
        "url": {
          "type": "env",
          "key": "MONGODB_CONNECTION_STRING"
        }
      }
    }
  }
}
```

:::note
The `appName` field is optional but recommended. It sets the application name reported to MongoDB in connection metadata, which helps identify which Fast Data workload is performing queries when inspecting Atlas metrics, `currentOp`, or slow query logs.
:::

## Farm Data — Aggregation Persistence

Farm Data uses MongoDB as its stateful persistence backend. The service stores intermediate aggregated documents in MongoDB between processing steps, enabling it to incrementally build the final output even when source events arrive out of order or from different streams.

### How Farm Data uses MongoDB

For each aggregation node defined in the aggregation graph, Farm Data automatically creates and manages a dedicated MongoDB collection named:

```text
__sink_<aggregation_id>_<aggregation_node_name>
```

Where:

- `__sink` is a constant prefix that signals the collection is used internally by Farm Data;
- `<aggregation_id>` is the value of the `id` configuration field identifying the aggregation process. This identifier **must be between 8 and 16 characters** and must comply with MongoDB [collection name restrictions](https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-Restriction-on-Collection-Names);
- `<aggregation_node_name>` is the name of a node in the aggregation graph.

### Required Indexes

To support the read/write operations Farm Data performs on `__sink` collections, each collection must have the following indexes:

1. **Unique index on the internal primary key:**
    ```json
    { "__pk": 1 }
    ```
    This is a unique index supporting the internal primary key of the record.

2. **Index on each `value` property** of the aggregation node (used for lookup by child nodes in the graph):
    ```json
    { "value.userId": 1 }
    ```
    One index is needed per relevant `value.*` property.

3. **Index on each `dependency.*.__pk` property** of the aggregation node (used for lookups from current towards children nodes):
    ```json
    { "dependency.posts.__pk": 1 }
    ```
    One index is needed per dependency relationship.

### IOPS Requirements

Farm Data relies heavily on MongoDB's I/O capacity because it continuously reads and writes intermediate aggregated state. It is highly recommended to provision a MongoDB cluster capable of sustaining high I/O load:

- **Minimum**: 2400 IOPS (1200 read + 1200 write) — corresponds roughly to a MongoDB Atlas M30 instance
- **Recommended**: higher IOPS values directly improve Farm Data throughput

:::warning
Under-provisioning MongoDB IOPS is the most common cause of poor Farm Data performance. The service will not error — it will simply slow down proportionally to I/O saturation.
:::

### Configuration Example

```json
{
  "persistence": {
    "type": "mongo",
    "config": {
      "url": "mongodb://localhost:27017/farm-data",
      "database": "farm-data",
      "appName": "eu.miaplatfor.farm-data.lakes"
    }
  }
}
```

For full persistence configuration details, see [Farm Data Configuration — Persistence](/products/fast_data_v2/farm_data/20_Configuration.mdx#persistence).

## Kango — Output Sink

Kango reads Kafka records and persists them into MongoDB collections. It acts as the final persistence step of a Fast Data pipeline, writing processed and aggregated data into the operational data store.

### Write Modes

Kango supports two write modes that control how documents are inserted or updated when a record for the same key already exists:

| Mode | Behavior |
|---|---|
| `strict` *(default)* | Only fields from the `after` payload are **retained**. Insert operations act as _replace_ (unknown fields are discarded). Update operations _unset_ fields that existed in `before` but are absent from `after`. |
| `partial` | Fields from the `after` payload are **merged** onto the stored document. Insert operations act as _upserts_; updates apply only the changed fields. |

### Required Indexes

Kango requires a **unique index on all message key fields** for each target collection. This ensures document uniqueness — Kango uses this index to identify and upsert documents by their natural key.

For example, if the message key is `{ "customerId": "123" }`, the target collection must have:

```json
{ "customerId": 1 }
```

as a unique index.

:::note
The unique index must cover all fields present in the Kafka message key, not just a subset.
:::

For full configuration details, see [Kango Configuration](/products/fast_data_v2/kango/20_Configuration.mdx).

## Stream Processor — Stateful Cache

Stream Processor can optionally connect to MongoDB to enable stateful stream processing. When a MongoDB cache is configured, the processing function can store and retrieve per-key state across different events, enabling use cases like deduplication, aggregation, enrichment with persistent state, and event correlation.

### Full CRUD with Optimistic Locking

The MongoDB cache type supports all four operations:

| Operation | Description |
|---|---|
| `get(key)` | Retrieves the value and version associated with the key. Returns `undefined` if not found. |
| `set(key, value)` | Creates a new cache entry. Throws `AlreadyExists` if the key already exists. |
| `update(key, value, version)` | Updates an existing entry using optimistic locking. Throws `NotFound` if absent; `ConcurrentModification` if the version doesn't match. |
| `delete(key)` | Removes the key and its value. Returns `undefined` if not found. |

The `version` field returned by `get` must be passed to `update` to prevent concurrent modification issues when multiple instances process events in parallel.

### Required Collection Setup

Before using the MongoDB cache, the target collection must exist. No automatic index creation is performed by Stream Processor — ensure the collection is pre-created with appropriate indexes for your access patterns.

### Configuration Example

```json
{
  "caches": {
    "customer-cache": {
      "type": "mongodb",
      "url": "mongodb://localhost:27017/fast-data",
      "appName": "eu.miaplatform.fastdata.stream-processor",
      "database": "fast-data",
      "collection": "stream-processor-state"
    }
  }
}
```

For full cache configuration details, see [Stream Processor Configuration — Caches](/products/fast_data_v2/stream_processor/20_Configuration.mdx#caches-configuration-optional).

## Mongezium — CDC Source

Mongezium uses MongoDB as its data source. It listens to MongoDB [change streams](https://www.mongodb.com/docs/manual/changeStreams/) to capture every insert, update, and delete on configured collections, and publishes those change events as Fast Data messages onto Kafka topics.

### Replica-Set Requirement

MongoDB change streams require MongoDB to be running in **replica-set mode**. Standalone MongoDB instances are not supported.

:::warning
If your MongoDB deployment is not in a replica-set, Mongezium cannot operate. This applies even in development environments — you can use a single-node replica-set.
:::

### Required Privileges

The MongoDB connection string used by Mongezium must grant:

- Read access to the `oplog.rs` collection (to track change stream position via resume tokens)
- Read access to the `admin` database
- Permission to enable `changeStreamPreAndPostImages` on collections of the configured database

### Resume Tokens

Mongezium uses [resume tokens](https://www.mongodb.com/docs/manual/changeStreams/#resume-tokens) to track its position in the change stream. The resume token of the last processed message is stored in the Kafka message header. At startup, Mongezium reads the latest Kafka message and resumes the change stream from that token.

If the `oplog.rs` collection has been truncated and the resume token is no longer valid, Mongezium will open a new change stream from the current position (without performing a snapshot). To force a new snapshot in this situation, set the collection's `snapshot` field to `when_needed`.

### Configuration Example (connections property)

```json
{
  "connections": {
    "mongodb": {
      "type": "mongodb",
      "config": {
        "url": {
          "type": "env",
          "key": "MONGODB_CONNECTION_STRING"
        }
      }
    }
  }
}
```

:::warning
Defining MongoDB connection details directly in their respective configuration sections (rather than in the `connections` property) is **deprecated** for both Mongezium and Kango. Future versions will exclusively support the `connections` property. Migrate your configuration when upgrading to Mongezium ≥ v0.4.3 or Kango ≥ v0.5.2.
:::

For full configuration details, see [Mongezium Configuration](/products/fast_data_v2/mongezium_cdc/20_Configuration.mdx).
