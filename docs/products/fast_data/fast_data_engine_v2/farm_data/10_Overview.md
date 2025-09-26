---
id: overview
title: Farm Data Overview
sidebar_label: Farm Data
---


Farm Data is a high-performance microservice that serves as a core building block in Mia Platform's Data Fabric ecosystem. It implements sophisticated stream processing capabilities for Fast Data aggregation scenarios, enabling real-time data consolidation across multiple streaming sources.

## Purpose and Architecture

### Core Functionality

Farm Data specializes in **stream aggregation and joining**, allowing organizations to:

- **Merge Multiple Data Streams**: combine events from different Kafka topics into coherent Single Views
- **Maintain Stateful Processing**: leverage persistent state management to correlate events across time and streams
- **Generate Single Views**: produce unified data representations by aggregating related events from multiple sources
- **Process in Real-Time**: handle high-throughput streaming data with minimal latency

### Service Architecture

The service follows a modular, event-driven architecture consisting of several key components:

```
┌─────────────────┐    ┌───────────────┐    ┌──────────────────┐
│   Kafka Input   │───▶│  Aggregation  │───▶│   Kafka Output   │
│     Streams     │    │   Processor   │    │   (Single View)  │
└─────────────────┘    └───────────────┘    └──────────────────┘
                               │
                               ▼
                       ┌───────────────┐
                       │   MongoDB     │
                       │ (Persistent   │
                       │    State)     │
                       └───────────────┘
```

#### Key Architectural Components

1. **Stream Management Layer**: Handles Kafka consumption and production with advanced features like:
   - Consumer group coordination and rebalancing
   - Producer delivery guarantees
   - Message compression and batching
   - Comprehensive telemetry and metrics

2. **Aggregation Processing Layer**: Implements two distinct aggregation strategies:
   - **Incremental Updates (IU) Aggregation**: optimized for scenarios with frequent updates to existing records
   - **Full Aggregation**: complete recomputation approach for complex dependencies

3. **Persistence Layer**: MongoDB-based state management supporting:
   - Atomic read-write operations for consistency
   - Advanced querying with aggregation pipelines
   - Legacy and modern MongoDB driver support
   - Efficient parent-child relationship handling

## Processing Models

### Aggregation Graph

Farm Data operates on user-defined **Directed Acyclic Graphs (DAGs)** where:

- **Nodes** represent individual data streams (Kafka topics)
- **Edges** define relationships and filtering logic between streams
- **Filters** specify how data flows between connected nodes

Example aggregation scenario:

```
User Events ──┐
              ├─▶ User Profile Single View
Order Events ─┘
```

### Processing Strategies

#### 1. Incremental Updates (IU) Aggregation

- **Use Case**: frequent updates to existing entities
- **Behavior**: updates only affected portions of the Single View
- **Performance**: optimized for high-frequency change scenarios
- **Memory**: lower memory footprint for large datasets

#### 2. Full Aggregation

- **Use Case**: complex interdependencies requiring complete recomputation
- **Behavior**: rebuilds entire Single View on each update
- **Performance**: better for scenarios with complex relationships
