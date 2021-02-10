---
id: configuration
title: Configuration
sidebar_label: Configuration
---
The **Payment Gateway Manager (PGM)** needs some environment variables to work properly.

## Generic Environment Variables
* **LOG_LEVEL**
* **HTTP_PORT**
* **ENABLED_PROVIDERS** (required): comma separated list of payment providers enabled at runtime
* **PAYMENT_CALLBACK_URL**: (required) URL used to notify other services about a payment transaction result

## GestPay (Axerve) Specific Environment Variables
* **GESTPAY_IS_SANDBOX** (required): can be "true" or "false". Specifies whether the PGM should point to Axerve Sandbox or Production environment.
* **GESTPAY_API_KEY** (required)
* **GESTPAY_SHOP_LOGIN** (required)
