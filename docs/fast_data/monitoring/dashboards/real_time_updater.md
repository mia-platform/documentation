---
id: real_time_updater
title: Real Time Updater
sidebar_label: Real Time Updater
---

This dashboard focuses solely on the [Real Time Updater](/fast_data/realtime_updater.md) service and displays information related to the ingestion process (the saving, updating or deleting of projection records coming from the CDC). Among the features you'll see:

- I/O message rate (ingestion messages process and pr-updates published)
- Consumer lag per topic
- Mongo commands execution time
- CPU/Memory usage of the service
- ...

To discover all the features you can download the dashboard's json <a download target="_blank" href="/docs_files_to_download/dashboards/real-time-updater.json">**here**</a> and import it on your Grafana portal.

:::note
This dashboard has widgets that will work with future versions of the Real Time Updater. Just like with the other dashboards, be sure to check out the [Fast Data Services metrics](/fast_data/monitoring/overview.md#fast-data-services-metrics) section to make sure the metrics are exposed correctly.
:::