---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased


### Fixes

- Fixed typos and changed docs links inside `docs` directory

## v5.1.0 - 2022-02-15

### Added

- Naming convention of shared schemas can be customized using the option `oasRefResolver` with the function `buildLocalReference`. If the option is not exported, the `fastify-swagger` default is used.

## v5.0.0 - 2021-08-24

### Added

- Support for **OpenAPI 3**

### Changed
- Restricted `logLevel` type from `string` to `'info' | 'error' | 'debug' | 'fatal' | 'warn' | 'trace'`

### **BREAKING CHANGES**

- The used OpenAPI version is picked from the service option `openApiSpecification` inside `swaggerDefinition`. Values can be
  - `'swagger'` for `Swagger 2.0`
  - `'openapi'` for `OpenAPI 3`
  - if the option is not specified, `OpenAPI 3` is default

### Fixed

- set the log level of route `/-/metrics` equal to the status routes

## v4.2.0 - 2021-07-29

### Added

- added metrics options to pass to fastify-metrics

## v4.1.0 - 2021-07-20

### Added

- new fields params in `url` field in incoming request and request completed logs
- add additional information to response logs

## v4.0.0 - 2021-04-20

### BREAKING CHANGES

- fastify to v3.14.2. You can see all the breaking changes in the new fastify version [here](https://github.com/fastify/fastify/releases/tag/v3.0.0)
- update [prom-client](https://github.com/siimon/prom-client/tree/v13.1.0) to v13
- flag `--options` and `--address` are no more supported

### Added

- log timestamp has precision in milliseconds instead of seconds.

### Updated

- commander to v7.2.0
- fastify-metrics to v7.1.0
- fastify-plugin to v3.0.0
- fastify-sensible to v3.1.1
- fastify-swagger to v4.6.0

## v4.0.0-rc.0 - 2020-12-21

### BREAKING CHANGES

- fastify to v3.9.2. You can see all the breaking changes in the new fastify version [here](https://github.com/fastify/fastify/releases/tag/v3.0.0)

### Updated

- commander to v6.2.0
- fastify-metrics to v6.0.3
- fastify-plugin to v3.0.0
- fastify-sensible to v3.1.0
- fastify-swagger to v3.5.0

## v3.2.0 - 2020-11-13

### Added
- added transformSchemaForSwagger to edit schema used by swagger

## v3.1.4 - 2020-10-08

### Fixed

- log http.response.body.bytes should be of type int. Fixed and added test cases, also added json schema validation and logs documentation.

## v3.1.3 - 2020-10-02

### Fixed

- added forwardedHostname and modified other wrong log values

## v3.1.2 - 2020-09-29

### Fixed

- replaced `reply.res.getHeader('content-length')` with `reply.getHeader('content-length')` in order to get `content-length` header.

## 3.1.1 - 2020-09-22

### Fixed

- moved userAgent property inside of request property. This is a breaking change in the log format, but we will handle this as a bug.

## v3.1.0 - 2020-07-14

### Added

- Feature flag for prometheus integration

## v3.0.0 - 2020-07-10

### BREAKING CHANGES

- Dropped support to Node 8
- Request and response logged information are now compliant with Mia-Platform logging guidelines. To see the guidelines, please check [Mia Platform Docs](../../getting_started/monitoring-dashboard/dev_ops_guide/log). You can find the implementation details [here](https://github.com/mia-platform/lc39/blob/master/lib/custom-logger.js).

### Added

- Support to `stream` option to support log intercepting during tests
- Integrate Prometheus

### Changed

- Update commander 2.20.0 -> 3.0.2
- Update dotenv 8.0.0 -> 8.2.1
- Update fastify 2.11.0 -> 2.12.1
- Update fastify-plugin 1.6.0 -> 1.6.1
- Update fastify-swagger 2.4.0 -> 2.5.1
- Update make-promises-safe 5.0.0 -> 5.1.0

## v2.4.0 - 2020-01-31

### Added

- Added default `return503OnClosing: false` option to Fastify
- Added `SIGTERM` signal handler

### Changed

- Update fastify 2.7.1 -> 2.11.0

## v2.3.0 - 2019-11-21

### Changed

- Updated status routes log level to error instead of silent (unless silent is provided from configuration).

## v2.2.2 - 2019-08-08

- Update fastify 2.6.0 -> 2.7.1

## v2.2.1 - 2019-07-08

### Changed

- Update fastify 2.5.0 -> 2.6.0

## v2.2.0 - 2019-06-20

### Added

- Add `/-/check-up` status endpoint

### Changed

- Update fastify-sensible 2.0.1 -> 2.1.1
- Update fastify 2.4.1 -> 2.5.0
- Update fastify-plugin 1.5.0 -> 1.6.0

## v2.1.2 - 2019-05-22

### Changed

- Update fastify 2.3.0 -> 2.4.1
- Update fastify-swagger 2.3.2 -> 2.4.0
- New eslint configuration

## v2.1.1 - 2019-05-03

### Changed

- Update fastify 2.2.0 -> 2.3.0
- Update dotenv 7.0.0 -> 8.0.0

## v2.1.0 - 2019-04-17

### Added

- Add default `bodyLimit` parameter to `fastify`

## v2.0.0 - 2019-04-11

### Added

- Add typescript definitions

### Changed

- The exported module will create a `fastify` instace that is not listening
  on any port.

## v1.1.0 - 2019-04-10

### Added

- Add `errorHandler` options for customize `fastify-sensible`
  auto handling of non caught errors

## v1.0.0 - 2019-04-09

### Added

- Add `fastify-sensible` plugin integration

## v0.4.0 - 2019-04-08

### Added

- Add `/documentation/` route via `fastify-swagger`

### Changed

- Update commander 2.19.0 -> 2.20.0
- Update dotenv 6.2.0 -> 7.0.0
- Update dotenv-expand 4.2.0 -> 5.1.0
- Update fastify 1.14.0 -> 2.2.0
- Update fastify-plugin 1.4.0 -> 1.5.0
- Update make-promises-safe 4.0.0 -> 5.0.0
- Update eslint 5.14.1 -> 5.16.0
- Update tap 12.5.3 -> 12.6.1
- Use directly eslint-config-mia without standard-mia engine
- Use the `fastify` embedded version of `pino`

## v0.3.0 - 2019-02-06

### Changed

- Fixed `ENV` injection in `testLaunch` function
- Fixed override of default values in `testLaunch` function
- Relicensed under Apache 2.0 from MIT

## v0.2.0 - 2019-01-16

### Added

- Add `/-/healthz and` `/-/ready` status endpoints.

## v0.1.0 - 2019-01-08

- Initial release
