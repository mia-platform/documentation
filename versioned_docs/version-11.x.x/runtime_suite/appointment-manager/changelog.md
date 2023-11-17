---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] 2023-10-03

### Added

- Add Notification Manager integration to service configuration
- Send an event to the Notification Manager when a new appointment is created
- Send an event to the Notification Manager when an appointment is updated
- Send events to the Notification Manager when appointments state is updated
- Add Notification Manager integration libraries
- Add integration test suite for the Notification Manager

## [2.2.0] 2023-07-10

- Upgrade Node.js to v18

The following optional fields have been added to the availabilities CRUD collection: `onCreate`, `onUpdate`, `onDelete` and `onCompute`.
The following optional fields have been added to the appointments CRUD collection: `participants`.
If you have custom properties with these names, please rename them before upgrading from a version prior to 2.2.0.

### Fixed

- Searching for first available slot could return slots already started
- Cannot patch participant status when AM is deployed in appointments mode

### Added

- Create appointment on flexible slot
- Generate flexible slots
- Update appointments on flexible slots
- Create availability with flexible slots
- Update availability with flexible slots
- Update GET /calendar/ to return flexible slots
- Add validation of flexible slots
- GET /slots/ returns availabilities with flexible slots
- Find flexible slots
- PATCH /slots/lock/:id allows lock on flexible slot
- Update POST /searches/first-available-slot/ to return flexible slots
- Lock flexible slot
- Update find first available slot
- Update PATCH /slots/lock/:id with custom start and end date
- Update service configuration for participants status (feature toggle and user category defaults) 
- Add a new participants field to the appointments CRUD
- Add participants status synchronization
- Add participants status when creating an appointment
- Update participants status when updating an appointment
- Add endpoint PATCH /appointments/:id/status to change the status of an appointment participant
- Add user info to the participants
- Update handlers to synchronize user info for the participants

## [2.1.2] 2023-03-01

### Fixed

- DELETE /appointments/:id returns 500 when deleting remote appointment

## [2.1.1] 2023-02-15

- PATCH /appointments/:id returns 400 when patching slotId
- GET /calendar/ ignores _l and _sk query parameters

## [2.1.0] 2023-01-31

### BREAKING CHANGES

The service configuration now accepts multiple reminders for each user, which can be sent at different times and using different templates. Before upgrading to v2.1.x, you need to update the service configuration accordingly.

The `reminderMilliseconds` property of an appointment is now ignored when setting reminders, which means that is no longer possible to customize if and when reminders are scheduled for each appointment. The AM will schedule reminders for all new appointments according only to the service configuration. All existing reminders remain valid, unless the appointment is updated, deleted or its state changed in a way that cause the existing reminders to be aborted and new reminders to be created according to the new service configuration.

### Added

- Add support for multiple reminders to service configuration
- Add support for multiple reminders to PATCH /appointments/:id
- Add POST /searches/first-available-slot/ to search first available slot
- GET /slots/ returns the availability resource ID for each slot

### Fixed

- GET /slots/ should not use _q to filter exceptions

## [2.0.2] 2023-01-26

### Added

- Add _id query parameter to GET /slots/

### Fixed

This version restores the default behavior of AM v1, where any availability custom property would silently overwrite the corresponding field in the `POST /appointments/` request body.

- GET /calendar now returns resourceId by default
- POST /appointments/ merges custom properties from the availability
- POST /appointments/ counts owner reservations when slot has been locked
- GET /slots/ returns the wrong number of slots when _l and _sk are both set
- GET /calendar/ returns the wrong number of slots

## [2.0.1] 2023-01-17

### Added

- POST /appointments/ can create an appointment from a slotId
- GET /slots/ accepts a new slot ID in _q._id

## [2.0.0] 2022-12-06

### BREAKING CHANGES

#### Service configuration

If you want to enable the integration with the messaging service, you need to explicitly set the `isMessagingAvailable` configuration option to `true` in the config map, in addition to set the `MESSAGING_SERVICE_NAME` environment variable. By default, the option is set to `false` and the integration is disabled.

If you want to enable the integration with the timer service, you need to explicitly set the `isTimerAvailable` configuration option to `true` in the config map, in addition to set the `MESSAGING_SERVICE_NAME` and `TIMER_SERVICE_NAME` environment variables. By default, the option is set to `false` and the integration is disabled.

#### Environment variables

The service requires two additional environment variables:

- `RESOURCE_ID_FIELD_NAME`: the name of the CRUD field containing the resource ID (the field must be present in all CRUD collections);
- `EXCEPTIONS_CRUD_NAME`: the name of the CRUD collection containing the exceptions.

The service no longer uses the following environment variables:

- `SLOTS_CRUD_NAME`: the slots are computed dinamically and are no longer stored into a CRUD collection.

#### CRUD collections

You need to configure the resource ID field for all CRUD collections with the same name and set the `RESOURCE_ID_FIELD_NAME` accordingly.

If you are already using any of the new CRUD fields as custom properties, you need to rename them and update your client accordingly.

The slots collection is no longer used.

The availabilities CRUD collection schema has changed as follows:

- `slotIds` (**removed**): the slots are computed dinamically so this field is no longer used;
- `recurrenceUuid` (**removed**): since the availabilities occurrences are generated dinamically, to identify the recurrence we use the `_id` field;
- `each` (**added**);
- `on` (**added**);
- `untilDate` (**added**);
- `timeZone` (**added**).

The new exceptions CRUD collection must be created if you deploy the service in full mode.

The appointments CRUD collection schema has changed as follows:

- `slotId` (**removed**): since the slots CRUD collection is no longer used, the appointment does not refer a slot UUID, but the availability instead (see new `availabilityId` field);
- `availabilityId` (**added**): this new field links an appointment to an availability and - in combination with `startDate` and `endDate`, identifies the time slot;
- `isFlagged` (**added**): a new boolean flag to keep track of appointments associated to slots no longer valid; 
- `status` (**added**): a new field, inherited from the slots CRUD collection, to track if the appointment is booked;
- `lockExpiration` (**added**): a new field, inherited from the slots CRUD collection, to track if the appointment reservation is expired.

#### Endpoints

- `POST /appointments/`: the behavior of this endpoint depends on the deploy mode (*appointments* or *full*), `bypassLock` and `slotId` in the body are no longer accepted and - if passed - are treated like custom properties, the availability custom properties are no longer merged by default;
- `PATCH /appointments/:id`: the service applies additional restrictions on the kind of updates you can perform on the fields, check the usage documentation for more details;

- `GET /availabilities/`: this endpoint no longer returns all availability occurrences with their slots, but only the CRUD record created through the `POST /availabilities`; you should use `GET /calendar/` to retrieve availabilities, slots, exceptions and appointments;
- `GET /availabilities/count`: this endpoint no longer returns the number of the availability occurrences, but only the number of CRUD records created through the `POST /availabilities`;
- `POST /availabilities/`: this endpoint is now a direct proxy to the CRUD, meaning that each request body - with optional `each`, `on` and `untilDate` fields - is stored directly into the availabilities CRUD collection; all occurrences are computed on the fly when needed in other endpoints;
- `PATCH /availabilities/:id`: if there are appointments booked on slots, which are no longer valid after patching, the endpoint will update the availability without returning an error and flag all the affected appointments;
- `DELETE /availabilities/:id`: if there are appointments booked on slots, the endpoint will delete the availability without returning an error and flag all the affected appointments;
- `DELETE /availabilities/`: if there are appointments booked on slots, the endpoint will delete all the availabilities without returning an error and flag all the affected appointments;

- `GET /slots/`: this endpoint requires the client to specify a period to search slots, since recurring availabilities without expiration can generate an infinite number of slots, and have some limitations in terms of supported CRUD query parameters; since the slots are computed dinamically, the response won't have the common CRUD fields, in particular the `_id` field is generated from `startDate`, `endDate` and `availabilityId`.
- `PATCH /slots/lock/:id`: this endpoint expects the `id` to be in the new format, i.e. as returned by the `GET /slots/` endpoint, it won't accept the UUID of a record from the slots CRUD collection used in version 1.x; if the slot is full or unavailable, this endpoint will return an error.

### Added

- Dynamic availabilities generation
- Dynamic slots generation
- Dynamic exceptions generation
- Create exception (POST /exception/)
- Update exception (PATCH /exception/:id)
- Change exception state (POST /exception/state)
- Get exceptions (GET /exceptions/)
- Delete exception by Id (DELETE /exceptions/:id)
- Delete exceptions (DELETE /exceptions/)
- Get calendar availabilities and slots (GET /calendar/)
- Get calendar exceptions (GET /calendar/)
- Get calendar appointments (GET /calendar/)
- Count exceptions (GET /exceptions/count)
- Added RESOURCE_ID_FIELD_NAME env var
- Added validation for configMap and env vars
- GET /calendar/ also accepts start and end time in _q query parameter

### Changed

- Performance documentation and code improvements after load testing
- Create single availability (POST /availabilities)
- Create recurring availability (POST /availabilities)
- Update single availability (PATCH /availabilities/:id)
- Update recurring availability (PATCH /availabilities/:id)
- Change availabilities state (POST /availabilities/state)
- Delete availabilities (DELETE /availabilities/)
- Get availabilities (GET /availabilities/)
- Delete availability (DELETE /availabilities/:id)
- Create appointment (POST /appointments/)
- Update appointment (PATCH /appointments/:id)
- Delete appointment (DELETE /appointments/:id)
- Change appointment state (POST /appointments/state)
- Get appointments (GET /appointments/)
- Count appointments (GET /appointments/count)
- Get slots (GET /slots/)
- Lock slots (PATCH /slots/lock/:id)
- Update POST /availabilities/ adding the availability `timeZone` in the request body.
- Update PATCH /availabilities/:id adding the availability `timeZone` update.

### Fixed

- Rollback fails when PATCH /availabilities/:id or PATCH /exceptions/:id generate an invalid availability or exception
- Flag only appointments not matching a slot after patching availability (PATCH /availabilities/:id)
- Improve declared TypeScript types after upgrading custom-plugin-lib from v4 to v5
- Always refresh and return reminder IDs on appointment update (PATCH /appointments/:id)
- GET /appointments/ and GET /appointments/count should return only booked appointments by default
- Flag appointments when availabilities state is changed to DRAFT
- PATCH /slots/lock/:id should match exceptions by resource ID
- DELETE /exceptions/ should return 200 and zero records updated when the query is empty
- Fixed POST /availabilities/state and DELETE /availabilities, when there are many slots involved

## [1.3.4] 2022-06-06

- Fixed POST /availabilities/state when called on more than 200 availabilities.
- Added check to create recurrent availabilities with `each` different from `week` and `on` as an empty array
- Removed limit of 200 recurrences in POST /availabilities
- Fixed DELETE /availabilities when called on more than 200 availabilities.

## [1.3.3] 2022-05-19

- Fixed bug in GET /appointments, objects bigger than stream chunks where not parsed correctly
- Fixed the bug regarding the creation of an appointment with the same start and end datetime

## [1.3.2] 2022-05-04

- Fixed bug related to the limit of 200 appointments/availabilities in GET

## [1.3.1] 2022-04-22

### Fixed

- Fixed check in PATCH /appointments

## [1.3.0] 2022-04-07

### Changed

- Return more than 200 appointments with the GET /appointments
- All the Appointment Manager API under the same tag
- Minor doc change in recurrent availabilities limits
- Return more than 200 availabilities with the GET /availabilities

### Fixed

- Fixed check in PATCH /availabilities
- Removing additional properties in queries toward the availabilities collection
- Removing empty $and and $q in query cleaning
- Added check to avoid teleconsultation creation failure in case of misconfiguration
- Added check to prevent date modification in appointments created from slots
- Fixed error related to the `_l` parameter

### Added

Recurrent availabilities

- DELETE /availabilities endpoint added
- POST /availabilities/state modified to handle recurrent availabilities
- GET /availabilities updated to handle recurrent availabilities
- POST /availabilities modified to handle recurrent availabilities

## [1.2.1] 2022-03-21

### BREAKING CHANGES

This version forces you to specify the base path for the teleconsultation link as an environmental variable.  
Thus, the new variable must be specified if the teleconsultation is active

This version adds the `/` at the end of `/appointments`, `/availabilities` and `/slots` `GET` and `POST` routes,
in order to keep them similar to the CRUD Service routes (for compatibility reasons with the Backoffice).
Thus, services calling this version of the Appointment Manager must be updated to the new routes.

### Fixed

- Fix teleconsultation link base path taken from environmental variable
- Missing slash added to the endpoints

## [1.2.0] 2022-03-04

### BREAKING CHANGES

This version renames the `/` routes to `/appointments`, in order to distinguish them from the `/availabilities` ones.
Thus, services calling this version of the Appointment Manager must be updated to the new routes.

### Fixed

- Fix teleconsultation link not created during POST if isRemote != true

### Added

Availability concept and endpoints

- Preventing slot properties modifications in PATCH /appointments/:id
- Removing unused env var
- Minor improvements on doc and schemas
- GET /slots endpoint
- Return slot in GET /availabilities
- Slots marked as AVAILABLE when appointment is deleted or its status changes to DELETED
- POST /appointment updated with slot
- PATCH /availabilities/:id
- GET /availabilities/count
- DELETE /availabilities/:id endpoint
- POST /availabilities/state
- PATCH /slots/lock/:id endpoint
- GET Availability updated to comply with new availabilities
- Updated POST /availabilities with slot concept
- Minor improvements on availabilities implementation
- Adding new availabilities documentation with slot concept
- Addition of booking functionality
- Added possibility to change availability state
- Added lock functionality

## [1.1.2] 2022-02-11

### Fixed

- Fixed no teleconsultation link in messages issue

## [1.1.1] 2022-02-09

### Fixed

- Removed field `teleconsultationParticipants` when creating the teleconsultation, now it retrieves the users from the category defined in the configMap
-  Removed field `teleconsultationParticipants` when updating the teleconsultation, now it retrieves the users from the category defined in the configMap

## [1.1.0] 2022-01-18

### Changed

- Integrate Teleconsultation Service to the PATCH endpoint
- Integrate Teleconsultation Service to the POST endpoint to change the state of an appointment
- Integrate Teleconsultation Service to the DELETE endpoint
- Integrate Teleconsultation Service to the POST endpoint to create a new appointment

## [1.0.1] 2021-12-14

- Headers forwarding via ADDITIONAL_HEADERS_TO_PROXY
- Preventing sending the reminders if the appointment is happening in less than a given threshold

## [1.0.0] 2021-10-08

- First release
