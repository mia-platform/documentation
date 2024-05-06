---
id: how_it_works
title: How does it work?
sidebar_label: How it works
---
In the following document we will provide some example flows for a generic Payment Provider, called `generic-provider`.
Provider specific edge cases are covered in more detail in the following pages, this is more of a generic overview of
the PGM and how to interact with it.

## 1) Payment

The following example is based on the credit card payment method, but it can be applied to any payment.

In order to perform a payment we make an `HTTP POST` on `http://payment-gateway-manager/generic-provider/credit-cards/pay`, for example

```
{
    "amount": "5.00",   // the amount to be paid in Euros
    "shopTransactionID": "123456789",   // the unique id of your transaction
    "creditCardToken": "47FKMUVK9PPK2026"  // a string token encoding all the information about the credit card (optional, varies with the provider)
}
```

If you are using gestpay(Axerve) as your provider, you can pass the optional fields `buyerName` and `buyerEmail` in the body of the `/pay`.
In this case, the buyer will receive an email from Axerve with the transaction result, such as merchant name, date of the payment, amount, and other info.

If the payment procedure requires an additional step from the user, via web page or mobile app, the payment reply will 
return `REDIRECT_TO_URL` as `result`. The actual redirect URLs can be found in `redirectToUrl` and `mobileRedirectToUrl`.

For instance, a physical user might be required to enter a `3DS` code through the `redirectToUrl` web interface to 
allow the transaction to progress.

```
{
    "result": "REDIRECT_TO_URL", // transaction result, can be "OK", "KO", "REDIRECT_TO_URL"
    "resultDescription": "Transaction pending insertion of 3DS code", // human readable transaction result (varies with the provider)
    "paymentID": "payment-123456789", // payment transaction id as returned by the provider
    "redirectToUrl": "https://provider-redirect-url.com", // redirect web page
    "redirectToUrlMobile": "provider-app://redirect?token=example" // redirect iOS url-scheme, used to open the provider's app in iOS devices
}
```

If the payment doesn't require any additional step, a positive reply will be similar to:

```
{
    "result": "OK",
    "resultDescription": "Transaction approved",
    "paymentID": "payment-123456789",
    "redirectToUrl": null,
    "redirectToUrlMobile": null
}
```

At this point the transaction has been performed on the `generic-provider`.

If payment pre-authorization has been activated, at the end of the process the order will be in a state where payment must be confirmed. 
To confirm the payment and actually deduct the amount to the user wallet, simply call the endpoint `http://payment-gateway-manager/generic-provider/credit-cards/confirm` as described in point 3

:::info
Payments that use Braintree as gateway don't need to call the /check endpoint in order to verify the status of the payment processing,
 as their status is automatically confirmed through the Nonce payment method sent by the frontend applications.
:::

GestPay has the ability to override the default URLs where the user will be redirected in case of success or failure.  
For this to work, you have to specify the following optional fields in the /pay request body:
```
{
    "successRedirect": "https://example.com/ok",
    "failureRedirect": "https://example.com/ko",
    "serverRedirect": "https://example.com/callback"
}
```
Stripe supports overriding `successRedirect` and `failureRedirect` as well.

## 2) M2M Callback Transaction Verification

When the transaction result is known by the `generic-provider`, the latter may notify the `Payment Gateway Manager` 
through the `HTTP GET` or `HTTP POST` on `http://payment-gateway-manager/generic-provider/callback`.

This call will contain information allowing to identify the transaction.

The Payment Gateway Manager can use this information to check the transaction status, depending on the provider.

Once the check has been performed, the PGM can notify the result to an external service, as specified by the 
`PAYMENT_CALLBACK_URL` environment variable.

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

## 3) Payment Confirmation

If the service is set to use pre-authorization, to confirm the payment and actually deduct the money from the user's wallet,
 you must call the confirmation endpoint `http://payment-gateway-manager/generic-provider/credit-cards/confirm` via `POST` with the following body:
                           
```
{
   "shopTransactionID": "123456789",
   "amount": "5.00"
}
```
If the response returns `200` as HTTP status code, the order confirmation was successful.

:::warning
At the moment only `Unicredit` supports payment with pre-authorization.
:::

## 4) Refund

The transaction can be refund by calling `HTTP POST` on `http://payment-gateway-manager/generic-provider/credit-cards/refund`, using as JSON body:

```
    "shopTransactionID": "123456789",
    "amount": "5.00"
```

If the response result is `OK`, the refund has been performed correctly.

It is also possible to partially refund the same payment more than once, until the original payment amount is reached.

:::note
The body may require the `paymentID` field instead of the `shopTransactionID` one depending on the used payment method.
:::

:::warning
At the moment the `scalapay` and `soisy` providers don't support refunds. 
:::

## 5) Async Check Transaction Status

You can ask the Payment Gateway Manager to trigger a check on a particular order by calling an `HTTP GET` on `http://payment-gateway-manager/generic-provider/check`.

The query parameters for this api depend on the provider:

| Provider  | Parameters          | Description                                                               |
|-----------|---------------------|---------------------------------------------------------------------------|
| gestpay   | `shopTransactionId` | Transaction id defined by the caller of `/pay`                            |
| satispay  | `paymentId`         | Payment id generated by Satispay and returned in the `/pay` response body |
| scalapay  | `paymentId`         | Payment id generated by Scalapay and returned in the `/pay` response body |
| unicredit | `shopTransactionId` | Transaction id defined by the caller of `/pay`                            |
| braintree |                     | API not supported                                                         |
| soisy     | `paymentId`         | Payment id generated by Soisy and returned in the `/pay` response         |
| stripe    | `paymentId`         | Session id generated by Stripe and returned in the `/pay` response        |

After the check has been performed, the PGM may notify the result to the same external service used by the M2M callback flow, as specified by the `PAYMENT_CALLBACK_URL` environment variable.

The explicit check API can be used whenever M2M verification for a specific payment didn't call the callback url successfully or, more generally,
if the chosen payment method doesn't support M2M callbacks at all.

The notification may include a body as follows:

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

## 6) Sync Check Transaction Status

You can retrieve the status of a transaction by performing an `HTTP GET` on `http://payment-gateway-manager/generic-provider/status?shopTransactionId=my-stid`. This API is a synchronous and dumbed down version of `/check`.

The PGM will contact the payment provider and return a body as follows:

```
{
  "status": "ACCEPTED"
}
```

The possible values for `value` are `ACCEPTED`, `FAILED`, and `PENDING`.

:::note 
This API has been implemented to give sync access to a transaction status, e.g. to poll a status for payment providers that don't let frontends intercept the outcome of a payment (like Satispay).
:::

:::warning
This endpoint is only available for `gestpay`, `satispay`, `scalapay`, `soisy`, `unicredit` and `stripe` providers at the moment.
:::

## 7) Manage a Transaction Session

You can ask a payment provider to establish a new transaction session in order to perform various operations, such as Pre-Authentication, invalidation or refund of a payment. In this way, the PGM can work as a **validator** (secure actor, possibly endowed with a secret) of the communication between the user and the payment provider.
A new session can be established by an `HTTP POST` request on the `http://payment-gateway-manager/generic-provider/session/open` API.

The PGM is responsible for contacting the payment provider, which will return a **sessionToken** to be used in the next operations.

As soon as a session is established, you can perform the following operations on the transaction you are going to perform:
* confirm a transaction: `HTTP POST` request on the `http://payment-gateway-manager/generic-provider/session/confirm` API
* void a transaction: `HTTP POST` request on the `http://payment-gateway-manager/generic-provider/session/void` API
* refund (totally or partially) a transaction: `HTTP POST` request on the `http://payment-gateway-manager/generic-provider/session/refund` API
* check the status of a transaction: `HTTP POST` request on the `http://payment-gateway-manager/generic-provider/session/check` API, specifying the related sessionToken in the body of the request
