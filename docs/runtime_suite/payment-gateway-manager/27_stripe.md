---
id: stripe
title: Stripe
sidebar_label: Stripe
---
In this page you will find the required information to perform REST calls related to the Stripe payment provider.

| Payment Method | Payment | Refund | Automatic Subscription | Manual Subscription |
|----------------|---------|--------|------------------------|---------------------|
| `credit-cards` | ✓       | ✓      | ✓                      |                     | 

|              | Enabled |
|--------------|---------|
| Pay By Link  | ✓       |

## Endpoints

Every Stripe endpoint has this prefix path `/v3/stripe`

### Pay

`POST /{payment-method}/pay`

This endpoint allows to execute payments via the Stripe payment provider.

The request body does **not** require any additional data, thus the `providerData` field can be omitted.

The payment response can have the following result codes:
- **REDIRECT_TO_URL**: the payment was successfully submitted for settlement
- **KO**: the payment failed

### Refund

`POST /refund`

This endpoint allows to refund an already executed payment via the Stripe provider.

The request body does not require any provider-specific data.

### Subscription

####  Schedule

`POST /subscription/schedule`

This endpoint allows to start a new subscription via the Stripe provider.

The request body does **not** require any additional data, thus the `providerData` field can be omitted.

The `subscriptionInfo.interval` field accept the following values:
- `MONTH`


#### Expire

`POST /subscription/expire/{subscriptionToken}?shopTransactionId={{shopTransactionId}}`

This endpoint allows to expire a subscription.

### Status

`GET /status?paymentId={paymentId}`
This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId`.

### Check

`GET /check?paymentId={paymentId}`
This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId` and also to send a notification to the external service as specified by `PAYMENT_CALLBACK_URL` environment variable.

### Pay By Link

`POST /pay-by-link`

The request body does not require any provider-specific data.

### Callback

`GET /callback`
This endpoint should only be called by Stripe.

## Stripe Dashboard Configuration
Some configurations are needed on the provider dashboard in order to be able to manage automatic payments related to subscription:
1. create a new webhook to the **Payment Gateway Manager** `/v3/stripe/callback` endpoint
2. enable the following notifications:
    - checkout.session.async_payment_failed
    - checkout.session.async_payment_succeeded
    - checkout.session.completed
    - checkout.session.expired
    - invoice.payment_failed
    - invoice.payment_succeeded
