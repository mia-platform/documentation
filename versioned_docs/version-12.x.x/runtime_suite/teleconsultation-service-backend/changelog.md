---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] 2024-02-13

- Added possibility to set virtual background for user group from configMap

## [1.6.0] 2024-01-09

- Node version updated to lts/hydrogen
- Added support for video call background image upload and use, and support for language management

### Added

- Added `duration_in_seconds` to POST and PATCH /teleconsultation body
- Added room details as stored on Kaleyra in the API `GET /teleconsultation/:id`

## [1.5.1] 2023-10-04

- Added `TELECONSULTATION_DELETE_UPLOADS` environment variable to enable deletion of files uploaded in a room

## [1.5.0] 2023-10-03

### Added

- Added DELETE /teleconsultation/:idRoomToDelete/uploads to delete files uploaded in a room

### Changed

- Removed all refs to Bandyer and changed them to Kaleyra in documentation.

## [1.4.0] 2023-08-03

### Added

- Added POST /credentials endpoint.

### Fixed

- Fixed documentation links.

## [1.3.0] 2023-01-09

### Added

- Added environment variable `LIVE_TELECONSULTATION`.

## Changed

- Update CRUD client to match CRUD's endpoint paths

## [1.2.1] 2022-10-11

### Fixed

- `IMMUTABLE_PERIOD_MS` is now handled correctly, as an environment variable.

## [1.2.0] 2022-06-21

### Breaking changes

- If you want to continue using auth0 dependency, in an existing project, make sure `AUTH_SERVICE` env variable is set (`auth0-client` was set as default value in previous versions).
- In order to update to this version, you must change your CRUD service's schema (and eventually consequently update existing data in mongo):
  - _User Id Map_ collection: `auth0Id` must be changed with `receivedUserId`
  - _Teleconsultations_ collection: `participantsNumber`,  `startDate`, `endDate` must be added
- `/telecons-fe/teleconsultation` endpoint must be removed from console project

### Added

- Auth0 dependency isn't mandatory anymore. This is a **breaking change**. 
- Partial participant list can be provided to `POST /teleconsultation` request
- Added endpoint (`POST /teleconsultation/:id/participants/data`) to add a new participant to an existing teleconsultation 

### Fixed

- Fixed permission handling: if some user doesn't have a group included in the ones defined in the service configuration, an error is returned to the caller.

## [1.1.2] 2022-05-04

- Added env var UNLIMITED_TELECONSULTATION (if set to true, the timer will not appear during the call)

## [1.1.1] 2022-04-11

- Fixed logo and company theme issue

## [1.1.0] 2022-03-31

### Changed

- Teleconsultation via iframe
- Documentation updated for teleconsultation via iframe

## [1.0.1] 2021-12-28

### Fixed

- Change response status codes of POST from 204 to 201 and PATCH from 200 to 204

## [1.0.0] 2021-12-01

- Last modification of the first released of the Teleconsultation Service