---
id: debezium_cdc
title: Debezium CDC
sidebar_label: Debezium CDC
---

This dashboard shows information related to Debezium server, focusing on events production and the server's hardware performance. Among the features displayed you can find:

- Total number of events
- Rate of events through time
- Service's memory and CPU usage
- ...

To discover all the features download the dashboard's json <a download target="_blank" href="/docs_files_to_download/dashboards/debezium-cdc.json">**here**</a> and import it on your Grafana portal.

:::note
To use this dashboard you'll need to configure and deploy a [Debezium CDC](/fast_data/connectors/debezium_cdc.md) service plugin which you can find in the console's marketplace under the `Add-ons - Fast Data Connectors` category. Also, don't forget to check out the [Fast Data Services metrics](/fast_data/monitoring/overview.md#fast-data-services-metrics) section.
:::