---
id: overview
title: Overview
sidebar_label: Overview
---

A great way of monitoring Fast Data is using Dashboards, which can give you immediate feedback on various aspects of system health. We provide some already configured [Grafana Dashboards](https://grafana.com/grafana/dashboards) to quickly set up a monitoring stack that grants both Dashboards and Alerts.

To do so, there are a couple of steps you need to follow.

## Console Setup

The Grafana Dashboards make use of [Prometheus](https://prometheus.io/) metrics, which means that you should enable the monitoring of your project (for example, using Prometheus Operator) and export the metrics of interest.  

Each Dashboard has a dedicated service for metrics export, and those services can be all added to your project simultaneously with a single application.

## Fast Data Monitoring Application

You can create and configure all necessary monitoring services in just few clicks. To do so, visit Mia Platform Marketplace and search for `Fast Data Monitoring` Application. By using this application, you generate two completely configured microservices that will allow you to export all the necessary metrics for your dashboards.
The two services that will be generated with this application use the docker images of the following open source projects:

* [Kafka Exporter](https://github.com/danielqsj/kafka_exporter)
* [MongoDB Query Exporter](https://github.com/raffis/mongodb-query-exporter)

:::caution
If you are planning to use [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) as a monitoring system for your project, you can automatically generate and configure the `servicemonitor.yml` files for all the monitoring services using their [Metrics card](../../development_suite/api-console/api-design/microservice-monitoring.md).
:::

## Grafana Dashboards Setup

We assume you already have Grafana up and running, and you are familiar with its basics.

There are three Dashboards ready to use:

1. [Consumer Groups](/fast_data/monitoring/dashboards/consumer_groups.md)
2. [Projection Changes](/fast_data/monitoring/dashboards/projection_changes.md)
3. [Single Views](/fast_data/monitoring/dashboards/single_views.md)

More details on what information they provide in their specific pages.

## Putting It All Together

Once your Dashboards are ready, it can be very handy to view them directly inside the console. To do that, you can visit the `Dashboards` section of your project and add the Dashboards you just created to it, as explained [here](../../development_suite/monitoring/dashboard.md#add-a-dashboard).
