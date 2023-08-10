---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] 2023-01-12

### Added

- Add GET /prototypes/ endpoint
- Add GET /therapies/ endpoint
- Add POST /therapies/ endpoint
- Add PATCH /therapies/:id endpoint
- Add DELETE /therapies/:id endpoint
- Add GET /observations/ endpoint
- Add POST /observations/ endpoint
- Add PATCH /observations/:id endpoint
- Add DELETE /observations/:id endpoint
- Add GET /monitoring/ endpoint
- Add POST /monitoring/ endpoint
- Add PATCH /monitoring/:id endpoint
- Add GET /therapies/count endpoint
- Add GET /prototypes/count endpoint
- Add GET /observations/count endpoint
- Add GET /monitoring/count endpoint
- Add computation of adherence and compliance metrics
- Add DELETE /monitorings/:id endpoint
- Add cron job for adherence and compliance computation
- Renaming observations to detections 

### Fixed

- PATCH /therapies/:id must prevent plan updates if observations were submitted
- PATCH /monitorings/:id must prevent plan updates if observations were submitted
- Patching therapy or monitorings returns unexpected error 'Invalid CRUD Resource'
- Fix issues detected during internal demo
