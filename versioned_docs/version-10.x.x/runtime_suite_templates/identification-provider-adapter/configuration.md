---
id: configuration
title: Configuration
sidebar_label: Configuration
---
The main steps needed to customize the project according to your own business logic are listed below; in addition the project contains some `TODO` comment in order to highlight the necessary steps to customize the service. 

## Environment Variables
The table below shows the environment variables that are used by this service.

| Variable name                   | Variable type                   | Description                                                                    |
|---------------------------------|---------------------------------|--------------------------------------------------------------------------------|
| `ROUTER_URL`                    | `string` (required)             | Base URL for the IDM Router service                                            |
| `IDENTIFICATION_URL`            | `string` (required)             | Base URL for the External identification service                               |
| `MAX_RETRIES`                   | `int`    (required)             | Max retries to perform in case of http call                                    |
| `RETRIES_DELAY_MS`              | `int`    (required)             | Delay between retries in milliseconds                                          |
| `MODE`                          | `string` (default = REST)       | Service working mode. REST or KAFKA                                            |
| `KAFKA_CONFIG_FILE_PATH`        | `string` (optional)             | Path to the file with Kafka configuration                                      |

The Platform variables `USERID_HEADER_KEY`, `GROUPS_HEADER_KEY`, `CLIENTTYPE_HEADER_KEY`, `BACKOFFICE_HEADER_KEY`, `MICROSERVICE_GATEWAY_SERVICE_NAME` are also required.

### Kafka

Kafka can be enabled setting the `MODE` variable to `KAFKA`, in this case the `KAFKA_CONFIG_FILE_PATH` variable is required and `/identification` REST endpoint is disabled.
The configuration has the following schema:
```json
{
  "type": "object",
  "required": [
    "clientId",
    "brokers",
    "authMechanism",
    "username",
    "password",
    "consumerConfig",
    "producerConfig",
  ],
  "properties": {
    "clientId": { "type": "string"},
    "brokers": { "type": "string"},
    "authMechanism": { "type": "string"},
    "username": { "type": "string"},
    "password": { "type": "string"},
    "connectionTimeout": { "type": "number"},
    "authenticationTimeout": { "type": "number"},
    "connectionRetries": { "type": "number"},
    "consumerConfig": {
      "type": "object",
      "required": [
        "groupId",
        "topic",
      ],
      "properties": {
        "topic": { "type": "string" },
        "groupId": { "type": "string" },
        "sessionTimeout": { "type": "number" },
        "rebalanceTimeout": { "type": "number" },
        "heartbeatInterval": { "type": "number" },
        "allowAutoTopicCreation": { "type": "boolean" },
      },
    },
    "producerConfig": {
      "type": "object",
      "required": [
        "topic",
      ],
      "properties": {
        "topic": { "type": "string" },
        "allowAutoTopicCreation": { "type": "boolean" },
      },
    },
  },
}
```

Refer to [KafkaJS](https://kafka.js.org/) for the configuration meanings.

## Identification Logic
In order to customize the identification logic or integrate an external identification service you can modify the following files: 
- `/src/lib/identification.ts`: contains custom identification logic
- `/src/restHandlers/identification.ts` and `/src/kafkaHandlers/identification.ts`: contains identification handlers
- `/src/clients/identificationClient.ts`: contains the logic to perform calls to external service
- `/src/restHandlers/callback.ts`: contains the logic to correctly manage callback from external service

## Identification Data
The identification data extracted can be modified before send them to main flow manager. 
In particular, a mapping function, defined in `/src/services/mainFlowDataMapping.ts`,  is applied by default in order to map the extracted data to the identification manager schema. 

In order to use this template inside the [identification manager application](../../runtime_suite/identification-manager/overview) the extracted data have to follow the schema expected by the application.
