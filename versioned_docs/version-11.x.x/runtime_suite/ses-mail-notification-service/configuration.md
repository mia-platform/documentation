---
id: configuration
title: SES Mail Notification Service
sidebar_label: Configuration
---
The Mail Notification Service allows sending e-mails via **AWS SES** or **SMTP**.

:::info
This page serves as common documentation for both the SES Mail Notification Service and the SMTP Mail Notification Service, which can be found in the Marketplace.
:::

## Requirements

You can configure this service to send e-mails with one of the following modes:

- [**SES:**](#SES) to use `Amazon SES` to send e-mails
- [**SMTP:**](#SMTP) to use `SMTP` to send e-mails

### SES

The microservice will use `Amazon SES` service in order to send e-mails.
You will need to provide the `key` and the `secret` of a previously configured SES. You can also specify the `region` you want to rely on (the default value is `us-east-1`).

Here is a list of the variables used to configure the service:

- SES_KEY (string)
- SES_SECRET (string)
- SES_REGION (string | default: `us-east-1`)

### SMTP

The microservice will use `SMTP` in order to send e-mails.
You will need to provide the `HOST` and `PORT` (default: 587) of an `SMTP` server. You can also specify security configurations in order to use `TLS`.

SMTP authentication is ensured by default with the `login` method, which requires a `username` and a `password`.

Here is a list of the variables used to configure the service:

- HOST (string),
- PORT (number | default: 58)
- AUTH_TYPE: `login`
- AUTH_USER: (string)
- AUTH_PASS: (string)
- TLS_SECURE: (boolean | default: false)
- TLS_IGNORE: (boolean | default: true)


If you want to use Gmail, have a look at [this page](https://nodemailer.com/usage/using-gmail/).
