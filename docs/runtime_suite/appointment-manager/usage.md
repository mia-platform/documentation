---
id: usage
title: Appointment Manager Usage
sidebar_label: Usage
---
The main purpose of the Appointment Manager is to book appointments and to proxy CRUD operations directed to the `appointments`
collection in order to decorate them with the creation of messages and reminders. Appointments can be booked through the employ of
availabilities or directly.

:::note
As stated in the [configuration section](configuration.md#appointments-crud), you can name the CRUD collections however
you like. For simplicity’s sake, in the following page it is assumed that you have called them `availabilities` and
`appointments`.
:::

# Appointments

## GET /appointments

Returns the list of appointments. This endpoint is a direct proxy to the `GET /appointments` of the CRUD service and has no side
effects.

## GET /appointments/count

Returns the number of appointments. This endpoint is a direct proxy to the `GET /appointments/count` of the CRUD service and has no side
effects.

## POST /appointments

Creates a new appointment in the respective CRUD collection.

:::note
In case the chosen mode is remote, a virtual room for the teleconsultation will be created alongside the URL to join the call.
:::

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

#### Creation of a telecommunication room

If the environmental variables for the telecommunication service are set, the `isTeleconsultationAvailable` property of the configuration file is `true`, and the field `isRemote` is set to `true`, then a virtual room for the teleconsultation will be created alongside the URL to join the call.

:::note
For this to happen, the users auth0 ids have to be passed in the body.
The users that can be passed are defined in `users` property of the [service configuration](configuration.md#service-configuration).

The telecommunication service require at least 2 users for creating the room, otherwise will return an error

The values for this fields can be either `string` or `arrayOfString`, for instance:

```json
{
  "doctor": "doctorAuth0Id",
  "patients": ["patient1Auth0Id", "patient2Auth0Id"]
}
```

:::

#### Booking of availability slots

If `ownerId`and `slotId` are passed in the body, the referred slot's status will be set to `BOOKED`.
This means that the slot in the given availability can not be booked again because it is no more available.

:::note
The user who wants to book an appointment for a given availability slot must first perform a call to the 
[PATCH /slots/lock/:id](#PATCH-/slots/lock/:id) endpoint, in order to lock the availability slot.

The actual appointment booking can occur only after this step.
:::

Appointment data is taken from the referred availability.

### Body

This request accepts 2 types of body.
- The same interface of the CRUD service `POST /appointments/` request.
- The following fields:
  - **ownerId (required)** - `string`: the user who is trying to book the appointment.
  - **bypassLock** - `boolean`: if true, the availability lock can be bypassed.
    Used by backoffice to book an availability without locking it.
  - **slotId (required)** - `number`: the id of the slot related to this appointment.

:::note
On top of the CRUD schema, the service adds the following validations:
- if passed, `reminderMilliseconds` must be greater than 0;
- `reminderIds` cannot be in the body.
:::

:::note
If a user locks the availability, but hasn't booked the appointment yet, and someone from the backoffice books the
availability with `bypassLock=true`, the user will not be able to book the appointment.
:::

The first type of body allows to create an independent appointment; the second one is used if the appointment is booked starting from
a locked availability.

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

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `POST /appointments/` request.

## PATCH /appointments/:id

Updates the appointment with the specified id.

### Teleconsultation

Particular cases:

- If the field **isRemote** is set from `true` to `false`, the virtual room created previously will be deleted alongside its URL to join the call from the CRUD.

- If the field **isRemote** is set from `false` to `true`  a virtual room for the teleconsultation will be created alongside the URL to join the call. The teleconsultation service requires at least 2 users, so either they are already present in the appointment, or they must have passed alongside with the request

- If there are fields mapped by the `users` property of the [service configuration](configuration.md#service-configuration) and the current appointment has already a teleconsultation associated, then the teleconsultation's participants will be updated.

For further info about what to set as the users value, see the [Teleconsultation Service doc - participants](../teleconsultation-service-backend/usage.md#participants-required).

:::note
The teleconsultation virtual room will be accessible since its creation.
:::

:::warning
If the Teleconsultation Service is not configured properly on the Console, the teleconsultation's fields for the PATCH inside the $set object won't be shown.
:::

### Possible side effects.

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

The body of this request has the same interface of a CRUD service `PATCH /appointments/:id` request.

:::note
On top of the CRUD schema, the service adds the following validation:
- if in `$set`, `reminderMilliseconds` must be greater than 0;
- `reminderIds` cannot be modified.
:::

### Response

If the appointment is successfully updated, you will receive a response with a 200 status code and the update appointment in the payload.

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

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `PATCH /appointments/:id` request.

## DELETE /appointments/:id

Deletes a single appointment. This endpoint is a direct proxy to the `DELETE /appointments/:id` of the CRUD service and has no side
effects.

:::note
If the mode changes from remote to onsite, the virtual room created previously will be deleted alongside its URL to join the call from the CRUD.
:::

:::note
If the appointment has been created by an availability slot, the related availability slot is marked as `AVAILABLE`
after the appointment deletion.
:::

## POST /appointments/state

Changes the state of the appointments matching the provided filters.

For the appointments moved from a `PUBLIC` or `DRAFT` state to a `TRASH` state, the route may have the following side effects.

:::warning
For now, messages and reminders are handled **only** for appointments moving from a `PUBLIC` or `DRAFT` state to a `TRASH` state.
Any other state change will not have side effects.

This may change in the future.
:::

:::warning
If the appointment has been created by an availability slot, the related availability slot is marked as `AVAILABLE`
after the appointment state is moved to a `DELETED` state.

Any other state change will not have effect on the related availability slot. 
Thus, moving the appointment state to `PUBLIC`, `DRAFT` or `TRASH` does not change the slot status 
(the slot remains `BOOKED`).

This may change in the future.
:::

:::warning
If the state is changed to `DELETED` and the **linkTeleconsultation** is associated with this appointment, the teleconsultation and the virtual room on Bandyer will be deleted.
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

The body of this request has the same interface of a CRUD service `POST /appointments/state` request.

### Response

If the appointment's state is successfully updated, you will receive a response with a 200 status code and the number of updated
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

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `POST /appointments/state` request.

# Availabilities
:::note
The following endpoints are exposed **only if** the `AVAILABILITY_CRUD_NAME` [environment variable](configuration.md#environment-variables)
is defined.
:::

## GET /availabilities

Returns the list of availabilities, by enriching the availabilities from the CRUD collection with:
- the additional properties contained in the slots CRUD collection;
- an array of slots, where each slot contains the following properties: `_id`, `startDate`, `endDate`, `status`.

This endpoint has no side effects.

## POST /availabilities

Creates a new availability (in the respective CRUD collection), computing the related slots and inserting them in the 
slots collection.

### Body

The body of this request accepts the following fields.
- **startDate (required)** - `string`: availability's starting date (expressed in format **ISO 8601**).
- **endDate (required)** - `string`: availability's ending date (expressed in format **ISO 8601**).
- **slotDuration (required)** - `number`: the duration of the slot (in minutes).
- **simultaneousSlotsNumber** - `number`: the number of simultaneous slots (slots in the same time) to be allocated.
  If not specified, a single simultaneous slot is created by default.

Additional fields can also be added to the body, depending on the underlying CRUD.

:::note
The number of time slots is computed by the following formula: `(endDate - startDate) / slotDuration`.
If the `(endDate - startDate)` is not exactly divisible by `slotDuration`, the `endDate` is updated with the ending date
of the last time slot. E.g. if `startDate` is `2030-02-08 09:00`, `endDate` is `2030-02-08 12:30`
and `slotDuration` is `60` minutes, 3 time slots are created and `endDate` is updated to `2030-02-08 12:00`.
:::

:::note
Simultaneous slots are slots that occurs in the same time slot. 
These slots may be useful to model resources that can be used at the same time, e.g. a clinic with three rooms  
can handle three appointments at the same time.
:::

:::warning
The maximum number of slots allowed in an availability is 200.
If the total number of slots to be created is higher than this value, slots are not created and an error is returned.

This may change in the future.
:::

### Response

If the availability is successfully created, you will receive a response with a 200 status code and the `_id` of the newly
created availability in the payload.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `POST /availability/` request.

## PATCH /availabilities/:id

Updates the availability with the specified id and all the related slots.
It may have the following side effects.

:::note
This endpoint only allows to update the availability (slots) additional properties.
:::

:::warning
If some slots have been already been booked or locked, an error is returned.
:::

### Body

The body of this request has a similar interface of a CRUD service `PATCH /appointments/:id` request (thus using `$set`,
`$unset`, etc.) and it modifies all the slots related to the availability.

:::warning
The modification of the slots `ownerId`, `lockExpiration` and `status` properties is not possible through this endpoint.
To do this, please refer to the `PATCH /slots/lock/:id` endpoint.
:::

:::warning
The modification of the availability and slots `startDate` and `endDate` properties, 
along with the slot number and duration, is prevented.
In order to modify those values, the availability must be deleted and created again.

This may change in the future.
:::

### Response

If the availability is successfully updated, you will receive a response with a 200 status code,
and the updated availability in the payload.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service
`PATCH /availabilities/:id` request.

## PATCH /slots/lock/:id

Locks an availability slot with the specified id. This process succeeds only if the slot is not locked or booked yet.

### Body

The body of this request accepts the following fields.
- **ownerId (required)** - `string`: the user who wants to lock the availability
- **lockDurationMs** - `number`: the duration of the lock expressed in milliseconds.
  If not specified, the `defaultLockDurationMs` field of the service configuration file is used
  (see [here](configuration.md#defaultLockDurationMs) for more information).

### Response

If the slot is successfully locked, you will receive a response with a 200 status code and the complete record
representing the locked slot.

If the resource can not be locked, you will receive a Forbidden error message.

## DELETE /availabilities/:id

Delete a single availability and all the related slots.
This endpoint combines calls to the `DELETE /availabilities/:id` and `DELETE /slots/:id` of the CRUD service.

:::warning
If some users already locked slots in the given availability (and the locks are not expired), 
this endpoint will return an error.

This behavior is due to prevent issues with operations performed between the lock and the appointment booking 
(e.g. payments).
:::

:::warning
If some slots are already booked, this endpoint will return an error.

If you also need to remove such slots, you must first remove the linked appointments.
At this point, the slots can be deleted (since they will be marked as available).
:::

## POST /availabilities/state

Changes the state of the availabilities (and the related slots) matching the provided filters.
This endpoint combines calls to the `POST /availabilities/state` and `POST /slots/state` of the CRUD service,
and may have the following side effects.

:::warning
If some users already locked or booked slots in an availability moved to a `DRAFT`, `TRASH` or `DELETED` state,
an error is returned.

This behavior is due to prevent issues with operations performed between the lock and the appointment booking
(e.g. payments).
:::

### Body

The body of this request has the same interface of a CRUD service `POST /availabilities/state` request.

### Response

If the availability's state is successfully updated, you will receive a response with a 200 status code,
and the number of updated availabilities in the payload.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `POST /availabilities/state` request.

## GET /availabilities/count

Returns the number of availabilities.
This endpoint is a direct proxy to the `GET /availabilities/count` of the CRUD service and has no side effects.

## GET /slots

Returns the list of slots. This endpoint is a direct proxy to the `GET /slots` of the CRUD service and has no side
effects.
