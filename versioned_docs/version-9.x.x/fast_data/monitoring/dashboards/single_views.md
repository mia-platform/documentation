---
id: single_views
title: Single Views
sidebar_label: Single Views
---

This Dashboard is mainly concerned with Single Views related concepts, and a Single View Creator service is required for exposing the metrics of interest.

Click <a download target="_blank" href="/docs_files_to_download/single-view-creator.json">**here**</a> to download the dashboard.

### Single View Creator Service

When working with Fast Data, you should already have one or more Single View Creator services, which will expose the relevant metrics. No additional configuration is needed.

The metrics exposed by the SVC are:

| Metric Name                        | Description                                                                                        | Buckets                                                           | Version |
|------------------------------------|----------------------------------------------------------------------------------------------------|------------------------------------------------------------------|---------|
| svc_pcs_handled_total              | counts how many projections changes were successfully processed                                    |                                                                  |    3.0.0     |
| svc_error_gen_total                | counts how many errors were raised from the SV generation                                          |                                                                  |    3.0.0     |
| svc_operation_type_total           | counts the different amount of operations produced to Kafka                                        |                                                                  |     3.0.0    |
| svc_creation_time                  | creates an histogram tracking creation time of the single views'                                   | 0.1, 30, 150, 500, 1000, 2000, 5000, 15000, 30000                |    3.0.0     |
| svc_projection_to_single_view_time | creates an histogram tracking the amount of time spent from projection to single view              | 0.1, 30, 150, 500, 1000, 2000, 5000, 15000, 30000, 60000, 120000 |    3.7.2     |
| svc_pc_total_handle_time           | creates an histogram tracking projection changes handle time plus creation time of the single view | 0.1, 30, 150, 500, 1000, 2000, 5000, 15000, 30000                |    3.0.0     |

## Panels

The Dashboard contains the following panels, first depicted in sample screenshots, and later described in detail in the table below.

![single views dashboard - part 1](../../img/dashboards/single_view_creator_1.png)
![single views dashboard - part 2](../../img/dashboards/single_view_creator_2.png)

| Panel Name                         | Description                          |                                                                                                                Dependencies               |
|------------------------------------|--------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| Avg Processing Rate [SV/s]         | Average number of projection changes that are processed per second to generate Single Views (in the current time-frame)                                              | `svc_pcs_handled_total` |
| Max Processing Rate [SV/s]         | Maximum number of projection changes that have been processed per second to generate Single Views in the current time-frame                                          | `svc_pcs_handled_total` |
| Total # SV processed               | Total amount of Projection Changes processed to generate Single Views in the current time-frame (approximated)                                                       | `svc_pcs_handled_total` |
| Total # SV Generation Errors       | Total amount of errors encountered while generating Single Views in the current time-frame (approximated). Only events that are not ERROR_SEND_SVC_EVENT are counted | `svc_error_gen_total` |
| Total # Kafka Production Errors    | Total amount of errors encountered while generating Single Views in the current time-frame (approximated). Only events equal to ERROR_SEND_SVC_EVENT are counted     | `svc_operation_type_total` |
| SVC Processing Rate                | Processing Rate of projection changes for the creation of Single Views, grouped by Single View Type and Portfolio Origin                                             | `svc_pcs_handled_total` |
| SVC Service Replicas               | Number of active replicas for Single View Creator services, grouped by deployment                                                                                    | |
| SVC Validation Error               | Shows the amount of validation errors obtained from generating Single Views in the time interval                                                                     | `svc_error_gen_total` |
| SVC No Generation Error            | Shows the amount of Single Views not generated in the time interval                                                                                                  | `svc_error_gen_total` |
| SVC single PC to multiple SV Error | Shows the amount of errors due to a violation of the 1-to-1 relationship between a Projection Change and the generated Single Views in the time interval             | `svc_error_gen_total` |
| SVC Max Aggregation Time Error     | Shows the amount of max aggregation time errors (caused by exceeding allowed computation time) obtained from generating Single Views in the time interval            | `svc_error_gen_total` |
| SVC Unknown Error                  | Shows the amount of unknown errors obtained from generating Single Views in the time interval                                                                        | `svc_error_gen_total` |
| SVC Kafka Send Error               | Shows the amount of errors obtained while sending messages to Kafka in the time interval                                                                             | `svc_error_gen_total` |
| SVC Operation Types                | Shows how many operations are performed generating Single Views, grouped by Operation Type                                                                           | `svc_error_gen_total` |
| SV Creation Time                   | Shows the total amount of time spent creating Single Views                                                         | `svc_creation_time` |
| Projection To Single View Time     | Shows the total amount of time spent from the ingestion message, sent by the CDC, to the Single View update                                          | `svc_pc_total_handle_time` |
| PC To Single View Time             | Shows the total amount of time spent from the handling of the Projection Changes to the creation of the Single View                  | `svc_projection_to_single_view_time` |  

