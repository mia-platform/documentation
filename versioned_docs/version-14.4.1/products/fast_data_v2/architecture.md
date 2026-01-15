---
id: architecture
title: Architecture
sidebar_label: Architecture
---

With Fast Data v2, you can compose modular data pipelines tailored to your specific business needs. Whether you need to stream data in real-time, build data products, decouple legacy systems, or implement complex multi-stream aggregations, [**Fast Data v2 Engine**](/products/fast_data_v2/architecture.md) provides the flexibility to design the optimal architecture while maintaining clear separation of concerns and operational simplicity.

:::info
This section illustrates common examples of **Fast Data architecture patterns**.  
We recommend starting with the [**Fast Data Engine overview page**](/products/fast_data_v2/architecture.md) to fully grasp the core functional concepts before exploring the architecture examples below.
:::

### Single View Data Product Architecture

This is the most common architecture pattern for building **real-time data products** (Single Views). The pipeline transforms data coming from various tables on the source system into business-ready insights that can power customer-facing applications and analytics.

![Single View Architecture](img/architecture_2.png)

**Architecture Flow:**

1. **Data Capture**: CDC (Change Data Capture) extracts changes from the System of Record, streaming data from multiple tables into individual Kafka topics
2. **Stream Transformation**: Each data stream flows through a dedicated Stream Processor service that - for instance - can:
   - Validate and normalize data formats
   - Apply business rules and data quality checks
   - Filter irrelevant or invalid records
   - Map source schemas to standardized formats (Within the context of Fast Data, workloads exchange change events that must follow an ad-hoc format.  
   For more information, visit the [Fast Data Message Format section](/products/fast_data_v2/concepts.mdx#fast-data-message-format))
3. **Multi-Stream Aggregation**: Farm Data service receives all processed streams and:
   - Joins data from multiple data streams based on a user-defined Directed Acyclic Graphs (**DAGs**)
   - Maintains persistent state for incremental aggregation
   - Produces the unified data representation (*raw Single View*)
4. **Post-Processing**: A final Stream Processor applies:
   - Business logic transformations specific to the final data product
   - Additional enrichment or derived field calculations
   - Final formatting for downstream consumption of the Single View
5. **Persistence**: Kango persists each produced Single View to MongoDB, making it available for:
   - Real-time API queries from business applications
   - Analytics and reporting tools
   - Customer-facing user interfaces

### Digital Twin and Legacy Modernization Architecture

When your goal is **system decoupling** and **legacy modernization**, this architecture creates normalized, high-quality digital representations of your operational data without complex aggregation logic.

![Digital Twin Architecture](img/architecture_1.png)

**Architecture Flow:**

1. **Data Capture**: CDC extracts changes from the legacy System of Record
2. **Independent Processing**: Each source table follows its own transformation pipeline:
   - Stream Processor normalizes and standardizes the data format
   - Applies data quality rules specific to each entity type
   - Maps legacy schemas to modern, standardized data models
3. **Parallel Persistence**: Kango persists each processed stream to its own Projected Table, creating clean digital twins of the source data

**Use Cases:**
- **API Layer Creation**: Expose clean, standardized data APIs while keeping legacy systems unchanged
- **Microservices Migration**: Provide each microservice with its own denormalized data copy, reducing dependencies on the monolithic database
- **Data Quality Improvement**: Transform messy legacy data into clean, well-structured, AI-ready formats without modifying the source system
- **System Isolation**: Insulate downstream applications from legacy system complexity and technical debt

### Advanced Multi-Source Pipeline Architecture

For **complex enterprise scenarios** requiring sophisticated data flows, Fast Data Engine v2 enables advanced architectures that combine multiple patterns while maintaining modularity and operational clarity.

![Advanced Architecture](img/architecture_3.png)

**Architecture Highlights:**

This architecture demonstrates Fast Data Engine v2's maximum flexibility by combining multiple patterns:

- **Multiple Source Systems**: Various independent Systems of Record (in the example, SoR 1 and SoR 2) feed the pipeline through their own ingestion layer
- **Parallel Processing Paths**: Different tables follow different processing strategies:
  - Some streams are directly persisted as Digital Twins (Projected Tables)
  - Others are aggregated by Farm Data instances to create Single Views
  - Some undergo multiple transformation stages before reaching their destination
- **Multiple Farm Data Instances**: Different aggregation engines process distinct subsets of data, each maintaining its own state and producing specialized data products
- **Mixed Output Patterns**: The pipeline produces multiple types of outputs simultaneously:
  - Single View 1 and Single View 2 for different business use cases
  - various data assets for a specific decoupled data store
  - Intermediate projected tables for debugging or alternative consumption
- **Strategic Stream Processor Placement**: Transformation workloads are positioned exactly where needed:
  - Pre-aggregation for example for data normalization and quality
  - Post-aggregation for example for business logic and final formatting
  - Mid-pipeline for example for routing and enrichment decisions

These architecture patterns demonstrate that Fast Data Engine v2 workloads are not prescriptive building blocks - they are flexible, composable components that you can arrange to match your exact requirements, whether simple or sophisticated.
