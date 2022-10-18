---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## v1.0.6 - 09-06-2022

### Updated

- Base docker image
- All pom dependencies

## v1.0.5 - 20-12-2021

- Upgraded log4j to patch 2.17.0

## v1.0.4 - 15-12-2021

- fix libraries fontconfig libfreetype6  import for excel export

## v1.0.3 - 15-12-2021

### Fixed

- Updated log4j to 2.16 version to prevent vulnerability issues

## v1.0.2

### Fixed

- Updated log4j to 2.15 version to prevent vulnerability issues

#### Added

- Created GracefulShutdown class to allow zero-downtime 

## v1.0.1

Fix:
- Async calls towards external services had been managed synchronously and moved in the controller

Added:
- Integration Tests for HTTP Interface
- HTTP proxy headers manage both platform and client/custom headers passed as params in the request body
- Error handling has been improved in order to wrap JsonMappingException messages and validation errors
- Url parsing method exceptions are managed properly for most of corner cases
- Refactoring to handle export settings via payload parameter
- Better handling for param "columns" which must be:
    - not required
    - not empty whether present
- Conversion method for Boolean values in different formats passed as configuration in the payload. Format supported are :
    - String "true"/"false"
    - Boolean true/false
    - Int 1/0
    - String "customTrueValue"/"customFalseValue"
- Unit Tests for all the above points
- Added tests to verify that Content-Disposition is missing from the Response Headers
    
Misc:
- Overall coverage improvement
- Swagger UI 
- Added Stress Tests with artillery
