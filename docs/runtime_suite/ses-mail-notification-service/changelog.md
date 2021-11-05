---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

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
