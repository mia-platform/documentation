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

## [1.5.3] - 2025-01-07

### CI

- introduce image signing and SBOM generation in CI pipeline

## [1.5.2] - 2023-10-23

### Added

- introduce support for `snappy` compression in Java native image
- introduce environment variable `JAVA_OPTS` for configuring native image parameters

### Changed

- updated Docker image employed for build and runtime stages

## [1.5.1] - 2023-10-05

### Fixed

- An incoming Kafka message with `null` key is now handled correctly

## [1.5.0] - 2023-08-10

### Added

- messages are cached until they reach a tunable size and then uploaded
- cached messages are always uploaded after a tunable timeout to reach `lag=0` on topics
- introduced config key `bss.cache-upload-timeout` which controls `lag=0` policy timeout
- introduced config key `bss.max-bytes-per-file` (default 8MB) to establish the average file size to upload. Setting `0` recovers `v1.4.0` behavior.
- introduced config key `bss.max-cache-size` (default 10MB)

### Fixed

- kafka consumer, event producer and reingestion producer are functioning java beans
- introduced missing shutdown logic
- kafka deserializer is ByteArrayDeserializer (no content knowledge of messages payload or key is needed here)
- log levels of internal libraries `com.google.api.client`, `org.apache.kafka.common`, `io.netty.buffer`, and `io.opencensus` lifted to WARN

## [1.4.0] - 2023-06-28

### Added

- new configuration parameter `bucket-folder` for each ingestion topic, which allows to customize the folder where topic messages are stored 

## [1.3.2] - 2023-03-15

### Fixed

- bulding native image works again

## [1.3.1] - 2023-03-15 [Removed]

### Fixed

- Post-ingestion topics are now optional when forwarding ingestion messages is disabled (`enable-post-ingestion: false`)

### Changed

- upgraded service dependencies

## [1.3.0] - 2023-01-13

### Changed

- refactored service settings to remove references to Fast Data
- upgraded service dependencies

## [1.2.0] - 2022-12-30

### Added

- new metric to monitor the number of messages written to the bucket

### Changed

- file name now includes again the offset of the first message contained in the file
- review README.md to clarify concepts and correct configurations
- rename variables, error codes and metrics to reduce coupling with Fast Data concepts 
- upgrade service dependencies

## [1.1.3] - 2022-11-30

### Changed

- remove default topics from app settings in application.yml config file

## [1.1.2] - 2022-11-28

### Changed

- rename image name generated by the CI
- update service dependencies

## [1.1.1] - 2022-11-24

### Added

- introduce custom metric to monitor bucket requests

## [1.1.0] - 2022-11-23 

### Added

- introduce support for Buckets employing S3 APIs

### Changed

- improve code removing unnecessary coroutine creation
- updated service dependencies

## [1.0.4] - 2022-11-10

### Changed

- upgraded service dependencies
- mechanism to generate output object name: now a file name contains also the topic name from which
messages arrives, whereas offset of first record has been replaced with timestamp of when the object
is created

### Fixed

- re-balance test

## [1.0.3] - 2022-11-02

### Fixed

- re-balance listener logic has been reviewed to avoid deadlock situations where the consumer stops
processing
- removed Main entrypoint to allow the application properly shutdown gracefully

## [1.0.2] - 2022-10-28

### Changed

- add newline after the last record written to a batch file to avoid potential issues with edge cases in file processors

## [1.0.1] - 2022-10-27

### Changed

- review logging when offsets are committed

## [1.0.0] - 2022-10-27

### Initial Release

This is the initial version of the service, which subscribes to Fast Data ingestion topics,
store those incoming messages into a bucket and emits a notification event onto a predisposed Kafka topic.

Optionally, it can forward messages from ingestion topics towards post-ingestion ones.
