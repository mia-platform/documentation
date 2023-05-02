---
id: kafka_connection_configuration
title: Kafka Connection Configuration
sidebar_label: Kafka Connection
---

This page explains how to connect the Bucket Storage Support services to Apache Kafka using different SASL mechanism.
The guide is equivalent for all the Bucket Storage Support services.

## SCRAM-SHA Authentication [Default]

This is the default authentication configuration and it can be enabled by just configuring the following environment variables on the services:

- `KAFKA_USERNAME`: credentials username 
- `KAFKA_PASSWORD`: credentials password
- `KAFKA_SASL_MECHANISM`: whether the SASL mechanism employs `SCRAM-SHA-256` or `SCRAM-SHA-512`

## Plain Authentication

In order to connect to Kafka with a SASL `PLAIN` authentication an additional configuration has to be written.
To achieve this, create a new config map whose filename is `application.yaml` and its mount path within service's container is `/app/config`.
Then, within the config map file it is possible to provide the Kafka configuration that enables the SASL `PLAIN` mechanism, by adding the specific
properties, starting from `kafka` at the root of the yaml file. Below is provided an example of the content to insert in the file.

```yaml
kafka:
  sasl:
    mechanism: PLAIN
    jaas:
      config: "org.apache.kafka.common.security.plain.PlainLoginModule required username=\"${KAFKA_USERNAME}\" password=\"${KAFKA_PASSWORD}\";"
```

The main part is the `jaas` config, that must contain the `plain.PlainLoginModule` security module, in order to correctly authenticate with the `PLAIN` mechanism.

## Other Authentication Methods

In general in the `application.yaml` file, which can be loaded as a config map into the service, any Kafka configuration can be customized,
using `yaml` format rather than Java properties. Therefore, any SASL authentication method should be supported, though they were not tested directly as the previous ones.  
In fact, it should be sufficient to create a `kafka` entry at the yaml root and add the needed properties. For example:

```yaml
kafka:
  sasl:
    <your-custom-kafka-configuration-properties>
  
  <other-custom-kafka-configuration-properties>

```

To learn more about _Kafka Authentication using SASL_ we recommend reading the following [documentation](https://docs.confluent.io/platform/current/kafka/authentication_sasl/index.html).