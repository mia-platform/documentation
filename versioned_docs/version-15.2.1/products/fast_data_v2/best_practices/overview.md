---
id: overview
title: Best Practices
sidebar_label: Overview
---

This section provides best practices and operational strategies for effectively designing and managing Fast Data v2 pipelines.

## How to navigate this section

The Fast Data v2 Best Practices are organized into three main areas to guide you through different stages of your data pipeline lifecycle:

### [Pipeline Development & Testing](/products/fast_data_v2/best_practices/pipeline_development_testing.md)

Start here during the development phase of your Fast Data pipelines. Learn how to:
- Visualize pipeline architecture as you build it
- Simulate performance scenarios with pause/resume controls
- Test system behavior under different load patterns before promoting to production

### [Initial Load & Full Refresh Operations](/products/fast_data_v2/best_practices/initial_load_full_refresh.md)

Master the operational strategies for managing data re-ingestion in production. Understand:
- How to maintain Near Real-Time operational continuity during complex pipeline changes
- The Full Refresh architectural pattern with NRT and Backup layers
- Controlled initialization and iterative pipeline activation
- Consumer lag monitoring and the Leaf-to-Head strategy for aggregations

### [System Optimization & Reliability](/products/fast_data_v2/best_practices/system_optimization_reliability.md)

Ensure your Fast Data infrastructure runs efficiently and reliably. Discover:
- Strategic resource allocation through granular runtime controls
- Performance optimization techniques
- Enhanced system reliability and fault isolation
- Maintenance strategies and graceful degradation patterns

---

## Key Concepts

**Runtime Control**: The ability to pause and resume message consumption at any pipeline stage, enabling precise orchestration of data flows without stopping the entire pipeline.

**Near Real-Time (NRT) Continuity**: Maintaining continuous processing of new incoming data while performing full refreshes or data reprocessing operations on historical data.

**Backup Layer**: A dedicated flow that maintains a controlled backup of your messages, enabling full refresh operations without requiring infinite topic retention or direct access to source databases.
