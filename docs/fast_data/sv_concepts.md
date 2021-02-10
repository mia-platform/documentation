---
id: sv_concepts
title: Single View Concepts
sidebar_label: Single View Concepts
---
## Why Single View?

**Data-driven** and **user experience** are not only trend concepts, they are real needs of all modern companies.
To really become a data-driven company and offer a modern user experience all of your business data must be **updated and available 24/7 for all digital touchpoint**.

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
For example, every customer document should contain a **unique identifier** such as a number or an email address. This will be the primary key of the single view and will be **indexed as a primary key**. Analyzing query patterns will also help identify secondary indexes that need to be created. For example, we may regularly query customers against location and products or services they have purchased.

### Define canonical formats

Since data may be represented with different formats in different systems, you also need to define canonical formats of the fields.

For example, a customer phone number may be stored as a string in one system, and as an integer in another; for this reason, you can use the [cast functions](cast_functions) in order to store the heterogeneous data of source tables in a single, well-defined canonical type.

:::note
A set of default Cast Functions is already provided but you are free to design your own custom functions.
:::

:::tip
Check out the related section to know how to create a single view directly from the Console
:::
