---
id: consumer_groups
title: Consumer Groups
sidebar_label: Consumer Groups
---

This Dashboard is mainly concerned with Kafka-related concepts, and a Kafka Exporter service is required for exposing the metrics of interest.

Click <a download target="_blank" href="/docs_files_to_download/consumer-groups.json">**here**</a> to download the dashboard.

### Kafka Exporter Service

This service is responsible for exporting information about Kafka topics, messages, and consumer groups. It is based on [an open-source project](https://github.com/danielqsj/kafka_exporter), so we make use of the Docker image, and then add the relevant configmaps to set it up correctly.

## Panels

The Dashboard contains the following panels, first depicted in sample screenshots, and later described in detail in the table below.

![consumer groups dashboard - part 1](../../img/dashboards/consumer_groups_1.png)
![consumer groups dashboard - part 2](../../img/dashboards/consumer_groups_2.png)

| Panel Name                        | Description                                                                                                                                                                             |
|---------------------------------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Instant Total Messages Behind     | Shows the total amount of messages that need to be read by selected Kafka consumer group (last measurement). A high value for this number could point to insufficient computing power.  |
| Instant consumption rate [msg/s]  | Shows the number of messages per second read by selected Kafka consumer group (last measurement).                                                                                       |
| Published messages                | Shows the number of total messages published on the topic partition.                                                                                                                    |
| Consumed messages                 | Shows the number of total messages that have been read by the consumer group.                                                                                                           |
| Message on 24h - by topic         | Shows the number of messages published on the topic partition during the last 24 hours.                                                                                                 |
| Consumption Rate                  | Shows the number of messages per second read by selected Kafka consumer group.                                                                                                          |
| Total Messages Behind             | Shows the number of messages which have been sent but not consumed. Can be used to understand if some Single View still needs to finish updating.                                       |
| Total Consumers Deployed          | Considering a specific consumer group, counts the number of topics partitions (1 consumer-group for 1 partition) whose offset has changed in the last interval.                         |
| Instant Consumer Lag              | Show for each topic of selected Kafka consumer group the amount of messages that needs to be read (last measurement).                                                                   |
| Published messages per topic      | Shows the number of messages published on the topic partition.
