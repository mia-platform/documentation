---
id: overview
title: Overview
sidebar_label: Overview
---

A great way of monitoring Fast Data is using Dashboards, which can give you immediate feedback on various aspects of system health. We provide some already configured [Grafana Dashboards](https://grafana.com/grafana/dashboards) to quickly setup a monitoring stack that grants both Dashboards and Alerts.

To  do so, there are a couple of steps you need to follow.

## Console Setup

The Grafana Dashboards make use of [Prometheus](https://prometheus.io/) metrics, which means you need to export the metrics of interest. Each Dashboard has a dedicated service for metrics export, and those services are described in the relative Dashboard section. In order for them to work correctly, your project configuration must contain the `MICROSERVICE_NAME.servicemonitor.yml` for each service generating the metrics used by your dashboards.

## Grafana Dashboards Setup

We assume you already have Grafana up and running, and you are familiar with its basics.

There are three Dashboards ready to use:

1. [Consumer Groups](./dashboards/consumer_groups.md)
2. [Projection Changes](./dashboards/projection_changes.md)
3. [Single Views](./dashboards/single_views.md)

More details on what information they provide in their specific pages.

## Putting It All Together

Once your Dashboards are ready, it can be very handy to view them directly inside the console. To do that, you need to access the CMS and add the Dashboards you just created to your project, as explained [here](../../development_suite/monitoring/dashboard). The Dashboards will then be available in the Dashboard Area of the Console.
