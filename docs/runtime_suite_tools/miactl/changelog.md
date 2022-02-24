---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 0.3.1 2022-01-21

### Fixed

- fix warning installing with brew (issue 55)

## 0.3.0

### Added

- login command with username and password
- new command to trigger a new deploy per environment
- get status of a pipeline release
- insecure flag to skip check on certificate authority
- flag to use custom certificate authority
- add support to go v1.16

### Update

- upgrade dependencies

### Changed

- drop support to go v1.13 and v.14

## 0.2.0

- get history of deployments for a specific project environment
- add get projects command

## 0.1.0

- create cli sdk
- create cli renderer
