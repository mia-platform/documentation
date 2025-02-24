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
* **PGM_PUBLIC_URL** (required): URL where this service is exposed 
(e.g. `http://my-domain/payment-gateway-manager`)
* **FLOW_MANAGER_URL**: url of the Flow Manager service. If set, Flow Manager related features are enabled
* **SAGA_CRUD_URL** (required if FLOW_MANAGER_URL is set): url of the saga CRUD collection
* **DYNAMIC_PAYMENT_METHOD_CONFIG_PATH**: path to config map defining available payment methods based on rules
* **EXTERNAL_PROVIDERS_CONFIG**: path to config map defining external services for payments
* **SUBSCRIPTION_HANDLER_URL**: url to the subscription handler service. Required to handle subscription payment within the Payment Integration Hub

The config map located at **DYNAMIC_PAYMENT_METHOD_CONFIG_PATH** must comply with the following schema
<details>
    <summary>Config schema</summary>

```json
{
  "type": "object",
  "required": ["default", "rules"],
  "properties": {
    "default": {
      "type": "object",
      "required": ["availableMethods"],
      "properties": {
        "availableMethods": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["paymentMethod", "provider"],
            "properties": {
              "paymentMethod": {
                "type": "string"
              },
              "provider": {
                "type": "string"
              }
            }
          }
        }
      }
    },
    "rules": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["ruleId", "matchInValues", "matchInRange", "paymentMethods"],
        "properties": {
          "ruleId": {
            "type": "string"
          },
          "matchInValues": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          },
          "matchInRange": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": {
                "type": "object",
                "required": ["minOrEqual", "max"],
                "properties": {
                  "minOrEqual": {
                    "type": "string"
                  },
                  "max": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "availableMethods": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["paymentMethod", "provider"],
              "properties": {
                "paymentMethod": {
                  "type": "string"
                },
                "provider": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

</details>


The config map located at **EXTERNAL_PROVIDERS_CONFIG** must comply with the following schema
<details>
    <summary>Config schema</summary>

```json
{
  "type": "object",
  "required": ["externalServices"],
  "properties": {
    "externalServices": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["externalService, baseUrl"],
        "properties": {
          "externalService": {
            "type": "string"
          },
          "baseUrl": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

</details>

## Provider Specific Environment Variables

### Axerve

* **AXERVE_IS_SANDBOX** (required): can be "true" or "false". Specifies whether the PGM should point to Axerve Sandbox or Production environment.
* **AXERVE_API_KEY** (required)
* **AXERVE_SHOP_LOGIN** (required)

### Satispay

* **SATISPAY_IS_SANDBOX** (required): can be "true" or "false". Specifies whether the PGM should point to Satispay Staging or Production environment.
* **SATISPAY_KEY_ID** (required)
* **SATISPAY_PRIVATE_KEY** (required): private key copied from the `.pem` file, must use single spaces instead of `\n`
* **SATISPAY_WAITING_SECONDS** (required): `x-satispay-response-wait-time` header described in Satispay's documentation, max value is 60
* **SATISPAY_AFTER_BUY_WEB_REDIRECT_URL** (required): URL to which the user will be redirected after completing a payment via web page. (Overridable via request body)
* **SATISPAY_AFTER_BUY_MOBILE_REDIRECT_URL** (required): url-scheme that will be used by iOS/Android to redirect the 
user after completing a payment via the Satispay mobile app
* **SATISPAY_CALLBACK_URL** (required): URL for transaction status verification of satispay

### Braintree

* **BRAINTREE_MERCHANT_ID** (required): string that identifies the used merchant id.
* **BRAINTREE_MERCHANT_ACCOUNT_ID** (required): string that identifies the used merchant account id.
* **BRAINTREE_PUBLIC_KEY** (required): Braintree API public key.
* **BRAINTREE_PRIVATE_KEY** (required): Braintree API private key.
* **BRAINTREE_IS_SANDBOX** (required): can be "true" or "false". Specifies whether the PGM should point to Braintree Sandbox or Production environment.

### Scalapay

* **SCALAPAY_BASE_PATH** (required): Address to Scalapay base path. Scalapay has three different environments, integration, staging and production.
* **SCALAPAY_API_KEY** (required)
* **SCALAPAY_SUCCESS_REDIRECT_URL** (required): address to which the buyer will be directed at the end of a successful transaction. (Overridable via request body)
* **SCALAPAY_FAILURE_REDIRECT_URL** (required): address to which the buyer will be directed at the end of a failed transaction. (Overridable via request body)

### Soisy

* **SOISY_SHOP_ID** (required)
* **SOISY_PARTNER_KEY** (required): X-Auth-Token header for authentication on Soisy.
* **SOISY_BASE_URL** (required): Base URL of the Soisy provider.

### Stripe

* **STRIPE_BASE_URL** (required): Base URL of the Stripe provider.
* **STRIPE_PRIVATE_KEY** (required): Stripe API private key.

### Adyen

* **ADYEN_IS_TEST** (required): can be "true" or "false". Specifies whether the PGM should point to Adyen Test or Live environment.
* **ADYEN_PRIVATE_KEY** (required): [API Key](https://docs.adyen.com/development-resources/api-credentials) header for authentication on Adyen.
* **ADYEN_LIVE_URL** (required conditionally): [Live URL prefix](https://docs.adyen.com/development-resources/api-credentials) for Adyen requests, used only in the Live environment. 
* **ADYEN_MERCHANT_ACCOUNT** (required): the Adyen merchant account to point to.
* **ADYEN_HMAC_KEY** (required): [HMAC signature](https://docs.adyen.com/development-resources/webhooks/verify-hmac-signatures) to verify the notification authenticity.

### External service

To enable an external service to process a payment the **EXTERNAL_PROVIDERS_CONFIG** variable must be set with its config map.
