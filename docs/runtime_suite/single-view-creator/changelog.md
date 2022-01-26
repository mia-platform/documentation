---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.3.0] 2022-01-25

### Added

- Added automation of aggregation and singleViewKey using json configuration

## [3.2.0] 2021-11-30

### Added

- insert in Single View and Before After kafka information about original kafka message that triggered the Fast Data update. Information are taken from the projection changes. 

## [3.1.0] 2021-10-26

### Added

- UPSERT_STRATEGY env to choose if SV have to be updated or replaced with the new one

## [3.0.2] 2021-09-28

### Updated

- @mia-platform-internal/single-view-creator-lib": ^9.3.0 to have crud fields in single view error documents

## [3.0.1] 2021-09-23

### Fixed

- dockerfile use node:14.16.1

## [3.0.0] 2021-09-22

### Breaking Changes

- @mia-platform-internal/single-view-creator-lib": ^9.2.1
- @mia-platform-internal/single-view-versioning-lib": ^1.10.9
- @mia-platform/custom-plugin-lib: ^2.3.0
- @mia-platform/lc39: "^3.3.0"
- luxon: ^1.28.0
- mongodb: ^3.7.1
- node: 14.17.6

## [2.0.0] 2021-07-13

### Updated

- @mia-platform-internal/single-view-creator-lib": ^8.3.0
- @mia-platform-internal/single-view-versioning-lib": ^1.10.7

### Breaking changes

- changed docker image into `fast-data/single-view-creator-plugin`

## [1.0.0] 2021-04-16

- init
