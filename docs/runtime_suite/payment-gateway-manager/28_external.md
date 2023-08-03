---
id: external
title: External Integration
sidebar_label: External
---
In this page you will find the required information to perform REST calls for external payments and custom integrations.

## Endpoints

Every endpoint has this prefix path `/v3/{external}`, where `{external}` is the name of the external service where the payment will be executed.

### POST - /{external}/pay

This endpoint allows to execute payments via the external service.

The `providerData` object will be sent to the external service.


### POST - /{external}/refund

This endpoint allows to execute a refund via the external service.

The `providerData` object will be sent to the external service.

### Status

`GET /status?paymentId={paymentId}`
This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId`.


### Check

`GET /check?paymentId={paymentId}`
This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId` and also to send a notification to the external service as specified by `PAYMENT_CALLBACK_URL` environment variable.


### Callback

`GET /callback`
This endpoint should only be called by the external service.
