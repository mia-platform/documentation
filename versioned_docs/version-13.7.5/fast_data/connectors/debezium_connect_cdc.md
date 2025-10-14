---
id: debezium_connect_cdc
title: Debezium Connect CDC
sidebar_label: Debezium Connect CDC
---

This page provides instructions on how to configure Debezium as a Kafka Connect connector rather than as standalone server.

## Overview

Unlike [Debezium Server](/fast_data/connectors/debezium_cdc.md), the configuration discussed here is not related to any plugins in the Mia-Platform Marketplace. However, you can use the official public image `quay.io/debezium/connect`.

This image serves as a [Kafka Connect](https://kafka.apache.org/documentation/#connect) worker with all the Debezium connectors already included.

Compared to Debezium Server, Debezium Connect does not require Redis for storing metadata regarding offsets and schema management. Instead, it uses dedicated Kafka topics for this internal information.

:::info
For more details on how Debezium works we recommend checking out the [official Debezium documentation](https://debezium.io/documentation/reference/2.7/)..
:::

## Environment variables
For a complete list of environment variables that you can configure in the container, refer to the [Official Documentation](https://github.com/debezium/container-images/tree/main/connect/2.7#environment-variables).

Below is an example of `.env` file that you can import directly in the Microservices section of the console.

```sh
BOOTSTRAP_SERVERS={{KAFKA_BOOTSTAP_SERVERS}}
GROUP_ID=debezium-{{ENV}}
CONFIG_STORAGE_TOPIC={{INTERNAL_TOPIC_PREFIX}}.config
OFFSET_STORAGE_TOPIC={{INTERNAL_TOPIC_PREFIX}}.offset
STATUS_STORAGE_TOPIC={{INTERNAL_TOPIC_PREFIX}}.status
CONNECT_KEY_CONVERTER_SCHEMAS_ENABLE=false
CONNECT_VALUE_CONVERTER_SCHEMAS_ENABLE=false
CONNECT_CONSUMER_SASL_JAAS_CONFIG=org.apache.kafka.common.security.scram.ScramLoginModule required username='{{KAFKA_DEBEZIUM_USER}}' password='{{KAFKA_DEBEZIUM_PASSWORD}}';
CONNECT_CONSUMER_SASL_MECHANISM=SCRAM-SHA-256
CONNECT_CONSUMER_SECURITY_PROTOCOL=SASL_SSL
CONNECT_PRODUCER_COMPRESSION_TYPE=snappy
CONNECT_PRODUCER_SASL_JAAS_CONFIG=org.apache.kafka.common.security.scram.ScramLoginModule required username='{{KAFKA_DEBEZIUM_USER}}' password='{{KAFKA_DEBEZIUM_PASSWORD}}';
CONNECT_PRODUCER_SASL_MECHANISM=SCRAM-SHA-256
CONNECT_PRODUCER_SECURITY_PROTOCOL=SASL_SSL
CONNECT_SASL_JAAS_CONFIG=org.apache.kafka.common.security.scram.ScramLoginModule required username='{{KAFKA_DEBEZIUM_USER}}' password='{{KAFKA_DEBEZIUM_PASSWORD}}';
CONNECT_SASL_MECHANISM=SCRAM-SHA-256
CONNECT_SECURITY_PROTOCOL=SASL_SSL
```

:::warning
For the interpolated variables of the above configuration, `KAFKA_DEBEZIUM_PASSWORD` is a secreted variable and should be placed in the [Project's Variables section](/console/project-configuration/manage-environment-variables/index.md) of the Console. Meanwhile,  `KAFKA_BOOTSTAP_SERVERS`, `ENV`, `INTERNAL_TOPIC_PREFIX` and `KAFKA_DEBEZIUM_USER` can be safely placed in the [Public Variables](/development_suite/api-console/api-design/public_variables.md) section.
:::

## Debezium Connect Configuration

Once Debezium Connect is running, you can start new connectors by simply invoking the REST API `PUT/connectors/:connectorName/config`. This REST API will start a new connector if `connectorName` is not present, or update the configuration of an existing connector. It accepts the configuration in the request body.

For a complete list of configuration parameters, refer to the [official documentation](https://debezium.io/documentation/reference/connectors/oracle.html#required-debezium-oracle-connector-configuration-properties). Note that this documentation varies for each type of source database.

Here is an example configuration for an Oracle database:
```json
{
  "connector.class" : "io.debezium.connector.oracle.OracleConnector",  
  "tasks.max" : "1",  
  "database.hostname" : "{{ORACLE_HOST}}",  
  "database.port" : "{{ORACLE_PORT}}",  
  "database.user" : "{{ORACLE_USER}}",  
  "database.password" : "{{ORACLE_PASSWORD}}",   
  "database.dbname" : "{{ORACLE_DBNAME}}",
  "topic.prefix" : "{{INGESTION_TOPIC_PREFIX}}",
	"topic.heartbeat.prefix": "debezium-heartbeat",
  "snapshot.mode": "schema_only",
  "table.include.list": "MY_SCHEMA.MY_TABLE1, MY_SCHEMA.MY_TABLE2",
  "column.exclude.list": "MY_SCHEMA.MY_TABLE2.COL1,MY_SCHEMA.MY_TABLE2.COL2",
  "skip.messages.without.change": true,
  "decimal.handling.mode": "string",
  "interval.handling.mode": "string",
  "heartbeat.interval.ms": 5000,
  "signal.enabled.channels": "kafka",
	"signal.data.collection": "{{ORACLE_DBNAME}}.SVC_DEBEZIUM.DEBEZIUM_SIGNAL",
	"signal.kafka.bootstrap.servers": "{{KAFKA_BOOTSTRAP_SERVERS}}",
  "signal.kafka.topic": "{{INGESTION_TOPIC_PREFIX}}.signals",
	"signal.kafka.groupId": "debezium",
  "signal.consumer.security.protocol": "SASL_SSL",
  "signal.consumer.sasl.mechanism": "SCRAM-SHA-256",
  "signal.consumer.sasl.jaas.config": "{{KAFKA_SASL_JAAS_CONFIG}}",
  "notification.enabled.channels": "sink",
  "notification.sink.topic.name": "{{INGESTION_TOPIC_PREFIX}}.notifications",
  "topic.transaction": "__transactions__",
  "schema.history.internal.kafka.bootstrap.servers" : "{{KAFKA_BOOTSTRAP_SERVERS}}", 
  "schema.history.internal.kafka.topic": "{{INGESTION_TOPIC_PREFIX}}.schema_history",
  "schema.history.internal.producer.security.protocol": "SASL_SSL",
  "schema.history.internal.producer.sasl.mechanism": "SCRAM-SHA-256",
  "schema.history.internal.producer.sasl.jaas.config": "{{KAFKA_SASL_JAAS_CONFIG}}",
  "schema.history.internal.consumer.security.protocol": "SASL_SSL",
  "schema.history.internal.consumer.sasl.mechanism": "SCRAM-SHA-256",
  "schema.history.internal.consumer.sasl.jaas.config": "{{KAFKA_SASL_JAAS_CONFIG}}",
  "schema.history.internal.consumer.group.id": "debezium",
	"schema.history.internal.store.only.captured.tables.ddl": true
}
```

## Operate on Debezium Connect connectors
You can easily start, stop, pause, or delete the connectors by invoking the Kafka Connect REST APIs.
Please refer to the official documentation for the [API reference](https://kafka.apache.org/documentation/#connect_rest).  

:::warning
Please, notice that these APIs expose sensitive information, such as the database password. If you choose to expose Debezium Connect through an [API Gateway endpoint](/development_suite/api-console/api-design/endpoints.md), ensure it is protected with proper authorization mechanisms.

Moreover, we recommend exposing only the strictly necessary endpoints.
:::


## Message filtering
To filter messages before publishing to Kafka, you can use [Debezium Message Filtering](https://debezium.io/documentation/reference/2.7/transformations/filtering.html). Add the following properties to your connector's configuration:
```
...
transforms=filter
transforms.filter.type=io.debezium.transforms.Filter
transforms.filter.language=jsr223.groovy
transforms.filter.topic.regex=*.ingestion.MY_TABLE
transforms.filter.condition=value.op == 'u' && value.before.id == 2
...
```
For these properties to work, you need to add both `Debezium scripting` and `Groovy JSR` to the Debezium Docker image. You can do this by mounting a volume to the container or by building a new Docker image as follows:
```Dockerfile
FROM quay.io/debezium/connect:2.5

# These versions to be used
ENV DEBEZIUM_SCRIPTING_VERSION="2.5.4.Final" \
    GROOVY_VERSION="4.0.21"

# Download and extract Debezium scripting tar.gz
RUN cd $KAFKA_CONNECT_PLUGINS_DIR/debezium-connector-oracle && \
    curl -LO https://repo1.maven.org/maven2/io/debezium/debezium-scripting/${DEBEZIUM_SCRIPTING_VERSION}/debezium-scripting-${DEBEZIUM_SCRIPTING_VERSION}.tar.gz && \
    tar -xzf debezium-scripting-${DEBEZIUM_SCRIPTING_VERSION}.tar.gz && \
    rm debezium-scripting-${DEBEZIUM_SCRIPTING_VERSION}.tar.gz

# Download Groovy jars
RUN cd $KAFKA_CONNECT_PLUGINS_DIR/debezium-connector-oracle && \
    curl -LO https://repo1.maven.org/maven2/org/apache/groovy/groovy/${GROOVY_VERSION}/groovy-${GROOVY_VERSION}.jar && \
    curl -LO https://repo1.maven.org/maven2/org/apache/groovy/groovy-json/${GROOVY_VERSION}/groovy-json-${GROOVY_VERSION}.jar && \
    curl -LO https://repo1.maven.org/maven2/org/apache/groovy/groovy-jsr223/${GROOVY_VERSION}/groovy-jsr223-${GROOVY_VERSION}.jar

USER kafka
```

## Multiple replicas of Debezium Connect

If you plan to horizontally replicate this image, be aware that this will create a Kafka Connect cluster with more than one worker. Before doing this, consider the following:

- A Kafka Connect cluster distributes connector tasks across workers, but a Debezium connector has only one task. Thus, even with multiple workers, only one will be active at a time, while the others remain idle. The benefit is that if a worker fails, the task is automatically reassigned to another healthy worker.
- Kafka Connect exposes REST APIs that are used extensively to manage the Debezium connector. With multiple workers, if the API call is forwarded to a worker that is not the coordinator, it needs to forward the request to the cluster coordinator. Therefore, you need to ensure that replicas can communicate with each other. In particular, each replica needs the `CONNECT_REST_ADVERTISED_HOST_NAME` environment variable to be configured with its reachable hostname. This is not feasible with common cloud technologies that replicate Docker containers (e.g. Azure App Service) because usually it is not possbile to change the value of an environment variable across replicated containers.


## Integration with Oracle Database
Due to licensing reasons, if you want to use Debezium Connect for an Oracle database, you need to build your own image and manually include the Oracle JDBC. Here's a sample of a Dockerfile that can be used as a starting point (ensure the JDBC group, version, and MD5 are correct):
```Dockerfile
FROM quay.io/debezium/connect:2.5

ENV KAFKA_CONNECT_JDBC_DIR=$KAFKA_CONNECT_PLUGINS_DIR/kafka-connect-jdbc

# These should point to the driver version to be used
ENV MAVEN_DEP_DESTINATION=$KAFKA_HOME/libs \
    ORACLE_JDBC_REPO="com/oracle/database/jdbc" \
    ORACLE_JDBC_GROUP="ojdbc10" \
    ORACLE_JDBC_VERSION="19.21.0.0" \
    ORACLE_JDBC_MD5=55544d916412e364112695485d078a66

# Download Oracle JDBC driver
RUN docker-maven-download central "$ORACLE_JDBC_REPO" "$ORACLE_JDBC_GROUP" "$ORACLE_JDBC_VERSION" "$ORACLE_JDBC_MD5"

USER kafka
```

For configurations about Oracle Archivelog, Oracle Redo Log and Oracle User Permissions. You can refer to the respective sections in the [Debezium Server](/fast_data/connectors/debezium_cdc.md#oracle-db) documentation.
