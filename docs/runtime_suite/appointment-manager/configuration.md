---
id: configuration
title: Appointment Manager configuration
sidebar_label: Configuration
---
The Appointment Manager needs some configuration in order to be used effectively.

## Appointments CRUD collection

The Appointment Manager requires a CRUD containing the appointments. The collection can have any name you want, as long as you specify
the correct name in the `APPOINTMENTS_CRUD_NAME` [environment variable](#environment-variables).

The appointments collection needs the following service-specific fields.

- **startDate (required)** - `date`: appointment's starting date (expressed in format **ISO 8601**).
- **endDate (required)** - `date`: appointment's ending date (expressed in format **ISO 8601**).
- **slotId** - `string`:  id of the appointment's related slot.
- **ownerId** - `string`: user who booked the appointment.
- **reminderMilliseconds** - `number`: amount of time before the appointment when users are notified about it (expressed in milliseconds).
- **reminderIds** - `array of ObjectId`: list of unique identified of the reminders associated with the appointment.
- **channels** - `array of string`: list of communication channels used to send messages and reminders. Possible values are **email**, **sms**, and **push**.
- **isRemote** - `boolean`: specify if an appointment will use the teleconsultation or not.
- **linkTeleconsultation**: `string`: The link to join the teleconsultation.

:::tip
On top of the aforementioned fields, you can add any field you want to the CRUD. The service will treat them as the CRUD would.
:::

:::warning
If you want to use the Appointment Manager in conjunction with the Calendar component of the Backoffice, you will also need to
a required property **title (string)** to your CRUD.
:::

### Appointments participants

As explained in the [service overview](overview.md), the service assumes that the users involved in an appointment are
contained in one or more attributes of the appointment itself.

When you create your CRUD you will need to create a new field for each category of users you will need to involve in the
event. These fields have to be of type `string` or `array of string`.

## Availabilities CRUD collection

The Appointment Manager can have also a CRUD containing the availabilities. The collection can have any name you want, as long as you
specify the correct name in the `AVAILABILITIES_CRUD_NAME` [environment variable](#environment-variables).

The availabilities collection needs the following service-specific fields.

- **startDate (required)** - `date`: availability's starting date (expressed in format **ISO 8601**).
- **endDate (required)** - `date`: availability's ending date (expressed in format **ISO 8601**).
- **slotIds (required)** - `Array of Strings`: array of slots ids related to the availability.
- **slotDuration (required)** - `number`: the duration of the slot (in minutes) related to the availability.

## Slots CRUD collection

The availabilities CRUD collection also requires a slot CRUD collection to represent the time slots booked by a user.
The collection can have any name you want, as long as you specify the correct name in the 
`SLOTS_CRUD_NAME` [environment variable](#environment-variables).

The slots collection needs the following service-specific fields.

- **startDate (required)** - `date`: time slot starting date (expressed in format **ISO 8601**).
- **endDate (required)** - `date`: time slot ending date (expressed in format **ISO 8601**).
- **status (required)** - `string`: the status of the availability: it can be `AVAILABLE` or `BOOKED`.
- **lockExpiration (required, nullable)** - `date`: the expiration of the slot's temporary lock (expressed in format **ISO 8601**),
  set when the slot is locked with the `PATCH /slots/lock/:id`.
- **ownerId** - `string`: last user who locked or booked the availability.

:::tip
As for the appointments, this collection can hold additional fields.
:::

## Environment variables

The Appointment Manager accepts the following environment variables.

- **CONFIGURATION_PATH (required)**: path of the config map file containing the service configuration.
- **CRUD_SERVICE_NAME (required)**: name of the CRUD service.
- **APPOINTMENTS_CRUD_NAME (required)**: name of the CRUD collection containing appointments.
- **AVAILABILITIES_CRUD_NAME**: name of the CRUD collection containing availabilities.
- **SLOTS_CRUD_NAME**: name of the CRUD collection containing slots.  
- **MESSAGING_SERVICE_NAME**: name of the Messaging Service. **Required** if you want to send messages or set reminders for your appointments.
- **TIMER_SERVICE_NAME**: name of the Timer Service. **Required** if you want to set reminders for your appointments.
- **TELECONSULTATION_SERVICE_NAME**: name of the teleconsultation service. **Required** if you want to create teleconsultations.
- **TELECONSULTATION_ENDPOINT_FE**: endpoint associated with the Teleconsultation Service FrontEnd (the root). **Required** if you want to create teleconsultations.
- **TELECONSULTATION_BASE_PATH**: custom base path for the teleconsultation URL. **Required** if you want to create teleconsultations.

## Service configuration

The service needs a configuration file in JSON format, that can be provided to it as a configmap. You can choose the
name and mounting point of the map, as long as you specify the correct path in the `CONFIGURATION_PATH` [environment variable](#environment-variables).

It follows an example of a valid configuration:

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
  "defaultLockDurationMs": 60000
}
```

### users

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

### channels

In the channels field you can specify the list of channels on which the Appointment Manager will send messages. Possible
values are **email**, **sms**, and **push**.

A correct configuration may be

```json
{
  "channels": ["email", "push"]
}
```

#### reminderThresholdMs

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

#### isTeleconsultationAvailable

A `boolean` which determines if the teleconsultation service can be used.
If the value is set to **false**, the user can't use the teleconsultation.
If the value is set to **true**, the user can choose between teleconsultation or onsite modes.

The default value is **false**.

### defaultLockDurationMs

This field defines the default duration in milliseconds of the temporary slot lock.
For instance:

```json
{
  "defaultLockDurationMs": 60000
}
```
