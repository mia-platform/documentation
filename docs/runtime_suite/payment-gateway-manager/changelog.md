---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 3.1.0 - 12/09/2023

### Added

- Feature Pay By Link

## 3.0.1 - 11/08/2023

### Security

- Bumped to Quarkus 3

## 3.0.0 - 01/08/2023

### BREAKING CHANGES

- v3 APIs

### Changed

- Changed path parameter from `paymentID` to `paymentId` in endpoint `/status` for stripe payment method

### Added

- `/saga/payment-methods` API to retrieve available payment methods given a saga
- `/saga/pay`, `/saga/confirm` and `/saga/refund` APIs for Flow Manager communication
- Events to be sent to Flow Manager when enabled
- Module for b2b payments and its endpoints

### Fixed

- Scalapay callback supported payment status extended with `pending`, `partially_refunded` and `refunded_not_charged`

## 2.9.0 - 05/12/2022

### Added

- Stripe payment provider

## 2.8.2 - 14/11/2022

### Added

- Amount zero for recurrents payments

## 2.8.1 - 09/11/2022

### Fixed

- Add travelDate to scalapay callback

### Added

- Multi module repository

## 2.8.0 - 07/11/2022

### Added

- Support of Paypal refund with Gestpay (Axerve) provider

### Fixed

- Make ScalaPay callback request body shipping fields nullable

## 2.7.0 - 04/11/2022

### Added

- Add Satispay refund with Satispay and Gestpay provider

### Fixed

- Unicredit: Orders with code CO were incorrectly considered as paid.

## 2.6.2 - 06/10/2022

### Security fix

- CVE-2021-42550
- CVE-2022-37434

## 2.6.1 - 06/10/2022

### Hotfix

- Braintree: option `submit_for_settlement`removed from configs and hardcoded to `true`

## 2.6.0 - 04/08/2022

### Added

- Added possibility for GestPay payments to override redirect URLs via /pay request body, including the URL for the server callback

## 2.5.1 - 18/07/2022

### Added

- Added possibility for credit card, Satispay, Scalapay payments to override redirect URLs via /pay request body

## 2.5.0

### Added

- new endpoint `/pay/recurrent` to _gestpay_(Axerve) provider for `credit-cards` and `pay-pal` methods
to support executing recurrent payments

### Changed

- _gestpay_ /create interface, so that now it includes also details regarding recurring payments
- _CallbackMessage_ now contains `recurrenceToken` field, which value, if present, can be employed
to perform subsequent payments with PayPal (without user interaction)
- upgraded service dependencies
- updated Dockerfile to build from source code the JAR executed in the image, rather than
copying the one created within the build pipeline
- updated build configuration to target Java 17

### Fixed

- PayPal payment type in gestpay provider (it was set to Satispay)
- reduced building warnings
- Fixed return fields of the SafeCharge closeTransaction operations. Now they always return the authCode and the 
  transactionId.

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
