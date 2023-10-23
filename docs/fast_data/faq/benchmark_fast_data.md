---
id: benchmark_fast_data
title: Benchmark
sidebar_label: Benchmark
---

This section provides guidelines and answers on how to do provisioning on cloud resources in order to have an up-and-running instance of Mia-Platform Fast Data. In particular, it lists some of the minimum resources in terms of CPU or RAM that the components (Kafka, MongoDB and Mia-Platform components) needs to satisfy, along with their configuration.

Fast Data solution can either be installed in a PaaS or Self-Hosted setup. The goal of this guide is to provide best practices that are independent of the instracture, rather to provide minimum requirements  

:::info Before you start
The level of details of the following answers assumes that you have basic infrastructure knowledgment about the aforementioned components 
:::

## Assumptions

The following table shows the details for each architectural component that has been monitored and analyze to provide the guidelines.

<table>
    <tr><th>Component</th><th>Details</th></tr>
    <tr><td rowspan="2">Kafka</td><td>Cluster having 4 brokers managing 600.000 nominal events X day, i.e. 30GB of ingestion messages.</td></tr>
</table>


## Kafka


### What is the topic setup I should use to guarantee an high rate of ingestion?


When creating and managing topics in a Kafka cluster, is crucial to define a number of partitions that can balance the identifiers of messages with . This means that a topic:

* linked to a data source having a fixed cardinality, requires a number of partitions `<=` 3.   
* linked to a data source having an higher number of insert/update/delete operation requires a number of partition `>` 3.

:::tip Use Case
A topic having an ingestion rate of `2.2k message/minute` required 10 partitions to distribute the messages among the topics while speeding up micro-services performances.
:::

### What is the topic setup I should use to guarantee an high availability?

A topic is distributed among the brokers of your cluster, with a parameter called _replication factor_: for critical messages, this value should be set to the number of brokers, meaning that the data of a topic will be stored inside all brokers.

You can also specify how many replicas are syncronized to send acknowledgments on produced messages before committing, to guarantee the syncronization of different replicas. This value can be set at the topic level with the parameter `min.insync.replicas` and is usually equal to `# of brokers - 1`. Critical flows may require a number of in-sync replicas equal to the number of brokers. 

## Mongo Db

### What should be the required resources to perform an Initial Load?


The **Initial Load** is the first operation to feed the projections records with the most recent copy of the dataset from the system of record linked to it.

:::danger Before executing the Initial Load...
This activity is performed by the Real-Time Updater and requires **to disable strategy execution**, to avoid triggering MongoDb queries and potential single view generations.
:::



:::tip Execution Time
An initial load of `6.100.000 records` took around _10 minutes_, which is approximately a rate of `58k message/minute`, using up until the 70% of a single MongoDb core.  
:::

### What should be the required resources to perform a Single View Refresh?

The **Single View Refresh** is the operation performed to update all the projection changes of a single view: this activity is needed during the first release of a single view and every time a new feature is released in the environment, since it will start the aggregation pipeline of the **Single-View Creator**. (**SVC**)

On a Standard Architecture, this means that the database will perform operations on:

* the projection changes collections, because the **SVC** will update the projection changes record updating/removing the `changes` record 
* the projections that are used by the single view aggregation mechanism; 
* the single view collections, to insert/update/delete records corresponding to single views

:::tip Execution Time
The time generation is **strictly dependent** on the number of projections that are needed to compute all the fields of a single view. 

On a single view having three projections and custom functions, a refresh operation involving 16k projection changes records required 5 minutes, which is approximately a rate of `1k single view/minute`, using up until the 80% of a single MongoDb core.
:::

On an Event-Driven Architecture, projection changes collection is removed in favour of trigger topics, so refresh operations will require less database resources.


### Why is the strategy execution or the single view generation slow?

If the execution of a strategy or the aggregation of a single view takes too much time, it means that maybe some index is missing in the collection involved. You should check that:

* projections have all the queries covered by indexes;
* the projection changes collection, if used, has the required index;
* the single view collection has a unique index that is equal to the Single View Key configuration.