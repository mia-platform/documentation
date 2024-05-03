---
id: license-metrics
title: License Audit Logs
sidebar_label: Monitor the license
---

For correctly track the correct usage of resources allowed by the Mia-Platform Console License, the installation
setup a cronjob that will track a series of metrics that are needed to be inspected upon request by Mia s.r.l.

For allowing the scripts to work correctly and keep the audit inspection to the shortest time possible there are some
prerequisites to do:

- inside the clusters connected to the Mia-Platform Console should be installed the official k8s metrics server
  (already a precondition for the runtime and homepage sections of the console)
- the service account used in the connection between the cluster and the console should have permissions to:
  - list and read the cluster nodes
  - read the [Metrics API](https://github.com/kubernetes/metrics)

## Metrics collected

The script is set to run every 15 minutes (but can be customized) and to get the following list of metrics:

- aggregated metrics for the installation
  - number of total users
  - number of active users ( users that has used the console at least once in a month period )
  - number of cms users (users that has access to the CMS of the Console)
  - number of tenants
  - number of connected clusters
  - number of projects
  - number of active projects ( projects with an activity in a month period )
  - number of namespaces controlled by the console
  - number of environments
  - number of resources published in the Marketplace
  - number of project templates
  - number of Git providers
- aggregated metrics per project (sum of all the environments used in the project)
  - number of endpoints
  - number of CRUD collections
  - number of services
  - number of applications
  - number of cronjobs
  - number of proxies
  - number of single views
  - number of projections
  - number of secrets
  - number of public environment variables
  - number of dashboards
- aggregated metrics per environment of projects
  - max between the total used CPU and total pod CPU requests
  - max between the total used RAM and total pod RAM requests
- aggregated metrics for Kubernetes clusters connected to the console
  - number of nodes
  - cluster total vCPU capacity
  - cluster total RAM capacity
- aggregated metrics for clusters nodes
  - total vCPU capacity
  - total RAM capacity
  - node name

## Monthly Aggregation

Every time the scripts run they will also create an aggregated metrics that will keep a monthly consolidation
of the current values:

- max between the total used CPU and total pod CPU requests
- max between the total used RAM and total pod RAM requests
- total vCPU capacity
- total RAM capacity
