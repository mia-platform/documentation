---
id: overview
title: Payment Gateway Manager
sidebar_label: Overview
---
The **Payment Gateway Manager (PGM)** is a microservice responsible to encapsule the payment processing logic across different Payment Providers.

The payment processing logic includes:
* **Request a payment** on a payment provider
* **Request a refund** on a payment provider
* **Transaction Status Verification**:
    - **M2M Callback**: handling of payment transactions' M2M callbacks from a payment provider
    - **On-Demand**: on-demand transaction status check on the payment provider
    - Both may end in a **result notification push** towards an external service
    
## Interfaces
The *PGM* interfaces aim to be Payment Provider agnostic.
In this way an eventual Payment Provider's change does not involve huge modifications for the services leveraging the *PGM*.

* Payment Request: `POST /{provider}/{payment-method}/pay`
* Refund Request: `POST /{provider}/{payment-method}/refund`
* M2M Callback Transaction Status Verification: `GET /{provider}/callback`
* On-Demand Transaction Status Verification: `GET /{provider}/check`

## Supported Providers and Payment Methods
| Provider\Payment Method | credit-cards | applepay | googlepay | pay-pal | satispay |
|-------------------------|--------------|----------|-----------|---------|----------|
| gestpay (Axerve)        | ✓            | ✓        | ✓         |         |          |

## Notes

:::warning
At the moment the currency used for payments is not configurable and is set to be Euros by default
:::
