---
id: overview
title: Overview
sidebar_label: Overview
---
This template is meant to be the starting point to build a new typescript project to interact with [*Modefinance*](https://www.modefinance.com/en) APIs.

## Endpoints
The endpoints exposed are designed to be compatible with either Kafka or REST [flow manager service](../../runtime_suite/flow-manager-service/overview), that means the responses are asynchronous. 

The following events are sent by default by the service:
- actionCompleted
- actionError

### POST /s-peek-extended
With this endpoint the service calls [*Modefinance* S-Peek Extended API](https://api.modefinancegate.com/it/doc/v1/index) and proxies the response to the flow manager router service defined in the ROUTER_URL environment variable as follow:

Request
```json
{
    "key": { "type": "string" },
    "value": {
        "type": "object",
        "properties": {
            "messageLabel": "actionCompleted",
            "messagePayload": {
                "mainFlowId": { "type": "string" },
                "fiscalCode": { "type": "string" },
            }
        }
    }
}
```

Response
```json
{
    "key": { "type": "string" },
    "value": {
        "type": "object",
        "properties": {
            "messageLabel": "actionCompleted",
            "messagePayload": {
                "mainFlowId": { "type": "string" },
                "scores": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "key": { "type": "string" },
                            "value": { "type": "number" },
                            "result": { "type": "string" },
                            "timestamp": { "type": "string" },
                            "origin": { "type": "string" },
                            "metadata": { "type": "object" },
                        }
                    } 
                }
            }
        }
    }
}
```
This could be enabled through REST `POST /s-peek-extended` endpoint or Kafka consumer, data to Router is sent using the same mode.


## Errors
If an error occurs the following response will be sent:
```json
{
    "key": { "type": "string" },
    "value": {
        "type": "object",
        "properties": {
            "messageLabel": "actionError",
            "messagePayload": {
                "error": { "type": "string" },
            }
        }
    }
}
```
