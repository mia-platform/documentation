---
id: usage
title: Appointment Manager Usage
sidebar_label: Usage
---
The main purpose of the Appointment Manager is to proxy CRUD operations directed to the `appointments` collection to decorate
them with the creation of messages and reminders.

:::note
As stated in the [configuration section](configuration.md#appointments-crud), you can name the CRUD collection however
you like. For simplicity’s sake, in the following page it is assumed that you have called it `appointments`.
:::

## GET /

Returns the list of appointments. This endpoint is a direct proxy to the `GET /` of the CRUD service and has no side
effects.

## GET /count

Returns the number of appointments. This endpoint is a direct proxy to the `GET /count` of the CRUD service and has no side
effects.

## POST /

Creates a new appointment in the CRUD collection.

It may have the following side effects.

#### Sending of messages

A message will be sent to the participants that belong to a category with a `create` template id (see the
[service overview](overview.md#sending-messages) for more information).

:::warning
The messages will be sent only if the `MESSAGING_SERVICE_NAME` [environment variable](configuration.md#environment-variables) is set.
:::

:::note
If the new appointment's `startDate` is in the past, no message will be sent. 
:::

#### Setting of reminders

If `reminderMilliseconds` is passed in the body, a reminder will be scheduled for the participants that belong to a category with a
`reminder` template id (see the [service overview](overview.md#setting-reminders) for more information).

:::warning
The reminders will be set only if the `MESSAGING_SERVICE_NAME` and the `TIMER_SERVICE_NAME`
[environment variable](configuration.md#environment-variables) are set.
:::

:::note
If the new appointment's `startDate` is in the past, no reminders will be set.
:::

:::note
If the `reminderThresholdMs` field in the configuration is set, and the new appointment is created in a date below the 
threshold, no reminders will be set (see the [CRUD section](configuration.md#reminderThresholdMs) for more information).
:::

### Body

The body of this request has the same interface of a CRUD service `POST /` request.

:::note
On top of the CRUD schema, the service adds the following validations:
- if passed, `reminderMilliseconds` must be greater than 0;
- `reminderIds` cannot be in the body.
:::

### Response

If the appointment is successfully created, you will receive a response with a 200 status code and the `_id` of the newly
created appointment in the payload.

On top of that, the payload will contain any error that may have occurred during the sending of the messages or the scheduling
of the reminders. 

The structure of the payload is the following:

```json
{
  "_id": "Mongo id of the appointment",
  "errors": [
    {
      "service": "service that caused the error",
      "message": "string or object with the error message",
      "body": "string or object with the body of the call that failed"
    }
  ]
}
```

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `POST /` request.

## PATCH /:id

Updates the appointment with the specified id.

It may have the following side effects.

#### Sending of messages

Participants that are **added** to the appointment will receive a creation message if they belong to a category with a 
`create` template id (see the [service overview](overview.md#sending-messages) for more information).

Participants that are **removed** from the appointment will receive a deletion message if they belong to a category with a
`delete` template id (see the [service overview](overview.md#sending-messages) for more information).

Participants that are **not modified** will receive an update message:
- if they belong to a category with an `update` template id (see the [service overview](overview.md#sending-messages) for more information), and
- if the `startDate` or the `endDate` of the appointments have been modified.

:::warning
The messages will be sent only if the `MESSAGING_SERVICE_NAME` [environment variable](configuration.md#environment-variables) is set.
:::

:::note
If the appointment's `startDate` is in the past after the update (even if it already was before the update), no message will be sent.

However, if the appointment's `startDate` is not in the past after the update (even if it was before), any applicable message
will be sent.
:::

#### Setting of reminders

A reminder will be set for participants that are **added** to the appointment if they belong to a category with a `reminder` template 
id (see the [service overview](overview.md#sending-messages) for more information).

Any reminder set for participants that are **removed** from the appointment will be aborted.

Reminders for participants that are **not modified** will be updated:
- if they belong to a category with a `reminder` template id (see the [service overview](overview.md#sending-messages) for more information), and
- if `reminderMilliseconds` has been updated.

:::warning
The reminders will be set only if the `MESSAGING_SERVICE_NAME` and the `TIMER_SERVICE_NAME` 
[environment variable](configuration.md#environment-variables) are set.

The reminders will be aborted only if the `TIMER_SERVICE_NAME` [environment variable](configuration.md#environment-variables) are set.
:::

:::note
If the appointment's `startDate` is in the past after the update (even if it already was before the update), no reminder will be set.

However, if the appointment's `startDate` is not in the past after the update (even if it was before), any applicable reminder
will be set.
:::

:::note
If the `reminderThresholdMs` field in the configuration is set, and the appointment date is below the threshold, 
no reminders will be set (see the [CRUD section](configuration.md#reminderThresholdMs) for more information).
:::

:::tip
If you want to update the reminders for your users, you just need to update the `reminderMilliseconds`.
:::

:::tip
If you want to abort all the reminders for your users, you just need to unset the `reminderMilliseconds`.
:::

### Body

The body of this request has the same interface of a CRUD service `PATCH /:id` request.

:::note
On top of the CRUD schema, the service adds the following validation:
- if in `$set`, `reminderMilliseconds` must be greater than 0;
- `reminderIds` cannot be modified.
:::

### Response

If the appointment is successfully created, you will receive a response with a 200 status code and the update appointment in the payload.

On top of that, the payload will contain any error that may have occurred during the sending of the messages or the scheduling
of the reminders.

The structure of the payload is the following:

```json
{
  "data": "updated appointment",
  "errors": [
    {
      "service": "service that caused the error",
      "message": "string or object with the error message",
      "body": "string or object with the body of the call that failed"
    }
  ]
}
```

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `PATCH /:id` request.

## DELETE /:id

Deletes a single appointment. This endpoint is a direct proxy to the `DELETE /:id` of the CRUD service and has no side
effects.

## POST /state

Changes the state of the appointments matching the provided filters.

For the appointments moved from a `PUBLIC` or `DRAFT` state to a `TRASH` state, the route may have the following side effects.

:::warning
For now, messages and reminders are handled **only** for appointments moving from a `PUBLIC` or `DRAFT` state to a `TRASH` state. 
Any other state change will not have side effects.

This may change in the future.
:::

#### Sending of messages

A message will be sent to all the participants that belong to a category with a `delete` template id (see the
[service overview](overview.md#sending-messages) for more information).

:::warning
The messages will be sent only if the `MESSAGING_SERVICE_NAME` [environment variable](configuration.md#environment-variables) is set.
:::

:::note
If an appointment's `startDate` is in the past, no message will be sent to its participants.
:::

#### Setting of reminders

All the scheduled reminders are aborted.

:::warning
The reminders will be aborted only if the `TIMER_SERVICE_NAME` [environment variable](configuration.md#environment-variables) are set.
:::

### Body

The body of this request has the same interface of a CRUD service `POST /state` request.

### Response

If the appointment is successfully created, you will receive a response with a 200 status code and the number of updated
appointments in the payload.

On top of that, the payload will contain any error that may have occurred during the sending of the messages or the scheduling
of the reminders.

The structure of the payload is the following:

```json
{
  "updated": "number of updated appointments",
  "errors": [
    {
      "service": "service that caused the error",
      "message": "string or object with the error message",
      "body": "string or object with the body of the call that failed"
    }
  ]
}
```

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `POST /state` request.
