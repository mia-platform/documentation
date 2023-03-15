---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [v2.1.0]
### Added

- Added property `modalFooterVisible` to `am-calendar` that allows to hide appointment modal footer
- Added to property `resourceConfig` of `am-calendar` field `singleResource` that allows to use the calendar in appointment mode with only one resource
- Added new web-component `ck-export-form`

## [v2.0.4]
### Fixed

- Fixed `am-calendar` bug that made `resourceId` not work with value different form "resourceId"
### Added

- Added property `reminderMilliseconds` to `am-calendar` that allows to set how much time before a booked appointment the reminders are sent
