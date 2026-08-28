---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/0.0.1/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] 2025-03-18

### Updated

- service dependencies
- Node min version to v22
- gitlab CI to include `sbom-and-sign-docker` job

## [1.2.0] 2024-05-03

### Added
- environment variable `KAFKA_SSL_ENABLED` to allow the user to specify the `ssl` parameter of the KafkaJS client

### Updated
- service dependencies

## [1.1.0] 2024-04-30

### Added
- property `keyAsJson` that allows users to set the Kafka message key as a JSON, containing the key field configured in the `keyField` property;

### Updated
- node to v20 iron
- service dependencies

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
