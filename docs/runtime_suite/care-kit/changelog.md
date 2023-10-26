---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.5.3]

- Added property `interactiveTooltip` to `ck-chart`
- Removed from `ck-chart` accessibility module due to conflicts in the chart print 

## [v2.5.2]
- Added exporting module to `ck-chart` component
- Fixed `ck-chart` filter handling
- Fixed `am-calendar` event visualization changes to 'month'
## [v2.5.1]
- Updated `ck-therapy-select` label information
## [v2.5.0]
- `am-calendar` listens to `change-query` events in `appointment mode` and applays filters to events and resources on the properties specified in the configuration.

## [v2.4.2]
- Added possibility to filter events by current user in `am-calendar`
- Added possibility to indicate the Highcharts constructore type in the `ck-chart` proper
## [v2.4.1]
- Fix problem that prevented `ck-chart` to resize correctly

## [v2.4.0]
- Added new web-component `ck-layout-select`
- Added `chart-filters` event. The event is emitted by `ck-therapy-select` and listen by the `ck-chart` web-component

## [v2.3.1]
### Added
- Added properties `urlMask` and `idKey` to web-component `ck-chart` that allow to fetch data by id  
## [v2.3.0]
### Added
- Added new web-component `ck-chart`
- `ck-add-plan-modal`now listens to `select-data` events, allowing to edit a selected plan
## [v2.2.0]
### Added
- Added property `compatibleWithExcel` to `ck-export-form` that allow to specify if the downladed file should be compatible with Microsoft Excel
- Added new web-component `ck-add-plan-modal`
- Added new web-component `ck-threshold-modal`
- Added new web-component `ck-therapy-modal`
- Added new web-component `ck-therapy-select`

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
