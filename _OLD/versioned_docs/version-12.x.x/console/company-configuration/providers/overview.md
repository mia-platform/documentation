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
         <th><strong><tt>type</tt> in data model</strong></th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td rowspan="4"><strong>Git Provider</strong></td>
         <td><img src="/img/gitlab.png" width="15" height="15"/> GitLab</td>
         <td><tt>gitlab</tt></td>
      </tr>
      <tr>
         <td><img src="/img/github.png" width="15" height="15"/> GitHub</td>
         <td><tt>github</tt></td>
      </tr>
      <tr>
         <td><img src="/img/azure-repos.png" width="15" height="15"/> Azure Repos</td>
         <td><tt>azure-devops</tt></td>
      </tr>
      <tr>
         <td><img src="/img/bitbucket-server.ico" width="15" height="15"/> Bitbucket Server</td>
         <td><tt>bitbucket</tt></td>
      </tr>
      <tr>
         <td rowspan="3"><strong>Secret Manager</strong></td>
         <td><img src="/img/gitlab.png" width="15" height="15"/> GitLab</td>
         <td><tt>gitlab</tt></td>
      </tr>
      <tr>
         <td><img src="/img/vault.png" width="15" height="15"/> Vault</td>
         <td><tt>vault</tt></td>
      </tr>
      <tr>
         <td><img src="/img/azure-key-vault.png" width="15" height="15"/> Azure Key Vault</td>
         <td><tt>azure-key-vault</tt></td>
      </tr>
      <tr>
         <td rowspan="4"><strong>CI/CD Tool</strong></td>
         <td><img src="/img/gitlab.png" width="15" height="15"/> GitLab CI Runners</td>
         <td><tt>github-ci</tt></td>
      </tr>
      <tr>
         <td><img src="/img/github.png" width="15" height="15"/> GitHub Actions</td>
         <td><tt>github-actions</tt></td>
      </tr>
      <tr>
         <td><img src="/img/azure-pipelines.png" width="15" height="15"/> Azure Pipelines</td>
         <td><tt>azure-pipelines</tt></td>
      </tr>
      <tr>
         <td><img src="/img/jenkins.png" width="15" height="15"/> Jenkins</td>
         <td><tt>jenkins</tt></td>
      </tr>
   </tbody>
</table>

The supported version of the services are present in [this table](/infrastructure/self-hosted/self-hosted-requirements.md#software-and-hardware-prerequisites).
