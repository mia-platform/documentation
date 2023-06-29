---
id: overview
title: SMS Service
sidebar_label: Overview
---
The **SMS Service** is a simple microservice to send SMS.

It is configured to work with the [Twilio][twilio-home] service provider.

## SMS Traffic Pumping Fraud

:::info
**Disable Geo-Permissions for unused countries**

Disabling messages sent to unused countries can help reduce the likelihood of SMS Traffic Pumping Fraud.
SMS Geo-Permissions can be configured in the Twilio project console, on the [Messaging Geographic Permissions][twilio-geo-permissions] page.

:::

:::info
**Disable account balance automatic recharge**

Automatic recharge of the account balance can be disabled in the Twilio project console, in the Billing Information section. Disabling this feature the Twilio's account is not recharged automatically from the connected payment method when it goes to zero. In this way potential losses due to a fraud attack can be minimized.

:::

:::note

The following security prevention measures are implemented since version `1.1.0`.

:::

In order to prevent SMS Traffic Pumping attacks, some security measures have been implemented. More information about possible vulnerabilities and prevention techniques can be found in the official [Twilio documentation][twilio-sms-fraud].

### Rate Limit

The rate of requests to the service is limited to avoid artificially inflated traffic to Twilio. This security measure is always enabled, and can be configured by setting the **RATE_LIMIT_MAX_REQUESTS** and **RATE_LIMIT_TIME_WINDOW**  environment variables. For more details about how to configure these environment variables, please look at the [*Configuration document*][service-configuration].

### Exponential delay between requests

Consecutive requests to the same phone number are delayed exponentially, in order to mitigate the effects of attacks using the same phone account. This security measure is always enabled. The time window after which the exponential delay is reset to zero can be configured through the **EXPONENTIAL_DELAY_RESET_AFTER** environment variable.

### Block requests when balance is empty

Twilio allows the balance account to go negative, without blocking the Twilio account immediately, therefore a sufficiently fast attack can send the balance account below zero before it is suspended.

This behavior can be prevented checking the balance account before accepting a request to send SMS. This is implemented using the [Twilio API][twilio-balance-api].

This security measure is disabled by default and can be enabled by setting the environment variable **TWILIO_EMPTY_BALANCE_CHECK** to true.

[service-configuration]: ./20_configuration.md#Environment-variables "Environment variables | Configuration"
[twilio-home]: https://www.twilio.com/ "Twilio home page"
[twilio-sms-fraud]: https://support.twilio.com/hc/en-us/articles/8360406023067-SMS-Traffic-Pumping-Fraud "Twilio sms pumping fraud"
[twilio-balance-api]: https://support.twilio.com/hc/en-us/articles/360025294494-Check-Your-Twilio-Account-Balance "Twilio balance api"
[twilio-geo-permissions]: https://console.twilio.com/us1/develop/sms/settings/geo-permissions?frameUrl=%2Fconsole%2Fsms%2Fsettings%2Fgeo-permissions%3Fx-target-region%3Dus1 "Twilio Geo Permissions"
