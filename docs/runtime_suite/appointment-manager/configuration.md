---
id: configuration
title: Appointment Manager configuration
sidebar_label: Configuration
---
The Appointment Manager can be used in two different configurations, depending on your use case:

- an **appointments mode**, if you just need to manage appointments;
- a **full mode**, if you need to configure availabilities and exceptions and want to create appointments from slots.

Whatever your use case, to deploy an instance of the microservice you have to configure the required CRUD collection(s) and the microservice itself, as described in the following sections.

## Overview

This section provides a detailed overview of the microservice configuration and the CRUD collections required.

If you are looking for instructions to configure the service in appointments or full mode, look at the [*Appointments mode*](#appointments-mode) and [*Full mode*](#full-mode) sections at the end of the document.

### Service configuration

:::info

**v2.0.0**
Since v2.0.0 two new service configuration fields are supported: `isMessagingAvailable` and `isTimerAvailable`. Together with `isTeleconsultationAvailable`, these three configuration fields allow you to enable or disable the integration with the messaging, timer and teleconsultation service respectively. They are set to `false` by default, so you need to set them explicitly to `true` in order to get the Appointment Manager to generate teleconsultation links, send messages and set reminders.

:::

The service requires you to provide a configuration file in JSON format as a configmap. You can choose the
name and mounting point of the map, as long as you specify the correct path in the `CONFIGURATION_PATH` [environment variable][environment-variables].

Here's an example of a full configuration:

```json
{
  "users": {
    "doctor": {
      "create": "template_id",
      "delete": "template_id",
      "reminder": "template_id"
    },
    "patients": {
      "update": "template_id",
      "reminder": "template_id"
    }
  },
  "channels": ["email", "push", "sms"],
  "reminderThresholdMs": 86400000,
  "isTeleconsultationAvailable": true,
  "isMessagingAvailable": true,
  "isTimerAvailable": true,
  "defaultLockDurationMs": 60000
}
```

A reference presentation of each available field is provided in the following table, more details are available in the following sub-sections.

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| `users` | Yes | - | Templates to use for sending messages (when you `create`, `update` or `delete` an appointment) and reminders (`reminder`) to appointment participants (e.g. `doctor` and `patients`) |
| `channels` | Yes | - | The list of channels to send messages on (currently supported channels: `email`, `push`, `sms`) |
| `reminderThresholdMs` | No | 0 | Send reminders only at least as early before the appointment starts. Zero means the reminders, if enabled, are always sent |
| `isTeleconsultationAvailable` | No | `false` | If the teleconsultation service is available, enable the integration to generate teleconsultation links. |
| `isMessagingAvailable` | No | `false` | If the messaging service is available, enable the integration to send messages and reminders. |
| `isTimerAvailable` | No | `false` | If the timer service is available, enable the integration to set reminders. |
| `defaultLockDurationMs` | No | - | The default duration of the temporary slot lock (in milliseconds). |

#### `users`

With this field you can specify for each category of users which template has to be used when sending messages to notify the different
phases of an appointment lifecycle (see the [service overview](overview.md) for more information).

The structure of the map is the following:

```json
{
  "users_category_name": {
    "create": "template_id",
    "update": "template_id",
    "delete": "template_id",
    "reminder": "template_id"
  }
}
```

As you can see, inside each user category you can specify four fields: **create**, **update**, **delete** and **reminder**.
Each of these fields will allow you to set the template for a specific part of the appointment lifecycle.

In particular, you will have:

- `create`: where you can set the template for messages sent on the **creation of an appointment**
- `update`: where you can set the template for messages sent when **update of an appointment**
- `delete`: where you can set the template for messages sent on the **deletion of an appointment**
- `reminder`: where you can set the template for messages sent when **the appointment reminder expires**.

#### `channels`

In the channels field you can specify the list of channels on which the Appointment Manager will send messages. Possible
values are **email**, **sms**, and **push**.

A correct configuration may be

```json
{
  "channels": ["email", "push"]
}
```

#### `reminderThresholdMs`

This field defines a time threshold (in milliseconds) under which reminders are not sent.
For instance, if you don't want any reminders sent if the created appointment is set to happen below the next 24 hours, 
you can define a threshold of `86400000` ms as follows:

```json
{
  "reminderThresholdMs": 86400000
}
```

This behavior also applies in case of appointment update.
Please also note that if the threshold is not defined, reminders are always sent.

#### `isTeleconsultationAvailable`

A `boolean` which determines if the teleconsultation service can be used.
If the value is set to **false**, the user can't use the teleconsultation.
If the value is set to **true**, the user can choose between teleconsultation or onsite modes.

The default value is **false**.

#### `isMessagingAvailable`

:::info

**v2.0.0**
This configuration field is supported only from v2.0.0

:::

A `boolean` which determines if the messaging service can be used.
If the value is set to **false**, the user can't send messages or reminders.
If the value is set to **true**, the user can configure which messages are sent to which participants.

The default value is **false**.

#### `isTimerAvailable`

:::info

**v2.0.0**
This configuration field is supported only from v2.0.0

:::

A `boolean` which determines if the messaging service can be used.
If the value is set to **false**, the user can't send set reminders.
If the value is set to **true**, the user can configure the reminder templates and thresholds.

The default value is **false**.

#### `defaultLockDurationMs`

This field defines the default duration in milliseconds of the temporary slot lock.
For instance:

```json
{
  "defaultLockDurationMs": 60000
}
```

### Environment variables

The Appointment Manager accepts the following environment variables.

| Name | Required | Description |
|------|----------|-------------|
| **CONFIGURATION_PATH** | Yes | Path of the config map file containing the service configuration. |
| **CRUD_SERVICE_NAME** | Yes | Name of the CRUD service. |
| **RESOURCE_ID_FIELD_NAME** | Yes | Name of the CRUD field containing the resource ID (the field must be present in all CRUD collections). |
| **DEFAULT_TIME_ZONE** | Yes | Default IANA time zone, to be used when no time zone is specified by the client when creating new availabilities. |  
| **APPOINTMENTS_CRUD_NAME** | Yes | Name of the CRUD collection containing the appointments. |
| **AVAILABILITIES_CRUD_NAME** | In full mode | Name of the CRUD collection containing the availabilities. |
| **EXCEPTIONS_CRUD_NAME** | In full mode | Name of the CRUD collection containing the exceptions. |
| **MESSAGING_SERVICE_NAME** | If `isMessagingAvailable` or `isTimerService` is `true` | Name of the Messaging Service. **Required** if you want to send messages or set reminders for your appointments.
| **TIMER_SERVICE_NAME** | If `isTimerService` is `true` | Name of the Timer Service. **Required** if you want to set reminders for your appointments.
| **TELECONSULTATION_SERVICE_NAME** | If `isTeleconsultationAvailable` is `true` | Name of the teleconsultation service. **Required** if you want to create teleconsultations.
| **TELECONSULTATION_ENDPOINT_FE** | If `isTeleconsultationAvailable` is `true` | Endpoint associated with the Teleconsultation Service FrontEnd (the root). **Required** if you want to create teleconsultations.
| **TELECONSULTATION_BASE_PATH** | If `isTeleconsultationAvailable` is `true` | Custom base path for the teleconsultation URL. **Required** if you want to create teleconsultations.

### CRUD collections

The following sections describe the schema of each CRUD collection used by the Appointment Manager.

All the CRUD collections need to have a `string` field with any name of your choice, as long as you specify it in the `RESOURCE_ID_FIELD_NAME` [environment variable][environment-variables], containing the resource ID. This field is necessary to correlate availabilities and appointments to exceptions referring to the same resource. 

#### Appointments CRUD collection

:::info

**v2.0.0**
Starting from v2.0.0 the `slotId` field is no longer used since slots are computed dinamically. The new `availabilityId` field is introduced to link an appointment to an availability and, in combination with `startDate` and `endDate`, to a specific slot.
Since the slots CRUD collection is no longer used, this CRUD collection also stores the appointment reservations and inherits from the slots CRUD collection two fields: `status` and `lockExpiration`.
A new `isFlagged` field is added to track the appointments whose slots are no longer valid and may need to be rescheduled.

:::

The Appointment Manager requires a CRUD containing the appointments. The collection can have any name you want, as long as you specify the correct name in the `APPOINTMENTS_CRUD_NAME` [environment variable][environment-variables].

The appointments collection must have the following fields:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| startDate | `date` | Yes | Start date/time expressed in format ISO 8601. |
| endDate | `date` | Yes | End date/time expressed in format ISO 8601. |
| availabilityId | `string` | In full mode | ID of the appointment's related availability. |
| ownerId | `string` | In full mode | User who booked the appointment. |
| reminderMilliseconds | `number` | No | Amount of time before the appointment when users are notified about it (expressed in milliseconds). |
| reminderIds | `array of ObjectId` | No | List of unique identifiers of the reminders associated with the appointment. |
| channels | `array of string` | No | List of communication channels used to send messages and reminders. Possible values are **email**, **sms**, and **push**. |
| isRemote | `boolean` | No | If an appointment will use the teleconsultation or not. |
| linkTeleconsultation | `string` | No | The link to join the teleconsultation. |
| isFlagged | `boolean` | No | If an appointment may need to be rescheduled because the associated slot is no longer available. |
| status | `string` | Yes | The status of the appointment: `AVAILABLE` (reserved but not confirmed) or `BOOKED` (confirmed). |
| lockExpiration | `date` | No | The expiration of the slot's temporary lock (expressed in format **ISO 8601**), set when the slot is locked with the `PATCH /slots/lock/:id`. |

:::tip

On top of the aforementioned fields, you can add any field you want to the CRUD. The service will treat them as the CRUD would.

:::

:::warning

If you want to use the Appointment Manager in conjunction with the Calendar component of the Backoffice, you need to add a required property **title (string)** to your CRUD.

:::

As explained in the [service overview](overview.md), the service assumes that the users involved in an appointment are
contained in one or more attributes of the appointment itself.

When you create your CRUD you will need to create a new field for each category of users you will need to involve in the
event. These fields have to be of type `string` or `array of string`.

#### Availabilities CRUD collection

:::info

**v2.0.0**
Starting from v2.0.0 a document in the availabilities CRUD collection represents a single or recurring availability, while the daily occurrences of each availability are computed dynamically.
For users coming from version 1.x.x, the field `slotIds` is no longer used since slots are computed dinamically, and we use the unique identifier generated from the CRUD for each availability to replace `recurrenceUuid`.

The new `availabilityId` field is introduced to link an appointment to an availability and, in combination with `startDate` and `endDate`, to a specific slot.

:::

The Appointment Manager can also have a CRUD containing the availabilities. The collection can have any name you want, as long as you
specify the correct name in the `AVAILABILITIES_CRUD_NAME` [environment variable][environment-variables].

The availabilities collection must have the following fields:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| startDate | `date` | Yes | Start date/time of the first occurrence of the availability, expressed in format **ISO 8601** |
| endDate | `date` | Yes | End date/time of the first occurrence of the availability, expressed in format **ISO 8601** |
| slotDuration | `number` | Yes | The duration of the slot (in minutes) |
| simultaneousSlotsNumber | `number` | Yes | The number of appointments you can book in each slot. |
| each | `string` | No | The frequency of a recurring availability: daily (`day`), weekly (`week`) or monthly (`month`). |
| on | `Array of number` | No | The weekdays on which a weekly availability occurs (0 for Sunday, 1 for Monday, 2 for Tuesday, and so on). |
| untilDate | `date` | No | The expiration date of a recurring availability. If the field is omitted, the availability never expires. |
| timeZone | `string` | No | The IANA time zone of the availability |

:::tip

On top of the aforementioned fields, you can add any field you want to the CRUD. The service will treat them as the CRUD would.

:::

#### Exceptions CRUD collection

:::info

**v2.0.0**
Starting from v2.0.0 the Appointment Manager needs an exceptions collection when used in full mode.

:::

The Appointment Manager can have also a CRUD containing the exceptions. The collection can have any name you want, as long as you
specify the correct name in the `EXCEPTIONS_CRUD_NAME` [environment variable][environment-variables].

The exceptions collection must have the following fields:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| startDate | `date` | Yes | Start date/time of the exception, expressed in format **ISO 8601** |
| endDate | `date` | Yes | End date/time of the exception, expressed in format **ISO 8601** |
| reason | `string` | No | The reason for the absence of the resource (a doctor vacation, an equipment out of use, ...) |

:::tip

On top of the aforementioned fields, you can add any field you want to the CRUD. The service will treat them as the CRUD would.

:::

## Appointments mode

This section provide instructions on how to configure the Appointment Manager to deploy it in appointments mode.

- Create the [service configuration][service-configuration] JSON file, defining the users to notify and the external services to integrate with.

- If you enabled the integration with the teleconsultation service, setting `isTeleconsultationAvailable` to `true`, set the following environment variables:

  - `TELECONSULTATION_SERVICE_NAME`;
  - `TELECONSULTATION_ENDPOINT_FE`;
  - `TELECONSULTATION_BASE_PATH`.

- If you enabled the integration with the messaging service, setting `isMessagingAvailable` to `true`, set the following environment variables:

  - `MESSAGING_SERVICE_NAME`.

- If you enabled the integration with the timer service, setting both `isMessagingAvailable` and `isTimerAvailable` to `true`, set the following environment variables:

  - `MESSAGING_SERVICE_NAME`;
  - `TIMER_SERVICE_NAME`.

- Choose a name for the CRUD field containing the resource ID (e.g. `resourceId`) and assign this value to the `RESOURCE_ID_FIELD_NAME` environment variable.

- Create the [appointments CRUD collection](#appointments-crud-collection) with at least the following custom properties:

  - one field for each [`users`](#users) category defined in the service configuration;
  - the field of type `string` containing the resource ID (e.g. `resourceId`).

- Add the name of the [appointments CRUD collection](#appointments-crud-collection) to the `APPOINTMENTS_CRUD_NAME` [environment variable][environment-variables].

:::danger

If you use the Backoffice Calendar component, you currently must use `resourceId` as the CRUD field name to store the resource ID due to an open issue with an external dependency of the frontend component. This requirement may be removed in a future release of the Calendar component, once the issue has been fixed.

:::

:::caution

Since the reminder service in turn requires the messaging service to send reminders, if you set `isTimerAvailable` to `true` you must also set `isMessagingAvailable` to `true`.

:::

## Full mode

This section provide instructions on how to configure the Appointment Manager to deploy it in full mode.

- Configure the service performing all the steps described in [**appointments mode**](#appointments-mode)

- Create the [availabilities CRUD collection](#availabilities-crud-collection) with at least the following custom properties:

  - a field of type `string` containing the resource ID (e.g. `resourceId`).

- Add the name of the [availabilities CRUD collection](#availabilities-crud-collection) to the `AVAILABILITIES_CRUD_NAME` [environment variable][environment-variables].

- Create the [exceptions CRUD collection](#exceptions-crud-collection) with at least the following custom properties:

  - a field of type `string` containing the resource ID (e.g. `resourceId`).

- Add the name of the [exceptions CRUD collection](#exceptions-crud-collection) to the `EXCEPTIONS_CRUD_NAME` [environment variable][environment-variables].

:::danger

If you use the Backoffice Calendar component, you must use `resourceId` as the CRUD field name to store the resource ID due to an unresolved issue with an external dependency of the frontend component.

:::

:::caution

Since the reminder service in turn requires the messaging service to send reminders, if you set `isTimerAvailable` to `true` you must also set `isMessagingAvailable` to `true`.

:::

[crud-service-doc]: ../crud-service/overview_and_usage.md "CRUD Service official documentation"
[messaging-service-doc]: ../messaging-service/overview.md "Messaging Service official documentation"
[timer-service-doc]: ../timer-service/overview.md "Timer Service official documentation"
[teleconsultation-service-doc]: ../teleconsultation-service-backend/overview.md "Teleconsultation Service official documentation"
[service-configuration]: #service-configuration "Service configuration"
[environment-variables]: #environment-variables "Environment variables"
