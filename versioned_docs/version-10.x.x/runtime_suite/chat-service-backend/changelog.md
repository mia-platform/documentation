---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
