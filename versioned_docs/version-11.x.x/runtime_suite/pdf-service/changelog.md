---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 2.0.0 - 25/07/2023

### Breaking Changes

Printing a PDF using a template can no longer be achieved through the `POST /generatePDF` and `POST /` endpoints. Instead, this capability has been incorporated into the `POST /template` endpoint.

### Added

- Implemented load tests for all endpoints.
- Setup load tests.
- Added POST /merge endpoint for merging multiple pdf files.

### Changed

- Applied the MR suggestions.
- In POST /merge is now possible to specify the name of the new merged file via the `filename` field in the multipart body.
- Refactoring using plugins strategy, fixed docs with correct link to Puppeteer options and clearer explanation of default options.
- Moved Puppeteer config to a file, changed envVarsSchema to accept languages, fixed Puppeteer headless deprecation warning.
- Updated POST /template endpoint for generating a pdf file.
- Updated POST /url endpoint for generating a pdf file.
- Refactored the documentation.
- Reset PDF Service.

## 1.3.0 - 31/01/2023

### Fixed

- Fixed POST /url to support backoffice language translation.
- POST /template returns 404 if the template does not exists.

## 1.3.0 - 31/01/2023

### Added

- Added documentation for `just-handlerbars-helpers` library.

### Fixed

- .npmrc file added to .dockerignore.
- installed `fonts-freefont-ttf` instead of `ttf-freefont` in docker container image.

## 1.2.0 - 14/06/2022

### Added

- Added `just-handlerbars-helpers` library.

## 1.1.0 - 10/06/2022

### Added

- Added `lc39`.

## 1.0.0

 - first release.
