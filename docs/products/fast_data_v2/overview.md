---
id: overview
title: Fast Data v2
sidebar_label: Fast Data v2
---

In today's rapidly evolving business landscape, organizations demand more than just data aggregation—they need **real-time responsiveness**, **enterprise-scale performance**, and **maximum flexibility** to adapt to business changing requirements.

**Fast Data v2** addresses these needs by:

- **Accelerating Time-to-Value**: Deliver **up to 10x performance improvement**, significantly reducing real-time data aggregation processing and initial load times
- **Enabling Real-Time Operations**: 24/7 data availability with minimal latency and less infrastructure resources utilization
- **Simplifying Complex Pipelines**: Enhanced configuration flexibility with reduced complexity in achieving data business needs

## Key Benefits and Technical Advantages

### Unprecedented Performance

Experience **up to 10x performance improvement** in aggregation operations, dramatically reducing initial load times and enabling real-time processing at enterprise scale.

### Enhanced Flexibility & Security

Achieve greater flexibility and control over your pipeline configuration with:

- Custom JavaScript processing logic in the Stream Processor, featuring sandboxed execution environments for secure custom code
- Configurable message transformation, filtering and validation rules
- Flexible entity relationship definitions within Aggregation graphs

### Infrastructure Resource consumption efficiency

- Less memory to allocate for running workloads
- Lower Kafka infrastructure costs by diminishing the number of required Kafka topics (compared with previous Fast Data architectures)
- Decreased maintenance overhead and operational complexity
- Faster and easier adaptation to pipeline changes and new business needs
- Faster implementation of new data pipelines, strongly improving the Time-to-Market

### Standardized Internal Processing

Fast Data v2 provides maximum flexibility in handling diverse message formats during ingestion while maintaining a consistent **Fast Data message structure** internally.
All Fast Data v2 workloads adopt this [**standardized Fast Data message format**](/products/fast_data_v2/concepts.mdx#fast-data-message-format) that ensures **seamless interoperability** throughout the pipeline.

The Fast Data message format includes operation types (`c`, `r`, `u`, `d`), current and previous values, and comprehensive metadata to support complex aggregation scenarios.

## Upgrade to Fast Data v2

The transition to Fast Data v2 fundamentally enhances how organizations handle data transformation, aggregation, and persistence. These new workloads have been specifically designed to replace and significantly outperform traditional Fast Data components like Real-Time Updater, Projection Storer, Single View Trigger Generator, and Single View Creator.

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

Fast Data v2 is designed as the foundation step for some new roadmap initiatives:

- **Data Pipeline Configurator**: An upcoming UX/UI canvas-based configurator will allow you to
  build data pipelines visually, further streamlining the development experience and boost interoperation and synergies with other Mia-Platform product suite components.
- **Control Plane Runtime Management**: Enable full support of Fast Data runtime management capabilities provided by compatibility with [Fast Data Control Plane](/products/fast_data/runtime_management/overview.mdx),
  providing comprehensive monitoring and control over your Fast Data operations at runtime.
