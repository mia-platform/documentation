---
id: configuration
title: Configuration
sidebar_label: Configuration
---
In order to properly add this application in your project you have to complete its configuration as described in the following sections.

## Payment Gateway Manager

In order to complete the configuration of the `Payment Gateway Manager` you have to:
1. set the `ENABLED_PROVIDERS` environment variable
2. add the **required environment variables** depending on the chosen payment provider
3. on `Public Variables` section set the **PROJECT_HOST** variable as host of the current project

For further details on refer to the service's [configuration documentation](../../runtime_suite/payment-gateway-manager/configuration).

:::warning
Put a valid URL in the *PAYMENT_CALLBACK_URL* environment variable.
:::

## Payment Front End

In order to complete the configuration of the `Payment Front End` you have to set the following environment variables:
- `CSP_HEADER`: list of content security policy to include
- `PROJECT_HOST`: host of the current project, as Public variable

Based on the payments method or provider enabled you have to set specific variables:

- Axerve
  - `VITE_AXERVE_API_KEY`
  - `VITE_AXERVE_SHOPLOGIN`
- Adyen
  - `VITE_ADYEN_KEY`
- Braintree
  - `VITE_BRAINTREE_KEY`
- Google Pay
  - `VITE_GOOGLE_MERCHANT_ID`
  - `VITE_GOOGLE_MERCHANT_NAME`
- Apple Pay
  - add the right certificate on `/usr/static/.well-known/apple-developer-merchantid-domain-association.txt`. More info on the [official documentation](https://developer.apple.com/help/account/configure-app-capabilities/configure-apple-pay-on-the-web#register-a-merchant-domain).

Further personalization is available modifying its ConfigMap, that has the schema below:
```json lines
{
  "primaryColor": "color used for primary element",
  "backgroundColor": "color used for background",
  "bodyColor": "color used for the pages' body",
  "fontColor": "color used for the fonts",
  "logo": "path to the logo image",
  "favicon": "path to the favicon image",
  "title": "title of the website",
  // path of the Frontend pages
  "pages": {
    "home": "/payment/checkout",
    "checkout": "/payment/checkout",
    "subscription": "/payment/subscription",
    "buyer": "/payment/buyer",
    "pay": "/payment/pay",
    "result": "/payment/result",
    "error": "/payment/error",
    "pending": "/payment/pending"
  },
  // endpoint that Frontend should call to perform actions
  "endpoint": {
    "pay": "/pgm-bff/pay",
    "paySubscription": "/pgm-bff/pay-recurrent",
    "payPolling": "/pgm-bff/pay-polling",
    "payByLink": "/pgm-bff/pay-by-link",
    "downloadInvoice": "/pgm-bff/invoice-download",
    "checkout": "/fm/saga",
    "checkoutSubscription": "/pgm-bff/create",
    "paymentDetail": "/pgm-bff/payment-info",
    "paymentMethods": "/pgm-bff/payment-methods",
    "axerveCreditToken": "https://sandbox.gestpay.net/api/v1/shop/token",
    "applePaySession": "/pgm-bff/apple-pay-session",
    "paymentTokenization": "/pgm-bff/tokenization"
  },
  "googlepay": {
    "environment": "TEST or PRODUCTION",
    "countryCode": "ISO 3166-1 alpha-2 country code for the country where the transaction will be completed/processed"
  },
  "applePay": {
    "merchantIdentifier": "unique identify for the merchant",
    "domain": "URL where the project is hosted",
    "displayName": "name to display to the user"
  },
  "pollingInterval": "interval in ms between two calls during polling"
}
```

## Backend for Frontend

In order to complete the configuration of the `Back End for Front End` you have to set the following environment variables:
- `PAYMENT_OK_REDIRECT_URL`: url to which to redirect the user following a successfully completed payment
- `PAYMENT_KO_REDIRECT_URL`: url to which to redirect the user following a failed payment
- `PAYMENT_PENDING_REDIRECT_URL`: url to which to redirect the user following a pending payment
- `FLOW_MANAGER_URL`: flow manager service url
- `PGM_URL`: payment gateway manager url
- `INVOICE_SERVICE_URL`: invoice service url
- `FILES_SERVICE_URL`: file service url
- `SAGA_CRUD_URL`: saga collection url
- `INVOICE_CRUD_URL`: invoice collection url
- `SUBSCRIPTION_HANDLER_SERVICE`: subscription handler url
- `PAY_BY_LINK_PROVIDER`: enabled provider for `PAY_BY_LINK` payments
- `USERS_CRUD_URL`: users collection url
- `APPLEPAY_CERTIFICATE_PASSWORD`
- `APPLEPAY_CERTIFICATE_FILE`: read the official [documentation](https://developer.apple.com/documentation/apple_pay_on_the_web/configuring_your_environment) to learn how to create it

## Frullino

This service periodically retrieves payments from crud,
checks the actual status through the provider and updates the payment state accordingly (failed or executed).

The following environment variables are customizable:
- `PGM_URL`: payment gateway manager url
- `FLOW_MANAGER_URL`: flow manager service url
- `CRUD_SERVICE_URL`: crud service collection url. In order to perform custom query (e.g. if payment is in a specific state or if it is made with a subset of providers), you have to define a MongoDB View
- `REDIS_HOST`: Redis installation URL
- `THREAD_NUMBER`: the number of payments the service can check in parallel
- `FRULLINO_RUNNING_INTERVAL_CRON`: how often the service performs the check

## Others

For further configuration of the microservices you can refer to the dedicated documentation:
- [Invoice-Service](../../runtime_suite/invoice-service/overview)
- [Flow-Manager-Service](../../runtime_suite/flow-manager-service/overview)
- [Files-Service](../../runtime_suite/files-service/configuration)
- [Messaging Service](../../runtime_suite/messaging-service/overview): use version 1.5.0 or above
- [SMTP Mail Notification Service](../../runtime_suite/ses-mail-notification-service/usage)
- [Data-Visualization](../../business_suite/data-visualization)
- [Analytics](../../runtime_suite/mongodb-reader/configuration)

## View

The user could perform the additional steps reported below in order to create MongoDB views that enable to exploit the ready to use [backoffice pages related to payments](./40_backoffice_payment.md).
1. Setup aggregation of `transactions_saga_view` as follows.
  - create a new aggregation view on MongoDB Views section called `transactions_saga_view`
  - choose `transactions_saga` as starting collection
  - create `transactions_saga_view` schema as the schema below
  - paste the following pipeline and fields
    <details>
      <summary>Pipeline</summary>

    ```json
    [
    {
      "$match": {
        "__STATE__": "PUBLIC"
      }
    },
    {
      "$lookup": {
        "from": "fm_subscriptions",
        "localField": "metadata.subscriptionId",
        "foreignField": "sagaId",
        "as": "subscriptions"
      }
    },
    {
      "$project": {
        "__STATE__": "$__STATE__",
        "createdAt": "$createdAt",
        "updatedAt": "$updatedAt",
        "creatorId": "$creatorId",
        "updaterId": "$updaterId",
        "sagaId": "$sagaId",
        "amount": "$metadata.amount",
        "currency": "$metadata.currency",
        "paymentMethodId": "$metadata.paymentMethod",
        "paymentMethod": {
          "$switch": {
            "branches": [
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "applepay"
                  ]
                },
                "then": "Apple Pay"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "credit-cards"
                  ]
                },
                "then": "Credit Card"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "googlepay"
                  ]
                },
                "then": "Google Pay"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "pay-pal"
                  ]
                },
                "then": "PayPal"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "safecharge"
                  ]
                },
                "then": "SafeCharge"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "satispay"
                  ]
                },
                "then": "Satispay"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "scalapay"
                  ]
                },
                "then": "Scalapay"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "soisy"
                  ]
                },
                "then": "Soisy"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "stripe"
                  ]
                },
                "then": "Stripe"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "external"
                  ]
                },
                "then": {
                  "$concat": [
                    "External - ",
                    "$metadata.provider"
                  ]
                }
              }
            ],
            "default": "$metadata.paymentMethod"
          }
        },
        "providerId": "$metadata.provider",
        "provider": {
          "$switch": {
            "branches": [
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "braintree"
                  ]
                },
                "then": "Braintree"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "axerve"
                  ]
                },
                "then": "Axerve"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "safecharge"
                  ]
                },
                "then": "SafeCharge"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "satispay"
                  ]
                },
                "then": "Satispay"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "scalapay"
                  ]
                },
                "then": "Scalapay"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "soisy"
                  ]
                },
                "then": "Soisy"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "unicredit"
                  ]
                },
                "then": "Unicredit"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "stripe"
                  ]
                },
                "then": "Stripe"
              }
            ],
            "default": "$metadata.provider"
          }
        },
        "currentStatus": {
          "$switch": {
            "branches": [
              {
                "case": {
                  "$eq": [
                    "$businessStateDescription",
                    "PAYMENT_PAID"
                  ]
                },
                "then": "Paid"
              },
              {
                "case": {
                  "$eq": [
                    "$businessStateDescription",
                    "PAYMENT_CREATED"
                  ]
                },
                "then": "Created"
              },
              {
                "case": {
                  "$eq": [
                    "$businessStateDescription",
                    "PAYMENT_TOTALLY_REFUNDED"
                  ]
                },
                "then": "Totally Refunded"
              },
              {
                "case": {
                  "$eq": [
                    "$businessStateDescription",
                    "PAYMENT_PARTIALLY_REFUNDED"
                  ]
                },
                "then": "Partially Refunded"
              },
              {
                "case": {
                  "$eq": [
                    "$businessStateDescription",
                    "PAYMENT_FAILED"
                  ]
                },
                "then": "Failed"
              }
            ],
            "default": "$businessStateDescription"
          }
        },
        "buyerName": "$metadata.additionalData.buyer.name",
        "buyerEmail": "$metadata.additionalData.buyer.email",
        "channel": "$metadata.additionalData.channel",
        "date": "$createdAt",
        "history": {
          "$reverseArray": {
            "$function": {
              "body": "function(history, refundedAmounts) {  externalIndex = 0;  return history.events.map((event, index) => {    let refundedAmount = undefined;    if (event.event === 'partialRefundExecuted' || event.event === 'totalRefundExecuted') {      if (refundedAmounts !== null && externalIndex < refundedAmounts.length) {        refundedAmount = refundedAmounts[externalIndex];        externalIndex++;      } else {        refundedAmount = null;      }    }    let status;    switch (history.states[index].businessStateDescription) {      case 'PAYMENT_CREATED':        status = 'Created';        break;      case 'PAYMENT_PAID':        status = 'Paid';        break;      case 'PAYMENT_PARTIALLY_REFUNDED':        status = 'Partially Refunded';        break;      case 'PAYMENT_TOTALLY_REFUNDED':        status = 'Totally Refunded';        break;      case 'PAYMENT_FAILED':        status = 'Failed';        break;      default:        status = history.states[index].businessStateDescription;    }    let eventName;    switch (event.event) {      case 'paymentCreated':        eventName = 'Payment created';        break;      case 'scheduleRequested':        eventName = 'Payment schedule requested';        break;      case 'paymentRedirected':        eventName = 'Payment redirected';        break;      case 'redirectionCompleted':        eventName = 'Redirection completed';        break;      case 'paymentScheduled':        eventName = 'Payment scheduled';        break;      case 'confirmRequested':        eventName = 'Payment confirmation requested';        break;      case 'confirmReceived':        eventName = 'Payment confirmation received';        break;      case 'paymentScheduleFailed':        eventName = 'Payment schedule failed';        break;      case 'redirectionFailed':        eventName = 'Payment redirection failed';        break;      case 'paymentExecutionFailed':        eventName = 'Payment failed';        break;      case 'paymentExecutionFailedFrullino':        eventName = 'Payment failed by the system';        break;      case 'paymentConfirmFailed':        eventName = 'Payment confirmation failed';        break;      case 'emailNotificationSent':        eventName = 'Email notification sent';        break;      case 'emailNotificationFailed':        eventName = 'Email notification failed';        break;      case 'emailNotificationRequested':        eventName = 'Email notification requested';        break;      case 'paymentExecuted':        eventName = 'Payment executed';        break;      case 'paymentExecutedFrullino':        eventName = 'Payment executed by the system';        break;      case 'refundRequested':        eventName = 'Refund requested';        break;      case 'refundFailed':        eventName = 'Refund failed';        break;      case 'partialRefundExecuted':        eventName = 'Partial refund executed';        break;      case 'totalRefundExecuted':        eventName = 'Total refund executed';        break;      case 'invoiceGenerated':        eventName = 'Invoice generated';        break;      case 'invoiceGenerationFailed':        eventName = 'Invoice generation failed';        break;      default:        eventName = event.event;    }    return {      date: event.timestamp,      event: eventName,      status,      refundedAmount    };  });}",
              "args": [
                "$history",
                "$metadata.refundDetails.refundedAmounts"
              ],
              "lang": "js"
            }
          }
        },
        "shopTransactionId": "$metadata.shopTransactionId",
        "paymentID": "$metadata.paymentID",
        "totalRefundedAmount": {
          "$ifNull": [
            "$metadata.refundDetails.totalRefundedAmount",
            "0"
          ]
        },
        "remainingAmount": {
          "$subtract": [
            "$metadata.amount",
            {
              "$ifNull": [
                "$metadata.refundDetails.totalRefundedAmount",
                0
              ]
            }
          ]
        },
        "type": "$metadata.type",
        "subscriptionId": {
          "$first": "$subscriptions"
        }
      }
    },
    {
      "$set": {
        "subscriptionId": "$subscriptionId._id",
        "amount": {
          "$divide": [
            {
              "$toDouble": "$amount"
            },
            100
          ]
        },
        "totalRefundedAmount": {
          "$divide": [
            {
              "$toDouble": "$totalRefundedAmount"
            },
            100
          ]
        },
        "remainingAmount": {
          "$divide": [
            {
              "$toDouble": "$remainingAmount"
            },
            100
          ]
        },
        "history": {
          "$map": {
            "input": "$history",
            "in": {
              "date": "$$this.date",
              "event": "$$this.event",
              "status": "$$this.status",
              "refundedAmount": {
                "$divide": [
                  {
                    "$toDouble": "$$this.refundedAmount"
                  },
                  100
                ]
              }
            }
          }
        }
      }
    }
  ]
    ```
    </details>

    <details>
      <summary>Fields</summary>

    ```json
    [
      {
        "name": "_id",
        "description": "_id",
        "type": "ObjectId",
        "required": true,
        "nullable": false
      },
      {
        "name": "creatorId",
        "description": "creatorId",
        "type": "string",
        "required": true,
        "nullable": false
      },
      {
        "name": "createdAt",
        "description": "createdAt",
        "type": "Date",
        "required": true,
        "nullable": false
      },
      {
        "name": "updaterId",
        "description": "updaterId",
        "type": "string",
        "required": true,
        "nullable": false
      },
      {
        "name": "updatedAt",
        "description": "updatedAt",
        "type": "Date",
        "required": true,
        "nullable": false
      },
      {
        "name": "__STATE__",
        "description": "__STATE__",
        "type": "string",
        "required": true,
        "nullable": false
      },
      {
        "name": "amount",
        "type": "number",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "paymentMethodId",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "paymentMethod",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "providerId",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "provider",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "currentStatus",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "buyerName",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "buyerEmail",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "channel",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "date",
        "type": "Date",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "history",
        "type": "Array_RawObject",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "shopTransactionID",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "paymentID",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "sagaId",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "totalRefundedAmount",
        "type": "number",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "remainingAmount",
        "type": "number",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "currency",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "shopTransactionId",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "subscriptionId",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      },
      {
        "name": "type",
        "type": "string",
        "required": false,
        "nullable": false,
        "sensitivityValue": 0
      }
    ]
    ```
    </details>

2. Create endpoint for the MongoDB view previously created `transactions_saga_view`
  - Create a new endpoint on the endpoint section `/transactions-saga-view`
  - Choose MongoDB view as type
  - Choose MongoDB view base path as `/transactions-saga-view`

3. Setup aggregation of `subscriptions_saga_view` as follows.
  - create a new aggregation view on MongoDB Views section called `subscriptions_saga_view`
  - choose `subscriptions_saga` as starting collection
  - create `subscriptions_saga_view` schema as the schema below
  - paste the following pipeline and fields
  <details>
      <summary>Pipeline</summary>

    ```json
    [
    {
      "$match": {
        "__STATE__": "PUBLIC"
      }
    },
    {
      "$lookup": {
        "from": "fm_transactions",
        "localField": "metadata.transactions",
        "foreignField": "sagaId",
        "as": "transactionsData"
      }
    },
    {
      "$project": {
        "__STATE__": "$__STATE__",
        "createdAt": "$createdAt",
        "updatedAt": "$updatedAt",
        "creatorId": "$creatorId",
        "updaterId": "$updaterId",
        "sagaId": "$sagaId",
        "amount": "$metadata.amount",
        "currency": "$metadata.currency",
        "providerId": "$metadata.provider",
        "paymentMethod": {
          "$switch": {
            "branches": [
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "applepay"
                  ]
                },
                "then": "Apple Pay"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "credit-cards"
                  ]
                },
                "then": "Credit Card"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "googlepay"
                  ]
                },
                "then": "Google Pay"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "pay-pal"
                  ]
                },
                "then": "PayPal"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "safecharge"
                  ]
                },
                "then": "SafeCharge"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "satispay"
                  ]
                },
                "then": "Satispay"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "scalapay"
                  ]
                },
                "then": "Scalapay"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "soisy"
                  ]
                },
                "then": "Soisy"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "stripe"
                  ]
                },
                "then": "Stripe"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.paymentMethod",
                    "external"
                  ]
                },
                "then": {
                  "$concat": [
                    "External - ",
                    "$metadata.provider"
                  ]
                }
              }
            ],
            "default": "$metadata.paymentMethod"
          }
        },
        "provider": {
          "$switch": {
            "branches": [
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "braintree"
                  ]
                },
                "then": "Braintree"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "axerve"
                  ]
                },
                "then": "Axerve"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "safecharge"
                  ]
                },
                "then": "SafeCharge"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "satispay"
                  ]
                },
                "then": "Satispay"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "scalapay"
                  ]
                },
                "then": "Scalapay"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "soisy"
                  ]
                },
                "then": "Soisy"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "unicredit"
                  ]
                },
                "then": "Unicredit"
              },
              {
                "case": {
                  "$eq": [
                    "$metadata.provider",
                    "stripe"
                  ]
                },
                "then": "Stripe"
              }
            ],
            "default": "$metadata.provider"
          }
        },
        "status": {
          "$switch": {
            "branches": [
              {
                "case": {
                  "$eq": [
                    "$businessStateDescription",
                    "CREATED"
                  ]
                },
                "then": "created"
              },
              {
                "case": {
                  "$eq": [
                    "$businessStateDescription",
                    "ACTIVE"
                  ]
                },
                "then": "active"
              },
              {
                "case": {
                  "$eq": [
                    "$businessStateDescription",
                    "EXPIRED"
                  ]
                },
                "then": "not active"
              },
              {
                "case": {
                  "$eq": [
                    "$businessStateDescription",
                    "ABORTED"
                  ]
                },
                "then": "not active"
              }
            ],
            "default": "$businessStateDescription"
          }
        },
        "shopSubscriptionId": "$metadata.shopSubscriptionId",
        "interval": "$metadata.interval",
        "intervalCount": "$metadata.intervalCount",
        "nextPaymentDate": "$metadata.nextPaymentDate",
        "expirationDate": "$metadata.expirationDate",
        "additionalData": "$metadata.additionalData",
        "transactions": "$transactionsData",
        "expireRequested": "$metadata.expireRequested"
      }
    },
    {
      "$set": {
        "amount": {
          "$divide": [
            {
              "$toDouble": "$amount"
            },
            100
          ]
        },
        "transactions": {
          "$map": {
            "input": "$transactions",
            "in": {
              "date": "$$this.createdAt",
              "_id": "$$this._id",
              "shopTransactionId": "$$this.metadata.shopTransactionId",
              "amount": {
                "$divide": [
                  {
                    "$toDouble": "$$this.metadata.amount"
                  },
                  100
                ]
              },
              "status": {
                "$switch": {
                  "branches": [
                    {
                      "case": {
                        "$eq": [
                          "$$this.businessStateDescription",
                          "PAYMENT_PAID"
                        ]
                      },
                      "then": "Paid"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$this.businessStateDescription",
                          "PAYMENT_CREATED"
                        ]
                      },
                      "then": "Created"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$this.businessStateDescription",
                          "PAYMENT_TOTALLY_REFUNDED"
                        ]
                      },
                      "then": "Totally Refunded"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$this.businessStateDescription",
                          "PAYMENT_PARTIALLY_REFUNDED"
                        ]
                      },
                      "then": "Partially Refunded"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$this.businessStateDescription",
                          "PAYMENT_FAILED"
                        ]
                      },
                      "then": "Failed"
                    }
                  ],
                  "default": "$businessStateDescription"
                }
              }
            }
          }
        }
      }
    }
  ]
    ```
    </details>

    <details>
      <summary>Fields</summary>

    ```json
    [
    {
        "name":"_id",
        "description":"_id",
        "type":"ObjectId",
        "required":true,
        "nullable":false
    },
    {
        "name":"creatorId",
        "description":"creatorId",
        "type":"string",
        "required":true,
        "nullable":false
    },
    {
        "name":"createdAt",
        "description":"createdAt",
        "type":"Date",
        "required":true,
        "nullable":false
    },
    {
        "name":"updaterId",
        "description":"updaterId",
        "type":"string",
        "required":true,
        "nullable":false
    },
    {
        "name":"updatedAt",
        "description":"updatedAt",
        "type":"Date",
        "required":true,
        "nullable":false
    },
    {
        "name":"__STATE__",
        "description":"__STATE__",
        "type":"string",
        "required":true,
        "nullable":false
    },
    {
        "name":"shopSubscriptionId",
        "type":"string",
        "required":false,
        "nullable":false,
        "sensitivityValue":0
    },
    {
        "name":"transactions",
        "type":"Array_RawObject",
        "required":false,
        "nullable":false,
        "sensitivityValue":0,
        "schema":{
          "properties":{
              "transactionId":{
                "type":"string"
              },
              "date":{
                "type":"string"
              },
              "status":{
                "type":"string"
              }
          }
        }
    },
    {
        "name":"amount",
        "type":"number",
        "required":false,
        "nullable":false,
        "sensitivityValue":0
    },
    {
        "name":"currency",
        "type":"string",
        "required":false,
        "nullable":false,
        "sensitivityValue":0
    },
    {
        "name":"interval",
        "type":"string",
        "required":false,
        "nullable":false,
        "sensitivityValue":0
    },
    {
        "name":"intervalCount",
        "type":"number",
        "required":false,
        "nullable":false,
        "sensitivityValue":0
    },
    {
        "name":"nextPaymentDate",
        "type":"Date",
        "required":false,
        "nullable":false,
        "sensitivityValue":0
    },
    {
        "name":"status",
        "type":"string",
        "required":false,
        "nullable":false,
        "sensitivityValue":0
    },
    {
        "name":"provider",
        "type":"string",
        "required":false,
        "nullable":false,
        "sensitivityValue":0
    },
    {
        "name":"paymentMethod",
        "type":"string",
        "required":false,
        "nullable":false,
        "sensitivityValue":0
    },
    {
        "name":"sagaId",
        "type":"string",
        "required":false,
        "nullable":false,
        "sensitivityValue":0
    },
    {
        "name":"expirationDate",
        "type":"Date",
        "required":false,
        "nullable":false,
        "sensitivityValue":0
    },
    {
        "name":"providerId",
        "type":"string",
        "required":false,
        "nullable":false,
        "sensitivityValue":0
    },
    {
        "name":"expireRequested",
        "type":"boolean",
        "required":false,
        "nullable":true,
        "sensitivityValue":0
    }
  ]
    ```
    </details>

4. Create endpoint for the MongoDB view previously created `subscriptions_saga_view`
  - Create a new endpoint on the endpoint section `/subscriptions-saga-view`
  - Choose MongoDB view as type
  - Choose MongoDB view base path as `/subscriptions-saga-view`

5. Setup aggregation of `adaptive_checkout_view` as follows.
  - create a new aggregation view on MongoDB Views section called `adaptive_checkout_view`
  - choose `adaptive_checkout` as starting collection
  - create `adaptive_checkout_view` schema as the schema below
  - paste the following pipeline and fields
  <details>
      <summary>Pipeline</summary>

    ```json
    [
    {
      "$match": {
        "__STATE__": "PUBLIC"
      }
    },
    {
      "$project": {
        "__STATE__": "$__STATE__",
        "createdAt": "$createdAt",
        "updatedAt": "$updatedAt",
        "creatorId": "$creatorId",
        "updaterId": "$updaterId",
        "priority": "$priority",
        "ruleId": "$ruleId",
        "amount": "$amount",
        "enabledMethods": {
          "$map": {
            "input": "$enabledMethods",
            "as": "m",
            "in": {
              "paymentMethod": {
                "$switch": {
                  "branches": [
                    {
                      "case": {
                        "$eq": [
                          "$$m.paymentMethod",
                          "applepay"
                        ]
                      },
                      "then": "Apple Pay"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.paymentMethod",
                          "credit-cards"
                        ]
                      },
                      "then": "Credit Card"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.paymentMethod",
                          "googlepay"
                        ]
                      },
                      "then": "Google Pay"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.paymentMethod",
                          "pay-pal"
                        ]
                      },
                      "then": "PayPal"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.paymentMethod",
                          "safecharge"
                        ]
                      },
                      "then": "SafeCharge"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.paymentMethod",
                          "satispay"
                        ]
                      },
                      "then": "Satispay"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.paymentMethod",
                          "scalapay"
                        ]
                      },
                      "then": "Scalapay"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.paymentMethod",
                          "soisy"
                        ]
                      },
                      "then": "Soisy"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.paymentMethod",
                          "stripe"
                        ]
                      },
                      "then": "Stripe"
                    }
                  ],
                  "default": "$$m.paymentMethod"
                }
              },
              "provider": {
                "$switch": {
                  "branches": [
                    {
                      "case": {
                        "$eq": [
                          "$$m.provider",
                          "adyen"
                        ]
                      },
                      "then": "Adyen"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.provider",
                          "braintree"
                        ]
                      },
                      "then": "Braintree"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.provider",
                          "axerve"
                        ]
                      },
                      "then": "Axerve"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.provider",
                          "safecharge"
                        ]
                      },
                      "then": "SafeCharge"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.provider",
                          "satispay"
                        ]
                      },
                      "then": "Satispay"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.provider",
                          "scalapay"
                        ]
                      },
                      "then": "Scalapay"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.provider",
                          "soisy"
                        ]
                      },
                      "then": "Soisy"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.provider",
                          "unicredit"
                        ]
                      },
                      "then": "Unicredit"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$m.provider",
                          "stripe"
                        ]
                      },
                      "then": "Stripe"
                    }
                  ],
                  "default": "$$m.provider"
                }
              },
              "index": {
                "$indexOfArray": [
                  "$enabledMethods",
                  "$$m"
                ]
              }
            }
          }
        },
        "matchInValues": {
          "$map": {
            "input": "$matchInValues",
            "as": "miv",
            "in": {
              "key": {
                "$switch": {
                  "branches": [
                    {
                      "case": {
                        "$eq": [
                          "$$miv.key",
                          "metadata.additionalData.productsCategory"
                        ]
                      },
                      "then": "Product Category"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$miv.key",
                          "metadata.additionalData.channel"
                        ]
                      },
                      "then": "Channel"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$miv.key",
                          "metadata.buyer.type"
                        ]
                      },
                      "then": "User Type"
                    }
                  ],
                  "default": "$$miv.key"
                }
              },
              "values": {
                "$reduce": {
                  "input": "$$miv.values",
                  "initialValue": "",
                  "in": {
                    "$cond": {
                      "if": {
                        "$eq": [
                          "$$value",
                          ""
                        ]
                      },
                      "then": {
                        "$concat": [
                          "$$value",
                          "$$this"
                        ]
                      },
                      "else": {
                        "$concat": [
                          "$$value",
                          ",",
                          "$$this"
                        ]
                      }
                    }
                  }
                }
              },
              "index": {
                "$indexOfArray": [
                  "$matchInValues",
                  "$$miv"
                ]
              }
            }
          }
        }
      }
    },
    {
      "$set": {
        "amount": {
          "min": {
            "$divide": [
              {
                "$toDouble": "$amount.min"
              },
              100
            ]
          },
          "max": {
            "$divide": [
              {
                "$toDouble": "$amount.max"
              },
              100
            ]
          }
        }
      }
    }
  ]
    ```
    </details>

    <details>
      <summary>Fields</summary>

    ```json
    [
    {
        "name":"_id",
        "description":"_id",
        "type":"ObjectId",
        "required":true,
        "nullable":false
    },
    {
        "name":"creatorId",
        "description":"creatorId",
        "type":"string",
        "required":true,
        "nullable":false
    },
    {
        "name":"createdAt",
        "description":"createdAt",
        "type":"Date",
        "required":true,
        "nullable":false
    },
    {
        "name":"updaterId",
        "description":"updaterId",
        "type":"string",
        "required":true,
        "nullable":false
    },
    {
        "name":"updatedAt",
        "description":"updatedAt",
        "type":"Date",
        "required":true,
        "nullable":false
    },
    {
        "name":"__STATE__",
        "description":"__STATE__",
        "type":"string",
        "required":true,
        "nullable":false
    },
    {
        "name":"priority",
        "type":"number",
        "required":true,
        "nullable":false,
        "sensitivityValue":0
    },
    {
        "name":"amount",
        "type":"RawObject",
        "required":false,
        "nullable":true,
        "sensitivityValue":0
    },
    {
        "name":"enabledMethods",
        "type":"Array_RawObject",
        "required":false,
        "nullable":true,
        "sensitivityValue":0
    },
    {
        "name":"matchInValues",
        "type":"Array_RawObject",
        "required":false,
        "nullable":true,
        "sensitivityValue":0
    },
    {
        "name":"ruleId",
        "type":"string",
        "required":true,
        "nullable":false,
        "sensitivityValue":0
    }
  ]
    ```
    </details>

6. Create endpoint for the MongoDB view previously created `adaptive-checkout-view`
  - Create a new endpoint on the endpoint section `/adaptive-checkout-view`
  - Choose MongoDB view as type
  - Choose MongoDB view base path as `/adaptive-checkout-view`