---
id: braintree
title: Braintree
sidebar_label: Braintree
---
In this page you will find the required information to perform REST calls related to the Braintree payment provider.

## Supported payment methods

Currently, the only payment method supported by the Braintree provider is `pay-pal`.

## Endpoints

Every Braintree endpoint has this prefix path `/v3/braintree`

### POST - /{payment-method}/pay

This endpoint allows to execute payments via the Braintree payment provider.

The request body requires the `providerData` field which requires the following data:
- `customerId`: id of the customer. Vaulted payment uses this field to identify the customer, thus make sure to give
  the same id that you saved in the vault.
- `storeInVault`: boolean that specifies whether to store the customer inside the vault. Set it to `true` if performing
  Checkout + Vault.
- `vaulted`: boolean that specifies whether the customer is already vaulted or not.

The payment response can have the following result codes:
- **OK**: the payment was successfully submitted for settlement
- **KO**: the payment failed

For more information, please read BrainTree's [documentation](https://developer.paypal.com/braintree/docs/guides/paypal/overview),
paying particular attention to the Vault, Checkout and Checkout with Vault sections.

:::warning
Checkout + Vault is only supported on JS frontends; iOS and Android apps must perform Vaulting and Checkout separately.
:::

### POST - /refund

This endpoint allows to refund an already executed payment via the Braintree provider.

The request body does not require any provider-specific data.

The refund response can have the following result codes:
- **OK**: the refund was successful
- **KO**: the refund failed

### GET - /status

This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId`.

The response can have the following codes:
- **PENDING**
- **ACCEPTED**
- **FAILED**

### GET - /check

This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId` and also send a notification to the external service as specified by `PAYMENT_CALLBACK_URL` environment variable.

The response can have the following codes:
- **PENDING**
- **ACCEPTED**
- **FAILED**

## Utility

### GET - /token

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

### POST - /submit

When a new transaction is generated with the option `submitForSettlement` set to false, it needs to be submitted
for settlement later on, in order to allow braintree to capture money from the customer's account. This endpoint allows
to submit for settlement the transaction identified by the **required** query parameter `transaction_id`.

The response is a message description of the performed action result.

:::warning
The /submit POST call has been implemented, but it's never been tested in production.
:::

### POST - /customer

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

### POST - /delete

This endpoint is a webhook-ready API to be linked with a BrainTree account, under the API/Webhooks section of their
portal. It performs necessary cleanup work upon receiving _Payment Method Revoked By Customer_ notifications.

The response is a message description of the performed action result.
