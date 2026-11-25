---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] 2026-11-09

### Security

- Upgrade Node.js to 22 (Docker image `node:22-alpine`, CI image, `.nvmrc` `lts/jod`, `engines` `>=22`), fixing CVE-2026-111497 (Node.js Brotli RCE) (MCRDHCP-97)
- Upgrade `@mia-platform/custom-plugin-lib` to `^8.1.1` (Fastify 5) and `eslint` to `^8.57.1`; refresh transitive dependencies to clear known vulnerabilities
- Replace `tap` with `jest` (and `axios` to `^1`) as test tooling; remove `mock-require`
- Docker image: install production dependencies only, upgrade Alpine packages, remove npm/corepack/yarn from the final stage
- Route schemas are now full JSON schemas; added content type parsers for `application/json-patch+json` and unknown content types
