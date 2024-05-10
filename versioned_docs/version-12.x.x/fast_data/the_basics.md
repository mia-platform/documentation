---
id: the_basics
title: The Basics
sidebar_label: The Basics
---

This page contains information about the main concepts and entities of Fast Data. Before going through other sections be sure to have an overall understanding of the topics presented here.

## System of Record (SoR)

A System of Record is the data source providing the raw information to a Fast Data system. Usually, a System of Record is a database containing all the information about a specific business domain.

### Change Data Capture (CDC)

A Change Data Capture is a system that reacts to change of data at some source (in our case the System of Record) by emitting an event that notifies the listeners about the changes that just occurred.
Most Database Management Systems have various CDCs coming out of the box, with a simple user interface that makes it possible to start capturing the data changes and sending them to some destination, usually a message broker like Kafka.

## Projection

A Projection is a representation of the data coming from the System of Record, which have undergone two steps:

1. A filtering of the fields of the original record (i.e. only the fields that you are interested in are going to be saved, so that you don't waste storage for unnecessary information);
2. A data standardization process, to have your data in the exact format you want.

Projections are stored on MongoDB, which means the original data can be transformed in non-flat structures: for example, some fields of the records could become objects or arrays. These transformations are done via Cast Functions.

### Cast Function

Cast Functions, as the name suggests, are JavaScript functions used to transform the data originally coming from the System of Record before it is saved in the Projection.
This is particularly useful when the SoRs use different format. A common case is with date formats: using Cast Functions, you can guarantee all your Projections will have their dates saved in a coherent and consistent way, making querying them an easier and reliable task.

The Console provides basic Cast Functions for the most common use cases, together with the possibility to add custom ones written in plain JavaScript.

## Single View (SV)

A Single View is a document that aggregates data from many Projections, offering business-centric information that is always available and updated in near real-time.
The Single View is updated every time a Projection whose data is used in the Single View changes. This means that aggregation happens as soon as the data changes, instead of when querying data (for this kind of behavior, you should consider using Mongo Views).

### Strategies

Strategies are JavaScript functions that basically retrieve the unique identifiers of the Single View that needs to be updated or created as consequence of the changes on the Projection. The output of the strategies will be used by the Real-Time Updater to record a change in the proper projection-changes collection for each identifier. Later on, the Single View Creator will receive the identifier object to find the correct Single View to update.
