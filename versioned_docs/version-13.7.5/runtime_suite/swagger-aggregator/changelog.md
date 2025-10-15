---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---



## [3.9.2] 2024-02-28

### Changed

- `example` and `examples` are removed from `parameters` object inside `paths` because API Portal shows them as default values

## [3.9.1] 2024-02-17

### Versioning

- Updated Node to 22
- `ajv@^8.17.0`
- `fs-extra@^11.2.0`,
- Dev dependencies updated

## [3.9.0] 2025-02-14

### Updated

- Updated Api Portal to version `2.2.0`
- GET `/ui-config` endpoint now returns also the custom logo for the API Portal, when configured.

### Added

- Added `apiPortalConfig` configurable object in the `swagger-config.json`, to specify a custom prefix, logo or favicon for the API Portal.
- Added GET `/api-portal/config` endpoint to retrieve the config for the API Portal, such as the prefix with which call the backend.

## [3.8.3] 2024-12-16

### Fixed

- `transformPaths` correctly handles situation where a path contains another (e.g., `/generate` and `/generateFromFile`)

## [3.8.2] 2024-11-27

### Security

- Added SBOM and docker image sign
- Fix vulnerabilities

## [3.8.1] 2024-11-25

### Fixed

- Changed `oauthFlows.password.tokenUrl` format from `uri` to `uri-reference` in OpenApi 3.1 schema

## [3.8.0] 2024-08-26

### Added

- Added GET `/ui-config` endpoint to retrieve the config for the API Portal UI.

### Updated

- Updated Api Portal image version to `2.1.0`

## [3.7.0] 2024-07-11

### Added

- Added `subswaggersInDescription` query parameter to `/swagger/*`, `/openapi/v3/*` and `/openapi/v3-1/*` endpoints
- APi Portal v2.0.1 is now served from Docker image

### Versioning

- `ajv` to `^8.16.0`
- Dev dependencies updated

## [3.6.0] 2024-04-11

### Updated

- Added support to `openapi v3.1` with the new endpoints `/openapi/v3-1/*`

- Yarn v4.1.1
- Node to v20.12

## [3.5.2] 2024-03-14

### Fixed

- Improved performance by enhancing parsing and parallelization
- Fastify: removed deprecated use of `reply.context`, replaced with `request.routeOptions.config`

### Updated

- Node to v20.11
- Tap to v18.7.1
- Yaml to v2.4.1
- @fastify/static to v7.0.1

## [3.5.1] 2023-09-11

### Fixed

- security vulnerabilities: VULNDB-329638

## [3.5.0] 2023-07-04

### Added

- `PREVENT_REQUEST_BODY_CONFLICTS` environment variable, to prevent the request body aggregation during the conversion from Swagger 2 to OpenAPI Specification v3. It is equivalent to the `resolveInternal` [parameter of the `swagger2openapi` library](https://github.com/Mermade/oas-kit/blob/main/packages/swagger2openapi/README.md#a-command-line) used for the conversion.

### Updated

- upgrade lc39 to v7

## [3.4.14] 2023-03-13

### Updated

- update node image to `18.14`

### Fixed

- .npmrc file added to .dockerignore
- fixed a bug that caused a type error when the service failed to retrieve a schema with `excludePaths` or `includePath` set in the configuration

## [3.4.13] 2022-12-06

### Fixed

- fixed multiple useless calls to same service to retrieve its OAS documentation and code refactor.

## [3.4.12] 2022-11-04

### Fixed

- fixed incorrect route inclusion and exclusion when parameter with `:<param>` (instead of `{<param>}`) is present in `path` property of `includePaths` and `excludePaths`.

## [3.4.11] 2022-10-28

### Fixed

- fixed incorrect path transformation when parameter is present in path rewrite and in path prefix

## [3.4.10] 2022-10-25

### Fixed

- fixed incorrect ending `/` addition when path rewrite equals service route.

## 3.4.9 - 20-10-2022

### Fixed

- added env var `CONCURRENT_REQUEST_LIMIT` to make configurable the limit of concurrent requests (default is 10)

## 3.4.8 - 11-08-2022

### Fixed

- Anchor parse in swagger2openapi

### Updated

- Schema validator to v12

## 3.4.7 - 06-07-2022

### Fixed

- Inserted tini

## 3.4.6 - 04-07-2022

### Updated

- Node to version 16.15.1

### Fixed

- Fixed logging in error case

## 3.4.5 - 06-06-2022

### Updated

- node 16

## 3.4.4 - 20-01-2022

### Fixed

- Aggregator is now more resilient to promise rejection

## 3.4.3 - 15-12-2021

### Changed

- updated log to prevent mixing JSON root properties with the one of the logged error

## 3.4.2 - 19-11-2021

### Fixed

- Fixed schema.component array values duplication using combineMerge algorithm.

## 3.4.1 - 12-07-2021

### Updated

- upgrade lc39 to v4

### Fixed

- add support to json swaggers by replacing `yamljs` library with `js-yaml` library.

## 3.4.0 - 12-07-2021

### Added

- Added docs folder
- Add headers to proxy

## 3.3.0 - 24-05-2021

### Added

- Support to OpenAPI version 3.0.3

## 3.2.1 - 04-03-2021

### Updated

- lc39 v3.3.0

## 3.2.0 - 22-12-2020

### Updated

- added `verb` property to `includePaths` and `excludePaths` elements. This property can be used to include or exclude a specific route with its verb.

## 3.1.0 - 04-12-2020

- Allow a `prefix` field at the first level of the configuration. All the routes of all the services will be prefixed with this string.

## 3.0.1 - 08-10-2020

### Updated

- lc39 v3.1.4

## 3.0.0 - 02-10-2020

### Updated

**BREAKING CHANGE**

- update lc39 v3.1.3 with the newer logging format.

## 2.5.0 - 11-09-2020

### Added

- added support for `transformationPaths` map used to implement path rewrite and tags override

## 2.4.1 - 31-08-2020

### Fixed

- Fixed include/exclude path filter matching strategy

## 2.4.0 - 26-08-2020

### Added

- Added a filter to the paths, with IncludePaths and ExcludePaths

## 2.3.0 - 09-07-2020

### Added

- Generate security section only for right routes

## 2.2.0 - 08-07-2020

### Added

- GET subswaggers query parameter includeAll to filter subswagger "All"

## 2.1.2 - 26-05-2020

### Added

- route /yaml download swagger and subswagger for Swagger 2 and OpenAPI 3

## 2.0.2 - 26-02-2020

### Perf

- improve performance avoid stringify during oas3 conversion

## 2.0.1 - 2020-02-03

### Changed

- Update package-lock for zero-downtime

## 2.0.0 - 2020-01-10

### Added

- api `/openapi/v3/json` to retrieve the documentation in openApi3
- apis of type `/openapi/v3/<subswagger-path>.json` to retrieve subswaggers documentation in openApi3
- api `/openapi/v3/subswaggers/` to retrieve the list of available subswaggers in openApi3

### Fixed

- Update deps

## 1.3.1 - 2019-12-09

### Fixed

- Handle prettified JSON.

## 1.3.0 - 2019-07-24

### Added

- api `/swagger/subswaggers/` to retrieve the list of available subswaggers;

## 1.2.0 - 2019-06-28

### Added

- the `/-/check-up` route. It checks the healthiness of the service.

## 1.1.1

### Fixed

- remove prefix validation pattern

## 1.1.0

### Added

- set-tag-name-to-subswagger: force tags for subswagger
