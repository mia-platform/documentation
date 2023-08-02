---
id: adyen
title: Adyen
sidebar_label: Adyen
---
:::warning
At this moment, only the Adyen [Automatic Capture](https://docs.adyen.com/online-payments/classic-integrations/modify-payments/capture#automatic-capture) mode is supported. Remember to set it in the Adyen Customer Area.
:::

In this page you will find the required information to perform REST calls related to the Adyen payment provider.

## Supported payment methods

Currently, the only payment method supported by the Adyen provider is `credit-cards`.

## Endpoints

Every Adyen endpoint has the prefix path `/adyen`.

### POST - /{payment-method}/pay

#### Credit Card

Endpoint `/credit-cards/pay`, in addition to the common mandatory fields, has four provider specific required ones:
```jsonc
{
   "amount": "...",
   "shopTransactionId": "...",
   "providerData": {
      "encryptedCardNumber": "...",
      "encryptedExpiryMonth": "...",
      "encryptedExpiryYear": "...",
      "encryptedSecurityCode": "..."
   }
}
```
All these four fields are related to the shopper credit card details and must be encrypted by Adyen system first. 

The payment response can have the following result codes:
- **OK**: the payment creation was successful
- **KO**: the payment creation failed

### POST - /refund

This endpoint allows to refund, fully or partially, an already executed payment via the Adyen provider.

The request body does not require any provider-specific data.

The refund request is asynchronous, so `/refund` endpoint doesn't return the outcome of the operation but a generic `PENDING` code. 
In order to verify if a refund has been performed or not, a notification must be received through the `/callback` endpoint.

### POST - /callback

This endpoint should only be called by Adyen.

:::warning
The `/status` and `/check` endpoints are not implemented.
:::
