---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- provide templating options to the Form Visualizer
- documentation for the Form Visualizer options

### Fixed

- fixed support for external submit URLs and submit URLs with explicit port
- backward compatibility issue that required the `formSchemaCrud` object in the configuration even if it's optional
- update documentation links to download example .json files to fix link not opening in a new browser tab

## [1.2.1] 2021-12-15

### Changed

- update ACL controls relying only on manual and automatic assignments

## [1.2.0] 2021-12-09

### Fixed

- remove payload log in `POST` an `PUT` endpoints

### Changed

- `PUT /visualizer/schemas/:id` updated to handle `$set` and `$unset` body

### Added 

- inject configurable or default client type if missing in the request's headers in all handlers
- new endpoint`GET /visualizer/assignments/:id/schema-id` 
- `GET /visualizer/schemas/:id` updated to handle isPrivate and isEditable
- `PUT /visualizer/schemas/:id` updated to handle isPrivate and isEditable
- `POST /visualizer/forms` updated to handle isPrivate and previous submission checks
- `GET /visualizer/schemas/:id` updated to handle isPrivate and groups
- introducing isPrivate, isEditable and user groups properties

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
