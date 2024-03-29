---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## v1.1.2 - 2021-12-14

### Fixed
- moved operationType filter from mongo driver to runtime
- mapped resume token lost error with code 286
 
## v1.1.1 - 2021-02-26

### Fixed

- fixed dockerfile jar position

## v1.1.0 - 2021-02-09

### Added
- Added recovery strategy for resume token errors.

### Updated
- [Issue #2](https://git.tools.mia-platform.eu/platform/core/mongo2kafka/-/issues/2) Set Kafka authentication as optional.

## v1.0.3 - 2020-11-04

### Updated
- Added Java Gradle pipelines to gitlab-ci.yml file, removed Testcontainers and updated Kmongo dependency. From this version mongo 4.4 support is guaranteed.


### v1.0.2 - 2019-11-19

### Fixed
 - fixed logger class instance.

## v1.0.1 - 2019-11-18 

### Added
 - logging.

### Fixed
 - deleting resume token and restarting the service on `MongoCommandException` with error code `40858`.

## v1.0.0 - 2019-10-07
