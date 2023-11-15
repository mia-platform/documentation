---
id: failure_handling
title: Failure handling
sidebar_label: Failure handling
---

This section aims to clarify the failure handling of Mia-Platform Fast Data. In particular, it lists the recovery mechanisms that are adopted when one of the components (Kafka, MongoDB and Mia-Platform components) of the whole system goes down.

## What happens if Kafka goes down?
An issue on Kafka would cause a temporary misalignment between data on Single View and data on source database. However, this misalignment will be automatically recovered as long as Kafka downtime is less than the configured retention of Write Ahead Logging (WAL) configuration of the source databases (e.g.  Redo Logs for Oracle and MySQL, Write Ahead Logs for Postgres and SQL Server, etc...), which is typically weeks.

:::caution
In case Kafka downtime exceeds Write Ahead Logging (WAL) retention time, a new initial load will be needed to recover from the issue.
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
In case MongoDB downtime exceeds topics retention time, a new initial load will be needed to recover from the issue.
:::

In particular, the recover mechanism works as follow:
* MongoDB process stops or crashes
* Data changes continue to get accumulated on Kafka
* Mia-Platform components stop reading data changes from the topics because they recognize that MongoDB is offline and so Kafka messages cannot be processed
* MongoDB returns online
* Mia-Platform components restart to process Kafka messages that got accumulated in the meanwhile and update the MongoDB views

## What happens if Mia-Platform components go down?
The detection of issues on Mia-Platform components (e.g. pod in crash-loop backoff or consumer lag too high) is done by an alarm system that comes out-of-the-box with Mia-Platform Fast Data solution. Details can be found [here](/fast_data/monitoring/overview.md). This allows the technical team owner of the Fast Data project to be notified as soon as the issue occurs.

An issue on Mia-Platform components would cause a temporary misalignment between data on Single View and data on source database. However, this misalignment will be automatically recovered as soon as Mia-Platform components return online.

In particular, the recover mechanism works as follow:
* Mia-Platform components stop or crash
* Data changes continue to get accumulated on Kafka
* Mia-Platform components stop reading data changes from the topics because they are offline
* Mia-Platform components return online
* Mia-Platform components restart to process Kafka messages starting from the last processed message and update the Single Views

## How Fast Data error codes can be interpreted?

In case Fast Data services encounter an issue, either regarding their configuration or during their runtime,
they generate a set of logs. Among those logs it is possible to find errors codes in the format `FD_AAAA_Eyxxx` representing what caused the failure.
All the error codes Fast Data services may emit are listed within the dedicated [error codes documentation page](/fast_data/troubleshooting/fast_data_error_codes.md),
where it can also be found a brief explanation of the issue with some insights on how to potentially resolve it.
