---
id: connector_in_depth
title: Salesforce Connector Service In Depth
sidebar_label: Connector in depth
---
## Description

This service connects to a list of StreamingAPI topics and listens to all events sent. Those events are then processed
and sent to a fast data projection. Every message has a corresponding replay id, which is a monotonically increasing
`long` type number. This id can then be used to initialize a StreamingAPI connection that processes all events
created after that id, thus serving as a checkpoint. The retention time of events is 24 hours. Replay ids are used to 
implement a CRUD based checkpoint service that keeps track of a recently processed message. After the service is 
restarted, every connection is initialized to start listening from the saved checkpoint.

The list of StreamingAPI topics, the projections kafka topics and other data are read through a configuration yaml file,
described in later sections.

There are different types of topics, which are distinguished by their prefix.
- PushTopic: topics that start with `/topic/`
- ChangeDataCapture: topics that start with `/data/`
- Custom: topics that start with `/event/`, they don't follow a standard schema, so they may not conform to your
  custom topics

When a message cannot be processed, it is sent to the DLQ; if the DLQ dispatch also fails, an error is logged.

## Custom Topics

Custom topics may differ in schema from the one we currently process. The only requirement is that the `payload` object 
also contains an additional field called `Operation_type__c`, which tells us what operation has generated the event.
It must be one of the following values:
- `"INSERT"`
- `"UPDATE"`
- `"DELETE"`
- `"UNDELETE"`

## FastData Integration Notes

### Projections

The correct way to setup your projections is to name all fields the same way as they are stored in Salesforce tables.
This allows you to receive any field that belongs to the projection, thus not requiring any configuration change 
service side when you need to add, remove or edit a field.

### Using ChangeDataCapture Topics

If you connect CDC topics, pay attention to the version of the Real-Time Updater and the strategies you are using.
CDC topics only send the updated fields, unlike other kinds of topics. Thus, you must use a Real-Time Updater version 
that **supports incremental changes**, i.e. `3.1.2` onward. You also must pay attention to the strategies you write,
as you will receive a `document` object that only contains an aggregation of changes. If you miss critical data,
e.g. a field used to generate the projection change identifier, you need to retrieve the current projection from Mongo
and take the desired value from there.

:::caution Your Real-Time Updater service should use a version that supports incremental changes, i.e. `3.1.2` onward.:::

:::caution Inside a strategy, you will receive a `document` object that only contains an aggregation of changes, not
the whole object.:::

:::info The id field is always given inside `document`.:::

## Known Problems

Sometimes the underlying connectors stop receiving updates, therefore we give the possibility to:
* automatically restart the service at fixed times, expressed in HH:mm format
* automatically reset a topic connection if it doesn't receive messages for a configurable amount of time

Both methods are disabled by default and can be activated via env variables.
We suggest enabling the topic connection reset mechanism. A good value for `INACTIVITY_TIMEOUT_SECONDS` is around 10 
minutes, but it also depends on the traffic you have on your topics.

When configuring automatic service restart, you should also specify the timezone corresponding to the times of restart, 
following the Java Date format, e.g. "Etc/UTC" or "Europe/Rome".

## Pre-Requisites

You must create a CRUD collection named `streamingapi-checkpoints` with the following schema:
- required, non-null String `topic_name`
- required, non-null Number `replay_id`

:::caution Be sure to index `topic_name` as unique.:::

:::caution You need to give the `operation describeconfigs` permission to your kafka user for the `cluster`
resource, otherwise the health check won't work and the service won't be stay up.:::

## Deploy Notes

:::warning This service cannot be replicated, please deploy only one replica.:::
