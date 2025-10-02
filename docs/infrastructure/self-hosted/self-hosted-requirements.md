---
id: self-hosted-requirements
title: Self-Hosted installation requirements
sidebar_label: System requirements
---

Mia-Platform Console Self Hosted installation implies that the customer has already installed in its systems all the required software and tools.

## Self-Hosted installation architecture

The following picture shows the high-level architecture for a Self-Hosted Mia-Platform Console installation. The communication between the components must be allowed as shown in the architecture.

![Self-Hosted installation architecture](img/self_hosted_architecture_with_mia_nexus.png)

The following software and hardware recommendations are for installing Mia-Platform Console On-Premises.

### Architectural prerequisites  

:::note
Blanks cell in the following table are for tools that do not require a specific version or a minimum of RAM and CPU.  
:::

<table>
   <thead>
      <tr>
         <th></th>
         <th><strong>Tool</strong></th>
         <th><strong>Version</strong></th>
         <th><strong>Minimum CPU</strong></th>
         <th><strong>Minimum RAM</strong></th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td rowspan="7"><strong>Auth Provider</strong></td>
         <td><img src="/img/okta.ico" width="15" height="15"/> Okta</td>
         <td>SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td><img src="/img/gitlab.png" width="15" height="15"/> GitLab</td>
         <td>&gt;= 14.x<br/>&lt;= 18.x, SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td><img src="/img/github.png" width="15" height="15"/> GitHub</td>
         <td>3.x , SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td><img src="/img/microsoft.ico" width="15" height="15"/> Microsoft</td>
         <td>SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td><img src="/img/microsoft.ico" width="15" height="15"/> Azure AD B2C</td>
         <td>SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td><img src="/img/bitbucket-server.ico" width="15" height="15"/> Bitbucket Server</td>
         <td>8.x</td>
         <td>2 cores</td>
         <td>3 GB</td>
      </tr>
      <tr>
         <td><img src="/img/keycloak.ico" width="15" height="15"/> Keycloak</td>
         <td>&gt;= 16.x<br/>&lt;= 26.x</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td rowspan="4"><strong>Git Provider</strong></td>
         <td><img src="/img/gitlab.png" width="15" height="15"/> GitLab</td>
         <td>&gt;= 14.x<br/>&lt;= 18.x , SaaS</td>
         <td>4 cores</td>
         <td>4 GB</td>
      </tr>
      <tr>
         <td><img src="/img/github.png" width="15" height="15"/> GitHub</td>
         <td>3.x & SaaS</td>
         <td>4 cores</td>
         <td>32 GB</td>
      </tr>
      <tr>
         <td><img src="/img/azure-repos.png" width="15" height="15"/> Azure Repos</td>
         <td>SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td><img src="/img/bitbucket-server.ico" width="15" height="15"/> Bitbucket Server</td>
         <td>8.x</td>
         <td>2 cores</td>
         <td>3 GB</td>
      </tr>
      <tr>
         <td rowspan="3"><strong>Secret Manager</strong></td>
         <td><img src="/img/gitlab.png" width="15" height="15"/> GitLab</td>
         <td>&gt;= 14.x<br/>&lt;= 18.x , SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td><img src="/img/microsoft.ico" width="15" height="15"/> Azure Key Vault</td>
         <td>SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td><img src="/img/vault.png" width="15" height="15"/> Vault</td>
         <td>SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td rowspan="4"><strong>CI/CD Tool</strong></td>
         <td><img src="/img/gitlab.png" width="15" height="15"/> GitLab CI Runners</td>
         <td>&gt;= 14.x<br/>&lt;= 18.x , SaaS</td>
         <td>1 core</td>
         <td>2 GB</td>
      </tr>
      <tr>
         <td><img src="/img/github.png" width="15" height="15"/> GitHub Actions</td>
         <td>3.x , SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td><img src="/img/azure-pipelines.png" width="15" height="15"/> Azure Pipelines</td>
         <td>SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td><img src="/img/jenkins.png" width="15" height="15"/> Jenkins</td>
         <td>2.x</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td><strong>NoSQL database</strong></td>
         <td><img src="/img/mongodb.ico" width="15" height="15"/> MongoDB Community</td>
         <td>&gt; 6<br/>&lt;= 7</td>
         <td>2 cores</td>
         <td>2 GB</td>
      </tr>
      <tr>
         <td><strong>Redis Cache</strong></td>
         <td><img src="/img/redis.png" width="15" height="15"/> Redis</td>
         <td>&gt;= 6<br/>&lt;= 7</td>
         <td>2 cores</td>
         <td>2 GB</td>
      </tr>
      <tr>
         <td><strong>Runtime</strong></td>
         <td><img src="/img/kubernetes.png" width="15" height="15"/> Kubernetes</td>
         <td>&gt;= 1.25<br/>&lt;= 1.33</td>
         <td>2 CPU requests</td>
         <td>4 GiB Memory requests</td>
      </tr>
      <tr>
         <td><strong>Container image registry</strong></td>
         <td>Any container image registry</td>
         <td>SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td rowspan="3"><strong>Object Storage</strong></td>
         <td><img src="/img/gcs.png" width="15" height="15"/> Google Cloud Storage</td>
         <td>SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
        <td>S3-Compatible Object Storages</td>
        <td>SaaS</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td><img src="/img/mongodb.ico" width="15" height="15"/> MongoDB</td>
        <td>SaaS</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
         <td rowspan="2"><strong>Key Management Service</strong></td>
         <td><img src="/img/gcp.ico" width="15" height="15"/> Google Cloud Platform</td>
         <td>SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td>Local Key</td>
         <td>SaaS</td>
         <td></td>
         <td></td>
      </tr>
   </tbody>
</table>


### Suggested resource allocation per tool

:::info
The following is an example architecture for a proper installation of the Mia-Platform Console supporting ~500 users and ~200 projects:
:::

| **Tool**                  | **Version** | **Nodes**      | **CPU** | **RAM** | **Storage** |
|---------------------------|-------------|----------------|---------|---------|-------------|
| Okta                      |   SaaS      |                |         |      |          |
| GitLab                    | 18          | 1              | 8 core  | 32 GB   | 200 GB      |
| GitLab CI Runners         | 18          | 2              | 1 core  | 2 GB    | 25 GB       |
| MongoDB Enterprise        | 5           | 3              | 2 core  | 8 GB    | 20 GB       |
| Redis                     | 7           |                |         | 1 GB    | 1 GB       |
| Google Kubernetes Engine  | 1.30        | 2 worker nodes | 4 core  | 8 GB    |          |
| Google Container Registry |   SaaS      |                |      |      |          |
| Google Cloud Storage      |   SaaS      |                |      |      |          |
| Google Cloud Platform KMS |   SaaS      |                |      |      |          |


## Runtime requirements 

Applications developed with Mia-Platform Console will run in a Kubernetes environment. This Kubernetes runtime environment is managed and monitored by Mia-Platform Console.  
In order to do this, the following requirements must be fulfilled for a self-hosted installation.

### Self-Hosted runtime installation prerequisites

The following tools will be installed in your runtime Kubernetes clusters if desired:  

* (Optional) Mia Monitoring stack
* (Optional) Mia Logging stack
* (Optional) Traefik Ingress Controller
* (Optional) Velero for Disaster Recovery

:::note
These are minimum requirements for your cluster. These requirements have a scale factor that must be taken in account when estimating your cluster size.
:::

| **Tool**                     | **Namespace CPU limits** | **Namespace RAM limits** | **Scales with**                                               |
|------------------------------|--------------------------|--------------------------|---------------------------------------------------------------|
| Monitoring stack             | 1 core                   | 3 GiB                    | Number of cluster nodes, number of metrics                    |
| Logging stack                | 0.5 core                 | 1 GiB                    | Number of cluster nodes, number of applications logs, traffic |
| Traefik Ingress Controller   | 0.3 core                 | 300 MiB                  | Traffic                                                       |
| Velero for Disaster Recovery | 0.2 core                 | 400 MiB                  | -                                                             |

In total, the minimum requirements in order to host all the above tools in the Kubernetes cluster are about 4 cores and 8 GiB of memory. Above values will scale with the number of nodes, traffic, applications.

Velero, in addition, needs a S3-like bucket storage for keeping the Kubernetes cluster backup.

### Suggested resource allocation for your runtime

:::note
The following requirements are just an approximate reference. For a more accurate estimate, an assessment of your application and architecture is needed.
:::

:::info
To size your cluster you should reserve a minimum of 3 cores for Operations tools and minimum 2 cores for each Runtime Environment managed by Mia-Platform. A Project can managed one or more Runtime Environment.
:::

Cluster sizing examples:

* 3 Mia-Platform Project with 3 Runtime Environments: 12 worker nodes (2 cores, 4 GiB RAM each). 5 cores for Operations tools and 19 cores for your applications
* 5 Mia-Platform Project with 3 Runtime Environments: 18 worker nodes (2 cores, 4 GiB RAM each). 6 cores for Operations tools and 30 cores for your applications
