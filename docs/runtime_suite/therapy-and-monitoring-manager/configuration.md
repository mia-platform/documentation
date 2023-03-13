---
id: configuration
title: Configuration
sidebar_label: Configuration
---
The Therapy and Monitoring Manager can be configured to fit the specific scenarios in which it has to be used.

## Environment variables

| Name                            | Required                              | Default             | Description                                                                                                                                                    |
|---------------------------------|---------------------------------------|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **HTTP_PORT**                   | No                                    | 3000                | The port exposed by the service.                                                                                                                               |
| **LOG_LEVEL**                   | No                                    | `info`              | The level of the log: `trace`, `debug`, `info`, `warn`, `error`, `fatal`.                                                                                      |
| **PROTOTYPES_CONFIG_FILE_PATH** | Yes                                   | -                   | Path of the config map file containing the prototypes.                                                                                                         |
| **CRUD_SERVICE_URL**            | No                                    | http://crud-service | HTTP(S) URL of the CRUD service.                                                                                                                               |
| **MESSAGING_SERVICE**           | No                                    | `disabled`          | If you want to use the Messaging Service via `kafka` or `http` (`disabled` by default).                                                                        |
| **MESSAGING_SERVICE_URL**       | If `MESSAGING_SERVICE` is `http`      | -                   | HTTP(S) URL of the Messaging Service.                                                                                                                          |
| **KAFKA_BROKERS_LIST**          | If `MESSAGING_SERVICE` is `kafka`     | -                   |                                                                                                                                                                |
| **KAFKA_CLIENT_ID**             | If `MESSAGING_SERVICE` is `kafka`     | -                   |                                                                                                                                                                |
| **KAFKA_GROUP_ID**              | If `MESSAGING_SERVICE` is `kafka`     | -                   |                                                                                                                                                                |
| **KAFKA_COMMANDS_TOPIC_NAME**   | If `MESSAGING_SERVICE` is `kafka`     | -                   |                                                                                                                                                                |
| **KAFKA_EVENTS_TOPIC_NAME**     | If `MESSAGING_SERVICE` is `kafka`     | -                   |                                                                                                                                                                |
| **KAFKA_AUTH_METHOD**           | If `MESSAGING_SERVICE` is `kafka`     | -                   |                                                                                                                                                                |
| **KAFKA_SASL_USERNAME**         | If `MESSAGING_SERVICE` is `kafka`     | -                   |                                                                                                                                                                |
| **KAFKA_SASL_PASSWORD**         | If `MESSAGING_SERVICE` is `kafka`     | -                   |                                                                                                                                                                |
| **MONITORINGS_CRUD_NAME**       | No                                    | monitorings         | Name of the CRUD collection containing the monitorings.                                                                                                        |
| **THERAPIES_CRUD_NAME**         | No                                    | therapies           | Name of the CRUD collection containing the therapies.                                                                                                          |
| **OBSERVATIONS_CRUD_NAME**      | No                                    | observations        | Name of the CRUD collection containing the observations.                                                                                                       |
| **OBSERVATIONS_GRACE_PERIOD**   | No                                    | 30                  | Number of days after the end of a therapy or monitoring during which adherence and compliance are still updated (in case the patient submit observations late) |
| **OBSERVATIONS_TIME_ZONE**      | No                                    | UTC                 | Default observations time zone. Must be a valid [IANA time zone](https://www.iana.org/time-zones).                                                             |
| **CRON_SCHEDULE**               | No                                    | `0 0 * * *`         | Cron schedule for the computation of the adherence and compliance metrics in the `OBSERVATIONS_TIME_ZONE` time zone.                                           |
| **VALIDATION_SERVICE**          | No                                    | integrated          | If TMM should use the integrated or an external validation service to check thresholds (admitted values: `integrated`, `external`).                            |
| **VALIDATION_SERVICE_URL**      | If `VALIDATION_SERVICE` is `external` | -                   | HTTP(S) URL of the external validation service.                                                                                                                |

## Prototypes definition

As described in the [overview section](./overview.md), the prototypes are essentially JSON Schemas to apply to the entered observations in order to validate the containing values.

You must define the prototypes inside a config map, setting the `PROTOTYPES_CONFIG_FILE_PATH` environment variable with its path. The config map must be a JSON file containing an array of prototypes.

A prototype example can be used to validate observations related to blood pressure. In this case a typical observation is an object composed by two integer values, the minimum and the maximum blood pressure, which must be within a certain range. For instance, entering a maximum blood pressure to 600 is not acceptable. The corresponding prototype would define a JSON Schema validating the fact that the observation value is an object composed by two integer values which must be within specific ranges to be considered valid.

```json
{
  "identifier": "bloodPressure",
  "type": "measurement",
  "name": {
    "en": "Blood Pressure",
    "it": "Pressione sanguigna"
  },
  "schema": {
    "type": "object",
    "properties": {
      "minimumBloodPressure": {
        "type": "integer",
        "minimum": 60,
        "maximum": 150
      },
      "maximumBloodPressure": {
        "type": "integer",
        "minimum": 80,
        "maximum": 250
      }
    },
    "required": [
      "minimumBloodPressure",
      "maximumBloodPressure"
    ]
  },
  "labels": {
    "minimumBloodPressure": {
      "en": "Minimum pressure",
      "it": "Pressione minima"
    },
    "maximumBloodPressure": {
      "en": "Maximum pressure",
      "it": "Pressione massima"
    }
  }
}
```

### Prototype data model

The prototype is a JSON object composed by the following properties.

* **Identifier**: the prototype identifier. This identifier is assigned by the prototype creator, it is not the identifier given by the system and it is used to link the therapy and the monitoring objects.

:::danger
Note that, modifying an identifier in an already running system can lead to inconsistency during observation checks. The identifier should be immutable. If it has to be updated, please be sure that is not already used as reference in the therapies and monitorings objects.
:::

* **Type**: the prototypes type. There are two options:

  * `measurement` refers to observations related to monitorings, in which a patient has to insert a measurement representing its current situation;
  * `therapy` refers to observations related to therapies, in which a patient has to insert the result of the operations provided by the physician.

* **Name**: the prototype name, as a string or translation object. It has no identification purpose and it is used to better identify the prototype objective.

* **Schema**: the property containing the schema used to validate the observation value. The schema must follow [JSON Schema 7](https://json-schema.org/draft-07/json-schema-release-notes.html).

* **Labels**: the labels for the schema fields, each one can be a string or translation object.

## CRUD collections

In order to make the TMM works properly, a set of collections must be configured. These collections must be created by the user of the TMM.
Below the collections and the relative fields to create are described through JSON schemas: 

:::note
Please note that this JSON schemas can be copied and used in the *MongoDB CRUD* section of the console for the creation of the collections.
:::

### Therapies

| Name                            | Type              | Required (Yes/No) | Nullable (Yes/No) |
|---------------------------------|-------------------|-------------------|-------------------|
| planName                        | `string`          | Yes               | No                | 
| prototypeId                     | `string`          | Yes               | No                |
| notes                           | `string`          | No                | No                |
| startDate                       | `Date`            | Yes               | No                |
| endDate                         | `Date`            | No                | No                |
| each                            | `Array of string` | Yes               | No                |
| times                           | `number`          | No                | No                |
| hours                           | `Array of string` | No                | No                |
| doctorId                        | `string`          | Yes               | No                |
| patientId                       | `string`          | Yes               | No                |
| adherenceToleranceTime          | `number`          | No                | No                |
| adherenceToleranceFrequency     | `string`          | No                | No                |
| adherenceMinimumPercentage      | `number`          | No                | No                |
| complianceMinimumPercentage     | `number`          | No                | No                |
| isPatientAdherent               | `boolean`         | No                | No                |
| isPatientAdherentLastUpdatedAt  | `Date`            | No                | No                |
| isPatientCompliant              | `boolean`         | No                | No                |
| isPatientCompliantLastUpdatedAt | `Date`            | No                | No                |

### Monitorings

| Name                            | Type              | Required (Yes/No) | Nullable (Yes/No) |
|---------------------------------|-------------------|-------------------|-------------------|
| planName                        | `string`          | Yes               | No                |
| prototypeId                     | `string`          | Yes               | No                |
| notes                           | `string`          | No                | No                |
| startDate                       | `Date`            | Yes               | No                |
| endDate                         | `Date`            | No                | No                |
| each                            | `Array of string` | Yes               | No                |
| times                           | `number`          | No                | No                |
| hours                           | `Array of string` | No                | No                |
| doctorId                        | `string`          | Yes               | No                |
| patientId                       | `string`          | Yes               | No                |
| adherenceToleranceTime          | `number`          | No                | No                |
| adherenceToleranceFrequency     | `string`          | No                | No                |
| adherenceMinimumPercentage      | `number`          | No                | No                |
| complianceMinimumPercentage     | `number`          | No                | No                |
| isPatientAdherent               | `boolean`         | No                | No                |
| isPatientAdherentLastUpdatedAt  | `Date`            | No                | No                |
| isPatientCompliant              | `boolean`         | No                | No                |
| isPatientCompliantLastUpdatedAt | `Date`            | No                | No                |
| thresholds                      | `Array of object` | No                | No                |

For the field `thresholds` you should add the following JSON Schema to the CRUD configuration:

```json
{
  "properties": {
    "propertyName": {
      "type": "string",
      "description": "Name of the property of the observation value the threshold is evaluated on"
    },
    "thresholdOperator": {
      "type": "string",
      "description": "Name of the operator",
      "enum": [
        "gt",
        "lt",
        "gte",
        "lte",
        "eq"
      ]
    },
    "thresholdValue": {
      "type": "number",
      "description": "Threshold value"
    }
  },
  "required": [
    "propertyName",
    "thresholdOperator",
    "thresholdValue"
  ]
}
```

If the observation value has nested or array fields you can use a dot or bracket notation respectively in the `propertyName` to refer a nested field or an element inside an array.

For example, if the value is an object looking like this:

```json
{ "a": [{ "b": { "c": 3 } }] }
```

then you could use any of the following notations in the `propertyName` field:

- `a[0]` to refer to the first element of the array, that is `{ "b": { "c": 3 } }`;
- `a[0].b` to refer to the value of the `b` field, that is `{ "c": 3 }`;
- `a[0].b.c` to refer to the value of the nested `c` field, that is `3`.

If you are using the integrated validation service, remember that the `propertyName` field must refer a numeric field of the observation value.

### Observations

:::danger

If you use the integrated validation service, field names in the `value` object should only contain alphanumeric characters or underscores due to implementation details. If you use an external service, instead, the TMM has no such limitation.

:::

| Name                   | Type      | Required (Yes/No) | Nullable (Yes/No) |
|------------------------|-----------|-------------------|-------------------|
| planType               | `string`  | Yes               | No                |
| planId                 | `string`  | Yes               | No                |
| value                  | `Object`  | No                | No                |
| observedAt             | `Date`    | Yes               | No                |
| doctorId               | `string`  | No                | No                |
| patientId              | `string`  | Yes               | No                |
| isObservationCompliant | `boolean` | Yes               | No                |

## Thresholds validation

By default, the TMM validates an observation against the thresholds using the integrated service. If you want to use an external service to run custom validations, you need to perform the following steps:

- deploy a custom microservice exposing a HTTP API following the specifications provided in the [section below](configuration.md#external-validation-service-api);
- set the TMM **VALIDATION_SERVICE** [environment variable](configuration.md#environment-variables) to `external`;
- set the TMM **VALIDATION_SERVICE_URL** [environment variable](configuration.md#environment-variables) to the HTTP(s) address of your service (both public and internal cluster URLs will work).

### External Validation Service API

The External Validation Service must expose the following endpoints:

- `POST /validations/` to validate an observation against the monitoring thresholds.

#### `POST /validations/`

The endpoint must accept in the body a JSON object with the following properties:

- `observation`: the observation to validate, an object itself with the same fields available in the [observations CRUD collection](configuration.md#observations);
- `thresholds`: an array of the monitoring thresholds, each one being an object with the same schema of the `thresholds` field of the [monitorings CRUD collection](configuration.md#monitorings).

If the validation is performed without errors, the endpoint must return 200 as status code and a body containing a JSON array, each element representing the result of the validation for a corresponding threshold received in the request (`thresholds`) and the following properties:

- `threshold` (`object`, required): the monitoring threshold (with the same fields as in the request);
- `value` (`any`, required): the value the threshold is evaluated on;
- `status` (`string`, required): a string indicating if the observation exceeded (`KO`) or not (`OK`) the threshold;
- `error` (`string`): if `status` is `KO`, this field must contain an arbitrary string indicating the error type (for example `Threshold Exceeded`);
- `message` (`string`): if `status` is `KO`, this field must contain a human-readable string indicating the error message, useful when sending the notification to the physician (for example, `'minimumBloodPressure' must be lower than 120, but was 140`).

If an error occurs during the validation process, the endpoint should return the appropriate 4xx or 5xx status code. 

:::info

The TMM forwards the response of the validation service to the messaging service in order to notify the physician if the observation exceeded one or more thresholds.
Therefore, in the template of the notification message you can refer any information available in the response of the external validation service.
The integrated validation service produces an identical response, so the template will work exactly the same, no matter which service you use.

:::

## Notifications

:::danger

This section describes the integration with a future version of the messaging service, which is currently under development. The information may not reflect the final specifications of the service and may be subject to breaking changes.

:::

To send notifications to patients and physicians you need to set the `MESSAGING_SERVICE_URL` [environment variable](configuration.md#environment-variables) and configure the events, channels, recipients, ... directly in the messaging service (see the component documentation for more details).

The TMM currently generates the following events you can refer in the configuration of the messaging service:

- `TMM/v1/ThresholdExceeded` is the event generated when an observation exceeds one or more monitoring thresholds.
