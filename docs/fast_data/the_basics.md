---
id: the_basics
title: The Basics
sidebar_label: The Basics
---

This page contains information about the main concepts and entities of Fast Data. Before going through other sections be sure to have an overall understanding of the topics presented here.

## System of Records (SoR)

A System of Records is the data source providing the raw information to a Fast Data system. Usually, a System of Records is a database containing all the information about a specific business domain.

### Change Data Capture (CDC)

A Change Data Capture is a system that reacts to change of data at some source (in our case the System of Records) by emitting an event that notifies the listeners about the changes that just occurred.
Most Database Management Systems have various CDCs coming out of the box, with a simple user interface that makes it possible to start capturing the data changes and sending them to some destination, usually a message broker like Kafka.

## Projection

A Projection is a representation of the data coming from the System of Records, which have undergone two steps:

1. A filtering of the fields of the original record (i.e. only the fields that you are interested in are going to be saved, so that you don't waste storage for unnecessary information);
2. A data standardization process, to have your data in the exact format you want.

Projections are stored on MongoDB, which means the original data can be transformed in non-flat structures: for example, some fields of the records could become objects or arrays. These transformations are done via Cast Functions.

### Cast Function

Cast Functions, as the name suggests, are JavaScript functions used to transform the data originally coming from the System of Records before it is saved in the Projection.
This is particularly useful when the SoRs use different format. A common case is with date formats: using Cast Functions, you can guarantee all your Projections will have their dates saved in a coherent and consistent way, making querying them an easier and reliable task.

The Console provides basic Cast Functions for the most common use cases, together with the possibility to add custom ones written in plain JavaScript.

## Single View (SV)

A Single View is a document that aggregates data from many Projections, offering business-centric information that is always available and updated in near real-time.
The Single View is updated every time a Projection whose data is used in the Single View changes. This means that aggregation happens as soon as the data changes, instead of when querying data (for this kind of behavior, you should consider using Mongo Views).

### Strategies

As previously stated, Single Views documents are composed by data coming from different Projections records. When any of the Projections record changes it is necessary to decide which Single Views records should be regenerated, so that they eventually contain the newly aggregated data. Within the context of Fast Data, a piece of logic that compute the transformation from any projection record to the corresponding Single View identifier that contains such record in the aggregation is called *strategy*. The output of a strategy can considered as a trigger for the process creating a Single View, since it describes both the Single View type and the record to be aggregated.
Strategies can be either *automatic*, meaning that exploiting a provided configuration the system is able to automatically infer which Single View should be updated, or *user defined* via a Javascript function, where it is possible to provide an implementation for edge cases.