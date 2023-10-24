---
id: benchmark_fast_data
title: Bootstrapping Fast Data
sidebar_label: Bootstrapping Fast Data
---

This section provides guidelines and answers on how to provision the infrastructure components in order to have an up-and-running instance of Mia-Platform Fast Data. 

In particular, it lists some of the minimum resources in terms of CPU or RAM that the components (Kafka, MongoDB and Mia-Platform Plugins) needs to satisfy, along with their configuration.

:::info Before you start

Fast Data solution can either be installed in a [PaaS](/paas/overview.md) or [Self-Hosted](/self_hosted/self_hosted_requirements.md) setup. The goal of this guide is to provide best practices that are independent of the infrastructure.

The level of details of the following answers assumes that you have basic knowledge about the aforementioned components. 
:::

## Assumptions

This table shows details for each component that has been monitored and analyze to provide the guidelines.

<table>
    <tr><th>Component</th><th>Replicas</th><th>Details</th></tr>
    <tr><td>Kafka</td><td>4 brokers</td><td> 600.000 nominal events X day, i.e. 30GB of ingestion messages.</td></tr>
    <tr><td>MongoDB</td><td>3 replica sets</td><td>Enterprise distribution having 32 GB of RAM.</td></tr>
    <tr><td>Fast Data</td><td>6 nodes</td><td>K8S cluster with each node having 8 core.</td></tr>
</table>


## Kafka


### What is the topic setup I should use to guarantee an high rate of ingestion?


When creating and managing topics in a Kafka cluster, is crucial to define a number of partitions that can balance the identifiers of messages. This means that a topic:

* linked to a data source having a fixed cardinality, requires a number of partitions `<=` 3;   
* linked to a data source having an higher number of insert/update/delete operation requires a number of partition `>` 3.

:::tip Use Case
A topic having an ingestion rate of `2.2k message/minute` requires 10 partitions to distribute the messages among the topics while speeding up micro-services performances.
:::

### What is the topic setup I should use to guarantee an high availability?

A topic is distributed among the brokers of your cluster, with a parameter called _replication factor_: for critical messages, this value should be set to the number of brokers, meaning that the data of a topic will be stored inside all brokers.

You can also specify how many replicas are needed to send acknowledgments on produced messages before committing, to guarantee the synchronization of the distributed data. This value can be set at the topic level with the parameter `min.insync.replicas` and is usually equal to `# of brokers - 1`. Critical flows may require a number of in-sync replicas equal to the number of brokers. 

## Mongo Db

### What should be the required resources to perform an Initial Load?

The **Initial Load** is a manual operation made at runtime to initialize the projection's records with the most recent copy of the dataset from the system of record linked to it.

This activity is performed through the **Change Data Capture** (**CDC**) and will be performed by the [Real-Time Updater (RTU)](/fast_data/realtime_updater.md).

:::danger Before executing the Initial Load...
Since an high number of ingestion messages will be handled by the RTU, remember **to disable strategy** during the execution of the Initial Load.

This will avoid to perform additional MongoDb queries made by the strategies to generate projection changes records.
:::

:::tip Execution Time
An initial load of `6.100.000 records` took around _10 minutes_, which is approximately a rate of `58k message/minute`, using up until 70% of CPU from a single MongoDb core.  
:::

### What should be the required resources to perform a Single View Refresh?

The **Single View Refresh** is an operation performed to update all the projection changes of a single view: this activity is needed during the first release of a single view and every time a new feature is released in the environment, since it will start the aggregation pipeline of the [Single-View Creator. (**SVC**)](/fast_data/single_view_creator.md)

On a [Standard Architecture](/fast_data/architecture.md#standard-architecture), this means that the database will perform operations on:

* the projection changes collections, because the **SVC** will update the projection changes record updating/removing the `changes` record; 
* the projections that are used by the single view aggregation mechanism; 
* the single view collections, to insert/update/delete records corresponding to single views.

:::tip Execution Time
The time generation is **strictly dependent** on the number of projections that are needed to compute all the fields of a single view. 

On a single view having three projections and custom functions, a refresh operation involving 16k projection changes records required _5 minutes_, which is approximately a rate of `1k single view/minute`, using up until the 80% of a single MongoDb core.
:::

On an [Event-Driven Architecture](/fast_data/architecture.md#event-driven-architecture), projection changes collection is removed in favour of trigger topics, so Fast Data will use less database resources.


### Why is the strategy execution or the single view generation slow?

If the execution of a strategy or the aggregation of a single view takes too much time, it means that maybe some index is missing in the collection involved. You should check that:

* projections have all the queries covered by indexes;
* the projection changes collection, if used, has [the required index](/fast_data/configuration/realtime_updater.md#custom-projection-changes-collection);
* the single view collection has a unique index that is equal to the [Single View Key configuration](/fast_data/configuration/config_maps/singleViewKey.md).

## Fast Data Plugins

### How should I set the resource limits of the Real-Time Updater (RTU)?

On a [Standard Architecture](/fast_data/architecture.md#standard-architecture), the RTU performs strategies to generate projection changes: based on the complexity of this strategy and the number of projections involved, this could require a variable range of resources to use.

Also, keep in mind that you may need to have a number of replicas greater than 1 as the number of projections and the corresponding number of partitions of their topics increases over time.

:::tip Use case
A RTU having two projections with strategies enabled, can reach up until an ingestion rate of `10k message/minute` with one replica having the following setting:

* CPU:
  * `200m` request
  * `400m` limit
* Memory:
  * `150MiB` request
  * `350MiB` limit
:::

:::warning Be careful with replicas! 

From the [Replicas section](/development_suite/api-console/api-design/replicas.md), is possible to link an **Horizontal Pod Autoscaler** (**HPA**) to a micro-services. 

This option should be considered carefully with the RTU: as the number of replicas changes over time, the different kafka consumers connected to the cluster <ins>will start the rebalancing procedure</ins>, which can drastically reduce the ingestion rate. 

A good rule of thumb is to set an high percentage of CPU requests as threshold, for example greater than 80%, to have the RTU scale up only when there is a peak of ingestion messages.
:::

### Why the RTU is stuck while performing a strategy? 

If the RTU goes on idle while performing strategies, it means that some query is not indexed and has triggered a collection scan on the MongoDB cluster.

This issue can be seen only with a huge amount of data: before releasing your setting to a production environment, you have to check that all the projections have all the needed look-up indexes and the projections changes CRUD collection has [the required indexes](/fast_data/configuration/realtime_updater.md#custom-projection-changes-collection) set.

### Why the RTU is processing ingestion messages at slow rate?

When a strategies retrieves a huge number of projection identifiers, it may happen that the ingestion rate of the RTU decreases: this may increase the lag of your applicat, which may be critical in case there are some real-time boundaries.

In this case, consider using an [Event-Driven Architecture](/fast_data/architecture.md#event-driven-architecture) and move the strategies to the [Single View Trigger Generator (SVTG)](/fast_data/single_view_trigger_generator.md): in this way, the Real Time Updater just stores projections on MongoDb to produce a pr-update message, that will be processed by the SVTG.

### How should I set the resource limits of the Single View Creator (SVC)?

On a [Standard Architecture](/fast_data/architecture.md#standard-architecture), the SVC aggregates single view into records by reading projection changes documents and querying the mongodb database multiple times: based on the complexity of this strategy and the number of projections involved, this could require a variable range of replicas and resources to use.

:::tip Use case

A SVC generating a single view with a custom function from two projections linked between each other with a one-to-many relation, can reach up until a generation rate of `1k SV/minute` with one replica having the following setting:

* CPU:
  * `350m` request
  * `700m` limit
* Memory:
  * `150MiB` request
  * `300MiB` limit
:::

### Why the SVC is processing projection changes record slowly?

If the SVC goes on idle while aggregating projections, it means that some query is not indexed and has triggered a collection scan on the MongoDB cluster, so [the same actions to improve strategies performance's](/fast_data/faq/benchmark_fast_data.md#why-the-rtu-is-stuck-while-performing-a-strategy) must be taken.

