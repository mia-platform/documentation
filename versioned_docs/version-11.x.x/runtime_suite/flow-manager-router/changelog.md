---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 1.0.0 - 13/09/2023

### Added
- Merge metadata
- Required environment variables: MODE, MAIN_FLOW_ID_KEY, MAIN_FLOW_DATA_KEY, SUB_FLOW_ID_KEY, SUB_FLOW_CREATED_EVENT, ARRAY_MERGE_MODE

## 0.4.6 - 13/07/2023

### Added

- birthCountry to main saga data

## 0.4.5 - 03/07/2023

### Added

- second surname to main saga data

## 0.4.4 - 13/06/2023

### Added

- send routerNotifyCompleted event to Sub Flow Router after notify

## 0.4.3 - 29/05/2023

### Changed

- remove duplicated items on `evidences` array based on pair `side` and `type`
- remove duplicated items on `scores` array based on pair `key`
- update always `subject.person.identityDocument` object

## 0.4.2 - 24/05/2023

### Changed

- `/notify` use the same `messageLabel` received


## 0.4.1 - 23/05/2023

### Changed

- update `scores` field in `mainFlowData` when send event to the main flow
- update `subject.contacts` field in `mainFlowData` when send event to the main flow

## 0.4.0 - 18/05/2023

### Added

- `GET - /sub-flow/saga` to retrieve subFlow saga from main saga ID

## 0.3.1 - 26/04/2023

### Changed

- Built image is no longer native

## 0.3.0 - 12/04/2023

### Added

- Kafka support

## 0.2.1 - 22/03/2023

### Added

- redirectUrl on mainSagaData

## 0.2.0 - 20/03/2023

### Added

- Identification error event handling
- Retry system on CRUD and external service
### Changed

- New configuration file schema
- New data mapping logic

### Fixed

- Retrofit clients
- Saga states
- Saga history data structure
- JSON deserialization on unknown properties

## 0.1.0 - 27/02/2023

First version
