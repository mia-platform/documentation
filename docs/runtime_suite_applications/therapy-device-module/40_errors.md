---
id: errors
title: Errors
sidebar_label: Errors
---



Please refer to the [Therapy and Monitoring Manager][mia-therapy-and-monitoring-manager-usage] and [Device Manager][mia-device-manager] service documentation for a complete list of expected errors. In the [Usage section][mia-therapy-and-monitoring-manager-usage] of the documentation for each endpoint is provided a list with all possible response errors.


## Generic error

If something goes wrong during the request, the response has a `4xx` or `5xx` status code, specifies the kind of error and contains a message with a description of the error. The response payload looks like this:

```json
{
  "statusCode": "400",
  "error": "Bad request",
  "message": "Exception description"
}
```


[mia-therapy-and-monitoring-manager-usage]: /runtime_suite/therapy-and-monitoring-manager/10_overview.md
[mia-device-manager]: /runtime_suite/device-manager/10_overview.md
