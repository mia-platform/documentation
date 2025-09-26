---
id: metrics
title: Metrics
sidebar_label: Metrics
---

The Stream Processor exposes various [Prometheus](https://prometheus.io/) metrics to monitor
the health and performance of the Kafka producer, consumer, and message processing operations.

All metrics are exposed via [OpenTelemetry](https://opentelemetry.io/) and are compatible with
Prometheus scraping. These metrics can be accessed at endpoint `/-/metrics`.

Kafka values are periodically updated by an internal process of
[`librdkafka`](https://github.com/confluentinc/librdkafka). This update period defaults to 10 seconds,
and it can be customized by setting `statistics.interval.ms` property of `librdkafka`.  
However, it is recommended to not configure it and use its default value.

## Service Internal Metrics

These metrics are specific to the service functionality and provide insights into data processing and stream operations.

| Metric name             | Type    | Help                                        | Labels                                                             |
|-------------------------|---------|---------------------------------------------|--------------------------------------------------------------------|
| `sp_processed_messages` | Counter | Number of messages that have been processed | topic=\<topic-name\> partition=\<partition-id\> result=\<ok\|err\> |

## Kafka Producer Metrics

| Metric name                           | Type  | Help                                                                                                  | Labels                                      |
|---------------------------------------|-------|-------------------------------------------------------------------------------------------------------|---------------------------------------------|
| `kafka_producer_replyq`               | Gauge | Number of ops (callbacks, events, etc) waiting in queue for application to serve with rd_kafka_poll() |                                             |
| `kafka_producer_tx_total`             | Gauge | Total number of requests sent to Kafka brokers                                                        |                                             |
| `kafka_producer_tx_bytes_total`       | Gauge | Total number of bytes transmitted to Kafka brokers                                                    |                                             |
| `kafka_producer_rx_total`             | Gauge | Total number of responses received from Kafka brokers                                                 |                                             |
| `kafka_producer_rx_bytes_total`       | Gauge | Total number of bytes received from Kafka brokers                                                     |                                             |
| `kafka_producer_tx_msgs_total`        | Gauge | The total number of messages transmitted (produced) to brokers                                        |                                             |
| `kafka_producer_tx_msgs_bytes_total`  | Gauge | The total number of bytes transmitted (produced) to brokers                                           |                                             |
| `kafka_producer_queue_msgs_count`     | Gauge | The current number of messages in producer queues                                                     |                                             |
| `kafka_producer_queue_msgs_size`      | Gauge | The current total size of messages in producer queues                                                 |                                             |
| `kafka_producer_queue_msgs_max_count` | Gauge | The maximum number of messages allowed in the producer queues                                         |                                             |
| `kafka_producer_queue_msgs_max_size`  | Gauge | The maximum total size of messages allowed in the producer queues                                     |                                             |
| `kafka_producer_broker_rtt_avg`       | Gauge | Broker latency / round-trip time (average)                                                            | node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_producer_broker_rtt_std`       | Gauge | Broker latency / round-trip time (standard deviation)                                                 | node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_producer_broker_rtt_min`       | Gauge | Broker latency / round-trip time (minimum)                                                            | node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_producer_broker_rtt_max`       | Gauge | Broker latency / round-trip time (maximum)                                                            | node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_producer_broker_rtt_p50`       | Gauge | Broker latency / round-trip time (50th percentile)                                                    | node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_producer_broker_rtt_p90`       | Gauge | Broker latency / round-trip time (90th percentile)                                                    | node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_producer_broker_rtt_p95`       | Gauge | Broker latency / round-trip time (95th percentile)                                                    | node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_producer_broker_rtt_p99`       | Gauge | Broker latency / round-trip time (99th percentile)                                                    | node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_producer_broker_throttle_avg`  | Gauge | Broker throttling time (average)                                                                      | node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_producer_broker_throttle_std`  | Gauge | Broker throttling time (standard deviation)                                                           | node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_producer_broker_throttle_min`  | Gauge | Broker throttling time (minimum)                                                                      | node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_producer_broker_throttle_max`  | Gauge | Broker throttling time (maximum)                                                                      | node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_producer_broker_tx_errs`       | Gauge | Total number of transmission errors                                                                   | node_id=\<node-id\> node_name=\<node-name\> |
| `kafka_producer_broker_rx_errs`       | Gauge | Total number of receive errors                                                                        | node_id=\<node-id\> node_name=\<node-name\> |

## Kafka Consumer Metrics

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
- Producer and consumer metrics are automatically collected from `librdkafka` statistics
- Stream processing metrics track message processing success/failure rates
- Queue metrics help monitor internal buffer utilization
- Consumer lag metrics are essential for monitoring processing delays

## Grafana Dashboard

Alongside the service, a Grafana dashboard is released, so that it is possible
to set up a standardize manner to monitor the Stream Processor. This dashboard
can be found here, next to previous releases.

| Name                      | Version  | Link                                                                                                                        |
|---------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------|
| Stream Processor Overview | `v1.0.0` | <a download target="_blank" href="/docs_files_to_download/data-fabric/dashboards/stream-processor_v1.0.0.json">download</a> |
