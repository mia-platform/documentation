# Mail Notification Service

[TOC]

## Introduction

This microservice allows sending e-mails via AWS SES or SMTP.
This service must be explicitly included in a project in case you want to send push notifications. 

## Requirements

### SES

The microservice uses `Amazon SES` service in order to send email.
You need the `key` and the `secret` of the SES service. You can also specify the `region` you want to rely (it's default value is `us-east-1`).

### SMTP

The microservices uses `SMTP` in order to send email.
You need `HOST` and `PORT` (default: 587) of the `SMTP` server. You can also specify security configurations in order to use `TLS`.

SMTP authentication is by default ensured by `login` method, by providing `username` and `password`.

## API

The microservice accepts POST requests at the following path :

- `BASE_URL/send`

- `BASE_URL/send/split-receivers`: each receiver will see itself as single main receiver of the email.

Request `body` has to contain the following parameters :

- `recipient`: string or array of strings with at least an email address

- `subject`: string

- `sender` (or from for multipart email): string representing an email address

Optionally you can include:

- `cc`: array of strings

- `bcc`: array of strings

- `message` : string