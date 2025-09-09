---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2024-04-23

### Added

- introduce support for GRPC as communication protocol in Runtime Management component

### Changed

- improved logging messages for internal communication errors to clarify their cause and how to solve it
- Kafka consumer rebalance logic has been revised, adding a deadline to the wait for records processing end. In this manner 
rebalance operations do not hang indefinitely

### Fixed

- when internal timeout error (`FD_PS_E7001`) is raised, now the service does not hang indefinitely when it is stopped

## [1.1.0] - 2024-04-12

### Added

- introduce support for Runtime Management features, such as pause and resume of consumption from ingestion topics

### Changed

- set ingestion consumer to adopt `org.apache.kafka.clients.consumer.StickyAssignor` partition assigner
- relax the constraint where an ingestion consumer was not ready when no partition was assigned to it
- relax Kafka configuration constrain on auto topic creation

### Fixed

- when any projection-update topic configuration is not provided, the service now warns the user that
the configuration is missing such topics, instead of throwing. This enables use cases where the only
goal of projection storer is to ingest change events, process and store them without notifying downstream components

## [1.0.1] - 2023-12-19

### Fixed

- when an ingestion event representing a `DELETE` operation is processed, in case it is not possible to extract the `before`
property from the message itself, the service tries to retrieve it from the storage system. In case it does not find it,
the `before` property of the `DELETE` operation is then set to the projection record's key as fallback.
- when employing `custom` message adapter, when an empty payload is received, it ensured that a buffer of zero length is
sent to the user-defined implementation. In this manner, they can design their own logic to properly treat such cases.

### Changed

- service dependencies were updated
- unused error codes were removed

## [1.0.0] - 2023-11-09

This is the initial release of Projection Storer service. A brief overview regarding the service can be found [here](/fast_data/projection_storer.md)
while an in depth explanation describing how to configure the service can be found [here](/fast_data/configuration/projection_storer.md)
