---
id: kafka_messages
title: Kafka Messages
sidebar_label: Kafka Messages
---

This dashboard is centered around Kafka messages and their whole lifecycle through Kafka, focusing on lag, message production and consumption. Among the features displayed you can find:

- How many messages have been published on each topic
- How many messages have been consumed
- Consumption rate per topic
- Number of consumers deployed throughout time
- ...

To discover all the features you can download the dashboard's json <a download target="_blank" href="/docs_files_to_download/dashboards/kafka-messages.json">**here**</a> and import it on your Grafana portal.

:::note
To use this dashboard you'll need to configure and deploy the [Kafka Exporter](https://github.com/danielqsj/kafka_exporter) service. Also, don't forget to check out the [MongoDB and Apache Kafka metrics](/fast_data/monitoring/overview.md#mongodb-and-apache-kafka-metrics) section.
:::