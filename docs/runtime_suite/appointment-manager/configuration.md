---
id: configuration
title: Appointment Manager configuration
sidebar_label: Configuration
---
The Appointment Manager needs some configuration in order to be used effectively.

## Appointments CRUD

The Appointment Manager requires a CRUD containing the appointments. The collection can have any name you want, as long as you specify
the correct name in the `APPOINTMENTS_CRUD_NAME` [environment variable](#environment-variables).

The appointments CRUD needs the following service-specific fields.

- **startDate (required)** - `date`: appointment starting date (expressed in format **ISO 8601**).
- **endDate (required)**- `date`: appointment ending date (expressed in format **ISO 8601**).
- **reminderMilliseconds** - `number`: amount of time before the appointment when users are notified about it (expressed in milliseconds).
- **reminderIds** - `array of ObjectId`: list of unique identified of the reminders associated with the appointment.
- **channels** - `array of string`: list of communication channels used to send messages and reminders. Possible values are **email**, **sms**, and **push**.
- **isRemote** - `boolean`: specify if an appointment will use the teleconsultation or not.
- **teleconsultationLink**: `string`: The link to join the teleconsultation.

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

## Environment variables

The Appointment Manager accepts the following environment variables.

- **CONFIGURATION_PATH (required)**: path of the config map file containing the service configuration.
- **MESSAGING_SERVICE_NAME**: name of the Messaging Service. **Required** if you want to send messages or set reminders for your appointments.
- **TIMER_SERVICE_NAME**: name of the Timer Service. **Required** if you want to set reminders for your appointments.
- **CRUD_SERVICE_NAME (required)**: name of the CRUD service.
- **APPOINTMENTS_CRUD_NAME (required)**: name of the CRUD collection containing appointments.
- **TELECONSULTATION_SERVICE_NAME**: name of the teleconsultation service.
- **TELECONSULTATION_ENDPOINT_FE**: endpoint associated with the Teleconsultation Service FrontEnd (the root).

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
  "isTeleconsultationAvailable": true
}
```

#### users

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

#### channels

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
