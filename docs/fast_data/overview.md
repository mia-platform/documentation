---
id: overview
title: Mia-Platform Fast Data
sidebar_label: Mia-Platform Fast Data
---

Keep all your **Data organized and available in real time, 24/7**.

![fast data overview](img/fastdata-overview.png)

Collect data from any existing system and organize it according to your business needs. Build a single point of truth to keep your data flow consistent and updated in real-time 24/7.

Fast Data main goal is to **aggregate business data from different sources into a single MongoDB collection** called single view. These collections can be easily **queried by your APIs**. The aggregation is performed only when needed, that is **when changes occur to the source data**.

Focus only on your data and how you need to aggregate them, your single views will be **automatically updated**.

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

Each source system table that contains data linked to a single view will have a projection collection. These collections contain the [standardized](#define-canonical-formats) values of the fields of the related system table. This set of collections will be used from the Single View Creator to update the single view collections.  
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

## Why Single View?

**Data-driven** and **user experience** are not only trend concepts, they are real needs of all modern companies.
To really become a data-driven company and offer a modern user experience all of your business data must be **updated and available 24/7 for all digital touchpoints**.

The first technical problem to overcome in order to be able to be such a company is the **data fragmentation** and the complexity of its management.
Year after year, vital company data have been isolated and stranded in "watertight compartments". For example, the **customer data**, required for customer support and sales processes, can be placed in many different disconnected locations.

A **single view** addresses this problem aggregating all business entity relevant data, standardizing formats, into a single structure that can be easily **queried by your APIs**. For example, you can create a customer single view extracting data from different front office and back office applications, aggregate and serve them to everyone: from sales and marketing, to call centers and technical support.

With Mia-Platform Fast Data you can easily create real-time updated single views and stop the costly and inefficient data fragmentation.

## Single View design preliminary tasks

In this section, we describe the main steps to do before going deep into the design of a real-time single view.

### Identify Data Consumers

To design a better single view, you should know how it will be used by the customers and design the types of queries that will be executed on the single view. It will help you to design a correct single view model.

### Identify Data Producers

Using the data from the previous analysis, you have to identify the systems and the relative databases from which you can extract them.
You need a deep understanding of the underlying source databases, such as: the schemas, what tables store the data of interest and in what format.

## Design the Single View

With the output from the previous tasks, you can start the process of designing the single view schema.
In this section we'll describe the main tasks to perform in order to correctly design the schema.

### Identify common fields

First, you have to define **common fields** that must appear in each document.
For example, every customer document should contain a **unique identifier** such as a number or an email address. This will be the primary key of the single view and will be **indexed as a primary key**. Analyzing query patterns will also help identify secondary indexes that need to be created. For example, we may regularly query customers against locations they have visited and products or services they have purchased.

### Define canonical formats

Since data may be represented with different formats in different systems, you also need to define canonical formats of the fields.

For example, a customer phone number may be stored as a string in one system, and as an integer in another; for this reason, you can use the [cast functions](cast_functions) in order to store the heterogeneous data of source tables in a single, well-defined canonical type.

:::note
A set of default Cast Functions is already provided but you are free to design your own custom functions.
:::

:::tip
Check out the related section to know how to create a single view directly from the Console
:::

### GDPR

Fast Data services may logs the primary keys of your projections, single views and keys of the Kafka Messages. Please, be sure that they are not sensible information in order to be in accordance with GDPR policies. Otherwise, you need to set topic retentions conformed to the rules and inform the Mia-Platform referent to set logs retention according to that.
