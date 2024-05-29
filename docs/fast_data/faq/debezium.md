---
id: debezium
title: Debezium
sidebar_label: Debezium
---

This page contains some useful answers to common questions about Debezium.

# Debezium Connect
This section covers the usage of Debezium as a Kafka Connect connector, specifically when using the official Docker image `quay.io/debezium/connect`.

## How to filter messages before publishing to Kafka?
To filter messages before puglishing to Kafka, you can use [Debezium Message Filtering](https://debezium.io/documentation/reference/2.6/transformations/filtering.html). Add the following properties to your connector's configuration:
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

## Network errors on Debezium Logs

When running Debezium on a Kafka Connect worker, you might notice logs like the following, even if it appears to publish database changes to Kafka correctly:
```
2024-04-17T15:41:54.443721180Z 2024-04-17 15:41:54,443 INFO   ||  [Producer clientId=debezium-test-offsets] Disconnecting from node 3 due to request timeout.   [org.apache.kafka.clients.NetworkClient]
2024-04-17T15:41:54.443858886Z 2024-04-17 15:41:54,443 INFO   ||  [Producer clientId=debezium-test-offsets] Cancelled in-flight METADATA request with correlation id 29 due to node 3 being disconnected (elapsed time since creation: 30101ms, elapsed time since send: 30101ms, request timeout: 30000ms)   [org.apache.kafka.clients.NetworkClient]

2024-04-17T15:36:24.007240933Z 2024-04-17 15:36:24,006 INFO   ||  [Producer clientId=debezium-test-offsets] Disconnecting from node 1 due to request timeout.   [org.apache.kafka.clients.NetworkClient]
2024-04-17T15:36:24.007278734Z 2024-04-17 15:36:24,007 INFO   ||  [Producer clientId=debezium-test-offsets] Cancelled in-flight METADATA request with correlation id 26 due to node 1 being disconnected (elapsed time since creation: 30100ms, elapsed time since send: 30100ms, request timeout: 30000ms)   [org.apache.kafka.clients.NetworkClient]

2024-04-17T15:36:24.670836538Z 2024-04-17 15:36:24,669 INFO   ||  [Producer clientId=debezium-test-statuses] Disconnecting from node 1 due to request timeout.   [org.apache.kafka.clients.NetworkClient]
2024-04-17T15:36:24.670874039Z 2024-04-17 15:36:24,669 INFO   ||  [Producer clientId=debezium-test-statuses] Cancelled in-flight METADATA request with correlation id 26 due to node 1 being disconnected (elapsed time since creation: 30087ms, elapsed time since send: 30087ms, request timeout: 30000ms)   [org.apache.kafka.clients.NetworkClient]

2024-04-17T15:39:21.873977791Z 2024-04-17 15:39:21,873 INFO   ||  [AdminClient clientId=debezium-test-shared-admin] Node 1 disconnected.   [org.apache.kafka.clients.NetworkClient]

2024-04-17T15:37:57.430055843Z 2024-04-17 15:37:57,429 INFO   ||  [Worker clientId=connect-1, groupId=debezium-test] Disconnecting from node 1 due to request timeout.   [org.apache.kafka.clients.NetworkClient]
2024-04-17T15:37:57.430390748Z 2024-04-17 15:37:57,430 INFO   ||  [Worker clientId=connect-1, groupId=debezium-test] Cancelled in-flight METADATA request with correlation id 1106 due to node 1 being disconnected (elapsed time since creation: 42006ms, elapsed time since send: 42006ms, request timeout: 40000ms)   [org.apache.kafka.clients.NetworkClient]
```

These logs typically indicate that idle connections with Kafka brokers are being closed by the Kafka Connect worker and are not a cause for concern.

## Multiple replicas of Debezium Connect

If you are running Debezium in a Kafka Connect cluster, consider the following before adding more than one worker to your cluster:

- A Kafka Connect cluster distributes connector tasks across workers, but a Debezium connector has only one task. Thus, even with multiple workers, only one will be active at a time, while the others remain idle. The benefit is that if a worker fails, the task is automatically reassigned to another healthy worker.
- Kafka Connect exposes REST APIs that are used extensively to manage the Debezium connector. With multiple workers, if the API call is forwarded to a worker that is not the coordinator, it needs to forward the request to the cluster coordinator. Therefore, you need to ensure that replicas can communicate with each other. In particular, each replica needs the `CONNECT_REST_ADVERTISED_HOST_NAME` environment variable to be configured with its reachable hostname. This is not feasible with common cloud technologies that replicate Docker containers (e.g. Azure App Service) because usually it is not possbile to change the value of an environment variable across replicated containers.

# Debezium Oracle connector

This section addresses questions specific to the Oracle connector.

## How to add the Oracle JDBC to the Debezium Docker image?
Due to licensing reasons, if you want to use Debezium to connect to an Oracle database, you need to build your own image and manually include the Oracle JDBC. Use the following Dockerfile (ensure the JDBC group, version, and MD5 are correct):
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

## Oracle connector fails with ORA-00600 error

If your Debezium Oracle connector fails with the `ORA-00600` error, it indicates an internal Oracle database error. Although it is challenging to pinpoint the cause, restarting the connector typically resolves the issue. To automate recovery from this error, you can set up a cron job to:

- Check the status of the Oracle connector using the `GET/connectors/:connectorId/status` API.
- If the connector's task is in `FAILED` status, restart the connector and its tasks using the `POST/connectors/:connectorId/restart?includeTasks=true` API.

## Oracle connector fails with error "Online REDO LOG files or archive log files do not contain the offset scn. Please perform a new snapshot."
This error usually occurs in two scenarios:

1. Your Oracle connector stays offline longer than the retention period of the Oracle REDO and archive logs. When you restart the connector, it tries to find the SCN where it last stopped, and if it is no longer available, you get this error.
2. The initial snapshot takes longer than the Oracle log retention period, leading to this error right after the snapshot ends, before starting the mining session.  

Since this error necessitates a new initial snapshot, reducing its likelihood is crucial:

1. Implement a cron job as suggested earlier to avoid prolonged offline periods for the connector.
2. Measure the initial snapshot duration and request your DBA to increase the log retention period to cover this duration.

## Oracle connector fails with error "ORA-01950: no privileges on tablespace 'USERS'"
This error occurs when a dedicated tablespace for the Debezium user has not been created. Your Oracle DBA needs to:
- Create a new tablespace:
```SQL
sqlplus sys/top_secret@//localhost:1521/ORCLCDB as sysdba

  CREATE TABLESPACE logminer_tbs DATAFILE '/opt/oracle/oradata/ORCLCDB/logminer_tbs.dbf'
    SIZE 25M REUSE AUTOEXTEND ON MAXSIZE UNLIMITED;
  exit;
```

- Assign the new tablespace as the default for the Debezium user and grant it unlimited quota:
```SQL
sqlplus sys/top_secret@//localhost:1521/ORCLCDB as sysdba

  ALTER USER debezium_user DEFAULT TABLESPACE logminer_tbs;
  ALTER USER debezium_user QUOTA UNLIMITED ON logminer_tbs;
```
