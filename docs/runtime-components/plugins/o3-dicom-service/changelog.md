---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.8] 2026-11-09

### Security

- [MCRDHCP-97](https://makeitapp.atlassian.net/browse/MCRDHCP-97): Update Node.js to v22 (Docker base image `node:22-alpine`, `.nvmrc`, `engines`, CI) to fix CVE-2026-111497 (Node.js Brotli RCE); Node 20 is EOL and receives no fix
- [MCRDHCP-97](https://makeitapp.atlassian.net/browse/MCRDHCP-97): Update `@mia-platform/custom-plugin-lib` to v8 (Fastify 5) and `@fastify/multipart` to v9, update vulnerable dependencies; the final Docker image now upgrades the Alpine packages and ships only production dependencies, without npm, corepack and yarn

## [0.1.7] 2025-03-25

- Modified the function that generates the StudyInstanceUID because it must be less than or equal to 64 characters in length.

## [0.1.6] 2025-02-05

- Upgrade base Docker image

## [0.1.5] 2024-08-30

- Update Node.js to v20 and CI/CD pipeline

### Fixed

- Add SQL injection mitigation on `GET /exams` endpoint

## [0.1.4] 2024-06-20

## Changed

- Node version updated to lts/hydrogen

## [0.1.3] 2023-09-01

- Added VIEWER_AUTHORIZATION_TOKEN env 

## [0.1.2] 2023-06-22

- Removed patientID as required in GET /token 

## [0.1.1] 2023-03-06

- Fixed GET /workitems

## [0.1.0] 2023-02-27
- Added DELETE /workitems/:studyInstanceUID
- Added POST /exams
- Added GET /workitems
- Added GET /uid
- Add callback POST /new-exam-callback
- Add get exam thumbnail
- Added GET /token
- Add get exams
- Add creation of workitems
- Microservice setup
