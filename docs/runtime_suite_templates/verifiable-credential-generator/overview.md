---
id: overview
title: Overview
sidebar_label: Overview
---
Verifiable credential is an open standard for digital credentials and can be used to represent personal information; this kind of documents are usually generated during the final step of an identification process. 

This template can be used as a starting point to implement a microservice for the verifiable credential generation, and can be used within the [identification manager application](../../runtime_suite/identification-manager/overview).

The verifiable credential generated is then returned as a [JWT](https://www.rfc-editor.org/rfc/rfc7519).

## Endpoint
The endpoint exposed is desinged to be compatible with [REST flow manager service](../../runtime_suite/flow-manager-service/overview), that means that responses are asynchronous. 

### POST /generate
The service generate the verifiable credential based on a static schema and the input data.

The following events can be used in the response:
- verifiableCredentialGenerated
- verifiableCredentialGenerationFailed

Input body:

```
{
    "key": "{{mainFlowId}}",
    "value": {
        "messageLabel": "generateVerifiableCredential",
        "messagePayload": {
            "mainFlowId": "{{mainFlowId}}",
        }
    }
}
```

Response
```
{
    "key": "{{mainFlowId}}",
    "value": {
        "messageLabel": "verifiableCredentialGenerated",
        "messagePayload": {
            "verifiableCredential": "{{verifiableCredentialGenerated}}"
        }
    }
}
```

### Errors
If an error occurs the following event will be sent:
```
{
    "key": "{{mainFlowId}}",
    "value": {
        "messageLabel": "verifiableCredentialGenerationFailed",
        "messagePayload": {
            "verifiableCredentialError": "error message"
        }
    }
}
```
