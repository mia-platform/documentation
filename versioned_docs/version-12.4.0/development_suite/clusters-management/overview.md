---
id: overview
title: Clusters Overview
sidebar_label: Clusters
---

Mia-Platform Console allows authorized users to manage the Kubernetes clusters on which projects are deployed. 

## Supported vendors and runtime services

When the user [connects a new cluster](/development_suite/clusters-management/connect-and-manage-cluster.mdx), they are required to enter information about the cluster's vendor and runtime service.
To date, the Console only supports runtime services based on Kubernetes, and all vendors can be associated with the following runtime services:

* Kubernetes (https://kubernetes.io);
* Red Hat OpenShift (https://www.redhat.com/en/technologies/cloud-computing/openshift).

Besides, the following table displays the runtime services currently supported by the Console, grouped by vendor.

| Vendor                      | Runtime services                                      	| Documentation |
|-----------------------------|-------------------------------------------------------- |----------------------------------
| Google Cloud Platform (GCP) | <ul><li>Google Kubernetes Engine (GKE)</li><li>GKE Autopilot</li></ul>  | <ul><li>https://cloud.google.com/kubernetes-engine</li><li>https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview</li></ul> |
| Amazon Web Services (AWS)   | <ul><li>Elastic Kubernetes Service (EKS)</li><li>EKS Fargate</li></ul>  | <ul><li>https://aws.amazon.com/eks</li><li>https://aws.amazon.com/fargate</li></ul> |
| Microsoft Azure             | <ul><li>Azure Kubernetes Service (AKS)</li></ul>                   	     | <ul><li>https://learn.microsoft.com/en-us/azure/aks</li></ul> |
| Oracle Cloud                | <ul><li>Oracle Container Engine for Kubernetes (OKE)</li></ul>           | <ul><li>https://www.oracle.com/cloud/cloud-native/container-engine-kubernetes</li></ul> |

It is also possible for the user to add a Kubernetes or OpenShift cluster not associated with any of the supported vendors. In this case, the cluster's vendor will be labeled as "Other".
