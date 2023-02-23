---
id: overview
title: Overview
sidebar_label: Overview
---
This application allows you to set up all the microservices, endpoints, collections and variables in order to deliver a [Backoffice application](../../business_suite/backoffice/overview) with the following sections:
- **Transactions Page** page to manage payments stored on the database and perform actions on transactions
- **Analytics Page** page for monitoring KPIs related to payments transactions

By default, the application is configured to accept two kind of users: **admin** and **analyst**.

The application is based on [Backoffice application](../../business_suite/backoffice/overview) and is fully customizable. The aim of this application is to provide a backoffice application specifically configured for payments management with all the microservices needed to enable specific action of payments (e.g. refund, download invoice, user notification...).

For more details on how to configure the pages you can refer to [dedicated section](./configuration.md) or [Backoffice documentation](../../business_suite/backoffice/overview).

## Backoffice Sections

### Transactions Page
On the **Transactions page** is shown a table with all the transactions stored on the database. For each transaction the following information are available:
- **Status**: current status of the payment (e.g. **Created**, **Paid**, **Partially Refunded**, **Totally Refunded**)
- **Date**: creation date of the payment
- **Transaction ID**: unique ID of the payment set by the merchant
- **Amount**: amount of the payment
- **Method**: method of the payment
- **Channel**: channel used for the payment

The list of transactions can be filtered by status, date and/or amount. Moreover a search bar allows to find a transaction via its ID.

For each transaction the following actions are available:
- **refund** the payment (partially or totally)
- **download** invoice of the payment
- **send notification** about the payment to the customer (at the moment only emails are supported)

:::note
The **refund** and **download** actions are available also as bulk actions
:::

In addition it is possible to export payments information in CSV or Excel format.

It is available a dedicated view for each payment by clicking the dedicated button that redirects the user to a page with the following information:
- **Overview section**
    - Transaction ID
    - Transaction date
    - Current status
- **User section**
    - User ID
    - User name
    - User email
- **Payment section**
    - Amount
    - Payment provider
    - Payment method
    - Channel used for payment
    - Total refunded amount
- **History section**
    - Date
    - Status
    - Event
    - Refunded amount (optional)

### Analytics Page
On **Analytics page** are shown the following plots and KPIs:
- **Daily payments**: stock chart that shows the amount of the payments over days; the plot can be filtered both with temporal filters (e.g. YTD, MTD or custom time frame).
- **Percentage** of payments on each status (e.g. _Payment Created_, _Payment Paid_, _Payment Partially Refunded_, _Payment Totally Refunded_, _Payment Failed_).
- **Payments Amount by Method**: stock chart that shows the amount of payments grouped by payment method; the plot can be filtered with temporal filters.
- **Payments Amount by Channel**: stock chart that shows the amount of payments grouped by payment channel; the plot can be filtered with temporal filters.

## Microservices

The following microservices will be included:
- **crud-service** in order to retrieve and update data from tha database
- **microlc-frontend** provides the frontend functionalities of backoffice powered by [micro-lc](https://github.com/micro-lc/micro-lc)
- **microlc-backend** provides the backend functionalities of backoffice powered by [micro-lc](https://github.com/micro-lc/micro-lc); here is possible to define the configuration for each page of the application
- **element-composer** enables orchestration of multiple micro-frontend
- **back-kit** provides ready-to-use frontend components that can be included into backoffice
- **data-visualization-frontend** enables the visualization of [dashboards and plots](../../business_suite/data-visualization) into the backoffice
- **data-visualization-backend** enables the configuration of [dashboards and plots](../../business_suite/data-visualization) that will be shown by __data-visualization-frontend__ microservice
- **analytics-transactions** provides the aggregations data that will be shown on dashboards; these microservices is a ready-to-use version of [MongoDB Reader Plugin](../../runtime_suite/mongodb-reader/configuration) available in the [Marketplace](../../marketplace/overview_marketplace)
- **export-service** enables [the export](../../runtime_suite/export-service/overview) of the transactions as csv/excel format
- **payment-gateway-manager** enables the actual execution of the [transaction-related features](../../runtime_suite/payment-gateway-manager/how_it_works)
- **flow-manager-service** orchestrates all the flow of a payment by using [events and commands](../../runtime_suite/flow-manager-service/overview)
- **invoice-service** [generates an invoice](../../runtime_suite/invoice-service/overview) of a payment in pdf format
- **pgm-bff** a backend for frontend that manages the communication between frontends and backend
- **files-service** allows you to [upload and download](../../runtime_suite/files-service/configuration) the generated invoices to a MongoDB
- **payment-integration-service** sends an email notification for some payment states as payment paid, payment failed, payment refunded etc
- **smtp-mail-notification-service** sends [emails](../../runtime_suite/ses-mail-notification-service/usage)
- **frullino-service** periodically checks the status of pending payments through the provider and updates the payment state accordingly
- **payment-front-end** a frontend that provides a UI for the payment flow

## Endpoints

The following endpoints will be included:
- **/** : backoffice home page application
- **/api** : microlc-backend APIs needed to expose backoffice configurations
- **/element-composer** : element-composer APIs needed to manage multiple microfrontend
- **/back-kit** : back-kit service
- **/data-visualization** : expose data visualization APIs needed to show dashboards and plots
- **/api/charts/dashboards** : expose defined dashboards
- **/analytics** : expose KPIs and aggregated data
- **/payment-gateway-manager** : payment-gateway-manager service
- **/fm** : flow-manager-service
- **/pgm-bff** : backend for frontend service of the payment gateway manager
- **/export** : expose export-service for CSV/Excel exports
- **/payment** : expose payment-front-end service to perform new transactions

## Public Variables

The following public variables will be included for managing microservices versions:
- **BACK_KIT_VERSION**
- **MICROLC_FRONTEND_VERSION**
- **MICROLC_BACKEND_VERSION**
- **MICROLC_ELEMENT_COMPOSER_VERSION**
- **DATA_VIZ_FE_VERSION**
- **DATA_VIZ_BE_VERSION**
- **ANALYTICS_TRANSACTIONS_VERSION**
- **EMAIL_SENDER**
- **CRUD_SERVICE_VERSION**
- **PGM_VERSION**
- **PROJECT_HOST**

## CRUD Collection

A *transactions_saga* collection will be included in the project and by default is used as database reference use to retrieve payments information.
The application can use any MongoDB collection to retrieve payments information: for further details on how to configure the application refer to the dedicated [section](./configuration.md)
The following schema is used in the collection, designed to be compatible with [payment gateway manager](../../runtime_suite/payment-gateway-manager/overview):
- **sagaId**: the unique saga id of payment flow
- **isFinal**: boolean to indicate if a state is final or not
- **metadata**: object with information related to the payment
    - **shopTransactionID**: the unique id of your transaction
    - **amount**: amount of the transaction
    - **paymentMethod**: payment method used
    - **provider**: provider used for the payment
    - **isRecurrent**: boolean to identify recurrent payments
    - **recurrenceDetails**: object with information related to the recurrence of the payment
    - **buyer**:  object with buyer information
    - **paymentID**: payment transaction id as returned by the provider
    - **sessionToken**
    - **additionalData**: optional object to store data related to the payment
    - **refundDetails**: object with the data related the refunded payment
    - **payRequestData**: object with the data related to the payment request
    - **refundRequestData**: object with the data related to the refund request
- **currentState**: state of the payment
- **latestEvent**: latest event emitted by the flow manager
- **associatedEntityId**: an entity identifier connected with the flow manager
- **events**: array with the history of events emitted
- **history**: object that contains the history of the payment (states and events)
- **businessStateId**: identifier of the business state
- **businessStateDescription**: description of the current business state


An *invoices* collection will be included in the project and by default is used as database reference use to retrieve and store the invoices generated.
The following schema is used in the collection, designed to be compatible with [files-service](../../runtime_suite/files-service/configuration):
- **name**: original file name
- **file**: unique name of the file that should be used to retrieve it
- **size**:  size in bytes of the invoice
- **location**: the URL that can be used to download the invoice
- **sagaId**: the transaction saga id related to the invoice

## Supported Payment Combinations

The following table represents the payment combinations supported by the application

| Provider \ Method | credit-cards       | applepay | googlepay | pay-pal            | satispay           | scalapay           | safecharge | soisy              | stripe             |
|-------------------|--------------------|----------|-----------|--------------------|--------------------|--------------------|------------|--------------------|--------------------|
| gestpay           | :white_check_mark: | :x:      | :x:       | :white_check_mark: | :white_check_mark: |                    |            |                    |                    |
| satispay          |                    |          |           |                    | :white_check_mark: |                    |            |                    |                    |
| unicredit         | :x:                |          |           |                    |                    |                    |            |                    |                    |
| braintree         |                    |          |           | :white_check_mark: |                    |                    |            |                    |                    |
| scalapay          |                    |          |           |                    |                    | :white_check_mark: |            |                    |                    |
| safecharge        |                    |          |           |                    |                    |                    | :x:        |                    |                    |
| soisy             |                    |          |           |                    |                    |                    |            | :white_check_mark: |                    |
| stripe            |                    |          |           |                    |                    |                    |            |                    | :white_check_mark: |
