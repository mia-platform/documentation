---
id: configuration
title: SES Mail Notification Service
sidebar_label: Configuration
---
Mail Service allows sending e-mails via **AWS SES** or **SMTP**.

## Requirements

You can configure this service to send emails with one of the following modes:

- [**SES:**](#SES) to use `Amazon SES` to send emails
- [**SMTP:**](#SMTP) to use `SMTP` to send emails

### SES

The microservice uses `Amazon SES` service in order to send email.
You need the `key` and the `secret` of the SES service. You can also specify the `region` you want to rely (it's default value is `us-east-1`).

### SMTP

The microservices uses `SMTP` in order to send email.
You need `HOST` and `PORT` (default: 587) of the `SMTP` server. You can also specify security configurations in order to use `TLS`.

SMTP authentication is by default ensured by `login` method, by providing `username` and `password`.

If you want to use gmail, have a look to [this page](https://nodemailer.com/usage/using-gmail/).
