---
id: overview
title: SMS Service
sidebar_label: Overview
---



The **SMS Service** is a microservice to send SMS using one of the following providers:

- [Twilio][twilio]
- [Kaleyra][kaleyra]

## SMS Traffic Pumping Fraud

In order to prevent SMS Traffic Pumping attacks, some security measures have been implemented starting with version `1.1.0`.

More information about the issues, potential vulnerabilities and prevention techniques can be found in [Twilio documentation][twilio-sms-fraud] and [Kaleyra blog][kaleyra-sms-fraud].

### Rate Limit

The rate of requests to the service is limited to avoid artificially inflated traffic to external providers.

This security measure is always enabled, and can be configured by setting the **RATE_LIMIT_MAX_REQUESTS** and **RATE_LIMIT_TIME_WINDOW** [environment variables][environment-variables].

### Exponential delay between requests

Consecutive requests to the same phone number are delayed exponentially, in order to mitigate the effects of attacks using the same phone account.

This security measure is always enabled. The time window after which the exponential delay is reset to zero can be configured through the **EXPONENTIAL_DELAY_RESET_AFTER** [environment variable][environment-variables].

### Block requests when balance is empty

If your provider allows the balance account to go negative, without blocking the account immediately, a sufficiently fast attack can send the balance account below zero before it is suspended. This behavior can be prevented checking the balance account before accepting a request to send SMS. 

This security measure is disabled by default and can be enabled by setting one of the following environment variables:

- if you are using Kaleyra as provider, set **KALEYRA_EMPTY_BALANCE_CHECK** to `true`;
- if you are using Twilio as provider, set **TWILIO_EMPTY_BALANCE_CHECK** to `true`.

### Providers security

This section provides a security checklist to configure providers in order for additional security against SMS Traffic Pumping attacks, including:

- *Disabling Geo-Permissions for unused countries*: preventing messages to be delivered to unused countries can help reduce the likelihood of SMS Traffic Pumping Fraud.
- *Disable account balance automatic recharge*: ensure your account is not recharged automatically from the connected payment method when it goes to zero, minimizing potential losses due to a fraud attack.

#### Twilio

- [ ] Disable automatic recharge of the account balance under the *Billing Overview* section of the Twilio project console
- [ ] Configure SMS Geo-Permissions in the Twilio project console, on the [Messaging Geographic Permissions][twilio-geo-permissions] page. 

#### Kaleyra

- [ ] Configure [daily and monthly limits][kaleyra-daily-limits] on the [SMS Settings][kaleyra-sms-settings] page.
- [ ] Configure [SMS Rate Limit][kaleyra-sms-rate-limit] on the [Account settings][kaleyra-account-settings] page.


[kaleyra]: https://www.kaleyra.com/
[kaleyra-account-settings]: https://developers.kaleyra.io/docs/account-settings
[kaleyra-daily-limits]: https://developers.kaleyra.io/docs/campaign-daily-limit
[kaleyra-sms-settings]: https://developers.kaleyra.io/docs/configuring-sms-settings
[kaleyra-sms-rate-limit]: https://developers.kaleyra.io/docs/settings#sms-rate-limit

[kaleyra-sms-fraud]: https://www.kaleyra.com/blog/combat-the-risks-of-sms-pumping-artificially-inflated-traffic/
[twilio]: https://www.twilio.com/ "Twilio home page"
[twilio-sms-fraud]: https://support.twilio.com/hc/en-us/articles/8360406023067-SMS-Traffic-Pumping-Fraud "Twilio sms pumping fraud"
[twilio-balance-api]: https://support.twilio.com/hc/en-us/articles/360025294494-Check-Your-Twilio-Account-Balance "Twilio balance api"
[twilio-geo-permissions]: https://console.twilio.com/us1/develop/sms/settings/geo-permissions?frameUrl=%2Fconsole%2Fsms%2Fsettings%2Fgeo-permissions%3Fx-target-region%3Dus1 "Twilio Geo Permissions"

[environment-variables]: /runtime_suite/sms-service/20_configuration.md#Environment-variables "Environment variables | Configuration"
