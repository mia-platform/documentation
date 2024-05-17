---
id: failure_handling
title: Failure handling
sidebar_label: Failure handling
---

This section aims to clarify the failure handling of Mia-Platform Fast Data. In particular, it lists the recovery mechanisms that are adopted when one of the components (Kafka, MongoDB and Mia-Platform components) of the whole system goes down.

## What happens if Kafka goes down?

An issue on Kafka would cause a temporary misalignment between data on Single View and data on source database. However, this misalignment will be automatically recovered as long as Kafka downtime is less than the configured retention of Write Ahead Logging (WAL) configuration of the source databases (e.g.  Redo Logs for Oracle and MySQL, Write Ahead Logs for Postgres and SQL Server, etc...), which is typically weeks.

:::caution
In case Kafka downtime exceeds Write Ahead Logging (WAL) retention time, a new [initial load](/fast_data/concepts/data_loading.mdx#initial-load) will be needed to recover from the issue.
:::

In particular, the recover mechanism works as follow:
* Kafka process stops or crashes
* CDC stops writing data changes to the topics
* Mia-Platform components stop reading data changes from the topics
* Kafka returns online
* The behavior depends on the configured CDC. The best approach would be that the CDC automatically restarts to publish data changes starting from the last unpublished change
* Mia-Platform automatically restarts to read data from the topics and update the Single Views on MongoDB

## What happens if MongoDB goes down?

An issue on MongoDB would cause the temporary unavailability of APIs exposing the Single View data and temporary misalignment between Single Views data and source databases.
The API will be automatically recovered as soon as MongoDB returns online. The Single Views will be automatically realigned with the source data as long as MongoDB downtime is less than the configured retention time of Kafka topics (which is typically weeks). 

:::caution
In case MongoDB downtime exceeds topics retention time, a new [initial load](/fast_data/concepts/data_loading.mdx#initial-load) will be needed to recover from the issue.
:::

In particular, the recover mechanism works as follow:
* MongoDB process stops or crashes
* Data changes continue to get accumulated on Kafka
* Mia-Platform components stop reading data changes from the topics because they recognize that MongoDB is offline and so Kafka messages cannot be processed
* MongoDB returns online
* Mia-Platform components restart to process Kafka messages that got accumulated in the meanwhile and update the MongoDB views

## What happens if Mia-Platform components go down?

The detection of issues on Mia-Platform components (e.g. pod in crash-loop backoff or consumer lag too high) is done
automatically when deployed on Kubernetes, since they all expose a proper set of status probes that help monitoring also
their internal status. In addition to the K8s recovery mechanism, it is possible to configure a monitoring and alarm
system alongside Mia-Platform Fast Data solution. This allows to understand the state of the system, providing a set of useful metrics about the processing, and construct useful alarms depending on their own requirements. This opt-in alarm system enables the technical team owner of the Fast Data project to be notified as soon as the issue occurs.
More details can be found [here](/fast_data/monitoring/overview.md).

An issue on Mia-Platform components would cause a temporary misalignment between data on Single View and data on the source database. However, this misalignment will be automatically recovered as soon as Mia-Platform components return online.

In particular, the recovery mechanism works as follows:

* Mia-Platform components stop or crash
* Data changes continue to accumulate on Kafka
* Mia-Platform components stop reading data changes from the topics because they are offline
* Mia-Platform components return online
* Mia-Platform components restart to process Kafka messages starting from the last processed message and update the Single Views

In the next paragraphs, some possible failure handling on the Real-Time Updater is described.

### What if Real-Time Updater fails to process a CDC message?

The Real-Time Updater could fail to process a message from ingestion topics for different reasons, e.g. due to the presence of a malformed message on the ingestion topic or due to a violation of a unique index on the MongoDB projection.
In such cases, the service is designed to stop processing messages as soon as it encounters an error. In particular, by configuring the `PAUSE_TOPIC_CONSUMPTION_ON_ERROR` environment variable of the service, you can choose whether to make the service crash (and, therefore, stop consuming from all the ingestion topics) or to make it stop consuming only from the topic where the error occurred.
We do not skip messages because the order of consumption of events does matter in Fast Data. Indeed, skipping messages, and eventually processing them later on, could lead to overriding data with old values.

### How to resume from a Real-Time Updater failure?

Technically, to resume from a failure situation it is sufficient to reset the Kafka offset of the Real-Time Updater's consumer group.

### How do I recognize a Real-Time Updater failure?

In case the Real-Time Updater enters a failure state, this can be recognized due to the following signals:

- the lag of the Kafka consumer group associated to the service starts growing indefinitely, with a sudden unexpected increase occurring at the moment when the error has been encountered
- the service deployed on K8s restarts indefinitely, with service logs showing that one of the component has failed to
process incoming change events

The Fast Data solution can be configured to define an alert on the Kafka consumer group lag metric exposed by the service,
so that the teams can be immediately notified of the channel of preference as soon this unexpected event may appear.

### What are the impacts of a Real-Time Updater failure?

The Single Views involved in the failure will contain not up-to-date data as far as someone takes the resume action.
It is also possible to implement custom automatic resume action to recover without human operations.
It is also possible to implement a mechanism that marks the Single View as "not up-to-date" for the Single View consumer to know that they are consuming data that could be not aligned with the System of Records.

## How Fast Data error codes can be interpreted?

In case Fast Data services encounter an issue, either regarding their configuration or during their runtime,
they generate a set of logs. Among those logs, it is possible to find error codes in the format `FD_AAAA_Eyxxx` representing what caused the failure.
All the error codes Fast Data services may emit are listed within the dedicated [error codes documentation page](/fast_data/troubleshooting/fast_data_error_codes.md),
where it can also be found a brief explanation of the issue with some insights on how to potentially resolve it.
