---
id: logging
title: Logging
sidebar_label: Logging
---
You can log a message to see in DevOps console. The library use the [Fastify logging system](https://www.fastify.io/docs/v2.0.x/Logging/), that is based on [pino](https://github.com/pinojs/pino).

To log messages call these methods on the logger instance of request. Logging is enabled by default. Therefore you can call on `request.log` or `service.log`:

* `debug()`
* `info()`
* `warn()`
* `error()`
* `fatal()`

Each method creates a log with the homonym level.

By default the library will generate two logs for each request, one representing the incoming request and one for the request completion, logs are created with *trace* and *info* levels respectively and already provide useful information for later analysis or debugging. If you need more, you can add your logs.

## Example

```js
service.addPostDecorator('/notify', function notifyHandler(request) {
  // Get "notifications" setting from the request querystring
  const { notifications } = request.getOriginalRequestQuery()
  if(!notifications)  {
    return req.leaveOriginalResponseUnmodified()
  }

  try {
    const notifier = new Notifier()
    const response = await notifier.send({ text: `${who} says: ${mymsg}`})
    const sendedAt = new Date();

    // Log at "INFO" level
    req.log.info({ statusCode: response.statusCode }, 'Notify sent')

    return request.changeOriginalResponse().setBody(
      { ...req.getOriginalRequestBody(), notifySendedAt:sendedAt}
    )
  } catch (error) {
    // Log at "ERROR" level
    req.log.error({ error }, 'Error sending notification')
  }
) 
```

For further detail about logs can you see the [guidelines for logs](../../development_suite/monitoring/resources/pods#pod-logs).
