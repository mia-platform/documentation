---
id: self-hosted-requirements
title: Self-Hosted installation requirements
sidebar_label: System requirements
---

Mia-Platform Console Self Hosted installation implies that the customer has already installed in its systems all the required software and tools.

### Self-Hosted installation architecture

The following picture shows the high-level architecture for a Self-Hosted Mia-Platform Console installation. The communication between the components must be allowed as shown in the architecture.

![Self-Hosted installation architecture](img/self_hosted_architecture_with_mia_nexus.png)

The following software and hardware recommendations are for installing Mia-Platform Console On-Premises.

### Software and Hardware prerequisites  

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
         <td>> 14.x</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td><img src="/img/github.png" width="15" height="15"/> GitHub</td>
         <td>> 3.x</td>
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
         <td>&gt; 8.x</td>
         <td>2 cores</td>
         <td>3 GB</td>
      </tr>
      <tr>
         <td><img src="/img/keycloak.ico" width="15" height="15"/> Keycloak</td>
         <td>SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td rowspan="4"><strong>Git Provider</strong></td>
         <td><img src="/img/gitlab.png" width="15" height="15"/> GitLab</td>
         <td>&gt; 14.x</td>
         <td>4 cores</td>
         <td>4 GB</td>
      </tr>
      <tr>
         <td><img src="/img/github.png" width="15" height="15"/> GitHub</td>
         <td>&gt; 3.x</td>
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
         <td>&gt; 8.x</td>
         <td>2 cores</td>
         <td>3 GB</td>
      </tr>
      <tr>
         <td rowspan="2"><strong>Secret Manager</strong></td>
         <td><img src="/img/gitlab.png" width="15" height="15"/> GitLab</td>
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
         <td>&gt; 14.x</td>
         <td>1 core</td>
         <td>2 GB</td>
      </tr>
      <tr>
         <td><img src="/img/github.png" width="15" height="15"/> GitHub Actions</td>
         <td>SaaS</td>
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
         <td>SaaS</td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <td><strong>NoSQL database</strong></td>
         <td><img src="/img/mongodb.ico" width="15" height="15"/> MongoDB Enterprise</td>
         <td>&gt; 5<br/>&lt;= 7</td>
         <td>2 cores</td>
         <td>2 GB</td>
      </tr>
      <tr>
         <td><strong>Redis Cache</strong></td>
         <td><img src="/img/redis.png" width="15" height="15"/>Redis</td>
         <td>&gt;= 6<br/>&lt;= 7</td>
         <td>2 cores</td>
         <td>2 GB</td>
      </tr>
      <tr>
         <td><strong>Runtime</strong></td>
         <td><img src="/img/kubernetes.png" width="15" height="15"/> Kubernetes</td>
         <td>&gt; 1.20<br/>&lt;= 1.27</td>
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


### Reference Architecture

The following is an example architecture for the installation of the Mia-Platform Console supporting ~500 users and ~200 projects:

| **Tool**                  | **Version** | **Nodes**      | **CPU** | **RAM** | **Storage** |
|---------------------------|-------------|----------------|---------|---------|-------------|
| Okta                      |   SaaS       |             |      |      |          |
| GitLab                    | 14          | 1              | 8 core  | 32 GB   | 200 GB      |
| GitLab CI Runners         | 14          | 2              | 1 core  | 2 GB    | 25 GB       |
| MongoDB Enterprise        | 5           | 3              | 2 core  | 8 GB    | 20 GB       |
| Redis        | 7           | 3              | 2 core  | 8 GB    | 20 GB       |
| Google Kubernetes Engine  | 1.21        | 2 worker nodes | 4 core  | 8 GB    |          |
| Google Container Registry |   SaaS       |             |      |      |          |
| Google Cloud Storage      |   SaaS       |             |      |      |          |
| Google Cloud Platform KMS |   SaaS       |             |      |      |          |

### Designating the Console Super User

When installing an instance of Mia-Platform Console, a user with the Console Super User role will be added to the database automatically.

The Console Super User role has been designed exclusively for backoffice administration purposes. 
When assigned to a user, this role implies full visibility and management of all CMS resources.
