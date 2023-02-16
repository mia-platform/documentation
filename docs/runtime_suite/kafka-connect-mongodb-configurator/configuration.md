---
id: configuration
title: Kafka Connect Configurator
sidebar_label: Configuration
---
This component is in charge of initializing an instance of `kafka-connect` using a Confluent proprietary image `cp-kafka-connect` and at the same time an instance of a Fastify Service that takes care of configuring the former

Fastify Service monitors the healthiness and readiness status of the `kafka-connect` component and when it's ready, it executes one (or more) PUT API to configure the connector (or connectors).

N.B. in order to easily release the component on kubernetes the `standalone` distribution version is used instead of the distributed one.

## Architecture

The component is divided in two different executable and the docker `CMD` execute both of them parallely using a bash script.  

### Kafka-Connect

This is the main component that can be extended with the connectors and it is the one that handle the sigterm of the container. 

### Configurator

This is the Fastify Service that exposes the Healthiness and readiness probes used by kubernetes, it is also in charge of configuring the `kafka-connect`.

## Configuration

### Environment Variable

* CONFIGURATION_PATH (required): the path of the configuration file containing the connectors configuration (es: /home/node/app/configuration/connectorsConfig.json)
* CONNECT_BOOTSTRAP_SERVERS (required): A host:port pair for establishing the initial connection to the Kafka cluster. Multiple bootstrap servers can be used in the form `host1:port1,host2:port2,host3:port3...`.
* CONNECT_REST_PORT: 28082
* CONNECT_GROUP_ID (required): A unique string that identifies the Connect cluster group this worker belongs to.
* CONNECT_CONFIG_STORAGE_TOPIC (required): The name of the topic in which to store connector and task configuration data. This must be the same for all workers with the same `group.id`
* CONNECT_OFFSET_STORAGE_TOPIC (required): The name of the topic in which to store offset data for connectors. This must be the same for all workers with the same `group.id`
* CONNECT_STATUS_STORAGE_TOPIC (required): The name of the topic in which to store state for connectors. This must be the same for all workers with the same `group.id`
* CONNECT_KEY_CONVERTER (required): Converter class for keys. This controls the format of the data that will be written to Kafka for source connectors or read from Kafka for sink connectors. (ex: "org.apache.kafka.connect.json.JsonConverter")
* CONNECT_VALUE_CONVERTER (required): Converter class for values. This controls the format of the data that will be written to Kafka for source connectors or read from Kafka for sink connectors. (ex: "org.apache.kafka.connect.json.JsonConverter")
* CONNECT_INTERNAL_KEY_CONVERTER (required): Converter class for internal keys that implements the Converter interface. (ex: "org.apache.kafka.connect.json.JsonConverter")
* CONNECT_INTERNAL_VALUE_CONVERTER (required): Converter class for internal values that implements the Converter interface. (ex: "org.apache.kafka.connect.json.JsonConverter")
* CONNECT_REST_ADVERTISED_HOST_NAME (required): The hostname that is given out to other workers to connect to. In a Docker environment, your clients must be able to connect to the Connect and other services. Advertised hostname is how Connect gives out a hostname that can be reached by the client. (ex: "localhost")
* CONNECT_CONFLUENT_LICENSE: The Confluent license key. Without the license key, Replicator can be used for a 30-day trial period.

For configuring using SASL mechanism (plain or scram-sha-256/512) please use the following [documentation](https://docs.confluent.io/platform/current/kafka/authentication_sasl/authentication_sasl_plain.html#kconnect-long).
Here it is an example of a PLAIN configuration:

```
CONNECT_SASL_MECHANISM=PLAIN
CONNECT_SECURITY_PROTOCOL=SASL_SSL
CONNECT_SASL_JAAS_CONFIG=org.apache.kafka.common.security.plain.PlainLoginModule required username="" password="";
```

Here an example for a SCRAM-SHA-256 configuration:
```
CONNECT_BOOTSTRAP_SERVERS=host:9093,host:9093,host:9093
CONNECT_SASL_MECHANISM=SCRAM-SHA-256
CONNECT_SECURITY_PROTOCOL=SASL_SSL
CONNECT_SASL_JAAS_CONFIG=org.apache.kafka.common.security.scram.ScramLoginModule required username="" password="";
```

if eventually the following error appears, [this](https://github.com/provectus/kafka-ui/wiki/Common-problems) could be the solution (this is not tested)
### Config Map

The configuration of the Connectors is passed using a config map with the following format:

```
{
  type: 'array',
  items: {
    oneOf: [
      {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['sink']
          },
          name: {
            type: 'string'
          },
          'connector.class': {
            type: 'string'
          },
          'tasks.max': {
            type: 'number'
          },
          topics: {
            type: 'string'
          }
        },
        required: [
          'name',
          'connector.class',
          'tasks.max',
          'topics'
        ],
        additionalProperties: true
      },
      {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['sink']
          },
          name: {
            type: 'string'
          },
          'connector.class': {
            type: 'string'
          },
          'tasks.max': {
            type: 'number'
          },
          'topics.regex': {
            type: 'string'
          }
        },
        required: [
          'name',
          'connector.class',
          'tasks.max',
          'topics.regex'
        ],
        additionalProperties: true
      },
      {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['source']
          },
          name: {
            type: 'string'
          },
          'connector.class': {
            type: 'string'
          },
          'tasks.max': {
            type: 'number'
          }
        },
        required: [
          'name',
          'connector.class',
          'tasks.max'
        ],
        additionalProperties: true
      }
    ]
  }
}
```

two main types of connectors are managed: 
- source
- sink

both have common and additional properties, for specific information check the official documentation [here](https://docs.confluent.io/platform/current/installation/configuration/connect/index.html#kconnect-long-configurations-for-cp)

Based on the specific connector (es: mongo, elastic, S3 etc) additional properties may be required.
