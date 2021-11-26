---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.1] 2021-11-05

### Added

- 
  - return options object from formSchemaMapCrud if any in the response of `GET|PUT /visualizer/forms/{id}` endpoints
  - prevent a submitted form update if options object from formSchemaMapCrud contains readOnly property equal to `true`

### Fixed

- fixing issue on form validation (validation now skips `customConditional` elements)

## [1.1.0] 2021-06-28

### Added

- form data validation in the backend through the use of the Validator of the 'formio' project. Form validation is enabled for visualizer POST and PUT operations.

## [1.0.0] 2021-06-10

### Added
- Initial form service backend implementation. Added APIs to manage form schemas and form submissions.
