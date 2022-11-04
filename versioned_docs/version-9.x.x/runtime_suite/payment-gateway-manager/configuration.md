---
id: configuration
title: Configuration
sidebar_label: Configuration
---
The **Payment Gateway Manager (PGM)** needs some environment variables to work properly.

## Generic Environment Variables
* **LOG_LEVEL**
* **HTTP_LOG_LEVEL**: `basic`, `body`, `headers` or `none`; logs additional info about http requests
    made towards external systems, defaults to `none`
* **HTTP_PORT**
* **ENABLED_PROVIDERS** (required): comma separated list of payment providers enabled at runtime
* **PAYMENT_CALLBACK_URL** (required): URL used to notify other services about a payment transaction result
* **PGM_PUBLIC_URL** (required for satispay, scalapay and soisy): URL where this service is exposed 
(e.g. `http://my-domain/payment-gateway-manager`)

## GestPay (Axerve) Specific Environment Variables
* **GESTPAY_IS_SANDBOX** (required): can be "true" or "false". Specifies whether the PGM should point to Axerve Sandbox or Production environment.
* **GESTPAY_API_KEY** (required)
* **GESTPAY_SHOP_LOGIN** (required)

## Satispay Specific Environment Variables
* **SATISPAY_IS_SANDBOX** (required): can be "true" or "false". Specifies whether the PGM should point to Satispay Staging or Production environment.
* **SATISPAY_KEY_ID** (required)
* **SATISPAY_PRIVATE_KEY** (required): private key copied from the `.pem` file, must use single spaces instead of `\n`
* **SATISPAY_WAITING_SECONDS** (required): `x-satispay-response-wait-time` header described in Satispay's documentation, max value is 60
* **SATISPAY_AFTER_BUY_WEB_REDIRECT_URL** (required): URL to which the user will be redirected after completing a payment via web page. (Overridable via request body)
* **SATISPAY_AFTER_BUY_MOBILE_REDIRECT_URL** (required): url-scheme that will be used by iOS/Android to redirect the 
user after completing a payment via the Satispay mobile app


## Unicredit Specific Environment Variables
* **UNICREDIT_NUMERO_COMMERCIANTE** (required): merchant identification code.
* **UNICREDIT_PASSWORD** (required): password for accessing the payment system.
* **UNICREDIT_SECRET** (required): secret key used to encrypt communications with the payment gateway.
* **UNICREDIT_STABILIMENTO** (required): store identification code.
* **UNICREDIT_USER_ID** (required): username for accessing the payment system.
* **UNICREDIT_PAYMENT_URL** (required): address of the merchant to which the buyer will be directed.
* **UNICREDIT_AFTER_BUY_OK_REDIRECT_URL** (required): address to which the buyer will be directed at the end of a successful transaction. (Overridable via request body)
* **UNICREDIT_AFTER_BUY_KO_REDIRECT_URL** (required): address to which the buyer will be directed at the end of a failed transaction. (Overridable via request body)
* **UNICREDIT_USE_PRE_AUTHORIZATION** (required): "true" or "false" whether if you want to use pre-authorization for credit card payments or not.


## Braintree Specific Environment Variables
* **BRAINTREE_SUBMIT_FOR_SETTLEMENT** (required): flag that determines whether transactions are immediately submitted for settlement or not.
* **BRAINTREE_MERCHANT_ID** (required): string that identifies the used merchant id.
* **BRAINTREE_MERCHANT_ACCOUNT_ID** (required): string that identifies the used merchant account id.
* **BRAINTREE_PUBLIC_KEY** (required): Braintree API public key.
* **BRAINTREE_PRIVATE_KEY** (required): Braintree API private key.
* **BRAINTREE_IS_SANDBOX** (required): can be "true" or "false". Specifies whether the PGM should point to Braintree Sandbox or Production environment.


## Scalapay Specific Environment Variables
* **SCALAPAY_BASE_PATH** (required): Address to Scalapay base path. Scalapay has three different environments, integration, staging and production.
* **SCALAPAY_API_KEY** (required)
* **SCALAPAY_SUCCESS_REDIRECT_URL** (required): address to which the buyer will be directed at the end of a successful transaction. (Overridable via request body)
* **SCALAPAY_FAILURE_REDIRECT_URL** (required): address to which the buyer will be directed at the end of a failed transaction. (Overridable via request body)

## SafeCharge Specific Environment Variables
* **SAFECHARGE_MERCHANT_ID** (required): Merchant identification code.
* **SAFECHARGE_MERCHANT_SITE_ID** (required): Merchant site identification code.
* **SAFECHARGE_MERCHANT_SECRET_KEY** (required): Merchant secret for validating the communication.
* **SAFECHARGE_URL** (required): Base URL of the SafeCharge provider.

## Soisy Specific Environment Variables
* **SOISY_SHOP_ID** (required)
* **SOISY_PARTNER_KEY** (required): X-Auth-Token header for authentication on Soisy.
* **SOISY_BASE_URL** (required): Base URL of the Soisy provider.
