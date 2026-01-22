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

Empower your pipelines with secure, sandboxed JavaScript execution for custom data logic. Easily configure advanced transformation, filtering, and validation rules while maintaining full architectural flexibility for complex entity relationships in aggregation graphs.

### Infrastructure Resource consumption efficiency

Fast Data v2 significantly reduces resource consumption through optimized memory allocation for workloads and lower Kafka infrastructure costs by requiring fewer topics compared to previous architectures. This translates to decreased maintenance overhead, reduced operational complexity, and faster adaptation to pipeline changes and evolving business requirements, ultimately delivering improved time-to-market for new data pipeline implementations.

### Standardized Internal Processing

Fast Data v2 provides maximum flexibility in handling diverse message formats during ingestion while maintaining a consistent **Fast Data message structure** internally.
All Fast Data v2 workloads adopt this [**standardized Fast Data message format**](/products/fast_data_v2/concepts.mdx#fast-data-message-format) that ensures **seamless interoperability** throughout the pipeline.

The Fast Data message format includes operation types (`c`, `r`, `u`, `d`), current and previous values, and comprehensive metadata to support complex aggregation scenarios.

## Getting Started with Fast Data v2

To discover more about Fast Data v2 and understand how to leverage its capabilities, we recommend following this learning path:

1. **[Concepts](/products/fast_data_v2/concepts.mdx)** - Understand the foundational concepts, including the Fast Data message format and architectural principles
2. **[Fast Data Engine](/products/fast_data_v2/fast_data_engine.md)** - Explore the four specialized workloads that power Fast Data v2 and learn how they work together to build high-performance data pipelines

## Next Roadmap Steps

Following the delivery of the Fast Data Engine v2, additional features and capabilities are in roadmap for future releases:

- **Control Plane Runtime Management**: Enable full support of Fast Data runtime management capabilities provided by compatibility with [Fast Data v1 Control Plane](/products/fast_data/runtime_management/overview.mdx),
  providing comprehensive monitoring and control over your Fast Data operations at runtime.
- **Data Pipeline Configurator**: An upcoming UX/UI canvas-based configurator will allow you to
  build data pipelines visually, further streamlining the development experience and boost interoperation and synergies with other Mia-Platform product suite components.
