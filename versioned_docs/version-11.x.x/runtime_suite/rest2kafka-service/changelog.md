---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/0.0.1/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] 2022-10-27

**This is the first released version of the `rest2kafka` plugin.**

### Updated

- node to v16
- service dependencies

## [0.2.0] 2022-03-29

### Added

- support to include headers in Kafka message. These headers are extracted from the
HTTP headers when they start with the value set in `KAFKA_HTTP_HEADER_PREFIX` config variable.
This feature is backward-compatible, so that when this variable is not defined, it is not enabled.
- support to use objects as key of Kafka messages

### Changed

- updated service dependencies

## [0.1.4] 2021-11-11

### Changed

- improved error handling and logging

## [0.1.3] 2021-11-11

- fixed build pipeline

## [0.1.2] 2021-11-11 [YANKED]

- no image produced due to issue on the pipeline

## [0.1.1] 2021-11-09 [YANKED]

- no image produced due to issue on the pipeline

### Changed

- added missing Kafka env vars

## [0.1.0] 2021-11-09

### Initial Release

This service can be configured to expose REST endpoint which takes their body and convert them
into Kafka messages to be send to the configured targets.
