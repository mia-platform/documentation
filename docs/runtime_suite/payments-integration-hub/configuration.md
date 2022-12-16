---
id: configuration
title: Configuration
sidebar_label: Configuration
---
In order to properly add this application in your project you have to complete its configuration as described in the following sections.

:::warning Workaround
Because of some faults a in the application creation process, the user should perform the additional steps reported in this admonition.
- Check the _authentication required_ checkbox of the `/` endpoint. [CPB-302](https://makeitapp.atlassian.net/browse/CPB-302)
- Setup aggregation of `transactionsview` as follows. [CPB-387](https://makeitapp.atlassian.net/browse/CPB-387)
  - create a new aggregation view on MongoDB Views section called `transactionsview`
  - choose `transactions` as starting collection
  - paste the following pipeline
  - create transcationsview schema as the schema below
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
    "$set": {
      "providerId": "$provider",
      "provider": {
        "$switch": {
          "branches": [
            {
              "case": {
                "$eq": [
                  "$provider",
                  "braintree"
                ]
              },
              "then": "Braintree"
            },
            {
              "case": {
                "$eq": [
                  "$provider",
                  "gestpay"
                ]
              },
              "then": "Axerve"
            },
            {
              "case": {
                "$eq": [
                  "$provider",
                  "safecharge"
                ]
              },
              "then": "SafeCharge"
            },
            {
              "case": {
                "$eq": [
                  "$provider",
                  "satispay"
                ]
              },
              "then": "Satispay"
            },
            {
              "case": {
                "$eq": [
                  "$provider",
                  "scalapay"
                ]
              },
              "then": "Scalapay"
            },
            {
              "case": {
                "$eq": [
                  "$provider",
                  "soisy"
                ]
              },
              "then": "Soisy"
            },
            {
              "case": {
                "$eq": [
                  "$provider",
                  "unicredit"
                ]
              },
              "then": "Unicredit"
            },
            {
              "case": {
                "$eq": [
                  "$provider",
                  "stripe"
                ]
              },
              "then": "Stripe"
            }
          ],
          "default": "$provider"
        }
      },
      "paymentMethodId": "$paymentMethod",
      "paymentMethod": {
        "$switch": {
          "branches": [
            {
              "case": {
                "$eq": [
                  "$paymentMethod",
                  "applepay"
                ]
              },
              "then": "Apple Pay"
            },
            {
              "case": {
                "$eq": [
                  "$paymentMethod",
                  "credit-cards"
                ]
              },
              "then": "Credit Card"
            },
            {
              "case": {
                "$eq": [
                  "$paymentMethod",
                  "googlepay"
                ]
              },
              "then": "Google Pay"
            },
            {
              "case": {
                "$eq": [
                  "$paymentMethod",
                  "pay-pal"
                ]
              },
              "then": "PayPal"
            },
            {
              "case": {
                "$eq": [
                  "$paymentMethod",
                  "safecharge"
                ]
              },
              "then": "SafeCharge"
            },
            {
              "case": {
                "$eq": [
                  "$paymentMethod",
                  "satispay"
                ]
              },
              "then": "Satispay"
            },
            {
              "case": {
                "$eq": [
                  "$paymentMethod",
                  "scalapay"
                ]
              },
              "then": "Scalapay"
            },
            {
              "case": {
                "$eq": [
                  "$paymentMethod",
                  "soisy"
                ]
              },
              "then": "Soisy"
            },
            {
              "case": {
                "$eq": [
                  "$provider",
                  "stripe"
                ]
              },
              "then": "Stripe"
            }
          ],
          "default": "$paymentMethod"
        }
      },
      "currentStatus": {
        "$switch": {
          "branches": [
            {
              "case": {
                "$eq": [
                  "$currentStatus",
                  "PAYMENT_EXECUTED"
                ]
              },
              "then": "Executed"
            },
            {
              "case": {
                "$eq": [
                  "$currentStatus",
                  "PAYMENT_SCHEDULED"
                ]
              },
              "then": "Scheduled"
            },
            {
              "case": {
                "$eq": [
                  "$currentStatus",
                  "PAYMENT_REFUNDED"
                ]
              },
              "then": "Refunded"
            },
            {
              "case": {
                "$eq": [
                  "$currentStatus",
                  "PAYMENT_FAILED"
                ]
              },
              "then": "Failed"
            }
          ],
          "default": "$currentStatus"
        }
      },
      "date": "$createdAt",
      "time": "$createdAt",
      "history": {
        "$map": {
          "input": "$states",
          "as": "s",
          "in": {
            "$concat": [
              {
                "$dateToString": {
                  "date": {
                    "$dateFromString": {
                      "dateString": "$$s.date"
                    }
                  },
                  "format": "%Y-%m-%d %H:%M:%S"
                }
              },
              " - ",
              {
                "$switch": {
                  "branches": [
                    {
                      "case": {
                        "$eq": [
                          "$$s.businessState",
                          "PAYMENT_EXECUTED"
                        ]
                      },
                      "then": "Executed"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$s.businessState",
                          "PAYMENT_FAILED"
                        ]
                      },
                      "then": "Failed"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$s.businessState",
                          "PAYMENT_SCHEDULED"
                        ]
                      },
                      "then": "Scheduled"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$$s.businessState",
                          "PAYMENT_REFUNDED"
                        ]
                      },
                      "then": "Refunded"
                    }
                  ],
                  "default": "$$s.businessState"
                }
              }
            ]
          }
        }
      }
    }
  },
  {
    "$project": {
      "__STATE__": "$__STATE__",
      "createdAt": "$createdAt",
      "updatedAt": "$updatedAt",
      "creatorId": "$creatorId",
      "updaterId": "$updaterId",
      "amount": "$amount",
      "paymentMethod": "$paymentMethod",
      "provider": "$provider",
      "paymentMethodId": "$paymentMethodId",
      "providerId": "$providerId",
      "currentStatus": "$currentStatus",
      "buyerName": "$buyer.name",
      "buyerEmail": "$buyer.email",
      "channel": "$additionalData.channel",
      "date": "$date",
      "time": "$time",
      "history": "$history",
      "shopTransactionID": "$shopTransactionID",
      "paymentID": "$paymentID"
    }
  }
]
  ```
</details>

<details>
  <summary>View schema</summary>

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
      "name": "shopTransactionID",
      "description": "The unique id of your transaction",
      "type": "string",
      "required": false,
      "nullable": false,
      "sensitivityValue": 0
    },
    {
      "name": "amount",
      "description": "The amount to be paid in Euros",
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
      "name": "buyerEmail",
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
      "name": "channel",
      "type": "string",
      "required": false,
      "nullable": false,
      "sensitivityValue": 0
    },
    {
      "name": "date",
      "type": "string",
      "required": false,
      "nullable": false,
      "sensitivityValue": 0
    },
    {
      "name": "time",
      "type": "string",
      "required": false,
      "nullable": false,
      "sensitivityValue": 0
    },
    {
      "name": "history",
      "type": "Array_string",
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
      "name": "paymentMethodId",
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
    }
  ]
```
</details>

- Create endpoint for the mongoDB view previously created `transactionsview`
  - Create a new endpoint on the endpoint section `/transactions-view`
  - Choose mongoDB view as type
  - Choose Mongo view base path as `/transactionsview`

:::

## Advanced Configuration

### API Gateway

From the design area of the console go to **Advanced** and select the `api-gateway` microservice.

Open the file **maps-proxyUrl.before.map** and write the following configuration:

```
# DataVisualization Backoffice Analytics
# Rewrite application calls from /api/charts/dashboards/:dashboardId endpoint
# to the Backend
"~^GET-/api/charts/dashboards(?<path>/.*|$)$" "/charts/dashboards$path";
"~^GET-/api/charts(?<path>/.*|$)$" "$path";
"~^GET-/data-visualization(?<path>/.*|$)$" "$path";

# Notification Center
"~^(GET|POST|PATCH|DELETE)-/api/v1/micro-lc-notification-center(?<path>/.*|$)$" "$path";

# micro-lc
"~^\w+-/.+/api/v1/microlc(?<path>[/\?].*|$)$" "/v1/microlc$path";
```

Open the file **server-extension.conf** and write the following configuration:

```
error_page 401 = @error401;

location @error401 {
  include /etc/nginx/customization.d/header-debug.conf;

  if ($type = "text/html") {
    return 302 '$original_request_scheme://$original_request_host/web-login?redirect=$original_request_uri$is_args$args';
  }

  default_type $type;
  return 401 $content_401;
}
```

This configuration will tell the API Gateway to redirect (302) any **unauthorized request** (401) to `/web-login` endpoint, without modifying the original request.

## Backoffice Sections

Each section of backoffice application is customizable by editing configuration files on **microlc-backend** microservices. For further details on how to customize your backoffice you can refer to the [official documentation](../../business_suite/backoffice/overview).

In order to customize dashboards and KPIs shown on analytics page you can change the configuration file that define the available dashboards on [data-visualization-backend microservice](../../business_suite/data-visualization). The KPIs and aggregated data used in the dashboards are provided by the [analytics-transactions microservice](../../runtime_suite/mongodb-reader/configuration)

## Microservices

### Payment Gateway Manager

In order to complete the configuration of this service you have to set the `ENABLED_PROVIDERS` environment variable. Moreover, you should add the **required environment variables** depending on the chosen payment provider. Refer to the service's [configuration documentation](../../runtime_suite/payment-gateway-manager/configuration).

:::info
This service is configured such that asynchronous notifications are sent to the `pgm-adapter` service. Anyway this feature can still be used setting the desired value to `PAYMENT_CALLBACK_URL` environment variable of the `pgm-adapter` service. 
:::

### PGM Adapter

You can change the configuration of this service to customize the email notification feature. First of all, you can disable email notification for certain providers setting the `EMAIL_DISABLED_PROVIDERS` environment variable as a comma-separated list. Furthermore you can customize every part of the emails changing the provided `email-config` config map. The service is able to interpolate some information retrieved from the payment in the email subject and body. Information available for interpolation:
- `SHOP_TRANSACTION_ID`
- `AMOUNT`
- `REFUNDED_AMOUNT`
- `PAYMENT_METHOD`
- `BUYER_NAME`
- `CURRENT_STATE`
- `DATE`

### SMTP Mail Notification Service

This service is used to actually send payment-related mail notification to customers. Its configuration must be completed setting the following environment variables:
- `HOST`: the host of the SMTP server to use,
- `PORT`: the port of the SMTP server to use,
- `AUTH_USER`: the email used to login on the SMTP server,
- `AUTH_PASS`: the password related to the email used to login on the SMTP server.

:::tip
Use secrets to store the password used in `AUTH_PASS`.
:::

### Others

For further configuration of the microservices you can refer to the dedicated documentation:
- [Backoffice](../../business_suite/backoffice/overview)
- [Data-Visualization](../../business_suite/data-visualization)
- [Analytics](../../runtime_suite/mongodb-reader/configuration)
- [Invoices](../../runtime_suite/invoice-service/overview)

## Database

By default, a new collection and a view are created and used by the application as references to retrieve payments information, but the application can use any MongoDB collection/view with any schema. 
> **If you want to use your own collection/view or change the default schema** keep in mind to update also the data schema on the backoffice configuration.

## Authorization

### Tenant

Configure your Auth0 tenant following the [dedicated documentation](../../development_suite/set-up-infrastructure/auth-0-setup).

### Public Variables

Set the value for the following public variables

- `AUTH0_NAMESPACE`
- `AUTH0_CALLBACK_URL`

### Environment Variables

Set the value for the following environment variables, used in the Auth0 client configuration file:

- `AUTH0_APPLICATION_URL`: url to the Auth0 application (defined in the Auth0 tenant)
- `AUTH0_CLIENT_ID`: client ID for the Auth0 application used (defined in the Auth0 tenant)
- `AUTH0_CLIENT_SECRET`: client secret for the Auth0 application used (defined in the Auth0 tenant)
- `AUTH0_MANAGEMENT_CLIENT_ID`: client id for the Auth0 machine to machine application used (defined in the Auth0 tenant)
- `AUTH0_MANAGEMENT_CLIENT_SECRET`: client secret for the Auth0 machine to machine application used (defined in the Auth0 tenant)

### Microservices

For further configuration on microservices included in the application you can refer to the dedicated documentation:

- [Authorization Service](../../development_suite/api-console/advanced-section/authorization-service/configuration)
- [Oauth Login Site](../../dev_portal/authentication_configuration#configure-login-site)
- [Auth0 Client](../../runtime_suite/auth0-client/configuration)
