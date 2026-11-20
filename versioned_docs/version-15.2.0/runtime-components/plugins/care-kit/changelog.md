---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.9.3]

- Fix word-break `ck-patient-dashboard`

## [v2.9.2]

- Fix concurency issue in `ck-threshold-modal`
- Add `ck-patient-dashboard` localization for Italian

## [v2.9.1]

- Upgrade Node.js to v20 and remove unused dependencies
- Fix regression in `ck-threshold-modal` component caused by `values` field in prototypes, which are now ignored

## [v2.9.0]

- Added `roles-and-permissions-modal` web component
- Fix medical records loading data
- Fix `add-plan-modal` handling of adherence and compliance on edit

## [v2.8.5]

- Fix calendar event box width
- Fix style dashboard
- Added timeline settings component
- Added timeline component
- Added Report Collapsable card in `ck-patient-dashboard`
- Added `ck-medical-records`

## [v2.8.4]

- Patient Last Detection card added
- Patient Data card added
- Patient Appointment card added
- Patient Clinical Diary card added
- Patient Device card added

## [v2.8.3]

- Patient Dashboard added
- Patient Monitoring card added

## [v2.8.2]

- Update `add-plan-modal` to edit devices
- Update `add-plan-modal` to include devices on create

## [v2.8.1]

- Updated `am-calendar` to use backoffice color theme
- Fix bug in `am-calendar` that made component disappear when all the resources are filtered out
- Added `eventResourceId` property to `am-calendar` that allows to indicate witch event property is used by the calendar to link it with the resource
- Update the event that `am-calendar` sends to open the modal to book a slot. Now `ck-book-slot-modal` listents to add-new event

## [v2.8.0]

- Added `ck-availability-modal`
- Added translation support to import-users and reset-password components
- Added jobUpsert parameter to import users job

## [v2.7.0]

- Added `ck-book-slot-modal`
- Added `reset-password-modal` and Added `reset-password-button` doc
- Added `reset-password-modal` and Added `reset-password-button` component
- Added `import-users-modal` doc
- Added `import-users-modal` component
- Fix bug on filtering the resources in `am-calendar`
- Added additional info to the dragable modal `am-calendar`
- `ck-chart` now supports label translation

## [v2.6.0]

- Added permissions handling to `am-calendar`
- Added new web-component `ck-notification-card`
- Data retrival from NM
- Send the personal setting to the CRUD 
- Fix bug when editing a therapy/monitorings with `ck-add-plan-modal`  
- Restyled slot detail modal
- Added participants status switch and logics

## [v2.5.3]

- Added property `interactiveTooltip` to `ck-chart`
- Removed from `ck-chart` accessibility module due to conflicts in the chart print 

## [v2.5.2]

- Added exporting module to `ck-chart` component
- Fixed `ck-chart` filter handlin
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

- Added properties `urlMask` and `idKey` to web-component `ck-chart` that allow to fetch data by id  
  
## [v2.3.0]

- Added new web-component `ck-chart`
- `ck-add-plan-modal`now listens to `select-data` events, allowing to edit a selected plan
  
## [v2.2.0]

- Added property `compatibleWithExcel` to `ck-export-form` that allow to specify if the downladed file should be compatible with Microsoft Excel
- Added new web-component `ck-add-plan-modal`
- Added new web-component `ck-threshold-modal`
- Added new web-component `ck-therapy-modal`
- Added new web-component `ck-therapy-select`

## [v2.1.0]

- Added property `modalFooterVisible` to `am-calendar` that allows to hide appointment modal footer
- Added to property `resourceConfig` of `am-calendar` field `singleResource` that allows to use the calendar in appointment mode with only one resource
- Added new web-component `ck-export-form`

## [v2.0.4]

- Fixed `am-calendar` bug that made `resourceId` not work with value different form "resourceId"
- Added property `reminderMilliseconds` to `am-calendar` that allows to set how much time before a booked appointment the reminders are sent
