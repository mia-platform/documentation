---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
