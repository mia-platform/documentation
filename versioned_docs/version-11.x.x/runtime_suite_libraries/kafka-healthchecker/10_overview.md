---
id: overview
title: Kafka HealthChecker
sidebar_label: Overview
---
This library helps to handle Kafka healthiness and readiness probes. It takes in input a list of Kafka *consumers*, a list of Kafka *producers* and a configuration object.

It configures each consumer and producer in order to assign them an internal status that is updated as a result of Kafka events. Then, it exposes two methods:
- `isHealthy()`: returns true if all the consumers and producers are healthy (i.e. they are live)
- `isReady()`: returns true if all the consumers and producers are ready (i.e. they are able to consume and produce messages)

**In order to not lose any events, the library must be initialized before the consumers and the producers are connected to Kafka.**

For more information about setup and initialization go to [Setup](./30_setup.md) page.

## Consumer
It follows a table of all the status of the consumers caused by Kafka events. The starting status is `{ healthy: true, ready: false }`.

| Event | Status |
| ----------- | ----------- |
| CONNECT | `{ healthy: true, ready: false }` |
| GROUP_JOIN | `{ healthy: true, ready: true }` |
| STOP   | `{ healthy: true, ready: false }` |
| DISCONNECT | `{ healthy: false, ready: false }` |
| CRASH | `{ healthy: false, ready: false }` |

## Producer
It follows a table of all the status of the producers caused by Kafka events. The starting status is `{ healthy: true, ready: false }`.

| Event | Status |
| ----------- | ----------- |
| CONNECT | `{ healthy: true, ready: false }` |
| DISCONNECT | `{ healthy: false, ready: false }` |

## Configuration
The configuration objects has the following schema:

```javascript
configuration = {
  checkStatusForAll: { type: 'boolean', default: true }
}
```
The `checkStatusForAll` can be:
- `true`: the methods `isHealthy` and `isReady` return true if all the consumers and producers are, respectively, healthy and ready
- `false`: the methods `isHealthy` and `isReady` return true if exists at least one consumer or producer that is, respectively, healthy and ready.

## Notes
At the moment the library exposes the health checker only for [KafkaJS](https://kafka.js.org/). It is recommended to have read its documentation in case some parameter or configuration is not clear.
