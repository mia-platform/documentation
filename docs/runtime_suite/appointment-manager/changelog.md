---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
