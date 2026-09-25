---
id: configuration
title: SMS Service
sidebar_label: Configuration
---



SMS Service allows sending SMS through [Twilio][twilio] or [Kaleyra][kaleyra].

## Authentication

### Kaleyra

The service needs an [API Key][kaleyra-api-key].

For more information about setting up a Kaleyra account, please refer to the [official Kaleyra documentation][kaleyra-getting-started].

### Twilio

The service needs an [API Key][twilio-api-keys] to authenticate your requests to Twilio.

This kind of revocable credential can be created in your [Twilio console][twilio-console].

## Environment variables

The SMS Service accepts the environment variables listed in the following table.

All environment variables starting with `TWILIO_` or `KALEYRA_` respectively apply only to Twilio or Kaleyra provider.

| Name                          | Required                           | Default    | Minimum version | Description                                                                                                                                            |
|-------------------------------|------------------------------------|------------|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| SERVICE_PROVIDER              | Yes                                | -          | 1.0.0           | The provider used to send the message. Admitted values: `twilio`, `kaleyra` (since version 1.2.0).                                                     |
| RATE_LIMIT_MAX_REQUESTS       | No                                 | 100        | 1.1.0           | Maximum number of requests in a certain time window. It must be greater than zero.                                                                     |
| RATE_LIMIT_TIME_WINDOW        | No                                 | `1 minute` | 1.1.0           | Time window in which the service max number of request is counted. It can be expressed in milliseconds or as a string (in the [ms format][ms-format]). |
| EXPONENTIAL_DELAY_RESET_AFTER | No                                 | 120        | 1.1.0           | time window after which the exponential delay in requests to send sms to the same phone number is reset to zero. It is expressed in seconds.           |
| TWILIO_ACCOUNT_SID            | If `SERVICE_PROVIDER` is `twilio`  | -          | 1.0.0           | The SID of your Twilio Account.                                                                                                                        |
| TWILIO_AUTH_TOKEN             | If `SERVICE_PROVIDER` is `twilio`  | -          | 1.0.0           | Your Auth Token from Twilio.                                                                                                                           |
| TWILIO_EMPTY_BALANCE_CHECK    | No                                 | `false`    | 1.1.0           | Check Twilio account balance before sending SMS, allowing it only with a positive balance.                                                             |
| KALEYRA_BASE_URL              | If `SERVICE_PROVIDER` is `kaleyra` | -          | 1.2.0           | Base URL of the Kaleyra API, like `https://api.kaleyra.io`.                                                                                            |
| KALEYRA_API_KEY               | If `SERVICE_PROVIDER` is `kaleyra` | -          | 1.2.0           | [API Key][kaleyra-api-key] of the Kaleyra account.                                                                                                     |
| KALEYRA_SID                   | If `SERVICE_PROVIDER` is `kaleyra` | -          | 1.2.0           | Security Identifier of the Kaleyra account.                                                                                                            |
| KALEYRA_EMPTY_BALANCE_CHECK   | No                                 | `false`    | 1.1.0           | Check Kaleyra account balance before sending SMS, allowing it only with a positive balance.                                                            |


[kaleyra]: https://www.kaleyra.com/
[kaleyra-api-key]: https://developers.kaleyra.io/docs/generating-an-api-key
[kaleyra-getting-started]: https://developers.kaleyra.io/docs/kcloud-getting-started
[kaleyra-sender-id]: https://developers.kaleyra.io/docs/sender-id

[kaleyra]: https://www.kaleyra.com/
[twilio]: https://www.twilio.com/
[twilio-api-keys]: https://www.twilio.com/docs/usage/api/keys
[twilio-console]: https://www.twilio.com/console
[ms-format]: https://github.com/vercel/ms
