---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 1.9.2 2023-09-13

### Fixed

- Fixed templates retrieval.

## 1.9.1 2023-09-04

### Fixed

- Fixed autocomplete when a form is a wizard with many nested components.
- Removed the "X" closing icon in FormExpiredModal; fixed the FormDatePicker when the expirationDate is not set.

## 1.9.0 2023-08-31

### Added

- Revised the user interface to include the following components: a checkbox to enable notification emails, a select dropdown for selecting templates, and a text input field for adding carbon copy (CC) email addresses.
- Revised the user interface to include the following component: a text input field for adding blind carbon copy (BCC) email addresses.

## 1.8.0 2023-07-28

### Added

- Update UI to display 'formExpirationDate' property with date picker
- Update builder page to include 'formExpirationDate' property on form save
- Update builder page to include 'formExpirationDate' property on form update
- Update visualizer page to show a modal in case the form is expired
- The form expiration date format can be set in the backend configuration file

## 1.7.1 2023-03-09

### Fixed

- Fixed FormVisualizerContainer rendering loop
- Warning are shown in the form even when field is empty

## 1.7.0 2023-02-22

### Fixed

- Forms do not trigger autosave if they are not editable.

## 1.6.0 2023-02-06

### Added

- Form service frontend now retrieve drafts
- Form service frontend now autosaves assignments

## 1.5.1

### Added

- Stylesheets are loaded synchronously
- Added drafts to Form Service Frontend

## 1.5.0

### Added

- support for form data versioning

## 1.4.0

### Added

- form pre-compilation

## 1.3.0

### Added

- handle custom css styles and fonts loading through dynamic assets loading

## 1.2.1

### Fixed

- `basePath` base route name when form-service is not exposed under `/` path

### Added

- enabled custom options to the formVisualizer

## 1.2.0

### Changed

- handle form builder updated with a body with `$set` and `$unset` objects

### Added

- add isEditable management in form visualizer page and add formAssignmentId on new assignments post
- add error message for 403 errors in form visualizer page
- add route to handle assignments and update form visualizer accordingly
- add isEditable, isPrivate and enabledUserGroups management in form builder

### Fixed

- update CORS to fix form visualizer date/time component visualization

## 1.1.0

### Added

- added `/visualizer/print-form/:id` route that always display forms and remove submit button (component with key `submit` and type `button`) from formSchema first level components
- add redirect after form submission and update in form visualizer using `onSubmitRedirect` query parameter
- handle optional form options for already submitted form in the form visualizer

### Fixed

- Fix notification toast position in frontend micro-lc integration
- Copy fonts to fix form builder and visualizer font awesome icons not shown in **form-service-frontend** integrated in micro-lc. An endpoint `/form-service-frontend-fonts` with *Rewrite Base Path* `/form-service-frontend-fonts` to the **form-service-frontend** microservice is required.

## 1.0.0

### Added

- first release
