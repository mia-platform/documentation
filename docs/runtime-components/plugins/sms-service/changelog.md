---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] 2026-11-09

### Security

- [MCRDHCP-97](https://makeitapp.atlassian.net/browse/MCRDHCP-97): Update Node.js to v22 (Docker image, `.nvmrc`, `engines` and CI) to fix CVE-2026-111497 (Node.js Brotli RCE), which is not fixed in Node.js 20 (EOL)
- [MCRDHCP-97](https://makeitapp.atlassian.net/browse/MCRDHCP-97): Update `@mia-platform/custom-plugin-lib` to v8 (Fastify 5), `@fastify/rate-limit` to v10, `twilio` to v6 and `typescript` to v5, and refresh the lockfile to remove vulnerable transitive dependencies (`axios`, `jws`, `lodash`)
- [MCRDHCP-97](https://makeitapp.atlassian.net/browse/MCRDHCP-97): Harden the Docker image: upgrade Alpine packages, install only production dependencies and remove `npm`, `corepack` and `yarn` from the final image

## [1.2.1] 2024-07-22
### Changed
- Replace set global rate limit instead of ip rate limit

## [1.2.0] 2024-03-07

- Update Node.js to v20 (LTS)

### Added

- Add configuration for Kaleyra provider
- Add client for Kaleyra provider
- Use Kaleyra client in `POST /send`

## [1.1.0] 2023-06-27

- Add documentation with OTP fraud prevention features
- Add a configurable rate limit to prevent OTP fraud on Twilio
- Add check on Twilio account balance before sending SMS to prevent OTP fraud
- Add exponential delay to sent sms to prevent OTP fraud

## [1.0.0] 2021-10-08

- First release
