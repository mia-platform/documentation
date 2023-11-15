---
id: overview
title: Overview
sidebar_label: Overview
---
This template is meant to be the starting point to build a new typescript project that implements a step to interact with one of the Mia Applications.

## Endpoints
The endpoints exposed are designed to be compatible with either Kafka or REST [flow manager service](../../runtime_suite/flow-manager-service/overview), that means the responses are asynchronous. 

The following events are sent by default by the service:
- processCompleted
- processError
- callbackReceived

### Service
This step will perform the following action:
1. read request data on messagePayload object (e.g. mainFlowId)
2. perform a service step (e.g. call to external provider)
3. send external response into the `messagePayload` object
4. send data mapped following the main saga data schema inside the object `mainFlowData`

Response
```json
{
    "key": "{{mainFlowId}}",
    "value": {
        "messageLabel": "processCompleted",
        "messagePayload": {
            "mainFlowData": {}
        }
    }
}
```
This could be enabled through REST `POST /service` endpoint or Kafka consumer, data to Router is sent using the same mode.

### POST /callback
This endpoint does the following actions:
1. send callback data into the `messagePayload` object
2. send data mapped following the main saga data schema inside the object `mainFlowData`

Response
```json
{
    "key": "{{mainFlowId}}",
    "value": {
        "messageLabel": "callbackReceived",
        "messagePayload": {
            "mainFlowData": {}
        }
    }
}
```

This is only available as REST endpoint, but data to Router can be sent using either REST ot Kafka. 

## Errors
If an error occurs the following response will be sent:
```json
{
    "key": "{{mainFlowId}}",
    "value": {
        "messageLabel": "processError",
        "messagePayload": {
            "error": "error message"
        }
    }
}
```
