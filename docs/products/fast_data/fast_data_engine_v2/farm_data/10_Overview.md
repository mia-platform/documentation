---
id: overview
title: Farm Data Overview
sidebar_label: Farm Data
---


Farm Data is a high-performance, Rust-based microservice that serves as a core building block in Mia Platform's Data Fabric ecosystem. It implements sophisticated stream processing capabilities for Fast Data aggregation scenarios, enabling real-time data consolidation across multiple streaming sources.

## Purpose and Architecture

### Core Functionality

Farm Data specializes in **stream aggregation and joining**, allowing organizations to:

- **Merge Multiple Data Streams**: Combine events from different Kafka topics into coherent Single Views
- **Maintain Stateful Processing**: Leverage persistent state management to correlate events across time and streams
- **Generate Single Views**: Produce unified data representations by aggregating related events from multiple sources
- **Process in Real-Time**: Handle high-throughput streaming data with minimal latency

### Service Architecture

The service follows a modular, event-driven architecture consisting of several key components:

```
┌─────────────────┐    ┌───────────────┐    ┌──────────────────┐
│   Kafka Input   │───▶│  Aggregation  │───▶│   Kafka Output   │
│    Streams      │    │   Processor   │    │    (Single View) │
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

1. **Stream Management Layer** (`aggregation/io`): Handles Kafka consumption and production with advanced features like:
   - Consumer group coordination and rebalancing
   - Producer delivery guarantees
   - Message compression and batching
   - Comprehensive telemetry and metrics

2. **Aggregation Processing Layer** (`aggregation/processors`): Implements two distinct aggregation strategies:
   - **Incremental Updates (IU) Aggregation**: Optimized for scenarios with frequent updates to existing records
   - **Full Aggregation**: Complete recomputation approach for complex dependencies

3. **Persistence Layer** (`aggregation/persistence`): MongoDB-based state management supporting:
   - Atomic read-write operations for consistency
   - Advanced querying with aggregation pipelines
   - Legacy and modern MongoDB driver support
   - Efficient parent-child relationship handling

4. **Configuration Management** (`configuration`): Type-safe configuration system with:
   - JSON Schema validation
   - Environment variable overrides
   - Modular feature-based configuration

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

- **Use Case**: Frequent updates to existing entities
- **Behavior**: Updates only affected portions of the Single View
- **Performance**: Optimized for high-frequency change scenarios
- **Memory**: Lower memory footprint for large datasets

#### 2. Full Aggregation

- **Use Case**: Complex interdependencies requiring complete recomputation
- **Behavior**: Rebuilds entire Single View on each update
- **Performance**: Better for scenarios with complex relationships
- **Consistency**: Ensures complete data consistency across all relationships


## API and Integration

### REST Endpoints
- **Health Check**: `GET /-/healthz` - Service health status
- **Metrics**: `GET /-/metrics` - Prometheus-format metrics
- **CRUD Operations**: Full CRUD API for Single View management (when enabled)
