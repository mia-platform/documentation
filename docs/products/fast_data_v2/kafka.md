---
id: kafka
title: Kafka
sidebar_label: Kafka
---

Fast Data v2 uses [Apache Kafka](https://kafka.apache.org/) as its streaming backbone. All workloads — [Mongezium][mongezium], [Stream Processor][stream-processor], [Farm Data][farm-data], and [Kango][kango] — communicate through Kafka topics. This page is the central reference for Kafka concepts and cross-service configuration guidance within Fast Data v2.

:::tip New to Kafka?

If you are not familiar with Kafka, the [Apache Kafka introduction](https://kafka.apache.org/intro) is a good starting point. In short: Kafka is a distributed event-streaming platform where services exchange messages through durable, replayable channels called _topics_.

:::

## Overview

Each Fast Data v2 workload plays a distinct role in the pipeline:

| Workload                             | Reads from Kafka                                 | Writes to Kafka                         |
| ------------------------------------ | ------------------------------------------------ | --------------------------------------- |
| [Mongezium][mongezium]               | —                                                | Produces CDC change events onto topics  |
| [Stream Processor][stream-processor] | ✓ One input topic                                | ✓ One output topic                      |
| [Farm Data][farm-data]               | ✓ Multiple input topics + internal updates topic | ✓ Output topic + internal updates topic |
| [Kango][kango]                       | ✓ Input topic                                    | —                                       |

Kafka topics act as durable, replayable buffers that decouple producers from consumers, allowing pipeline components to be deployed, scaled, and upgraded independently.

## Topics

Before deploying any Fast Data v2 workload, all Kafka topics it reads from or writes to **must already exist**. Auto-creation of topics is disabled across all workloads to enforce intentional configuration.

:::warning

All Fast Data v2 workloads have `allow.auto.create.topics` hardcoded to `"false"`. Topics must be created with the proper configuration before starting the services.

:::

Each topic must be configured with:

- **Partitions**: The number of partitions directly constrains the maximum number of service replicas that can process in parallel. Each partition is consumed by at most one consumer within the same consumer group. Plan your partition count based on the desired degree of parallelism.
- **Retention**: Set a retention policy that covers your expected reprocessing or replay window. For CDC pipelines, ensure retention is long enough to survive planned infrastructure downtime without data loss.
- **Replication factor**: Set a replication factor ≥ 2 for fault tolerance in production environments.

### Internal Updates Topic (Farm Data)

Farm Data requires a dedicated internal updates topic in addition to its regular input and output topics. This topic is used for internal coordination within the aggregation pipeline and requires a specific consumer configuration distinct from the regular input consumers. See [Farm Data Configuration — Internal Updates](/products/fast_data_v2/farm_data/20_Configuration.mdx#internal-updates) for details, and [Consumer Queue Tuning](#consumer-queue-tuning) below for the recommended configuration values.

## Connections Configuration

All Fast Data v2 services expose a `connections` map in their `config.json` for centralizing Kafka connection details. A Kafka connection entry looks like this:

```json
{
  "connections": {
    "kafka": {
      "type": "kafka",
      "config": {
        "url": "<kafka_broker_url>"
      }
    }
  }
}
```

The connection name (here `"kafka"`) is referenced by consumer and producer configurations via the `connectionName` field.

The `url` field — and other connection properties — support [**secret resolution**](/products/fast_data_v2/secrets_resolution.md), so you can inject credentials at runtime without storing sensitive data in plain text:

```json
{
  "connections": {
    "kafka": {
      "type": "kafka",
      "config": {
        "url": {
          "type": "env",
          "key": "KAFKA_CONNECTION_STRING"
        }
      }
    }
  }
}
```

Additional connection-level properties follow the [librdkafka configuration][librdkafka] format.

## Consumer Configuration

### Required Properties

| Property    | Required | Description                                                                                                    |
| ----------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `group.id`  | Yes      | Consumer group identifier. Consumers sharing the same `group.id` divide the topic partitions among themselves. |
| `client.id` | No       | Unique identifier for this consumer instance. Recommended for observability and diagnostics.                   |

:::info Consumer Groups

Different `group.id` values create independent consumer groups, each processing the full topic independently. This allows the same stream to be consumed by multiple services simultaneously (e.g. different aggregation pipelines reading the same source topic).

Be aware that each additional consumer group requires its own internal fetch queue, which increases memory usage. Adjust your service's memory requests and limits accordingly.

:::

### Offset Management

| Property             | Default             | Description                                                                                                                                                               |
| -------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auto.offset.reset`  | `earliest`          | Behavior when no committed offset exists for the consumer group. `earliest` starts from the oldest available message; `latest` starts from newly arriving messages only.  |
| `commitIntervalMs`   | `500ms`             | Interval between manual offset commits (Fast Data v2-specific field). Minimum is `0`. When changing this value, keep it consistent across all consumers within a service. |
| `enable.auto.commit` | `false` (hardcoded) | All Fast Data v2 workloads manage offset commits internally. This property cannot be overridden.                                                                          |

### Consumer Queue Tuning

When configuring Kafka consumers, it is recommended to set appropriate values for
constraining the consumer internal queue. In this manner:

- the maximum amount of memory employed by the service can be finely tuned to avoid
  wasting resources, since only the number of messages that can effectively be
  processed in real-time should be pulled in memory;
- it is ensured that consumer continuously poll the broker to avoid it exiting the
  consumer group, since a lower number of buffered messages can trigger a new fetch to
  replenish it.

The following [librdkafka][librdkafka] properties control how many messages each consumer prefetches into local memory. Tuning them is important to avoid out-of-memory issues and consumer group evictions.

| Property                     | Description                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| `queued.max.messages.kbytes` | Maximum kilobytes of pre-fetched messages in the local consumer queue.                                  |
| `queued.min.messages`        | Minimum number of messages per topic+partition that [librdkafka][librdkafka] tries to maintain locally. |

Setting these values too high wastes memory. Setting them too low risks the consumer being evicted from its consumer group if polling does not happen frequently enough within `max.poll.interval.ms` (default: 5 minutes).

When a consumer instance is evicted from its consumer group, it may not have the chance to commit the work it has already carried out. Setting the proper 
values is fundamental for service stability and message-processing progress.

To determine appropriate values, observe the following metrics:

- `kafka_consumer_rx_msgs_total` → messages read per unit of time
- `ka_flushed_messages` → messages written to the persistence layer

Then set `queued.min.messages` slightly above the observed average consumption rate.

Another important property that might need to be tuned is `fetch.message.max.bytes`,
which however should be changed only in case `queued.max.messages.kbytes` is set to
a value lower than `1024`.

#### Recommended consumer configurations by service

| Service                              | Consumer                   | `queued.min.messages` | `queued.max.messages.kbytes` | `fetch.message.max.bytes` |
| ------------------------------------ | -------------------------- | --------------------- | ---------------------------- | ------------------------- |
| [Farm Data][farm-data]               | Input topics (MongoDB M30) | `1000`                | `16384`                      | *(default)*               |
| [Farm Data][farm-data]               | Internal updates           | `160`                 | `96`                         | `40320`                   |
| [Kango][kango]                       | Input topic (MongoDB M50)  | `5000`                | `32840`                      | *(default)*               |
| [Stream Processor][stream-processor] | Input topic                | `5000`                | `32840`                      | *(default)*               |

:::note

`queued.max.messages.kbytes` uses **KB** as its unit, while `fetch.message.max.bytes` uses **bytes**. Adjust `fetch.message.max.bytes` only if `queued.max.messages.kbytes` is set below `1024`.

:::

## Producer Configuration

### Fixed Properties

The following producer properties are hardcoded across all Fast Data v2 workloads and cannot be overridden:

| Property                   | Value     | Reason                                                                                           |
| -------------------------- | --------- | ------------------------------------------------------------------------------------------------ |
| `allow.auto.create.topics` | `"false"` | Topics must be created manually with the correct partition, retention, and replication settings. |
| `enable.idempotence`       | `"true"`  | Prevents duplicate messages from being produced to the broker.                                   |
| `acks`                     | `"all"`   | Requires acknowledgement from all in-sync replicas before a write is considered successful.      |

### Compression

Farm Data compresses produced messages using the [`snappy`](https://en.wikipedia.org/wiki/Snappy_(compression)) algorithm by default, reducing disk space consumed on the Kafka broker. [Stream Processor][stream-processor] also supports setting `compression.type` in its producer configuration.

## Tombstone Events

Kafka supports _tombstone events_: messages with a non-null key but a `null` (0-byte) payload. In Fast Data v2:

- **Farm Data**: ignores tombstone events received on input topics. When processing a `delete` (`d`) operation, it produces a tombstone on the output topic (in the default Read-Delete output mode).
- **Kango**: receives tombstones and handles them according to its configured write mode.
- **Stream Processor**: receives tombstones as a `null` payload; the processing function can handle them explicitly.

See the [Fast Data Message Format](/products/fast_data_v2/concepts.mdx#fast-data-message-format) for the full event schema and operation types (`c`, `r`, `u`, `d`).

## Schema Registry

[Stream Processor][stream-processor] supports a `jsonWithSchema` deserialization strategy for payloads produced with a Kafka schema registry. In this mode, the actual message data is expected under a `payload` subkey. See [Stream Processor — Input Payload Deserialization](/products/fast_data_v2/stream_processor/30_Usage.md#input-payload-deserialization) for configuration details.


[mongezium]: /products/fast_data_v2/mongezium_cdc/10_Overview.md
[stream-processor]: /products/fast_data_v2/stream_processor/10_Overview.md
[farm-data]: /products/fast_data_v2/farm_data/10_Overview.md
[kango]: /products/fast_data_v2/kango/10_Overview.md

[librdkafka]: https://docs.confluent.io/platform/current/clients/librdkafka/html/md_CONFIGURATION.html