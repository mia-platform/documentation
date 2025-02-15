---
id: overview
title: Prelios Typescript Template
sidebar_label: Overview
---
`Prelios Typescript Template` is the best template to start creating a service in Typescript, integrated with Prelios APIs.

## Prelios Integration

The template comes with a set of APIs already integrated with Prelios systems.

### POST - /authenticate

This API performs client authentication on Prelios systems. Client information is given by the environment variables `CLIENT_ID` and `CLIENT_SECRET`. The service calls the Prelios API and returns its response and it stores in memory the authentication token so that it can be used by other APIs.

### POST - /start-evaluation

This API allows to start the evaluation of one or more properties on Prelios systems.

#### Request

The caller must provide the header `api-key` with the api-key of the user performing the request. The body must match the following schema:

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "asset_id": { "type": "string" },
      "comune": { "type": "string" },
      "toponimo": { "type": "string" },
      "indirizzo": { "type": "string" },
      "civico": { "type": "string" },
      "provincia": { "type": "string" },
      "belfiore": { "type": "string" },
      "categoriaprincipale": {
        "type": "string",
        "enum": [
          "TV",
          "TU",
          "TS",
          "TF",
          "D8",
          "D7",
          "D1",
          "C6",
          "C3",
          "C2",
          "C1",
          "A11",
          "A10",
          "A8",
          "A7",
          "A6",
          "A5",
          "A4",
          "A3",
          "A2",
          "A1",
        ],
      },
      "mqragguagliati": { "type": "number" },
      "unita_principale": { "type": "boolean" },
      "tipo_immobile": {
        "type": "string",
        "enum": [
          "Residenziale",
          "Ufficio",
          "Commerciale",
          "Industriale",
          "Terreno Agricolo",
        ],
      },
      "tipo_superficie": {
        "type": "string",
        "enum": [
          "MQ",
          "VANI",
          "HA",
          "CA",
        ],
      },
      "ascensore": {
        "type": "number",
        "enum": [
          0,
          1,
        ],
      },
      "stato_manutentivo_edificio": {
        "type": "string",
        "enum": [
          "fatiscente",
          "normale",
          "ristrutturato",
          "nuovo",
        ],
      },
      "stato_manutentivo_unita": {
        "type": "string",
        "enum": [
          "fatiscente",
          "normale",
          "ristrutturato",
          "nuovo",
        ],
      },
      "piano_unita": { "type": "number" },
      "piano_edificio": { "type": "number" },
      "servizi_igienici": { "type": "number" },
      "box_auto": {
        "type": "number",
        "enum": [
          0,
          1,
        ],
      },
    },
    "required": [
      "id",
      "asset_id",
      "comune",
      "toponimo",
      "indirizzo",
      "civico",
      "provincia",
      "belfiore",
      "categoriaprincipale",
      "mqragguagliati",
      "unita_principale",
      "tipo_immobile",
    ],
  },
}
```

#### Response

The service replies with the ID of the created process and pipelines.

Example: 
```json
{
  "ProcessId": "cfff4bbc-207e-45f9-896a-fda07b01fa72",
  "Items": [
    {
      "PipelineId": "80e808eb-4bda-4c7b-9d76-f6d86d4bdc9a"
    }
  ]
}
```

### GET - /check-status

This API allows to check the status of a previously created process given its ID.

#### Request

The caller must provide the header `api-key` with the api-key of the user performing the request.

The query parameter `process_id` is required to perform the request.

#### Response

The service replies with the status of the requested process and the status of each pipeline related to the process.

Example:
```json
{
  "Items": [
    {
      "PipelineId": "20d9dad5-8969-4509-a770-0c79574c06c5",
      "Pipeline Status": "Completed"
    },
    {
      "PipelineId": "80e808eb-4bda-4c7b-9d76-f6d86d4bdc9a",
      "Pipeline Status": "Running"
    }
  ],
  "Global Status": "Running",
  "Progress": "50%"
}
```

:::warning
The field `Items` in the response may be an object (instead of an array) when there is only one pipeline in the process.
:::

### GET - /get-evaluation

This API allows to get the evaluation result of a previously created process/pipeline given their IDs.

#### Request

The caller must provide the header `api-key` with the api-key of the user performing the request.

The query parameters `process_id` and `pipeline_id` are required to perform the request. The response is paginated, thus the caller may put the `page` and `size` query parameters.

#### Response

The service replies with a paginated list of evaluations related to the requested process/pipeline.

Example:
```json
{
  "items": [
    {
      "OMV": 12345,
      "id": "80e808eb-4bda-4c7b-9d76-f6d86d4bdc9a"
    }
  ],
  "total": 1,
  "size": 20,
  "page": 1,
  "pages": 1
}
```

## Custom Plugin Lib

This template leverages Mia Platform [custom-plugin-lib](https://github.com/mia-platform/custom-plugin-lib).  
`custom-plugin-lib` is a [node.js](https://nodejs.org/en/) library developed by Mia-Platform. This library contains configurations and functions that will help you to modify your template with easiness.

If you want to learn how to modify this template and create your node microservice with custom logic, follow this [walkthrough](./20_walkthrough.md).
