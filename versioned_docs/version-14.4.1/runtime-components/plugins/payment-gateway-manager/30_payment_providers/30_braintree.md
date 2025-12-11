---
id: braintree
title: Braintree
sidebar_label: Braintree
---



In this page you will find the required information to perform REST calls related to the Braintree payment provider.

| Payment Method | Payment | Refund | Automatic Subscription | Manual Subscription |
|----------------|---------|--------|------------------------|---------------------|
| `pay-pal `     | ✓       | ✓      | ✓                      |                     | 

|              | Enabled |
|--------------|---------|
| Pay By Link  | ✗       |

## Endpoints

Every Braintree endpoint has this prefix path `/v3/braintree`

### Pay

`POST /{payment-method}/pay`

This endpoint allows to execute payments via the Braintree payment provider.

The request body requires the `providerData` field with the following data:
- `customerId` (required): id of the customer. If already Vaulted, payment uses this field to identify the customer, thus make sure to give
  the same id that you saved in the vault. Otherwise, the customer is created with this id.
- `storeInVault` (required): boolean that specifies whether to store the customer inside the vault. Set it to `true` if performing
  Checkout + Vault.
- `vaulted` (required): boolean that specifies whether the customer is already vaulted or not.
- `nonce`: nonce that identify the payment method of the customer. Required performing a non-vaulted payment. If already vaulted, the nonce is used if specified;
  if it is null, the customer id is used to retrieve the payment method already vaulted.
- `deviceData`: Braintree device session ID.


For more information, please read BrainTree's [documentation](https://developer.paypal.com/braintree/docs/guides/paypal/overview),
paying particular attention to the Vault, Checkout and Checkout with Vault sections.

:::warning
Checkout + Vault is only supported on JS frontends; iOS and Android apps must perform Vaulting and Checkout separately.
:::

### Refund

`POST /refund`

This endpoint allows to refund an already executed payment via the Braintree provider.

The request body does not require any provider-specific data.

### Subscription

####  Schedule

`POST /subscription/schedule`

This endpoint allows to start a new subscription via the Braintree provider.

The request body requires the `providerData` field with the following data:
- `paymentToken`: identifier of a customer Payment method, if specified 
- `customerId` (required): id of the customer. If already Vaulted, payment uses this field to identify the customer, thus make sure to give
  the same id that you saved in the vault. Otherwise, the customer is created with this id.
- `storeInVault` (required): boolean that specifies whether to store the customer inside the vault. Set it to `true` if performing
  Checkout + Vault.
- `vaulted` (required): boolean that specifies whether the customer is already vaulted or not.
- `nonce`: nonce that identify the payment method of the customer. Required performing a non-vaulted payment. If already vaulted, the nonce is used if specified;
  if it is null, the customer id is used to retrieve the payment method already vaulted.
- `deviceData`: Braintree device session ID.


The request body requires the `providerData` object: the following options are available:
- `paymentToken`: paymentToken related to the payment method saved on Braintree Vault for the customer.
    ```jsonc
    {
      [...]
      "providerData": {
         "paymentToken": string
      },
    }
    ```
- `vaulted`: specifies that the customer is already vaulted. One of `nonce` or `customerId` is required.
    With the `nonce` specified, a new payment method is stored in the vault, otherwise teh one stored in the vault for the specified `customerId` is used.
    ```jsonc
    {
      [...]
      "providerData": {
        "nonce": string,      // Nonce related to the user's payment method.
        "customerId": string, // Braintree customer identifier. Required.
        "vaulted": true                 
      },
    }
    ```
- `non-vaulted`: specifies that the customer is not vaulted. Both `nonce` and `customerId` are required.
    The customer is created with the associated payment method specified by the `nonce`.
    ```jsonc
    {
      [...]
      "providerData": {
        "nonce": string,      // Nonce related to the user's payment method. Required.
        "customerId": string, // Braintree customer identifier. Required.
        "vaulted": true                 
      },
    }
    ```

The `subscriptionInfo.interval` field accepts only the following values:
- MONTH

#### Update

`POST /subscription/update/{subscriptionToken}`

This endpoint allows to update subscription info.

#### Get Status

`GET /subscription/status/{subscriptionToken}`

This endpoint allows to get a subscription status. Available status are:
- `PENDING`
- `ACTIVE`
- `PAST_DUE`
- `EXPIRED`
- `CANCELED`
- `UNKNOWN`

#### Expire

`POST /subscription/expire/{subscriptionToken}?shopTransactionId={{shopTransactionId}}`

This endpoint allows to expire a subscription.


### Status

`GET /status?paymentId={paymentId}`

This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId`.

#### Mapping
The status received by the provider will be mapped according to the following table:

| Provider Status          | Plugin Status |
|--------------------------|---------------|
| SETTLEMENT_CONFIRMED     | ACCEPTED      |
| SETTLED                  | ACCEPTED      |
| SUBMITTED_FOR_SETTLEMENT | ACCEPTED      |
| SETTLING                 | ACCEPTED      |
| SETTLEMENT_PENDING       | PENDING       |
| AUTHORIZING              | PENDING       |
| AUTHORIZED               | PENDING       |

Everything else will be mapped as FAILED.

### Check

`GET /check?paymentId={paymentId}`

This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId` and also send a notification to the external service as specified by `PAYMENT_CALLBACK_URL` environment variable.


### Callback

`POST /callback`

This endpoint should only be called by Braintree.


## Utility

### Customer Token

`GET /utility/customer/token`

BrainTree frontend SDKs often necessitate a customer token in order to perform operations such as showing the
billing agreement terms and conditions or the PayPal checkout page. This endpoint allows to retrieve the customer token
given the **required** query parameter `customer_id`.

The response contains the token and a boolean which informs whether the token is vaulted or not:
- if the customer isn't vaulted or his data has been revoked, a new, temporary token is generated and returned
- if the customer is vaulted, his token is returned

Example:
```json
{
  "client_token": "h89h8934g793ru9by3rbh939fb",
  "vaulted": true
}
```

### Payment Submit

`POST /utility/payment/submit`

When a new transaction is generated with the option `submitForSettlement` set to false, it needs to be submitted
for settlement later on, in order to allow braintree to capture money from the customer's account. This endpoint allows
to submit for settlement the transaction identified by the **required** query parameter `transaction_id`.

The response is a message description of the performed action result.

:::warning
The /submit POST call has been implemented, but it's never been tested in production.
:::

### Create Customer

`POST /utility/customer/create`

This endpoint allows to create a new customer on the provider systems.

The request body requires the following data:
- `customer_id`
- `nonce`

The response is a JSON object with the nullable field `client_token`.

Example:
```json
{
  "client_token": "h89h8934g793ru9by3rbh939fb"
}
```

### Delete Customer

`POST /utility/delete`

This endpoint allows to delete a customer on the provider systems.
This endpoint should only be called by Braintree, and accepts only webhook with type PAYMENT_METHOD_REVOKED_BY_CUSTOMER.

:::warning
This endpoint is deprecated and will not be maintained in next releases
:::


## Braintree Dashboard Configuration
Some configurations are needed on the provider dashboard in order to be able to manage automatic payments related to subscription:
1. create a new webhook to the **Payment Gateway Manager** `/v3/braintree/callback` endpoint
2. enable the following notifications:
   - Subscription Canceled
   - Subscription Charged Successfully
   - Subscription Unsuccessfully
   - Subscription Expired
   - Payment Method Revoked By Customer
