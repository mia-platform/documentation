---
id: migration_guide_v3
title: Migration Guide v3
sidebar_label: Migration guide v3
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

In this page you will find the required information to easily migrate from Payment Gateway Manager v2 to v3.

## APIs

### Standardization

In v3 APIs have been standardized cross-provider, thus you will always find:
- `/v3/.../{paymentMethod}/pay`
- `/v3/.../refund`
- `/v3/.../status`
- `/v3/.../check`
- `/v3/.../{paymentMethod}/subscription/schedule`
- `/v3/.../{paymentMethod}/subscription/start`
- `/v3/.../{paymentMethod}/subscription/pay`
- `/v3/.../subscription/update/{subscriptionToken}`
- `/v3/.../subscription/expire/{subscriptionToken}`

These APIs share common body structures and query parameters as described [here](how_it_works).
In case of provider-specific data, it can be put in the `providerData` body field. 
Each provider has a dedicated documentation page where you can read more about it.

For those providers requiring more features, additional APIs are provided: they are documented in the provider's dedicated page.

### Naming Conventions

- Provider "gestpay" has been changed to "axerve".
- Every case permutation of `paymentId`, `paymentID`... has been changed to `paymentId`.
- Every case permutation of `shopTransactionId`, `shopTransactionID`... has been changed to `shopTransactionId`.

### Amount Format

Price amounts are represented as integer numbers, which represent the smallest related currency unit. 
For example:
- 12,99€ will be represented as `1299`;
- 0,10€ will be represented as `10`;

## Configuration

Few changes has been made on environment variables as well:
- Gestpay related variables have been renamed
  - `GESTPAY_IS_SANDBOX` &rarr; `AXERVE_IS_SANDBOX`
  - `GESTPAY_API_KEY` &rarr; `AXERVE_API_KEY`
  - `GESTPAY_SHOP_LOGIN` &rarr; `AXERVE_SHOP_LOGIN`
- Satispay's callback URL is no longer built starting from `PGM_PUBLIC_URL` variable, but from the new `SATISPAY_CALLBACK_URL` variable.
- Dynamic Payment Method feature has been replaced by Adaptive Checkout, which implies the following variable changes
  - Removed `DYNAMIC_PAYMENT_METHOD_CONFIG_PATH`
  - Added `ADAPTIVE_CHECKOUT_CRUD_URL`
  - Added `ADAPTIVE_CHECKOUT_CACHE_EXPIRE_MIN`
