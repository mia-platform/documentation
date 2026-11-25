---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] 2026-11-09

### Security

- upgrade Node.js to version 22 (Docker image `node:22-alpine`, `.nvmrc`, `engines`, CI) to fix CVE-2026-111497 (Brotli RCE); Node 20 is end of life and receives no fix
- the Docker image upgrades OS packages and removes npm, corepack and yarn from the final stage; production dependencies have no known HIGH or CRITICAL vulnerabilities

## [1.0.0] 2024-11-06
