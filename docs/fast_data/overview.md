---
id: overview
title: Mia-Platform Fast Data
sidebar_label: Mia-Platform Fast Data
---

Keep all your **Data organized and available in real time, 24/7**.

![fast data overview](img/fastdata-overview.png)

Collect data from any existing system and organize it according to your business needs. Build a single point of truth to keep your data flow consistent and updated in real-time 24/7.

Fast Data main goal is to **aggregate business data from different sources into a single MongoDB collection** called [single view](sv_concepts.md). These collections can be easily **queried by your APIs**. The aggregation is performed only when needed, that is **when changes occur to the source data**.

Focus only on your data and how you need to aggregate them, your [single views](sv_concepts.md) will be **automatically updated**.

## Fast Data Architecture and Flow

![fast data architecture](img/fastdata-arch.png)

In this section, you can have an overview of the components and the processes of Fast Data. You can easily configure Fast Data directly from the Console.

### Sending data on Kafka

You need to implement a service able to send to Kafka any change in your original sources of data happens. From now on, we will call the sources **Systems of Records**.  
You can implement it however you want.

:::caution
Logics behind the messages elaboration are based on their key, hence changing it may cause the data to be mishandled. 
:::

### Real-Time Updater

The Real-Time Updater component consumes Kafka messages and it is in charge of keeping the **projections collections** up to date with the systems. For each System you create, a new real-time updater is automatically created.

:::note
They are visible in the `Microservice` area only after you have saved the configuration
:::

Each source system table that contains data linked to a single view will have a projection collection. These collections contain the [standardized](sv_concepts#define-canonical-formats) values of the fields of the related system table. This set of collections will be used from the Single View Creator to update the single view collections.  
In order to know which single view needs to be updated, the Single View Creator periodically reads a collection named `fast-data-projections-changes` which contains all the info it needs. To gather these data we need to define one strategy for each projection, because when the projection is affected by a change we need to calculate which single views are impacted. This is made possible by the `strategies`.

For instance if we have a table A that when modified impacts the tables B and C, when receiving a change on table A we need to calculate also the impacted rows on table B and table C and all the single views that depend on them.

![real-time updater schema](img/fastdata-realtimeupdater-schema-detail.png)

:::note
You cannot delete directly the Real-Time Updater service, you need to delete the System instead. The service will be removed after you have saved.
:::

### Single View Creator

The Single View Creator component creates and updates a specific single view.

![single view creator schema](img/fastdata-svc-schema-detail.png)

First, the Single View Creator **aggregates** data of projections, then it **maps** these values to an object with the correct single view fields. Finally, it updates the single view collection.

### GDPR

Fast Data services may logs the primary keys of your projections, single views and keys of the Kafka Messages. Please, be sure that they are not sensible information in order to be in accordance with GDPR policies. Otherwise, you need to set topic retentions conformed to the rules and inform the Mia-Platform referent to set logs retention according to that. 
