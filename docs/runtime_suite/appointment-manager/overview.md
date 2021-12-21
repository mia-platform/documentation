---
id: overview
title: Appointment Manager
sidebar_label: Overview
---
The **Appointment Manager** is a microservice responsible for handling the organization of appointments. Leveraging the 
[CRUD Service](../crud-service/overview_and_usage.md), the [Messaging Service](../messaging-service/overview.md),
and the [Timer Service](../timer-service/overview.md), it can be used to control appointments creation, update and deletion on a 
CRUD collection and to automatically send messages and reminders to the users involved. 

The service can be seen as an enriched proxy to the CRUD: it implements the same interfaces of the CRUD Service allowing you
to perform a set of operations on a CRUD collection as you normally would with the CRUD Service itself. On top of that it
can be configured to handle messages and reminders functionalities.

## Sending messages

Whenever you create, update or delete an appointment, you may want to send a specific message to the users involved in the
event. 

:::caution
In order to send messages you will need to deploy an instance of the [Messaging Service](../messaging-service/overview.md) 
and to correctly configure the [environment variables](configuration.md#environment-variables).
:::

The service assumes that the users involved in an appointment are contained in one or more attributes of the appointment
itself. For example, an appointment related to a medical visit may have the following structure:

```json
{
  "other_props": "...",
  "doctor": "doctor_id",
  "patients": ["patient_id_1"]
}
```

In this example, the users involved in the appointment are categorized in _doctor_ and _patients_ and contained in two different
attributes.

The service gives you complete freedom in deciding to which category of users you want to send messages for each appointment
lifecycle phase (creation, update or deletion).

To do so, you can leverage the `users` property of the [service configuration](configuration.md#service-configuration).
This property is a map having as key the category of users you want to send messages to and as value another map linking
a message template id (see [Messaging Service](../messaging-service/overview.md) documentation for more information) to
each appointment lifecycle phase.

In response of each change in the appointment lifecycle the service will send a message to each user category that has a
template id specified for that phase in the configuration. If a category is not in the configuration, or it does not have
a template id for that phase, it will simply not receive the message.

For example, consider the appointment of the last example and the following configuration.

```json
{
  "users": {
    "doctor": {
      "create": "doctor_create_message_template_id",
      "delete": "doctor_delete_message_template_id"
    },
    "patients": {
      "create": "patient_create_message_template_id",
      "update": "patient_update_message_template_id",
      "delete": "patients_delete_message_template_id"
    }
  }
}
```

When the appointment is *created*, both the doctor and the patients involved will receive a message using the dedicated template
id.

When the appointment is *updated*, only the patients involved will receive a message using the dedicated template id.

When the appointment is *deleted*, only the patients involved will receive a message using the dedicated template id.

For more details on how messages are sent in each phase of the lifecycle, see the [usage section](usage.md).

### Setting reminders

When you create a new appointment, the service may set a reminder to send a message to the involved users a certain
amount of time before the appointment date.

:::caution
In order to send messages you will need to deploy an instance of the [Messaging Service](../messaging-service/overview.md)
and an instance of the [Timer Service](../timer-service/overview.md), as well as to correctly configure the 
[environment variables](configuration.md#environment-variables).
:::

To trigger the setting of reminders you need to provide a value to the `reminderMilliseconds` property of your appointment
(see the [CRUD section](configuration.md#appointments-crud) for more information).

:::tip
You can update the reminders by passing a new value for the `reminderMilliseconds` property in an [update request](usage.md#patch-appointmentsid).
:::

:::tip
You can abort all the set reminders for an appointment by _unsetting_ the `reminderMilliseconds` property in an 
[update request](usage.md#patch-appointmentsid).
:::

:::tip
You can avoid sending reminders for appointments created/updated below a given threshold by setting the `reminderThresholdMs` 
field in the configuration file (see the [CRUD section](configuration.md#reminderThresholdMs) for more information).
:::

As for messages, the service uses its [configuration](configuration.md#service-configuration) to know which users
categories should receive reminders.

Going back to the example above, we can consider this appointment

```json
{
  "other_props": "...",
  "doctor": "doctor_id",
  "patients": ["patient_id_1"]
}
```

and this enriched configuration

```json
{
  "users": {
    "doctor": {
      "create": "doctor_create_message_template_id",
      "delete": "doctor_delete_message_template_id"
    },
    "patients": {
      "create": "patient_create_message_template_id",
      "update": "patient_update_message_template_id",
      "delete": "patients_delete_message_template_id",
      "reminder": "patients_reminder_message_template_id"
    }
  }
}
```

When the appointment is *created*, a reminder will be scheduled for the patients involved, which will receive a message
using the dedicated template id.

When the appointment is *updated*, if the date of the appointment or the reminder milliseconds have been updated, 
the reminders scheduled for the patients will be rescheduled.

When the appointment is *deleted*, the reminders scheduled for the patients will be aborted.
