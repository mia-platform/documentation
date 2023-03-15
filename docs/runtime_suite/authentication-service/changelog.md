---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 2.8.2 - 06-03-2023

### Fixed

- an empty redirect url is always allowed when the option `allowedRedirectUrlsOnSuccessfulLogin` is specified
- expose webhooks only when `EXPOSE_WEBHOOKS` flag is true (this change is **breaking** but the feature is not in use for now)

## 2.8.1 - 03-03-2023

### Fixed

- added missing return statement after sending error to client in okta webhook

## 2.8.0 - 28-02-2023

### Added

- Added option `authorizeStateRequired`, that lets the client application define the `state` parameter during authorization 
- Added option `allowedRedirectUrlsOnSuccessfulLogin`, which allows only a predefined set of redirect urls that can be defined by the client

### Fixed

- add "miauserid" to AdditionalHeadersToProxy env
- return 401, instead of 500, if token not found in redis
- use SameSite=Lax as default when sending a cookie to comply with browser defaults
- Refresh token does not check the provider userinfo when not needed
- Documented refresh token endpoint

## 2.7.1 - 03-11-2022

### Fixed

- fix service config json schema (for oidcKeys) and docs

## 2.7.0 - 08-07-2022

### Added

- BitBucket support
- Keycloak and generic provider support

### Changed

- Moved `getTokensFromProviderResponse` function to oidcProvider structure

## 2.6.0 - 25-05-2022

### Added

- Microsoft authentication

## 2.5.0 - 21-03-2022

### Added

- added user settings URL parameter

## 2.4.0 - 23-12-2021

### Added
- inserted okta provider authorization
- Redis connection can receive username and password 

## 2.3.0 - 17-09-2021

### Added

- added support for App Provider label

## 2.2.1 - 05-07-2021

### Fixed

- fix env vars panic

## 2.2.0 - 05-07-2021

### Added

- proxied headers specified by env var in crud client calls

## 2.1.1 - 07-06-2021

### Changed

- change log level in token and user info api without access token from error to debug.

## 2.1.0 - 19-05-2021

### Added

- new login flow to support grant type `password`. This feature is supported only for `gitlab` provider.

## 2.0.3 - 02-03-2021

### Updated

- update dependencies


## 2.0.2 - 15-02-2021

### Updated

- update dependencies

### Fixed

- disable html escape for log

## 2.0.1 - 02-12-2020

### Updated

- Updated redis dependency, from this version redis 6 support is guaranteed.

## 2.0.0 - 05-10-2020

**BREAKING CHANGE**
- updated glogger v2.0.3 which brings new logging format potentially breaking for log processing stack

## 1.1.3 - 20-07-2020

### Fixed

- refresh mia token with an empty refresh token now works correctly.

## 1.1.2 - 16-07-2020

### Added

- add ADDITIONALS_CA_FOLDER env variables and handles custom ca certs inside this folder

## 1.1.1 - 10-07-2020

### Fixed

- changed endpoint of providers: `/:appId/providers/` --> `/apps/:appId/providers`. This is treated as a bugfix, but it's also a BREAKING CHANGES for the version 1.1.0.

## 1.1.0 - 08-07-2020

### Added

- added `redirect` query parameter to login flow
- new api to get provider list
- handle `redirect` query parameter on logout
- add default redirect configuration for app on login success

## 1.0.0 - 17-06-2020

### Added

- Add userinfo endpoint
- add status routes
- Add tokeninfo endpoint
- Add refresh token flow. Add variable in provider configuration to skip provider refresh token flow
- Generate refresh token
- Add login and logout by website handling sid cookie
- handle provider github
