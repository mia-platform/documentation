---
id: usage
title: Appointment Manager Usage
sidebar_label: Usage
---
The main purpose of the Appointment Manager is to book appointments and to proxy CRUD operations directed to the `appointments`
collection in order to decorate them with the creation of messages and reminders. Appointments can be booked through the employ of
availabilities or directly.

:::note

As stated in the [configuration section][crud-appointments], you can name the CRUD collections however
you like. For simplicity’s sake, in the following page it is assumed that you have called them `availabilities`, `exceptions`, `appointments` and `users`.

:::

# Appointments

An appointment can be in one of the following states:

- **reserved**: a client locked the slot but has not confirmed the reservation (`status` is `AVAILABLE` and `lockExpiration` date is not expired)
- **expired**: a client locked the slot but did not confirm the reservation (`status` is `AVAILABLE` and `lockExpiration` date is expired)
- **booked**: a client booked the appointment directly or, after locking the slot, confirmed the reservation (`status` is `BOOKED`)

## GET /appointments/

Returns the list of appointments. This endpoint is a direct proxy to the `GET /appointments/export` endpoint of the CRUD service.

:::tip

**v2.0.0**

By default, for backward compatibility with version 1.x, the endpoint returns only booked appointments. If you want also reserved or expired appointments, use the `status` or `_q` query parameter.

:::

:::warning

Since this endpoint implements an export, be aware that it may return all the results if no query parameters are provided.

:::

## GET /appointments/count

Returns the number of appointments. This endpoint is a direct proxy to the `GET /appointments/count` of the CRUD service and has no side effects.

:::tip

**v2.0.0**

By default, for backward compatibility with version 1.x, this endpoint returns only the number of booked appointments. If you want also reserved or expired appointments, use the `status` or `_q` query parameter.

:::

## POST /appointments/

Creates a new appointment in the CRUD collection.

Depending on the [AM configuration][configuration], you can create an appointment by providing:

- in *appointments mode*: a start (`startDate`) and end (`endDate`) date/time;
- in *full mode* one of the following:
  - an availability ID (`availabilityId`), a start (`startDate`) and end (`endDate`) date/time representing a valid slot and the owner ID (`ownerId`);
  - only since version 2.0.1, a slot ID (`slotId`) in the new format and the owner ID (`ownerId`).

:::info
**v2.2.0**. Since version 2.2.0 this endpoint, when the [`isFlexibleSlotAvailable` configuration option][flexible-duration-slots] is set to true, allows you to book appointments on availabilities with flexible slots, i.e. without a slot duration.
When the [`isParticipantStatusAvailable` configuration option][is-participant-status-available] is set to true, the AM automatically initializes and populates the `participants` field.
See the _Response_ section below for more details on the possible error cases.
:::

:::warning
**v2.0.2**. Since version 2.0.2 this endpoint, when used in *appointments mode*, automatically truncates the date/time fields - `startDate` and `endDate` - to the second, meaning that seconds and milliseconds in the date/time are always set to zero before storing the appointment into the CRUD.
:::

:::warning
**v2.0.2**. Since version 2.0.2 this endpoint, when used in *full mode*, add the custom properties from the current version of the availability to the appointment and any field in the request body referring an availability custom property is overwritten.
:::

:::caution
**v2.0.1**. With version 2.0.1 we introduced, to improve compatibility with existing clients, the option to create an appointment directly from the `slotId`. The slot ID must have the new format, introduced in version 2.0.0. The slot ID from the CRUD collection used in version 1.x is not supported.
:::

:::caution
Please note that the date fields are saved in [ISO 8601][iso-8601] format, so its up to the client to convert them in UTC from its local time before using them in the Appointment Manager.
:::

### Possible side effects

This endpoint may have the following side effects.

#### Creating participants

:::info
**v2.2.0**. This feature is available only since version 2.2.0 and must be enabled explicitly by setting the [`isParticipantStatusAvailable` configuration option][is-participant-status-available] to `true`.
:::

When a participant is added through any of the [`users` custom fields][users], a new participant is added to the `participants` field, with the given `id` and `type` and the default values specified in the corresponding user category for the `status`, `required` and `acceptanceRequired` fields.

If the `isUserAvailable` property is set to `true` in the configuration file, it is possible to fetch further information about the participants. Such information are fields that can be specified in the environment variable `PARTICIPANT_USER_PROPERTIES` as a comma-separated list. These fields will populate the property `userProperties` inside each participant.

For example if `PARTICIPANT_USER_PROPERTIES` is set to `firstName,lastName` then the appointment will look like this:
```json
{
  "patients": ["patient1"],
  "doctors": ["doctor1", "doctor2"],
  "participants":[
    {
      "id": "patient1",
      "type": "patients",
      "userProperties":{
        "firstName": "John",
        "lastName": "Doe"
      }
    },
    {
      "id": "doctor1",
      "type": "doctors",
      "userProperties":{
        "firstName": "Mario",
        "lastName": "Rossi"
      }
    },
    {
      "id": "doctor2",
      "type": "doctors",
      "userProperties":{
        "firstName": "Luigi",
        "lastName": "Bianchi"
      }
    }
  ]
}
```

#### Creating a telecommunication room

If the `isTeleconsultationAvailable` property of the [configuration file][service-configuration] is `true`, and the field `isRemote` is set to `true`, then a virtual room for the teleconsultation will be created alongside the URL to join the call. The generated teleconsultation link will be automatically saved into the `linkTeleconsultation` field of the CRUD collection.

:::note
For this to happen, the users auth0 ids have to be passed in the body.
The users that can be passed are defined in `users` property of the [service configuration][service-configuration].

The telecommunication service require at least 2 users for creating the room, otherwise will return an error

The values for this fields can be either `string` or `arrayOfString`, for instance:

```json
{
  "doctor": "doctorAuth0Id",
  "patients": ["patient1Auth0Id", "patient2Auth0Id"]
}
```

#### Sending messages

:::info

**v2.3.0**
The integration with the Notification Manager is available only since version 2.3.0.

:::

If you use the [Messaging Service][messaging-service-doc], a message will be sent to the participants that belong to a category with a `create` template id (see the
[service overview][sending-messages] for more information), if the `isMessagingAvailable` [configuration option][service-configuration] is set to `true` and the appointment `startDate` is in the future.

If you use the [Notification Manager][notification-manager-doc], an event named `AM/AppointmentCreated/v1` with the appointment as payload will be sent to the NM. Please look at the [NM documentation][notification-manager-doc] for further details about how the event is processed.

:::

#### Setting reminders

:::info

**v2.3.0**
The integration with the Notification Manager is available only since version 2.3.0.

:::

:::caution

**v2.1.0**

Since v2.1.0 the `reminderMilliseconds` property of an appointment is ignored when setting reminders, which means that is no longer possible to customize if and when reminders are scheduled for each appointment by setting or not this property in the request body.

:::

If you use the [Messaging Service][messaging-service-doc] and a user category has the field `reminders` defined in the configuration file, every reminder in the list will be scheduled for the participants that belong to that category with the specified `reminder` template id (see the [service overview][setting-reminders] for more information).

:::warning

The reminders will be set only if the `isMessagingAvailable` and `isTeleconsultationAvailable` [configuration options][service-configuration] are set to `true` and the new appointment `startDate` is in the future.

:::

If you use the [Notification Manager][notification-manager-doc], an event named `AM/AppointmentCreated/v1` with the appointment as payload will be sent to the NM. Please look at the [NM documentation][notification-manager-doc] for further details about how the event is processed.

:::note

If the `reminderThresholdMs` field in the [service configuration][reminders-threshold] is set, and the new appointment `startDate` is closer than the given threshold, no reminder will be set (check the [service configuration section][reminders-threshold] for more information).

:::

### Body

Depending on the [AM configuration][configuration], you can create an appointment by providing:

- in *appointments mode*: a start (`startDate`) and end (`endDate`) date/time;

| Name      | Type      | Description                                                           |
|-----------|-----------|-----------------------------------------------------------------------|
| startDate | `string`  | Start date/time of the appointment, expressed in format **ISO 8601**. |
| endDate   | `string`  | End date/time of the appointment, expressed in format **ISO 8601**.   |
| isRemote  | `boolean` | If the appointments is delivered remotely (default: `false`).         |

```json
{
  "startDate": "2022-10-20T09:00:00.000Z",
  "endDate": "2022-10-20T10:00:00.000Z",
  "isRemote": false
}
```

- in *full mode*: an availability ID (`availabilityId`), a start (`startDate`) and end (`endDate`) date/time representing a valid slot and the owner ID (`ownerId`);

| Name           | Type      | Description                                                                                      |
|----------------|-----------|--------------------------------------------------------------------------------------------------|
| availabilityId | `number`  | The availability ID.                                                                             |
| startDate      | `string`  | Start date/time of the appointment, expressed in format **ISO 8601**.                            |
| endDate        | `string`  | End date/time of the appointment, expressed in format **ISO 8601**.                              |
| isRemote       | `boolean` | If the appointments is delivered remotely (default: `false`).                                    |
| ownerId        | `string`  | ID of the owner of the appointment, required to confirm a reservation or modify the appointment. |

```json
{
  "availabilityId": "6357a2357fd318a47240f9c2",
  "startDate": "2022-10-20T09:00:00.000Z",
  "endDate": "2022-10-20T10:00:00.000Z",
  "isRemote": false,
  "ownerId": "john.doe"
}
```

- in *full mode* (v2.0.2 or later): a slot ID (`slotId`) and the owner ID (`ownerId`);

| Name     | Type      | Description                                                                                                                     |
|----------|-----------|---------------------------------------------------------------------------------------------------------------------------------|
| slotId   | `string`  | The slot ID in the new format introduced with AM v2. The slot ID from the CRUD collection used in version 1.x is not supported. |
| isRemote | `boolean` | If the appointments is delivered remotely (default: `false`).                                                                   |
| ownerId  | `string`  | ID of the owner of the appointment, required to confirm a reservation or modify the appointment.                                |

```json
{
  "slotId": "6357a2357fd318a47240f9c2|2022-10-20T09:00:00.000Z|2022-10-20T10:00:00.000Z",
  "isRemote": false,
  "ownerId": "john.doe"
}
```

The appointment must satisfy the following constraints, otherwise a 400 response is returned:

- `startDate` must be a valid ISO 8601 date/time;
- `endDate` must be a valid ISO 8601 date/time;
- `startDate` must be earlier than `endDate`;
- if `isRemote` is `true`, the appointment must have at least two participants;
- `reminderIds` and `linkTeleconsultation` are fully managed by the AM and they cannot be modified by any client.

### Response

If the appointment is successfully created, you will receive a response with a 200 status code and the `_id` of the newly
created appointment in the payload.

If you are trying to create an appointment from a slot, you may receive one of the following errors:

- 404: if `availabilityId` does not correspond to an existing availability;
- 400: if `startDate`, `endDate` and `availabilityId` do not correspond to a valid slot:
  - with fixed slots, there must be a slot associated to the availability with exactly the given start and end date;
  - with flexible slots, there must be an availability occurrence entirely containing the appointment;
- 403: if the slot is already booked:
  - with fixed slots, the number of appointments already booked or reserved in the slot must be lower than the slot capacity;
  - with flexible slots, the number of appointments already booked or reserved and overlapping, even partially, with the given appointment must be lower than the slot capacity;
- 403: if the slot is unavailable, due to overlapping exceptions:
  - with fixed slots, there must be no exception overlapping, even partially, with the slot;
  - with flexible slots, there must be no exception overlapping, even partially, with the appointment.

The payload will contain any error that may have occurred while sending messages or scheduling reminders.

The structure of the payload is like the following:

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

## POST /appointments/state

:::info

**v2.3.0**
The integration with the Notification Manager is available only since version 2.3.0.

:::

Changes the state of the appointments matching the provided filters.

For appointments moved from a `PUBLIC` or `DRAFT` to a `TRASH` state:

- if you use the [Messaging Service][messaging-service-doc], the AM sends a `delete` messages to all the participants that belong to a category with a `delete` template id (see the [service overview][sending-messages] for more information);

:::warning
The messages will be sent only if the `isMessagingAvailable` [configuration option][service-configuration] is set to `true` and the appointment `startDate` is in the future.
:::

- if you use the [Timer Service][timer-service-doc], the AM deletes all existing reminders;
- if you use the [Notification Manager][notification-manager-doc], the AM sends an event named `AM/AppointmentDeleted/v1` with the appointment as payload.

For remote appointments moved from a `TRASH` to a `DELETED` state, the teleconsultation room is deleted. 

All appointments transitioning to a state other than `PUBLIC` are no longer taken into account when computing a slot status.

### Body

The body of this request has the same interface of a CRUD service `POST /appointments/state` request.

### Response

If the appointment's state is successfully updated, you will receive a response with a 200 status code and the number of updated appointments in the payload.

On top of that, the payload will contain any error that may have occurred while sending the messages or scheduling the reminders.

The structure of the payload is like the following:

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

## PATCH /appointments/:id/status

:::info
**v2.2.0**. This endpoint is available only since version 2.2.0 and is exposed only if you explicitly set the [`isParticipantStatusAvailable` configuration option][is-participant-status-available] to `true`.
:::

Updates the participation status of the participant having an `id` equals to the ID of the current user.

### Body

This endpoint expects a JSON object with the `status` property in the body providing the desired participation status, for example:

```json
{
  "status": "accepted"
}
```

### Response

If the participant status is successfully created or updated, you will receive a response with a 200 status code and the updated participant status details, for example:

```json
{
  "id": "user_id",
  "type": "doctors",
  "status": "accepted",
  "required": true,
  "acceptanceRequired": true,
}
```

If the appointment or the participant associated to the current user does not exist, you will received a response with a 404 status code and a body looking like this:
```json
{
  "statusCode": 404,
  "error": "Bad Request",
  "message": "Appointment with given participant not found"
}
```

## PATCH /appointments/:id

Updates the appointment with the specified id.

The following updates trigger specific actions:

- If the field `isRemote` is set from `false` to `true`, a new teleconsultation room will be created alongside the URL to join the call (`linkTeleconsultation`). The teleconsultation service requires at least 2 users, so either they are already present in the appointment, or they must have passed alongside with the request.

- If the field `isRemote` is set from `true` to `false`, the teleconsultation room created previously will be deleted alongside its URL to join the call from the CRUD (`linkTeleconsultation`).

- If the participants are changed - any field mapped by the `users` property of the [service configuration][service-configuration] - and the current appointment has `isRemote` set to `true`, then the teleconsultation's participants will be updated.

- If the `startDate` and/or `endDate` are changed and the current appointment has `isRemote` set to `true`, then the teleconsultation's start and/or end date are updated.

- If the `availabilityId`, `startDate` and/or `endDate` are changed, the AM checks if the new slot is valid and available.

For further info about what to set as the users value, see the [Teleconsultation Service doc - participants][teleconsultation-participants].

:::info

**v2.2.0**
Since version 2.2.0 this endpoint, when the [`isFlexibleSlotAvailable` configuration option][flexible-duration-slots] is set to true, allows you to update booked appointments on availabilities with flexible slots, i.e. without a slot duration.

:::

:::warning

**v2.0.2**. Since v2.0.2 this endpoint automatically truncates the date/time fields - `startDate` and `endDate` - to the second, meaning that seconds and milliseconds in the date/time are always set to zero before updating the appointment into the CRUD.

:::

:::note

The teleconsultation room will be accessible since its creation.

:::

:::warning

If the Teleconsultation Service is not configured properly on the Console, the teleconsultation's fields for the PATCH inside the $set object won't be shown.

:::

### Possible side effects

This endpoint may have the following side effects.

#### Updating participants status

:::info
**v2.2.0**. This feature is available only since version 2.2.0 and must be enabled explicitly by setting the [`isParticipantStatusAvailable` configuration option][is-participant-status-available] to `true`.
:::

When a participant is added or removed through any of the [`users` custom fields][users], the `participants` fields is updated according to the following rules:

- if a user is added, a new participant is added to the `participants` field, with the given `id` and `type` and the default values specified in the corresponding user category for the `status`, `required` and `acceptanceRequired` fields;
- if a user is removed, the corresponding participant, identified by the `id` and `type` fields, is removed from the `participants` field.

#### Sending messages

:::info

**v2.3.0**
The integration with the Notification Manager is available only since version 2.3.0.

:::

If you use the [Messaging Service][messaging-service-doc]:

- participants that are **added** to the appointment will receive a creation message if they belong to a category with a
`create` template id (see the [service overview][sending-messages] for more information);
- participants that are **removed** from the appointment will receive a deletion message if they belong to a category with a
`delete` template id (see the [service overview][sending-messages] for more information);
- participants that are **not modified** will receive an update message if they belong to a category with an `update` template id (see the [service overview][sending-messages] for more information), and if the `startDate` or the `endDate` of the appointments has been modified.

If you use the [Notification Manager][notification-manager-doc], the AM sends an event named `AM/AppointmentUpdated/v1` with the original and updated appointments in the payload. Please look at the [NM documentation][notification-manager-doc] for further details about how the event is processed.

:::warning

The messages will be sent only if the the appointment `startDate` is in the future after the update is performed.

:::

#### Setting reminders

:::info

**v2.3.0**
The integration with the Notification Manager is available only since version 2.3.0.

:::

:::caution

**v2.1.0**

Since v2.1.0 the `reminderMilliseconds` property of an appointment is ignored when setting reminders, which means that is no longer possible to customize if and when reminders are scheduled for each appointment by setting or not this property in the request body.

:::

If you use the [Messaging Service][messaging-service-doc]:

- one or more reminders will be set for participants that are **added** to the appointment if they belong to a category with the field `reminders` configured in the configuration file (see the [service overview][sending-messages] for more information).
- any reminder set for participants that are **removed** from the appointment will be aborted.

If you use the [Notification Manager][notification-manager-doc], the AM sends an event named `AM/AppointmentUpdated/v1` with the original and updated appointments in the payload. Please look at the [NM documentation][notification-manager-doc] for further details about how the event is processed.

:::warning

The reminders will be set or aborted only if the new appointment `startDate` is in the future after the update.

:::

:::note

If the `reminderThresholdMs` field in the configuration is set, and the appointment date is below the threshold, no reminder will be set (see the [service configuration section][reminders-threshold] for more information).

:::

### Body

The body of this request has the same interface of a CRUD service `PATCH /appointments/:id` request.

In addition, only a subset of CRUD operations are allowed:

- you can use the `$set` operator with all fields except:
  - `reminderIds`
  - `linkTeleconsultation`
  - `isFlagged`
  - `participants`
- you can use the `$unset` operator only with custom fields and the following:
  - `availabilityId`
  - `channels`
  - `ownerId`
- you can use the following operators only on custom fields:
  - `$inc`
  - `$mul`
  - `$currentDate`
  - `$push`

:::note

`reminderIds`, `linkTeleconsultation` and `participants` are fully managed by the AM and they cannot be modified by any client
You will receive a 400 error if you try to change `availabilityId` when running AM in *appointments mode*.

:::

The appointment resulting from the patch must satisfy the following rules:

- `startDate` must be a valid ISO 8601 date/time;
- `endDate` must be a valid ISO 8601 date/time;
- `startDate` must be earlier than `endDate`;
- if `isRemote` is `true`, the appointment must have at least two participants.

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

Deletes a single appointment. This endpoint is a direct proxy to the `DELETE /appointments/:id` of the CRUD service and has no side effects.

:::info

If the appointment is remote, the teleconsultation room is automatically deleted.

:::

# Availabilities

:::note
The following endpoints are exposed **only if** the following [environment variables][environment-variables] are set:

- `AVAILABILITY_CRUD_NAME`
- `EXCEPTIONS_CRUD_NAME`

The AM checks on bootstrap if they are set and exposes the endpoints or not, accordingly. 
:::

## GET /availabilities/

:::caution
**v2.0.0**
Since v2.0.0 this endpoint, despite maintaining the same API as in previous versions, no longer returns availability occurrences with slots, but only the details of the single or recurring availabilities created through the [`POST /availabilities`][post-availabilities]
:::

Returns the list of availabilities from the CRUD matching the query. This endpoint is a direct proxy to the `GET /availabilities/` endpoint of the CRUD service.

This endpoint has no side effects.

## GET /availabilities/count

:::caution
**v2.0.0**
Since v2.0.0 this endpoint, despite maintaining the same API as in previous versions, no longer returns the number of availability occurrences with slots, but only the number of the single or recurring availabilities created through the [`POST /availabilities`][post-availabilities].
:::

Returns the number of availabilities from the CRUD matching the query. This endpoint is a direct proxy to the `GET /availabilities/count` endpoint of the CRUD service.

This endpoint has no side effects.

## POST /availabilities/

Creates a new availability in the CRUD collection.

:::info

**v2.2.0**
Starting from v2.2.0, you can create availabilities without specifying the slot duration (`slotDuration`), resulting in flexible duration slots when not set. This feature is disabled by default, you can enable it by setting [`isFlexibleSlotAvailable`][is-flexible-slot-available] to `true`.
When created, each availability occurrence has a single slot corresponding to the entire availability duration.
Once appointments are reserved or booked, the AM will automatically recompute the available slots, as described in the [*Overview* section][flexible-duration-slots].

:::

:::warning

**v2.0.2**. Since v2.0.2 this endpoint automatically truncates the date/time fields - `startDate`, `endDate` and `untilDate` - to the second, meaning that seconds and milliseconds in the date/time are always set to zero before storing the availability into the CRUD.

:::

### Body

The body of this request accepts the following fields:

| Name                    | Type              | Required                         | Description                                                                                                                                                |
|-------------------------|-------------------|----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| startDate               | `string`          | Yes                              | Start date/time of the first occurrence of the availability, expressed in format **ISO 8601**.                                                             |
| endDate                 | `string`          | Yes                              | End date/time of the first occurrence of the availability, expressed in format **ISO 8601**.                                                               |
| slotDuration            | `number`          | No                               | The duration of the slot (in minutes). **Required** before version 2.2.0.                                                                                  |
| simultaneousSlotsNumber | `number`          | No                               | The number of appointments you can book in each slot, one by default.                                                                                      |
| each                    | `string`          | No                               | The frequency of a recurring availability: daily (`day`), weekly (`week`) or monthly (`month`).                                                            |
| on                      | `Array of number` | Only if  `each` is set to `week` | The weekdays on which a weekly availability occurs (0 for Sunday, 1 for Monday, 2 for Tuesday, and so on).                                                 |
| untilDate               | `date`            | No                               | The expiration date of a recurring availability, expressed in format **ISO 8601**. If the field is omitted, the availability never expires.                |
| timeZone                | `string`          | No                               | The IANA time zone of the availability. If the field is omitted, the **DEFAULT_TIME_ZONE** value is used.                                                  |
| onCreate                | `Object`          | No                               | The custom behaviors when the availability is created. See the [*Overview* section][availabilities-on-create] for more details.                          |
| onUpdate                | `Object`          | No                               | The custom behaviors when the availability is updated. See the [*Overview* section][availabilities-on-update] for more details.                          |
| onDelete                | `Object`          | No                               | The custom behaviors when the availability is deleted. See the [*Overview* section][availabilities-on-delete] for more details.                          |
| onCompute               | `Object`          | No                               | The custom behaviors when the availability occurrences and slots are computed. See the [*Overview* section][availabilities-on-compute] for more details. |

Additional fields can also be added to the body, depending on the underlying CRUD.

:::caution
The `onCreate.ignoreResourceAppointments` field can be set to `false` only when creating single availabilities, otherwise a 403 (`Unauthorized`) error is returned.
When the field is set to `false`, the AM checks if the availability resource has already booked appointments overlapping, even partially, with the availability; any reserved but not confirmed appointment is not included in the count.
:::

:::note
If the day specified in `startDate` does not match the recurrence pattern given, the first occurrence of the availability will occur in the first day of the scheduling pattern.
:::

:::note
If the slot duration (`slotDuration`) is set, the number of time slots is computed according to the following formula: `(endDate - startDate) / slotDuration`.
If the `(endDate - startDate)` is not an exact multiple of `slotDuration`, some time at the end of the availability may not be allocated to a slot.
For example, if `startDate` is `2030-02-08 09:00`, `endDate` is `2030-02-08 12:30` and `slotDuration` is `60` minutes, only 3 time slots are created, the last one ending at `2030-02-08 12:00`.
:::

:::note
The simultaneous slots (`simultaneousSlotsNumber`) represent the maximum number of appointments you can handle at a given time.
If the slot duration is set, it represents the maximum number of appointments you can book on each slot, i.e. the capacity of a slot.
If the slot duration is not set, it represents the maximum number of appointments overlapping, even partially.
These slots may be useful to model resources that can be used at the same time, e.g. a clinic with three rooms can handle three appointments at the same time.
:::

### Response

If the availability is successfully created, you will receive a response with a 200 status code and the `_id` of the newly created availability in the payload.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `POST /availability/` request.

## POST /availabilities/state

This endpoint changes the state of the availabilities matching the provided filters (similarly to the `POST availabilities/state` endpoint of the CRUD).

For all availabilities transitioning to a `DRAFT`, `TRASH` or `DELETED` state, the appointments booked on their slots are flagged (`isFlagged` is set to `true`).

:::note
The appointments in the past are not flagged, only the scheduled ones that have yet to start.
:::

### Body

The body of this request has the same interface of a CRUD service `POST /availabilities/state` request, if used with the filters.

### Response

If the availabilities states are successfully updated, you will receive a response with a 200 status code and the number of updated availabilities in the payload.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `POST /availabilities/state` request.

## PATCH /availabilities/:id

Updates the availability with the specified id.

All scheduled appointments, booked on slots that are no longer valid after the patch, will be flagged (`isFlagged` field set to `true`).

:::info

**v2.2.0**.
Starting from v2.2.0, you can have availabilities without a slot duration (`slotDuration`), resulting in flexible duration slots.
This feature is disabled by default, you can enable it by setting [`isFlexibleSlotAvailable`][is-flexible-slot-available] to `true`.
If enabled, you can perform an `$unset` operation on the `slotDuration`.

:::

:::warning
**v2.0.2**. Since v2.0.2 this endpoint automatically truncates the date/time fields - `startDate`, `endDate` and `untilDate` - to the second, meaning that seconds and milliseconds in the date/time are always set to zero before updating the availability into the CRUD.
:::

:::info
**v2.0.0**
An availability must have a valid [IANA time zone][iana-time-zones]. Trying to set an invalid `timeZone` or unset it will trigger an automatic rollback.
:::

:::note
Due to technical constraints, under unexpected circumstances (networking issues, CRUD service not responding, ...), it might happen that appointments are not correctly flagged. However, the system is designed to prevent having perfectly valid appointments being incorrectly flagged.
:::

:::warning
If the availability resulting from the patch is no longer valid, the AM performs an automatic rollback and returns a 400 error. Due to technical constraints, if the rollback fails it may result in an inconsistent availability saved into the CRUD and the user may have to fix it manually.
:::

### Body

The body of this request has a similar interface of a CRUD service `PATCH /availabilities/:id` request (thus using `$set`, `$unset`, etc.).

### Response

If the availability is successfully updated, you will receive a response with a 200 status code, and the updated availability in the payload.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `PATCH /availabilities/:id` request.

## DELETE /availabilities/:id

Delete a single availability. This endpoint is a direct proxy to a `DELETE /availabilities/:id` endpoint of the CRUD service.

All scheduled appointments booked on slots belonging to the availability are flagged (`isFlagged` field set to `true`).

:::note
Due to technical constraints, under unexpected circumstances (networking issues, CRUD service not responding, ...), it might happen that appointments are not correctly flagged. However, the system is designed to prevent having perfectly valid appointments being incorrectly flagged.
:::

:::note
The appointments in the past are not flagged, only the scheduled ones that have yet to start.
:::

### Response

If the availability is successfully deleted, you will receive a response with a 204 status code and no content.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `DELETE /availabilities/:id` request.

## DELETE /availabilities

Delete all the availabilities that match the given query parameters. This endpoint is a direct proxy to a `DELETE /availabilities/` endpoint of the CRUD service.

All scheduled appointments booked on slots belonging to the deleted availabilities are flagged (`isRemote` field set to `true`).

:::note
Due to technical constraints, under unexpected circumstances (networking issues, CRUD service not responding, ...), it might happen that appointments are not correctly flagged. However, the system is designed to prevent having perfectly valid appointments being incorrectly flagged.
:::

:::note
The appointments in the past are not flagged, only the scheduled ones that have yet to start.
:::

:::warning
If no query parameter is passed, this endpoint will do nothing an return `0` in the payload, to prevent all availabilities to be deleted.
:::

### Response

If the availabilities are successfully deleted, you will receive a response with a 200 status code, and the number of deleted availabilities in the payload.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `DELETE /availabilities` request.

# Slots

:::warning
**v2.0.0**
The following endpoints have been kept for backwards compatibility, but we strongly advise to avoid them since they may be deprecated in future releases in favor of the new [calendar][get-calendar] endpoints.
:::

## GET /slots/

:::tip
We recommend using the [`GET /calendar/`][get-calendar] endpoint, which provides greater flexibility in terms of events you can retrieve.
:::

:::info
**v2.2.0**. Starting with version 2.2.0 we support availabilities without a slot duration; for these availabilities, we only return available slots, computed as described in the [*Overview* section][flexible-duration-slots].
:::

:::info
**v2.1.0**. Starting with version 2.1.0 we return, for each slot, the resource ID from the corresponding availability, and we filter the exceptions only according to the availabilities resources.
:::

:::info
**v2.0.2**. With version 2.0.2 we introduced, to improve compatibility with existing clients, the option to filter for a specific slot by passing its ID in the `_id` query parameter like this:
```json
{
  "_id": "<slot ID>"
}
```
The slot ID must have the new format, introduced in version 2.0.0. The slot ID from the CRUD collection used in version 1.x is not supported.
:::

:::info
**v2.0.1**. With version 2.0.1 we introduced, to improve compatibility with existing clients, the option to filter for a specific slot by passing its ID in the `_q` query parameter like this:
```json
{
  "_q": {
    "_id": "<slot ID>"
  }
}
```
The slot ID must have the new format, introduced in version 2.0.0. The slot ID from the CRUD collection used in version 1.x is not supported.
:::

:::info
**v2.0.0**. With the introduction of recurring availabilities without expiration in v2.0.0, it is now always required a period when searching for calendar events and slots, due to the virtually infinite number of slots associated to this class of availabilities.
:::

Returns the slots matching the given query in a certain period of time and optionally with a given status.

Since the slots are computed on demand, the AM performs the following operations behind the scenes:

1. check if the `_id` or the `_q` query parameters contain a valid slot ID; if the value does exist, but it does not represent a valid slot ID, return 400;
2. if the slot ID is passed, use the slot start and end date as the period to filter for;  
3. retrieve from the CRUD all availabilities overlapping, even partially, with the period, and matching the query parameters `_st` and `_q` (except for the `_id` field);
4. retrieve from the CRUD all exceptions overlapping, even partially, with the period, and matching the availabilities resources;
5. retrieve from the CRUD all appointments and reservations overlapping, even partially, with the period and associated to the availabilities fetched at step 1;
6. for each availability, compute all the occurrences overlapping, even partially, with the period;
7. for each availability occurrence obtained at the previous step, compute all the slots (if slot duration is set) or just the available slots (if slot duration is not set);
8. if the slot ID is passed, filter the slot with given ID;
9. for each slot, set its status according to the following rules:
   1. `UNAVAILABLE` if any exception overlaps, even partially, the time slot;
   2. `BOOKED` if no exception overlaps, even partially, the time slot and the number of appointments or reservation is equals to the slot capacity;
   3. `AVAILABLE` otherwise.

:::warning
Since the association between availabilities and exceptions is based on the resource ID, you should set the filter on the corresponding field using the `_q` query parameter. Otherwise the AM assumes all exceptions and all availabilities refer to the same resource.
:::

### Request

This endpoint supports the following query parameters:

- `startDate` (**required**): the beginning of the period, expressed as an ISO 8601 date-time string;
- `endDate` (**required**): the end of the period, expressed as an ISO 8601 date-time string;
- `status`: the slot status (`AVAILABLE`, `BOOKED` or `UNAVAILABLE`);
- `_st`: a filter on the availability status;
- `_q`: additional query to filter availabilities and exceptions;
- `_l`: the maximum number of results returned;
- `_sk`: the number of slots to skip from the result set (after sorting, see `_s`);
- `_s`: field to be used to sort slots, otherwise the slots are returned in random order; these are the values supported:
  - `startDate`: sort ascending by start date/time;
  - `-startDate`: sort descending by start date/time;
  - `endDate`: sort ascending by start date/time;
  - `-endDate`: sort descending by start date/time.

### Response

:::info
**v2.2.0**. Since version 2.2.0, we only return available slots for availabilities without a slot duration.
:::

:::info
**v2.0.2**
Since version 2.0.2 we return, for each slot, all the availability custom properties, including the resource ID.
:::

:::danger
**v2.0.0**
Since slots are computed dinamically, the `_id` field does not represent and does not have the format of the random ID assigned from the CRUD to each new document, but it's a deterministic string derived from other slot properties (`availabilityId`, `startDate` and `endDate`) that allows the AM to obtain all the slot information from its `_id`.
:::

If the request is processed correctly, you will receive a response with a 200 status code, and an array of slots, having the following properties:

- `_id`: a unique identifier of the slot;
- `status`: the slot status (`AVAILABLE`, `BOOKED` or `UNAVAILABLE`);
- `resourceId`: the unique identifier of the resource associated with the slot;
- `availabilityId`: the availability id from the CRUD;
- `startDate`: the start date/time, expressed as a ISO 8601 date-time string;
- `endDate`: the start date/time, expressed as a ISO 8601 date-time string;
- `capacity`: the total number of appointments you can book on the slot, corresponds to the availability `simultaneousSlotsNumber`;
- all the availability custom properties.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `GET /` request.

## PATCH /slots/lock/:id

Lock an availability slot with the specified id. This process succeeds only if the slot is not locked or booked yet.

Since the slots are computed on demand, the AM performs the following operations behind the scenes:

1. retrieve from the CRUD the availability the slot belongs to;
2. check if the slot is valid, i.e. it does match an availability fixed or flexible slot;
3. check the number of appointments and reservation on the slot and returns 403 if the slot is full;
4. check the number of exceptions overlapping, even partially, with the slot and returns 403 if there's any;
5. create or update the reservation.

### Body

The body of this request accepts the following fields:

- `ownerId` (**required**): a `string` representing the user who wants to lock the availability;
- `lockDurationMs`: the duration of the lock expressed in milliseconds (default: the [`defaultLockDurationMs`][default-lock-duration] field of the service configuration file).
- `startDate`: a string representing the start date of the slot. It must be equal to the starting date included in the `:id` parameter when the availability has a `slotDuration` and greater or equal when it does not.
- `endDate`: a string representing the end date of the slot. It must be equal to the end date included in the `:id` parameter when the availability has a `slotDuration` and lower or equal when it does not.

### Response

If the slot is successfully locked, you will receive a response with a 200 status code and the complete record representing the appointment reservation.

If the resource can not be locked, you will receive a `Forbidden` error message.

# Exceptions

:::note
The following endpoints are available from v2.0.0 and are exposed **only if** the following [environment variables][environment-variables] are set:

- `AVAILABILITY_CRUD_NAME`
- `EXCEPTIONS_CRUD_NAME`

The AM checks on bootstrap if they are set and exposes the endpoints or not, accordingly. 
:::

## GET /exceptions/

Returns the list of exceptions from the CRUD. This endpoint is a direct proxy to the `GET /exceptions/` endpoint of the CRUD service and has no side effects.

### Response

You will receive a response with a 200 status code and the list of exceptions in the payload.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `GET /exceptions/` request.

## GET /exceptions/count

Returns the number of exceptions from the CRUD. This endpoint is a direct proxy to the `GET /exceptions/count` endpoint of the CRUD service and has no side effects.

### Response

You will receive a response with a 200 status code and the number of exceptions in the payload.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `GET /exceptions/count` request.

## POST /exceptions/

Creates a new exception in the CRUD collection.

All scheduled appointments with the same resource overlapping, even partially, with the exceptions are flagged (`isFlagged` field is set to `true`).

:::note
Due to technical constraints, under unexpected circumstances (networking issues, CRUD service not responding, ...), it might happen that appointments are not correctly flagged. However, the system is designed to prevent having perfectly valid appointments being incorrectly flagged.
:::

:::note
The appointments in the past are not flagged, only the scheduled ones that have yet to start.
:::

### Body

The request body accepts the following fields:

| Name      | Type     | Required | Description |
|-----------|----------|----------|-------------|
| startDate | `string` | Yes      | Start date/time of the first occurrence of the availability, expressed in format **ISO 8601**. |
| endDate   | `string` | Yes      | End date/time of the first occurrence of the availability, expressed in format **ISO 8601**. |
| reason    | `string` | No       | Reason for the absence or unavailability of the resource. |

Additional fields can also be added to the body, depending on the underlying CRUD.

### Response

If the exception is successfully created, you will receive a response with a 200 status code and the `_id` of the newly created exception in the payload.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `POST /exceptions/` request.

## POST /exceptions/state

This endpoint changes the state of the exceptions matching the provided filters (similarly to a `POST /exceptions/state` endpoint of the CRUD).

### Body

The body of this request has the same interface of a CRUD service `POST /exceptions/state` request, if used with the filters.

### Response

If the exceptions states are successfully updated, you will receive a response with a 200 status code and the number of updated exceptions in the payload.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `POST /exceptions/state` request.

## PATCH /exceptions/:id

Updates the exception with the specified id.

All scheduled appointments with the same resource overlapping, even partially, with the exception are flagged (`isFlagged` field is set to `true`).

:::note
Due to technical constraints, under unexpected circumstances (networking issues, CRUD service not responding, ...), it might happen that appointments are not correctly flagged. However, the system is designed to prevent having perfectly valid appointments being incorrectly flagged.
:::

:::note
The appointments in the past are not flagged, only the scheduled ones that have yet to start.
:::

:::warning
If the exception resulting from the patch is no longer valid, the AM performs an automatic rollback and returns a 400 error. Due to technical constraints, if the rollback fails it may result in an invalid exception saved into the CRUD and the user may have to fix it manually.
:::

### Body

The body of this request has a similar interface of a CRUD service `PATCH /exceptions/:id` request (thus using `$set`, `$unset`, etc.).

### Response

If the exception is successfully updated, you will receive a response with a 200 status code, and the updated exception in the payload.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `PATCH /exceptions/:id` request.

## DELETE /exceptions/:id

Delete a single exception. This endpoint is a direct proxy to a `DELETE /exceptions/:id` endpoint of the CRUD service.

### Response

If the exception is successfully deleted, you will receive a response with a 204 status code and no content.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `DELETE /exceptions/:id` request.

## DELETE /exceptions

Delete all the exceptions that match the given query parameters. This endpoint is a direct proxy to a `DELETE /exceptions/` endpoint of the CRUD service.

:::warning
If no query parameter is passed, this endpoint will do nothing an return `0` in the payload, to prevent all exceptions to be deleted.
:::

### Response

If the exceptions are successfully deleted, you will receive a response with a 200 status code, and the number of deleted exceptions in the payload.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `DELETE /exceptions/` request.

# Calendar

These endpoint are designed to provide an aggregated entry point for all kinds of events to display in a calendar, including:

- availabilities with slots and appointments;
- exceptions;
- other appointments (flagged or without slot).

## GET /calendar/

Returns the calendar events in a certain period of time and optionally for a specific resource.

Since the events are aggregated on demand, the AM performs the following operations behind the scenes:

1. retrieve from the CRUD all appointments and reservations overlapping, even partially, with the period and matching the given resource, if specified;
2. retrieve from the CRUD all availabilities overlapping, even partially, with the period and matching the given resource, if specified;
3. retrieve from the CRUD all exceptions overlapping, even partially, with the period and matching the given resource, if specified;
4. for each availability, compute all the occurrences overlapping, even partially, with the period;
5. if the availabilities have a slot duration (aka `no flexible slots`):

    2. for each availability occurrence obtained at the previous step, compute all the slots;
    3. for each slot, set its status according to the following rules:

        1. `UNAVAILABLE` if any exception overlaps, even partially, the time slot;
        2. `BOOKED` if no exception overlaps, even partially, the time slot and the number of appointments or reservation is equals to the slot capacity;
        3. `AVAILABLE` otherwise.

5. if the availabilities does not have a slot duration (aka `flexible slots`) returns a single slot of the duration of availability.

:::warning
This endpoint accepts, for compatibility reasons, but ignores the `_l` and `_sk` query parameters. As a consequence, be aware that this endpoint may return an arbitrary number of events, depending on the requested period.
:::

:::info
**v2.0.0**
With the introduction of recurring availabilities without expiration in v2.0.0, it is now always required a period when searching for calendar events and slots, due to the virtually infinite number of slots associated to this class of availabilities.
:::

:::info
**v2.0.2** Since version 2.0.2 this endpoint automatically includes `resourceId` in the results.
:::

### Request

This endpoint supports the following query parameters:

- `startDate` (**required**): the beginning of the period, expressed as an ISO 8601 date-time string;
- `endDate` (**required**): the end of the period, expressed as an ISO 8601 date-time string;
- `_q`: additional query to filter availabilities and exceptions;
- a query parameter containing the resource ID (the name must match the value set in the `RESOURCE_ID_FIELD_NAME` [environment variable][environment-variables]).

You can pass the period information using these query parameters in different ways:

- using the `startDate` and `endDate` query parameters:

```
GET /calendar/?startDate=2022-10-01T00:00:00Z&endDate=2022-11-01T00:00:00Z
```

- using the `_q` query parameter:

```
GET /calendar/?_q={"startDate": "2022-10-01T00:00:00Z", "endDate": "endDate=2022-11-01T00:00:00Z"}
GET /calendar/?_q={"and": [{"startDate": "2022-10-01T00:00:00Z"}, {"endDate": "endDate=2022-11-01T00:00:00Z"}]}
GET /calendar/?_q={"and": [{"startDate": {"eq": "2022-10-01T00:00:00Z"}}, {"endDate": {"eq": "endDate=2022-11-01T00:00:00Z"}}]}
```

:::note
The AM searches for the start and end date of the period looking first at the `startDate` and `endDate` query parameters, and if can't find one or both of them, it goes looking into the `_q`.    
:::

:::tip
We strongly recommend that you use the period information using the `startDate` and `endDate` query parameters whenever possible, and rely on `_q` only under circumstances when you have to, for example if you use the Backoffice Calendar component as a frontend.
:::

### Response

If the request is processed correctly, you will receive a response with a 200 status code, and an array of events, having the following common properties:

- `eventType`: the type of event (`Availability`, `Exception` or `Appointment`);
- `_id`: a unique identifier of the event;
- `startDate`: the start date/time of the event, expressed as a ISO 8601 date-time string;
- `endDate`: the start date/time of the event, expressed as a ISO 8601 date-time string.
 
See the following sections for more details about the specific properties for each type of event.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `GET /<collection>` request.

#### `Availability`

Each availability has all the [CRUD collection properties][crud-availabilities] plus a `slots` field, containing an array of the slots, each one having the following properties:

- `_id`: a unique identifier of the slot;
- `status`: the slot status (`AVAILABLE`, `BOOKED` or `UNAVAILABLE`);
- `availabilityId`: the availability id from the CRUD;
- `startDate`: the start date/time, expressed as a ISO 8601 date-time string;
- `endDate`: the start date/time, expressed as a ISO 8601 date-time string;
- `capacity`: the total number of appointments you can book on the slot, corresponds to the availability `simultaneousSlotsNumber`;
- `appointments`: a list of appointments (see [Appointment][appointment] section for more details on their properties).

:::note
**v2.0.0**
Since slots are computed dinamically, the `_id` field does not represent and does not have the format of the random ID assigned from the CRUD to each new document, but it's a deterministic string derived from other slot properties (`availabilityId`, `startDate` and `endDate`) that allows the AM to obtain all the slot information from its `_id`.
:::

:::note
**v2.2.0**
The `status` field will not be included in the availability response if the slot duration is not set.
:::

:::caution
**v2.2.0**
In the case of availability without a specific slot duration, a single slot is created containing all the appointments booked within that occurrence of availability; therefore, unlike slots with fixed duration, the start and end date/time of the appointments do not necessarily coincide with those of the slot, and appointments can have variable durations.
:::

#### `Exception`

Each exception has all the [CRUD collection properties][crud-exceptions].

#### `Appointment`

Each appointment has all the [CRUD collection properties][crud-appointments].

## GET /calendar/count

Return the number of events available in a given period.

Since the events are aggregated on demand, the AM performs the following operations behind the scenes:

1. count from the CRUD the number of appointments and reservations overlapping, even partially, with the period, matching the given resource, if specified, and not associated to a valid slot;
2. retrieve from the CRUD all availabilities overlapping, even partially, with the period and matching the given resource, if specified;
3. count from the CRUD the number of exceptions overlapping, even partially, with the period and matching the given resource, if specified;
4. for each availability, compute the number of occurrences overlapping, even partially, with the period;
5. returns the sum of the number of appointments (step 1), exceptions (step 2) and availabilities (step 5).

:::info
**v2.0.0**
With the introduction of recurring availabilities without expiration in v2.0.0, it is now always required a period when searching for calendar events and slots, due to the virtually infinite number of slots associated to this class of availabilities.
:::

### Request

This endpoint supports the following query parameters:

- `startDate` (**required**): the beginning of the period, expressed as an ISO 8601 date-time string;
- `endDate` (**required**): the end of the period, expressed as an ISO 8601 date-time string;
- `_q`: additional query to filter availabilities and exceptions;
- a query parameter containing the resource ID (the name must match the value set in the `RESOURCE_ID_FIELD_NAME` [environment variable][environment-variables]).

You can pass the period information using these query parameters in different ways:

- using the `startDate` and `endDate` query parameters:

```
GET /calendar/?startDate=2022-10-01T00:00:00Z&endDate=2022-11-01T00:00:00Z
```

- using the `_q` query parameter:

```
GET /calendar/?_q={"startDate": "2022-10-01T00:00:00Z", "endDate": "endDate=2022-11-01T00:00:00Z"}
GET /calendar/?_q={"and": [{"startDate": "2022-10-01T00:00:00Z"}, {"endDate": "endDate=2022-11-01T00:00:00Z"}]}
GET /calendar/?_q={"and": [{"startDate": {"eq": "2022-10-01T00:00:00Z"}}, {"endDate": {"eq": "endDate=2022-11-01T00:00:00Z"}}]}
```

:::note
The AM searches for the start and end date of the period looking first at the `startDate` and `endDate` query parameters, and if can't find one or both of them, it goes looking into the `_q`.    
:::

:::tip
We recommend that you use the period information using the `startDate` and `endDate` query parameters whenever possible, and rely on `_q` only under circumstances when you have to, for example if you use the Backoffice Calendar component as a frontend.
:::

### Response

If the request is processed correctly, you will receive a response with a 200 status code, and the number of events that would be returned by the [`GET /calendar/`][get-calendar] with the same query parameters.

In case of error (4xx or 5xx status codes), the response has the same interface of a CRUD service `GET /<collection>/count` request.

# Search

## POST /searches/first-available-slot/

:::warning
Since this endpoint retrieves the resource's information, in order to use this endpoint it is required to configure the path to the users CRUD collection among the environment variables.
:::

Return the first available slot with the details of the associated resource matching the filters sent in the request body. If there are several slots with the same start date/time (multiple resources available at the same time), they will all be returned.

### Body

The body of this request accepts the following fields:

| Name                | Type     | Required | Description |
|---------------------|--------- |----------|-------------|
| endDate             | `string` | Yes      | End date/time of the range in which the first slot will be searched, expressed in format **ISO 8601**. The range start is by default the moment in which the request is sent. |
| slotDuration        | `integer`| No       | The minimum duration in minutes of the slot to be searched |
| resourceFilters     | `Object` | No       | Object containing CRUD filtering option to be applied to the resources. |
| availabilityFilters | `Object` | No       | Object containing CRUD filtering option to be applied to the availability. |

### Response

If one ore more slots are successfully found, you will receive a response with a 200 status code and the array of objects. Each of them contains the slot-resource pair. In each slot it is specified the duration is of `type` FLEXIBLE or FIXED. If no slot is found the array will be empty.

[iana-time-zones]: https://www.iana.org/time-zones "IANA Time Zones"
[iso-8601]: https://en.wikipedia.org/wiki/ISO_8601 "ISO 8601 - Wikipedia"
[messaging-service-doc]: ../../runtime_suite/messaging-service/overview "Messaging Service official documentation"
[notification-manager-doc]: ../../runtime_suite/messaging-service/overview "Notification Manager"
[teleconsultation-participants]: ../../runtime_suite/teleconsultation-service-backend/usage#participants-required "Required participants | Usage | Teleconsultation Service Backend"
[timer-service-doc]: ../../runtime_suite/timer-service/overview "Timer Service official documentation"

[sending-messages]: ./10_overview.md#sending-messages "Sending messages | Overview"
[setting-reminders]: ./10_overview.md#setting-reminders "Setting reminders | Overview"
[flexible-duration-slots]: ./10_overview.md#flexible-slots "Flexible duration slots | Availabilities and slots | Overview"
[availabilities-on-create]: ./10_overview.md#on-create "On create | Custom behaviors | Availabilities and slots | Overview"
[availabilities-on-update]: ./10_overview.md#on-update "On update | Custom behaviors | Availabilities and slots | Overview"
[availabilities-on-delete]: ./10_overview.md#on-delete "On delete | Custom behaviors | Availabilities and slots | Overview"
[availabilities-on-compute]: ./10_overview.md#on-compute "On compute | Custom behaviors | Availabilities and slots | Overview"

[configuration]: ./20_configuration.md "Configuration page"
[service-configuration]: ./20_configuration.md#service-configuration "Service configuration | Configuration"
[users]: ./20_configuration.md#users "`users` | Service configuration | Configuration"
[is-participant-status-available]: ./20_configuration.md#isparticipantstatusavailable "`isParticipantStatusAvailable` | Service configuration | Configuration"
[environment-variables]: ./20_configuration.md#environment-variables "Environment variables | Configuration"
[crud-availabilities]: ./20_configuration.md#availabilities-crud-collection "Availabilities CRUD collection | CRUD collections | Configuration"
[crud-exceptions]: ./20_configuration.md#exceptions-crud-collection "Exceptions CRUD collection | CRUD collections | Configuration"
[crud-appointments]: ./20_configuration.md#appointments-crud-collection "Appointments CRUD collection | CRUD collections | Configuration"
[default-lock-duration]: ./20_configuration.md#defaultlockdurationms "defaultLockDurationMs | Service configuration | Configuration"
[reminders-threshold]: ./20_configuration.md#reminderthresholdms "reminderThresholdMs | Service configuration | Configuration"

[post-availabilities]: #post-availabilities "POST /availabilities/ | Usage"
[get-calendar]: #get-calendar "GET /calendar/ | Usage"
[appointment]: #appointment "Appointment | Response | GET /calendar/ | Usage"
