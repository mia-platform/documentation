---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.3.0] 2022-09-27
### Added
- added support for the new svTriggerHandlerCustomConfig configuration, added interpretation of the new configuration so as to pass the patch operation to the library to execute.

## [5.2.1] 2022-09-27

### Added

- updated `@mia-platform-internal/single-view-creator-lib` @14.2.1 and introduced virtual delete as delete operation option

## [5.2.0] 2022-09-14

### BREAKING CHANGE

- 
- the properties _before_ and _after_ in sv-update messages are empty by default (to include them, the environment variable `ADD_BEFORE_AFTER_CONTENT` must be included and set to _true_)

### Added 
- `mia_metadata_custom_metrics` exposed prometheus client

### Changed

- Changed env vars KAFKA_CONSUMER_GROUP_ID and KAFKA_BROKERS_LIST to KAFKA_GROUP_ID and KAFKA_BROKERS to match the RTU env vars' name

- `PROJECTIONS_CHANGES_COLLECTION` env var is not required anymore

### Updated

- `@mia-platform-internal/single-view-creator-lib` @14.1.1

## [5.1.0] 2022-07-26

### Fixed

- Broken documentation links

### Updated

- `@mia-platform-internal/fast-data-automation-lib` ^2.1.0

## [5.0.0] 2022-07-01

### BREAKING CHANGES

- When performing insert/update of the Single View, the __STATE__ field of the single view passed is kept if existing; otherwise is set to PUBLIC. So, it is now possible to create a Single View or update one to set it to a state different from PUBLIC.

### Updated

- `@mia-platform-internal/single-view-creator-lib` @12.0.0

## [4.3.0] 2022-06-29

### Added

- Updated SVC lib version to `11.1.1` and added new env vars `KAFKA_SV_UPDATE_TOPIC` and `SEND_SV_UPDATE_TO_KAFKA`

## [4.2.0] 2022-05-26

### Added

- Added the possibility to specify a custom function as updateSV and deleteSV through the environments variable UPSERT_STRATEGY and DELETE_STRATEGY

## [4.1.1] 2022-05-25

### Fixed

- removed sorting of reading PC from MongoDB for performance reasons

## [4.1.0] 2022-05-23

### Updated

- `@mia-platform-internal/fast-data-automation-lib` ^1.5.0

### Added

- added `dependencyOrder` field for aggregation schema to specify the order of solving of dependencies

## [4.0.0] 2022-05-17

### BREAKING CHANGE

- `single view before-after` message `kafkaInfo` field changed into `__internal__kafkaInfo` to align it to others events

### Changed

- `single view event` messages now have `__internal__kafkaInfo` field

### Updated

- `@mia-platform-internal/fast-data-automation-lib` "^1.4.1
- `@mia-platform-internal/single-view-creator-lib` "^11.0.0

## [3.10.0] 2022-05-04

### Updated

- @mia-platform-internal/single-view-creator-lib @^10.0.0
- @mia-platform-internal/fast-data-automation-lib @^1.4.0

## [3.9.0] 2022-04-26

### Fixed

- \_\_string\_\_ constant now supports any characters

### Updated

- @mia-platform-internal/fast-data-automation-lib ^1.3.2

### Added

- add CA cert support. Env var for path definition: `CA_CERT_PATH`.

## [3.8.1] 2022-04-11

### Updated

- @mia-platform-internal/single-view-creator-lib @^9.8.1

### Fixed

- parsing of timestamp when using Projection Changes read from kafka

## [3.8.0] 2022-04-06

### Updated

- @mia-platform-internal/single-view-creator-lib @^9.8.0

### Added

- Added option to read projection changes from kafka instead of mongo. The newly introduced variables are: PROJECTIONS_CHANGES_SOURCE, KAFKA_CONSUMER_GROUP_ID, KAFKA_PROJECTION_CHANGES_TOPICS.

## [3.7.2] 2022-03-29

### Updated

- @mia-platform-internal/single-view-creator-lib @^9.7.0

## [3.7.1] 2022-03-28

### Updated

- @mia-platform-internal/fast-data-automation-lib ^1.3.0

## [3.7.0] 2022-03-28

### Updated

- @mia-platform-internal/single-view-creator-lib @^9.7.0

### Added

- Added `projectionToSvTime` prometheus metric to track the time spent between the projection kafka production to the SV generation.


## [3.6.0] 2022-03-21

### Added

- @mia-platform-internal/fast-data-automation-lib": "^1.2.0
- logical expression and conditions in aggregation
- validate aggregation schema against a JSON Schema

## [3.5.1] 2022-03-17

### Changed

- updated MongoDb npm driver to version `4.4.1`

## [3.5.0] 2022-03-11

### Added

- added the possibility of inserting inside the CONFIGURATION_FOLDER a custom validator function for single views

## [3.4.2] 2022-02-25

### Fixed

- process again Projection Changes left IN_PROGRESS due to a prior Single View Creator crash while processing fixed

### Added

- SINGLE_VIEWS_MAX_PROCESSING_MINUTES environment variable

### Updated

- @mia-platform-internal/single-view-creator-lib @^9.6.3

## [3.4.1] 2022-02-25

### Fixed

- process again Projection Changes left IN_PROGRESS due to a prior Single View Creator crash while processing

### Updated

- tap@15.1.6
- node:14.19.0-alpine
- @mia-platform-internal/single-view-creator-lib @^9.6.3
- @mia-platform-internal/fast-data-automation-lib @^1.1.1

## [3.4.0] 2022-02-10

### Updated

- fast-data-automation-lib@1.1.0

### Added

- support to __string__, __integer__, __boolean__

## [3.3.1] 2022-02-01

### Fixed

- do not use dependency resolved of previous iteration for mapping in a config

### Updated

- fast-data-automation-lib@1.0.1

## [3.3.0] 2022-01-25

### Added

- Added automation of aggregation and singleViewKey using json configuration

## [3.2.0] 2021-11-30

### Added

- insert in Single View and Before After kafka information about original kafka message that triggered the Fast Data update. Information are taken from the projection changes. 

## [3.1.0] 2021-10-26

### Added

- UPSERT_STRATEGY env to choose if SV have to be updated or replaced with the new one

## [3.0.2] 2021-09-28

### Updated

- @mia-platform-internal/single-view-creator-lib": ^9.3.0 to have crud fields in single view error documents

## [3.0.1] 2021-09-23

### Fixed

- dockerfile use node:14.16.1

## [3.0.0] 2021-09-22

### Breaking Changes

- @mia-platform-internal/single-view-creator-lib": ^9.2.1
- @mia-platform-internal/single-view-versioning-lib": ^1.10.9
- @mia-platform/custom-plugin-lib: ^2.3.0
- @mia-platform/lc39: "^3.3.0"
- luxon: ^1.28.0
- mongodb: ^3.7.1
- node: 14.17.6

## [2.0.0] 2021-07-13

### Updated

- @mia-platform-internal/single-view-creator-lib": ^8.3.0
- @mia-platform-internal/single-view-versioning-lib": ^1.10.7

### Breaking changes

- changed docker image into `fast-data/single-view-creator-plugin`

## [1.0.0] 2021-04-16

- init
