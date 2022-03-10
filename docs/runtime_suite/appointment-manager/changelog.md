---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
