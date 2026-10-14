---
id: fast_data_engine
title: Fast Data Engine
sidebar_label: Fast Data Engine
---

Fast Data v2 introduces four specialized workloads that form the **Fast Data Engine v2** - a new generation of components designed to replace and significantly outperform Fast Data v1.

Each workload focuses on a specific aspect of the data pipeline, providing unprecedented performance, more architectural flexibility, and ease of configuration compared to Fast Data v1 components.

![Fast Data Engine v2](img/fast-data-engine-v2.png)

### Mongezium - MongoDB to Kafka CDC Connector

Mongezium provides real-time data streaming from MongoDB collections to Kafka topics using MongoDB change streams. With Debezium-compatible message formats and robust resume token support, it ensures seamless integration with existing event-driven architectures.

**Key Capabilities:**

- Real-time change data capture with minimal latency
- Automatic recovery with resume tokens
- Full collection snapshots when needed

[**Learn More →**](/products/fast_data_v2/mongezium_cdc/10_Overview.md)

### Stream Processor - Data Transformation Service

Stream Processor enables powerful, real-time data transformation with enterprise-grade performance. Unlike the rigid environment variable-based configurations of traditional components, it provides a secure JavaScript sandbox for implementing custom processing logic with maximum flexibility, ensuring the core service remains protected. This approach guarantees **safe execution of user-defined code**, shields against malicious scripts, isolates failures, and preserves overall system stability.

**Key Capabilities:**

- Custom JavaScript-based message processing
- Secure sandboxed execution environment
- Advanced filtering, mapping, and validation logic for data stream transformation
- Caching capabilities to enable stateful transformation logics

[**Learn More →**](/products/fast_data_v2/stream_processor/10_Overview.md)

### Farm Data - Real-time Multi-Stream Data Aggregation Engine

Farm Data powers the core logic for building data products (most notably, real-time Single Views) by aggregating multiple data streams.
The complex strategies and aggregation logics previously configured across SVTG and SVC are now **centralized and simplified** in a single component, delivering **up to 10x performance improvement** in aggregation operations. This eliminates the complexity of managing multiple components while dramatically reducing initial load times and enabling true real-time processing at enterprise scale.

**Key Capabilities:**

- Aggregation of multiple data streams with persistent state
- Configurable entity relationship diagrams
- High-performance processing at scale with minimal latency
- Real-time generation of Single Views

[**Learn More →**](/products/fast_data_v2/farm_data/10_Overview.md)

### Kango - Kafka to MongoDB Persistor

Kango (Kafka to Mongo) enables reliable data persistence from Kafka streams to MongoDB collections. Along the pipeline, it can act as the final stage in event-driven architecture, for data product persistence, or as a strategic checkpoint to sink on the database a specific data stream.

**Key Capabilities:**

- High-throughput Kafka-to-MongoDB persistence
- Support for different persistence strategies
- Flexible placement at any pipeline stage

[**Learn More →**](/products/fast_data_v2/kango/10_Overview.md)

## What Makes Fast Data v2 Better

Beyond individual workload capabilities, Fast Data v2 delivers **fundamental architectural improvements** that address the core limitations of traditional data processing approaches. These innovations provide measurable performance gains, enhanced security, and unprecedented flexibility in building modern data pipelines.

### Advanced Data Transformation

Traditional data casting and mapping operations are now significantly outperformed by Stream Processor, which provides unprecedented **security, reliability, and performance** in implementing transformation, mapping, filtering, and validation logic. Unlike the rigid environment variable-based configurations of traditional components, Stream Processor offers maximum flexibility through secure JavaScript sandbox execution, allowing you to implement exactly the logic your use case demands while maintaining enterprise-grade security and isolation.

### Centralized High-Performance Aggregation

The complex strategies and aggregation logics previously configured in SVTG and SVC components are now centralized and simplified by Farm Data Aggregation, delivering **up to 10x performance improvement** in aggregation operations. This eliminates the complexity of managing multiple components while dramatically reducing initial load times and enabling true real-time processing at enterprise scale.

### Separation of Concerns

Fast Data v2 introduces a better **decoupled architecture** that separates concerns into purpose-built components, each optimized for specific tasks. For example, Stream Processor handles all streaming and transformation logic, while Kango focuses exclusively on high-performance persistence. This architectural separation improves scalability and flexibility, enabling surgical modifications to pipelines without cascading changes across multiple components and/or pipeline steps.

This decoupling means you can now:

- Persist data at any point in your pipeline without rigid schemas or procedures
- Make targeted changes to specific pipeline steps without affecting the entire flow
- Scale individual components based on your specific performance requirements
- Adapt quickly to new business needs with minimal operational overhead
