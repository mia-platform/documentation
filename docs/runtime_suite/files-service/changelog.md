---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Added `POST - /bulk` route to upload multiple files.

### Changed

- Updated _minor_ and _patch_ dependencies version,
- Improved service documentations.

## 2.3.2 - 03-12-2021

### Fixed

- upload multipart `content-disposition` is now accepted even when `filename` property is missing. This fixes a breaking change introduced with `v2.3.0`.

## 2.3.1 - 2021-10-21

### Updated

- force download as attachment for html files
- fixed max number of file to upload per request equal to 1

### Added

- added OpenAPI documentation tags

## 2.3.0 - 2021-09-30

### Added

- added `FILE_TYPE_INCLUDE_LIST` to let the user allow only certain file to be uploaded

## 2.2.1 - 2021-07-13

### Security patch

- updated dependencies to fix security vulnerabilities

## 2.2.0 - 2021-06-24

### Added

- cache control headers set based on configured cache from config file

## 2.1.0 - 2020-10-30

### Updated

- Extended S3 configuration in order to employ an S3-compliant object (e.g: Oracle Object Storage)
- Updated gitlab-ci.yml mongo dependency, from this version mongo 4.4 support is guaranteed.

## 2.0.1 - 2020-10-13

### Updated

- lc39: v3.1.4

## 2.0.0 - 2020-10-06

**BREAKING CHANGE**

- updated lc39 dependency to 3.1.3. The update is breaking since it's bringing up lc39 v3.x with the newer logging format.

## 1.3.0 - 11-06-2020

### Added

- Add delete endpoint to delete files also from buckets

### Fixed

- fix `/download/:filename` generated swagger

## 1.2.0 - 28-06-2019

### Added

- Add `/-/check-up` status endpoint to check the availability of the service's dependencies

### Updated

- @mia-platform/lc39 2.1.2 -> 2.2.0
- fastify-plugin 1.5.0 -> 1.6.0
- mongodb 3.2.5 -> 3.2.7
- tap 14.1.7 -> 14.2.4
- aws-sdk 2.461.0 -> 2.479.0
- form-data 2.3.3 -> 2.4.0

## v1.1.0 - 11-06-2019

### Added

- google-storage-api: Add GoogleStorage API as storage
- additional-properties: Add additional properties in order to attach some props on upload
- prefix-or-hostname: Add `PATH_PREFIX` for relative urls
- swagger-additional-properties: Add swagger definition for additional properties
