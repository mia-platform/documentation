---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.0.0 - 2020-10-05

**BREAKING CHANGE**

- updated custom-plugin-lib dependency to 2.0.3. The update is breaking since it's bringing up lc39 v3.x with the newer logging format.

## 1.1.1 - 2019-07-18

### Fixed
- pre hook `inject-id`: handle case original body has `payload` undefined

## 1.1.0 - 2019-07-18  

### Added
- pre hook `/inject-id` to inject an identifier of the notification in its payload

## 1.0.0 - 2019-06-28

### Added
- `/-/check-up` handler
