---
id: overview
title: Overview
sidebar_label: Overview
---
This template is meant to be the starting point to build a new typescript project that implements an identification step to interact with the [identification manager application](../../runtime_suite/identification-manager/overview).

## Endpoints
The endpoints exposed are designed to be compatible with [REST flow manager service](../../runtime_suite/flow-manager-service/overview), that means that responses are asynchronous. 

The following events are sent by default by the service:
- identificationCompleted
- identificationError
- callbackReceived

### POST /identifications
This endpoint will perform the following step:
1. read request data on messagePayload object (e.g. mainFlowId)
2. perform identification steps (e.g. call to external provider)
3. send external response into the `messagePayload` object
4. send data mapped following the main saga data schema inside the object `mainFlowData`


Response
```
{
    "key": "{{mainFlowId}}",
    "value": {
        "messageLabel": "identificationCompleted",
        "messagePayload": {
            "mainFlowData": {}
        }
    }
}
```

### POST /callback
This endpoint does the following actions:
1. send callback data into the `messagePayload` object
2. send data mapped following the main saga data schema inside the object `mainFlowData`

Response
```
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

## Errors
If an error occurs the following response will be sent:

```
{
    "key": "{{mainFlowId}}",
    "value": {
        "messageLabel": "identificationError",
        "messagePayload": {
            "error": "error message"
        }
    }
}
```
