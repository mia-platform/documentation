---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.0.0 - 2023-09-14

### BREAKING CHANGES

- remove trailing slash to handle requests without path parameters. Using the following configuration and calling the path `/docs` the proxy-manager will call `https://docs.mia-platform.eu/docs` and no more `../../`: 
```javascript
{
  "targetBaseUrl": "https://docs.mia-platform.eu/docs",
  "basePath": "/docs"
}
```

### Added

- add request body log


## 2.0.0 - 2023-05-24

### BREAKING CHANGES

- `SERVICE_PREFIX` must match the following regex `^/[a-zA-Z0-9_-]+$`
- remove entire `basePath` from request path and not only the first segment. Using the following configuration and calling the path `/mia/docs/fast-data` the proxy-manager will call `https://docs.mia-platform.eu/fast-data` and no more `../../fast-data`:
```javascript
{
  "targetBaseUrl": "https://docs.mia-platform.eu/",
  "basePath": "/mia/docs"
}
```

## 1.6.2 - 2023-05-23

### Fixed

- remove configuration `targetBaseUrl` wrong update

## 1.6.1 - 2023-05-19

### Fixed

- `retrieveUrl` correctly interpolates path parameters in case of `SERVICE_PREFIX`

## 1.6.0 - 2023-05-18

### Added

- add `additionalHeaders` to configuration to handle headers that will be proxied to target url

### Changed

- `targetBaseUrl` and `basePath` can contain path parameters

## 1.5.1 - 29-09-2022

### Changed

- update AccessToken.ExpiresIn type from int to json.RawMessage

## 1.5.0 - 1/09/2022

### Added

- Support to [dynamic configuration](https://git.tools.mia-platform.eu/platform/core/proxy-manager/-/issues/4): proxies are fetched from a CRUD collection 

## 1.4.1 - 31-07-2022

### Fixed

- the service now is able to proxy the query parameters

### Changed

- delete token from cache when response returns an HTTP 403 error

## 1.4.0 - 29-04-2022

### Added

- logic to refresh a token if its ExpiresAt date is set and the ExpiresAt date is earlier than current moment

### Fixed

- added a _modify response_ logic to reverse proxy, so that when an HTTP 401 error is encountered
 cached access token is removed. This allow to clean up token cache upon token expiration
 when parameter `TokenIssuerValidationUrl` is not set

### Changed

- updated service dependencies

## 1.3.0 - 25-11-2021

### Changed

- debug logs added to improve the troubleshooting experience
- the service now support optimized proxy without saving request body in memory, this feature is controlled by `ALLOW_PROXY_OPTIMIZER` environment variables and does not perform any retry upon request failures
- fix proxy manager optimized with rewrite req host and x-forwarded-for header

## 1.2.0 - 18-10-2021

### Added

- introduced a mechanism that allows, for each proxy config, to select whether all the headers
  or only a subset of them should be forwarded to the corresponding external service

## 1.1.0 - 11-05-2021

### Added

- introduced the support for the legacy grant type [`password`](https://oauth.net/2/grant-types/password/)
- introduced support to custom auth fields, so that it is possible
  to provide additional body fields in the token

### Changed

- improved how url-encoded forms are created

### Fixed

- added return keyword to proxy handler function to prevent continuing the execution
  when an unexpected status code is encountered
- restored original request body after reading it to prevent error in the case of
  token expiration

## 1.0.1 - 09-04-2021

- Docker image name changed to core/proxy-manager

## 1.0.0 - 08-03-2021

### Added

- First implementation featuring the following capabilities:
  - `client_credentials` grant type with the `client_secret_basic` authentication method.
  - `http` and `https` protocol schemes for target URL
