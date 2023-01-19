---
id: usage
title: Usage
sidebar_label: Usage
---
The Therapy and Monitoring Manager exposes different APIs for the management of the Therapy, Monitoring and Observation entities.

## Therapy & Monitoring

The therapy and monitoring data models share the majority of the properties. The common part of the data model is composed by the following properties:

| Name                            | Required (Yes/No) | Description |
|---------------------------------|-------------------|-------------|
| planName                        | Yes               | Name of the therapy or monitoring. | 
| prototypeId                     | Yes               | Identifier of the prototype to use in the validation of the observation values. |
| notes                           | No                | Notes and description of the therapy or monitoring. |
| startDate                       | Yes               | Start date of the therapy or monitoring plan. |
| endDate                         | No                | End date of the therapy or monitoring plan. |
| each                            | Yes               | Frequency expressed in terms of days of week. The array must contain only the value `day` or any combination of days of the week (`monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`). |
| times                           | No                | Frequency expressed in number of repetitions per day. This field is mutually exclusive with `hours`, which must be omitted if this is set. |
| hours                           | No                | Hours at which the patient need to carry out the action prescribed by the physician. This field is mutually exclusive with `times`, which must be omitted if this is set. |
| doctorId                        | Yes               | The reference to the doctor that created the therapy or monitoring. |
| patientId                       | Yes               | The reference to the patient the therapy or monitoring refers to. |
| adherenceToleranceTime          | No                | Time tolerance in terms of hours that can be accepted between the timing prescribed by the physician and the actual timing performed by the patient. If the action performed by the patient exceeds the tolerance, the observation will be marked as non-adherent. This field is considered only when the `hours` field is set. |
| adherenceToleranceFrequency     | No                | Frequency tolerance that can be accepted between the frequency prescribed by the physician and the frequency with which the patient actually performed the actions. This field is considered only when the `times` field is set. |
| adherenceMinimumPercentage      | No                | Minimum ratio expressed in percentage between the number of days when the patient is adherent and the total number of the expected days with observations. For instance, a minimum adherence percentage of 90% means that the patient is considered adherent to the plan if it has completed the assigned tasks on time at least on 9 days out of 10, according to the therapy or monitoring schedule |
| complianceMinimumPercentage     | No                | Minimum ratio expressed in percentage between the number of days when the patient is compliant and the total number of days with observations. A patient is compliant on a given day if all observations for that day are compliant. For example, a minimum compliance percentage of 90% means that the patient is considered compliant if and only if it has completed correctly all assignments on at least 9 days out of 10, according to the compliance definition. |
| isPatientAdherent               | No                | If the patient is adherent to the therapy or monitoring, taking into consideration the tolerance settings. This field is accessible in read-only mode from the API. |
| isPatientAdherentLastUpdatedAt  | No                | Date/time of the last update to the `isPatientAdherent` field. This field is accessible in read-only mode from the API. |
| isPatientCompliant              | No                | If the patient is compliant to the therapy or monitoring, taking into consideration the tolerance settings. This field is accessible in read-only mode from the API. |
| isPatientCompliantLastUpdatedAt | No                | Date/time of the last update of the `isPatientCompliant` field. This field is accessible in read-only mode from the API. |

:::note
The `times` and `hours` fields are overlapping and only one of them needs to be specified. The `times` property must be set when an operation is to be performed a certain number of times within the same day but without specifying the hour of the day. The `hours` property, instead, must be set when an operation has to be performed in determined hours of the day. 
:::

:::note
 The `adherenceToleranceTime` is considered only when `hours` field is defined.
:::

:::note
The `adherenceToleranceFrequency` is considered only when `times` field is defined. 
:::

:::info
For further information on the concepts of adherence and compliance, please refer to the appropriate section on the [Overview page](./overview.md#adherence-and-compliance)
:::

The monitoring data model add the concept of tresholds.

A threshold is an object with the following properties:

* `propertyName`: name of the property on which the treshold is evaluated;
* `tresholdOperator`: operator to use in the treshold evaluation. Available options are: `gt`, `lt`, `gte`, `lte`, `eq`;
* `tresholdValue`: the value with which to evaluate the threshold.

### `GET /<therapies|monitorings>/`

Retrieve all the therapies or monitorings matching a given query. These endpoints are a proxy to the CRUD `GET /` endpoint.

These endpoints accept the following CRUD-like query parameters:

- pagination: `_sk` and `_l`;
- sorting: `_s`;
- filtering: `_q`, `_st_` or any CRUD field name, such as `planName`, `startDate`, `endDate`, `doctorId` and `patientId`.

These endpoints return 200 and an array with the therapies or monitorings matching the query.

### `GET /<therapies|monitorings>/count`

Return the number of therapies or monitorings matching a given query. These endpoints are a proxy to the CRUD `GET /count` endpoint.

These endpoints accept the CRUD-like query parameters to filter the records: `_q`, `_st_` or any CRUD field name, such as `planName`, `startDate`, `endDate`, `doctorId` and `patientId`.

These endpoints return 200 and the number of therapies or monitorings matching the query.

### `POST /<therapies|monitorings>/`

Insert a new therapy or monitoring in the CRUD. These endpoints are a proxy to the CRUD `POST /` endpoint.

The body of the request must contain a JSON object representing a valid therapy or monitoring, for example:

- a therapy to administer drugs every day at 10am for 15 consecutive days starting on June 1st, 2022:

```json
{
  "planName": "Drug therapy",
  "prototypeId": "medication",
  "notes": "Takes an aspirin once a day at 10 AM for 15 days",
  "startDate": "2022-06-01",
  "endDate": "2022-06-15",
  "each": ["day"],
  "hours": ["10"],
  "doctorId": "auth0|doctorId",
  "patientId": "auth0|patientId",
  "adherenceToleranceTime": 1,
  "adherenceMinimumPercentage": 90,
  "complianceMinimumPercentage": 90,
  "isPatientAdherent": true,
  "isPatientCompliant": true
}
```

- a monitoring plan to measure blood pressure twice a day for 15 consecutive days starting on June 1st, 2022:

```json
{
  "planName": "Blood pressure monitoring",
  "prototypeId": "bloodPressure",
  "notes": "Takes the blood pressure twice a day",
  "startDate": "2022-06-01",
  "endDate": "2022-06-15",
  "each": ["day"],
  "times": 2,
  "doctorId": "auth0|doctorId",
  "patientId": "auth0|patientId",
  "adherenceToleranceFrequency": 1,
  "adherenceMinimumPercentage": 90,
  "complianceMinimumPercentage": 90,
  "tresholds": [
    {
      "propertyName": "minimumBloodPressure",
      "tresholdOperator": "gt",
      "tresholdValue": 120
    },
    {
      "propertyName": "minimumBloodPressure",
      "tresholdOperator": "lt",
      "tresholdValue": 60
    }
  ],
  "isPatientAdherent": true,
  "isPatientCompliant": true
}
```

These endpoints return 200 and an object with an `_id` field containing the ID of the created CRUD record.

These endpoints return 400 and a body with the structure shown below if the therapy or monitoring is not valid or is trying to set read-only fields:

```json
{
  "statusCode": 400,
  "error": "Invalid CRUD Resource",
  "message": "<monitoring|therapy> is not valid",
  "requestId": "<Request ID>",
  "resource": {},
  "validationErrors": [
    "Validation error on a field", "Validation error on another field"
  ],
}
```

### `PATCH /<therapies|monitorings>/:id`

Update an existing therapy or monitoring plan identified by the `:id` path parameter. These endpoints are a proxy to the CRUD `PATCH /:id` endpoint.

These endpoints return 400 and a body with the structure shown below if one of following errors occur:

- the client tries to update fields that affect the therapy or monitoring plan, and consequently the adherence and compliance metrics, and one or more observations have already been submitted by the patient:

```json
{
  "statusCode": 400,
  "error": "Invalid CRUD Resource",
  "message": "<monitoring|therapy> is not valid",
  "requestId": "<Request ID>",
  "resource": {},
  "validationErrors": [
    "Patching field <field> after observations have been submitted is not permitted. Please create a new plan instead."
  ],
}
```

- the client tries to update one or more read-only fields:

```json
{
  "statusCode": 400,
  "error": "Invalid CRUD Resource",
  "message": "<monitoring|therapy> is not valid",
  "requestId": "<Request ID>",
  "resource": {},
  "validationErrors": [
    "'<field>' is a read-only property"
  ],
}
```

- the therapy or monitoring plan resulting from the patch is not valid (for example, if after the update both the `times` and `hours` fields would be set):

```json
{
  "statusCode": 400,
  "error": "Invalid CRUD Resource",
  "message": "'Patched <monitoring|therapy> is not valid'",
  "requestId": "<Request ID>",
  "resource": {
    "planName": "Drug therapy",
    "prototypeId": "medication",
    "notes": "Takes an aspirin once a day at 10 AM for 15 days",
    "startDate": "2022-06-01",
    "endDate": "2022-06-15",
    "each": ["day"],
    "hours": ["10"],
    "times": 2,
    "doctorId": "auth0|doctorId",
    "patientId": "auth0|patientId",
    "adherenceToleranceTime": 1,
    "adherenceMinimumPercentage": 90,
    "complianceMinimumPercentage": 90,
    "isPatientAdherent": true,
    "isPatientCompliant": true
  },
  "validationErrors": [
    "'times' and 'hours' are mutually exclusive fields, found both"
  ],
}
```

### `DELETE /<therapies|monitorings>/:id`

Delete an existing therapy or monitoring plan identified by the `:id` path parameter. These endpoints are a proxy to the CRUD `DELETE /:id` endpoint.

These endpoints return 404 if no therapy or monitoring with given id is found.

## Observations

Observations represent tasks performed by the patient and are related to therapies or monitorings. The data model is the following:

| Name                   | Required (Yes/No)   | Description                                                             |
|------------------------|---------------------|-------------------------------------------------------------------------|
| planType               | Yes                 | Type of plan - `therapy` or `monitoring` - the observation refers to.   |
| planId                 | Yes                 | Identifier of the therapy or monitoring plan the observation refers to. |
| value                  | Only for monitoring | The observation value is an arbitrary object and must match the validation schema defined by the associated prototype. Note that the association between the prototype and the observation is not available in the observation data model, but it is defined at the therapy or monitoring level. |
| planId                 | Yes                 | Identifier of the therapy or monitoring plan the observation refers to. |
| observedAt             | Yes                 | Date/time at which the observation has been performed. |
| isObservationCompliant | Yes                 | It indicates if the observation is compliant to what the physician has descripted in the plan. This value is submitted by the patient. |
| doctorId               | No                  | Identifier of the doctor that creates the observation. Note that the doctor that creates the observation can be different from the physician that created the monitoring or therapy plan. |
| patientId              | Yes                 | Identifier of the patient that creates the observation. |

### `GET /observations/`

Retrieve all the observations matching a given query. This endpoint is a proxy to the CRUD `GET /` endpoint.

This endpoint accepts the following CRUD-like query parameters:

- pagination: `_sk` and `_l`;
- sorting: `_s`;
- filtering: `_q`, `_st_` or any CRUD field name, such as `planType` and `planId`.

This endpoint returns 200 and an array with the observations matching the query.

### `GET /observations/count`

Return the number of observations matching a given query. This endpoint is a proxy to the CRUD `GET /count` endpoint.

This endpoint accepts the CRUD-like query parameters to filter the records: `_q`, `_st_` or any CRUD field name, such as `planType`, `planId`, `doctorId` and `patientId`.

These endpoints return 200 and the number of observations matching the query.

### `POST /observations/`

Insert a new observation in the CRUD. This endpoint is a proxy to the CRUD `POST /` endpoint.

The body of the request must contain a JSON object representing a valid observation, like:

```json
{
  "planType": "monitoring",
  "planId": "abc123",
  "isObservationCompliant": true,
  "value": {
    "minimumBloodPressure": 97,
    "maximumBloodPressure": 134
  },
  "observedAt": "2022-06-01T10:00:00.000Z",
  "doctorId": "auth0|doctorId",
  "patientId": "auth0|patientId"
}
```

This endpoint returns 200 and an object with an `_id` field containing the ID of the created CRUD record.

This endpoint returns 400 and a body with the structure shown below if the observation is not valid:

```json
{
  "statusCode": 400,
  "error": "Invalid CRUD Resource",
  "message": "Observation is not valid",
  "requestId": "<Request ID>",
  "resource": {
    "planType": "monitoring",
    "planId": "abc123",
    "isObservationCompliant": true,
    "value": {
      "minimumBloodPressure": 97,
      "maximumBloodPressure": 134
    },
    "observedAt": "2022-06-01T10:00:00.000Z",
    "doctorId": "auth0|doctorId",
    "patientId": "auth0|patientId"
  },
  "validationErrors": [
    "The observation value is required for monitoring plans.",
    "The 'observedAt' string does not represent a valid date/time.",
    "The 'observedAt' date/time cannot be later than now."
  ],
}
```

### `PATCH /observations/:id`

Update an existing observation identified by the `:id` path parameter. This endpoint is a proxy to the CRUD `PATCH /:id` endpoint.

This endpoint returns 404 if one of following errors occur:

- the observation with the given id does not exist (see CRUD response format);
- the monitoring or therapy plan associated to the observation does not exist (see CRUD response format);
- the prototype associated to the therapy or monitoring plan does not exist.

```json
{
  "statusCode": 404,
  "error": "Prototype Not Found",
  "message": "Prototype not found",
  "requestId": "<Request ID>",
  "prototypeId": "<Prototype identifier>",
}
```

This endpoint returns 400 and a body with the structure shown below if one of following errors occur:

- the observation resulting from the patch is not valid (for example if the `observedAt` field is not a valid ISO 8601 date-time string):

```json
{
  "statusCode": 400,
  "error": "Invalid CRUD Resource",
  "message": "Patched observation is not valid",
  "requestId": "<Request ID>",
  "resource": {
    "planType": "monitoring",
    "planId": "abc123",
    "isObservationCompliant": true,
    "value": {
      "minimumBloodPressure": 97,
      "maximumBloodPressure": 134
    },
    "observedAt": "2022-02-31T10:00:00.000Z",
    "doctorId": "auth0|doctorId",
    "patientId": "auth0|patientId"
  },
  "validationErrors": [
    "The 'observedAt' string does not represent a valid date/time."
  ],
}
```

- the observation value, after patching, does not match the prototype:

```json
{
  "statusCode": 400,
  "error": "Observation Not Valid",
  "message": "Observation value does not match prototype schema",
  "requestId": "<Request ID>",
  "observation": {
    "planType": "monitoring",
    "planId": "abc123",
    "isObservationCompliant": true,
    "value": {
      "minimumBloodPressure": 97,
      "maximumBloodPressure": 50
    },
    "observedAt": "2022-02-31T10:00:00.000Z",
    "doctorId": "auth0|doctorId",
    "patientId": "auth0|patientId"
  },
  "prototype": {
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
  },
}
```

### `DELETE /observations/:id`

Delete an existing observation identified by the `:id` path parameter. This endpoint is a proxy to the CRUD `DELETE /:id` endpoint.

This endpoint returns 404 if no observation with given id is found.

## Prototypes

The service uses prototypes to validate therapy and monitoring observations. For futher info about the prototypes and their data model and definition, it is recommended to consult the [overview](./overview.md) page and the [configuration](./configuration.md) page, respectively.

### `GET /prototypes/`

Return all the prototypes matching a given query.

This endpoint supports the following query parameters:

- pagination: `_sk` and `_l`;
- filtering with observation properties: `identifier`, `type` and `name`.

This endpoint returns 200 and a list of the prototypes matching the query.

### `GET /prototypes/count`

Return all the prototypes matching a given query.

This endpoint supports the following query parameters:

- filtering with observation properties: `identifier`, `type` and `name`.

This endpoint returns 200 and the number of prototypes matching the query. 

## Adherence and compliance

:::info

In this section, a day represents the period of time between 00:00:00.000 and 23:59:59.999 in the observations time zone (see [`OBSERVATIONS_TIME_ZONE` environment variable][config-env-vars]).

:::

This service includes a background job running on a given schedule to update adherence and compliance metrics for all *active plans*.

The schedule can be configured by setting the [`CRON_SCHEDULE` environment variable][config-env-vars] using a valid [CRON expression][crontab-guru]. By default, the job runs once a day at midnight according to the time zone set in the [`OBSERVATIONS_TIME_ZONE` environment variable][config-env-vars].

On each execution, the background job computes, for each active plan, the adherence and compliance metrics on all existing observations and update the following monitoring or therapy fields:

- `isPatientAdherent`: if the patient is adherent to the plan;
- `isPatientCompliant`: if the patient is compliant to the plan;
- `isPatientAdherentLastUpdatedAt`, `isPatientCompliantLastUpdatedAt`: the date/time of the update. 

### Active plans

A therapy or monitoring plan is considered active if and only if:

- the start date is earlier than the current date/time;
- the end date is not set or is greater or equal than the current date/time minus the grace period (see [`OBSERVATIONS_GRACE_PERIOD`][config-env-vars]).

For example, if the cron job runs every day at midnight and the grace period is 30 days, we add 30 days to the end date to account for observations submitted during the grace period. We also add one more day to ensure that we correctly update the adherence and compliance metrics for the last day, whenever it ends between two consecutive executions of the background job.

### Adherence computation

The adherence of a patient to a plan is computed according to the following algorithm, executed on all submitted observations.

1. Compute the expected number of days with observations, from the start date of the plan until the last day.
2. Compute, for each day with observations, if the patient is adherent in that specific day.
3. Compute the ratio between the number of days when the patient is adherent and the total number of expected days with observations (from step 1).
4. Compute if the ratio from the previous step, expressed as percentage and rounded to the closest integer, is greater or equal than the `adherenceMinimumPercentage` threshold set for the plan.
5. If the condition at the previous step is satisfied, the patient is reported as adherent.

To determine if a patient is adherent in a specific day (step 2 above) we follow this algorithm.

1. Check if each observation, taken individually, is adherent, meaning that all the following conditions are satisfied:
  - the observation was observed after the plan start date;
  - the observation was observed before the plan end date, if set;
  - the observation was observed before the current date/time (not in the future);
  - the observation was observed on a week day matching the plan (see `each` field);
  - when `hours` field is set, the observation matches at least an hour, within the tolerance.
2. If `times` is set, check that the number of observations is adherent with the plan frequency (`times`) and tolerance (`adherenceToleranceFrequency`).
3. If `hours` is set, check that the observations are adherent to the hours, including tolerance, which means there is exactly one observation for each hour (the earliest observation matching the earliest hour).
4. If and only if all the previous conditions are satisfied the patient is reported to be adherent to the plan in the given day.

### Compliance computation

The compliance of a patient with a plan is computed according to the following algorithm, executed on all submitted observations.

1. Compute, for each day with observations, if the patient is compliant in that specific day, meaning if all observations are compliant (`isObservationCompliant` is `true`).
2. Compute the ratio between the number of days when the patient is compliant and the total number of days with observations.
3. Compute if the ratio from the previous step, expressed as percentage and rounded to the closest integer, is greater or equal than the `complianceMinimumPercentage` threshold set for the plan.
4. If the condition at the previous step is satisfied, the patient is reported as compliant.

[crontab-guru]: https://crontab.guru/ "Crontab.guru"
[config-env-vars]: configuration.md#environment-variables "Configuration - Environment variables"
