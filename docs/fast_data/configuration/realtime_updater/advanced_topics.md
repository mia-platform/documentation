---
id: advanced_topics
title: Real-Time Updater Advanced Settings
sidebar_label: Advanced Settings
---

# Real-Time Updater Advanced Settings

The Real-Time Updater can be enhanced with additional features, that we can list below.

## Compression

Kafka message can be sent using a particular compression encoding. In this section, you will find a list of compressions supported by the microservice. 

This compression mechanisms can also be used by the microservice itself while producing kafka messages, by specifying, starting from version `v7.5.8`, the environment variable `PRODUCER_COMPRESSION`. Allowed values are `gzip`, `snappy` or `none`: if the variable has not been specified, `none` will be the default compression system used by the RTU.

:::caution
Compression and decompression algorithm will always increase the delay between production and consumption of the message, hence it is not advised for strong real-time relying applications; on the other hand, it is well recommended for initial load procedures which tend to produce a huge amount of messages.
:::

### Snappy

Snappy is a compression and decompression library whose aim is to offer high speed data flow while still maintaining a reasonable compression ratio. Among the various types of compression supported by Kafka for its messages, there is also Snappy.

The main advantages of Snappy are:

* Fast compression speed (around 250 MB/sec)
* Moderate CPU usage
* Stability and robustness to prevent crashing while still maintaining the same bitstream format among different versions
* Free and open source

:::note
For further information about Snappy, check the official [GitHub page](https://github.com/google/snappy) of the library.
:::

Provided that the client's **CDC** (Change Data Capture) supports Snappy compression, the console is already predisposed for it.

### GZip

[Gzip](https://www.gnu.org/software/gzip/) is one of the most popular open-source library, initially designed to compress HTTP content.

While it's benefits are a compression up to the 80% of the original message size, is not recommended for real-time scenarios due to the high overhead both on the application and the Kafka cluster. 

## Create ACL rules

It is possible to create ACL rules, you can set from user interface:

* *type*: set **topic** type.
* *topic name*: new or existent one.
* *pattern type*: literal or prefixed. If you want to declare an ACL for each topic you should use **literal**.
* *operation*: for each topic, you should set **READ** and **WRITE** operation.
* *permission*: could be `ALLOW` or `DENY`. You should set **ALLOW**. Once created, by default permission are to deny all others operations.

## Kafka group rebalancing behavior

If a Kafka group rebalancing happens after a projection has already been updated, projection changes will be generated anyway and the Real-Time updater will still try to commit though.

:::note
This behavior has been introduced from `v4.0.0` and above. In previous versions instead, a rebalancing check was made after each operation, and when it happened, the service would stop without generating any projection change.
:::

## CA certs

Since service version `v5.4.0`, you can set your CA certs by providing a path to the certification file in the environment variable `CA_CERT_PATH`.

## Single View Patch

:::info
This feature is supported from version `v7.1.2` of the Real-Time Updater
:::

As explained [here](/fast_data/configuration/single_views.md#single-view-patch), in order to arrange the Real-Time Updater for this specific operation, it's important to understand which are the projections impacted. Then, the following steps have to be followed:

* Activate Projection Updates with the env `GENERATE_KAFKA_PROJECTION_UPDATES`
* Configure the [Projection Updates](#kafka-projection-updates-configuration) only for the specific Projection

## Pause single topic's consumption on error

:::info
This feature is supported from version `v7.1.4` of the Real-Time Updater
:::

When the Real-Time Updater encounters an error while consuming an ingestion message it will just pause the topic's consumption of that message, instead of crashing. This feature is disabled by default, to enable it use the <code>PAUSE_TOPIC_CONSUMPTION_ON_ERROR</code> environment variable.

To use this feature make sure you have properly configured your alerts in your grafana dashboards so you can quickly detect pauses on topics' consumption and act on the problematic message to resume the consumption.
The ideal for that would be to set up some alerts based on the <code>kafka_consumergroup_lag</code> metric exposed by the <code>kafka-exporter</code> service configured in your project.
More on configuring alarms on grafana [here](https://grafana.com/docs/grafana/latest/alerting/alerting-rules/create-grafana-managed-rule/)
