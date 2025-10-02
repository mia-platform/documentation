---
id: overview
title: Fast Data Engine 2.0
sidebar_label: Fast Data Engine 2.0
---

:::warning
Fast Data Engine 2.0 will be available in production environment when Console v14.3.0 will be released.
:::

In today's rapidly evolving business landscape, organizations demand more than just data aggregation—they need **real-time responsiveness**, **enterprise-scale performance**, and **maximum flexibility** to adapt to business changing requirements.

**Fast Data Engine 2.0** addresses these needs by:

- **Accelerating Time-to-Value**: Deliver **up to 10x performance improvement**, significantly reducing real-time data aggregation processing and initial load times
- **Enabling Real-Time Operations**: 24/7 data availability with minimal latency and less infrastructure resources utilization
- **Simplifying Complex Pipelines**: Enhanced configuration flexibility with reduced complexity in achieving data business needs

## Brand New Workloads: The Power Behind Fast Data 2.0

Fast Data 2.0 introduces four workloads designed to replace and significantly outperform traditional components like Real-Time Updater (RTU), Projection Storer (PS), Single View Trigger Generator (SVTG), and Single View Creator (SVC).

### Mongezium - MongoDB to Kafka CDC Connector

Mongezium provides real-time data streaming from MongoDB collections to Kafka topics using MongoDB change streams.
With Debezium-compatible message formats and robust resume token support, it ensures seamless integration with existing event-driven architectures.

**Key Capabilities:**

- Real-time change data capture with minimal latency
- Automatic recovery with resume tokens
- Full collection snapshots when needed

[**Learn More →**](/products/fast_data/fast_data_engine_v2/mongezium_cdc/10_Overview.md)

### Stream Processor - Data transformation service

Stream Processor enables powerful, real-time data transformation with enterprise-grade performance. It provides a secure JavaScript sandbox for safely testing custom processing logic, ensuring the core service remains protected. This approach guarantees safe execution of user-defined code, shields against malicious scripts, isolates failures, and preserves overall system stability.

**Key Capabilities:**

- Custom JavaScript-based message processing
- Secure sandboxed execution environment
- Advanced filtering, mapping, and validation logic for data stream transformation
- Caching capabilities to enable stateful transformation logics

[**Learn More →**](/products/fast_data/fast_data_engine_v2/stream_processor/10_Overview.md)

### Farm Data - Real-time Multi-Stream Data Aggregation Engine

Farm Data powers the core logic for building data products (most notably, real-time Single Views) by aggregating multiple data streams.
With persistent state management and optimized matching algorithms, it forms the foundation for scalable, real-time data aggregation.

**Key Capabilities:**

- Aggregation of multiple data streams with persistent state
- Configurable entity relationship diagrams
- High-performance processing at scale with minimal latency
- Real-time generation of Single Views

[**Learn More →**](/products/fast_data/fast_data_engine_v2/farm_data/10_Overview.md)

### Kango - Kafka to MongoDB persistor

Kango (_Kafka to Mongo_) enables reliable data persistence from Kafka streams to MongoDB collections.
Along the pipeline, it can act as the final stage in event-driven architecture, for data product persistence, or as a strategic checkpoint to sink on the database a specific data stream.

**Key Capabilities:**

- High-throughput Kafka-to-MongoDB persistence
- Support different strategies for event persistence

[**Learn More →**](/products/fast_data/fast_data_engine_v2/kango/10_Overview.md)

## Key Benefits and Technical Advantages

### 🏆 Unprecedented Performance

Experience **up to 10x performance improvement** in aggregation operations, dramatically reducing initial load times and enabling real-time processing at enterprise scale.

### 🎯 Enhanced Flexibility & Security

Achieve greater flexibility and control over your pipeline configuration with:

- Custom JavaScript processing logic in the Stream Processor, featuring sandboxed execution environments for secure custom code
- Configurable message transformation, filtering and validation rules
- Flexible entity relationship definitions within Aggregation graphs

### 💰 Infrastructure Resource consumption efficiency

- Less memory to allocate for running workloads
- Lower Kafka infrastructure costs by diminishing the number of required Kafka topics (compared with previous Fast Data architectures)
- Decreased maintenance overhead and operational complexity
- Faster and easier adaptation to pipeline changes and new business needs
- Faster implementation of new data pipelines, strongly improving the Time-to-Market

### 🔄 Standardized Internal Processing

Fast Data 2.0 provides maximum flexibility in handling diverse message formats during ingestion while maintaining a consistent **Fast Data message structure** internally.
All Fast Data 2.0 workloads adopt this [**standardized Fast Data message format**](/products/fast_data/fast_data_engine_v2/concepts.mdx#fast-data-message-format) that ensures **seamless interoperability** throughout the pipeline.

The Fast Data message format includes operation types (`c`, `r`, `u`, `d`), current and previous values, and comprehensive metadata to support complex aggregation scenarios.

## Upgrade to Fast Data 2.0

The transition to Fast Data 2.0 fundamentally enhances how organizations handle data transformation, aggregation, and persistence. These new workloads have been specifically designed to replace and significantly outperform traditional Fast Data components like Real-Time Updater, Projection Storer, Single View Trigger Generator, and Single View Creator.

### Advanced Data Transformation

Traditional data casting and mapping operations are now significantly outperformed by Stream Processor, which provides unprecedented **security, reliability, and performance** in implementing transformation, mapping, filtering, and validation logic. Unlike the rigid environment variable-based configurations of traditional components, Stream Processor offers maximum flexibility through secure JavaScript sandbox execution, allowing you to implement exactly the logic your use case demands while maintaining enterprise-grade security and isolation.

### Centralized High-Performance Aggregation

The complex strategies and aggregation logics previously configured in SVTG and SVC components are now centralized and simplified by Farm Data Aggregation, delivering up to **10x performance improvement** in aggregation operations. This eliminates the complexity of managing multiple components while dramatically reducing initial load times and enabling true real-time processing at enterprise scale.

### Decoupled and More Specialized Architecture

The actual approach of RTU, PS, and SVC, which combined data persistence with complex stream processing logic, has been **decoupled** into more specialized workloads. Stream Processor handles all streaming and transformation logic, while Kango focuses exclusively on high-performance persistence. This architectural separation improves scalability and flexibility, enabling surgical modifications to pipelines without cascading changes across multiple components and/or pipeline steps.

This decoupling means you can now:

- Persist data at any point in your pipeline without rigid schemas or procedures
- Make targeted changes to specific pipeline steps without affecting the entire flow
- Scale individual components based on your specific performance requirements
- Adapt quickly to new business needs with minimal operational overhead

## Next Roadmap Steps

Fast Data 2.0 is designed as the foundation step for some new roadmap initiatives:

- **Data Pipeline Configurator**: An upcoming UX/UI canvas-based configurator will allow you to
  build data pipelines visually, further streamlining the development experience and boost interoperation and synergies with other Mia-Platform product suite components.
- **Control Plane Runtime Management**: Enable full support of Fast Data runtime management capabilities provided by compatibility with [Fast Data Control Plane](/products/fast_data/runtime_management/overview.mdx),
  providing comprehensive monitoring and control over your Fast Data operations at runtime.
