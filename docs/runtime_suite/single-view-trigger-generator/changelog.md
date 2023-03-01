---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] 2023-02-24

### Changed

- Added env var `READ_TOPIC_FROM_BEGINNING` to read `pr-update` messages topic from the beginning
- Readiness route working, improve on handling of kafka consumer heartbeat, faster service start up by removing `await` on `consumer.run`

## [1.0.0] 2023-01-20

### Breaking Change

- Changed `kafka projections` to `kafka projection updates` to match the RTU env var

## [0.3.2] 2022-12-20

### Fixed

- Strategy resolution matched all documents when both fields in a erSchema condition were inexistent on the starting document. Now the query does not match any documents in that case. This fix comes with @mia-platform-internal/fast-data-automation-lib: 2.3.4

## [0.3.1] 2022-11-29

- Projection update messages are correctly resolved after the sending the `sv-trigger` messages 

## [0.3.0] 2022-11-24

### Added

- Added the `neededFieldsMap` system in the strategy execution

## [0.2.0] 2022-11-21

### Changed

- Messages sent to TRIGGER_TOPIC are grouped and sent all at once
- Included algorithm of grouping messages based on the message key

## [0.1.1] 2022-11-11

### Changed

- Removed lodash and ramda functions
- Updated bucket values for the "strategy execution time" prometheus metric
- Updated `@mia-platform-internal/fast-data-automation-lib` to v2.2.1

## [0.1.0] 2022-11-03

### Added

- Added the strategy execution time metric
- Added the health routes (health, ready, check-up)

### Changed

- updated `getStrategyFunctionFromAutomatic` inside `getStrategies` to support the new automator function with `UpdateEvent` as parameter

### Fixed

- Moved `resolveOffset` method from the `finally` block to the `try` block and added error rethrow inside `catch` of the `consumer.run` method

## [0.0.2-rc.1] 2022-09-30

## [0.0.2-rc.0] 2022-09-30
### Changed

- Refactor of the main test and other files
- Renaming triggerer with trigger generator

## [0.0.1] 2022-08-31
