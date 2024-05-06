---
id: usage
title: Usage
sidebar_label: Usage
---
The main purpose of the **Pharma Ecommerce Backend** is to provide an interface to different pharma e-commerce providers and to enable medicines purchase and order management feature to your end users.

## Providers

### GET /providers

Get all the active providers that serves the address given in input.

#### Query parameters

This request accepts the following query parameters:

- **latitude (required)** - `number`: the latitude of the address to check;
- **longitude (required)** - `number`: the longitude of the address to check.

#### Response

With a 200 status code returns an array of providers that provide their services in a given location. The structure of the payload is the following:

```json
{
  "providers": [
    "pharmaPrime"
  ]
}
```

:::info
If no pharma e-commerce provider offers its services in the provided location, the endpoint will return a 404 error.
:::

## User sign up

### POST /signup

Sign up a user on all the providers declared in **ACTIVE_PROVIDERS** environment variable.

#### Body

This request accepts the following body object:

- **name (required)** - `string`: the user's name;
- **surname (required)** - `string`: the user's surname;
- **birthdate (required)** - `date`: the user's birthdate (expressed in format **ISO 8601**);
- **email (required)** - `string`: the user's email;
- **phone (required)** - `string`: the user's phone number (containing the `+` international prefix, for example `+39`).

#### Response

The endpoint with a successful signup to all providers has a 204 status code and no return body.

## Categories

### GET /categories

Retrieve a list of product categories and subcategories available given a specific address and provider. The language of the returned items can be configured with the **LANGUAGE** environment variable.

#### Query parameters

This request accepts the following query parameters:

- **latitude (required)** - `number`: the address latitude;
- **longitude (required)** - `number`: the address longitude;
- **provider (required)** - `string`: the provider identifier (such as `pharmaPrime`).

#### Response

The endpoint returns a 200 status code and a payload containing an array of categories containing the related subcategories array.

A category has the following properties:

- **id (required)** - `number`: the category id;
- **name (required)** - `string`: the category name;
- **subcategories (required)** - `array of subcategory`: the subcategories contained in a category.

A subcategory has the following properties:

- **id (required)** - `number`: the subcategory id;
- **name (required)** - `string`: the subcategory name.

A payload example the following structure:

```json
{
  [
    "id": 1,
    "name": "Category 1",
    "subcategories": []
  ],
  [
    "id": 2,
    "name": "Category 2",
    "subcategories": [
      {
        "id": 1,
        "name": "Subcategory 1"
      }
    ]
  ],
    [
    "id": 3,
    "name": "Category 3",
    "subcategories": [
      {
        "id": 1,
        "name": "Subcategory 1"
      },
      {
        "id": 2,
        "name": "Subcategory 2"
      }
    ]
  ]
}
```

## Products

This section describes the endpoints dedicated to search and obtain information about the pharma e-commerce products.

:::info
All the items' prices are in euro (€).
:::

### GET /products/

Get a list of products related to a term, code, or subcategory id.

#### Query parameters

This request accepts the following query parameters:

- **provider (required)** - `string`: the provider identifier (such as `pharmaPrime`);
- **latitude** - `number`: the user's latitude, if not provided the **DEFAULT_LATITUDE** is used;
- **longitude** - `number`: the user's longitude, if not provided the **DEFAULT_LONGITUDE** is used;
- **term** - `string`: a search term used to filter the returned items;
- **scannedCode** - `string`: the string representation of the product's bar code;
- **subCategoryId** - `string`: a subcategory id to retrieve products of a specific subcategory;
- **onlyPrescriptionRequired** - `boolean`: if true, the endpoint returns items that require a prescription to be purchased;
- **_sk** - `number`: the number of elements to skip a paginated request;
- **_l** - `number`: the number of elements returned from a single request.

:::info
In addition, at least one of the `term`, `scannedCode`, `subCategoryId`, `onlyPrescriptionRequired` query parameters is required in order to perform a search on the `pharmaPrime` e-commerce provider.
:::

:::info
There is no default for `_sk` and `_l` and they are not required. Tough, they are both recommended for improving the microservice response time.
:::

#### Response

The endpoint returns a 200 status code and a payload containing an array of products.

A product has the following properties:

- **id (required)** - `number`: the item id;
- **name (required)** - `string`: the product name;
- **description (required)** - `string`: the product description;
- **price (required)** - `string`: the product max price;
- **imageUrl** - `string`: the product image URL;
- **leaflet (required)** - `array of leaflet items`: an array containing the product leaflet sections;
- **tags (required)** - `array of strings`: the list of tags related to a product.

A leaflet item has the following properties:

- **label (required)** - `string`: the name of the leaflet section;
- **text (required)** - `string`: an HTML text containing the details of a leaflet section information.

A payload example is the following:

```json
[
  {
    "id": 1,
    "name": "Tachipirina*10cpr div 500mg",
    "description": "Tachipirina*10 cpr div 500 mg",
    "price": 2.75,
    "imageUrl": "https://imageurl.com",
    "leaflet": [
      {
        "label": "Indicazioni terapeutiche",
        "text": "Come antipiretico: trattamento sintomatico di affezioni febbrili quali l'influenza, le malattie esantematiche, le affezioni acute del tratto respiratorio, ecc. Come analgesico: cefalee, nevralgie, mialgie ed altre manifestazioni dolorose di media entit&agrave;, di varia origine."
      },
      {
        "label": "Controindicazioni",
        "text": "&bull; Ipersensibilit&agrave; al paracetamolo o ad uno qualsiasi degli eccipienti elencati al paragrafo 6.1. &bull; Pazienti affetti da grave anemia emolitica (tale controindicazione non si riferisce alle formulazioni orali da 500mg). &bull; Grave insufficienza epatocellulare (tale controindicazione non si riferisce alle formulazioni orali da 500mg)."
      },
      {
        "label": "Conservazione",
        "text": "<u>Compresse e granulato effervescente</u>: nessuna speciale precauzione per la conservazione. <u>Supposte:</u> conservare a temperatura non superiore a 25&deg;C."
      }
    ],
    "tags": [
      "Fever"
    ]
  }
]
```

### GET /products/:id

Get product details info by id.

#### Query parameters

This request accepts the following query parameters:

- **provider (required)** - `string`: the provider identifier (such as `pharmaPrime`).

#### Response

The endpoint returns a 200 status code and a payload containing a product described in the previous section.

## Shopping cart

This section describes the operations that a logged user can perform to create and manage its current shopping cart.

### POST /cart/products

Add an item to the cart, if a prescription is required then it uploads it to the provider.

#### Body

This endpoint accepts the following multipart/form-data:

- **provider (required)** - `string`: the provider id, such as `pharmaPrime`;
- **latitude (required)** - `string`: the user's address latitude;
- **longitude (required)** - `string`: the user's address longitude;
- **address (required)** - `string`: the user's complete address;
- **productId (required)** - `string`: the id  of the product to add to the shopping cart;
- **quantity (required)** - `number`: the number of items specified by the `productId` that needs to be added to the shopping cart;
- **recipeExemptionCode** - `string`: an eventual exemption code of the prescription;
- **recipeFile**: the prescription file to upload to the pharma e-commerce provider;
- **prescriptionId** - `string`: the id of the prescription previously stored using the optionally implemented **prescription-manager** microservice.

:::info
Medicines requiring prescriptions needs only one of `recipeFile` and `prescriptionId` to be defined.
:::

:::warning
When `prescriptionId` is defined and the item to be added to the shopping cart requires a prescription, the prescription file will be retrieved from the **DOWNLOAD_PRESCRIPTION_PDF_ENDPOINT** of the **PRESCRIPTION_MANAGER**. Not having this microservice and the specified endpoint in your project will cause an error.
More details are available in the [prescription-manager](./20_configuration.md#prescription-manager) microservice configuration.
:::

#### Response

The endpoint returns a 200 status code and a payload containing a created shopping cart or an updated existing one. The payload of a shopping cart is described in the [GET /cart](#get-orders) response section.

### PATCH /cart/products/:id

Updates a product quantity (identified by its product id) in the logged user's shopping cart.

#### Body

This request accepts the following body object:

- **provider (required)** - `string`: the provider id, such as `pharmaPrime`;
- **latitude (required)** - `string`: the user's address latitude;
- **longitude (required)** - `string`: the user's address longitude;
- **address (required)** - `string`: the user's complete address;
- **quantity (required)** - `number`: the new number of items to set in the shopping cart for a product.

:::info
Setting the quantity of an item to zero will remove the item completely from the shopping cart.
:::

#### Response

A successful patch of the quantity of an item will return a 204 status code.

### DELETE /cart/products/:id

Delete a product from the logged user's shopping cart.

#### Query parameters

This request accepts the following query parameter:

- **provider** - `string`: the provider id, such as `pharmaPrime`.

#### Response

A successful item delete will return a 204 status code.

### GET /cart

Retrieve the logged user's shopping cart.

#### Query parameters

This request accepts the following query parameters:

- **provider (required)** - `string`: the provider id, such as `pharmaPrime`;
- **latitude (required)** - `string`: the user's address latitude;
- **longitude (required)** - `string`: the user's address longitude;
- **address (required)** - `string`: the user's complete address;
- **prescriptionId** - `string`: the id of the prescription previously stored using the optionally implemented **prescription-manager** microservice.

:::warning
When `prescriptionId` is defined, the shopping cart will be re-created from a previously stored prescription. Thus, the implementation of the **PRESCRIPTION_ENDPOINT** of the **PRESCRIPTION_MANAGER** is required. Otherwise, the service will throw an error.
More details are available in the optional [prescription-manager](./20_configuration.md#prescription-manager) microservice configuration.
:::

#### Response

With a 200 status code returns, a shopping cart object with the following properties:

- **notAvailableItems** - `array of items`: an array of not available items given a provider and a location;
- **items (required)** - `array of items`: an array of available items given a provider and a location;
- **price (required)** - `object`: an object always containing the `subtotal` and `shippingCosts` properties as numbers;
- **address (required)** - `string`: the user's complete address.

A shopping cart item has the following properties:

- **id (required)** - `string`: the product id;
- **name** - `string`: the product name;
- **description** - `string`: the product description;
- **imageUrl** - `string`: the optional product image URL;
- **quantity (required)** - `number`: the number of items that will be ordered for a specific product;
- **price (required)** - `number`: the unit price of a product item;
- **recipeRequired** - `boolean`: whether a product requires a prescription or not.

An example of a response payload is the following:

```json
{
  "notAvailableItems": [],
  "items": [
    {
      "id": "114",
      "name": "Tachipirina*10cpr div 500mg",
      "description": "Tachipirina*10 cpr div 500 mg",
      "imageUrl": "https://imageurl.com",
      "quantity": 1,
      "price": 2.75,
      "recipeRequired": false
    }
  ],
  "address": "Piazza Navona, 00186 Roma RM, Italy",
  "price": {
    "subtotal": 2.75,
    "shippingCosts": 3
  }
}
```

:::info
All the prices of the shopping cart, such as the `subtotal` and the `shippingCosts` and also the `price` of an item, are in euro (€).
:::

## Orders

A user signed up to a pharma e-commerce provider with a shopping cart can place an order and access the orders already placed to monitor their status.

### Order states

The status that an order can have can be summarized in the following table.

| Name | Code |
|------|------|
| Created | 1 |
| Payed | 15 |
| Ready for shipment | 2 |
| Cancelled | 4 |
| In delivery | 5 |
| Delivered | 6 |

:::info
The previous order status codes are the one supported by the only supported provider `pharmaPrime`.
:::

### POST /order

Create an order from logged user cart.

#### Body

This endpoint accepts the following json object:

- **provider (required)** - `string`: the provider id, such as `pharmaPrime`;
- **latitude (required)** - `string`: the user's delivery address latitude;
- **longitude (required)** - `string`: the user's delivery address longitude;
- **address (required)** - `string`: the user's delivery complete address.

#### Response

When an order is successfully placed to a provider, the order will be saved in the **MIA_ORDERS_CRUD_ENDPOINT** CRUD and returned.

The order object has the following properties:

- **id (required)** - `string`: the created order id;
- **items (required)** - `array of order items`: the user's address latitude;
- **address (required)** - `string`: the delivery order address;
- **status (required)** - `object`: the newly created order status object containing a numerical `code` and a `label` describing the order status;
- **deliveryDate (required)** - `date`: the order estimated delivery date (expressed in format **ISO 8601**);
- **paymentLink** - `string`: the optional link for processing the order payment;
- **price (required)** - `object`: an object always containing the `subtotal` and `shippingCosts` properties as numbers.

An order item has the following properties:

- **name (required)** - `string`: the product name;
- **imageUrl** - `string`: the optional product image URL;
- **quantity (required)** - `number`: the number of items ordered for a specific product;
- **productPrice (required)** - `number`: the unit price of a product.

Here is an example of a created order:

```json
{
  "id": "0001",
  "items": [
    {
      "name": "Tachipirina*10cpr div 500mg",
      "imageUrl": "https://imageurl.com",
      "quantity": 1,
      "productPrice": 2.75
    }
  ],
  "address": "P.za della Repubblica, 00185 Roma RM, Italy",
  "status": {
    "code": 1,
    "label": "Creato"
  },
  "deliveryDate": "2022-12-01T17:29:28.5521942",
  "paymentLink": "https://paymentLink.com",
  "price": {
    "subtotal": 2.75,
    "shippingCosts": 3
  }
}
```

### GET /orders

Get a list of orders for the current logged-in user.

#### Query parameters

This request accepts the following query parameters:

- **_sk** - `number`: the number of elements to skip a paginated request (defaults to 0);
- **_l** - `number`: the number of elements returned from a single request (defaults to 200).

#### Response

Returns an array of orders. An order object has the following properties:

- **customOrderId (required)** - `string`: the order id stored in the **MIA_ORDERS_CRUD_ENDPOINT** CRUD;
- **status (required)** - `number`: the current order status, one of the described [order states](#order-states);
- **subtotal (required)** - `number`: the total cost of an order without the shipping costs;
- **shippingCosts** - `number`: the shipping costs of an order;
- **items (required)** - `array of placed order items`: the items contained in the order.

A placed order item has the following properties:

- **product (required)** - `object`: a specific product in the order placed by the customer;
- **quantity (required)** - `number`: the number of items ordered for a specific product;
- **unitPrice (required)** - `number`: the price of a single item;
- **delivery** - `date`: the order estimated or actual delivery date (expressed in format **ISO 8601**);
- **paymentLink** - `string`: the optional link for processing the order payment;
- **deliverySteps** - `array of delivery steps`: an optional array of items containing the order tracking information.

The `product` object the following properties:

- **id (required)** - `number`: the item id;
- **name (required)** - `string`: the product name;
- **description (required)** - `string`: the product description;
- **price (required)** - `string`: the product price;
- **image** - `string`: the product image URL.

A delivery step object has the following properties:

- **date** - `date`: the estimated or actual date of completion of a delivery step of an order (expressed in format **ISO 8601**);
- **isDone** - `boolend`: a boolean indicating whether the delivery step has taken place or not;
- **label (required)** - `string`: a label that describes the current delivery step, such as the order status or the current location of the order.

An example of a complete endpoint response is the following:

```json
[
  {
    "customOrderId": "6dfrkr",
    "status": 1,
    "subtotal": 2.75,
    "shippingCosts": 3,
    "items": [
      {
        "product": {
          "id": 114,
          "name": "TACHIPIRINA*10CPR DIV 500MG",
          "description": "TACHIPIRINA*10 cpr div 500 mg",
          "image": "https://imageurl.com"
        },
        "quantity": 1,
        "unitPrice": 2.75
      }
    ],
    "delivery": "2022-12-01T17:29:28",
    "paymentLink": "https://paymentLink.com",
    "deliverySteps": [
      {
        "date": "2022-12-01T15:49:30.088Z",
        "label": "created"
      },
      {
        "date": "2022-12-01T17:29:28",
        "isDone": false,
        "label": "delivery"
      }
    ]
  },
  {
    "customOrderId": "tuq7o9",
    "status": 15,
    "subtotal": 10.7,
    "shippingCosts": 3,
    "items": [
      {
        "product": {
          "id": 3761,
          "name": "MOMENT*24CPR RIV 200MG",
          "description": "MOMENT*24 cpr riv 200 mg",
          "image": "https://imageurl.com",
        },
        "quantity": 1,
        "unitPrice": 10.7
      }
    ],
    "delivery": "2022-10-05T13:29:40",
    "deliverySteps": [
      {
        "date": "2022-10-05T09:33:37.041Z",
        "label": "created"
      },
      {
        "date": "2022-10-05T13:29:40",
        "isDone": false,
        "label": "delivery"
      }
    ]
  }
]
```

:::info
As in the previous sections, all the prices of an order are in euro (€).
:::
