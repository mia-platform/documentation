---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## v2.0.2 - 2022-13-22
### Changed
- Updated custom-plugin-lib to 5.1.5
- Add tini support
## v2.0.1

### Changed
- Updated custom-plugin-lib version to 5.1.5
## v2.0.1 - 2022-12-22

### Changed
- Updated node version to 18

## 2.0.0 - 2020-10-07

**BREAKING CHANGE**

- updated custom-plugin-lib dependency to 2.0.3. The update is breaking since it's bringing up lc39 v3.x with the newer logging format.

## v1.1.1 

### Changed
- Update package-lock for zero-downtime

## v1.1.0
### Added
- Added `options` field to configuration in order to furtherly manage how the `/-/check-up` route is called.
  - The following parameter can be passed to `options`: `prefix`, `protocol`, `port`.
Example:
``` [{ "hostname": "auth-service", "options": { "prefix": "/api/v2", "port": 8888, "protocol": "https" } ] ```

This way, doctor-service will call the `/-/check-up` route at `https://auth-service:8888/api/v2/-/check-up`.

## v1.0.0
### Added
- Tags field added to configuration then doctor-service will expose one route for each tag checking-up corresponding services

## v0.3.0
### Changed
The doctor calls the `/-/check-up` routes rather than the `/-/healthz`.
