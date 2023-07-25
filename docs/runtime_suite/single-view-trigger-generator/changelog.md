---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.2] 2023-06-30

### Fixed

- Kafka log level is mapped to the kafkajs string, not number

## [3.0.1] 2023-06-27

### Fixed

- Kafka brokers is a comma separated string, not an array of strings

## [3.0.0] 2023-06-27

### Added

- Added support for the generation of MongoDB projection changes instead of `sv-trigger` kafka messages

### Breaking Changes

- kafkaProjectionChanges configMap does not support `__lookup__` strategy type anymore since `pr-updates` events for `PATCH` operations are supported also by the Single View Creator
- consequently, the service won't emit `sv-trigger` messages of type `patch`, in fact the property `type` has been removed from `sv-trigger` messages altogether 
- kafka configuration is not passed through environment variables but through its own config map [`Input Output Config`](../../fast_data/configuration/single_view_trigger_generator#input-output-config)
- `TRIGGER_TOPIC` environment variable has been generalized and renamed to `EVENT_STORE_TARGET` to have meaning also with mongo collections 

## [2.0.1] 2023-04-14

### Changed

- review error codes to be aligned with the troubleshooting guidelines

## [2.0.0] 2023-04-13

### Breaking Changes

- environmental variables
  - renamed `STRATEGIES_FOLDER` into `MANUAL_STRATEGIES_FOLDER` 
  - renamed `CUSTOM_FUNCTIONS_FOLDER` into `TRIGGER_CUSTOM_FUNCTIONS_FOLDER`
  - removed `USE_AUTOMATIC`
  - `SINGLE_VIEW_NAME`, `ER_SCHEMA_FOLDER`, `PROJECTION_CHANGES_SCHEMA_FOLDER` are now always required
- manual and custom strategy functions are expected to be AsyncGenerator of `IdentifierObject` instead of
returning a Promise containing a list of `IdentifierObject`

### Added

- added support to MongoDB v6.0

### Changed

- upgraded service dependencies, among which the most relevant are
  - `@mia-platform-internal/fast-data-automation-lib@v3`
  - `mongodb@v5`
- removed dependencies not needed anymore
- refactored the service to use Mia eslint standard
- simplified the process of configurations loading removing unnecessary repetition or use cases management
- expanded tests
- refactored how the core logic and service dependencies are composed, removing the need of `fastify-pluging`
- swapped ts-node with swc for transpling tests source code
- upgraded Docker image to node v18.15.0
- reviewed pipeline removing unneeded packages installation
- reduced the size of the trigger message buffer from 500 to 100 to prevent issues with JS garbage collector

### Removed

- removed support to MongoDB v4.0

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
