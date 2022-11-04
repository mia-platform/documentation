---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 6.0.6 - 2021-07-05

### Updated

- updated fastify ecosystem to v3 and applied security patches
- update docs

## 6.0.5 - 2021-03-04

### Update

- update lc39 v3.3.0

## 6.0.4 - 2021-01-20

### Update

- updated node version to *lts/fermium*, docker image uses `node:14.15.4-alpine`

## 6.0.3 - 2021-01-13

### Added

- more information on specific error log on proxy call invocation failure

## 6.0.2 - 2020-11-03

### Fixed

- moved logs containing body to trace and added redaction

## 6.0.1 - 2020-10-08

- update lc39 v3.1.4

## 6.0.0 - 2020-10-06

**BREAKING CHANGE**
- updated lc39 v3.1.3 which is breaking due to new logging format
- add `DISABLE_STRICT_CONTENT_TYPE_CHECK` env variables to disable the strict type check. Default value is `true`

## 5.2.0 - 2020-07-01

### Fixed
- Avoid crashing when reply.send throws

## 5.1.4 - 2020-04-09

### Fixed
 - Allow 204 on `allowUnknownResponseContentType` is `false`

## 5.1.3 - 2020-04-03

### Fixed
 - allowing `application/json` with a specified charset even when `allowUnknownResponseContentType` is false

## 5.1.2 - 2020-04-03

### Fixed
 - Now when `allowUnknownResponseContentType` is false and the third-party service returns a Content-Type that differs from `application/json` the Microservice Gateway returns an error message instead of failing due to `FST_ERR_REP_ALREADY_SENT`

## 5.1.1 - 2020-01-31

### Updated
 - set `got` `retry` option to 0.
 - Update package-lock for zero-downtime

## 5.1.0 - 2019-06-28

- Add status routes tests
- Update @mia-platform/lc39 2.1.2 -> 2.2.0
- Update tap 14.1.7 -> 14.2.4
