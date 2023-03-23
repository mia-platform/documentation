---
id: overview_connectors
title: Connectors Overview
sidebar_label: Overview
---

This page describe how your system can be connected with Fast Data components to enable data flowing.

## Overview

Fast Data leverages an event streaming platform to ingest in near real-time all the messages regarding changes occurring within your system (e.g. create, update or delete operations).
Depending on how changes are produced, where your source data are stored and how they can be accessed there can be different manners to produce the corresponding change event on the Fast Data ingestion topics.  
These components that moves records or changes over records from the data source to the event streaming platform are generally known as **Connectors**.

When data are stored on a database and the changes to be monitored are the action on the database itself, it is usually recommended to exploit a Change Data Capture (CDC) system. These type of systems work by detecting changes that take place on the database and emit the corresponding event in near real-time on the configured event streaming platform, so that subsequent components can process the events. Example of database on which a CDC can be instantiated are:

- [Oracle DB](https://www.oracle.com/database/)
- [IBM DB2](https://www.ibm.com/products/db2/database)
- [MySQL](https://www.mysql.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/)
- [MongoDB](https://www.mongodb.com/)
- [Apache Cassandra](https://cassandra.apache.org/)

Differently, when data are generated on the fly or are extracted into files adopting a structured or semi-structure format, it is usually a custom application that parses these data changes and generate the corresponding event on the event streaming platform, so that Fast Data components can import and process the source data.  
In general, any application that writes messages onto an event messaging platform adopting one of the formats [accepted by the Real-Time Updater](/fast_data/inputs_and_outputs.md#data-change-message) can act as a Connector.
In particular, it is possible to either write your own custom Connector, tailored for your unique needs and requirements, or exploit one of the Connectors that are available in the Mia-Platform [Marketplace](/runtime_suite/mia-platform-plugins.md).

The custom connectors available in the Marketplace are:

- CSV Connector (coming soon)
- Kafka Connect Configurator (coming soon)

## Change Data Capture Systems

There are different manners to integrate a CDC system in between your data source and the event messaging platform from which Fast Data ingest messages. In the following paragraphs we highlight the main path currently available.

### Bring Your Own CDC

Instantiate your own Change Data Capture system within your infrastructure, so that you can maintain the control on who can access your data source and customize its settings depending on your specific use case and environment.

This approach has already been tested, verified and it is working in production with the following Change Data Capture software:

- [IBM InfoSphere Data Replication](https://www.ibm.com/products/data-replication)
- [Oracle Golden Gate for Big Data](https://www.oracle.com/integration/goldengate/)
- [Debezium](https://debezium.io/)

### Managed Debezium CDC

[Debezium](https://debezium.io/) is an open-source distributed platform for change data capture. It can be either deployed as a Kafka Connector on the Kafka Connect framework, when employing [Apache Kafka](https://kafka.apache.org/) as event streaming platform or as a standalone service.
In Mia-Platform Marketplace it is possible to find different version of Debezium Server, one for each supported database, which can be instantiated as plugin or template with an almost ready-to-use configuration.
More details can be found in the dedicated Debezium Server configuration [page](/fast_data/connectors/debezium_cdc.md).
