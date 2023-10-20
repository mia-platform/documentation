---
id: overview
title: Providers Overview
sidebar_label: Providers
---

Providers can be generically defined as connection information to use and manage external services using the Console.

The Mia-Platform Console supports providers with 3 different capabilities:

* **Git Providers**: allow users to manage repositories within their workspace;
* **Secret Managers**: allow users to securely store API keys, passwords, certificates, and other sensitive data;
* **CI/CD (Continuous Integration and Continuous Delivery) Tools**: allow users to automate one or more stages of the so-called CI/CD pipelines (which usually consist of commit, build, test, and deploy).

The following table shows the providers currently supported by the Console, grouped by capability:

<table>
   <thead>
      <tr>
         <th></th>
         <th><strong>Providers</strong></th>
         <th><strong>`type` in data model</strong></th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td rowspan="4"><strong>Git Provider</strong></td>
         <td><img src="/img/gitlab.png" width="15" height="15"/> GitLab</td>
         <td>gitlab</td>
      </tr>
      <tr>
         <td><img src="/img/github.png" width="15" height="15"/> GitHub</td>
         <td>github</td>
      </tr>
      <tr>
         <td><img src="/img/azure-repos.png" width="15" height="15"/> Azure Repos</td>
         <td>azure-devops</td>
      </tr>
      <tr>
         <td><img src="/img/bitbucket-server.ico" width="15" height="15"/> Bitbucket Server</td>
         <td>bitbucket</td>
      </tr>
      <tr>
         <td rowspan="2"><strong>Secret Manager</strong></td>
         <td><img src="/img/gitlab.png" width="15" height="15"/> GitLab</td>
         <td>gitlab</td>
      </tr>
      <tr>
         <td><img src="/img/vault.png" width="15" height="15"/> Vault</td>
         <td>vault</td>
      </tr>
      <tr>
         <td rowspan="4"><strong>CI/CD Tool</strong></td>
         <td><img src="/img/gitlab.png" width="15" height="15"/> GitLab CI Runners</td>
         <td>github-ci</td>
      </tr>
      <tr>
         <td><img src="/img/github.png" width="15" height="15"/> GitHub Actions</td>
         <td>github-actions</td>
      </tr>
      <tr>
         <td><img src="/img/azure-pipelines.png" width="15" height="15"/> Azure Pipelines</td>
         <td>azure-pipelines</td>
      </tr>
      <tr>
         <td><img src="/img/jenkins.png" width="15" height="15"/> Jenkins</td>
         <td>jenkins</td>
      </tr>
   </tbody>
</table>

The supported version of the services are present in [this table](/self_hosted/self_hosted_requirements.md#software-and-hardware-prerequisites).
