---
id: self-hosted-runtime-requirements
title: Self-Hosted runtime installation requirements
sidebar_label: System requirements for applications runtime
---
Applications developed with Mia-Platform Console will run in a Kubernetes environment. This Kubernetes runtime environment will be managed and monitored by Mia-Platform Console.  
In order to do this, the following requirements must be fulfilled for a self-hosted installation.

### Self-Hosted runtime installation prerequisites

The following tools will be installed in your runtime Kubernetes clusters:  

* Monitoring stack
* Logging stack
* Traefik Ingress Controller
* (Optional) Velero for Disaster Recovery

In addition to the above tools, on the Kubernetes cluster hosting Mia-Platform Console will be installed Grafana Mimir in order to provide a horizontally scalable, highly available, multi-tenant, long term storage for Prometheus.

Your runtime Kubernetes cluster needs the following minimum requirements:  

:::note
These are minimum requirements for your cluster. These requirements have a scale factor that must be taken in account when estimating your cluster size.
:::

| **Tool**                     | **Namespace CPU limits** | **Namespace RAM limits** | **Scales with**                                               |
|------------------------------|--------------------------|--------------------------|---------------------------------------------------------------|
| Monitoring stack             | 1 core                   | 3 GiB                    | Number of cluster nodes, number of metrics                    |
| Logging stack                | 0.5 core                 | 1 GiB                    | Number of cluster nodes, number of applications logs, traffic |
| Traefik Ingress Controller   | 0.3 core                 | 300 MiB                  | Traffic                                                       |
| Velero for Disaster Recovery | 0.2 core                 | 400 MiB                  | -                                                             |

In total, the minimum requirements in order to host all the above tools in the Kubernetes cluster are about 2 cores and 5 GiB of memory. Above values will scale with the number of nodes, traffic, applications.

Velero, in addition, needs a S3-like bucket storage for keeping the Kubernetes cluster backup.

Grafana Mimir will be installed in the same Kubernetes cluster hosting Mia-Platform Console. The minimum requirements needed for Grafana Mimir are 2 cores and 4 GiB of memory.

For a simple Mia-Platform Console Project with 3 environments, a minimum of 6 cores and 12 GiB of memory are needed. Of course this is just an indicative estimation and the right sizing depends on your application.

### Reference architectures

:::note
The following requirements are just an approximate reference. For a more accurate estimate, an assessment of your application and architecture is needed.
:::

To size your cluster you should reserve a minimum of 3 cores for Operations tools and minimum 2 cores for each Runtime Environment managed by Mia-Platform. A Project can managed one or more Runtime Environment.

Cluster sizing examples:

* 1 Mia-Platform Project with 3 Runtime Environments: 5 worker nodes (2 cores, 4 GiB RAM each). 4 cores for Operations tools and 6 cores for your applications
* 3 Mia-Platform Project with 3 Runtime Environments: 12 worker nodes (2 cores, 4 GiB RAM each). 5 cores for Operations tools and 19 cores for your applications
* 5 Mia-Platform Project with 3 Runtime Environments: 18 worker nodes (2 cores, 4 GiB RAM each). 6 cores for Operations tools and 30 cores for your applications