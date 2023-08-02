---
id: soisy
title: Soisy
sidebar_label: Soisy
---
In this page you will find the required information to perform REST calls related to the Soisy payment provider.

## Supported payment methods

Currently, the only payment method supported by the Soisy provider is `soisy` itself.

## Endpoints

Every Soisy endpoint has this prefix path `/v3/soisy`.

### POST - /{payment-method}/pay

This endpoint allows to execute payments via the Soisy payment provider.

The request body may have the `providerData` structured as follows (no field is required):
- `email`
- `firstname`
- `lastname`
- `instalments` (integer)
- `vatId`
- `vatCountry`
- `fiscalCode`
- `mobilePhone`
- `city`
- `province`
- `address`
- `civicNumber`
- `postalCode`
- `zeroInterestRate` (boolean)

The payment response can only have the **REDIRECT_TO_URL** result code: the payment creation was successful (the buyer
should be redirected to complete the payment).

### POST - /refund

The Soisy payment provider does not support the refund feature, therefore this endpoint will always reply with status
code 501.

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

Furthermore, the response contains the `providerSpecificProperties` field with the data coming directly from Soisy.

### POST - /callback

This endpoint should only be called by Soisy.
