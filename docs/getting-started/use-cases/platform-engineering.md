---
id: platform-engineering
title: Platform Engineering
sidebar_label: Platform Engineering
---

# Platform Engineering

Platform Engineering is the discipline of designing, building, and maintaining self-service toolchains and workflows that enable development teams to build and deliver software. At its core is the creation of an [**Internal Developer Platform (IDP)**](/getting-started/mia-platform-overview.md), which acts as a guided path ("paved road") for developers, allowing them to release applications faster, more reliably, and with greater autonomy. By treating the platform as a product and developers as its customers, Platform Engineering optimizes the software development lifecycle (SDLC), reduces cognitive load, and enforces governance without sacrificing speed.

This approach evolved from DevOps principles, aiming to solve the complexities of modern cloud-native environments. While DevOps focuses on the cultural and methodological fusion of development and operations, Platform Engineering provides the tangible infrastructure and automated pathways to make those principles a reality.

## Core Principles of Platform Engineering with Mia-Platform

Mia-Platform is a Platform Builder designed to help organizations create their own customized IDP. It embodies the core principles of Platform Engineering by providing a centralized yet flexible environment that industrializes and governs cloud-native development.

### Self-Service and Developer Autonomy

A key goal of Platform Engineering is to empower developers. Mia-Platform achieves this by offering a [self-service platform](/development_suite/overview-dev-suite.md) where development teams can independently manage the entire lifecycle of their applications. This includes:

* **Creating and configuring environments** for testing and deployment.
* **Developing microservices** with [standardized, pre-configured CI/CD pipelines](/development_suite/deploy/overview.md).
* **Accessing essential resources** like [logging and monitoring](/development_suite/monitoring/introduction.md) and infrastructure components without opening tickets or waiting for other teams.

This self-service model eliminates organizational bottlenecks, reduces friction, and allows developers to focus on writing code and delivering business value.

### Golden Paths and Standardization

Platform Engineering promotes the concept of "golden paths" or "paved roads"—well-defined, supported workflows for creating and deploying software. Mia-Platform facilitates the creation of these paths through:

* [**Project Templates**](/console/company-configuration/project-blueprint.md)**:** New projects can be started in a few clicks, inheriting pre-configured settings, tools, and CI/CD pipelines. This ensures consistency and adherence to best practices from day one.
* **Reusable Components:** A [software catalog of plugins, templates, and applications](/marketplace/overview_marketplace.md) accelerates development and promotes the reuse of proven solutions across the organization.
* **Standardized Deployment:** By leveraging a [GitOps methodology](/development_suite/deploy/overview.md) and offering integrations with various CI/CD tools like GitLab CI, GitHub Actions, and Jenkins, Mia-Platform ensures a consistent and automated deployment process.

### Abstraction of Complexity

Modern cloud-native architectures, often based on Kubernetes, can be overwhelmingly complex. Platform Engineering aims to abstract this complexity from developers. Mia-Platform provides an intuitive user interface and a set of automated tools that manage the underlying infrastructure, allowing developers to:

* **Manage microservice configurations** without needing deep Kubernetes expertise.
* **Securely expose APIs** through a managed [API Gateway](/runtime_suite/api-gateway/10_overview.md).
* **Monitor application performance and health** via integrated [observability tools](/development_suite/monitoring/introduction.md).

By reducing the cognitive load on developers, Mia-Platform enables them to be more productive and innovative.

## Building Your Internal Developer Platform (IDP)

Mia-Platform serves as the foundation for building a robust IDP tailored to your organization's specific needs. An IDP built with Mia-Platform centralizes all necessary tools and resources, providing a unified and cohesive developer experience. Key components include:

* **A Centralized Console:** A single point of control for designing, deploying, and monitoring applications and infrastructure.
* **A Software Catalog:** A marketplace of curated and reusable software components.
* **Automated CI/CD Pipelines:** Integrated and standardized pipelines for continuous integration and delivery.
* **Observability Tools:** Built-in features for monitoring, logging, and tracing.
* **Secure API Management:** Tools for exposing, securing, and managing APIs.

## Key Benefits

Adopting a Platform Engineering approach with Mia-Platform delivers significant benefits across the organization:

* **Increased Developer Productivity:** By providing self-service tools and automating repetitive tasks, developers can focus more on programming and less on infrastructure, leading to a significant reduction in time-to-market.
* **Improved Governance and Security:** Centralized management and standardized templates ensure that all projects adhere to corporate security policies and best practices from the design phase.
* **Enhanced Reliability and Resilience:** Automated deployment pipelines and integrated monitoring tools help identify issues early and ensure the stability of applications in production.
* **Reduced Operational Costs:** Automation, resource optimization, and the reuse of components lead to lower maintenance and operational costs.
* **Greater Accountability:** By providing visibility and traceability throughout the entire DevOps cycle, it becomes easier to manage and monitor the evolution of projects and resource usage.
