---
id: stripe
title: Stripe
sidebar_label: Stripe
---
In this page you will find the required information to perform REST calls related to the Stripe payment provider.

## Supported payment methods

Currently, the only payment method supported by the Stripe provider is `credit-cards`.


## Endpoints

Every Stripe endpoint has this prefix path `/v3/stripe`


### POST - /{payment-method}/pay

This endpoint allows to execute payments via the Stripe payment provider.
The minimum request body to create a payment is the following:
```jsonc
{
    "amount": 5,   // the amount to be paid in Euros
    "shopTransactionId": "123456789",   // the unique id of your transaction
    "currency": "EUR",  //currency of the amount
    "successRedirectUrl": "http://example.com/ok",   // the URL to be redirected to if payment succeeds
    "failureRedirectUrl": "http://example.com/ko",   // the URL to be redirected to if payment fails
}
```

The request body does **not** require any additional data, thus the `providerData` field can be omitted.

The payment response can have the following result codes:
- **REDIRECT_TO_URL**: the payment was successfully submitted for settlement
- **KO**: the payment failed


### POST - /{payment-method}/refund

This endpoint allows to refund an already executed payment via the Stripe provider.

The request body does not require any provider-specific data.

The refund response can have the following result codes:
- **OK**: the refund was successful
- **KO**: the refund failed

### GET - /{payment-method}/status

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

### GET - /callback

This endpoint should only be called by Stripe.
