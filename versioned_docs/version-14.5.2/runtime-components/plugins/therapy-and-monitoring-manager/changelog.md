---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] 2025-09-04

## Changed

- Update to Node.JS 22 (lts/jod)
- Vulnerability fixed
- Moved to distroless Dockerfile

## [0.5.1] 2024-11-12

### Fixed

- Convert thresholds `propertyName` according to prototype `values` when creating or updating a monitoring plan

## [0.5.0] 2024-10-30

### Changed

- Save thresholds validation results when detection is created or updated
- Add `values` to the prototypes schema.
- Upgrade `custom-plugin-lib` to version `7.0.0` and `fastify-cron` to `1.3.1` and add default error handler.

### Fixed

- Fix bug causing detections reported as OK if a threshold field is not found in the detection value.

## [0.4.0] 2024-09-11

- Update Node.js to v20 (LTS)

### Added

- Add `assignedDevices` field to `monitorings`
- Add `deviceId` field to `detections`
- Add `PROTOTYPES_SERVICE_URL` env var to fetch prototypes from an external HTTP service
- Add `POST /detections/bulk` endpoint to create multiple detections
- Add `POST /detections/chart-data/` endpoint to get data in a format suitable for rendering with [`ck-chart`][ck-chart]

### Fixed

- With CRUD Service v6.9.0 or later the CRUD `GET /export` returns data in JSON format instead of NDJSON with default HTTP client headers

## [0.3.0] 2023-11-28

### Added

- Added `NOTIFICATION_MANAGER_URL` environment variable for enabling and setting the notification manager
- Send event to the Notification Manager when a new therapy is created
- Send event to the Notification Manager when a therapy is updated
- Send event to the Notification Manager when a therapy is deleted
- Send event to the Notification Manager when a new monitoring is created
- Send event to the Notification Manager when a monitoring is updated
- Send event to the Notification Manager when a monitoring is deleted
- Update POST /detections endpoint to check if detection exceeds the monitoring plan thresholds
- Add threshold validation internal library module
- Add external threshold validation
- Updated PATCH /detections/:id for performing integrated/external validation
- Add integration test suite for the Notification Manager

## [0.2.0] 2023-09-05

### BREAKING CHANGES

Detections routes, previously called `Observations`, have been renamed.

### Changed

- Fix documentation links
- Rename 'observation' to 'detection'
- Create therapies without 'each' field
- Add localized prototype hints
- Update **monitorings** with 'between' and 'notBetween' operators to be used in 'thresholds'.
- Create therapies with directives
- Skip adherence computation on therapies without a time schedule
- Add configurable defaults for adherence and compliance tolerance and minimum threshold
- Set defaults on therapies and monitorings update
- Update therapies with directives
- Disable compliance and adherence for a monitoring or therapy (POST)
- Add configurable limit on patient active plans
- Disable compliance and adherence for a monitoring or therapy (PATCH /:id)
- Add adherence and compliance status for therapies and monitorings with default env vars
- Fixed creatorId and updaterId CRUD fields to always set to 'public'

## [0.1.0] 2023-01-12

### Added

- Add GET /prototypes/ endpoint
- Add GET /therapies/ endpoint
- Add POST /therapies/ endpoint
- Add PATCH /therapies/:id endpoint
- Add DELETE /therapies/:id endpoint
- Add GET /observations/ endpoint
- Add POST /observations/ endpoint
- Add PATCH /observations/:id endpoint
- Add DELETE /observations/:id endpoint
- Add GET /monitoring/ endpoint
- Add POST /monitoring/ endpoint
- Add PATCH /monitoring/:id endpoint
- Add GET /therapies/count endpoint
- Add GET /prototypes/count endpoint
- Add GET /observations/count endpoint
- Add GET /monitoring/count endpoint
- Add computation of adherence and compliance metrics
- Add DELETE /monitorings/:id endpoint
- Add cron job for adherence and compliance computation
- Renaming observations to detections 

### Fixed

- PATCH /therapies/:id must prevent plan updates if observations were submitted
- PATCH /monitorings/:id must prevent plan updates if observations were submitted
- Patching therapy or monitorings returns unexpected error 'Invalid CRUD Resource'
- Fix issues detected during internal demo


[ck-chart]: /runtime-components/plugins/care-kit/20_components/70_ck-chart.md
