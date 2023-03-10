---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Fixed

- added runtime parameter in Dockerfile to solve the issue explained [here](https://stackoverflow.com/questions/6110395/sqlrecoverableexception-i-o-exception-connection-reset/49775784#49775784)

## 3.0.0 - 2020-10-23

### Updated

- OJDBC driver updated to 8.

**BREAKING CHANGE**

- Dockerfile `WORKDIR` is `/home/java/app`

## 2.0.0 - 2019-09-02

**BREAKING CHANGE**

- removed not maintained `filter` and `export` features and references.

## 1.1.0 - 2019-07-05
### Added
- /-/healthz route
- /-/check-up route
- /-/ready route
### Fixed
- FIX: query execution time was wrong and negative
## 1.0.0 - 2019-06-27
### Added
- Groovy integration for query input parameters customization
- Groovy integration for db extracted rows
- directSql feature consolidation
- custom date format
### Fixed
- FIX on ORA-01000 maximum open cursors exceeded
