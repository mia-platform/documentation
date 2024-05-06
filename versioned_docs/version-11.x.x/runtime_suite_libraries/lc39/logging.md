---
id: logging
title: Logging
sidebar_label: Logging
---
The library generates logs following [Mia-Platform logging guidelines](../../development_suite/monitoring/resources/pods#pod-logs).

For a json schema example check [test log schema file](https://github.com/mia-platform/lc39/blob/master/tests/log.schema.json)

## Additional information to response logs

It is possible to add custom information to request completed logs.
In your handler, or in a hook (before the onResponse hook which write the response log), you could add to the fastify reply object an `additionalRequestCompletedLogInfo` field.
This field must be an object, and will be added to the request completed log.

For example: 

```js
fastify.post('/items/:itemId', {
  onRequest: function (req, reply, done) {
    reply.additionalRequestCompletedLogInfo = {
      custom: 'property',
    }
    done()
  }
}, function handler(request, reply) {
  reply.send({ created: 'true' })
})
```
