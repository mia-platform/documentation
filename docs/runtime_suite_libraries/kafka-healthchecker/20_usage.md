---
id: usage
title: Kafka HealthChecker Usage
sidebar_label: Usage
---
## Quick start
After the [installation](./30_setup.md), you can import the library, create the `KafkaJSHealthChecker` object passing it one (or more) consumer or producer to get the methods `isHealthy` and `isReady`. More information about these methods can be found on [Overview](./10_overview.md) page.

Example:

```javascript
const { Kafka } = require('kafkajs')
const { KafkaHealthChecker } = require('@mia-platform/kafka-healthchecker')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092', 'localhost:9093'],
})

const consumer = kafka.consumer({ groupId: 'test-group-1' })

const { isHealthy, isReady } = new KafkaJSHealthChecker([consumer])
```

## Advanced
The library takes in input 3 parameters:
- a list of consumers
- a list of producers
- a configuration object to determine if all the consumers and producers have to be considered during the `isHealthy` and `isReady` methods.

Consumers and producers must be passed to the library before their connection to Kafka.

Example:

```javascript
const { Kafka, logLevel } = require('kafkajs')
const { KafkaHealthChecker } = require('@mia-platform/kafka-healthchecker')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092', 'localhost:9093'],
    logLevel: logLevel.ERROR,
  })

const firstConsumer = kafka.consumer({ groupId: 'test-group-1' })
const secondConsumer = kafka.consumer({ groupId: 'test-group-2' })
const producer = kafka.producer()
const configuration = { checkStatusForAll: true }

const { isHealthy, isReady } = new KafkaJSHealthChecker([firstConsumer, secondConsumer], [producer], configuration)

async function healthinessHandler() {
  return { statusOK: isHealthy() }
}

async function readinessHandler(service) {
  return { statusOK: isReady() }
}

module.exports.healthinessHandler = healthinessHandler
module.exports.readinessHandler = readinessHandler
```
