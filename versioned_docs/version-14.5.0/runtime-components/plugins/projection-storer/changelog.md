---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-01-23

### Added

- `forceResume` setting field to `controlPlane.settings.channel` that can either be a boolean or an object with a numeric field `timeout.ms`, defining the amount of time for control plane pipelines to be resumed after an unsuccessful connection.

### Changed

- `controlPlane.settings` object now has both `state` and `feedback` marked as optional

### Removed

- `gRPC` Control Plane Feedback client
- `Kafka` Control Plane client

## [1.3.5] - 2024-12-10

### Added

-  Added image signing and SBOM generation in pipeline

### Fixed

- following the introduction of SSL custom configuration in `v1.3.2`, SSL was assumed to be disabled
when `ssl.enabled` property was not specified. This prevents the service to connect to database instances
where SSL is active without configuring `ssl.enabled` to `true`. This release ensure that SSL configuration
is not enforced to `false` when not provided by the user, aligning service behavior to the one prior to version `v1.3.2`. 

## [1.3.4] - 2024-11-19

### Fix

- the logic of provided cast function `castToDate` has been overhauled, so that dates represented as Unix timestamp
in millisecond that ranges from `-2147483648` (`1969-12-07T03:28:36.352Z`) to `2147483647` (`1970-01-25T20:31:23.647Z`)
are now properly converted into their expected date.

## [1.3.3] - 2024-10-25

### Fix

- Bug introduced with version `v1.3.2`, where insufficient service permissions prevented GraalVM cache to be initialized when custom cast functions were employed. 

## [1.3.2] - 2024-10-18

### Fix

- introduce support for TLS/SSL connection for storage component

## [1.3.1] - 2024-09-24

### Fixed

- When Control Plane Operator closes the grpc client the Projection Storer is able to reconnect to it again when it re-opens without having to restart the service

### Update

- update service dependencies and Java build image to `21.0.4_7-jdk-jammy`

## [1.3.0] - 2024-06-04

### Added

- added support for JS ESM modules, in particular 
    - support for new cast function signature, that is:
      ```js
      export default function(messageObject, fieldName, logger) {
        const myValue = messageObject[fieldName]
        // do some custom logic...
        return myValue
      }
      ```
    - kafka message adapter can be loaded as ESM modules, for example:
      ```js
      export default function myEsmMessageAdapter(message, primaryKeys, logger) {
        // ...adapter logic
      }
      ```

### Fixed

- cast function are executed with their own separate bindings, to avoid naming clash.
- when a Javascript custom cast function returns a mixed untyped Object (e.g. `[1, 2, 1.2]`), 
  now the service properly maps the type of each element into the internal one.

## [1.2.3] - 2024-05-27

### Fixed

- when a Javascript custom cast function returns a Javascript Date object, now the service properly maps the type into the internal one

## [1.2.2] - 2024-05-16

### Changed

- when the storage component receives an empty list of projection records, instead of treating it as an error now
it logs a warning message and it proceeds processing the other topic-partition ingestion events

## [1.2.1] - 2024-05-07

### Changed

- now Kafka consumer enters an unhealthy state as soon as a single partition reaches the maximum number of processing attempts

## [1.2.0] - 2024-05-03

### Added

- extend configuration parsing capabilities, so that secrets can be either written directly as plaintext
in the configuration file, loaded from an environment variable or from a file (one file per secret or
using a `.ini` file to group multiple secrets under the same file)

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

This is the initial release of Projection Storer service. A brief overview regarding the service can be found [here](/products/fast_data/projection_storer.md)
while an in depth explanation describing how to configure the service can be found [here](/products/fast_data/configuration/projection_storer.md)
