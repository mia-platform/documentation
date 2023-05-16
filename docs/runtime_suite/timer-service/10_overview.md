---
id: overview
title: Timer Service
sidebar_label: Overview
---
The aim of _Timer Service_ is to perform an action when a timer is expired.
This allows to schedule a timeout for asynchronous actions that can fail without a notification of the called service.

## Introduction

### How does it works

Let's explain with an example.

You have a service named _Payments_ that call an external API, named _doPayment_, with the following parameters:

- orderId
- amount
- callback_url
- timeout

Before calling _doPayment_ API the _Payments_ service schedules a **timeout** on _Timer Service_ passing the following parameters:

- output_mode &rarr; the details on the modality for the notification timeout (e.g. a **fallback_url**)
- payload &rarr; a payload that will be sent into the timeout notification data
- start_date &rarr; the date of start of the timer
- expiration_interval_ms &rarr; the milliseconds that must pass from *start_date* for the timeout
- applicant_service &rarr; the service who schedule the timer

for more details see [usage](./30_usage.md#create-a-timer).

The _Payments_ service will wait for _timeout_ seconds the result of _doPayment_ on the callback_url.
If_Payments_receives the callback before the expiration of the timeout, the service calls_Timer Service_abort (_Figure 1_).

Otherwise the _Timer Service_ timeout occurs and _Time Service_ calls the *fallback_url* to notify the expiration of the timeout (_Figure 2_).

![alt_image](img/Timer_Service_sequences-Happy_schedule_abort.png)

**Figure 1 - Timer not expired - *abort* called**

![alt_image](img/Timer_Service_sequences-Happy_schedule_timeout.png)

**Figure 2 - Timer expired - *fallback_url* called**

## Timer Service usage

The _Timer Service_ can be used for more purposes, for example:

- schedule a single action that must be executed after the timeout
- send an alarm when a timeout is expired
- monitor that an operation is completed in a predictable time
- ...

## Administration

### Service Limitations

- **horizontal scaling**: right now is not possible to horizontal scale the service because the service polls from the dedicated database and all instances would receive same pending timers
- **abort forgetfulness**: the abort should be done just in case of _pending_ timers but, right now, this check is missing (there is a dedicated section into the contributions file)
- **REST methods limit**: the _rest_ output allows just `post`, `put` or `patch` as REST Verbs, because it sends a payload; it would be nice to allow all the verbs and, in case of verbs without the body, ignore the payload (there is a dedicated section into the contributions file)

## Further details

The _Timer Service_ is easy to use and easy to configure:

- [_Timer Service_ configuration](./20_configuration.md)

- [_Timer Service_ usage](./30_usage.md)
