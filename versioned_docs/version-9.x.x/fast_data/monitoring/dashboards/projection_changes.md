---
id: projection_changes
title: Projection Changes
sidebar_label: Projection Changes
---

This Dashboard is mainly concerned with Projection-Changes related concepts, and a MongoDB Query Exporter service is required for exposing the metrics of interest.

Click <a download target="_blank" href="/docs_files_to_download/projection-changes.json">**here**</a> to download the dashboard.

For a fast and complete configuration of all necessary monitoring services, you should use Mia Platform [Fast Data Monitoring Application](../overview.md#fast-data-monitoring-application).  
One of the services that will be generated using Fast Data Monitoring application is the MongoDB Query Exporter. This service will be automatically configured to export information about MongoDB concerning how many Projection Changes are in a `NEW` state.

## Panels

The Dashboard contains the following panels, first depicted in sample screenshots, and later described in detail in the table below.

![projection changes dashboard - part 1](../../img/dashboards/projection_changes_1.png)

| Panel Name                                        | Description                                                                                                 |
|-------------------------------------------------- |------------------------------------------------------------------------------------------------------------ |
| Total Number of Projections Changes in state NEW  | Shows the number of projection changes that have been updated and not yet read in the specified namespace.  |
| System Projection Changes                         | Shows the number of projection changes that have been updated and not yet read in the whole cluster.        |
