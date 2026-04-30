---
id: platform-engineering-overview
title: Platform Engineering Overview
sidebar_label: Platform Engineering Overview
---

# Platform Engineering: Build and Manage Your Internal Developer Platform

Platform Engineering is a strategic approach aimed at improving the developer experience and productivity through the creation and management of an **Internal Developer Platform (IDP)**. An IDP is a set of standardized tools, processes, and "golden paths" that enable development teams to operate autonomously, quickly, and securely by abstracting the complexity of the underlying infrastructure.

The goal is to treat the platform as an internal product, with developers as its customers, to accelerate the delivery of high-quality software.

## The Challenges of Modern Development

In today's cloud-native landscape, development teams face increasing complexity that can slow innovation and increase operational risk:

* **High Cognitive Load**: Developers need to be familiar with a wide range of technologies (Kubernetes, Docker, CI/CD, monitoring), diverting their focus from business logic.
* **Lack of Standardization**: Without defined paths, each team adopts different tools and configurations, leading to a fragmented architecture that is difficult to maintain and govern.
* **Slow Onboarding Processes**: New developers take weeks to become productive as they navigate scattered documentation and complex setups.
* **Governance and Security Risks**: The lack of centralized control exposes the company to risks, with insecure configurations or unregulated access that can compromise the entire infrastructure.
* **Operational Bottlenecks**: Development teams depend on operations (Ops) teams for provisioning resources like databases or test environments, creating long waits.

## The Mia-Platform Solution: Your Platform as a Product

**Mia-Platform** is the AI-Native Developer Platform Foundation that enables Platform Engineering teams to build and manage a robust, secure, and customized IDP. The Console transforms the infrastructure from a complex set of tools into a coherent, self-service product to manage the entire software lifecycle.

### Centralize and Standardize with the Software Catalog

The **Software Catalog** is the heart of standardization. Platform teams can create and distribute reusable resources such as **Templates**, **Plugins**, and **Infrastructure Components**. This ensures that every new microservice or resource starts from a solid, approved foundation, following opinionated "golden paths."
* **Microservice Standardization**: Create templates with pre-configured logging, health checks, and CI/CD pipelines, ensuring consistency and quality.
* **Code Reuse**: Offer ready-to-use plugins (e.g., CRUD Service, Authorization Service) to accelerate development and reduce duplication.

### Abstract Complexity with the Console

Mia-Platform Console provides an intuitive interface that abstracts the complexity of Kubernetes. Developers interact with high-level concepts like **Microservices**, **Endpoints**, and **CRUDs**, without needing to write complex YAML manifests.
* **No-Code/Low-Code Configuration**: Define resources, environment variables, ports, and probes through a graphical interface, reducing errors and cognitive load.
* **Integrated Management**: From design to deployment, through debugging and monitoring, the entire software lifecycle is managed in a single environment.

### Enable Self-Service for Developers

With an IDP based on Mia-Platform, developers become autonomous. They can create new environments, deploy their services, and access logs and metrics independently, without relying on other teams.
* **On-Demand Environments**: Create development and test environments in minutes.
* **Simplified Deployment**: Release new versions of applications securely and controlled, with both **push-based (pipeline)** and **pull-based (GitOps)** strategies.

### Apply Centralized Governance and Security

The Console offers powerful tools for platform teams to govern access and resource usage.
* **Identity and Access Management (IAM)**: Define roles and groups with specific permissions for Companies, Projects, and Environments.
* **Fine-Grained Access Control**: Set granular rules to prevent changes to critical configurations (e.g., the Docker image in production) by unauthorized roles.
* **Audit Log**: Track every action performed on the platform to ensure accountability and compliance.
* **Security Policies with Rönd**: Integrate authorization policies directly at the microservice level, ensuring security is an intrinsic requirement, not an afterthought.

### Gain Unprecedented Visibility

The **Design Overview** at the Company level provides an aggregated view of all resources distributed across various projects. This allows platform teams to:
* Quickly identify unprotected endpoints.
* Monitor services with anomalous resource consumption (CPU/memory).
* Verify the consistency of configurations and compliance with corporate standards.

By using Mia-Platform Console, Platform Engineering teams can finally build an internal platform that not only solves operational challenges but also becomes a true accelerator and value generator for the entire organization.


