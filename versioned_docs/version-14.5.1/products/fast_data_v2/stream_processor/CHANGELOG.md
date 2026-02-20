---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---


All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.1] - 2026-02-19

### Fixed

- Fixed control plane startup behavior to resume
- Explicit error on missing SERVICE_NAME missing var

## [0.6.0] - 2026-02-02

### BREAKING

- Stabilize cache hash and add script to compute it in JS
- New [schema](https://cdn.mia-platform.eu/runtime/platform/data-fabric/stream-processor/v0.6.0/stream-processor.schema.json) with required connection configuration in service config and modified cache configuration in service config

### Added

- Added support to Fast Data Control Plane v2
- Add ci for v branches
- Remove hard fail on console.log buffer exceeded

## [0.5.6] - 2026-01-13

### Added

- Add ci for v branches
- Remove hard fail on console.log buffer exceeded

## [0.5.5] - 2025-12-11

### Added

- Add http cache get-only mode in sp caches
- Add schema push script
- Add farmdata as external cache

### Dependencies

- Update compatible dependencies

## [0.5.4] - 2025-11-18

### Added

- Add dlq for processing errors
- Allow connection grouping in config file

### Dependencies

- Update rust crate axum to 0.8.6
- Update docker.io/rust:1.90.0-alpine3.22 docker digest to b4b54b1

### Fixed

- `onError` is not required

## [0.5.3] - 2025-10-14

### Added

- Add md5 hashing function to caches object

### Dependencies

- Upgrade axum@0.8.6
- Update grafana/tempo docker tag to v2.9.0
- Update docker.io/alpine docker tag to v3.22.2
- Update rust crate serde to 1.0.228
- Update grafana/grafana docker tag to v12.2.0

## [0.5.2] - 2025-09-26

### Changed

- Reduce default commit interval from 3000ms to 1500ms

### Dependencies

- Update prom/prometheus docker tag to v3.6.0
- Update rust crate serde to 1.0.226
- Update docker.io/rust docker tag to v1.90.0
- Update rust crate serde to 1.0.225
- Update rust crate anyhow to 1.0.100
- Update rust crate typed-builder to 0.22.0
- Update httputils@0.2.0
- Update rust crate serde to 1.0.224
- Update apache/kafka docker tag to v4.1.0
- Update rust crate twox-hash to 2.1.2

### Documentation

- Align pages with public documentation
- Remove typo
- Introduce first documentation pages for the service

### Fixed

- Trace parent is now correctly assigned to consumer span
- Ensure trace context is propagated in Kafka headers

## [0.5.1] - 2025-09-01

### Added

- Add tracking of consumer lag as feedback metadata
- Define service startup behavior when enabling communication with control plane

### Changed

- Emit partition alongside consumer lag in cp metadata
- Use consumer lag wrapper for feedback metadata

### Fixed

- Update rust crate thiserror to 2.0.16
- Update rust crate thiserror to 2.0.15
- Update rust crate thiserror to 2.0.14
- Ensure startup behavior is triggered when both control plane config and binding file are provided
- Ensure proper reporting of consumer lag and consumer queue metrics

## [0.5.0] - 2025-08-06

### BREAKING

- Add cache access support in the JS sandbox for stateful processing

## [0.4.0] - 2025-07-24

### Changed

- Core utils in a separate crate from bin + common structures

### Documentation

- Add example of farm data pre-filter logic
- Prevent code block to run as rust code in tests

### Fixed

- Update rust crate rdkafka to 0.38.0
- Review commit poll task implementation to avoid blocking

## [0.3.0] - 2025-07-10

### Added

- Add processing and kafka consumer queue metrics
- Remove serialize config + add deserialize config for payload

### Documentation

- Describe service resources on k8s

### Fixed

- Safe impl of `JsLifetime`
- Update rust crate tokio to 1.46.1
- Update rust crate tokio to 1.46.0

## [0.2.0] - 2025-06-30

### Added

- Introduce support for tombstone events
- Add auto.offset.reset default
- Add hosts use case
- Add configs to work with local farm-data
- Add support for string key and introduce CDC adapters examples

### Changed

- Improve Kafka delivery/commit logic
- Processor automatically handle messages whose value is...

### Documentation

- Add detail regarding cmake
- Describe service and update with proper details

### Fixed

- Test
- Update rust crate backon to 1.5.1
- Update rust crate tokio to 1.45.1
- Update rust crate uuid to 1.17.0
- Ensure user module name does not break the service
- Bring cp logic to the rb
- Update rust crate axum to 0.8.4
- Update rust crate chrono to 0.4.41
- Update rust crate rand to 0.9.1
- Exceptions in sandbox did not shutdown the service
- Update rust crate tokio to 1.44.2

## [0.1.0] - 2025-04-01

### Added

- Add CHANGELOG
- Add CI retry on spurious test failure
- Add handling of message with data nested under payload property
- Introduce proper OpenTelemetry instrumentation
- Add health and metrics routes
- Change error messages
- Add secret_rs
- Add sandbox
- Add rebalance management logic
- Initial working solution
- Initialize repository

### Fixed

- Update rust crate once_cell to 1.21.3
- Remove expand.rs

<!-- generated by git-cliff -->
