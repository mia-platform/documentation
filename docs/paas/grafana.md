---
id: grafana
title:  Grafana
sidebar_label: Grafana
---

Mia-Platform PaaS offers to its users a Grafana instances where they can monitor metrics and logs of their own applications.  

To access Mia-Platform PaaS Grafana instance [click here](https://grafana.mia-platform.eu/). Use your Mia-Platform Console credentials to access your Grafana organization. If you can't access to Grafana, request access through our [Customer Portal](https://makeitapp.atlassian.net/servicedesk/customer/portal/21).  

## Monitoring dashboards

After logging into your Grafana organization, you will have access to a collection of ready-to-use dashboards, enabling you to monitor your applications instantly. Your Mia-Platform PaaS Company is already configured and connected to Grafana, all metrics from your namespaces are automatically collected and available for immediate visualization and analysis.

![An overview of Grafana Dashboards](img/grafana-dashboards.png)

Out-of-the-box dashboards are:

* Api Gateway APIs
* Kubernetes Cluster resources
* Kubernetes Cluster resources pods by namespace
* Kubernetes Cluster resources workloads by namespace
* Kubernetes Cluster resources pods
* Kubernetes Cluster resources workloads
* Kubernetes Cluster networking
* Kubernetes Cluster networking pods by namespace
* Kubernetes Cluster networking workloads by namespace
* Kubernetes Cluster networking pods
* Kubernetes Cluster networking workloads
* Mia-Platform PaaS License Review

## Application logs

Grafana's integration with our logging services enables you to access and visualize your application logs. By correlating logs with metrics, you gain deeper insights into application behavior and can efficiently troubleshoot any issues that may arise.  

To explore your application logs, simply navigate to the `Explore` section within Grafana and select `Loki` datasource. Then, enter your Loki query (e.g.: `{namespace="mia-platform"}`) and click on `Run query` to fetch the relevant log data instantly. 

![An overview of Grafana Logs](img/grafana-logs.png)  

## Retention policy  

We enforce retention policies within our monitoring and logging stack in order to determine how long data is stored in our system. These policies ensure that you can effectively monitor and troubleshoot your applications while maintaining optimal performance levels.

By default, Mia-Platform PaaS applies the following retention policies:  

* Metrics data is retained for 45 days.
* Logs data is retained for 15 days.

However, we understand that different customers may have specific requirements. If you need longer retention periods, our service allows for easy customization based on your specific needs.

