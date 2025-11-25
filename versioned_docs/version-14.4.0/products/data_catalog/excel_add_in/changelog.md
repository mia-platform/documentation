---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.2] - 2025-11-14

### Fixed

- correctly handle deserialization of empty value for fields of option type 
- delete empty custom property of type array on push

## [0.3.1] - 2025-10-24

### Fixed

- correctly handle type in tag and description deserialization

## [0.3.0] - 2025-10-22

### Fixed

- Tables infinite scrolling
- Prevent push of unselected fields or hidden columns 

### Added

- Italian copies
- Backup sheet created also on push error

## [0.2.0] - 2025-10-08

### Added

- Update manifest uuids for newer versions
- Better push log reports
- JSON manifest for Microsoft365
- UI for push errors
- Hints and data validation on tags, descriptions, and custom metadata

### Fixed

- Serialization of sor row asset data on backup page

## [0.1.1] - 2025-10-07

### Fixed

- JS bundle for web-login application naming issue

## [0.1.0] - 2025-10-07

- initial version of the plugin
- supports Excel Desktop and Excel Online (without authentication)
- supports read/sync data from Data Fabric Data Catalog
- uses a shared runtime for the JS frontend and commands execution

