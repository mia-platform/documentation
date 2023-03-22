---
id: debezium_cdc
title: Debezium Server CDC
sidebar_label: Debezium Server CDC
---

In this page is describe how to configure Debezium Server to connect with all the supported databases.

## Overview

As previously introduced, in the Mia-Platform Marketplace are available a set plugins that repackages Debezium Server image, adding the JMX Prometheus Exporter to expose collected metrics regarding the connector.

These plugins are shipped with a predefined configuration tailored for the database of interest to speed up the configuration and deploy phase. This configuration, saved in a file named `application.properties` is mounted as a config map on the path `/debezium/conf` within the container. This leverage the mechanism [Quarkus](https://quarkus.io/) framework, on which Debezium Server is based on, adopts to extend the base configuration of a service.

:::info
Current Debezium Server plugin has a dependency on [Redis](https://redis.io/) for storing the metadata regarding the offset and schema management. More details can be found below or in the official Documentation. 
:::

:::note
For more details on how the Debezium Server works, what are its configuration and where metadata can be stored we recommend checking out the official Debezium [documentation](https://debezium.io/documentation/reference/2.1/operations/debezium-server.html).
:::

Once the plugin is created in Mia-Platform Console, there are a few environment variables (secret or public, depending on their sensitivity) to be created and configured, which are reported in the following table.


| Name                    | Required | Description                                                                                                          | Default Value |
|-------------------------|----------|----------------------------------------------------------------------------------------------------------------------|---------------|
| HTTP_PORT               | false    | Port exposed by the service                                                                                          | 3000          |
| METRICS_HTTP_PORT       | false    | Port exposed by the service for metrics                                                                              | 3001          |
| LOG_LEVEL               | false    | Log level used by the service                                                                                        | INFO          |
| REDIS_HOSTNAME          | true     | Hostname or IP address to which Debezium should connect to                                                           | -             |  
| REDIS_PORT              | false    | Redis port exposed by selected host                                                                                  | 6379          |  
| DEBEZIUM_REDIS_USERNAME | true     | Debezium account username for accessing Redis                                                                        | -             |  
| DEBEZIUM_REDIS_PASSWORD | true     | Debezium account password for accessing Redis                                                                        | -             |   
| DATABASE_HOSTNAME       | true     | Hostname or IP address of the database Debezium should connect and monitor changes                                   | -             |  
| DATABASE_PORT           | true     | Database port on which Debezium should connect to                                                                    | -             |  
| DEBEZIUM_DB_USERNAME    | true     | Debezium account username for accessing the database                                                                 | -             |  
| DEBEZIUM_DB_PASSWORD    | true     | Debezium account password for accessing the database                                                                 | -             |  
| TOPIC_PREFIX            | true     | Prefix to be added to each table on the sink topics where database changes are published                             | -             |  
| DATABASES_LIST          | true     | Comma separated list of tables names (with their schema) or regexpr that defines which databases should be monitored | -             |  
| TABLES_LIST             | true     | Comma separated list of tables names (with their schema) or regexpr that defines which tables should be monitored    | -             |  
| KAFKA_BROKERS           | true     | Comma separated list of nodes address belonging to a Kafka cluster                                                   | -             |
| KAFKA_USERNAME          | true     | The Kafka username                                                                                                   | -             |
| KAFKA_PASSWORD          | true     | The Kafka password                                                                                                   | -             |
| KAFKA_CLIENT_ID         | false    | Client identifier employed by this application                                                                       | -             |

In the following section are provided a configuration example for each supported database and some instructions on how to configure and enable the database itself for CDC operations. Furthermore, it is clarified why Debezium Server CDC currently requires to be connected also to an instance of Redis.

## Debezium Server Configuration

In these paragraphs are detailed the configurations that have tested out with the Debezium Server plugin.  
Currently, the default sink configuration is prefilled with Kafka properties, since it is the main event streaming platform supported by Fast-Data. Nonetheless, it is possible to fill it with any of the Debezium supported sink configuration as explained in the [official documentation](https://debezium.io/documentation/reference/2.1/operations/debezium-server.html#_sink_configuration). 

### MySQL

```sql
-- CDC Configurations
CREATE USER '{{DEBEZIUM_USER_USERNAME}}' IDENTIFIED WITH mysql_native_password BY '{{DEBEZIUM_USER_PASSWORD}}';

-- RELOAD,SHOW DATABASES,REPLICATION SLAVE,REPLICATION CLIENT are global priviledges
-- that must be granted on all the databases
GRANT SELECT,RELOAD,SHOW DATABASES,REPLICATION SLAVE,REPLICATION CLIENT ON *.* TO '{{DEBEZIUM_USER_USERNAME}}';
FLUSH PRIVILEGES;
```

<details>
<summary>Click here to show/hide the example configuration for MySQL</summary>

```shell
# Application configuration
quarkus.http.port = 3000
quarkus.log.level = {{LOG_LEVEL}}
# unfortunately logging in JSON returns an output with too many spacing that hinder readability
quarkus.log.console.json = false
quarkus.log.console.json.excluded-keys = sequence,loggerClassName

# Source configuration
debezium.source.name = debezium-mysql-connectors-test
debezium.source.tasks.max = 1
debezium.source.connector.class = io.debezium.connector.mysql.MySqlConnector

# Metadata management
debezium.source.offset.flush.interval.ms = 15000
debezium.source.offset.storage = io.debezium.storage.redis.offset.RedisOffsetBackingStore
debezium.source.offset.storage.redis.address = {{REDIS_HOSTNAME}}:{{REDIS_PORT}}
debezium.source.offset.storage.redis.user = {{DEBEZIUM_REDIS_USERNAME}}
debezium.source.offset.storage.redis.password = {{DEBEZIUM_REDIS_PASSWORD}}
debezium.source.offset.storage.redis.key = metadata::debezium-mysql::offsets

debezium.source.schema.history.internal = io.debezium.storage.redis.history.RedisSchemaHistory
debezium.source.schema.history.internal.redis.address = {{REDIS_HOSTNAME}}:{{REDIS_PORT}}
debezium.source.schema.history.internal.redis.user = {{DEBEZIUM_REDIS_USERNAME}}
debezium.source.schema.history.internal.redis.password = {{DEBEZIUM_REDIS_PASSWORD}}

# Database connection configuration
debezium.source.database.hostname = {{DATABASE_HOSTNAME}}
debezium.source.database.port = {{DATABASE_PORT}}
debezium.source.database.user = {{DEBEZIUM_DB_USERNAME}}
debezium.source.database.password = {{DEBEZIUM_DB_PASSWORD}}
debezium.source.database.server.id = 1
debezium.source.database.ssl.mode = CONFIGURE_ME
debezium.source.topic.prefix = {{TOPIC_PREFIX}}

debezium.source.database.include.list = {{DATABASES_LIST}}
debezium.source.table.include.list = {{TABLES_LIST}}

# Disable forwarding schema changes events
debezium.source.include.schema.changes = false
debezium.source.include.schema.comments = false

debezium.source.key.converter = org.apache.kafka.connect.json.JsonConverter
debezium.source.key.converter.schemas.enable = false

debezium.source.value.converter = org.apache.kafka.connect.json.JsonConverter
debezium.source.value.converter.schemas.enable = false

debezium.source.poll.interval.ms = 500

# Sink configuration
debezium.sink.type = kafka
debezium.sink.name = debezium-kafka-connectors-test
debezium.sink.kafka.producer.bootstrap.servers={{KAFKA_BROKERS}}
debezium.sink.kafka.producer.client.id = {{KAFKA_CLIENT_ID}}

debezium.sink.kafka.producer.ssl.endpoint.identification.algorithm = HTTPS
debezium.sink.kafka.producer.security.protocol = SASL_SSL
debezium.sink.kafka.producer.sasl.mechanism = SCRAM-SHA-256
debezium.sink.kafka.producer.sasl.jaas.config = org.apache.kafka.common.security.scram.ScramLoginModule required username="{{KAFKA_USERNAME}}" password="{{KAFKA_PASSWORD}}";

debezium.sink.kafka.producer.key.serializer = org.apache.kafka.common.serialization.StringSerializer
debezium.sink.kafka.producer.value.serializer = org.apache.kafka.common.serialization.StringSerializer

debezium.sink.kafka.producer.acks = all
debezium.sink.kafka.producer.max.in.flight.requests.per.connection = 5
debezium.sink.kafka.producer.enable.idempotence = true
debezium.sink.kafka.producer.min.insync.replicas = 2
debezium.sink.kafka.producer.retries = 2147483647
debezium.sink.kafka.producer.compression.type = snappy

# Format configuration
debezium.format.key = json
debezium.format.value = json
```

</details>

:::note
For an in depth explanation of the particular database configuration, we suggest reading the [official documentation](https://debezium.io/documentation/reference/2.1/connectors/mysql.html)
:::

### Oracle DB

<details>
<summary>Click here to show/hide the example configuration for Oracle</summary>

```shell
# Application Configuration
quarkus.http.port = 3000
quarkus.log.level = INFO
# unfortunately logging in JSON returns an output with too many spacing that hinder readability
quarkus.log.console.json = false
quarkus.log.console.json.excluded-keys = sequence,loggerClassName

# Source Configuration
debezium.source.name = debezium-mysql-connectors-test
debezium.source.tasks.max = 1
debezium.source.connector.class = io.debezium.connector.oracle.OracleConnector

# Metadata management
debezium.source.offset.flush.interval.ms = 15000
debezium.source.offset.storage = io.debezium.storage.redis.offset.RedisOffsetBackingStore
debezium.source.offset.storage.redis.address = {{REDIS_HOSTNAME}}:{{REDIS_PORT}}
debezium.source.offset.storage.redis.user = {{DEBEZIUM_REDIS_USERNAME}}
debezium.source.offset.storage.redis.password = {{DEBEZIUM_REDIS_PASSWORD}}
debezium.source.offset.storage.redis.key = metadata::debezium-mysql::offsets

debezium.source.schema.history.internal = io.debezium.storage.redis.history.RedisSchemaHistory
debezium.source.schema.history.internal.redis.address = {{REDIS_HOSTNAME}}:{{REDIS_PORT}}
debezium.source.schema.history.internal.redis.user = {{DEBEZIUM_REDIS_USERNAME}}
debezium.source.schema.history.internal.redis.password = {{DEBEZIUM_REDIS_PASSWORD}}

# Database connection configuration
debezium.source.database.hostname = {{DATABASE_HOSTNAME}}
debezium.source.database.port = {{DATABASE_PORT}}
debezium.source.database.user = {{DEBEZIUM_DB_USERNAME}}
debezium.source.database.password = {{DEBEZIUM_DB_PASSWORD}}
debezium.source.database.dbname = {{DATABASE_NAME}}

debezium.source.database.server.id = 1
debezium.source.database.ssl.mode = CONFIGURE_ME

debezium.source.topic.prefix = {{TOPIC_PREFIX}}
debezium.source.topic.delimiter = .

debezium.source.schema.include.list = {{DATABASES_LIST}}
debezium.source.table.include.list = {{TABLES_LIST}}

# Disable forwarding schema changes events
debezium.source.include.schema.changes = false
debezium.source.include.schema.comments = false

debezium.source.key.converter = org.apache.kafka.connect.json.JsonConverter
debezium.source.key.converter.schemas.enable = false

debezium.source.value.converter = org.apache.kafka.connect.json.JsonConverter
debezium.source.value.converter.schemas.enable = false

debezium.source.poll.interval.ms = 500
debezium.source.max.batch.size = 2048
debezium.source.max.queue.size = 8192

debezium.source.tombstones.on.delete = true

debezium.source.log.mining.strategy = online_catalog

# Sink configuration
debezium.sink.type = kafka
debezium.sink.name = debezium-kafka-connectors-test
debezium.sink.kafka.producer.bootstrap.servers={{KAFKA_BROKERS}}
debezium.sink.kafka.producer.client.id = {{KAFKA_CLIENT_ID}}

debezium.sink.kafka.producer.ssl.endpoint.identification.algorithm = HTTPS
debezium.sink.kafka.producer.security.protocol = SASL_SSL
debezium.sink.kafka.producer.sasl.mechanism = SCRAM-SHA-256
debezium.sink.kafka.producer.sasl.jaas.config = org.apache.kafka.common.security.scram.ScramLoginModule required username="{{KAFKA_USERNAME}}" password="{{KAFKA_PASSWORD}}";

debezium.sink.kafka.producer.key.serializer = org.apache.kafka.common.serialization.StringSerializer
debezium.sink.kafka.producer.value.serializer = org.apache.kafka.common.serialization.StringSerializer

debezium.sink.kafka.producer.acks = all
debezium.sink.kafka.producer.max.in.flight.requests.per.connection = 5
debezium.sink.kafka.producer.enable.idempotence = true
debezium.sink.kafka.producer.min.insync.replicas = 2
debezium.sink.kafka.producer.retries = 2147483647
debezium.sink.kafka.producer.compression.type = snappy

# Format configuration
debezium.format.key = json
debezium.format.value = json
```

</details>

:::note
For an in depth explanation of the particular database configuration, we suggest reading the [official documentation](https://debezium.io/documentation/reference/2.1/connectors/oracle.html)
:::

## Offsets Management

### Redis Storage

:::caution
The following Redis configuration is suitable only for development purposes. In fact, all the data stored within it is not saved back onto a disk, but only retained in memory. Therefore, any service restart would invalidate any CDC progress and cause your CDC application to restart.

Consequently, we strongly recommend to rely on an external Redis cluster, which can be managed or not.
:::

```shell
## Generic config ##
port 6379
# listen on all the interfaces for incoming connections
bind 0.0.0.0

## Disable disk persistence when deploying on Kubernetes ##
save ""
appendonly no

## Security & ACLs ##
protected-mode yes

# NOTE: +@connection is necessary to be placed after -@dangerous, otherwise the user won't have the permissions to connect to Redis
user {{DEBEZIUM_REDIS_USERNAME}} on +@all -@dangerous +@connection allkeys allchannels >{{DEBEZIUM_REDIS_PASSWORD}}

# disable default user
user default off
```
