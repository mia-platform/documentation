---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.2] - 2024-09-20

### Added

#### Targets

- `mongodb` target. Models will be stored on a dedicated collection with the following target configuration:
  ```json
  {
    // ...
    "target": {
      "type": "mongodb",
      "url": "mongodb://test:27017/?replicaSet=rs", // 👈 mongodb connection string: the database must be a replica set
      "database": "test_database", // 👈 if defined, it will be used as default database to store the models
    }
  }
  ```
  
  The record will be stored in a collection named `open-lineage-datasets`.
  
  > **NOTE:**
  >
  > To use MongoDB as a target, the database must be configured as a replica set.

### Updated

- _Data Catalog Agent_ bumped to version `0.6.4`

## [1.3.1] - 2024-07-31

### Updated

- _Data Catalog Agent_ bumped to version `0.6.3`

### Fixed

- bug introduced by previous release which prevented MySQL queries
  to return records.

## [1.3.0] - 2024-07-12

### Updated

- _Data Catalog Agent_ bumped to version `0.6.2`
- rolling out of support for Oracle `11c`
- Crud Service http connection now has an additional parameter, `healthcheck`, which contains the path used to retrieve the version of the service.

### Added

- `settings` field to connection configuration object;
- `options` optional field for _oracle_ odbc configurations: this field defines the tables that will be used for retrieve the metadata.
  If not specified, `user` option will be used as default;

### Changed

- `version` field in the `oracle` odbc configuration has been moved outside of the `params` object, so it can be used along with odbc connection string.
  ```json title={example.json}
  { 
    "type": "odbc",
    "configuration": {
      "vendor": "oracle",
      "version": "11",
      "params": {/** ... */}
    }
  }
  ```


## [1.2.0] - 2024-05-07

### Added

- Support for `salesforce_objects`
- _Data Catalog Agent_ bumped to version `0.5.1`

## [1.1.0] 2024-02-08

- Add Mia CRUD Service support to the data-catalog agent

## [1.0.0] 2024-01-31

- First release
