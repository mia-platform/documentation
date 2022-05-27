---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] 2022-05-26

### Fixed

- Fixed a bug as described in [#4](https://git.tools.mia-platform.eu/platform/plugins/messaging-service/-/issues/4) to allow Kafka messages to be sent correctly.
- Fixed an issue occurring when omitting the environment variables `KAFKA_CONNECTION_TIMEOUT` and `KAFKA_AUTHENTICATION_TIMEOUT` as described in [#3](https://git.tools.mia-platform.eu/platform/plugins/messaging-service/-/issues/3).

## [1.0.1] 2022-03-29

- Fix to POST /send for emails with attachments

## [1.0.0] 2021-10-08

- First release
