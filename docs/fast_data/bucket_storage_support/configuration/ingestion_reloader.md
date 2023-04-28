---
id: ingestion_reloader_configuration
title: Ingestion Reloader Configuration
sidebar_label: Ingestion Reloader
---

This page describes how to configure the Ingestion Reloader service, that performs the "reingestion" of the messages (the publishing of old ingestion messages stored on the bucket), to a specified Kafka topic.

## Overview

The reingestion is triggered by a `POST` route, and 3 types of reingestions are supported.

- **File Reingestion**: where the user defines a specific file on the bucket to be reingested to the Kafka topic
- **Topic Reingestion** where the user defines an entire topic to be reingested on the Kafka topic.
  It's also possible to specify a Date interval for the files' selection.
- **Refined by Key Reingestion** where the user defines a specific primary key, and only the latest message with that key will be reingested.

## Service Configuration

In order to connect and authenticate correctly with the bucket and Kafka, please check the relative pages:

* [Bucket connection](/fast_data/bucket_storage_support/configuration/bucket_connection.md)
* [Kafka connection](/fast_data/bucket_storage_support/configuration/kafka_connection.md)

### Environment variables

| Name                           | Required | Description                                                                                                                                                                                           | Default Value      |
|--------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| HTTP_PORT                      | false    | Port exposed by the service                                                                                                                                                                           | 3000               |
| LOG_LEVEL                      | false    | Log level used by the service (e.g. `DEBUG`, `INFO`, `WARN`, `ERROR`)                                                                                                                                 | INFO               |
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
| KEY_PARTITIONS_RELATIVE_PATH   | true     | The relative path where the `Refined By Key` files are stored in the bucket. This path must be shared with the Data Organizer By Key service                                                          | -                  |
| BUCKET_SPLITS                  | true     | The number of splits that the bucket has been configured with. This value must be shared with the Data Organizer By Key service                                                                       | -                  |
| GOOGLE_APPLICATION_CREDENTIALS | false    | The path to the credentials file that allows the access to the Google bucket. Required if `BUCKET_TYPE` is set to `Google`                                                                            | -                  |  

## Routes

<details><summary>Openapi file of the Ingestion Reloader</summary>
<p>

```yaml
openapi: 3.0.3
info:
  title: Ingestion Reloader APIs
  description: This document provides an overview of the different APIs exposed by Ingestion Reloader service
  version: 1.1.0
paths:
  /reingestion/topic:
    post:
      tags:
        - Raw File Re-Ingestion
      description: This API allows to reload messages regarding a specific ingestion topic that were saved on the bucket into another selected topic. When no time range bound is provided, all the messages of selected ingestion topic are produced to the re-ingestion topic.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                topic:
                  type: string
                  description: name of the ingestion topic from which messages were read to be stored on the bucket
                reIngestionTopic:
                  type: string
                  description: name of the topic where messages should be produced to
                startDate:
                  type: string
                  format: date-time
                  description: 'timestamp that defines the lower bound (oldest) on the time interval from which messages should be reloaded. <br>**Note:** the timestamp refers to when messages were produced on Kafka ingestion topic, which may differ from the business timestamp of the record itself'
                stopDate:
                  type: string
                  format: date-time
                  description: 'timestamp that defines the upper bound (newest) on the time interval from which messages should be reloaded. <br>**Note:** the timestamp refers to when messages were produced on Kafka ingestion topic, which may differ from the business timestamp of the record itself'
              required:
                - topic
                - reIngestionTopic
              additionalProperties: false
      responses:
        202:
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  code:
                    type: string
        400:
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  code:
                    type: string
  /reingestion/file:
    post:
      tags:
        - Raw File Re-Ingestion
      description: This API allows to reload messages saved within a specific file stored on the bucket into selected re-ingestion topic.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                fileName:
                  type: string
                  description: full file-path to the file that contains the messages to be produced into the re-ingestion topic
                reIngestionTopic:
                  type: string
                  description: name of the topic where messages should be produced to
              required:
                - fileName
                - reIngestionTopic
              additionalProperties: false
      responses:
        202:
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  code:
                    type: string
        400:
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  code:
                    type: string
  /reingestion/stop-reingestion:
    post:
      tags:
        - Raw File Re-Ingestion
      description: This API allows to stop a reloading process that is currently progress, based on the selected ingestion topic name. This feature can stop only the reingestion by topic process.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                topic:
                  type: string
                  description: ingestion topic name that is currently being reloaded by the service
              required:
                - topic
              additionalProperties: false
      responses:
        200:
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  code:
                    type: string
        400:
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  code:
                    type: string
  /refined-reingestion/by-key:
    post:
      tags:
        - Organized File Re-Ingestion
      description: This API allows to reload into the re-ingestion topic a message with a specific key.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                topic:
                  type: string
                  description: name of the ingestion topic from which selected messages was read to be stored on the bucket
                key:
                  type: string
                  description: string representation of the message key
                reIngestionTopic:
                  type: string
                  description: name of the topic where the retrieved message should be produced to
              required:
                - topic
                - key
                - reIngestionTopic
              additionalProperties: false
      responses:
        202:
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  code:
                    type: string
        400:
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  code:
                    type: string
```
</p>
</details>

The Ingestion Reloader exposes four `POST` routes to trigger its functionalities.

### Reingestion of a Topic

This route allows the user to reingest a topic partially or from the beginning.
The user has to specify the "stored" topic name and the "reingestion" topic name, optionally a filter on the timestamp of the topic may also be specified (with the `startDate` and `stopDate` properties). In this last case, only the records included in the specified time interval will be reingested on the selected topic.

### Reingestion of a File

This route allows the user to reingest a single file from the bucket into the topic specified in the request.
The user has to specify the file name and the reingestion topic.

### Reingestion of a record refined by key

This route allows the user to reingest a record with a specific primary key.
The user has to specify the topic of the record, its primary key and the reingestion topic.
Being this refined data only the latest record with the selected primary key will be reingested.

### Stopping reingestion

This route allows the user to stop the ongoing reingestion of a topic.
The user has to specify the _ingestion_ topic that is currently being reingested.

:::caution
This route can stop only the reingestion of a topic, not the one of a single file.
:::
