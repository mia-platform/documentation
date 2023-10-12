---
id: ingestion_storer_configuration
title: Ingestion Storer Configuration
sidebar_label: Ingestion Storer
---

This page describes how to configure the Ingestion Storer service which is responsible for consuming messages from a message streaming platform and storing them into a Cloud Storage Bucket.

## Overview

The Ingestion Storer service reads the ingestion messages from the chosen message streaming platform. Then those messages are grouped by topic name and partition so they can later be saved in the bucket. This way each stored file contains only messages coming from a single partition, so that multiple service replicas do not interfere with each other. Moreover, this saving logic simplifies potential messages reorganization.

Each time a file is written in the bucket a corresponding output event is emitted on a dedicated topic to notify a write operation has been completed successfully. Optionally, it re-emits ingested messages into _post-ingestion_ topics.

Considering Ingestion Storer service functionalities, it can be introduced within an event-driven architecture in different ways, such as:

- **sequentially** to other services, to store messages on a bucket so that downstream components can proceed reading
ingestion messages only when those records are effectively written to the bucket
- **in parallel** to other services, to store messages transparently with respect to other message processing

A concrete example of these two architecture can be observed within Fast Data context, where the Real-Time Updater service can
read message either from _post-ingestion_ topics fed by the Ingestion Storer (when implementing a [sequential architecture](/fast_data/bucket_storage_support/integration.md#sequential-architecture))
or directly from _ingestion_ topics alongside Ingestion Storer (when implementing a [parallel architecture](/fast_data/bucket_storage_support/integration.md#parallel-architecture)).
In the latter case, _post-ingestion_ messages generation may be disabled since no consumer would read those messages.

Since version `1.5.0` messages are grouped into files of a given, configurable,
size. This feature allows for a faster reingestion since it takes less time to
download larger files and reprocess them by a Kafka producer. This setup
also requires a larger amount of memory to store caches before actual upload.

The service always attempts to bring the topic `lag` to `0`. Naturally, before `1.5.0`,
this was happening as a design choice. After `1.5.0`, caches are automatically committed,
even if the file size is not reached, when a timeout expires. Later, on cache updates files
are updated on the bucket to enforce file size consistency.

## Service Configuration

In order to connect and authenticate correctly with the bucket and Kafka, please check the relative pages:

- [Bucket connection](/fast_data/bucket_storage_support/configuration/bucket_connection.md)
- [Kafka connection](/fast_data/bucket_storage_support/configuration/kafka_connection.md)

### Minimal Production Setup

#### Topics configuration

This service takes a set of topics as input to consume.
The relative configuration can be applied on a file named `application.yaml` using the yaml path `bss.topics-config.data-topics-mapping`
which **MUST** be an array of objects.

Such objects must comply to the following schema

```json
{
  "type": "object",
  "required": ["ingestion"],
  "properties": {
    "ingestion": {"type":  "string"},
    "bucket-folder": {"type": "string"},
    "post-ingestion": {
      "type": "array",
      "items": {"type":  "string"}
    }
  }
}
```

`post-ingestion` is relevant only when `bss.enable-post-ingestion` is `true` and
`bucket-folder` overrides the final destination of messages backup files in the configured bucket.

The service then subscribes to all the `ingestion`
topics provided in the map and forwards the incoming messages (in case it is enabled) towards the post-ingestion ones.

A working example is provided here:

```yaml
bss:
  topics-config:
    data-topics-mapping:
      - ingestion: <input-topic-name-1>
        bucket-folder: <optional-custom-folder> # this field can be omitted entirely and the service would use the ingestion topic as folder name
        post-ingestion:
          - <output-topic-name-1>
      - ingestion: <input-topic-name-2>
        post-ingestion:
          - <output-topic-name-2>
```

#### With GCS bucket

To configure the service to read from a kafka broker to a Google GCS bucket you **MUST**:

1. mount the `application.yaml` file at the location `/app/config/application.yaml`
2. mount the GCS credentials file at `/app/.config/gcloud/application_default_credentials.json` (this path must match the env var _GOOGLE_APPLICATION_CREDENTIALS_)
3. configure kafka via env vars:
   - `KAFKA_BROKERS`: comma separated list of nodes address belonging to a Kafka cluster
   - `KAFKA_GROUP_ID`: **the topic from which to read** and also the consumer group identifier employed by this application to share how partitions are consumed among multiple instances of the application
   - `KAFKA_USERNAME`: username to connect to Kafka cluster
   - `KAFKA_PASSWORD`: password to connect to Kafka cluster
4. configure GCS bucket via env vars:
   - `BUCKET_TYPE`: "google" (a constant value)
   - `BUCKET_NAME`: name of the bucket where files should be uploaded
   - `GOOGLE_APPLICATION_CREDENTIALS`: location of the credentials file
5. configure notifications via env vars:
   - `BSS_EVENTS_TOPIC`: topic where the service should produce **messages notifying** that a file has been written to the bucket

#### With S3 bucket

To configure the service to read from a kafka broker to an AWS S3 bucket you **MUST**:

1. mount the `application.yaml` file at the location `/app/config/application.yaml`
2. configure kafka via env vars:
   - `KAFKA_BROKERS`: comma separated list of nodes address belonging to a Kafka cluster
   - `KAFKA_GROUP_ID`: **the topic from which to read** and also the consumer group identifier employed by this application to share how partitions are consumed among multiple instances of the application
   - `KAFKA_USERNAME`: username to connect to Kafka cluster
   - `KAFKA_PASSWORD`: password to connect to Kafka cluster
3. configure GCS bucket via env vars:
   - `BUCKET_TYPE`: "s3" (a constant value)
   - `BUCKET_NAME`: name of the bucket where files should be uploaded
   - `BUCKET_REGION`: the region of the AWS S3 bucket
   - `S3_KEY_ID`: the service account ID for the AWS S3 bucket
   - `S3_KEY`: the secret key for the AWS S3 bucket
4. configure notifications via env vars:
   - `BSS_EVENTS_TOPIC`: topic where the service should produce **messages notifying** that a file has been written to the bucket

#### With OCI bucket (S3 compatibility)

To configure the service to read from a kafka broker to an Oracle OCI bucket you **MUST**:

1. mount the `application.yaml` file at the location `/app/config/application.yaml`
2. configure kafka via env vars:
   - `KAFKA_BROKERS`: comma separated list of nodes address belonging to a Kafka cluster
   - `KAFKA_GROUP_ID`: **the topic from which to read** and also the consumer group identifier employed by this application to share how partitions are consumed among multiple instances of the application
   - `KAFKA_USERNAME`: username to connect to Kafka cluster
   - `KAFKA_PASSWORD`: password to connect to Kafka cluster
3. configure GCS bucket via env vars:
   - `BUCKET_TYPE`: "s3" (a constant value)
   - `BUCKET_NAME`: name of the bucket where files should be uploaded
   - `BUCKET_REGION`: the region of the OCI bucket
   - `BUCKET_ENDPOINT`: the endpoint which overrides the the AWS S3 bucket standard endpoint pattern with the OCI pattern (from `https://s3.<BUCKET_REGION>.amazonaws.com` to `https://<namespace>.compat.objectstorage.<BUCKET_REGION>.oraclecloud.com`)
   - `S3_KEY_ID`: the service account ID for the OCI bucket
   - `S3_KEY`: the secret key for the OCI bucket
4. configure notifications via env vars:
   - `BSS_EVENTS_TOPIC`: topic where the service should produce **messages notifying** that a file has been written to the bucket

### Complete List Of Environment Variables

Other features of the service can be tuned by using the following complete list of environment variables:

1. service
   - `HTTP_PORT`: (default: 3000) port on which endpoints are exposed
   - `QUARKUS_SHUTDOWN_TIMEOUT`: (default: 30) maximum number of seconds the application can take to gracefully shutdown
   - `LOG_LEVEL`: (default: "INFO") log level employed by the service to log execution details

2. post ingestion and notification
   - `BSS_EVENTS_TOPIC`: (_mandatory_) topic where the service should produce messages notifying that a file has been written to the bucket
   - `BSS_ENABLE_POST_INGESTION`: (default: true) select whether ingestion messages should be re-published towards the post-ingestion topics

3. bucket
   - `BUCKET_NAME`: (_mandatory_) name of the bucket where files should be uploaded
   - `BUCKET_TYPE`: (_mandatory_) type of the bucket where file should be uploaded. Each value load a different class, behavior and might require different authentication requirements. Current possible values are: "google" and "s3"
   - `BUCKET_REGION`: (_S3/OCI mandatory_) the region of the S3/OCI bucket. This variable is employed only when `BUCKET_TYPE` is set to `s3`.
   - `BUCKET_ENDPOINT`: (_OCI mandatory_) the endpoint which overrides the the AWS S3 bucket standard endpoint pattern with the OCI pattern (from `https://s3.<BUCKET_REGION>.amazonaws.com` to `https://<namespace>.compat.objectstorage.<BUCKET_REGION>.oraclecloud.com`). This variable is employed only when `BUCKET_TYPE` is set to `s3`.
   - `GOOGLE_APPLICATION_CREDENTIALS`: (_GCS mandatory_) filepath to the file containing the Google Storage credentials in JSON format. This variable is employed only when `BUCKET_TYPE` is set to `google`.
   - `S3_KEY_ID`: (_S3/OCI mandatory_) the service account ID for the OCI bucket. This variable is employed only when `BUCKET_TYPE` is set to `s3`.
   - `S3_KEY`: (_S3/OCI mandatory_) the secret key for the OCI bucket. This variable is employed only when `BUCKET_TYPE` is set to `s3`.

4. kafka
   - `KAFKA_MAX_POLL_MS`: (default: 500) maximum amount of milliseconds a poll operation waits before returning obtained records
   - `KAFKA_GROUP_ID`: (_mandatory_) consumer group identifier employed by this application to share how partitions are consumed among multiple instances of the application
   - `KAFKA_DEQUEUE_STRATEGY`: (default: "latest") when no consumer group is defined on a topic, it defines which strategy should be applied to consume from the topic the first time. Defaults to `latest` ignoring existing messages
   - `KAFKA_MAX_POLL_RECORDS`: (default: 500) defines the maximum number of messages that each poll operation can return. Independently of this number, each poll operation can return at most a certain amount of bytes configured in the consumer. Defaults to 500
   - `KAFKA_CLIENT_ID`: (default: "message-recorder") client identifier employed by this application. It is always appended to `-ingestion-consumer` (also when defaulted)
   - `KAFKA_BROKERS`: (_mandatory_) comma separated list of nodes address belonging to a Kafka cluster
   - `KAFKA_SASL_MECHANISM`: (default: "SCRAM-SHA-256") SASL mechanism to employ for logging in Kafka cluster
   - `KAFKA_USERNAME`: (_mandatory_) username to connect to Kafka cluster
   - `KAFKA_PASSWORD`: (_mandatory_) password to connect to Kafka cluster

### Full Serice Customization

When the application is built, the main configuration is included within it.
It is designed so that most configurable values can be customized through environment variables.
However, custom Fast Data config, such as the mapping between the ingestion topics and the post-ingestion ones, can and should be configured
at _"runtime"_. This can be achieved by providing an additional `application.yaml` file in the `/app/config`
folder located aside the application launcher file.

Example of folder structure:

```shell
│
└── app
    ├── .config
    │   └── gcloud
    │       └── application_default_credentials.json
    ├── application-launcher
    └── config
        └── application.yaml
```

This config allows to define the mapping between each ingestion topic and its corresponding
post-ingestion topics, which can be one or more. The service then subscribes to all the `ingestion`
topics provided in the map and forwards the incoming messages (in case it is enabled) towards the post-ingestion ones.

```yaml
bss:
  topics-config:
    data-topics-mapping:
      - ingestion: <input-topic-name-1>
        bucket-folder: <optional-custom-folder> # this field can be omitted entirely and the service would use the ingestion topic as folder name
        post-ingestion:
          - <output-topic-name-1>
      - ingestion: <input-topic-name-2>
        post-ingestion:
          - <output-topic-name-2>
```

:::info
Associating a custom bucket folder name to an ingestion topic, via the `bucket-folder` property, allows to override the default folder where ingestion messages are stored, that corresponds to the ingestion topic name.
:::

## File Format and Naming

### Format

The service can subscribe to a number of different ingestion topics. For each topic, a folder
on the bucket is created to contain all the files related to the same topic. Each created file
is composed by messages coming from a single partition of that topic.  
Within the file messages are saved one by line adopting the following JSON format:

```json
{
  "type": "object",
  "properties": {
    "timestamp": {
      "type": "string",
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
}
```

### Naming

Each file is named after the data it contains based on the following convention:

```shell
<iso-timestamp-first-message-in-batch>_<topic-name>_<partition-number>_<offset-first-record-in-batch>_<epoch-timestamp-message-was-consumed>.txt
```

For example, this is a generated filename:

```shell
2022-11-14T13:26:37.728Z_fd-historical-data.DEV.fast-pizza.orders.ingestion_0_312_1668432398047.txt
```

## Event Format

Once the service terminates processing a set of messages coming from a single partition, it emits
a new message on a Kafka topic to notify downstream components of such action. The produced event
employs the structure reported below:

### Message Key

A message key has the following json schema:

```json
{
  "type": "object",
  "properties": {
    "topic": {
      "type": "string",
      "description": "topic name from which messages where consumed"
    },
    "partition": {
      "type": "number",
      "description": "partition identifier from which messages where consumed"
    }
  }
}
```

### Message Payload

A message payload has the following json schema:

```json
{
  "type": "object",
  "properties": {
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
}
```

## Scaling And Fine Tuning

### Memory

The service will allocate, on startup the equivalent of

```shell
bss.max-cache-size * <number of topics> * <number of partitions> + ~100MB
```

This amount depends on the number of replicas of the service you'll deploy and
the partitioning strategies adopted by consumers and brokers.

Roughly on 3 topics with 9 partitions each we'd recommend:

- request: 400
- limit: 600

with 1 topic and 1 partition the service averages a consumption of ~130MB

:::info
We recommend file sizes larger than 5MB. The larger the file size is the larger
backpressure applies on the Kafka consumer due to upload time. This consideration
highly depends on the network latency and the bucket itself.

On the other side, upon download the larger the file size the best streaming capabilities
can be achieved by the reader.
:::

## Service Routes

The service provides status/healthcheck routes for when deployed in a cluster environment:

- `/-/health/live`: liveness endpoint
- `/-/health/ready`: readiness endpoint
- `/-/health/started`: startup endpoint

Moreover `Prometheous` metrics are available at:

- `/-/metrics`: metrics endpoint returning them in `Prometheus` format.
