---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.1] 2026-11-09

### Security

- [MCRDHCP-97](https://makeitapp.atlassian.net/browse/MCRDHCP-97): Fix CVE-2026-111497 (Node.js Brotli RCE) by moving the build/CI toolchain from end-of-life Node 14 to Node 22 (CI image `node:22-alpine`, `.nvmrc` `lts/jod`, `engines` `>=22`), updating the nginx base image to `nginx:stable-alpine` with `apk upgrade`, and pinning patched `axios`, `form-data`, `jsonwebtoken`, `jws` and `lodash` via yarn resolutions

### Fixed

- Make the `useChat` connect test wait for the `connectUser` call

## [1.0.1] 2023-05-23

- Fix documentation links
- Fixed integration with micro-lc v2

## [1.0.0] 2022-10-24

- First release
