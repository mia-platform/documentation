---
id: configuration
title: Configuration
sidebar_label: Configuration
---
The `Flow Manager Router` needs the following environment variables to work propertly:
- SUB_FLOW_CONFIGURATION_FILE_PATH path to configuration file with sub flow rules
- MAIN_FLOW_MANAGER_URL url to the `Main Flow Manager` service
- MAIN_SAGA_CRUD_URL url to the `CRUD Service` with the related subflow collection
- EXTERNAL_SERVICE_URL optional url to an external service to call when the `/notify` endpoint is called
- MAX_RETRIES  max number of retries performed by the service
- RETRIES_DELAY_MS delay in milliseconds between two retries

## Configuration File
The configuration files has the following schema:

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "required": [
      "id",
      "info",
      "rules"
    ],
    "properties": {
      "id": {
        "type": "string"
      },
      "info": {
        "type": "object",
        "properties": {
          "flowManagerUrl": {
            "type": "string"
          },
          "crudServiceUrl": {
            "type": "string"
          }
        }
      },
      "rules": {
        "type": "object"
      }
    }
  }
}
```

Below, an example of a valid configuration file:
```json
[
  {
    "id": "customRule",
    "info": {
      "flowManagerUrl": "http://custom-flow-manager-service",
      "crudServiceUrl": "http://crud-service/custom-saga-collection/"
    },
    "rules": {
      "someKey": "someValue",
      "nestedObject": {
        "nestedKey": "nestedValue"
      }
    }
  },
  {
    "id": "default",
    "info": {
      "flowManagerUrl": "http://default-flow-manager-service",
      "crudServiceUrl": "http://crud-service/default-saga-collection/"
    },
    "rules": {}
  }
]

```
