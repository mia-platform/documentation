---
id: configuration
title: Configuration
sidebar_label: Configuration
---



The Device Manager needs some configuration in order to be used effectively.

## CRUD collections

To use the Device Manager you need to create the following CRUD collections:

- `devices`: a CRUD collection containing all past and present enrolled devices;
- `health data type`: a CRUD containing the health data type and their schema;
- `health data`: a CRUD containing the health records;

### Devices

This CRUD collection stores all the past and currently enrolled devices, including basic product details, and tracks the patient assigned to each device.

:::tip

You can create the CRUD by importing <a download target="_blank" href="/docs_files_to_download/device-manager/crud_devices.json">this JSON schema</a>.
Remember to set the `CRUD_DEVICES_ENDPOINT` environment variable with the CRUD internal endpoint.

:::

| Name              | Type               | Required | Encryption | Description                                                                                                    |
|-------------------|--------------------|----------|------------|----------------------------------------------------------------------------------------------------------------|
| deviceId          | `string`           | true     | false      | Unique device identifier                                                                                       |
| deviceProvider    | `string`           | true     | false      | Device prodiver (e.g. Medisanté)                                                                               |
| deviceType        | `string`           | true     | false      | Device type (medical, wearable, etc.)                                                                          |
| features          | `Array of strings` | false    | false      | Features supported by the device                                                                               |
| status            | `string`           | false    | false      | Device status (accepted values: `Active`, `Not Active`)                                                        |
| name              | `string`           | false    | false      | Human-friendly device name                                                                                     |
| assignedPatientId | `string`           | false    | false      | ID of the patient the device is assigned to. If the field is missing, the device can be assigned to a patient. |
| serialNumber      | `string`           | false    | false      | Device serial number assigned by the manufacturer                                                              |

### Health Data

This CRUD collection, for each health data received from a device, the raw content and metadata (type, format, etc.) and the normalized version.

:::tip

You can create the CRUD by importing <a download target="_blank" href="/docs_files_to_download/device-manager/crud_health_data.json">this JSON schema</a>.
Remember to set the `CRUD_HEALTH_DATA_ENDPOINT` environment variable with the CRUD internal endpoint.

:::

| Name               | Type     | Required | Encryption | Description                                                                              |
|--------------------|----------|----------|------------|------------------------------------------------------------------------------------------|
| deviceId           | `string` | true     | false      | The ID of the device being the source of the health data                                 |
| patientId          | `string` | false    | false      | The ID of the patient the health data refers to                                          |
| providerId         | `string` | true     | false      | The ID of the provider of the device (e.g. Medisanté)                                    |
| rawData            | `Object` | true     | true       | The original data received from the device in JSON format                                |
| rawDataType        | `string` | false    | false      | The type of the health data received from the device (e.g. blood pressure)               |
| rawDataFormat      | `string` | false    | false      | The format of the health data received from the device (e.g. Medisanté JSON or FHIR)     |
| normalizedData     | `Object` | false    | true       | Normalized health data                                                                   |
| normalizedDataType | `string` | false    | false      | The type of the health data after normalization (e.g. systolic blood pressure)           |
| receivedAt         | `Date`   | true     | false      | When the health data was received by the provider or, if not specified, by the DM itself |
| recordedAt         | `Date`   | false    | false      | When the health data was recorded by the device                                          |

### Health Data Types

This CRUD collection contains all the health data type specifications, including the supported data types (both raw and normalized) and normalization rules (for raw only).

:::tip

You can create the CRUD by importing <a download target="_blank" href="/docs_files_to_download/device-manager/crud_health_data_types.json">this JSON schema</a>.
Remember to set the `CRUD_HEALTH_DATA_TYPE_ENDPOINT` environment variable with the CRUD internal endpoint.

:::

| Name                 | Type               | Required | Encryption | Description                                                                             |
| -------------------- | ------------------ | -------- | ---------- | --------------------------------------------------------------------------------------- |
| identifier           | `string`           | true     | false      | Unique identifier of the data type                                                      |
| code                 | `string`           | false    | false      | Machine-friendly code for the data type (like [LOINC][loinc] or [SNOMED CT][snomed-ct]) |
| name                 | `string`           | false    | false      | Human-friendly name of the data type                                                    |
| version              | `string`           | false    | false      | Data type version                                                                       |
| providerId           | `string`           | false    | false      | ID of the device provider                                                               |
| dataType             | `string`           | false    | false      | The type of the health data (e.g. blood pressure)                                       |
| format               | `string`           | false    | false      | The format of the health data (e.g. Medisanté JSON or FHIR)                             |
| schema               | `Object`           | false    | false      | The JSON schema of the health data                                                      |
| metrics              | `Array of strings` | false    | false      | List of metrics collected included in a sample of the health data                       |
| normalizedDataType   | `string`           | false    | false      | ID of the normalized data type                                                          |
| normalizedDataSchema | `Object`           | false    | false      | The JSON schema of the normalized data                                                  |
| normalizationRules   | `Object`           | false    | false      | Normalization rules                                                                     |

:::warning

The service currently expects the `normalizedDataSchema` to be as follows, otherwise some features like chart visualization may not work as expected:

```json
{
    "type": "object",
    "properties": {
        "period": {
        "type": "object"
        },
        "observations": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
            "code": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "unit": {
                "type": "string"
            },
            "value": {
                "type": "number"
            }
            }
        }
        }
    },
    "required": [
        "observations",
        "period"
    ]
}
```

If you use a different schema the following endpoints may not work as intended:

-   [`GET /prototypes`][get-prototypes]
-   [`GET /chart-data`][get-chart-data]

:::

## Environment variables

| Name                                  | Required | Default                            | Description                                                                                |
| ------------------------------------- | -------- | ---------------------------------- | ------------------------------------------------------------------------------------------ |
| **LOG_LEVEL**                         | No       | `info`                             | Logging level.                                                                             |
| **HTTP_PORT**                         | No       | `3000`                             | The port on which the HTTP server will listen.                                             |
| **USERID_HEADER_KEY**                 | No       | `miauserid`                        | HTTP header key used to identify the user ID.                                              |
| **GROUPS_HEADER_KEY**                 | No       | `miausergroups`                    | HTTP header key for user groups.                                                           |
| **CLIENTTYPE_HEADER_KEY**             | No       | `clienttype`                       | HTTP header key for client type.                                                           |
| **BACKOFFICE_HEADER_KEY**             | No       | `isbackoffice`                     | HTTP header key to indicate if the request is from backoffice.                             |
| **MICROSERVICE_GATEWAY_SERVICE_NAME** | No       | `microservicegateway`              | Name of the microservice gateway service.                                                  |
| **USER_PROPERTIES_HEADER_KEY**        | No       | `miauserproperties`                | HTTP header key for additional user properties.                                            |
| **CRUD_SERVICE_URL**                  | Yes      | `http//crud-service`               | The HTTP(S) URL of the CRUD service.                                                       |
| **CRUD_DEVICES_ENDPOINT**             | Yes      | `/tdm-dm-devices`                  | Internal endpoint of the devices CRUD                                                      |
| **CRUD_HEALTH_DATA_ENDPOINT**         | Yes      | `/tdm-dm-health-data`              | Internal endpoint of the health data CRUD                                                  |
| **CRUD_HEALTH_DATA_TYPE_ENDPOINT**    | Yes      | `/tdm-dm-health-data-type`         | Internal endpoint of the health data types CRUD                                            |
| **TMM_SERVICE_URL**                   | Yes      | `http//therapy-monitoring-manager` | URL of the Therapy Monitoring Manager (TMM)service.                                        |
| **TMM_MONITORINGS_ENDPOINT**          | No       | `/monitorings`                     | Internal endpoint of the TMM monitorings service.                                          |
| **TMM_DETECTIONS_ENDPOINT**           | No       | `/detections`                      | Internal endpoint of the TMM detections.                                                   |
| **TMM_PROTOTYPES_ENDPOINT**           | No       | `/prototypes`                      | Internal endpoint of the TMM prototypes.                                                   |
| **MEDISANTE_PROVIDER**                | No       | `medisante`                        | Identifier for the Medisante data provider.                                                |
| **HEALTHKIT_PROVIDER**                | No       | `healthkit`                        | Identifier for the HealthKit data provider.                                                |
| **STANDARD_JSON_MEDISANTE**           | No       | `medisantestandard-json`           | Identifier for the standard JSON format from Medisante.                                    |
| **STANDARD_JSON_HEALTHKIT**           | No       | `healthkitstandard-json`           | Identifier for the standard JSON format from HealthKit.                                    |
| **MONGODB_URL**                       | Yes      | -                                  | The string to connect to MongoDB database storing information about data acquisition jobs. |
| **DATA_ACQUISITION_JOB_COLLECTION**   | Yes      | `dataAcquisitionJobs`              | The name of the MongoDB collection for data acquisition jobs.                              |


[loinc]: https://loinc.org/
[snomed-ct]: https://www.snomed.org/

[get-chart-data]: /runtime-components/plugins/device-manager/30_usage.md#get-chart-data
[get-prototypes]: /runtime-components/plugins/device-manager/30_usage.md#get-prototypes
