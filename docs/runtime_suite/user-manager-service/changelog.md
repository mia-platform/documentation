---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] 2022-06-08

### Changed

- userGroups and email are no longer required for GET /users

## [1.0.1] 2022-06-06

### Changed

- It's not possible to modify or unset the authUserId in patchById
- It's not possible to patch an user with an non-existing userGroup. The user schema is now validated against the new user group (if set)

## [1.0.0] 2022-05-03

### Added

- Documentation added

### Changed

- Repository transfer
- New test structure
- Error messages improved
- Ensure backward compatibility
- Env var used for userinfo properties instead of configuration

### BREAKING CHANGES

- This version contains changes to the error objects.
This new format can be breaking if your microservices are explicitly using the old error objects content.
- This version requires at least v4.3.0 of crud service since we are using the query parameter `_rawp` in the
user manager service (see [here](../../runtime_suite/crud-service/overview_and_usage#return-a-subset-of-properties) for further information).
- The userinfo additional properties are now handled via the `USERINFO_ADDITIONAL_PROPERTIES` environment variable.
Additional properties via configuration file are no longer available.

## [0.7.4] 2022-04-14

### Added

- Create users only in crud

## [0.7.3] 2022-04-06

### Changed

- Patched login endpoint, now cookie auth is supported

## [0.7.2] 2022-03-09

### Changed

- `POST /user` route for user creation doesn't forcibly require `username` field anymore, if necessary it should be configured in the relative `userGroup` configuration `crudSchema`

## [0.7.1] 2022-03-03

### Fixed

- Fixed auth0 DB name as env var instead of hardcoded

## [0.7.0] 2021-12-30

### Updated

- Added /oauth/token endpoint for authentication
- Added /refreshtoken endpoint for authentication token refresh

### Fixed

- Body validation when patching a user

## [0.6.1] 2021-11-10

### Fixed

- Hardcoded `client-type` removed

## [0.6.0] 2021-10-21

- `POST /user/with-id` endpoint added
- `/userinfo` endpoint added

## [0.5.2] 2021-10-13

- Username ambiguities (username used for auth0 nickname and name)

## [0.5.1] 2021-09-08

### Fixed

- User creation inversion (creation in CRUD before Auth Client)
- Reaching total test coverage on change state function

## [0.5.0] 2021-09-03
