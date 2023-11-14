---
id: maintenance
title: Mia-Platform PaaS Maintenance
sidebar_label: PaaS Maintenance
---

Mia-Platform prioritize the smooth operation and continuous improvement of the software. To ensure the highest level of service and minimize disruptions, we have implemented a comprehensive maintenance policy. This policy encompasses regular updates, bug fixes, and system enhancements, all aimed at delivering an optimal user experience.

Regarding Mia-Platform PaaS the maintenance covers several stream:

- **Infrastructure Maintenance**: wth a focus on managing and maintaining the underlying infrastructure that supports the PaaS environment such as PaaS tools, CI/CD and K8s.

- **Security Maintenance**: with a focus on security measures to protect the platform and the applications running on it, involving activities such as implementing and managing firewalls, intrusion detection systems, access controls, data encryption, vulnerability scanning, and security patching.

- **Performance Monitoring**: with a focus on monitoring of the platform's performance to identify and resolve performance issues. It involves monitoring resource utilization, response times, and other key performance indicators.

- **Backup and Disaster Recovery Maintenance**: with a focus on testing backup and disaster recovery mechanisms to ensure data protection and business continuity.

- **Helpdesk Maintenance**: with a focus on maintaining and developing the helpdesk portal to handle user requests, troubleshooting issues, providing documentation and training materials, and ensuring a positive user experience.

## Updating Policy and procedure

Our software and infrastructure updates include:

- **Runtime**
  - Kubernetes
  - MongoDB
  - Kafka
  - CertManager
  - Traefik
  
- **Monitoring & Logging**
  - Grafana  
  - Prometheus
  - Mimir
  - Loki
  - Logging Operator
  
- **CI/CD**
  - GitLab & GitLab Runner

- **Security tools**
  - Cilium
  - OpenVPN

- **Docker Registry**
  - Nexus

:::info
The version of the charts we install, has to be considered as the latest stable version provided by the official tool charts.
:::

### Maintenance scheduling

Maintenance windows for upgrades are regularly scheduled every 3 months with at least 2 weeks notice to all the customers. Extraordinary unscheduled maintenance with shorter notice can happen in case of emergency security fixes of the infrastructure.

The updates communication are shared through the [PaaS Status Page](https://status.mia-platform.eu/).
