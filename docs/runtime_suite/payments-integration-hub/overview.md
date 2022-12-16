---
id: overview
title: Overview
sidebar_label: Overview
---
This application allows you to setup all the microservices, endpoints, collections and variables in order to deliver a [Backoffice application](../../business_suite/backoffice/overview) with the following sections:
- **Payments Page** page to manage payments stored on the database and perform actions on transactions
- **Analytics Page** page for monitoring KPIs related to payments transactions

By default the application is configured to accept two kind of users: **admin** and **analyst**.

The application is based on [Backoffice application](../../business_suite/backoffice/overview) and is fully customizable. The aim of this application is to provide a backoffice application specifically configured for payments management with all the microservices needed to enable specific action of payments (e.g. refund, download invoice, user notification...).
The application is configured to use Auth0 as authentication provider by default.
For more details on how to configure the pages you can refers to [dedicated section](./configuration.md) or [Backoffice documentation](../../business_suite/backoffice/overview).

## Backoffice Sections

### Payments Page
On the **Payments page** is shown a table with all the transactions stored on the database. For each transactions are available the following information:
- **Date**: creation date of the payment
- **Transaction ID**: unique ID of the payment
- **Current status**: current status of the payment (e.g. __Authorized__, __Cancelled__, __Refunded__)
- **Amount**: amount of the payment
- **Payment method**: method of the payment
- **Payment provider**: provider of the payment

The list of payments can be filtered for each of the above information.

For each transaction are available the following actions:
- **refund** the payment
- **download** invoice of the payment
- **send** invoice of the payment to the customer
- **send** notification of the payment to the customer

It is available a dedicated view for each payment by clicking the dedicated button that redirects the user to a page with the following information:
- **Overview section**
    - **Transaction ID**
    - **Transaction date**
    - **Current status**
- **Payment section**
    - **Channel** of the payment
    - **Payment method**
    - **Payment provider**
    - **Amount**
- **User section**
    - **User ID**

### Analytics Page
On **Analytics page** are shown the following plots and KPIs:
- **Daily payments**: stock chart that shown the number and the amount of the payments over days; the plot can be filtered both with temporal filters (e.g. YTD, MTD or custom time frame) and business field (e.g. channel and payment providers).
- **Percentage** of payments on each status (e.g. __Authorized__, __Completed__,__Refunded__).
- **Payments by Provider**: stock chart that shown the amount of payments grouped by payment provider; the plot can be filtered with temporal filters.
- **Payments by Channel**: stock chart that shown the amount of payments grouped by channel; the plot can be filtered with temporal filters.

## Microservices

The following microservices will be included:
- **crud-service** in order to retrieve and update data from tha database
- **microlc-frontend** provides the frontend functionalities of backoffice powered by [micro-lc](https://github.com/micro-lc/micro-lc)
- **microlc-backend** provides the backend functionalities of backoffice powered by [micro-lc](https://github.com/micro-lc/micro-lc); here is possible to define the configuration for each page of the application
- **element-composer** enables orchestration of multiple micro-frontend
- **back-kit** provides ready-to-use frontend components that can be included into backoffice
- **data-visualization-frontend** enables the visualization of [dashboards and plots](../../business_suite/data-visualization)into the backoffice
- **data-visualization-backend** enables the configuration of [dashboards and plots](../../business_suite/data-visualization) that will be shown by __data-visualization-frontend__ microservice
- **analytics-transactions** provides the aggregations data that will be shown on dashboards; this microservices is a ready-to-use version of [MongoDB Reader Plugin](../../runtime_suite/mongodb-reader/configuration) available in the [Marketplace](../../marketplace/overview_marketplace)
- **payment-gateway-manager** enables the actual execution of the [refund feature](../../runtime_suite/payment-gateway-manager/how_it_works#4-refund)
- **pgm-adapter** provides the payment data storage feature communicating with **payment-gateway-manager** and **crud-service**.
- **invoice-service** generates an invoice of a payment in pdf format

## Endpoints

The following endpoints will be included:
- **/transactions** : transactions CRUD collection
- **/transactions-view** : transactions MongoDB View
- **/payment-gateway-manager** : payment-gateway-manager service
- **/pgm-adapter** : pgm-adapter service
- **/** : backoffice home page application
- **/api** : microlc-backend APIs needed to expose backoffice configurations
- **/element-composer** : element-composer APIs needed to manage multiple microfrontend
- **/data-visualization** : expose data visualization APIs needed to show dashboards and plots
- **/api/charts/dashboards** : expose defined dashboards
- **/analytics** : expose KPIs and aggregated data
- **/invoice** : invoice-service

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

## CRUD Collection

A **payments** collection will be included in the project and by default is used as database reference use to retrieve payments information.
The application can use any MongoDB collection to retrieve payments information: for further details on how to configure the application refer to the dedicated [section](./configuration.md)
The following schema is used in the collection, designed to be compatible with [payment gateway manager](../../runtime_suite/payment-gateway-manager/overview):
- **shopTransactionID**: the unique id of your transaction
- **paymentID**: Payment transaction id as returned by the provider
- **createdAt**: creation date of the document; this field is automatically created by the [crud-service](../../runtime_suite/crud-service/overview_and_usage) and is used as payment creation date
- **amount**: amount of the transaction
- **currentStatus**: current status of the payment
- **states**: array with the history of the payment
    - **date**: date related to the creation of this status
    - **businessState**: business state of the payment
    - **paymentState**: technical state of the payment
    - **failureDescription**: optional description of the failure 
- **paymentMethod**: payment method used
- **provider**: provider used for the payment
- **providerData**: object with the data returned by the provider; the schema of this object can change based on the provider used
- **isRecurrent**: boolean to identify recurrent payments
- **recurrentDetails**: object with information related to the recurrence of the payment
- **buyer**: buyer information
    - **name**: name of the buyer
    - **email**: email of the buyer
- **creditCardToken**: token used by recurrent payment
- **sessionToken**
- **additionalData**: optional object to store data related to the payment
- **refundedAmount**: refunded amount of the payment

## Authorization

The [authorization-service](../../runtime_suite/authorization-service/overview) is added (if it does not already exist) in order to manage the [authorization flow](../../development_suite/set-up-infrastructure/authorization-flow). It is created with a standard configuration, with `USERINFO_URL` pointing to the `auth0-client` service.
The [auth0-client](../../runtime_suite/auth0-client/overview_and_usage) is added (if it does not already exist) in order to handle authentication and user management using Auth0 as identity provider.

For further details on authorization application you can refer to the [dedicated documentation](../../runtime_suite/secure-apigateway/overview).
