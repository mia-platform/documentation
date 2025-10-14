---
id: fnmpay
title: Stripe
sidebar_label: Fnmpay
---



In this page you will find the required information to perform REST calls related to the Stripe payment provider.

| Payment Method | Payment | Refund | Automatic Subscription | Manual Subscription |
|----------------|---------|--------|------------------------|---------------------|
| `credit-cards` | ✓       |        |                        |                     |

|              | Enabled |
|--------------|---------|
| Pay By Link  | ✓       |

## Endpoints

Every Fnmpay endpoint has this prefix path `/v3/fnmpay`

### Pay

`POST /{payment-method}/pay`

This endpoint allows to execute payments via the Fnmpay payment provider.

The request body requires the `providerData` field which requires the following data:
- `transactionType`: identifies the type of payment to be created. It can have two values `SALE` and `AUTH`

You can always define the following optional fields in `providerData`:
```json
{
  "type": "object",
  "required": ["transactionsType"],
  "properties": {
    "transactionsType": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "walletId": {
      "type": "string"
    },
    "paymentToken": {
      "type": "string"
    },
    "createPaymentToken": {
      "type": "string"
    },
    "cancelUrl": {
      "type": "string"
    },
    "callbackUrl": {
      "type": "string"
    },
    "language": {
      "type": "string"
    },
    "customer": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "lastname": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        },
        "company": {
          "type": "string"
        }
      }
    },
    "addressDetail": {
      "type": "object",
      "properties": {
        "country": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "streetAddress1": {
          "type": "string"
        },
        "streetAddress2": {
          "type": "string"
        },
        "zip": {
          "type": "string"
        },
        "state": {
          "type": "string"
        }
      }
    },
    "products": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "productName": {
            "type": "string"
          },
          "quantity": {
            "type": "string"
          },
          "amount": {
            "type": "string"
          },
          "imageUrl": {
            "type": "string"
          },
          "discountType": {
            "type": "string"
          },
          "discountAmount": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

The payment response can have the following result codes:
- **REDIRECT_TO_URL**: the payment was successfully submitted for settlement
- **KO**: the payment failed

### Status

`GET /status?paymentId={paymentId}`
This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId`.

#### Mapping
The status received by the provider will be mapped according to the following table:

| Provider transactionCode | Plugin Status |
|--------------------------|---------------|
| 00                       | ACCEPTED      |
| != 00                    | FAILED        |

Everything else will be mapped as PENDING.

### Check

`GET /check?paymentId={paymentId}`
This endpoint allows to get the current status of the payment identified by the **required** query parameter `paymentId` and also to send a notification to the external service as specified by `PAYMENT_CALLBACK_URL` environment variable.

### Callback

`POST /callback`
This endpoint should only be called by Fnmpay.
