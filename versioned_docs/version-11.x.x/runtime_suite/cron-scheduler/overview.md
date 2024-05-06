---
id: overview
title: Cron Scheduler
sidebar_label: Cron Scheduler
---
Mia-Platform integrates a Cron system to schedule operations at intervals decided by the developer.
The implementation of the Cron involves two phases: the scheduling configuration and the implementation of the function to be performed.

## Implement a Cron

The cron is designed to run in the context of a `plugin`, so the configuration and implementation of the routine must exist at`plugin` level.

The configuration must be written in the `options.json` file of the`plugin`. Below is an example:

```json
{
  "cronConfiguration": {
    "active": true,
    "period": "* 30 01 * * *"
  }
}
```

The part of the file of interest is in the `cronConfiguration` object json which contains two fields:

* active: Boolean that enables or disables the Cron
* period: string for the time schedule of the Cron. The digits indicate, from left to right, the seconds 0-59, minutes 0-59, time 0-23, day of month 1-31, month 0-11 and day of week 0-6.

In the above example, the Cron is active and runs the routine every day at 01:30.

The routine to execute is a Javascript function implemented in the `index.js` file of the`plugin`. The function signature must necessarily be `cronFunction`. Only this function can be used, with this name, without arguments and only one can exist.
Below is an example:

```js
class MIACronExample extends MIACollection {

  cronFunction() {
      this.log('info', 'Hello cron')
  }

}
```
