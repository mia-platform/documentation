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
* **PAYMENT_CALLBACK_URL** (required): URL used to notify other services about a payment transaction result
* **PGM_PUBLIC_URL** (required for satispay): URL where this service is exposed (e.g. `http://my-domain/payment-gateway-manager`)

## GestPay (Axerve) Specific Environment Variables
* **GESTPAY_IS_SANDBOX** (required): can be "true" or "false". Specifies whether the PGM should point to Axerve Sandbox or Production environment.
* **GESTPAY_API_KEY** (required)
* **GESTPAY_SHOP_LOGIN** (required)

## Satispay Specific Environment Variables
* **SATISPAY_IS_SANDBOX** (required): can be "true" or "false". Specifies whether the PGM should point to Satispay Staging or Production environment.
* **SATISPAY_KEY_ID** (required)
* **SATISPAY_PRIVATE_KEY** (required): private key copied from the `.pem` file, must use single spaces instead of `\n`
* **SATISPAY_WAITING_SECONDS** (required): `x-satispay-response-wait-time` header described in Satispay's documentation, max value is 60
* **SATISPAY_AFTER_BUY_WEB_REDIRECT_URL** (required): URL to which the user will be redirected after completing a payment via web page
* **SATISPAY_AFTER_BUY_MOBILE_REDIRECT_URL** (required): url-scheme that will be used by iOS/Android to redirect the 
user after completing a payment via the Satispay mobile app


## Unicredit Specific Environment Variables
* **UNICREDIT_NUMERO_COMMERCIANTE** (required): Merchant identification code.
* **UNICREDIT_PASSWORD** (required): Password for accessing the payment system.
* **UNICREDIT_SECRET** (required): Secret key used to encrypt communications with the payment gateway.
* **UNICREDIT_STABILIMENTO** (required): Store identification code.
* **UNICREDIT_USER_ID** (required): User name for accessing the payment system.
* **UNICREDIT_PAYMENT_URL** (required): Address of the merchant to which the buyer will be directed.
* **UNICREDIT_AFTER_BUY_OK_REDIRECT_URL** (required): Address to which the buyer will be directed at the end of a successful transaction.
* **UNICREDIT_AFTER_BUY_KO_REDIRECT_URL** (required): Address to which the buyer will be directed at the end of a failed transaction.
* **UNICREDIT_USE_PRE_AUTHORIZATION** (required): "true" or "false" whether if you want to use pre-authorization for credit card payments or not.
