---
id: metrics
title: Metrics
sidebar_label: Metrics
---

Mongezium service exposes various [Prometheus](https://prometheus.io/) metrics to monitor
the health and performance of the Kafka producer operations and CDC processing.

All metrics are exposed via [OpenTelemetry](https://opentelemetry.io/) and are compatible with
Prometheus scraping. These metrics can be accessed at endpoint `/-/metrics`.

Kafka values are periodically updated by an internal process of
[`librdkafka`](https://github.com/confluentinc/librdkafka). This update period defaults to 10 seconds,
and it can be customized by setting `statistics.interval.ms` property of `librdkafka`.  
However, it is recommended to not configure it and use its default value.

## Kafka Producer Metrics

| Metric name                           | Type  | Description                                                                                           | Labels                                      |
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

## Usage Notes

- All metrics are collected via OpenTelemetry and can be scraped by Prometheus
- Producer metrics are automatically collected from `librdkafka` statistics
- Queue metrics help monitor internal buffer utilization and detect potential bottlenecks
- Error metrics track transmission and reception failures at the broker level
