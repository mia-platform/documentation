---
id: adaptive_checkout
title: Adaptive Checkout
sidebar_label: Adaptive checkout
---
This service is capable of creating, modifying and deleting Adaptive Checkout rules. 
When a payment is created, these rules will be used to define which Payment Methods and Providers will be shown to the user.

## Data schema

The schema of an Adaptive Checkout Rule is the following:
```json lines
{
  priority: Int,
  ruleId: String,
  enabledMethods: [
    {
      paymentMethod: String,
      provider: String,
    },
    ...
  ],
  amount: {
    currency: String,
    min: Int,
    max: Int,
  },
  matchInValues: [
    {
      key: String,
      values: List<String>,
    },
    ...
  ],
}
```
where `priority` and `ruleId` are required and must be unique, the others are optional.

- `priority` defines in which order the rules must be evaluated, the first one matching is used.
- `ruleId` is a unique identifier; if it is equal to `default` and no rules match, it is used.
- `enabledMethods` defines which methods are to be shown to the user; `paymentMethod` must be a valid method for the associated provider and the `provider` must be enabled.
  
  At this moment the possible values are (paymentMethod &rarr; providers):
  - Credit Card &rarr; Axerve, Unicredit, Adyen, Stripe
  - Apple Pay &rarr; Axerve
  - Google Pay &rarr; Axerve
  - PayPal &rarr; Axerve, Braintree
  - SafeCharge &rarr; SafeCharge
  - Satispay &rarr; Axerve, Satispay
  - Scalapay &rarr; Scalapay
  - Soisy &rarr; Soisy
- `amount` defines the range between the payment amount must be to match the rule.
- `matchInValues` defines custom `key` which value must be in the `values` list.
  Supported `key` are:
  - Product Category
  - Channel
  - User Type

## Endpoints /adaptive-checkout

### Rule Details /rule-details

#### POST /add

Endpoint responsible to create a new Rule, the body accepted is an entire Adaptive Checkout Rule with one exception:
`matchInValues.values` is a String, multiple values must be separated by a comma without trailing spaces, then they are split and inserted in the DB as a list.

#### POST /update

Body data schema:
```json lines
{
  _id: String,
  priority: Int,
  ruleId: String,
}
```
where `_id` is the MongoDB identifier.

#### DELETE /delete/:id

The Path parameter `id` is the MongoDB identifier.

### Enabled Methods /payment-methods

#### POST /add

Body data schema:
```json lines
{
  id: String,
  paymentMethod: String,
  provider: String,
}
```
where `id` is the MongoDB identifier.

#### POST /update

Body data schema:
```json lines
{
  id: String,
  paymentMethod: String,
  provider: String,
  index: Int,
}
```
where `id` is the MongoDB identifier and `index` is the array index identifying the enabled methods to modify.

#### DELETE /delete

Body data schema:
```json lines
{
  id: String,
  paymentMethod: String,
  provider: String,
  index: Int,
}
```
where `id` is the MongoDB identifier and `index` is the array index identifying the enabled methods to delete.

### MatchInValues /custom-rules

Body data schema:
```json lines
{
  id: String,
  key: String,
  values: String,
}
```
where `id` is the MongoDB identifier

#### POST /add

`key` must not be already present in the rule. 

#### POST /update

`key` must not be already present in the rule. 

#### DELETE /delete

`key` must be present in the rule.

### Amount Rule /amount-rules

Body data schema:
```json lines
{
  id: String,
  currency: String,
  min: Int,
  max: Int,
}
```
where `id` is the MongoDB identifier.

#### POST /update

This endpoint is used to add or update the Amount in the Adaptive Checkout Rule.

#### DELETE /delete

This endpoint is used to delete an Adaptive Checkout Rule.
