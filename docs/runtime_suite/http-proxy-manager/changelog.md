---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 1.2.0 - 18-10-2021

### Added

- introduced a mechanism that allows, for each proxy config, to select whether all the headers
  or only a subset of them should be forwarded to the corresponding external service

## 1.1.0 - 11-05-2021

### Added

- introduced the support for the legacy grant type [`password`](https://oauth.net/2/grant-types/password/)
- introduced support to custom auth fields, so that it is possible
  to provide additional body fields in the token

### Changed

- improved how url-encoded forms are created

### Fixed

- added return keyword to proxy handler function to prevent continuing the execution
  when an unexpected status code is encountered
- restored original request body after reading it to prevent error in the case of
  token expiration

## 1.0.1 - 09-04-2021

- Docker image name changed to core/proxy-manager

## 1.0.0 - 08-03-2021

### Added

- First implementation featuring the following capabilities:
  - `client_credentials` grant type with the `client_secret_basic` authentication method.
  - `http` and `https` protocol schemes for target URL
