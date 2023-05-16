---
id: stripe
title: Stripe
sidebar_label: Stripe
---
## Starting a payment

### One-Time

Stripe `/pay` request body has two required fields, they define the URLs where the user will be redirected in case of success or failure:
```json lines
{
  "successRedirect": "https://example.com/ok",
  "failureRedirect": "https://example.com/ko"
}
```
The previous body can be integrated using two different ways:
1. A simple Amount
    ```json lines
    {
      "amount": "5.00"
    }
    ```
2. List of Products
    ```json lines
    {
      "products": [...]
    }
    ```
   Three types of products are allowed:
    * Price
        ```json lines
        {
          "quantity": 1,
          "priceId": "price-id"  
        }
        ```
      where `priceId` refers to a Stripe [Price](https://stripe.com/docs/api/prices) object id.
    * ProductId
        ```json lines
        {
          "quantity": 2,
          "unitAmount": "1.00",
          "productId": "product-id"  
        }
        ```
      where `productId` refers to a Stripe [Product](https://stripe.com/docs/api/products) object id.
    * ProductName
        ```json lines
        {
          "quantity": 1,
          "unitAmount": "2.00",
          "productName": "product-name"  
        }
        ```

### Recurrent

The `/pay/recurrent` request body has one more required field and one more optional field:
```json lines
{
  "interval": "day",  // required
  "intervalCount": 10  // optional, default = 1
}
```
In the example above, the customer will be invoiced every ten days.
Possible values for `interval` are: day, week, month or year.
These two fields must be added in the Amount, ProductId and ProductName objects.  
By default, subscriptions do not end.

A complete example:
```json lines
{
  "successRedirect": "https://example.com/ok",
  "failureRedirect": "https://example.com/ko",
  "products": [
    {
      "unitAmount": "7.50",
      "quantity": 1,
      "productName": "product-name",
      "interval": "month",
      "intervalCount": 1
    },
    {
      "unitAmount": "7.50",
      "quantity": 1,
      "productId": "product-id",
      "interval": "month",
      "intervalCount": 1
    }
  ]
}
```

:::warning
If more than a product is specified in the same request, they must have the same `interval` and `intervalCount`.
:::

## Refund a payment

Stripe supports both full and partial refund. If no amount is specified in the request, a full refund is performed.  
The request body is:
```json lines
{
  "paymentID": "payment-id",
  "amount": "1.00" // optional
}
```
Stripe also supports multiple partial refund on the same payment, the sum of all the refunds must be less or equal to the total amount paid.

## Expire a Payment

### One-Time

Through the endpoint `POST /pay/expire` is possible to mark as invalid a requested payment not already authorized by the customer.  
The request body is:
```json lines
{
  "paymentID": "payment-id"
}
```

### Recurrent

The endpoint `POST /pay/recurrent/expire` sets the date until a subscription remains active.  
The request body is:
```json lines
{
  "paymentID": "payment-id",
  "cancelType": "atDay",
  "cancelTime": "31/12/2022"
}
```
Possible values for `cancelType` are:
* now: immediately cancel the subscription
* endOfPeriod: cancel the subscription right before the next renewal
* atDay: cancel the subscription at the day specified in the `cancelTime` field (format "dd/MM/YYYY")

The `cancelTime` field is required only for `"cancelType": "atDay"` and must be in the format `dd/MM/yyyy`.
