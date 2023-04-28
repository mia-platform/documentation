---
id: ingestion_storer_configuration
title: Ingestion Storer Configuration
sidebar_label: Ingestion Storer
---

This page describes how to configure the Ingestion Storer service which is responsible for consuming messages from a message streaming platform and storing them into a Cloud Storage Bucket.

## Overview

Ingestion Storer service reads the ingestion messages from the chosen message streaming platform. Then those messages are grouped by topic name and partition so they can later be saved in the bucket. This way each stored file contains only messages coming from a single partition, so that multiple service replicas do not interfere with each other. Moreover, this saving logic simplifies potential messages reorganization.

Each time a file is written in the bucket a corresponding output event is emitted on a dedicated topic to notify a write operation has been completed successfully. Optionally, it re-emits ingested messages into _post-ingestion_ topics.

Considering Ingestion Storer service functionalities, it can be introduced within an event-driven architecture in different ways, such as:

- **sequentially** to other services, to store messages on a bucket so that downstream components can proceed reading
ingestion messages only when those records are effectively written to the bucket
- **in parallel** to other services, to store messages transparently with respect to other message processing

A concrete example of these two architecture can be observed within Fast Data context, where the Real-Time Updater service can
read message either from _post-ingestion_ topics fed by the Ingestion Storer (when implementing a [sequential architecture](/fast_data/bucket_storage_support/integration.md#sequential-architecture))
or directly from _ingestion_ topics alongside Ingestion Storer (when implementing a [parallel architecture](/fast_data/bucket_storage_support/integration.md#parallel-architecture)).
In the latter case, _post-ingestion_ messages generation may be disabled since no consumer would read those messages. 

## Service Configuration

In order to connect and authenticate correctly with the bucket and Kafka, please check the relative pages:

* [Bucket connection](/fast_data/bucket_storage_support/configuration/bucket_connection.md)
* [Kafka connection](/fast_data/bucket_storage_support/configuration/kafka_connection.md)

### Environment variables

| Name                           | Required | Description                                                                                                                                                                                           | Default Value      |
|--------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| HTTP_PORT                      | false    | Port exposed by the service                                                                                                                                                                           | 3000               |
| LOG_LEVEL                      | false    | Log level used by the service                                                                                                                                                                         | INFO               |
| QUARKUS_SHUTDOWN_TIMEOUT       | false    | Timeout to shutdown Quarkus application                                                                                                                                                               | 30                 |
| KAFKA_MAX_POLL_MS              | false    | Maximum amount of milliseconds a poll operation waits before returning obtained records                                                                                                               | 500                |
| KAFKA_BROKERS                  | true     | Comma separated list of nodes address belonging to a Kafka cluster                                                                                                                                    | -                  |
| KAFKA_GROUP_ID                 | true     | Consumer group identifier employed by this application to share how partitions are consumed among multiple instances of the application                                                               | -                  |
| KAFKA_USERNAME                 | true     | The Kafka username                                                                                                                                                                                    | -                  |
| KAFKA_PASSWORD                 | true     | The Kafka password                                                                                                                                                                                    | -                  |
| KAFKA_CLIENT_ID                | false    | Client identifier employed by this application                                                                                                                                                        | ingestion-reloader |
| KAFKA_SASL_MECHANISM           | false    | SASL mechanism to employ for logging in Kafka cluster                                                                                                                                                 | SCRAM-SHA-256      |
| KAFKA_DEQUEUE_STRATEGY         | false    | When no consumer group is defined on a topic, it defines which strategy should be applied to consume from the topic the first time                                                                    | latest             |
| KAFKA_MAX_POLL_RECORDS         | false    | Defines the maximum number of messages that each poll operation can return. Independently of this number, each poll operation can return at most a certain amount of bytes configured in the consumer | 500                |
| BUCKET_NAME                    | true     | The name of the bucket                                                                                                                                                                                | -                  |
| BUCKET_TYPE                    | true     | The type of the bucket. Can be `google` or `s3`                                                                                                                                                       | -                  |
| BSS_EVENTS_TOPIC               | true     | Topic where the service should produce messages notifying that a file has been written to the bucket                                                                                                  | -                  |
| BSS_ENABLE_POST_INGESTION      | false    | Select whether ingestion messages should be re-published towards the post-ingestion topics                                                                                                            | true               |
| GOOGLE_APPLICATION_CREDENTIALS | false    | The path to the credentials file that allows the access to the Google bucket. Required if `BUCKET_TYPE` is set to `Google`                                                                            | -                  |

### Service Configuration

When the application is built, the main configuration file is included in it. It is designed so that most
configurable values can be customized through environment variables. However, custom service configuration,
such as the mapping between the _ingestion topics_ and the _post-ingestion_ ones, can and should be customized by end user.
This can be achieved by providing an additional `application.yaml` file in the `configs`
folder located aside the application launcher file.

Example of folder structure:

```shell
|
|--app
    |--application-launcher
    |--configs
      |-- application.yaml
```

This config allows to define the mapping between each ingestion topic and its corresponding
post-ingestion topics, which can be one or more. The service then subscribes to all the `ingestion`
topics provided in the map and forwards the incoming messages (in case it is enabled) towards the post-ingestion ones.

```yaml
bss:
  topics-config:
    data-topics-mapping:
      - ingestion: <input-topic-name-1>
        post-ingestion:
          - <output-topic-name-1>
      - ingestion: <input-topic-name-2>
        post-ingestion:
          - <output-topic-name-2>
```

## File format

The service can subscribe to a number of different ingestion topics. For each topic, a folder
on the bucket is created to contain all the files related to the same ingestion topic. Each created file
is composed by messages coming from a single partition of that ingestion topic.  
Within the file, messages are saved one by line adopting the following JSON format:

```json
{
  "timestamp": {
    "type" : "string",
    "format": "datetime",
    "description": "timestamp when the message was received on the cluster"
  },
  "partition": {
    "type" : "number",
    "description": "partition identifier containing this message"
  },
  "offset": {
    "type" : "number",
    "description": "offset of the message"
  },
  "key": {
    "type" : "string",
    "description": "message key encoded as JSON string"
  },
  "payload": {
    "type" : "string",
    "description": "message payload encoded as JSON string"
  }
}
```

## File naming

Each file is named after the data it contains based on the following convention:

```
<iso-timestamp-first-message-in-batch>_<topic-name>_<partition-number>_<timestamp-message-was-consumed>.txt
```

For example, this is a generated filename:

```
2022-11-14T13:26:37.728Z_fd-bucket-storage.DEV.restaurant.orders.ingestion_0_1668432398047.txt
```

## Event Format

Once the service terminates processing a set of messages coming from a single partition of ingestion topics, it produces
a new message towards the output events Kafka topic (see environment variable `BSS_EVENTS_TOPIC`) to notify downstream
components of such action. The produced event employs the structure reported below:

**Message Key**
```json
{
  "topic": {
    "type": "string",
    "description": "topic name from which messages where consumed"
  },
  "partition": {
    "type": "number",
    "description": "partition identifier from which messages where consumed"
  }
}
```

**Message Payload**
```json
{
  "filePath": {
    "type": "string",
    "description": "full filepath to retrieve saved file from bucket"
  },
  "batchTimeStart": {
    "type": "string",
    "format": "datetime",
    "description": "timestamp of the first message contained in the batch"
  },
  "batchTimeEnd": {
    "type": "string",
    "format": "datetime",
    "description": "timestamp of the last message contained in the batch"
  },
  "batchOffsetStart": {
    "type": "number",
    "description": "offset of the first message contained in the batch"
  },
  "batchOffsetEnd": {
    "type": "number",
    "description": "offset of the last message contained in the batch"
  },
  "batchSize": {
    "type": "number",
    "description": "number of messages contained in the stored file"
  }
}
```