---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
-  update lc39 v3.1.3 with the newer logging format.

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
  -  improve performance avoid stringify during oas3 conversion

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
