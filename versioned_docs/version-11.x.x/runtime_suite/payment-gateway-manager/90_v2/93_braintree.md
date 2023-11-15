---
id: braintree
title: Braintree
sidebar_label: Braintree
---
## Starting a payment

BrainTree requires an additional object for the `/pay` request body, named `brainTreeDataRequest`:

```json lines
{
    "nonce": "7rh47h83789gt892347f", // optional
    "deviceData": "{...}", // optional 
    "customerId": "the_customer_id",
    "storeInVault": true,
    "vaulted": false
}
```

- _nonce_: token used by BrainTree APIs to authenticate various operations. Usually retrieved using frontend SDKs.
  Not needed if the user is making a vaulted payment, i.e. he has already been registered into BrainTree vault.
- _deviceData_: object generated with BrainTree frontend SDKs. This field is optional, but recommended in order to
  reduce decline rates. To collect your device data, follow [this guide](https://developer.paypal.com/braintree/docs/guides/premium-fraud-management-tools/client-side).
- _customerId_: id of the customer. Vaulted payment uses this field to identify the customer, thus make sure to give
  the same id that you saved in the vault.
- _storeInVault_: boolean that specifies whether to store the customer inside the vault. Set it to `true` if performing
  Checkout + Vault.
- _vaulted_: boolean that specifies whether the customer is already vaulted or not.

For more information, please read BrainTree's [documentation](https://developer.paypal.com/braintree/docs/guides/paypal/overview),
paying particular attention to the Vault, Checkout and Checkout with Vault sections.

:::warning 
Checkout + Vault is only supported on JS frontends; iOS and Android apps must perform Vaulting and Checkout separately. 
:::

## Using our utility APIs

This section describes some braintree specific endpoints that handle interactions with customers and tokens.

The utilities the PGM offers are:
- `GET /braintree/token?customer_id=someId`
- `POST /braintree/submit`
- `POST /braintree/delete`
- `POST /braintree/customer`

### Retrieving a customer token

BrainTree frontend SDKs often necessitate a customer token in order to perform operations such as showing the 
billing agreement terms and conditions or the PayPal checkout page. This token can be retrieved using the
`GET /braintree/token?customer_id=someId` endpoint.

The endpoint behaves differently whether the customer is vaulted or not:
- if the customer isn't vaulted or his data has been revoked, a new, temporary token is generated and returned
- if the customer is vaulted, his token is returned

The response body is:

```json
{
  "client_token": "h89h8934g793ru9by3rbh939fb",
  "vaulted": true
}
```

It gives access to the token and tells you if the customer is vaulted.

### Submitting a transaction for settlement

When a new transaction is generated with the option `submitForSettlement` set to false, it needs to be submitted 
for settlement later on, in order to allow braintree to capture money from the customer's account.
The `POST /braintree/submit` endpoint submits a transaction for settlement. The call has as parameter the id of the 
transaction that must be submitted for settlement.
The call returns a message that confirms the correct execution of the operation.

:::info
The /submit POST call has been implemented, but it's never been tested in production.
:::

### Retrieving a customer token

BrainTree frontend SDKs often necessitate a customer token in order to perform operations such as showing the 
billing agreement terms and conditions or the PayPal checkout page. This token can be retrieved using the
`GET /braintree/token?customer_id=someId` endpoint.

The endpoint behaves differently whether the customer is vaulted or not:
- if the customer isn't vaulted or his data has been revoked, a new, temporary token is generated and returned
- if the customer is vaulted, his token is returned

The response body is:

```json
{
  "client_token": "h89h8934g793ru9by3rbh939fb",
  "vaulted": true
}
```

### Payment Method Revocation Webhook

The `POST /braintree/delete` endpoint is a webhook-ready API to be linked with a BrainTree account, under the API/Webhooks
section of their portal. It performs necessary cleanup work upon receiving _Payment Method Revoked By Customer_ notifications.
