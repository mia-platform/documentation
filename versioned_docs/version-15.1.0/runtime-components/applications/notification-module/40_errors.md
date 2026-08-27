---
id: errors
title: Errors
sidebar_label: Errors
---



Please refer to the [Notification Manager][mia-notification-manager-usage] service documentation for a complete list of expected errors. In the [Usage section][mia-notification-manager-usage] of the documentation for each endpoint is provided a list with all possible response errors.


## Generic error

If something goes wrong during the request, the response has a `4xx` or `5xx` status code, specifies the kind of error and contains a message with a description of the error. The response payload looks like this:

```json
{
  "statusCode": "400",
  "error": "Bad request",
  "message": "Exception description"
}
```


## Event handler not found

If there is no handler available to process the event, the response has a `400` status code and the payload looks like this:

```json
{
  "statusCode": "400",
  "error": "Bad Request",
  "message": "Unknown event"
}
```

[mia-notification-manager-usage]: /runtime-components/plugins/notification-manager-service/30_usage.md
