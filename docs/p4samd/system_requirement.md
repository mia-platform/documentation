---
id: system_requirement
title: System Requirements
sidebar_label: System Requirements
---

This page provides an overview of the system requirements necessary for deploying P4SaMD and explains how the installation process is carried out by the Mia-Care team.

The deployment of Mia-Care P4SaMD involves a structured process to ensure compatibility with your existing infrastructure and alignment with regulatory and operational needs. It includes:

- A detailed list of system requirements, including prerequisites for the Mia-Platform IDP, the need for an ALM tool, and the supported adoption models.
- A description of the installation process, highlighting the infrastructure assessment, installation steps, and the validation phase conducted by Mia-Care.

## System Requirements

Mia-Care P4SaMD is installed on behalf of Mia-Platform IDP, meaning the system requirement list contains both Mia-Platform IDP and Mia-Care P4SaMD components. For every component, a list of supported tool is presented. In the end, a target tech stack is presented.

<table>
   <thead>
      <tr>
         <th><strong>Required for</strong></th>
         <th></th>
         <th><strong>Tool</strong></th>
         <th><strong>Version</strong></th>
         <th><strong>Mandatory</strong></th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td rowspan="7">Mia-Platform IDP <br /> Mia-Care P4SaMD</td>
         <td rowspan="7"><strong>Auth Provider</strong></td>
         <td>Okta</td>
         <td>SaaS</td>
         <td rowspan="7">Yes</td>
      </tr>
      <tr>
         <td>GitLab</td>
         <td>&gt; 14.x</td>
      </tr>
      <tr>
         <td>GitHub</td>
         <td>&gt; 3.x</td>
      </tr>
      <tr>
         <td>Microsoft</td>
         <td>SaaS</td>
      </tr>
      <tr>
         <td>Azure AD B2C</td>
         <td>SaaS</td>
      </tr>
      <tr>
         <td>Bitbucket Server</td>
         <td>&gt; 8.x</td>
      </tr>
      <tr>
         <td>Keycloak</td>
         <td>SaaS</td>
      </tr>
      <tr>
         <td rowspan="4">Mia-Platform IDP</td>
         <td rowspan="4"><strong>Git Provider</strong></td>
         <td>GitLab</td>
         <td>&gt; 14.x</td>
         <td rowspan="4">Yes</td>
      </tr>
      <tr>
         <td>GitHub</td>
         <td>&gt; 3.x</td>
      </tr>
      <tr>
         <td>Azure Repos</td>
         <td>SaaS</td>
      </tr>
      <tr>
         <td>Bitbucket Server</td>
         <td>&gt; 8.x</td>
      </tr>
      <tr>
         <td rowspan="2">Mia-Platform IDP</td>
         <td rowspan="2"><strong>Secret Manager</strong></td>
         <td>GitLab</td>
         <td>SaaS</td>
         <td rowspan="2">Yes</td>
      </tr>
      <tr>
         <td>Vault</td>
         <td>SaaS</td>
      </tr>
      <tr>
         <td rowspan="4">Mia-Platform IDP</td>
         <td rowspan="4"><strong>CI/CD Tool</strong></td>
         <td>GitLab CI Runners</td>
         <td>&gt; 14.x</td>
         <td rowspan="4">Yes</td>
      </tr>
      <tr>
         <td>GitHub Actions</td>
         <td>SaaS</td>
      </tr>
      <tr>
         <td>Azure Pipelines</td>
         <td>SaaS</td>
      </tr>
      <tr>
         <td>Jenkins</td>
         <td>SaaS</td>
      </tr>
      <tr>
         <td>Mia-Platform IDP <br/> Mia-Care P4SaMD</td>
         <td><strong>NoSQL database</strong></td>
         <td>MongoDB Enterprise</td>
         <td>&gt; 5<br/>&lt;= 7</td>
         <td>Yes</td>
      </tr>
      <tr>
         <td>Mia-Platform IDP <br/> Mia-Care P4SaMD</td>
         <td><strong>Redis Cache</strong></td>
         <td>Redis</td>
         <td>&gt;= 6<br/>&lt;= 7</td>
         <td>Yes</td>
      </tr>
      <tr>
         <td>Mia-Platform IDP <br/> Mia-Care P4SaMD</td>
         <td><strong>Runtime</strong></td>
         <td>Kubernetes</td>
         <td>&gt;= 1.21<br/>&lt;= 1.30</td>
         <td>Yes</td>
      </tr>
      <tr>
         <td rowspan="3">Mia-Platform IDP <br/> Mia-Care P4SaMD</td>
         <td rowspan="3"><strong>Object Storage</strong></td>
         <td>Google Cloud Storage</td>
         <td>SaaS</td>
         <td rowspan="3">Yes</td>
      </tr>
      <tr>
         <td>S3-Compatible Object Storages</td>
         <td>SaaS</td>
      </tr>
      <tr>
         <td>MongoDB</td>
         <td>SaaS</td>
      </tr>
      <tr>
         <td>Mia-Care P4SaMD</td>
         <td><strong>Application Lifecycle Manager (ALM)</strong></td>
         <td>JIRA</td>
         <td>SaaS</td>
         <td>Yes</td>
      </tr>
      <tr>
         <td rowspan="2">Mia-Platform IDP</td>
         <td rowspan="2"><strong>Key Management Service</strong></td>
         <td>Google Cloud Platform</td>
         <td>SaaS</td>
         <td rowspan="2">Optional</td>
      </tr>
      <tr>
         <td>Local Key</td>
         <td>SaaS</td>
      </tr>
      <tr>
         <td>Mia-Platform IDP</td>
         <td><strong>Container image registry</strong></td>
         <td>Any container image registry</td>
         <td>SaaS</td>
         <td>Optional</td>
      </tr>
   </tbody>
</table>

### Kubernetes Cluster Setup
The Kubernetes cluster must be configured with a set of components that ensure the correct operation and monitoring of the application.
The components needed for the Kubernetes runtime are shown below.
For every component is provided a set of recommended tools.
Customers can customize the Kubernetes cluster setup based on tools available in their portfolio.

| Component |  Mandatory | Recommended Tools |
|:---|:---:|:---|
| Ingress Controller | Yes | Traefik |
| Certificate Manager | Optional | cert-manager |
| Monitoring & Logging Stack | Optional | Grafana + Prometheus + Loki + Fluentd + Fluentbit |
| Disaster Recovery | Optional | Velero |

## Installation Procedure

The installation of Mia-Care P4SaMD is a structured process performed exclusively by Mia-Care's qualified personnel. This ensures that the solution is implemented efficiently and adheres to high-quality standards. Below is an overview of the installation procedure, divided into specific stages:

1. **System Requirements Check**: Mia-Care personnel begin by validating the system environment to ensure compatibility and readiness for installation. This step includes:
   - **Infrastructure Assessment:** Verifying hardware and software configurations meet minimum requirements.
   - **Networking Validation:** Ensuring that network settings align with the operational needs of Mia-Care P4SaMD.
   - **Security Checks:** Conducting security assessments to verify compliance with relevant standards and safeguard the installation environment.

2. **Installation of Mia-Platform IDP**: Mia-Platform IDP (Integrated Development Platform), a foundational component, is installed in the prepared environment. This phase involves deploying the platform and configuring it according to project-specific requirements.

3. **Post-Installation Testing of Mia-Platform IDP**: Once Mia-Platform IDP is installed, rigorous post-installation testing is conducted to ensure the platform operates correctly. This includes:
   - Functionality testing to confirm all features are accessible.
   - Performance testing to ensure stability under expected workloads.
   - Validation of integrations to confirm compatibility with the overall ecosystem.


4. **Installation of Mia-Care P4SaMD**: After verifying the successful installation of Mia-Platform IDP, the Mia-Care P4SaMD application is installed. This involves configuring the solution to align with the intended use and environment specifications.

5. **Post-Installation Testing of Mia-Care P4SaMD**: Following the installation, comprehensive testing of Mia-Care P4SaMD is performed to validate:
   - Core functionalities and workflows operate as designed.
   - Performance and responsiveness meet predefined benchmarks.
   - Security measures are effectively implemented.

6. **Installation and Operation Qualification Report**: Upon successful completion of all tests, Mia-Care personnel prepare the **Installation & Operation Qualification Report**. This document serves as formal evidence of a completed installation process, including:
   - A summary of activities conducted during the installation.
   - Results of system checks and testing.
   - Approval and sign-off by the Mia-Care team, certifying that the system is operational and meets quality standards.

This phased approach ensures a smooth deployment of Mia-Care P4SaMD, with high levels of reliability and performance, while adhering to strict security and compliance requirements. For further information or support, please contact Mia-Care's technical support team.