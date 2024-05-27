---
id: debezium
title: Debezium
sidebar_label: Debezium
---

This section contains some useful answer to common questions about Debezium.

## Network errors on Debezium Logs

When running Debezium on a Kafka Connect worker, despite it seems to properly publish database changes to Kafka, you may notice some logs like the following:
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

These logs do not represent an issue for your Debezium instance. They are likely some idle connection with Kafka brokers being closed by the Kafka Connect worker.

## Oracle connector fails with ORA-00600 error

If your Debezium Oracle connector suddenly fails with the `ORA-00600` error, it is for an Oracle internal error that happens within your Oracle Database. While it is usually difficult to identify the cause of this error, a restart of the connector does restores the correct functioning. Thus, an easy way to automatically recover from this error is to implement a cronjob running every x minutes that does the following:
- checks to status of the Oracle connector by invoking the `GET/connectors/:connectorId/status` API
- if the the connector's task is in `FAILED` status, then restarts the connector and its task by invoking `POST/connectors/:connectorId/restart?includeTasks=true`
