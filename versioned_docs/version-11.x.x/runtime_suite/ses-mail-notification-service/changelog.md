---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.2.0 - 05-05-2023

### Added

- optional env variables to support pooled smtp:
  - `POOL_ENABLED`: set to true to use pooled connections instead of creating a new connection for every email
  - `POOL_MAX_CONNECTIONS`: is the count of maximum simultaneous connections to make against the SMTP server
  - `POOL_MAX_MESSAGES`: limits the message count to be sent using a single connection

## 3.1.2 - 02-05-2023

### Fixed

- redact emails from error logs

## 3.1.1 - 10-02-2023

### Updated

- dependencies to cover potential security vulnerabilities

## 3.1.0 - 04-07-2022

### Fixed

- removed error message from response to prevent information leaks

### Updates

- resolved security updates and runtime env update

## 3.0.0 - 2021-09-01

### BREAKING CHANGE

- Requests containing both `sender` and `from` fields in body are rejected

### Added

- Added body and consumes in routes' schema
- Summary on routes' schema

### Changed

- Updated docs
- Updated dependencies

## 2.0.4 - 2021-05-11

Added a debug log providing information about the messageId for each email sent.

## 2.0.3 - 2021-03-04

### Updated

- lc39 v3.3.0

## 2.0.2 - 2020-11-20

Added Content-ID (`cid`) property to every attached file.

## 2.0.1 - 2020-10-13

### Updated

- lc39 v3.1.4

## 2.0.0 - 2020-10-06

**BREAKING CHANGE**

- updated lc39 dependency to 3.1.3. The update is breaking since it's bringing up lc39 v3.x with the newer logging format.

## 1.0.3 - 16-06-2020

### Fixed

- write attachments in `/tmp` folder
