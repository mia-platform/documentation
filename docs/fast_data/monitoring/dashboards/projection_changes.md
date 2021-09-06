---
id: projection_changes
title: Projection Changes
sidebar_label: Projection Changes
---

This Dashboard is mainly concerned with Projection-Changes related concepts, and a Mongodb Query Exporter service is required for exposing the metrics of interest.

Click <a download target="_blank" href="/docs_files_to_download/projections-changes.json">**here**</a> to download the dashboard.

### Mongodb Query Exporter Service

This service is responsible for exporting information about Mongodb concerning how many  Projection Changes are in a `NEW` state. It is based on [an open-source project](https://github.com/raffis/mongodb-query-exporter), so we make use of the Docker image, and then add the relevant configmaps to set it up correctly.

## Panels

The Dashboard contains the following panels, first depicted in sample screenshots, and later described in detail in the table below.

![projection changes dashboard - part 1](../../img/dashboards/projection_changes_1.png)

| Panel Name                                        | Descritpion                                                                                                 |
|-------------------------------------------------- |------------------------------------------------------------------------------------------------------------ |
| Total Number of Projections Changes in state NEW  | Shows the number of projection changes that have been updated and not yet read in the specified namespace.  |
| System Projection Changes                         | Shows the number of projection changes that have been updated and not yet read in the whole cluster.        |
