---
id: how_it_works
title: How it works?
sidebar_label: How it works
---
In the following document we will provide some example flows for a generic Payment Provider, called `generic-provider`.

## Credit Cards

### 1) Payment

In order to perform a payment we make an `HTTP POST` on `http://payment-gateway-manager/generic-provider/credit-cards/pay`, for example

```
{
    "amount": "5.00",   // the amount to be paid in Euros
    "shopTransactionID": "123456789",   // the unique id of your transaction
    "creditCardToken": "47FKMUVK9PPK2026"  // a string token encoding all the information about the credit card (varies with the provider)
}
```

If the credit card requires `3DS (3D Secure)` the payment reply will return `REDIRECT_TO_URL` as `result`. The actual redirect URL can be found in `redirectToUrl`. 

A physical user will be required to enter a `3DS` code through the `redirectToUrl` web interface to allow the transaction to progress.

```
{
    "result": "REDIRECT_TO_URL", // transaction result, can be "OK", "KO", "REDIRECT_TO_URL"
    "resultDescription": "Transaction pending insertion of 3DS code", // human readable transaction result (varies with the provider)
    "paymentID": "payment-123456789", // payment transaction id as returned by the provider
    "redirectToUrl": "https://provider-redirect-url.com"
}
```

If the credit card does not require `3DS`, a positive reply will be similar to:

```
{
    "result": "OK",
    "resultDescription": "Transaction approved",
    "paymentID": "payment-123456789",
    "redirectToUrl": null
}
```


At this point the credit card transaction has been performed on the `generic-provider`.

### 2) M2M Callback Transaction Verification

When the transaction result is known by the `generic-provider`, the latter may notify the `Payment Gateway Manager` through the `HTTP GET` on `http://payment-gateway-manager/generic-provider/callback`.

This call will contain information allowing to identify the transaction.

The Payment Gateway Manager can use this information to check the transaction status, depending on the provider.

Once the check has been performed, the PGM can notify the result to an external service, as specified by the `PAYMENT_CALLBACK_URL` environment variable.

Considering the above example, the notification may include a body as follows:

```
{
  "providerName": "generic-provider",
  "paymentType": "CREDITCARD",
  "isSuccessful": true,
  "resultDescription": "Transaction completed",
  "paymentID": "payment-123456789",
  "shopTransactionID": "123456789"
}
```

### 3) Refund
The transaction can be refund by calling `HTTP POST` on `http://payment-gateway-manager/generic-provider/credit-cards/refund`, using as JSON body:

```
    "shopTransactionID": "123456789",
    "amount": "5.00"
```

If the reply returns `200` as HTTP Status code, the refund has been performed correctly.
