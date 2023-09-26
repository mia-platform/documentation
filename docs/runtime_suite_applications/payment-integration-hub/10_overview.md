---
id: overview
title: Overview
sidebar_label: Overview
---
The Payment Integration Hub application builds a single interface to connect multiple payment gateways with only a few clicks and allows you to manage quickly and easily **payments** and **refunds**, guarantee transaction **consistency** and possible remediation in a **secure** and **compliant** way, in fact it does not save any data related to the payment method.

It is also available a white label front-end with **adaptive checkout** and a ready to use [backoffice](../../business_suite/backoffice/overview) to perform **actions** on the transactions and customizable **dashboards** for monitoring all payments KPI. 

## Application Architecture

### Microservices

The Payment Integration Hub is composed by:
1. [Payment Gateway Manager](../../runtime_suite/payment-gateway-manager/how_it_works) exposes an unique interface for all the payment methods enabled by different providers and implements all the payment related functionalities.
2. Subscription Handler manage subscriptions and the creation of new payments
3. The **payment saga** is used to orchestrate the above services; it is implemented with the [Flow Manager Service](../../runtime_suite/flow-manager-service/overview) and it is fully customizable.
3. The **subscription saga** is used to define the subscription life-cycle; it is implemented with the [Flow Manager Service](../../runtime_suite/flow-manager-service/overview) and it is fully customizable. 

2. A set of microservices that implement some functionality to support the payment process:
    - the [Invoice Service](../../runtime_suite/invoice-service/overview) generates an invoice of a payment in pdf format;
    - the [Mail Notification Service](../../runtime_suite/ses-mail-notification-service/usage) used to notify the user about the outcome of payment;
    - the **Frullino Service** handle payment pending by periodically checking their status of through the provider and updates the payment state accordingly;
    - the **payment front end** provides a UI to accompany the end user to complete the payment with the chosen method with the related **back end for front end**;
    - the [Backoffice](../../business_suite/backoffice/overview) allows to perform actions on payments.

Other platform plugins are included in order to enable some side functionalities.

### Endpoints

The following endpoints are exposed by default:
- **/payment** exposes the frontend
- **/pgm-bff** exposes the backend for frontend functionalities


## CRUD Collection

### Transaction Saga
A *transactions_saga* collection will be included in the project and by default is used as database reference to retrieve payments information.
The application can use any MongoDB collection to retrieve payments information: for further details on how to configure the application refer to the dedicated [section](./50_configuration.md).
More details about the schema of the collection can be found in the dedicated [section](./20_payment_saga.md).

### Subscription Saga
A *subscription_saga* collection will be included in the project and by default is used as database reference to retrieve subscription information.
The application can use any MongoDB collection to retrieve subscription information: for further details on how to configure the application refer to the dedicated [section](./50_configuration.md).
More details about the schema of the collection can be found in the dedicated [section](./30_subscription_saga.md).

### Invoice
An *invoices* collection will be included in the project and by default is used as database reference to retrieve and store the invoices generated.
The following schema is used in the collection, designed to be compatible with [files-service](../../runtime_suite/files-service/configuration):
- **name**: original file name
- **file**: unique name of the file that should be used to retrieve it
- **size**:  size in bytes of the invoice
- **location**: the URL that can be used to download the invoice
- **sagaId**: the transaction saga id related to the invoice
