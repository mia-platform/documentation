---
id: overview
title: Payment Gateway Manager
sidebar_label: Overview
---
The **Payment Gateway Manager (PGM)** is a microservice responsible to encapsulate the payment processing logic across
different Payment Providers.

The payment processing logic includes:
* **Request a payment** on a payment provider
* **Request a refund** on a payment provider
* **Transaction Status Verification**:
    - **M2M Callback**: handling of payment transactions' M2M callbacks from a payment provider
    - **On-Demand**: on-demand transaction status check on the payment provider
    - Both may end in a **result notification push** towards an external service
* **Manage a transaction session** on a payment provider (e.g. to perform 3D-Secure authentication) 

## Interfaces

The *PGM* interfaces aim to be Payment Provider agnostic.
This way an eventual Payment Provider's change does not involve huge modifications for the services leveraging the *PGM*.
Some providers may require additional fields, in which case they will be wrapped in a single, optional object field.

* Payment Request: `POST /{provider}/{payment-method}/pay`
* Recurrent Payment Request: `POST /{provider}/{payment-method}/pay/recurrent`
* Payment with Authorization Confirmation Request: `POST /{provider}/{payment-method}/confirm`
* Refund Request: `POST /{provider}/{payment-method}/refund`
* M2M Callback Transaction Status Verification: `GET /{provider}/callback`
* On-Demand Transaction Status Verification: `GET /{provider}/check`
* Get status of a Transaction: `GET /{provider}/status?shopTransactionID={shopTransactionID}`
* Open a Session `POST /{provider}/session/open`
* Settle a session transaction: `POST /{provider}/session/confirm`
* Void a session transaction: `POST /{provider}/session/void`
* Refund (totally or partially) a session transaction: `POST /{provider}/session/refund` 
* Check the status of the session: `POST /{provider}/session/check`

## Supported Providers and Payment Methods

| Provider         | credit-cards | applepay | googlepay | pay-pal | satispay | scalapay | safecharge | soisy | stripe |
|------------------|--------------|----------|-----------|---------|----------|----------|------------|-------|--------|
| gestpay (Axerve) | ✓            | ✓        | ✓         | ✓       | ✓        |          |            |       |        |
| satispay         |              |          |           |         | ✓        |          |            |       |        |
| unicredit        | ✓            |          |           |         |          |          |            |       |        |
| braintree        |              |          |           | ✓       |          |          |            |       |        |
| scalapay         |              |          |           |         |          | ✓        |            |       |        |
| safecharge       |              |          |           |         |          |          | ✓          |       |        |
| soisy            |              |          |           |         |          |          |            | ✓     |        |
| stripe           |              |          |           |         |          |          |            |       | ✓      |

## Utility APIs

When possible, the PGM will expose utility APIs for some providers. These APIs abstract contour operations to the 
developer and allow focusing on the payment process itself, rather than setup processes. The BrainTree helper suite is 
a clear example of this concept.

## Flow Manager APIs

The PGM is able to communicate with Flow Manager service via REST APIs. In particular it can send some events and it can
process some commands using dedicated APIs.

## Documentation

You can view the Swagger compatible OpenAPI documentation by calling the `/documentation` endpoint. 
You can also use `/documentation/openapi.json` as the documentation endpoint in the microservice configuration to add it
to the API Portal.

## Notes

:::warning
At the moment the currency used for payments is not configurable and is set to be Euros by default, except for session operations.
:::
