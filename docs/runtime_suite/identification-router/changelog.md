---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
