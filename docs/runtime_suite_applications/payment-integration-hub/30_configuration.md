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
- `PROJECT_HOST`: host of the current project
- `VITE_POLLING_INTERVAL`: interval in ms between two calls during polling

Based on the payments method enabled you have to set other variables:

- Axerve
  - `VITE_AXERVE_API_KEY`
  - `VITE_AXERVE_SHOPLOGIN`
- Adyen
  - `VITE_ADYEN_KEY`
- Braintree
  - `VITE_BRAINTREE_KEY`
  - `BRAINTREE_TOKENIZATION_KEY`
- Google Pay
  - `VITE_GOOGLE_MERCHANT_ID`
  - `VITE_GOOGLE_MERCHANT_NAME`
- Apple Pay
  - add the right certificate on `/usr/static/.well-known/apple-developer-merchantid-domain-association.txt`.

Further personalization is available modifying its config-map.

## Backend for Frontend

In order to complete the configuration of the `Back End for Front End` you have to set the following environment variables:
- `PAYMENT_OK_REDIRECT_URL`: url to which to redirect the user following a successfully completed payment
- `PAYMENT_KO_REDIRECT_URL`: url to which to redirect the user following a failed payment
- `FLOW_MANAGER_URL`: flow manager service url
- `PGM_URL`: payment gateway manager url
- `INVOICE_SERVICE_URL`: invoice service url
- `FILES_SERVICE_URL`: file service url
- `SAGA_CRUD_URL`: saga collection url
- `INVOICE_CRUD_URL`: invoice collection url

- `CRUD_POLLING_INTERVAL_MS`: interval in ms between two calls during polling
- `CRUD_POLLING_ATTEMPTS_LIMIT`: maximum number of attempts during polling

- `APPLEPAY_CERTIFICATE_PASSWORD`
- `APPLEPAY_CERTIFICATE_FILE`


## Frullino

This service periodically retrieves from the crud the payments that are in the pending state,
checks the actual status through the provider and updates the payment state accordingly (failed or executed).

The following environment variables are customizable:
- `PGM_URL`: payment gateway manager url
- `FLOW_MANAGER_URL`: flow manager service url
- `CRUD_SERVICE_URL`: crud service url
- `MIN_DATE_OFFSET_MS` and `MAX_DATE_OFFSET_MS`: define the interval between payments have to be checked as: `NOW - MAX_DATE_OFFSET_MS` < payment last update < `NOW - MIN_DATE_OFFSET_MS`
- `ENABLED_PROVIDERS`: the list of providers whose payments to check
- `REDIS_HOST`: Redis installation URL
- `THREAD_NUMBER`: the number of payments the service can check in parallel
- `FRULLINO_RUNNING_INTERVAL_CRON`: how often the service performs the check


### Others

For further configuration of the microservices you can refer to the dedicated documentation:
- [Invoice-Service](../../runtime_suite/invoice-service/overview)
- [Flow-Manager-Service](../../runtime_suite/flow-manager-service/overview)
- [Files-Service](../../runtime_suite/files-service/configuration)
- [SMTP Mail Notification Service](../../runtime_suite/ses-mail-notification-service/usage)
- [Data-Visualization](../../business_suite/data-visualization)
- [Analytics](../../runtime_suite/mongodb-reader/configuration)

## View

:::warning Workaround
The user should perform the additional steps reported in this admonition.
- Setup aggregation of `transactions_saga_view` as follows.
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
        "$project": {
          "__STATE__": "$__STATE__",
          "createdAt": "$createdAt",
          "updatedAt": "$updatedAt",
          "creatorId": "$creatorId",
          "updaterId": "$updaterId",
          "sagaId": "$sagaId",
          "amount": "$metadata.amount",
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
                      "gestpay"
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
                      "PAYMENT_PARTIALLY_REFUNDED"
                    ]
                  },
                  "then": "Partially Refunded"
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
                      "PAYMENT_FAILED"
                    ]
                  },
                  "then": "Failed"
                }
              ],
              "default": "$businessStateDescription"
            }
          },
          "buyerName": "$metadata.buyer.name",
          "buyerEmail": "$metadata.buyer.email",
          "channel": "$metadata.additionalData.channel",
          "date": "$createdAt",
          "history": {
            "$reverseArray": {
              "$function": {
                "body": "function(history, refundedAmounts) {  externalIndex = 0;  return history.events.map((event, index) => {    let refundedAmount = undefined;    if (event.event === 'partialRefundExecuted' || event.event === 'totalRefundExecuted') {      if (refundedAmounts !== null && externalIndex < refundedAmounts.length) {        refundedAmount = refundedAmounts[externalIndex];        externalIndex++;      } else {        refundedAmount = 'error';      }    }    let status;    switch (history.states[index].businessStateDescription) {      case 'PAYMENT_CREATED':        status = 'Created';        break;      case 'PAYMENT_PAID':        status = 'Paid';        break;      case 'PAYMENT_PARTIALLY_REFUNDED':        status = 'Partially Refunded';        break;      case 'PAYMENT_TOTALLY_REFUNDED':        status = 'Totally Refunded';        break;      case 'PAYMENT_FAILED':        status = 'Failed';        break;      default:        status = history.states[index].businessStateDescription;    }    let eventName;    switch (event.event) {      case 'paymentCreated':        eventName = 'Payment created';        break;      case 'scheduleRequested':        eventName = 'Payment schedule requested';        break;      case 'paymentRedirected':        eventName = 'Payment redirected';        break;      case 'redirectionCompleted':        eventName = 'Redirection completed';        break;      case 'paymentScheduled':        eventName = 'Payment scheduled';        break;      case 'confirmRequested':        eventName = 'Payment confirmation requested';        break;      case 'confirmReceived':        eventName = 'Payment confirmation received';        break;      case 'paymentScheduleFailed':        eventName = 'Payment schedule failed';        break;      case 'redirectionFailed':        eventName = 'Payment redirection failed';        break;      case 'paymentExecutionFailed':        eventName = 'Payment failed';        break;      case 'paymentExecutionFailedFrullino':        eventName = 'Payment failed by the system';        break;      case 'paymentConfirmFailed':        eventName = 'Payment confirmation failed';        break;      case 'emailNotificationSent':        eventName = 'Email notification sent';        break;      case 'emailNotificationFailed':        eventName = 'Email notification failed';        break;      case 'emailNotificationRequested':        eventName = 'Email notification requested';        break;      case 'paymentExecuted':        eventName = 'Payment executed';        break;      case 'paymentExecutedFrullino':        eventName = 'Payment executed by the system';        break;      case 'refundRequested':        eventName = 'Refund requested';        break;      case 'refundFailed':        eventName = 'Refund failed';        break;      case 'partialRefundExecuted':        eventName = 'Partial refund executed';        break;      case 'totalRefundExecuted':        eventName = 'Total refund executed';        break;      case 'invoiceGenerated':        eventName = 'Invoice generated';        break;      case 'invoiceGenerationFailed':        eventName = 'Invoice generation failed';        break;      default:        eventName = event.event;    }    return {      date: event.timestamp,      event: eventName,      status,      refundedAmount    };  });}",
                "args": [
                  "$history",
                  "$metadata.refundDetails.refundedAmounts"
                ],
                "lang": "js"
              }
            }
          },
          "shopTransactionID": "$metadata.shopTransactionID",
          "paymentID": "$metadata.paymentID",
          "totalRefundedAmount": "$metadata.refundDetails.totalRefundedAmount",
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
      }
    ]
    ```
    </details>

- Create endpoint for the mongoDB view previously created `transactions_saga_view`
  - Create a new endpoint on the endpoint section `/transactions-saga-view`
  - Choose mongoDB view as type
  - Choose Mongo view base path as `/transactions-saga-view`

:::
