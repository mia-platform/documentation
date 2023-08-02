---
id: scalapay
title: Scalapay
sidebar_label: Scalapay
---
In this page you will find the required information to perform REST calls related to the Scalapay payment provider.

## Supported payment methods

Currently, the only payment method supported by the Scalapay provider is `scalapay` itself.

## Endpoints

Every Scalapay endpoint has this prefix path `/v3/scalapay`

### POST - /{payment-method}/pay

This endpoint allows to execute payments via the Scalapay payment provider.

The request body requires the `providerData` field which requires the following data:
- `consumer`, which requires
  - `givenNames`
  - `surname`
- `shipping`, which requires
  - `countryCode`
  - `name`
  - `postCode`
  - `line1`
- `items` array, each requires
  - `quantity`
  - `price`, which requires
    - `amount`
    - `currency`
  - `name`
  - `category`
  - `sku`
- `merchant`, which requires
  - `redirectConfirmUrl`
  - `redirectCancelUrl`

The payment response can have the following result codes:
- **REDIRECT_TO_URL**: the payment creation was successful (the buyer should be redirected to authorize the payment) 
- **KO**: the payment creation failed

### POST - /refund

This endpoint allows to refund an already executed payment via the Scalapay provider.

The request body does not require any provider-specific data.

The refund response can have the following result codes:
- **OK**: the refund was successful
- **KO**: the refund failed

### GET - /status

This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId`.

The response can have the following codes: 
- **PENDING**
- **ACCEPTED**
- **FAILED**

### GET - /check

This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId` and also to send a notification to the external service as specified by `PAYMENT_CALLBACK_URL` environment variable.

The response can have the following codes:
- **PENDING**
- **ACCEPTED**
- **FAILED**

### POST - /callback

This endpoint should only be called by Scalapay.
