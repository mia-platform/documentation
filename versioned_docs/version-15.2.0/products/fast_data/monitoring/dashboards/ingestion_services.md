---
id: ingestion_services
title: Ingestion services
sidebar_label: Ingestion services
---

This dashboard focuses solely on the Ingestion services of the Fast Data ([Real-Time Updater](/products/fast_data/realtime_updater.md) and [Projection Storer](/products/fast_data/projection_storer.md)) and displays information related to the ingestion process (the saving, updating or deleting of projection records coming from the CDC). Among the features you'll see:

- I/O message rate (ingestion messages process and pr-updates published)
- Consumer lag per topic
- Mongo commands execution time
- CPU/Memory usage of the service
- ...

To discover all the features you can download the dashboard's json <a download target="_blank" href="/docs_files_to_download/dashboards/ingestion-services.json">**here**</a> and import it on your Grafana portal.

:::note
Just like with the other dashboards, be sure to check out the [Fast Data Services metrics](/products/fast_data/monitoring/overview.md#fast-data-services-metrics) section to make sure the metrics are exposed correctly.
:::