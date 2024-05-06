---
id: overview
title: Overview
sidebar_label: Overview
---
This template is meant to be the starting point to build a new typescript project that implements a step to interact with [Faire.ai](https://platform-dev.faire.ai/docs/) APIs.

## Endpoints
The endpoints exposed are designed to be compatible with either Kafka or REST [flow manager service](../../runtime_suite/flow-manager-service/overview), that means the responses are asynchronous. 

The following events are sent by default by the service:
- actionCompleted
- actionError

### POST /kpis
With this endpoint the service calls [*Faire.ai* KPIs API](https://platform-dev.faire.ai/docs/#tag/kpis/operation/getKpiValue) and proxies the response to the flow manager router service defined in the ROUTER_URL environment variable as follow:

Request
```json
{
    "key": { "type": "string" },
    "value": {
        "type": "object",
        "properties": {
            "messageLabel": "actionCompleted",
            "messagePayload": {
                "type": "object",
                "properties": {
                    "mainFlowId": { "type": "string" },
                    "personId": { "type": "string" },
                    "accountId": { "type": "string" },
                    "kpi": { "type": "string" },
                    "atReferenceDate": { "type": "string" },
                },
                "required": [
                    "mainFlowId"
                ]
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
                "type": "object",
                "properties": {
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
}
```
## Errors
If an error occurs the following response will be sent:
```json
{
    "key": "{{mainFlowId}}",
    "value": {
        "messageLabel": "actionError",
        "messagePayload": {
            "error": "error message"
        }
    }
}
```
