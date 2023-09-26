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
* **Manage Subscriptions** on a payment provider
* **Transaction Status Verification**:
    - **M2M Callback**: handling of payment transactions' M2M callbacks from a payment provider
    - **On-Demand**: on-demand transaction status check on the payment provider
    - Both may end in a **result notification push** towards an external service

The **Payment Gateway Manager** interfaces aim to be agnostic to the payment provider used.
This way an eventual payment provider's change does not involve huge modifications for the services leveraging this microservice.
Some providers may require additional fields, in which case they will be wrapped in a single, optional object field.

## Supported Providers and Payment Methods

| Provider   | Credit Cards | ApplePay | GooglePay | PayPal | Satispay | Scalapay | Soisy |
|------------|--------------|----------|-----------|--------|----------|----------|-------|
| Axerve     | ✓            | ✓        | ✓         | ✓      | ✓        |          |       |
| Adyen      | ✓            |          |           |        |          |          |       |
| Braintree  |              |          |           | ✓      |          |          |       |
| Satispay   |              |          |           |        | ✓        |          |       |
| Scalapay   |              |          |           |        |          | ✓        |       |
| Soisy      |              |          |           |        |          |          | ✓     |
| Stripe     | ✓            |          |           |        |          |          |       |

## Supported Providers and Subscriptions type

| Provider  | Manual | Automatic | Payment Methods      |
|-----------|--------|-----------|----------------------|
| Axerve    | ✓      |           | Credit Cards, PayPal |
| Adyen     | ✓      |           | Credit Cards         |
| Braintree |        | ✓         | PayPal               |
| Satispay  | ✓      |           |                      |
| Scalapay  |        |           |                      |
| Soisy     |        |           |                      |
| Stripe    |        | ✓         | Credit Cards         |

## Supported Providers with Pay By Link

| Provider  | Pay By Link |
|-----------|-------------|
| Axerve    | ✓           |
| Adyen     | ✓           |
| Braintree |             |
| Satispay  |             |
| Scalapay  |             |
| Soisy     |             |
| Stripe    | ✓           |
