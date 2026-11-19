---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] 2024-07-22
### Changed
- Replace set global rate limit instead of ip rate limit

## [1.2.0] 2024-03-07

- Update Node.js to v20 (LTS)

### Added

- Add configuration for Kaleyra provider
- Add client for Kaleyra provider
- Use Kaleyra client in `POST /send`

## [1.1.0] 2023-06-27

- Add documentation with OTP fraud prevention features
- Add a configurable rate limit to prevent OTP fraud on Twilio
- Add check on Twilio account balance before sending SMS to prevent OTP fraud
- Add exponential delay to sent sms to prevent OTP fraud

## [1.0.0] 2021-10-08

- First release
