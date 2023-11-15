---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.1] - 2023-08-11

### Changed

- reviewed how S3 credentials are loaded, in particular the endpoint, so that now it correctly connects to AWS S3
- updated service dependencies

## [1.4.0] - 2023-07-03

### Added

- MongoDB's collection to keep record of each re-ingestion made to the service. Now the application **requires** the following environment variables to start up:
  - `MONGODB_URL`: connection to the database
  - `MONGODB_NAME`: name of the database
- `GET` routes:
  - `/status/folders`: get name of available folders. Returns array of strings
  - `/status/{folderName}/count`: returns number of files for the specified folder  

### Fixed

- `listFiles` method of abstract class `BasicBucket` returns `streams` instead of `sequences`: this choice has been done to improve performances and avoid Java Heap Space error raised by AWS SDK

### Removed

- unused organizer-by-key methods and routes, since the component Data Organized has been removed from Bucket Storage Support

## [1.3.1] - 2023-05-29

### Fixed

- removed a typo from Dockerfile that prevented to properly start up the created image

## [1.3.0] - 2023-05-24

### Fixed

- reingestion service for topics now properly handles all the files contained in the bucket when very large volumes are found
- prevent reingestion on topic when start or stop date is invalid

### Changed

- reviewed logging by increasing verbosity at debug level to ease debug at runtime
- upgraded service dependencies
- upgraded kotlin to v1.8.21

## [1.2.0] - 2023-05-10

### Added
- Added a new custom selector system to filter specific messages retrieved from a bucket, based on Kotlin scripting using JSR223, allowing precise and targeted filtering of messages to be reingested.
- Added support for retrieving custom selectors from a ConfigMap at startup.  
  The **new** `CONFIGURATIONS_PATH` environment variable is used to specify the directory containing the necessary .kts files, which must be organized in a subdirectory called /selectors.  
  A pool of custom selectors is generated based on a hashmap with the custom selector name as the key and the custom selector script as the value.
- Exposed the new custom selector system in the `POST /reingestion/file` and `POST /reingestion/topic` endpoints. The `customSelectorName` field in the JSON body is used to specify the name of the custom selection script to be used in the filtering process (`CustomSelectorName` is the name of the file without the `.kts` extension).

### Changed

- Fixed GCP bucket tests

## [1.1.0] - 2023-01-13

### Changed

- removed Bucket Type enum to align environment variable values to the other services that employ lowercase names (BUCKET_TYPE can now be set as `google` or `s3`)
- upgraded service dependencies
- fixed linting
- renamed service configuration root property in `application.yaml`

## [1.0.1] - 2022-11-24

### Added

- Added metrics for bucket calls tracking

## [1.0.0] - 2022-11-24

### Initial Release

This is the initial version of the service, that exposes various routes, that re-ingest messages from a bucket storage,
to a specified topic.
