---
id: overview
title: Fast Data Engine 2.0
sidebar_label: Fast Data Engine 2.0
---

## More Performant. More Flexible. More Efficient

Welcome to **Fast Data 2.0** — the next evolution of Mia-Platform's Fast Data engine.  
It delivers significant performance improvements while enhancing the core capabilities of the original [Fast Data product](/products/fast_data/what_is_fast_data.md).

Fast Data 2.0 is designed to support a wide range of advanced use cases, including:  

- **Digital Twin enablement**  
- **Real-time data consolidation**  
- **Digital Integration Hub** creation  
- **Single View** generation  
- Building **AI-ready data products**

What sets Fast Data 2.0 apart is its new suite of workloads that deliver **up to 10x performance improvement** while offering enhanced flexibility and configuration capabilities.

### Why Fast Data 2.0 Matters

In today's rapidly evolving business landscape, organizations demand more than just data aggregation—they need **real-time responsiveness**, **enterprise-scale performance**, and **maximum flexibility** to adapt to business changing requirements.
Fast Data 2.0 addresses these needs by:

- **Accelerating Time-to-Value**: Dramatically reduced initial load times and real-time aggregation processing
- **Enabling Real-Time Operations**: 24/7 data availability with minimal latency and less infrastructure resources utilization
- **Simplifying Complex Pipelines**: Enhanced configuration flexibility with reduced complexity in achieving data business needs

## Brand New Workloads: The Power Behind Fast Data 2.0

Fast Data 2.0 introduces four workloads designed to replace and significantly outperform
traditional components like Real-Time Updater (RTU), Projection Storer (PS), Single View Trigger Generator (SVTG), and Single View Creator (SVC).

### Mongezium - MongoDB to Kafka CDC Connector

Mongezium provides real-time data streaming from MongoDB collections to Kafka topics using MongoDB change streams.
With Debezium-compatible message formats and robust resume token support, it ensures seamless integration with existing event-driven architectures.

**Key Capabilities:**

- Real-time change data capture with minimal latency
- Automatic recovery with resume tokens
- Full collection snapshots when needed

[**Learn More →**](TO DO - doc link)

### Stream Processor - Data transformation service

Stream Processor enables powerful, real-time data transformation with enterprise-grade performance. It provides a secure JavaScript sandbox for safely testing custom processing logic, ensuring the core service remains protected. This approach guarantees safe execution of user-defined code, shields against malicious scripts, isolates failures, and preserves overall system stability.

**Key Capabilities:**

- Custom JavaScript-based message processing
- Secure sandboxed execution environment
- Advanced filtering, mapping, and validation logic for data stream transformation
- Caching capabilities to enable stateful transformation logics

[**Learn More →**](TO DO - doc link)

### Farm Data Aggregator - Real-time Multi-Stream Data Aggregation Engine

Farm Data Aggregator powers the core logic for building data products—most notably, real-time Single Views—by aggregating multiple data streams.
With persistent state management and optimized matching algorithms, it forms the foundation for scalable, real-time data aggregation.

**Key Capabilities:**

- Aggregation of multiple data streams with persistent state
- Configurable entity relationship diagrams
- High-performance processing at scale
- Real-time generation of Single Views

[**Learn More →**](TO DO - doc link)

### Kango - Kafka to MongoDB persistor

Kango (_Kafka to Mongo_) is a high-performance service that enables reliable data persistence from Kafka streams to MongoDB collections.
Designed for maximum throughput and fault tolerance, it acts as the final stage in event-driven data pipelines, or as a strategic checkpoint along the way.

Kango allows you to **persist data at any stage of your event-driven pipeline**, unlocking key use cases such as _Digital Twin enablement_, _Real-time data consolidation_, _Single View creation_, _AI-ready data products designing_, and many other business needs.

By capturing and storing event data as it flows through your architecture, Kango ensures that critical information is readily available for downstream analytics, machine learning, and operational intelligence.

**Key Capabilities:**

- High-throughput Kafka-to-MongoDB persistence
- Support different strategies for event persistence
- Designed for scalability and low latency
- Comprehensive error handling and recovery

[**Learn More →**](TO DO - doc link)

## Key Benefits and Technical Advantages for Users

### 🏆 Unprecedented Performance

Experience **up to 10x performance improvement** in aggregation operations, dramatically reducing initial load times and enabling real-time processing at enterprise scale.

### 🎯 Enhanced Flexibility & Security

Achieve greater flexibility and control over your pipeline configuration with:

- Custom JavaScript processing logic in the Stream Processor, featuring sandboxed execution environments for secure custom code
- Configurable message transformation, filtering and validation rules
- Flexible entity relationship definitions within Aggregation graphs
- A streamlined Fast Data workload setup, significantly reducing the reliance on environment variable configuration

### 💰 Infrastructure Resource consumption efficiency

- Less memory to allocate for running workloads
- Lower Kafka infrastructure costs by diminishing the number of required Kafka topics (compared with previous Fast Data architectures)
- Decreased maintenance overhead and operational complexity
- Faster and easier adaptation to pipeline changes and new business needs
- Faster implementation of new data pipelines, strongly improving the Time-to-Market

### 🔄 Standardized Internal Processing

Fast Data 2.0 provides maximum flexibility in handling diverse message formats during ingestion while
maintaining a consistent **Fast Data message structure** internally.
All Fast Data 2.0 workloads adopt this **standardized Fast Data message format** that ensures seamless interoperability throughout the pipeline.

TO DO - to insert the message format

This standard provides:

- **Consistency**: Unified data structure across all workloads
- **Reliability**: Guaranteed message compatibility between components
- **Extensibility**: Future-proof format supporting evolving requirements
- **Streamlined Operations**: Simplified data aggregation and persistence logics

The Fast Data message format includes operation types (`c`, `r`, `u`, `d`), current and previous values, and comprehensive metadata to support complex aggregation scenarios.

## Upgrade to Fast Data 2.0

The transition to Fast Data 2.0 represents a quantum leap in data processing capabilities, fundamentally enhancing how organizations handle data transformation, aggregation, and persistence. These new workloads have been specifically designed to replace and dramatically outperform traditional Fast Data components like Real-Time Updater, Projection Storer, Single View Trigger Generator, and Single View Creator.

### Advanced Data Transformation

Traditional data casting and mapping operations are now significantly **outperformed by Stream Processor**, which provides unprecedented security, reliability, and performance in implementing transformation, mapping, filtering, and validation logic. Unlike the rigid environment variable-based configurations of legacy components, Stream Processor offers maximum flexibility through secure JavaScript sandbox execution, allowing you to implement exactly the logic your use case demands while maintaining enterprise-grade security and isolation.

### Centralized High-Performance Aggregation

The complex strategies and aggregation logics previously configured in SVTG and SVC components
are now **centralized and simplified by Farm Data Aggregation**, delivering up to **10x performance
improvement** in aggregation operations. This eliminates the complexity of managing
multiple components while dramatically reducing initial load times and enabling true real-time
processing at enterprise scale.

### Decoupled and Specialized Architecture

The actual approach of RTU, PS, and SVC—which combined data persistence with complex stream
processing logic—has been **decoupled** into more specialized workloads. Stream Processor
handles all streaming and transformation logic, while Kango focuses exclusively on high-performance
persistence. This architectural separation dramatically improves scalability and flexibility,
enabling surgical modifications to pipelines without cascading changes across multiple components and/or pipeline steps.

This decoupling means you can now:

- Persist data at any point in your pipeline without rigid schemas or procedures
- Make targeted changes to specific pipeline steps without affecting the entire flow
- Scale individual components based on your specific performance requirements
- Adapt quickly to new business needs with minimal operational overhead

## Next Roadmap Steps

Fast Data 2.0 is designed as the foundation step for some new roadmap initiatives:

- **Data Pipeline Configurator**: An upcoming UX/UI canvas-based configurator will allow you to
  build data pipelines visually, further streamlining the development experience and boost interoperation and synergies with other Mia-Platform product suite components.
- **Advanced Runtime Management**: Enable full support of Fast Data runtime management capabilities provided by compatibility with [Fast Data Control Plane](/products/fast_data/runtime_management),
  providing comprehensive monitoring and control over your Fast Data operations at runtime.
