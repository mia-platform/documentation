---
id: automate-infrastructure-provisioning
title: Automate Infrastructure Provisioning with Self-Service
sidebar_label: Automate Infrastructure Provisioning
---

### The Scenario

In an organization that adopts a "you build it, you run it" approach, development teams are responsible for the entire lifecycle of their applications. However, when they need new infrastructure resources (like a database, a message queue, or a storage bucket), they must open a ticket for the Cloud Operations team.

### The Challenge

* **Slowness and Bottlenecks**: The ticket-based process is slow. A developer can wait for days to get a new database, effectively blocking the development of new features.
* **Resource Inconsistency**: Manual provisioning by the Ops team can lead to inconsistent configurations. A database might be created with different performance parameters than another, or without the correct backup policies.
* **Excessive Load on the Ops Team**: The Cloud Operations team is swamped with repetitive, low-value requests, diverting time and energy from more strategic activities like cost optimization and security improvement.
* **Lack of Self-Service**: Developers are not truly autonomous. Their speed is limited by the overreliance on another team, which hinders effective DevOps practices implementation.

### The Solution with Mia-Platform

The Platform Engineering team decides to create a self-service experience for infrastructure provisioning, using **Infrastructure Projects** and the **Software Catalog** of Mia-Platform Console.

1.  **Creation of an Infrastructure Project**: A new project of type **Infrastructure** is created. This project will not contain applications, but repositories with **Infrastructure as Code (IaC)**, in this case Terraform/OpenTofu.

2.  **Definition of Standard Infrastructure Components**: Within this project, the Ops/Platform team defines reusable and standardized Terraform modules for the most common resources:
    * A module to create a **MongoDB Atlas** cluster with pre-configured backup policies.
    * A module to create a **Google Cloud Storage Bucket** with versioning and lifecycle policies enabled.
    * A module to create an **AWS SQS** queue with server-side encryption.

3.  **Publication in the Software Catalog**: Each Terraform module is "packaged" as an **Infrastructure Component** and published in the company's private **Software Catalog**. Each component has a clear manifest describing its purpose, the required input variables (e.g., `database_name`), and the resources that will be created.

4.  **Self-Service Experience for Developers**: Now, when a developer needs a new database:
    * They access their **Application Project** on Mia-Platform Console.
    * They go to the **Resources** section and select "Create from Marketplace".
    * They search for and select the "MongoDB Atlas Cluster" component.
    * They fill out a simple form with the required parameters (e.g., the database name and size).
    * Upon saving and deploying, the Console triggers a pipeline (defined in the Infrastructure Project) that automatically and securely runs `terraform plan` and `terraform apply`.

5.  **Approval Workflow (Plan & Apply)**: The deployment is not immediate. The pipeline stops after the `plan`, showing the developer (or a designated approver) the exact impact of the changes. Only after approval does the pipeline proceed with the `apply`, creating the resources in the cloud provider.

### The Outcome

* **Speed and Agility**: Developers can provision the infrastructure they need in minutes, in total autonomy, eliminating waiting times.
* **Standardization and Security "by Default"**: All resources are created abiding by embedded best practices defined by the Ops team, who sets the standard. Security guardrails, backup, and monitoring are configured by default, drastically reducing the risk of manual errors.
* **Efficiency of the Ops Team**: The Cloud Operations team no longer handles manual requests but focuses on creating and maintaining IaC modules, a higher-value activity that scales for the entire organization.
* **Full Self-Service and Accountability**: Developers are truly end-to-end responsible for their applications, including the infrastructure they need. The process is fully tracked and governed.

With Infrastructure Projects, Mia-Platform has extended the principles of the internal platform to infrastructure management, creating a self-service experience that accelerates development and improves collaboration between team Dev and Ops.
