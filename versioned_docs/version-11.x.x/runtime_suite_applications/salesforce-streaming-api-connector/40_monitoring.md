---
id: monitoring
title: Monitoring
sidebar_label: Monitoring
---
Both Connector and Connector DLQ services expose some **Prometheus** metrics used to monitor how many changes are
processed, including failures and errors.

## Prometheus Counters

### Connector

Metric Name | Meaning | Tags
--- | --- | ---
connector.received_events | Counter of events received via Streaming API | salesforce_topic
connector.processed_events | Counter of events processed by the service | salesforce_topic, outcome
connector.invalid_replay_id | Counter of checkpoints that result in invalid replay IDs | salesforce_topic

The `outcome` tag can have four possible values:
- `decode_error`: the message couldn't be parsed
- `success`: the message was processed successfully and sent to the projection
- `dlq`: the message was sent to DLQ
- `failed`: the message couldn't event be sent to DLQ

### Connector DLQ

Metric Name | Meaning | Tags
--- | --- | ---
connector_dlq.received_message | Counter of events received by the DLQ | 
connector_dlq.processed_message | Counter of processed messages | salesforce_topic, outcome, death_reason

The `outcome` tag can have two values:
- success
- error

The `outcome` tag can have five values:
- `unhandledError`: some unexpected error happened
- `decodingError`: the message couldn't be decoded
- `idNotFoundError`: the Id couldn't be parsed from the message
- `sfGetRecordError`: the call to Salesforce Rest APIs failed
- `kafkaError`: there was an error while sending the outcome to the projection
