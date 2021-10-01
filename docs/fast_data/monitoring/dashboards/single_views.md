---
id: single_views
title: Single Views
sidebar_label: Single Views
---

This Dashboard is mainly concerned with Single Views related concepts, and a Single View Creator service is required for exposing the metrics of interest.

Click <a download target="_blank" href="/docs_files_to_download/single-view-creator.json">**here**</a> to download the dashboard.

### Single View Creator Service

When working with Fast Data, you should already have one or more Single View Creator services, which will expose the relevant metrics. No additional configuration is needed.

## Panels

The Dashboard contains the following panels, first depicted in sample screenshots, and later described in detail in the table below.

![single views dashboard - part 1](../../img/dashboards/single_view_creator_1.png)
![single views dashboard - part 2](../../img/dashboards/single_view_creator_2.png)

| Panel Name                         | Descritpion                                                                                                                                                          |
|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Avg Processing Rate [SV/s]         | Average number of projection changes that are processed per second to generate Single Views (in the current time-frame)                                              |
| Max Processing Rate [SV/s]         | Maximum number of projection changes that have been processed per second to generate Single Views in the current time-frame                                          |
| Total # SV processed               | Total amount of Projection Changes processed to generate Single Views in the current time-frame (approximated)                                                       |
| Total # SV Generation Errors       | Total amount of errors encountered while generating Single Views in the current time-frame (approximated). Only events that are not ERROR_SEND_SVC_EVENT are counted |
| Total # Kafka Production Errors    | Total amount of errors encountered while generating Single Views in the current time-frame (approximated). Only events equal to ERROR_SEND_SVC_EVENT are counted     |
| SVC Processing Rate                | Processing Rate of projection changes for the creation of Single Views, grouped by Single View Type and Portfolio Origin                                             |
| SVC Service Replicas               | Number of active replicas for Single View Creator services, grouped by deployment                                                                                    |
| SVC Validation Error               | Shows the amount of validation errors obtained from generating Single Views in the time interval                                                                     |
| SVC No Generation Error            | Shows the amount of Single Views not generated in the time interval                                                                                                  |
| SVC single PC to multiple SV Error | Shows the amount of errors due to a violation of the 1-to-1 relationship between a Projection Change and the generated Single Views in the time interval             |
| SVC Max Aggregation Time Error     | Shows the amount of max aggregation time errors (caused by exceeding allowed computation time) obtained from generating Single Views in the time interval            |
| SVC Unknown Error                  | Shows the amount of unknown errors obtained from generating Single Views in the time interval                                                                        |
| SVC Kafka Send Error               | Shows the amount of errors obtained while sending messages to Kafka in the time interval                                                                             |
| SVC Operation Types                | Shows how many operations are performed generating Single Views, grouped by Operation Type                                                                           |
| SV Creation Time                   | Show the total amount of time spent creating Single Views                                                                                                            |

