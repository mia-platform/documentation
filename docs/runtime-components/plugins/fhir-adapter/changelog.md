---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] 2026-11-09

### Security
- Updated Node.js to 22 everywhere (Docker runtime image `nodejs22-debian13`, CI, `.nvmrc`, engines `>=22`) to fix CVE-2026-111497 (Brotli RCE), which is not fixed on Node.js 20
- Updated `@mia-platform/custom-plugin-lib` to v8.1.1 (Fastify 5) and `@fastify/multipart` to v9
- Updated `@fastify/busboy` and `fast-uri` to patched versions
- Errors without a status code (e.g. network errors) are masked with a `Something went wrong` 500 response, as with the previous library version
- Known issue: `decode-uri-component@0.2.2` (CVE-2026-118664), used by `query-string` inside `fhir-kit-client@1.x`, is still present: the fix requires `fhir-kit-client@2`, an ESM-only rewrite

## v1.3.0 - 2025-08-14

## Changed
- Updated to Node.js 22
- Updated custom-plugin-lib to v7.0.1
- Updated routes schema definition according to [FSTDEP021](https://fastify.dev/docs/v5.0.x/Guides/Migration-Guide-V5/#full-json-schema-is-now-required-for-querystring-params-and-body-and-response-schemas) deprecation warning for Fastify@v5 Support
- Updated @fastify/multipart to v8.3.1

## [1.2.0] 2025-05-15

## Added

- Added support for managing **Bundle transactions**: is it possible to configure them in the configmap and to invoke them via the API `POST /transaction/:transactionId`

## [1.1.0] 2025-03-27

## Added

- Added `POST /:resource/` endpoint to handle also trailing slash

## [1.0.5] 2025-02-05

## Changed

- Upgrade base Docker image and project dependencies

## [1.0.4] 2024-11-12

## Changed

- Update Node.js to v20 (LTS) and dependencies

## [1.0.3] 2024-06-25

## Changed

- Node version updated to lts/hydrogen
- Fix endpoint tags for API Portal documentation

## [1.0.2] 2023-05-16

## Changed

- Update dependencies

## [1.0.1] 2023-02-01

### Fixed

- Minor vulnerability fix.

## [1.0.0] 2022-09-28

### Added

- Update `json-schema-converter` version to `2.2.0`.

### Removed

- Removed custom error management in file upload and download.

## [0.1.1] 2022-07-07

### Fixed

- The JSON Patch object for the FHIR Server is now generated only for fields present in the PATCH payload.

## [0.1.0] 2022-06-24

- First release.
