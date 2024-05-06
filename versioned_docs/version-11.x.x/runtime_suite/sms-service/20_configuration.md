---
id: configuration
title: SMS Service
sidebar_label: Configuration
---
SMS Service allows sending SMS through a specific service provider.

For now, the only service provider supported is [Twilio][twilio].

## Authentication

### Twilio service provider

The service needs an [API Key][twilio-api-keys] to authenticate your requests to Twilio. 
This kind of revocable credential can be created in your [Twilio console][twilio-console].

## Environment variables

The SMS Service accepts the following environment variables.

- **SERVICE_PROVIDER (required)**: the service used to send the message. For now, it can only be `twilio`.

- **TWILIO_ACCOUNT_SID**: the SID of your Twilio Account. Required when `SERVICE_PROVIDER` is Twilio.
  
- **TWILIO_AUTH_TOKEN**: your Auth Token from Twilio. Required when `SERVICE_PROVIDER` is Twilio.

- **TWILIO_EMPTY_BALANCE_CHECK**: boolean that activates the check on the balance before sending SMS. It allows SMS posting only with positive balance. It defaults to false.

- **RATE_LIMIT_MAX_REQUESTS**: maximum number of requests that can be received by the service in a certain time window. It must be a positive integer.

- **RATE_LIMIT_TIME_WINDOW**: time window in which the service max number of request is counted. It can be expressed in milliseconds or as a string (in the [ms format][ms-format]). It can be configured within a certain range.

- **EXPONENTIAL_DELAY_RESET_AFTER**: time window after which the exponential delay in requests to send sms to the same phone number is reset to zero. It is expressed in seconds.

[twilio]: https://www.twilio.com/
[twilio-api-keys]: https://www.twilio.com/docs/usage/api/keys
[twilio-console]: https://www.twilio.com/console
[ms-format]: https://github.com/vercel/ms
