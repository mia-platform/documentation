---
id: overview
title: Kango Overview
sidebar_label: Kango
---


_Kango_ (Kafka to Mongo) is a plugin that reads change events from a stream source,
which is Apache Kafka, and saves them onto a sink system, that is MongoDB database.

The common use case for adopting this workload is:
- **Data Sink**: storing data, occurring as events on a data stream, in an optimized manner, so that other applications can quickly retrieve and analyze it.

:::warning

Input messages **must** be compliant with [Fast Data message format](/products/fast_data_v2/concepts.mdx#fast-data-message-format).

:::

Change events read by Kango includes the operation performed on the record, along with its current and previous values (i.e., before and after the modification).

In particular, Kango is able to recognize four different types of change events
operation:

- **create** as `c`: a record was created on the source system
- **read** as `r`: a record is read for the first time from the source system
- **update** as `u`: a record was updated on the source system
- **delete** as `d`: a record was deleted on the source system

Depending on the event operation, the service applies the proper action on the database.
For example, `u` operation is translated onto an update action on the database, while
`d` operation is translated as a delete of the record from the database.
