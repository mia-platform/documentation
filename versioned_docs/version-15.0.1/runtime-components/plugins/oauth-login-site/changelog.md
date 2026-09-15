---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 8.1.3 - 27-11-2024

### Security

- Added SBOM and docker image sign
- Fix vulnerabilities

## 8.1.2 - 10-09-2024

### Fixed

- query string provisioning when rendering login site with both `appId` and `providerId`

## 8.1.1 - 31-07-2024

### Fixed

- state persistence during authorize flow is now consistent with used tab

## 8.1.0 - 07-05-2024

### Added

- introduce support for alternative login mode, which opens a popup on the identity provider login page instead of
redirecting the current page to the login page. This mode is employed either explicitly by setting the query parameters `external=true`
when calling the login entrypoint or implicitly when embedding the frontend in an iFrame.

## 8.0.0 - 20-02-2024

### Added

- pass the version to the `/authorize` endpoints

### BREAKING

This version is compatible with:
- **Authentication Service** with version **>= 2.8.0** with the option `authorizeStateRequired: true` in the relevant app configurations
- **Auth0-Client** with version **>= 3.5.0** with the option `authorizeStateRequired: true` in the relevant client configuration

The absence of the `authorizeStateRequired` in the service used for authentication will cause the login site to break at login. 

## 7.2.3 - 28-11-2023

### Updated

- static-files to version 3.3.1

## 7.2.2 - 27-11-2023

### Updated

- static-files to version 3.3.0

## 7.2.1 - 06-07-2022

### Updated

- Static files to version 3.2.8
- Node version to 12.2.9-alpine

## 7.2.0 - 15-04-2022

### Added

- show Social Login button with label instead of id if available

## 7.1.3 - 23-09-2021

### Upgrade

- update static-files to v3.2.4

## 7.1.2 - 31-05-2021

### Fixed

- Alert error displayed only for status code >= 500
- Prevent infinite loop when token isn't valid

## 7.1.1 - 10-07-2020

### Fixed

- endpoints social login missing `/apps`

## 7.1.0 - 08-07-2020

### Added

- social login page
