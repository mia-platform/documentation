---
id: configuration
title: Configuration
sidebar_label: Configuration
---



The microservice uses the following environment variables:

- `MANDRILL_API_KEY` (required): Mandrill API key to send transactional emails. It can be created on the Mandrill portal.

- `MAILCHIMP_URL` (required): the Mailchimp API URL is similar to the following `https://usxx.api.mailchimp.com/3.0/`

  - The `xx` in the `MAILCHIMP_URL` varies depending on the Mailchimp account that has been created
  - The `xx` in the `MAILCHIMP_URL` can be found in the URL bar after the Login on the Mailchimp website

- `MAILCHIMP_API_KEY` (required): API key to be created on Mailchimp Dashboard to allow the interaction with Mailchimp APIs
