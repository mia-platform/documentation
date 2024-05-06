---
id: overview_connectors
title: Connectors Overview
sidebar_label: Overview
---

This page describes how to connect your data infrastructure to the Fast Data services.

## Overview

Fast Data uses an event streaming platform to ingest in near real-time all the messages regarding changes occurring within your systems (e.g. create, update or delete operations).
Depending on how changes are produced, where your source data is stored and how they can be accessed there can be different ways to produce the corresponding change event on the Fast Data ingestion topics.
The components in charge of transmitting the changes from your systems to the event streaming platform are generally known as **Connectors**.

When data is stored on a database and the changes to be monitored are the action on the database itself, exploiting a Change Data Capture (CDC) system is usually recommended. This system works by detecting changes in the database and emitting the corresponding events in near real-time on the configured event streaming platform so that subsequent components can process the events. Examples of databases on which a CDC can be instantiated are:

- [MySQL](/fast_data/connectors/debezium_cdc.md#mysql)
- [Oracle DB](/fast_data/connectors/debezium_cdc.md#oracle-db)
- [PostgreSQL](/fast_data/connectors/debezium_cdc.md#postgresql)
- [IBM DB2](/fast_data/connectors/debezium_cdc.md#db2)

:::note
The complete list of supported databases can be found in [Debezium documentation](https://debezium.io/documentation/reference/2.2/connectors/index.html).
:::

### How to connect any data source to Fast Data

In general, any application that writes messages onto an event messaging platform adopting one of the formats [accepted by the Real-Time Updater](/fast_data/inputs_and_outputs.md#data-change-message) can act as a Connector.
In particular, it is possible to either write your own [custom Connector](#bring-your-own-cdc) tailored for your unique needs and requirements, or use one of the Connectors available in the Mia-Platform [Marketplace](/plugins/mia-platform-plugins.md).

Some connectors you'll find in the Marketplace:

- [CSV Connector](/runtime_suite_applications/csv-connector/overview.md)
- [Debezium plugin Connectors](/fast_data/connectors/debezium_cdc.md#debezium-server-configuration)
- Kafka Connect Configurator (only available for those who have the Confluent license)

## Change Data Capture Systems

There are different ways to set up a CDC system between your data source and the event messaging platform from which Fast Data ingests messages. In the following paragraphs we explain the main paths currently available.

### Bring Your Own CDC

Set up your own Change Data Capture system within your infrastructure so that you can maintain the control on who can access your data source and customize its settings depending on your specific use case and environment.

This approach has already been tested, verified and it is working in production with the following Change Data Capture software:

- [IBM InfoSphere Data Replication](https://www.ibm.com/products/data-replication)
- [Oracle Golden Gate for Big Data](https://www.oracle.com/integration/goldengate/)
- [Debezium](https://debezium.io/)

Change Data Capture systems described above publish change events in one of the [formats supported by Fast Data](/fast_data/inputs_and_outputs.md#data-change-message). When another CDC system is employed it is important to either verify that such component can produce compatible messages or provide a [_custom message adapter_](/fast_data/configuration/realtime_updater.md#custom) to the Fast Data Real-Time Updater component. In this way Fast Data can easily process change events employing user-defined formats.

### Managed Debezium CDC

[Debezium](https://debezium.io/) is an open-source distributed platform for change data capture. It can be either deployed as a Kafka Connector on the Kafka Connect framework, when employing [Apache Kafka](https://kafka.apache.org/) as event streaming platform or as a standalone service.
In Mia-Platform Marketplace it is possible to find different version of Debezium Server, one for each supported database, which can be used as plugin or template with an almost ready-to-use configuration.
More details can be found in the dedicated Debezium Server configuration [page](/fast_data/connectors/debezium_cdc.md).
