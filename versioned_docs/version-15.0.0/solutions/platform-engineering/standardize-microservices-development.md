---
id: standardize-microservices-development
title: Standardize Microservice Development with Custom Templates
sidebar_label: Standardize Microservice Development
---

### The Scenario

A rapidly growing company is managing dozens of development teams working on different projects. Each team creates microservices independently, leading to a proliferation of heterogeneous configurations.

### The Challenge

* **Inconsistency**: Microservices have different structures, non-uniform logging and monitoring implementations, and CI/CD pipelines written from scratch for each project.
* **Slow Onboarding**: New developers take weeks to understand their team's specific configurations and become productive.
* **Complex Maintenance**: The lack of standards makes maintaining and updating services difficult, increasing the risk of errors in production.
* **Variable Code Quality**: There is no "golden path" for development, so the quality and security of services depend entirely on the skills of the individual team.

### The Solution with Mia-Platform

The Platform Engineering team decides to use **Mia-Platform Console** and the **Software Catalog** to create and distribute reusable development standards for the entire company.

1.  **Creation of a Project Blueprint**: First, the team defines a **Project Blueprint** at the Company level. This Blueprint includes pre-configured environments (e.g., Development, Production), default Git and CI/CD providers, ensuring that every new project starts from a common, approved base.

2.  **Development of a Custom Microservice Template**: Next, the team creates a **Template** for a Node.js microservice. This template is not just a "hello world," but a true application skeleton that includes:
    * Standardized logging libraries (`lc39`).
    * Health check endpoints (`/-/healthz`, `/-/readyz`) already implemented.
    * A standard `.gitlab-ci.yml` pipeline that includes steps for linting, unit tests, and security scans.
    * A basic configuration for resources (CPU and memory) and Kubernetes probes.

3.  **Publication in the Software Catalog**: The template is published in the company's private **Software Catalog**. It is clearly documented, specifying its purpose and how to use it. It is assigned the "Backend Templates" category for easy searching.

4.  **Self-Service for Developers**: Now, when a development team needs to create a new microservice, they no longer start from scratch. They access the **Microservices** section in Mia-Platform Console, select "Create from Marketplace," and find the "Node.js Standard Service" template approved by the platform team. With a few clicks, the Console:
    * Creates a new Git repository by cloning the template.
    * Creates the new microservice in the project with all standard configurations already applied.

### The Outcome

* **Consistency and Standardization**: All new Node.js microservices follow the same best practices, simplifying management and maintenance.
* **Increased Development Speed**: Teams can create and deploy a new production-ready service in minutes instead of days.
* **Accelerated Onboarding**: New developers are immediately productive, as the service structure and pipelines are already defined and familiar.
* **Quality and Security "by design"**: Security and quality practices are integrated directly into the template, reducing the risk of errors and vulnerabilities.

Thanks to Mia-Platform, the Platform Engineering team has transformed chaos into an industrial process, providing developers with golden paths and guardrails that makes them faster, more autonomous and more secure.
