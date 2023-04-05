---
id: debezium_cdc
title: Debezium Server CDC
sidebar_label: Debezium Server CDC
---

This page provides instructions on how to configure the Debezium Server to connect with all the databases that are supported.

## Overview

As previously introduced, in the Mia-Platform Marketplace are available a set of plugins that repackages Debezium Server image, adding the [JMX Prometheus Exporter](https://github.com/prometheus/jmx_exporter) to expose collected metrics regarding the connector.

These plugins are shipped with a predefined configuration tailored for the database of interest to speed up the configuration and deployment phase. This configuration, saved in a file named `application.properties` is mounted as a config map on the path `/debezium/conf` within the container. This leverages the mechanism of [Quarkus](https://quarkus.io/) framework, on which Debezium Server is based, in order to extend the base configuration of a service.

:::info
Current Debezium Server plugin requires a dependency on [Redis](https://redis.io/) for storing the metadata regarding the offset and schema management. More details on offset management can be found [below](/fast_data/connectors/debezium_cdc.md#offsets-management).

For more details on how Debezium works we recommend checking out the [official Debezium documentation](https://debezium.io/documentation/reference/2.1/), in particular the section regarding [Debezium Server](https://debezium.io/documentation/reference/2.1/operations/debezium-server.html).
:::

Once the plugin is created in Mia-Platform Console, there are a few environment variables (secret or public, depending on their sensitivity) to be created and configured, which are reported in the following table.

<!-- FIXME: https://makeitapp.atlassian.net/browse/FDC-7 -->
| Name                      | Required | Description                                                                                                                  | Default Value | Configuration Section                          |
| ------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------- |
| HTTP_PORT                 | false    | Port exposed by the service                                                                                                  | 3000          | Service Environment Variables                  |
| METRICS_HTTP_PORT         | false    | Port exposed by the service for metrics                                                                                      | 3001          | Service Environment Variables                  |
| LOG_LEVEL                 | false    | Log level used by the service                                                                                                | INFO          | Service Environment Variables                  |
| REDIS_HOSTNAME            | true     | Hostname or IP address to which Debezium should connect to                                                                   | -             | Public Variables/Project Environment Variables |
| REDIS_PORT                | false    | Redis port exposed by selected host                                                                                          | 6379          | Service Environment Variables                  |
| DEBEZIUM_SOURCE_TASK_NAME | true     | Name of the specific connector task                                                                                          | -             | Public Variables/Project Environment Variables |
| DEBEZIUM_REDIS_USERNAME   | true     | Debezium account username for accessing Redis                                                                                | -             | Public Variables/Project Environment Variables |
| DEBEZIUM_REDIS_PASSWORD   | true     | Debezium account password for accessing Redis                                                                                | -             | Public Variables/Project Environment Variables |
| DATABASE_HOSTNAME         | true     | Hostname or IP address of the database Debezium should connect and monitor changes                                           | -             | Public Variables/Project Environment Variables |
| DATABASE_PORT             | true     | Database port on which Debezium should connect to                                                                            | -             | Public Variables/Project Environment Variables |
| DEBEZIUM_DB_USERNAME      | true     | Debezium account username for accessing the database                                                                         | -             | Public Variables/Project Environment Variables |
| DEBEZIUM_DB_PASSWORD      | true     | Debezium account password for accessing the database                                                                         | -             | Public Variables/Project Environment Variables |
| TOPIC_PREFIX              | true     | Prefix to be added to each table on the sink topics where database changes are published                                     | -             | Public Variables/Project Environment Variables |
| DATABASES_LIST            | true     | Comma separated list of database names or regular expression that defines which databases should be monitored                | -             | Public Variables/Project Environment Variables |
| TABLES_LIST               | true     | Comma separated list of tables names (with their schema) or regular expression that defines which tables should be monitored | -             | Public Variables/Project Environment Variables |
| KAFKA_BROKERS             | true     | Comma separated list of nodes address belonging to a Kafka cluster                                                           | -             | Public Variables/Project Environment Variables |
| KAFKA_USERNAME            | true     | The Kafka username                                                                                                           | -             | Public Variables/Project Environment Variables |
| KAFKA_PASSWORD            | true     | The Kafka password                                                                                                           | -             | Public Variables/Project Environment Variables |
| KAFKA_CLIENT_ID           | false    | Client identifier employed by this application                                                                               | -             | Public Variables/Project Environment Variables |

## Debezium Server Configuration

In this section, some configuration examples for each supported database and some instructions on how to configure and enable the database itself for CDC operations are provided. Furthermore, it is clarified why Debezium Server CDC currently requires to be connected also to an instance of Redis.

In the next paragraphs, the configurations that have been tested out with the Debezium Server plugin are detailed.  
Currently, the default sink configuration is prefilled with Kafka properties, since it is the main event streaming platform supported by Fast-Data. Nonetheless, it is possible to fill it with any of the Debezium-supported sink configurations as explained in the [official documentation](https://debezium.io/documentation/reference/2.1/operations/debezium-server.html#_sink_configuration). 

### MySQL

CDC on MySQL can exploit the database binlog ([Binary Log](https://dev.mysql.com/doc/refman/8.0/en/binary-log.html)), which keep tracks of all the changes occurring within the database. In order to allow Debezium execute its replication operations it is therefore necessary to enable the binlog and create a user which can read the database of interest.

Regarding enabling MySQL binary log, we recommend checking out Debezium [instructions](https://debezium.io/documentation/reference/2.1/connectors/mysql.html#enable-mysql-binlog) and refer to the [MySQL manual](https://dev.mysql.com/doc/refman/8.0/en/replication-options-binary-log.html) since it is necessary to edit the server configuration files. 

#### Database User and Permission Configuration

The commands to create a dedicated user to CDC operations, granting the proper permissions, are provided here below.

```sql
-- CDC Configurations (replace variables identified with double curly braces with their correct value)
CREATE USER '{{DEBEZIUM_DB_USERNAME}}' IDENTIFIED WITH mysql_native_password BY '{{DEBEZIUM_DB_PASSWORD}}';

-- these are global privileges that must be granted on all the databases to be monitored
GRANT SELECT,RELOAD,SHOW DATABASES,REPLICATION SLAVE,REPLICATION CLIENT ON *.* TO '{{DEBEZIUM_DB_USERNAME}}';

-- ensure privileges are set
FLUSH PRIVILEGES;
```

#### Debezium Service Configuration

Once the database is configured, it is possible to configure the Debezium Server instance, filling in the _source_ and _sink_ configuration. An example using MySQL as _source_, Redis as offsets and metadata store and Kafka as _sink_ is provided here below.

<details>
<summary>Click here to show/hide the example configuration for MySQL</summary>

```shell
# Application configuration
quarkus.http.port = ${HTTP_PORT}
quarkus.log.level = ${LOG_LEVEL}
# unfortunately logging in JSON returns an output with too many spacing that hinder readability
quarkus.log.console.json = false
quarkus.log.console.json.excluded-keys = sequence,loggerClassName

# Source configuration
debezium.source.name = {{DEBEZIUM_SOURCE_TASK_NAME}}
debezium.source.tasks.max = 1
debezium.source.connector.class = io.debezium.connector.mysql.MySqlConnector

# Metadata management
debezium.source.offset.flush.interval.ms = 15000
debezium.source.offset.storage = io.debezium.storage.redis.offset.RedisOffsetBackingStore
debezium.source.offset.storage.redis.address = {{REDIS_HOSTNAME}}:{{REDIS_PORT}}
debezium.source.offset.storage.redis.user = {{DEBEZIUM_REDIS_USERNAME}}
debezium.source.offset.storage.redis.password = {{DEBEZIUM_REDIS_PASSWORD}}

# it important to prevent keys overlap so that different CDC instances
# (with different configurations) do not interfere with each other
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
debezium.sink.name = {{DEBEZIUM_SINK_TASK_NAME}}
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

# Transforms
debezium.transforms=Reroute
debezium.transforms.Reroute.type=io.debezium.transforms.ByLogicalTableRouter
# to all tables that are mapped onto topics
debezium.transforms.Reroute.topic.regex=(.+)
# add the suffix .ingestion
debezium.transforms.Reroute.topic.replacement=$1.ingestion
# this disable the additional parameter that is added to the key, since the service it still sending
# each table to their own topic and therefore the key is still unique within that topic
debezium.transforms.Reroute.key.enforce.uniqueness=false

```

</details>

:::note
For an in depth explanation of the particular database configuration, we suggest reading the [official documentation](https://debezium.io/documentation/reference/2.1/connectors/mysql.html).
:::

### Oracle DB

Debezium CDC over Oracle Database exploits the [LogMiner](https://docs.oracle.com/en/database/oracle/oracle-database/21/sutil/oracle-logminer-utility.html) Oracle component to read and analyze the _redo_ logs (either the `archive` or the `online` logs). In order to allow Debezium carrying out its task the `ARCHIVELOG` feature has to be activated.

The instructions and references to instruct an [AWS RDS for Oracle](https://aws.amazon.com/rds/oracle/) instance to be ready for CDC operations are reported here below.

#### Enable `ARCHIVELOG`

As a first step let's check whether the feature is already available on your database instance:
```sql
SELECT LOG_MODE FROM V$DATABASE;

LOG_MODE
------------
ARCHIVELOG
```

In case `LOG_MODE` is not set to `ARCHIVELOG` it means the feature is not enabled. Consequently, it has to be activated executing the following AWS RDS administration procedures:

```sql
# define log files retention
exec rdsadmin.rdsadmin_util.set_configuration('archivelog retention hours', 24);

# enable further logs to be written for supporting LogMiner operations
exec rdsadmin.rdsadmin_util.alter_supplemental_logging('ADD');
```

:::caution
In order to actually activate `ARCHIVELOG` feature on AWS RDS for Oracle, the database backup must be enabled (it may require a database restart). This instructs the system to retain also the redo file for the configured amount of time, so that the CDC features work as expected.

Current, one day backup retention does not introduce any new cost on the AWS plan, as explained on [AWS blog](https://aws.amazon.com/blogs/database/demystifying-amazon-rds-backup-storage-costs/). 
:::

:::note
For further details, please check out [Debezium for Oracle documentation](https://debezium.io/documentation/reference/2.1/connectors/oracle.html#_preparing_the_database).
:::

#### Database User and Permission Configuration

In this paragraph, the commands that create a database user dedicated to Debezium Server and that grant the appropriate permissions are listed.
Please, remember to replace `{{DEBEZIUM_DB_USERNAME}}` and `{{DEBEZIUM_DB_PASSWORD}}` with the real values of your use case.

```sql
# these works to assign permissions and create user dedicated to CDC
CREATE TABLESPACE logminer_tbs DATAFILE SIZE 50M AUTOEXTEND ON MAXSIZE 10G;

CREATE USER {{DEBEZIUM_DB_USERNAME}} IDENTIFIED BY {{DEBEZIUM_DB_PASSWORD}} DEFAULT TABLESPACE logminer_tbs;
GRANT CREATE SESSION TO {{DEBEZIUM_DB_USERNAME}};
GRANT SELECT ON V$DATABASE to {{DEBEZIUM_DB_USERNAME}};

GRANT SELECT_CATALOG_ROLE TO {{DEBEZIUM_DB_USERNAME}};
GRANT EXECUTE_CATALOG_ROLE TO {{DEBEZIUM_DB_USERNAME}};

# fine grain permission assignments
GRANT SELECT ON "<schema-name>"."<table-name>" TO {{DEBEZIUM_DB_USERNAME}};

# enable to keep track of changes across all the tables columns
ALTER TABLE "<schema-name>"."<table-name>" ADD SUPPLEMENTAL LOG DATA (ALL) COLUMNS;

# permission to allow performing snapshot of the selected tables 
GRANT FLASHBACK ON "<schema-name>"."<table-name>" TO {{DEBEZIUM_DB_USERNAME}};

GRANT SELECT ANY TRANSACTION TO {{DEBEZIUM_DB_USERNAME}};
GRANT LOGMINING TO {{DEBEZIUM_DB_USERNAME}};

GRANT CREATE TABLE TO {{DEBEZIUM_DB_USERNAME}}; 
GRANT LOCK ANY TABLE TO {{DEBEZIUM_DB_USERNAME}}; 
GRANT CREATE SEQUENCE TO {{DEBEZIUM_DB_USERNAME}}; 

GRANT SELECT ON V$LOG TO {{DEBEZIUM_DB_USERNAME}};
GRANT SELECT ON V$LOGFILE TO {{DEBEZIUM_DB_USERNAME}};

GRANT SELECT ON V$ARCHIVED_LOG TO {{DEBEZIUM_DB_USERNAME}};
GRANT SELECT ON V$TRANSACTION TO {{DEBEZIUM_DB_USERNAME}};

# provide permissions to read a specific operations log
# Debezium can read from each of them, depending on its configuration (by default it reads from Archive Log)
GRANT READ ON DIRECTORY ONLINELOG_DIR TO {{DEBEZIUM_DB_USERNAME}};
GRANT READ ON DIRECTORY ARCHIVELOG_DIR TO {{DEBEZIUM_DB_USERNAME}};

## The database user MUST be set UPPERCASE otherwise the procedure won't work (it would return error invalid schema)
exec rdsadmin.rdsadmin_util.grant_sys_object('V_$LOG_HISTORY', '{{DEBEZIUM_DB_USERNAME}}', 'SELECT', true);
exec rdsadmin.rdsadmin_util.grant_sys_object('V_$LOGMNR_LOGS', '{{DEBEZIUM_DB_USERNAME}}', 'SELECT', true);
exec rdsadmin.rdsadmin_util.grant_sys_object('V_$LOGMNR_CONTENTS', '{{DEBEZIUM_DB_USERNAME}}', 'SELECT', true);
exec rdsadmin.rdsadmin_util.grant_sys_object('V_$LOGMNR_PARAMETERS', '{{DEBEZIUM_DB_USERNAME}}', 'SELECT', true);
exec rdsadmin.rdsadmin_util.grant_sys_object('V_$ARCHIVE_DEST_STATUS', '{{DEBEZIUM_DB_USERNAME}}', 'SELECT', true);

exec rdsadmin.rdsadmin_util.grant_sys_object('DBMS_LOGMNR', '{{DEBEZIUM_DB_USERNAME}}', 'EXECUTE', true);
exec rdsadmin.rdsadmin_util.grant_sys_object('DBMS_LOGMNR_D', '{{DEBEZIUM_DB_USERNAME}}', 'EXECUTE', true);
```

#### Redo Log Configuration

By default, four different log file are available on AWS RDS for Oracle, each of them set to a size of 128MB. Their size might not be sufficient for CDC operations, such that Debezium Server might issue the following warning log:

> Redo logs may be sized too small using the default mining strategy, consider increasing redo log sizes to a minimum of 500MB.

Following this recommendation, the size of Redo log files should be increased, for example to 512MB each. The steps to achieve this are:
- create a number of new log files, corresponding to the one initially available, each of them with the new required size
- rotate the active log file until one of the newer files is selected
- deactivate the previous log files so that they can be deleted without issues
- drop the default log files

These operations are clearly described on the [AWS RDS Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.Oracle.CommonDBATasks.Log.html#Appendix.Oracle.CommonDBATasks.ResizingRedoLogs), so that we advise to read such guide to perform these actions on the database.

:::info
It is possible to find a reference for each of AWS RDS Administration tasks described above in the AWS RDS [Administration documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.Oracle.CommonDBATasks.html). 
:::

#### Debezium Service Configuration

Once the database is configured, it is possible to configure the Debezium Server instance, filling in the _source_ and _sink_ configuration. An example using Oracle as _source_, Redis as offsets and metadata store and Kafka as _sink_ is provided here below.

<details>
<summary>Click here to show/hide the example configuration for Oracle</summary>

```shell
# Application Configuration
quarkus.http.port = ${HTTP_PORT}
quarkus.log.level = ${LOG_LEVEL}
# unfortunately logging in JSON returns an output with too many spacing that hinder readability
quarkus.log.console.json = false
quarkus.log.console.json.excluded-keys = sequence,loggerClassName

# Source Configuration
debezium.source.name = {{DEBEZIUM_SOURCE_TASK_NAME}}
debezium.source.tasks.max = 1
debezium.source.connector.class = io.debezium.connector.oracle.OracleConnector

# Metadata management
debezium.source.offset.flush.interval.ms = 15000
debezium.source.offset.storage = io.debezium.storage.redis.offset.RedisOffsetBackingStore
debezium.source.offset.storage.redis.address = {{REDIS_HOSTNAME}}:{{REDIS_PORT}}
debezium.source.offset.storage.redis.user = {{DEBEZIUM_REDIS_USERNAME}}
debezium.source.offset.storage.redis.password = {{DEBEZIUM_REDIS_PASSWORD}}

# it important to prevent keys overlap so that different CDC instances
# (with different configurations) do not interfere with each other 
debezium.source.offset.storage.redis.key = metadata::debezium-oracle::offsets

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
debezium.sink.name = {{DEBEZIUM_SINK_TASK_NAME}}
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

# Transforms
debezium.transforms=Reroute
debezium.transforms.Reroute.type=io.debezium.transforms.ByLogicalTableRouter
# to all tables that are mapped onto topics
debezium.transforms.Reroute.topic.regex=(.+)
# add the suffix .ingestion
debezium.transforms.Reroute.topic.replacement=$1.ingestion
# this disable the additional parameter that is added to the key, since the service it still sending
# each table to their own topic and therefore the key is still unique within that topic
debezium.transforms.Reroute.key.enforce.uniqueness=false
```

</details>

:::note
For an in depth explanation of the particular database configuration, we suggest reading the [official documentation](https://debezium.io/documentation/reference/2.1/connectors/oracle.html).
:::

### PostgreSQL

On PostgreSQL in order to receive the executed operations from the DB (following the CDC pattern) you have mainly two options:

- Use the `decoderbufs` plugin
- Use the `pgoutput` plugin

The `decoderbufs` plugin is developed and mantained by the Debezium community and needs to be installed on your current PostgreSQL installation. 
The `pgoutput` plugin is a plugin developed and mantained by the PostgreSQL community and comes already installed with PostgresSQL 10+. 
To know more about the plugins and how to install them check out the [Debezium official docs](https://debezium.io/documentation/reference/2.1/postgres-plugins.html#logical-decoding-plugin-setup) about it.

<!-- CDC on MySQL can exploit the database binlog ([Binary Log](https://dev.mysql.com/doc/refman/8.0/en/binary-log.html)), which keep tracks of all the changes occurring within the database. In order to allow Debezium execute its replication operations it is therefore necessary to enable the binlog and create a user which can read the database of interest.

Regarding enabling MySQL binary log, we recommend checking out Debezium [instructions](https://debezium.io/documentation/reference/2.1/connectors/mysql.html#enable-mysql-binlog) and refer to the [MySQL manual](https://dev.mysql.com/doc/refman/8.0/en/replication-options-binary-log.html) since it is necessary to edit the server configuration files.  -->

#### Database User and Permission Configuration

The Debezium PostgreSQL plugin needs a user with the permissions of `LOGIN`, `REPLICATION` and `SELECT` in all the observed tables in the schema. Here's a snippet on how to create such user:

```sql
CREATE ROLE your_debezium_user LOGIN REPLICATION PASSWORD 'your_debezium_password';

-- Usually the schema's name (your_db_schema) is `public`
GRANT SELECT ON ALL TABLES IN your_db_schema TO your_debezium_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA your_db_schema GRANT SELECT ON TABLES TO your_debezium_user;
```

#### Debezium service configuration

Once the DB is ready to operate with the Debezium connector you can configure the connector to your needs. 
As mentioned before, the plugin is configured through the file `application.properties` but we went ahead and linked the necessary variables to your environment variables (please refer to the table in the [overview](#overview) section).

:::danger
Since the connection to a PostgresSQL is always directly to a specific DB, more than one DBs cannot be observed at the same time. 
Because of that we've replaced the `DATABASES_LIST` env var for the `DATABASE_NAME` which is the name of the DB you want to observe.
:::

If the configuration we've mapped is not enough to cover your needs you can directly modify the `application.properties` config map file in the connector service following the official indications of the [Debezium Plugin](https://debezium.io/documentation/reference/2.1/connectors/postgresql.html). 
Mind that the plugin is based on the [Debezium Server](https://debezium.io/documentation/reference/2.1/operations/debezium-server.html) image so the declared properties must follow the convention.

Here's an example of the full configuration for the plugin:


<details>
<summary>Click here to show/hide the example configuration for PostgreSQL</summary>

```shell
# Application Configuration
quarkus.http.port = ${HTTP_PORT:3000}
quarkus.log.level = ${LOG_LEVEL:INFO}
quarkus.log.console.json = false
quarkus.log.console.json.excluded-keys = sequence,loggerClassName

# Source Configuration
debezium.source.name = {{DEBEZIUM_SOURCE_TASK_NAME}}
debezium.source.tasks.max = 1
debezium.source.connector.class = io.debezium.connector.postgresql.PostgresConnector
debezium.source.offset.flush.interval.ms = 15000
debezium.source.offset.storage = io.debezium.storage.redis.offset.RedisOffsetBackingStore
debezium.source.offset.storage.redis.address = {{REDIS_HOSTNAME}}:${REDIS_PORT}
debezium.source.offset.storage.redis.user = {{DEBEZIUM_REDIS_USERNAME}}
debezium.source.offset.storage.redis.password = {{DEBEZIUM_REDIS_PASSWORD}}
debezium.source.offset.storage.redis.key = metadata::debezium-postgres::offsets

debezium.source.schema.history.internal = io.debezium.storage.redis.history.RedisSchemaHistory
debezium.source.schema.history.internal.redis.address = {{REDIS_HOSTNAME}}:${REDIS_PORT}
debezium.source.schema.history.internal.redis.user = {{DEBEZIUM_REDIS_USERNAME}}
debezium.source.schema.history.internal.redis.password = {{DEBEZIUM_REDIS_PASSWORD}} 

debezium.source.database.hostname = {{DATABASE_HOSTNAME}}
debezium.source.database.port = {{DATABASE_PORT}}
debezium.source.database.user = {{DEBEZIUM_DB_USERNAME}}
debezium.source.database.password = {{DEBEZIUM_DB_PASSWORD}}

debezium.source.database.server.id = 1
debezium.source.database.ssl.mode = <CONFIGURE_ME>
debezium.source.topic.prefix = {{TOPIC_PREFIX}}
debezium.source.topic.naming.strategy = io.debezium.schema.DefaultTopicNamingStrategy

debezium.source.database.dbname = {{DATABASE_NAME}}
debezium.source.table.include.list = {{TABLES_LIST}}

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

# Sink Configuration
debezium.sink.type = kafka
debezium.sink.name = {{DEBEZIUM_SINK_TASK_NAME}}
debezium.sink.kafka.producer.bootstrap.servers={{KAFKA_BROKERS}}
debezium.sink.kafka.producer.client.id = dz-cdc-mysql-producer-{{ENVIRONMENT_TO_DEPLOY}}

debezium.sink.kafka.producer.ssl.endpoint.identification.algorithm = HTTPS
debezium.sink.kafka.producer.security.protocol = SASL_SSL
debezium.sink.kafka.producer.sasl.mechanism = SCRAM-SHA-256
debezium.sink.kafka.producer.sasl.jaas.config = org.apache.kafka.common.security.scram.ScramLoginModule required username=\"{{KAFKA_USERNAME}}\" password=\"{{KAFKA_PASSWORD}}\";

debezium.sink.kafka.producer.key.serializer = org.apache.kafka.common.serialization.StringSerializer
debezium.sink.kafka.producer.value.serializer = org.apache.kafka.common.serialization.StringSerializer

debezium.sink.kafka.producer.acks = all
debezium.sink.kafka.producer.max.in.flight.requests.per.connection = 5
debezium.sink.kafka.producer.enable.idempotence = true
debezium.sink.kafka.producer.min.insync.replicas = 2
debezium.sink.kafka.producer.retries = 2147483647
debezium.sink.kafka.producer.compression.type = snappy

# Format Configuration
debezium.format.key = json
debezium.format.value = json

# Transforms
debezium.transforms=Reroute
debezium.transforms.Reroute.type=io.debezium.transforms.ByLogicalTableRouter
debezium.transforms.Reroute.topic.regex=(.+)
debezium.transforms.Reroute.topic.replacement=$1.ingestion
debezium.transforms.Reroute.key.enforce.uniqueness=false
```

</details>

## Offsets Management

When Debezium CDC starts it initially creates a snapshot of the database, if configured so, and then it starts monitoring any change that occurs over the configured databases and tables. To keep track of which change events were consumed and forwarded to the _sink_ resource, Debezium Server requires saving the offsets metadata somewhere. Currently, these methods are supported:

- on file: `org.apache.kafka.connect.storage.FileOffsetBackingStore`
- on Redis: `io.debezium.storage.redis.offset.RedisOffsetBackingStore`

Considering that the Debezium Server plugin offered in Mia-Platform Marketplace is tailored for being deployed on Kubernetes as a `Deployment` resource, it is recommended to exploit the Redis method to not lose progress across potential pod restarts. 

:::note
The offset management mechanism in the standalone Debezium Server differs from Debezium deployed as a Kafka Connector, since in the latter offsets metadata are handled directly by Kafka Connect framework.
:::

### Redis Storage

Here is provided a Redis (`v6`) configuration file that provides the set of features to support Debezium offsets management for _development_ purposes. This configuration can be employed to deploy Redis in Kubernetes alongside the Debezium Server pod.  

:::caution
The following Redis configuration is suitable only for _development_ purposes. In fact, all the data stored within it are not saved back onto a disk, but only retained in memory. Therefore, any service restart would invalidate any CDC progress and cause your CDC application to restart.

Consequently, we strongly recommend to rely on an external production ready Redis cluster.
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
