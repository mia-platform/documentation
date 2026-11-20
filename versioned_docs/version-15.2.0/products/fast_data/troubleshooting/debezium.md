---
id: debezium
title: Debezium
sidebar_label: Debezium
---

This page contains some useful answers to common questions about Debezium.

# Debezium Connect
This section covers the usage of Debezium as a Kafka Connect connector, specifically when using the official Docker image `quay.io/debezium/connect`.

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


# Debezium Oracle connector

This section addresses questions specific to the Oracle connector.

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
