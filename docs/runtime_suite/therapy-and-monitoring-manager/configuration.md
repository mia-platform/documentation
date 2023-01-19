---
id: configuration
title: Configuration
sidebar_label: Configuration
---
The Therapy and Monitoring Manager can be configured to fit the specific scenarios in which it has to be used.

## Environment variables

| Name                            | Required | Default             | Description |
|---------------------------------|----------|---------------------|-------------|
| **HTTP_PORT**                   | No       | 3000                | The port exposed by the service. |
| **LOG_LEVEL**                   | No       | `info`              | The level of the log: `trace`, `debug`, `info`, `warn`, `error`, `fatal`. |
| **PROTOTYPES_CONFIG_FILE_PATH** | Yes      | -                   | Path of the config map file containing the prototypes. |
| **CRUD_SERVICE_URL**            | No       | http://crud-service | HTTP(S) URL of the CRUD service. |
| **MONITORINGS_CRUD_NAME**       | No       | monitorings         | Name of the CRUD collection containing the monitorings. |
| **THERAPIES_CRUD_NAME**         | No       | therapies           | Name of the CRUD collection containing the therapies. |
| **OBSERVATIONS_CRUD_NAME**      | No       | observations        | Name of the CRUD collection containing the observations. |
| **OBSERVATIONS_GRACE_PERIOD**   | No       | 30                  | Number of days after the end of a therapy or monitoring during which update adherence and compliance are still updated (in case the patient submit observations late) |
| **OBSERVATIONS_TIME_ZONE**      | No       | UTC                 | Default observations time zone. Must be a valid [IANA time zone](https://www.iana.org/time-zones). |
| **CRON_SCHEDULE**               | No       | `0 0 * * *`         | Cron schedule for the computation of the adherence and compliance metrics in the `OBSERVATIONS_TIME_ZONE` time zone. | 

## Prototypes definition

As described in the [overview section](./overview.md), the prototypes are essentially JSON Schemas to apply to the entered observations in order to validate the containing values.

You must define the prototypes inside a config map, setting the `PROTOTYPES_CONFIG_FILE_PATH` environment variable with its path. The config map must be a JSON file containing an array of prototypes.

A prototype example can be used to validate observations related to blood pressure. In this case a typical observation is an object composed by two integer values, the minimum and the maximum blood pressure, which must be within a certain range. For instance, entering a maximum blood pressure to 600 is not acceptable. The corresponding prototype would define a JSON Schema validating the fact that the observation value is an object composed by two integer values which must be within specific ranges to be considered valid.

```json
{
  "identifier": "bloodPressure",
  "type": "measurement",
  "name": "Blood Pressure Prototype",
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

* **Name**: the prototype name. It has no identification purpose and it is used to better identify the prototype objective.

* **Schema**: the property containing the schema used to validate the observation value. The schema must follow [JSON Schema 7](https://json-schema.org/draft-07/json-schema-release-notes.html).

```json
{
  "identifier": "bloodPressure",
  "type": "measurement",
  "name": "Blood Pressure Prototype",
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
      },
    },
  	"required": [
      "minimumBloodPressure",
      "maximumBloodPressure"
    ]
  }
}
```

## CRUD collections

In order to make the TMM works properly, a set of collections must be configured. These collections must be created by the user of the TMM.
Below the collections and the relative fields to create are described through JSON schemas: 

:::note
Please note that this JSON schemas can be copied and used in the *MongoDB CRUD* section of the console for the creation of the collections.
:::

* **therapies**

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

* **monitorings**

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
| tresholds                       | `Array of object` | No                | No                |

For the field `thresholds` you should add the following JSON Schema to the CRUD configuration:

```json
{
  "properties": {
    "propertyName": {
      "type": "string",
      "description": "Name of the property the threshold is evaluated on"
    },
    "tresholdOperator": {
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
    "tresholdValue": {
      "type": "number",
      "description": "Threshold value"
    }
  },
  "required": [
    "propertyName",
    "tresholdOperator",
    "tresholdValue"
  ]
}
```

* **observations**

| Name                   | Type      | Required (Yes/No) | Nullable (Yes/No) |
|------------------------|-----------|-------------------|-------------------|
| planType               | `string`  | Yes               | No                |
| planId                 | `string`  | Yes               | No                |
| value                  | `Object`  | No                | No                |
| observedAt             | `Date`    | Yes               | No                |
| doctorId               | `string`  | No                | No                |
| patientId              | `string`  | Yes               | No                |
| isObservationCompliant | `boolean` | Yes               | No                |
