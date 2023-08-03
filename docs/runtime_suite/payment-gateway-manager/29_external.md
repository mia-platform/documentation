---
id: external
title: External Integration
sidebar_label: External
---
In this page you will find the required information to perform REST calls for B2B payments

## Endpoints

Every B2B endpoint has this prefix path `/v3/{external}`, where `{external}` is the name of the external service where the payment will be executed.

### POST - /{external}/pay

This endpoint allows to execute payments via the external service.

The request body requires the following data:
- `amount` (required)
- `currency` (required)
- `shopTransactionId` (required)
- `successRedirectUrl`
- `failureRedirectUrl`
- `providerData`

The payment response can have the following result codes:
- **OK**: the payment creation was successful
- **REDIRECT_TO_URL**: the payment creation was successful (the buyer should be redirected to authorize the payment) 
- **KO**: the payment creation failed

### POST - /{external}/refund

This endpoint allows to refund an already executed payment via the external service.

The request body requires the following data:
- `amount` (required)
- `currency` (required)
- `paymentId` (required)
- `providerData`

The refund response can have the following result codes:
- **OK**: the refund was successful
- **KO**: the refund failed
- **PENDING**: the refund is not yet executed

### GET - /{external}/status

This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId`.

The response can have the following status values: 
- **PENDING**
- **ACCEPTED**
- **FAILED**

### GET - /check

This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId` and also to send a notification to the external service as specified by `PAYMENT_CALLBACK_URL` environment variable.

The response can have the following codes:
- **PENDING**
- **ACCEPTED**
- **FAILED**

### GET - /callback

This endpoint should only be called by the external service.
