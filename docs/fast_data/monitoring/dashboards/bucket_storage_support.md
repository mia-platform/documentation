---
id: bucket_storage_support
title: Bucket Storage Support
sidebar_label: Bucket Storage Support
---

This dashboard shows all you need to know about your Fast Data [Bucket Storage Support](/fast_data/bucket_storage_support/overview.md) system. It focuses on the consumer, producer and bucket metrics exposed by the two services of the BSS: The [Ingestion Storer](/fast_data/bucket_storage_support/configuration/ingestion_storer.md) and the [Ingestion Reloader](/fast_data/bucket_storage_support/configuration/ingestion_reloader.md). Among the displayed features you can find:

- Ingestion Storer message ingestion rate
- Services replicas and general kafka info such as lag, fetch latency, commit latency, rebalance latency...
- Ingestion Storer bucket upload rate
- Ingestion Reloader bucket download rate
- ...

To discover all the features download the dashboard's json <a download target="_blank" href="/docs_files_to_download/dashboards/bucket-storage-support.json">**here**</a> and import it on your Grafana portal.

:::note
To use this dashboard you'll need to configure and deploy at least one of the two BSS services. Also, don't forget to check out the [Fast Data Services metrics](/fast_data/monitoring/overview.md#fast-data-services-metrics) section.
:::