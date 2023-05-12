---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 5.0.1 2022-01-31

### Fixed

- set `X-Forwarded-Proto` to use `original_request_scheme` variable to use the correct scheme
- set `Scheme` to use `original_request_scheme` variable to use the correct scheme

## 5.0.0 2021-12-01

### Changed

- `X-Forwarded-For` header now supports a list of IP address

## 4.2.0 2021-09-21

## Added

- Add `X-Real-IP` header

## Updates

- Update nginx to 1.23.3 with various security fixes

## 4.1.4 2020-05-05

## Updates
- Update nginx to 1.18.0

## 4.1.3 2020-02-27

### Fixed:

- Open the `off` file permission to anything and everyone

## 4.1.2 2020-02-26

### Fixed:

- Wrong permission on `off` file

## 4.1.1 2020-02-12

### Fixed:
  - use original_request_uri in errors map to prevent xss

## 4.1.0 2019-06-27

### Added
  - add `client-key` header support
  - add `mia_client_key` cookie support

### Updates
  - update nginx to 1.17.0

### Deprecations
  - deprecate http header `secret` support, replaced by `client-key` header or `mia_client_key` cookie
