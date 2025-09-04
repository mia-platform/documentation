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

## Service Configuration

In order to connect and authenticate correctly with the bucket and Kafka, please check the relative pages:

* [Bucket connection](/fast_data/bucket_storage_support/configuration/bucket_connection.md)
* [Kafka connection](/fast_data/bucket_storage_support/configuration/kafka_connection.md)

### Environment variables

| Name                           | Required | Description                                                                                                                                                                                             | Default Value      |
|--------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| HTTP_PORT                      | false    | Port exposed by the service                                                                                                                                                                             | 3000               |
| LOG_LEVEL                      | false    | Log level used by the service (e.g. `DEBUG`, `INFO`, `WARN`, `ERROR`)                                                                                                                                   | INFO               |
| QUARKUS_SHUTDOWN_TIMEOUT       | false    | Timeout to shutdown Quarkus application                                                                                                                                                                 | 30                 |
| KAFKA_MAX_POLL_MS              | false    | Maximum amount of milliseconds a poll operation waits before returning obtained records                                                                                                                 | 500                |
| KAFKA_BROKERS                  | true     | Comma separated list of nodes address belonging to a Kafka cluster                                                                                                                                      | -                  |
| KAFKA_GROUP_ID                 | true     | Consumer group identifier employed by this application to share how partitions are consumed among multiple instances of the application                                                                 | -                  |
| KAFKA_USERNAME                 | true     | The Kafka username                                                                                                                                                                                      | -                  |
| KAFKA_PASSWORD                 | true     | The Kafka password                                                                                                                                                                                      | -                  |
| KAFKA_CLIENT_ID                | false    | Client identifier employed by this application                                                                                                                                                          | ingestion-reloader |
| KAFKA_SASL_MECHANISM           | false    | SASL mechanism to employ for logging in Kafka cluster                                                                                                                                                   | SCRAM-SHA-256      |
| KAFKA_DEQUEUE_STRATEGY         | false    | When no consumer group is defined on a topic, it defines which strategy should be applied to consume from the topic the first time                                                                      | latest             |
| KAFKA_MAX_POLL_RECORDS         | false    | Defines the maximum number of messages that each poll operation can return. Independently of this number, each poll operation can return at most a certain amount of bytes configured in the consumer   | 500                |
| BUCKET_NAME                    | true     | The name of the bucket                                                                                                                                                                                  | -                  |
| BUCKET_TYPE                    | true     | The type of the bucket. Can be `google` or `s3`                                                                                                                                                         | -                  |
| KEY_PARTITIONS_RELATIVE_PATH   | true     | The relative path where the `refined by key` files are stored in the bucket.                                                                                                                            | -                  |
| BUCKET_SPLITS                  | true     | The number of possible partition splits that the bucket has been configured with. An example could be 5000                                                                                              | -                  |
| GOOGLE_APPLICATION_CREDENTIALS | false    | The path to the credentials file that allows the access to the Google bucket. Required if `BUCKET_TYPE` is set to `Google`                                                                              | -                  |  
| CONFIGURATIONS_PATH            | false    | Defines the base path of the configurations files | - |

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
                customSelectorName:
                  type: string
                  description: 'name of the custom selection script to be used in the filtering process. `CustomSelectorName` is the name of the file present in $CONFIGURATIONS_PATH/selectors/ without the `.kts` extension'
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
                customSelectorName:
                  type: string
                  description: 'name of the custom selection script to be used in the filtering process. `CustomSelectorName` is the name of the file present in $CONFIGURATIONS_PATH/selectors/ without the `.kts` extension'
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
```
</p>
</details>

The Ingestion Reloader exposes four `POST` routes to trigger its functionalities.

### Reingestion of a Topic
This route allows the user to reingest a topic partially or from the beginning. The user has to specify the "stored" topic name and the "reingestion" topic name. Optionally, a filter on the timestamp of the topic may also be specified (with the startDate and stopDate properties). In this last case, only the records included in the specified time interval will be reingested on the selected topic. Additionally, the user can specify a customSelectorName to use a custom selector script for filtering the messages to be reingested.

### Reingestion of a File
This route allows the user to reingest a single file from the bucket into the topic specified in the request. The user has to specify the file name and the reingestion topic. Additionally, the user can specify a customSelectorName to use a custom selector script for filtering the messages to be reingested.

### Stopping reingestion
This route allows the user to stop the ongoing reingestion of a topic. The user has to specify the ingestion topic that is currently being reingested.

:::caution
This route can stop only the reingestion of a topic, not the one of a single file.
:::

Please refer to the [Custom Selector Feature section](#customer-selectors) for more details on how to use the custom selector feature for precise and targeted filtering of messages to be reingested.
## Customer Selectors

The customSelector feature of the Ingestion Reloader service is a tool that provides additional flexibility when re-ingesting messages from a bucket into a Kafka topic. This feature allows you to implement your own custom filtering logic to select specific messages for re-ingestion.

Let's consider a case where an organization has a Kafka topic that contains messages from different departments, each identified by a `department_id` in the message payload. Suppose there's a requirement to re-ingest only the messages that pertain to a specific department, say the `Marketing` department, into a new topic.

The custom selector feature would be ideal for this. The organization can create a custom selector script that checks if the `department_id` in the message payload is equal to the id of the `Marketing` department. This script will return true for all messages from the "Marketing" department and false for messages from other departments. When the re-ingestion request is made, only the messages from the `Marketing` department would be selected for re-ingestion into the new Kafka topic.

The following is an example of a `.kts` custom selector script for this scenario:

```kotlin
import kotlinx.serialization.json.JsonElement

class MarketingSelector {
    fun check(payload: JsonElement): Boolean {
        return payload.jsonObject["department_id"]?.jsonPrimitive?.content == "marketing"
    }
}

MarketingSelector()
You can trigger the re-ingestion with a cURL command:
```


Here's an example of a `cURL` command to trigger the re-ingestion process using the custom selector script:

```bash
curl -X POST "http://<your_address>:<your_port>/reingestion/topic" \
  -H "accept: */*" \
  -H "Content-Type: application/json" \
  -d "{
    \"topic\":\"source_topic\",
    \"reIngestionTopic\":\"destination_topic\",
    \"customSelectorName\":\"CustomSelector\"
  }"
```

### How to Use the Custom Selector Feature

To utilize the customSelector feature, users can define their own Kotlin scripting logic that adheres to [Custom Selector Script Format](#custom-selector-script-format).

When making a `POST` request to either the `/reingestion/file` or `/reingestion/topic` endpoint, users can include the `customSelectorName` field in the JSON body to specify the name of the custom selector script to be used for filtering.  
**`customSelectorName` should correspond to the name of the custom selector file without the `.kts` extension**, an in-depth detail of the configuration can be found [here](#directory-structure-and-configmaps-for-custom-selector).  

During the re-ingestion process, each message retrieved from the bucket is evaluated against selected custom selector script.  
If the `check` function returns `true` for a particular message, it is selected for re-ingestion into the Kafka topic.  
If the `check` function returns `false`, the message is excluded from the re-ingestion process.

### Custom Selector Script Format

The custom selector script must adhere to a specific format:

- The script must define a class that includes a public `check` method with the following characteristics:
  * It must accept only one parameter of type [`JsonElement`](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-element/).
  * It must return a `Boolean`.
- The script must return an instance of the class itself.

**The Ingestion Reloader service performs validation on the custom selector script**.

For an illustrative example, please refer to the following [section](#custom-selector-script-example).

### Directory Structure and ConfigMaps for Custom Selector

The custom selector feature requires a specific directory structure to function correctly.  
The `CONFIGURATIONS_PATH` environment variable should point to a directory that contains a subdirectory named `/selectors`.  
This `/selectors` subdirectory should contain all the custom selector scripts in `.kts` format. 

:::note
Every custom selector script is fetched and loaded at startup
:::
  

For example, if `CONFIGURATIONS_PATH` is set to `/app/config`, the directory structure should look like this:

```
/app
  /config
    /selectors
      customSelector1.kts
      customSelector2.kts
      ...
```

Each `.kts` file in the `/selectors` subdirectory represents a custom selector script.
In a Kubernetes environment, you can use ConfigMaps to manage and provide the custom selector scripts. You can create a ConfigMap that contains all your `.kts` files and mount it to the pod running the Ingestion Reloader service. The mount path for the ConfigMap should be the `CONFIGURATIONS_PATH` directory. This way, the Ingestion Reloader service can load the custom selector scripts at startup from the specified directory.

This approach allows for easy updates to the custom selector scripts. If you need to update a script or add a new one, you can simply update the ConfigMap and restart the pods. The updated or new scripts will be available to the Ingestion Reloader service at the next startup.

### Custom Selector Script Example

Here's an example of a `.kts` custom selector script:

```kotlin
import kotlinx.serialization.json.JsonElement

class CustomSelector {
    fun check(payload: JsonElement): Boolean {
        // Custom filtering logic goes here
        return payload.jsonObject["property"]?.jsonPrimitive?.content == "value"
    }
}

// Return the instance
CustomSelector()
```

In this example, the script defines a class named `CustomSelector` with a single function `check`.  
The `check` function accepts a [`JsonElement`](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-element/) parameter named `payload`, which represents the message payload retrieved from the bucket.  
The function performs custom filtering logic on the payload, checking if a specific property (`property`) has a certain value (`value` in this case).  
If the condition is met, the function returns `true`; otherwise, it returns `false`.

Please note that this is just an example, and you can customize the `check` function in the script to implement your own custom filtering logic based on the requirements of your re-ingestion process.

