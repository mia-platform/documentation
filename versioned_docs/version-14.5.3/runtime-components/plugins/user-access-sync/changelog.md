---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.1 - 02-05-2024
### Added
- use `computeHierarchy` query parameter to retrieve user permissions
- 
## 0.1.0 - 16-04-2024
### Added
- isProduction flag on rule scope
- handle `okta.delete.user` event on GitHub provider
- handle `console.update.user.permission` event on Gitlab provider and GitHub provider

## 0.0.4 - 21-03-2024

### Fixed
- Environments array optionals in user permissions response from console

## 0.0.3 - 27-02-2024

### Fixed
- Changed user permissions data schema

## 0.0.2 - 31-01-2024

### Added
- evaluateForEachEnvironment on rule configuration

## 0.0.1 - 31-01-2024

First version
