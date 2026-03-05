---
id: metrics
title: Metrics
sidebar_label: Metrics
---


*Kango* service exposes various [Prometheus](https://prometheus.io/) metrics to monitor
the health and performance of the Kafka producer, consumer, and message processing operations.

All metrics are exposed via [OpenTelemetry](https://opentelemetry.io/) and are compatible with
Prometheus scraping. These metrics can be accessed at endpoint `/-/metrics`.

Kafka values are periodically updated by an internal process of
[`librdkafka`](https://github.com/confluentinc/librdkafka). This update period defaults to 10 seconds,
and it can be customized by setting `statistics.interval.ms` property of `librdkafka`.  
However, it is recommended to not configure it and use its default value.

## Service Internal Metrics

These metrics are specific to the service functionality and provide insights into data processing and stream operations.

| Metric name           | Metric type | Description                                                        | Labels                   | Status |
|-----------------------|-------------|--------------------------------------------------------------------|--------------------------|--------|
| `ka_flushed_messages` | Counter     | Number of messages that have been written to the persistence layer | `result`=&lt;ok\|err&gt; | STABLE |

## Kafka Consumer Metrics

These metrics are collected from the underlying Kafka consumer client and provide insights into Kafka connectivity, performance, and consumption behavior.

| Metric name                                     | Type  | Help                                                                                                       | Labels                                                                        |
|-------------------------------------------------|-------|------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `kafka_consumer_replyq`                         | Gauge | Number of ops (callbacks, events, etc) waiting in queue for application to serve with rd_kafka_poll()      | consumer_group=\<consumer-group\>                                             |
| `kafka_consumer_tx_total`                       | Gauge | Total number of requests sent to Kafka brokers                                                             | consumer_group=\<consumer-group\>                                             |
| `kafka_consumer_tx_bytes_total`                 | Gauge | Total number of bytes transmitted to Kafka brokers                                                         | consumer_group=\<consumer-group\>                                             |
| `kafka_consumer_rx_total`                       | Gauge | Total number of responses received from Kafka brokers                                                      | consumer_group=\<consumer-group\>                                             |
| `kafka_consumer_rx_bytes_total`                 | Gauge | Total number of bytes received from Kafka brokers                                                          | consumer_group=\<consumer-group\>                                             |
| `kafka_consumer_rx_msgs_total`                  | Gauge | Total number of messages consumed, not including ignored messages (due to offset, etc), from Kafka brokers | consumer_group=\<consumer-group\>                                             |
| `kafka_consumer_rx_msgs_bytes_total`            | Gauge | Total number of message bytes (including framing) received from Kafka brokers                              | consumer_group=\<consumer-group\>                                             |
| `kafka_consumer_group_state`                    | Gauge | Local consumer group handler's state                                                                       | consumer_group=\<consumer-group\>                                             |
| `kafka_consumer_group_state_age`                | Gauge | Time elapsed since last state change                                                                       | consumer_group=\<consumer-group\>                                             |
| `kafka_consumer_group_rebalance_age`            | Gauge | Time elapsed since last rebalance (assign or revoke)                                                       | consumer_group=\<consumer-group\>                                             |
| `kafka_consumer_group_rebalance_count_total`    | Gauge | Total number of rebalances (assign or revoke)                                                              | consumer_group=\<consumer-group\>                                             |
| `kafka_consumer_group_assigned_partition_count` | Gauge | Current assignment's partition count                                                                       | consumer_group=\<consumer-group\>                                             |
| `kafka_consumer_broker_rtt_avg`                 | Gauge | Broker latency / round-trip time (average)                                                                 | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_broker_rtt_std`                 | Gauge | Broker latency / round-trip time (standard deviation)                                                      | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_broker_rtt_min`                 | Gauge | Broker latency / round-trip time (minimum)                                                                 | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_broker_rtt_max`                 | Gauge | Broker latency / round-trip time (maximum)                                                                 | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_broker_rtt_p50`                 | Gauge | Broker latency / round-trip time (50th percentile)                                                         | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_broker_rtt_p90`                 | Gauge | Broker latency / round-trip time (90th percentile)                                                         | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_broker_rtt_p95`                 | Gauge | Broker latency / round-trip time (95th percentile)                                                         | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_broker_rtt_p99`                 | Gauge | Broker latency / round-trip time (99th percentile)                                                         | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_broker_throttle_avg`            | Gauge | Broker throttling time (average)                                                                           | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_broker_throttle_std`            | Gauge | Broker throttling time (standard deviation)                                                                | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_broker_throttle_min`            | Gauge | Broker throttling time (minimum)                                                                           | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_broker_throttle_max`            | Gauge | Broker throttling time (maximum)                                                                           | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_broker_tx_errs`                 | Gauge | Total number of transmission errors                                                                        | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_broker_rx_errs`                 | Gauge | Total number of receive errors                                                                             | consumer_group=\<consumer-group\> node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_consumer_group_lag`                      | Gauge | Number of messages that the consumer needs to read                                                         | topic=\<topic-name\> partition=\<partition-id\>                               |
| `kafka_consumer_fetch_queue_count`              | Gauge | Number of pre-fetched messages in consumer fetch queue                                                     | topic=\<topic-name\> partition=\<partition-id\>                               |
| `kafka_consumer_fetch_queue_size`               | Gauge | Bytes in consumer fetch queue                                                                              | topic=\<topic-name\> partition=\<partition-id\>                               |

## Usage Notes

- All metrics are collected via OpenTelemetry and can be scraped by Prometheus
- Consumer metrics are automatically collected from `librdkafka` statistics
- Queue metrics help monitor internal buffer utilization
- Consumer lag metrics are essential for monitoring processing delays

## Grafana Dashboard

Alongside the service, a Grafana dashboard is released, so that it is possible
to set up a standardize manner to monitor the _Kango_. This dashboard
can be found here, next to previous releases.

| Name                    | Version  | Link                                                                                                             |
|-------------------------|----------|------------------------------------------------------------------------------------------------------------------|
| Kafka To Mongo Overview | `v1.0.0` | <a download target="_blank" href="/docs_files_to_download/data-fabric/dashboards/kango_v1.0.0.json">download</a> |

