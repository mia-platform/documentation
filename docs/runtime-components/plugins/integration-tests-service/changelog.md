---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] 2026-11-09

### Security

- [MCRDHCP-97](https://makeitapp.atlassian.net/browse/MCRDHCP-97): Upgrade from the EOL Node.js 18 to Node.js 22 (Docker image `node:22-alpine`, CI image, `.nvmrc` `lts/jod`, `engines` `>=22`) to fix CVE-2026-111497 (Node.js Brotli RCE); Alpine packages upgraded, final image with production dependencies only and without npm/corepack/yarn
- [MCRDHCP-97](https://makeitapp.atlassian.net/browse/MCRDHCP-97): Upgrade `@mia-platform/custom-plugin-lib` to `^8.1.1` (Fastify 5), `@fastify/multipart` to `^9.0.0`, `newman` to `^6.2.3`, `adm-zip` to `^0.6.1` and `lodash` to `^4.18.1`; add overrides for `handlebars`, `flatted`, `underscore`, `node-forge`; the request decorators `cache` and `gitlab` now use the `getter` interface. Known residual: `@faker-js/faker` 5.5.3 (CVE-2026-73231, transitive via `newman`/`postman-collection`) has no compatible fix

- [MCRDP4S1-12](https://makeitapp.atlassian.net/browse/MCRDP4S1-12): Add endpoint to retrieve test results

## [0.2.0] 2023-11-29

- Add endpoint to launch a test
- Add pipeline ID to group tests
- Add endpoint to retrieve HTML reports
- Accept test assets when launching test
- Replace pipeline ID with tag name
