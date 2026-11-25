---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] 2026-11-09

### Security

- [MCRDHCP-97](https://makeitapp.atlassian.net/browse/MCRDHCP-97): Node.js updated to v22 (LTS) to fix CVE-2026-111497 (Node.js Brotli RCE); Node.js 20 and older receive no fix
- [MCRDHCP-97](https://makeitapp.atlassian.net/browse/MCRDHCP-97): Updated `@mia-platform/custom-plugin-lib` to v8 (Fastify 5), `@mia-platform/lc39` to v9, `stream-chat` to v8 and the other vulnerable dependencies, including the dev tools (Jest 29, TypeScript 5)
- [MCRDHCP-97](https://makeitapp.atlassian.net/browse/MCRDHCP-97): Docker image now installs only production dependencies, upgrades the Alpine packages and no longer ships npm, corepack and yarn

## v1.0.2 - 2024-11-29

- Node.js updated to v20 (LTS)

### Fixed

- Fix documentation links

## v1.0.1 - 2022-11-29

### Changed

- Modified how USERID_HEADER_KEY is used, when a nested property is provided, a stringified object is expected 

## v1.0.0 - 2022-10-25

### Changed

- Update docker image name to mia-care/plugins/chat-service-backend
- Rename service to chat-service-backend

## [v0.4.1]

### Added

- The expiration token duration can be set through the `EXPIRATION_TOKEN_DURATION` environment variable.

## [v0.4.0]

### Changed

- Update POST /webhook/verify in order to log the validation result

## [v0.3.0]

### Added

- Add verify webhook endpoint

## [v0.2.0]

### Added

- Authentication info and errors in /config endpoint

### Changed

- If you were using the `authentication` key in a client type config map object, now it will be overwritten by the authentication info for the client

## [v0.1.0]

- Permissions setup at service startup
- GET /token/:userId handler
- GET /config?clientType= handler
- GET /api-key handler
- Reverse Proxy to Stream configured (forwarding calls to /proxy/...)
- Project setup
