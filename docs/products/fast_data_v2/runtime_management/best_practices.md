---
id: best_practices
title: Best Practices
sidebar_label: Best Practices
---

This page provides best practices and operational strategies for effectively managing Fast Data v2 pipelines using the Control Plane UI runtime controls.

## Development Data Pipelines Best Practices

### Visualize Fast Data Pipelines while Building Them

During the Fast Data development phase, users can iteratively configure and continuously deploy in the development environment new Fast Data pipeline steps. Control Plane UI will provide the new architecture steps incrementally rendered, offering immediate visual feedback as the pipeline evolves.

### Performance Testing and Simulation

During the Fast Data development phase, users can simulate different scenarios for performance testing by pausing and resuming messages consumption along the pipeline. In this way, user can pause and resume operations to test system behavior under different load patterns before to promote to production.

## Operational Management Strategies

### Initial Load and Full Refresh Processes Management

The **Control Plane UI** allows you to govern and orchestrate every stage of **Initial Load** or **Full Refresh** operations with precision and zero friction.

#### 1. Controlled Initialization

To ensure a stable start, every Fast Data workload can be configured with a default **Paused** runtime state. This is managed via the **`onCreate`** parameter within each microservice's **ConfigMap**. By initializing flows in a paused state, you ensure that no workload begins consuming data immediately after deployment, allowing for manual orchestration.

#### 2. Ingestion and Lag Monitoring

Once the environment is ready, you can initiate message loading into the ingestion layer of your pipeline. As the queues fill, the Control Plane provides real-time visibility into **Consumer Lag** across every pipeline edge, allowing you to monitor the volume of data awaiting processing.

#### 3. Iterative Pipeline Activation

After the initial data load, you can trigger consumption for the first stage of the pipeline using the **Play** button.

* **Transformation Stage**: Typically, this first step involves executing transformation logic to ensure incoming data is compliant with Fast Data formats (e.g., casting, mapping, and data quality enhancements).
* **Downstream Flow**: Once processed, these messages are produced into the output streams, ready for the subsequent stages of the pipeline.

#### 4. Advanced Aggregation Management

When dealing with **Aggregate execution steps**, the **Aggregation Graph Canvas** provides a centralized strategic view. This interface is specifically designed to manage complex scenarios where multiple data streams must be merged.

**Best Practice: The Leaf-to-Head Strategy**
For efficient ingestion, it is recommended to resume consumption following a "bottom-up" approach:

1. **Start from the Leaves**: Resume consumption at the leaf nodes of the aggregation graph.
2. **Monitor Lag**: Observe the incremental decrease in consumer lag.
3. **Progression**: Once the lag approaches zero, move to the next level of the graph.
4. **Activate the Head Node**: Finally, resume the head node of the aggregation.

:::note
By keeping the head node in a **Paused** state while the leaves process data, you prevent the production of premature events in the output stream. Once the head is resumed, it will produce the final aggregated output, significantly reducing redundant processing load on downstream stages.
:::

By combining real-time **Consumer Lag monitoring** with granular **runtime state control**, the Control Plane transforms complex Initial Load and Full Refresh operations into a manageable, transparent, and highly efficient process.

### Strategic Resource Allocation and Performance Optimization

By leveraging the ability to pause and resume message-consuming microservices in real-time, the Control Plane ensures that computing power is strategically directed toward high-priority tasks during peak demand periods. These granular runtime controls facilitate a balanced distribution of processing loads across every stage of the architecture, effectively mitigating bottlenecks and ensuring maximum resource utilization throughout your entire Fast Data v2 infrastructure.

### Enhanced System Reliability

When faced with scheduled maintenance or unforeseen anomalies, the Control Plane allows for precise intervention by pausing specific pipeline segments, ensuring that controlled troubleshooting occurs without compromising the broader system workflow.  
This systematic approach extends into post-maintenance phases, where operations can be resumed gradually to verify stability and minimize recovery time. Beyond routine maintenance, these runtime controls facilitate effective fault isolation, enabling you to contain issues within localized segments to protect the integrity of the overall infrastructure. By implementing graceful degradation through precise shutdown and startup procedures, you ensure that your Fast Data v2 environment maintains absolute operational integrity even in challenging circumstances.
