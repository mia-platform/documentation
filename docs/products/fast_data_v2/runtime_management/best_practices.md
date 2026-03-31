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

While operating with your Fast Data infrastructure, you may need to perform a re-ingestion of all messages previously ingested into the system, for example, to recover from a failure or to simply ensure that all data has been processed as expected.

These operations can be easily executed leveraging Fast Data services, using the **Control Plane UI** to govern and orchestrate every stage of **Initial Load** or **Full Refresh** operations with precision and zero friction.

#### Example of a Full Refresh architecture

You can see an example of architecture for Full Refresh management in the following screenshot of the **Control Plane UI** that shows the entire flow from a starting point (the _topic.input_ topic) to the ending point (the _topic.output_ topic) of the pipeline:

![Full Refresh Architecture](img/full-refresh-architecture.png)

As shown in the diagram, the messages from the _topic.input_ are consumed by two different flows:

- the flow in the upper half of the pipeline shows a [Stream Processor service](/products/fast_data_v2/stream_processor/10_Overview.md), which is responsible to simply forward the message to the next stage of the pipeline
- the flow in the lower half of the pipeline shows several processes responsible to perform a backup of the messages in a backup store: in the example, the messages inside _topic.input_ are consumed by the [Kango service](/products/fast_data_v2/kango/10_Overview.md) to compact and generate MongoDB documents. These documents are then stored in a MongoDB collection, which can be used as backup store for the Full Refresh process attaching a [Mongezium service](/products/fast_data_v2/mongezium_cdc/10_Overview.md) that reads these documents and generates the Kafka messages published to the _topic.backup_ topic, which can be read by a _Stream Processor_ that can stay paused and activated only when you need to reingest messages into the pipeline.

The two different flows represent the regular processing of the messages (upper flow) and the backup management (lower flow), and merge at the end of the pipeline to produce the final output messages in the _topic.output_ topic, before being included in both the _topic.merge_ topic and being processed by another _Stream Processor_ service which can include dedicated logic to further guard the system from introducing messages that we might want not to be included anymore (e.g. messages from the backup flow that are now older because the regular flow - still processing - has already produced newer messages of a specific identifier in the output stream).

This refinement allows the possibility to perform a _Full Refresh_ process at any point in time, even without stopping the regular flow of messages in the system, guaranteeing the possibility to recover from a failure or regenerate data without even stopping the entire pipeline, risking delays or downtime during the update and refinement of data.

If you need instead to perform an _Initial Load_ process, you can even use the same architecture: you can pause the flow from _topic.input_ to completely pause the pipeline and safely perform clean up operations (if necessary), without the risk of new messages being processed with incomplete data. Then you can start the _Stream Processor_ service responsible to reingest the messages from the backup store, and once the lag is close to zero, you can resume the flow from _topic.input_ to let the pipeline process the new messages with the complete data, completing the process easily and safely.

#### Controlled Initialization

To ensure a stable start, every Fast Data workload can be configured with a default **paused** runtime state. This is managed via the **`onCreate`** parameter within each microservice's **ConfigMap**. By initializing flows in a paused state, you ensure that no workload begins consuming data immediately after deployment, allowing for manual orchestration.

For example, in the architecture shown in the previous diagram, the _Stream Processor_ service responsible for introducing the backup messages into the pipeline can be configured with the `onCreate` parameter set to **pause** to ensure that the backup messages are held in the _topic.backup_ topic.

#### Iterative Pipeline Activation

Whenever it is necessary to start the _Full Refresh_ process or an _Initial Load_, you can simply resume the consumption from the UI, allowing the messages in the backup topic to be reingested into the pipeline in a controlled way.
Typically, this first step involves executing transformation logic to ensure incoming data is compliant with Fast Data formats (e.g., casting, mapping, and data quality enhancements).
Once processed, these messages are produced into the output streams, ready for the subsequent stages of the pipeline.

You can monitor the flow of the pipeline from the UI, and quickly identify bottlenecks or issues, or perform quick operations to fix them (e.g. pausing the regular flow, to allow the backup flow to process the messages and catch up with the regular flow, before resuming it again).

#### Ingestion and Lag Monitoring

Whether it is during the regular flow of the pipeline, or an _Initial Load_ or a _Full Refresh_ operation, you have full visibility of the state of the pipeline and full control of it.

Once the environment is ready, you can regulate message loading into the ingestion layer of your pipeline, pausing and resuming consumptions of topic messages in services. As the queues fill, the Control Plane provides real-time visibility into **Consumer Lag** across every pipeline edge, allowing you to monitor the volume of data awaiting processing.

#### Advanced Aggregation Management

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

By leveraging the ability to pause and resume message-consuming microservices in real-time and verifying the lag of your topic and the stability of your services, the Control Plane ensures that computing power is strategically directed toward high-priority tasks during peak demand periods.
These granular runtime controls facilitate a balanced distribution of processing loads across every stage of the architecture, effectively mitigating bottlenecks and ensuring maximum resource utilization throughout your entire Fast Data v2 infrastructure.

You can even use these immediate feedbacks to rethink the architecture of your pipeline. As example:

- you can choose whether the backup store should include the messages already refined through a transformation logic layer, to have them as a ready-to-use backup faster to reingest into the pipeline, or instead to include the raw messages, to have a more complete backup that can be reingested even with a different transformation logic
- you can decide to have a faster backup store using a Kafka topic without the MongoDB layer, to have a faster reingestion of the messages and have Kafka itself to deal with retention and compaction because maybe you might not need an efficient and durable storage
- in our example architecture, you can configure the _Stream Processor_ services that ingest messages to the _topic.merge_ topic to evenly divide the partitions to use by configuring them with the special _partition settings_ configuration (read more in the dedicated [page](/products/fast_data_v2/stream_processor/20_Configuration.mdx)) to dedicate specific partitions to the backup flow and specific partitions to the regular flow, to have a clearer separation of the two flows and better regulate the speed of the reingestion of the backup messages with the speed of the ingestion in the regular flow

### Enhanced System Reliability

When faced with scheduled maintenance or unforeseen anomalies, the Control Plane allows for precise intervention by pausing specific pipeline segments, ensuring that controlled troubleshooting occurs without compromising the broader system workflow.
This systematic approach extends into post-maintenance phases, where operations can be resumed gradually to verify stability and minimize recovery time. Beyond routine maintenance, these runtime controls facilitate effective fault isolation, enabling you to contain issues within localized segments to protect the integrity of the overall infrastructure. By implementing graceful degradation through precise shutdown and startup procedures, you ensure that your Fast Data v2 environment maintains absolute operational integrity even in challenging circumstances.
