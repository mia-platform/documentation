---
id: apis
title: APIs
sidebar_label: APIs
---
The client offers many APIs to communicate with Faire AI services. They are described below.

## Persons

Operations on person entities:

- `POST - /persons`: create a person
- `GET - /persons`: get all persons
- `GET - /persons/{personId}`: get a person
- `PUT - /persons/{personId}`: update a person
- `DELETE - /persons/{personId}`: delete a person

## Accounts

Operations on account entities:

- `POST - /accounts`: create new account
- `GET - /accounts`: get accounts of a person
- `GET - /accounts/{accountId}`: get account
- `DELETE - /accounts/{accountId}`: delete account
- `PATCH - /accounts/{accountId}`: update account operations
- `POST - /accounts/{accountId}/transactions`: add transaction to existing account
- `GET - /accounts/{accountId}/transactions`: get transactions by account
- `PUT - /accounts/{accountId}/transactions/{transactionId}/recurrence`: update transaction recurrence
- `PUT - /accounts/{accountId}/transactions/{transactionId}/category`: update transaction category
- `GET - /accounts/transactions/categories`: list all categories

## Account Connections

Operations on account connection entities:

- `POST - /account-connections`: initialize account connection
- `GET - /account-connections`: return all account connections
- `GET - /account-connections/{id}`: return an account connection

## KPIs

- `GET - /kpis`: get person or account KPIs
- `GET - /kpis/list`: list all available KPIs

## Loan Products

Operations on loan product entities:

- `POST - /loan-products`: create a loan product
- `GET - /loan-products`: get all loan product
- `GET - /loan-products/{loanProductId}`: get a loan product
- `PUT - /loan-products/{loanProductId}`: update a loan product
- `PATCH - /loan-products/{loanProductId}/scheduled-activation`: change loan product scheduled activation
- `GET - /loan-products/{loanProductId}/simulation`: get loan simulation
- `PATCH - /loan-products/{loanProductId}/status`: change loan product status to active or inactive

## Loans

Operations on loan entities:

- `POST - /loans`: create a new loan
- `GET - /loans`: retrieve the loans
- `GET - /loans/{loanId}`: retrieve a loan
- `PATCH - /loans/{loanId}`: update loan
- `PATCH - /loans/{loanId}/instalments/{instalmentReference}`: repay instalment

## Additional information

For additional information visit [Faire AI documentation](https://platform-dev.faire.ai/docs/).
