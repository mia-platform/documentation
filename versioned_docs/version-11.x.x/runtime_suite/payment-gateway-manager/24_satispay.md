---
id: satispay
title: Satispay
sidebar_label: Satispay
---
In this page you will find the required information to perform REST calls related to the Satispay payment provider.

| Payment Method | Payment | Refund | Automatic Subscription | Manual Subscription |
|----------------|---------|--------|------------------------|---------------------|
| `satispay`     | ✓       | ✓      |                        | ✓                   | 

|              | Enabled |
|--------------|---------|
| Pay By Link  | ✗       |

## Endpoints

Every Satispay endpoint has this prefix path `/v3/satispay`.

### Pay

`POST /{payment-method}/pay`

This endpoint allows to execute payments via the Satispay payment provider.

The request body does **not** require any additional data, thus the `providerData` field can be omitted.

The payment response can have the following result codes:
- **REDIRECT_TO_URL**: the payment creation was successful (the buyer should be redirected to authorize the payment)
- **KO**: the payment creation failed

### Refund

`POST /refund`
This endpoint allows to refund an already executed payment via the Satispay provider.

The request body does not require any provider-specific data.

### Subscription

####  Schedule

`POST /subscription/pay`

This endpoint allows to create a new payment related to a subscription via the Satispay provider.

The request body does **not** require any additional data, thus the `providerData` field can be omitted.

:::warning
Before starting a new subscription, it is necessary to request the authorization token through the /utility/{paymentMethod}/subscription/token endpoint
:::

#### Expire

`POST /subscription/expire/{subscriptionToken}?shopTransactionId={{shopTransactionId}}`

This endpoint allows to expire a subscription.

### Status

`GET /status?paymentId={paymentId}`

This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId`.


### Check

`GET /check?paymentId={paymentId}`

This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId` and also send a notification to the external service as specified by `PAYMENT_CALLBACK_URL` environment variable.


### Callback

`POST /callback`

This endpoint should only be called by Satispay.

### Callback Authorization

`POST /callback/authorization`

This endpoint should only be called by Satispay.
It is used only to receive the authorization token for a new subscription.

### Utility

#### Subscription Token

`POST /utility/{paymentMethod}/subscription/token`

This endpoint allows to get the authorization token in order to create a subscription.
