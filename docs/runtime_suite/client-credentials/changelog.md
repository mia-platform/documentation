---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- New endpoint `POST - /clients` that allows to create a new client with certain authorization properties and with a certain state.

## 3.1.0 - 21-01-2022

### Added

- Added possibility to set a clock skew, that will be used in the _/oauth/token_ request to validate the **iat** and **notBefore** timestamps

- Added the **optional** `allowedCustomClaims` property to clients, to allow clients that use the `private_key_jwt` _authentication method_ to add custom claims into the *client_assertion*, that will be added into the JWT claims

## 3.0.0 - 20-10-2021

**BREAKING CHANGE**

- The `REDIS_HOST` env is changed in `REDIS_HOSTS`. To use sentinel mode, you can provide multiple comma-separated redis hosts.

### Added

- Added support to redis sentinel
  - Added new `REDIS_MODE` env. default value is `normal`
  - Added new `REDIS_MASTER_NAME` env.
- `OPENID_CONFIG_PATH` environment variable
- `/.well-known/openid-configuration` discovery endpoint to return the OpenId Connect configuration, if available
- updated library dependencies

## 2.0.2 - 02-03-2021

### Fixed

- disable html escape in logs

### Updated

- update dependencies

## 2.0.1 - 05-01-2021

### Fixed

- fix JSON unmarshal of client with public key as empty object (for example if client auth method is client secret basic)

### Updated

- Updated gitlab-ci.yml mongo dependency, from this version mongo 4.4 support is guaranteed.
- Updated redis dependency, from this version redis 6 support is guaranteed.

## 2.0.0 - 05-10-2020

**BREAKING CHANGE**

- updated glogger v2.0.3 which brings new logging format potentially breaking for log processing stack

## 1.1.0 - 07-07-2020

### Added

- JWT registration and login with `private_key_jwt` auth method

## 1.0.0 - 23-06-2020
### Added
- ```POST /register:``` allows to create a client and related credentials. The supported auth method is ```client_secret_basic```.
- ```POST /oauth/token:``` validates client credentials received from request and eventually generates a new JWT for the client. The supported auth method is ```client_secret_basic```.
- ```GET /tokeninfo:``` checks the validity of the received JWT, returning the claims contained in it. If the audience is also received in input, the first is also checked against the audiences defined in the service configuration.
- ```GET /.well-known/jwks.json:``` returns an array of JWK values, whose items can be used to verify the signature of a JWT.
