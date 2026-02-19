---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2024-12-12

## Changed
- Set default value for required `aps` field for custom apns configurations
- Fix logs to include missing exceptions messages

## [1.2.1] - 2024-06-28

### Changed
- Updated dependencies to fix vulnerabilities
- FirebaseNotificationService use `sendEachForMulticast` instead of `sendMulticast`, **which will be discontinued on July 20th 2024**

## [1.2.0] - 2023-10-03

### Added

- Added support for custom metadata for android and ios notifications

## [1.1.0] - 2022-06-22

### Added

- Kafka authentication support. See documentation to configure the service according to the security protocol and auth mechanism.
- Info log on notification sent correctly.

### Changed

- Kafka2Rest version upgraded to 2.2.2

## [1.0.2] - 2020-09-04

## [1.0.1] - 2020-05-29

## [1.0.0] - 2020-05-28
