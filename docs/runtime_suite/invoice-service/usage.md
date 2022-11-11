---
id: usage
title: PDF Invoice Service Usage
sidebar_label: Usage
---
The service exposes only the `/print-pdf` in `POST`. The request must contain a body with the following properties:

```javascript
{
    "personName": "string", // required. 
    "streetAddress": "string" // required. Address of the person
    "city": "string" // required. City of the person's address
    "state": "string" // required. State of the person's address
    "dateTime": "string" // required. Date and time of the payment/order in iso format
    "paymentMethod" : "string" // required.
    "transactionId": "string" // required.
    "docNumber": "string" // required. Number of the invoice
    "items": "obejct" // required. An object, containing the items data for order
}
```

The body `items` has the following properties: 

```javascript
{
    "itemId": "string", // required.
    "description": "string" // required. 
    "quantity": "number" // required.
    "amount": "number" // required.
    "iva": "number"
}
```

The service will get all the necessary data from the POST request and it will generate the invoice in pdf format with all the data received.
