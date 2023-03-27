---
id: overview
title: Overview
sidebar_label: Overview
---
This template is meant to be the starting point to build a new microservice that implements an identification step to interact with the Identification Manager application.

The project is written in Typescript. 

## Customization
Some actions are needed in order to customize the service. 
The project contains some `TODO` comment in order to highlight the necessary actions to take and the function to customize. 
Below, some of the file that you need to customize:
- [Identification Logic](./src/handlers/identification.ts)
- [Define Identification client logic](./src/clients/identificationClient.ts)
- [Callback logic](./src/handlers/callback.ts)
- [Define Main Flow Data Mapping](./src/services/mainFlowDataMapping.ts)

## Events

The following events are sent:
- identificationCompleted
- identificationError
- callbackReceived

Events are defined [here](./src/services/types.ts). 

## Endpoints

### POST /identifications
This endpoint will perform the the following step:
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
This endpoint will perform the the following step:
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
