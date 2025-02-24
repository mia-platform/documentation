---
id: overview
title: Overview
sidebar_label: Overview
---
This library simplifies the interaction between a generic microservice and the [Flow Manager](../../runtime_suite/flow-manager-service/overview) service.

## Configuration

The service relies upon a client builder, which allows to configure the
underling Kafka client options and the different enabled components.

The library use [KafkaJS](https://kafka.js.org/) to actually connect to
Kafka. It is recommended to have read its documentation in case some parameter or configuration is not clear.

Below are reported which properties of each Kafka component can be customized:

```javascript
kafkaConfig = {
  clientId: { type: 'string', minLength: 1 },
  brokers: { type: 'string', minLength: 1, description: 'string of comma separated brokers address' },
  authMechanism: { type: 'string', nullable: true },
  username: { type: 'string', nullable: true },
  password: { type: 'string', nullable: true },
  connectionTimeout: { type: 'integer', default: 10000, description: 'milliseconds' },
  authenticationTimeout: { type: 'integer', default: 10000, description: 'milliseconds' },
  connectionRetries: { type: 'integer', default: 5, description: 'number of times the client should try to connect'}
}

consumerConfig = {
  groupId: { type: 'string' }, // required
  sessionTimeout: { type: 'integer', default: 30000 },
  rebalanceTimeout: { type: 'integer', default: 60000 },
  heartbeatInterval: { type: 'integer', default: 3000 },
  allowAutoTopicCreation: { type: 'boolean', default: false },
}

producerConfig = {
  allowAutoTopicCreation: { type: 'boolean', default: false },
}
```

Example:

```javascript
const { FMClientBuilder } = require('@mia-platform/flow-manager-client')

const client = new FMClientBuilder(pinoLogger, kafkaConfig)
  .configureCommandsExecutor(commandsTopic, consumerConf, partitionsConsumedConcurrently)
  .configureEventsEmitter(eventsTopic, producerConf)
  .build()

// define which action should be exected when the specified command is received
client.onCommand(
  'COMMAND',
  async (sagaId, metadata, emitEvent) => { /* do something*/ },
  async (sagaId, error, commit) =>  {
    /* do something else */

    await commit()  // execute in case the message should be skipped
  }
)

await client.start()

await client.emit('EVENT', sagaId, metadata)

await client.stop()
```

**Notes:**
- it is not necessary to configure both components. This allows to enable only the needed features.
  However, please note that calling methods of components not configured results in an error.
- it is recommended to define all the commands actions before starting the client.
  Nonetheless, they can be added or updated also at client runtime.

## Client Methods

#### `async start()`
_start_ function connects underlying components to Kafka, subscribe
the consumer to the _commands_ topic and allows the emission of events.

#### `async stop()`
_stop_ function stops and disconnects underlying components from Kafka. It is resilient to disconnection errors.
After its execution, methods `isHealthy` and `isReady` return `false`.

#### `onCommand(command, commandFunction, errorHandler)`
_onCommand_ defines which action should be executed in case a specific command is received by the Flow Manager.
It is also possible to define an error handler which takes as input the processing error.

Here is reported the signature of the two methods associated to a command:

- `commandFunction -> [async] Function(sagaId: string, commandMetadata: Object, emitEvent: function)`
- `errorHandler -> [async] Function(sagaId: string, error: Error, commit: async Function)`

**Notes:**
- before executing a command, a parsing step is carried out. In case the command message can not be
parsed as a Flow Manager message (e.g. the key does not contain any _sagaId_ or the value does not provide messageLabel),
  the processing of that message is skipped altogether.
- when a command is handled, it is also provided the possibility to emit a new event to notify the end of command execution.
  This is achieved by calling the `emitEvent` function given as argument of the `commandFunction`.
  Its signature is `emitEvent(event, metadata)`. In this case `sagaId` is not needed since it exploits the same of executed command. 
- by default error risen during the processing step cause messages to be retried until the
execution is successful. This behavior can be fine in case the command action is _idempotent_
  or its repetition does not cause potential conflicts.
  In order to change it and *skip messages* whose processing throw an error,
  it is sufficient to call the `commit` function within the error handler.
  That function is provided as a parameter to the error handler, in conjunction with the processing error.

#### `async emit(event, sagaId, metadata)`
_emit_ allows to publish a new message in the _events_ topic. It can throw in case sending a message results in a failure.

#### `isHealthy()`
_isHealthy_ provides client status. In particular, it returns `true` in case:
- the client has just been initialized, but not started
- the client has been started and is running properly
- the client has been started and it has crashed or stopped, but not disconnected from Kafka

Once the underlying components are disconnected from Kafka, either due to an error or due to calling `stop` method,
the client status transitions to `false` (_unhealthy_).
The only manners to get back into a healthy status is to either call again the `start` method (**not recommended**)
or to wait that underlying components reconnect by themselves.

#### `isReady()`
_isReady_ provides client running status. It returns `true` only in case the service is running properly.


## Metrics

The library exposes also a function `getMetrics(prometheusClients)` which can be used
to generate useful metrics related the commands and events handled by the client.

The metrics employed within the library are:

- `fm_client_commands_total` - count how many commands issued by the Flow Manager have been processed.
  It has two labels:
  - `command` displays which command has been processed
  - `result` displays the result of processing this command
- `fm_client_events_total` - count how many events have been sent to the Flow Manager.
  It has one label `event` that indicates which event has been fired.

Example of client building with metrics enabled:

```javascript
const prometheusClient = require('prom-client')

const { FMClientBuilder, getMetrics } = require('@mia-platform/flow-manager-client')

const metrics = getMetrics(prometheusClient)

const client = new FMClientBuilder(pinoLogger, kafkaConfig)
  .configureCommandsExecutor(commandsTopic, consumerConf)
  .configureEventsEmitter(eventsTopic, producerConf)
  .enableMetrics(metrics)
  .build()

// expose metrics afterwards
```

**Note:** users of [`custom-plugin-lib`](../../runtime_suite_libraries/custom-plugin-lib/apidoc)
can directly expose the `getMetrics` function and find these metrics decorated
in the service `customMetrics` object.

```javascript
const { FMClientBuilder, getMetrics } = require('@mia-platform/flow-manager-client')

const customService = require('@mia-platform/custom-plugin-lib')(
  { /* schema */ }
)

// export by default your service
module.exports = customService(async function index(service) {
  const { log, customMetrics } = service
  
  const client = new FMClientBuilder(log, kafkaConfig)
    .configureCommandsExecutor(commandsTopic, consumerConf)
    .configureEventsEmitter(eventsTopic, producerConf)
    .enableMetrics(customMetrics)
    .build()
  
  // your plugin logic
})

// export the function used by lc39 to add your custom metrics
// Note: flow-manager-client getMetrics function can be extended
// to include further metrics to be used in service
module.exports.getMetrics = getMetrics
```
