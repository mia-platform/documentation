---
id: scalapay
title: Scalapay
sidebar_label: Scalapay
---
In this page you will find the required information to perform REST calls related to the Scalapay payment provider.

| Payment Method | Payment | Refund | Automatic Subscription | Manual Subscription |
|----------------|---------|--------|------------------------|---------------------|
| `scalapay `    | ✓       | ✓      |                        |                     | 

|              | Enabled |
|--------------|---------|
| Pay By Link  | ✗       |

## Endpoints

Every Scalapay endpoint has this prefix path `/v3/scalapay`

### Pay

`POST /{payment-method}/pay`

This endpoint allows to execute payments via the Scalapay payment provider.

The request body requires the `providerData` field which requires the following data:
```jsonc
{
  {
        "consumer": {
            "givenNames": "name",
            "surname": "surname"
        },
        "shipping": {
            "countryCode": "IT",
            "name": "shipping name",
            "postcode": "20800",
            "line1": "Via Garibaldi, 12"
        },
        "merchant": {
            "redirectConfirmUrl": "https://success-url",
            "redirectCancelUrl": "https://failure-url"
        },
        "items": [{
            "quantity": 1,
            "price": {
                "amount": 100,
                "currency": "EUR"
            },
            "name": "item name",
            "category": "category name",
            "sku": "sku value"
        }]
    }
}
```

The payment response can have the following result codes:
- **REDIRECT_TO_URL**: the payment creation was successful (the buyer should be redirected to authorize the payment) 
- **KO**: the payment creation failed

### Refund

`POST /refund`
This endpoint allows to refund an already executed payment via the Scalapay provider.

The request body does not require any provider-specific data.

### Status

`GET /status?paymentId={paymentId}`

This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId`.


### Check

`GET /check?paymentId={paymentId}`

This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId` and also send a notification to the external service as specified by `PAYMENT_CALLBACK_URL` environment variable.


### Callback

`POST /callback`

This endpoint should only be called by Scalapay.
