---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

## 5.2.1 - 2022-03-30

### Fixed

- null values in `_q` query filter are correctly handled for GET endpoints

## 5.2.0 - 2022-03-29

### Added

- support for `$first` project operator in `_rawp` query param

## 5.1.0 - 2022-03-21

### Added

- supports MongoDB views

## 5.0.2 - 2022-02-25

### Updated

- mongocryptd v2

## 5.0.1 - 2021-11-08

### Fixed

- added pino to dependencies
- remove async from get list handler

### Updated

- node.js to v16
- dependency pino to ^7.1.0

### Chores

- added tests and improved documentation

## 5.0.0 - 2021-10-15

### BREAKING CHANGES

This version brings Mongo breaking changes from Mongo v4.4 to v5. Specially, if you are using some query (e.g. with `_q` parameter) no more supported by new Mongo version or new driver version, it will return an error.

Known limitation in this version:

- before, it would be possible to make a count using `$nearSphere` operator. This operator is not permitted by mongo v4.4 and mongo v5, so in this version the count with this filter will throw.

### Added

- support to mongo v5.0

### Updated

- update mongo driver to use v4
- handle mongo stream error in findAll

## 4.4.0 - 2021-09-30

### Added
- Client side field level encryption

### Fixed

- Corrected JSON schema for text indexes.
- Corrected some logs that were not showing objects
- PATCH: $.merge operator on multiple nested array

## 4.3.0 - 2021-09-10

### Updated

- Upgraded `lc39` to version 5 (handled with retrocompatibility by setting swagger in order to avoid breaking changes)

### Added

- new parameter `_rawp` to perform raw projections with aggregation operators on MongoDB v4.4 or above
- error handling for `_rawp` trying to override `acl_read_columns` header
- check on not allowed operators used during `_rawp`

### Changed

- Changed base image from `node:12.22.3-alpine` to `node:14.17.6-slim`
- Installed version 4.4.8 of `mongocryptd` inside the Docker image
- Installed version 1.2.2 of `libmongocrypt` inside the Docker image
- Upgrade node version in `nvm`
- Required node engine is now v14.17.6
- Inserted `KMS` configuration variables

## 4.2.0 - 2021-08-05

### Added

- support to text search indexes (with weights and language options) and $text queries on findAll

## 4.1.0 - 2021-07-06

### Changed

- projection regex pattern is removed in order to allow the projection over nested fields.

## 4.0.0 - 2021-06-17

## 3.3.0 - 2021-06-17  [Unpublished]

### Added
- support __STATE__ change of multiple documents using a filter and without knowing the `_id` of each one. See related [issue](https://git.tools.mia-platform.eu/platform/core/crud-service/-/issues/26).

### Breaking Change

- installed `@mia-platform/mongodb-healthchecker` for mongo healthchecks

## 3.2.3 - 2021-04-29

### Fixed
- fix `checkNormalIndexEquality` comparison

## 3.2.2 - 2021-03-04

### Updated

- lc39 v3.3.0

## 3.2.1 - 2021-01-29

### Fixed
- patch with unset of ObjectId field no longer fails

## 3.2.0 - 2020-12-02

### Added
- support json schema for RawObject and array of RawObject field properties

## 3.1.2 - 2020-11-04

### Added
- castToObjectId allow also null value as input and return null itself.

## 3.1.1

### Updated

- lc39 v3.1.4
- Updated gitlab-ci.yml mongo dependency, from this version mongo 4.4 support is guaranteed.

## 3.1.0 - 2020-10-06

### Added

 - Allow $inc, $set, $unset on sub properties of raw object

## 3.0.1 - 2020-10-02

### Update
- - update lc39 to v3.1.3. 

## 3.0.0 - 2020-09-29

### Update

**BREAKING CHANGE**

- - lc39 to v3.1.2. The update is breaking since it's bringing up lc39 v3.x with the newer logging format.

## 2.2.0 - 2020-07-14

### Added
- - Expose some metrics about collections

### Update
- lc39 to v3.1.0

## 2.1.6 - 2020-05-26

### Fixed
- - Omit required if empty

## 2.1.5 - 2020-05-26

**BROKEN: do not use this version**

## 2.1.4 - 2020-04-15

### Changed
- - Remove default limit from /export

## 2.1.3 - 2020-01-31
### Changed

- Update package-lock for zero-downtime
- passing `{useUnifiedTopology: false}` to fastify-mongo to avoid that isConnected() always return true

## 2.1.1 - 2019-12-16

### Fix

- fix CRUD startup with 0 collections

## 2.1.0 - 2019-12-09

### Added

- handle ttl index
- support _id of type string

## 2.0.1 - 2019-10-16

### Fix
- Fixed missing data in __STATE__ field of post and post-bulk json schema

## v2.0.0 - 2019-07-03

### BREAKING CHANGE
- Implement nullable flag.
  Before this, the nullable flag is ignored. The default behavior is to convert `null` into falsy value for the field type type.
  For example, for an integer `null` value is converted to `0`, for a string to `''` (empty string).

### Added
- Both the handlers of `/-/check-up` and `/-/healthz` route check the connection to Mongo.


## v1.2.0 (Jun 25, 2019)
### Added:
  - Support for the CRUD_LIMIT_CONSTRAINT_ENABLED env variables to enable constraints on minimum,
    maximum and default values. New limits are: maximum 200, minimum 1 and default 25

## v1.1.0

Changes that have landed in master but are not yet released.

### Added:
  - Support for patching array items. The `$set` command works properly on both primitive and `RawObject` item types, by using `array.$.replace` and `array.$.merge` as keys in the `$set` command object.
  This feature involves the following CRUD operations:
    - Patch by ID
    - Patch many
    - Patch bulk
  - `array.$.replace` Replace entirely the query-matching array item with the content passed as value.
  - `array.$.merge`   Edits only the specified fields of the query-matching array item with the content passed as value.

See below for some sample cURLs for **/PATCH** */books-endpoint/{:id}*   where ```_q={"attachments.name": "John Doe", _st: "PUBLIC"}```

**Case Merge**
```
curl -X PATCH "http://crud-service:3000/books-endpoint/5cf83b600000000000000000?_q=%7B%22attachments.name%22%3A%20%22John%20Doe%22%7D&_st=PUBLIC" -H "accept: application/json" -H "Content-Type: application/json" -d "{ "$set": { "attachments.$.merge": { "name": "renamed attachment" } }}"

```
**Case Replace**
```
curl -X PATCH "http://crud-service:3000/books-endpoint/5cf83b600000000000000000?_q=%7B%22attachments.name%22%3A%20%22John%20Doe%22%7D&_st=PUBLIC" -H "accept: application/json" -H "Content-Type: application/json" -d "{ "$set": { "attachments.$.replace": { "name": "renamed attachment", content: "Lorem ipsum dolor sit amet", "state": "attached" } }}"
```
