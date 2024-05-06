---
id: overview
title: Salesforce StreamingAPI Connector Service
sidebar_label: Overview
---
The **Salesforce Connector Service** provides a way to import data from StreamingAPI directly into your FastData
projections. It's completely configurable via environment variables and yaml configuration files. It provides
checkpoint management and error management using a DLQ and an external service, the **Salesforce Connector DLQ Service**.

The service supports various features, such as:
- support for different kinds of topics: `PushTopic`, `ChangeDataCapture` and `Custom`
- configurable replay policy in case a checkpoint is invalid or not found
- multiple connections to different topics
- custom field names mapping to convert Salesforce objects into your projection format
- health checks that monitor Kafka connection and disconnected topics
- Grafana dashboards

:::note The service uses api 53.0 to connect to StreamingAPI.:::
