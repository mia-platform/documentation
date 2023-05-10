---
id: configuration
title: SMS Service
sidebar_label: Configuration
---
SMS Service allows sending SMS through a specific service provider.

For now, the only service provider supported is [Twilio](https://www.twilio.com/).

## Authentication

### Twilio service provider

The service needs an [API Key](https://www.twilio.com/docs/usage/api/keys) to authenticate your requests to Twilio. 
This kind of revocable credential can be created in your [Twilio console](https://www.twilio.com/console).

## Environment variables

The SMS Service accepts the following environment variables.

- **SERVICE_PROVIDER (required)**: the service used to send the message. For now, it can only be `twilio`.

- **TWILIO_ACCOUNT_SID**: the SID of your Twilio Account. Required when `SERVICE_PROVIDER` is Twilio.
  
- **TWILIO_AUTH_TOKEN**: your Auth Token from Twilio. Required when `SERVICE_PROVIDER` is Twilio.
