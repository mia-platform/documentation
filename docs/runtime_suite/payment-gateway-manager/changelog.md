---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 2.4.0 - 17/06/2022
### Changed
- Changed `GestPayService` to accept optional fields `buyerName` and `buyerEmail` during the payment

## 2.3.0 - 09/06/2022
### Added
- **New payment provider**: Soisy (native implementation).

## 2.2.0 - 09/06/2022
### Changed
- **BREAKING**: `SCALAPAY_IS_SANDBOX` now is `SCALAPAY_BASE_PATH` to allow more environments to be handled.
- Added `ccInfo` optional field to `CallbackMessage`

## 2.1.0 - 10/05/2022
### Added
- **New payment provider**: SafeCharge.
- **3D-secure session Management** for SafeCharge.
### Changed
- Added `safeChargeData` optional field to `CallbackMessage`

## 2.0.2 - 09/05/2022
### Fixed
- Fixed management of vaulted payments using Braintree without nonce token. Prior to this fix, users encountered
  problems using vaulted payments from different frontends.

## 2.0.1 - 26/04/2022
### Changed
- `HTTP_LOG_LEVEL` env variable is now optional.
### Fixed
- Scalapay `/status` now correctly translates "pending" to the pending response status.

## 2.0.0 - 13/04/2022
### Added
- **New payment provider**: Braintree used to manage transactions having PayPal as payment method.
- **New payment provider**: Scalapay.
- **Braintree dedicated endpoints**: 
  - /braintree/token used to retrieve the users' client 
  - /braintree/submit needed to submit a transaction for settlement
  - /braintree/customer used to create a customer
- **Swagger OpenAPI documentation**: all endpoints are now documented 
  with swagger! You can use the endpoint `/documentation` to view it.
### Changed
- All endpoints now return a response body of type ErrorResponse in case
  of failure (look at openapi documentation)
### Fixed
- Log level is now correctly read from env variable `LOG_LEVEL`

## 1.3.0 - 23-02-2022
### Added
- **New payment provider**: Satispay (native implementation).
- **New payment provider**: Unicredit (credit card payments).
- `redirectToUrlMobile` to `/pay` endpoint, that may contain an iOS global URI to redirect to a specific app.
- Endpoint /status for Satispay provider that allows to check the status of a Satispay payment.
 
## 1.2.2 - 02-02-2021

- New dockerimage name platform/payment-gateway-manager
