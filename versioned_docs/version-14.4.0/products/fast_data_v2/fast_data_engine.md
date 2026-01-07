---
id: fast_data_engine
title: Fast Data Engine
sidebar_label: Fast Data Engine
---

## The Power Behind Fast Data v2

Fast Data v2 introduces four workloads designed to replace and significantly outperform traditional components like Real-Time Updater (RTU), Projection Storer (PS), Single View Trigger Generator (SVTG), and Single View Creator (SVC).

![Fast Data Engine v2](img/fast-data-engine-v2.png)

### Mongezium - MongoDB to Kafka CDC Connector

Mongezium provides real-time data streaming from MongoDB collections to Kafka topics using MongoDB change streams.
With Debezium-compatible message formats and robust resume token support, it ensures seamless integration with existing event-driven architectures.

**Key Capabilities:**

- Real-time change data capture with minimal latency
- Automatic recovery with resume tokens
- Full collection snapshots when needed

[**Learn More →**](/products/fast_data_v2/mongezium_cdc/10_Overview.md)

### Stream Processor - Data transformation service

Stream Processor enables powerful, real-time data transformation with enterprise-grade performance. It provides a secure JavaScript sandbox for safely testing custom processing logic, ensuring the core service remains protected. This approach guarantees safe execution of user-defined code, shields against malicious scripts, isolates failures, and preserves overall system stability.

**Key Capabilities:**

- Custom JavaScript-based message processing
- Secure sandboxed execution environment
- Advanced filtering, mapping, and validation logic for data stream transformation
- Caching capabilities to enable stateful transformation logics

[**Learn More →**](/products/fast_data_v2/stream_processor/10_Overview.md)

### Farm Data - Real-time Multi-Stream Data Aggregation Engine

Farm Data powers the core logic for building data products (most notably, real-time Single Views) by aggregating multiple data streams.
With persistent state management and optimized matching algorithms, it forms the foundation for scalable, real-time data aggregation.

**Key Capabilities:**

- Aggregation of multiple data streams with persistent state
- Configurable entity relationship diagrams
- High-performance processing at scale with minimal latency
- Real-time generation of Single Views

[**Learn More →**](/products/fast_data_v2/farm_data/10_Overview.md)

### Kango - Kafka to MongoDB persistor

Kango (_Kafka to Mongo_) enables reliable data persistence from Kafka streams to MongoDB collections.
Along the pipeline, it can act as the final stage in event-driven architecture, for data product persistence, or as a strategic checkpoint to sink on the database a specific data stream.

**Key Capabilities:**

- High-throughput Kafka-to-MongoDB persistence
- Support different strategies for event persistence

[**Learn More →**](/products/fast_data_v2/kango/10_Overview.md)
