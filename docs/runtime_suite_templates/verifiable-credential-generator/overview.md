---
id: overview
title: Overview
sidebar_label: Overview
---
## Verifiable Credential

This microservice generate a verifiable credential with the following format:

```
{
  type: 'object',
  properties: {
    '@context': {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    type: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    id: {
      type: 'string',
    },
    issuer: {
      type: 'string',
    },
    issuanceDate: {
      type: 'string',
    },
    expirationDate: {
      type: 'string',
    },
  },
  required: [
    '@context',
    'type',
    'id',
    'issuer',
    'issuanceDate',
    'expirationDate',
  ],
  additionalProperties: false,
}
```
The verifiable credential generated is then returned as a [JWT](https://jwt.io/introduction). 
The schema is defined [here](./src/utils/vcSchema.ts)

## Events

The following events are sent to flow manager:
- verifiableCredentialGenerated
- verifiableCredentialGenerationFailed

The full list of events generated are defined [here](./src/utils/types.ts)

## Endpoint

### POST /saga/generate
The service generate the verifiable credential based on a static schema and the input data.

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

### Customization

Some actions are needed in order to customize the service. 
The project contains some `TODO` comment in order to highlight the necessary actions to take and the function to customize. 
Below, some of the file that you need to customize:
- [Verifiable Credential Schema](./src/utils/vcSchema.ts)
- [Specific logic to create Verifiable Credential](./src/services/vcService.ts)
- [Schemas](./src/utils/schemas.ts)
