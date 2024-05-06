---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 1.1.0 - 29/03/2023
### Added
- support to `groups` field in configuration. The field allow to set one or more custom groups to a issuer.
### Changed
- migrated deprecated library https://github.com/dgrijalva/jwt-go to community clone https://github.com/golang-jwt/jwt
- use of libraries `io` and `os` instead of deprecated library `ioutil`

## 1.0.1 - 13/10/2021

- dependencies updates

## 1.0.0 - 23/07/2021

- validation of JWT token with `/verify` endpoint, supporting the configuration of multiple issuer
- changed name env variable JWKS_ENCRYPTION_KEYS_PATH
