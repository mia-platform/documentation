---
id: application-development
title: Application Development
sidebar_label: Application Development
---

# Application Development

Application development within the Mia-Platform ecosystem is engineered to be a self-service and AI-native experience, transforming a traditionally slow and fragmented process into a streamlined, intelligent workflow. The core challenge in modern software creation is the immense time and resources spent managing underlying complexities rather than focusing on business logic. Mia-Platform addresses this by providing developers with a unified environment and guided paths ("golden paths") to build, manage, and deploy scalable, reusable, and high-performance cloud-native applications with unprecedented speed and efficiency.

The entire end-to-end lifecycle of an application—from initial design and configuration to deployment and monitoring—is managed with full autonomy and security through the [**Mia-Platform Console**](/development_suite/overview-dev-suite.md).

## A Self-Service, Composable Experience

At the heart of Mia-Platform's application development philosophy is a composable approach, enabled by a rich and ever-expanding [**Software Catalog**](/software-catalog/overview.md). This centralized catalog provides developers with ready-to-use, standardized assets, eliminating bottlenecks and duplicated efforts. Development teams can accelerate product creation by composing solutions from a variety of well-defined building blocks:

* [**Plugins**](/marketplace/plugins/mia-platform-plugins.md)**:** Ready-to-use microservices, typically packaged as Docker images with predefined configurations, designed to solve specific runtime needs and integrate seamlessly into your projects.

* [**Templates**](/marketplace/templates/mia_templates.md)**:** Base repositories that serve as a starting point for creating new microservices. They provide developers with direct access to the codebase, ensuring compliance with best practices from day one.

* [**Examples**](/marketplace/examples/mia_examples.md)**:** Similar to templates, examples offer sample code addressing specific use-cases, often with more features already implemented to help developers familiarize themselves with the development environment.

* [**Applications**](/marketplace/applications/mia_applications.md)**:** Pre-configured bundles of resources—including microservices, endpoints, CRUD collections, and public variables—that can be instantiated with a few clicks to set up complex, working systems rapidly.

## Building Blocks of a Cloud-Native Application

Using the Mia-Platform Console, developers can design and configure all the fundamental components of a modern digital product in a powerful low-code and no-code environment.

* [**Microservices**](/development_suite/api-console/api-design/services.md)**:** As the core of any application, microservices can be created in seconds from the Marketplace or from an existing Docker image. The Console provides full control over their configuration, including environment variables, resource limits, and runtime probes.

* [**Endpoints**](/development_suite/api-console/api-design/endpoints.md)**:** Services are exposed securely and consistently through an API Gateway. Developers can define endpoints, manage routing, and configure security policies such as authentication and authorization with fine-grained control.

* [**CRUDs**](/development_suite/api-console/api-design/crud_advanced.md)**:** For data-centric services, developers can automatically generate REST APIs for Create, Read, Update, and Delete operations on a MongoDB collection without writing any code. This drastically speeds up the creation of services that need to interact with persistent data.

* [**Microfrontend Composer**](/microfrontend-composer/what-is.md)**:** For building user interfaces, such as backoffices or complex dashboards, the Microfrontend Composer allows developers to design and orchestrate applications using low-code functionalities. It enables the composition of custom pages with web components that can read and write data in real-time.

## The Development Lifecycle: From Design to Deployment

Mia-Platform industrializes the entire software development lifecycle, ensuring governance and quality at every stage.

* **Declarative, Manifest-Driven Configuration:** Every component in the Software Catalog, whether it's a plugin, template, or application, is defined by a declarative [**manifest**](/software-catalog/items-manifest/overview.md). This manifest is a JSON representation of the component's data and resources, ensuring that all assets are standardized, version-controlled, and managed as code.

* **Unified Design and Configuration:** All aspects of an application's architecture are configured within the [**Design Area**](/development_suite/api-console/api-design/overview.md) of the Console. This provides a single source of truth for microservices, endpoints, data models, and public variables, abstracting away the underlying complexity.

* **Automated Deployment:** Once the application is designed and configured, it can be deployed to any multi-cloud or on-premise environment with a few clicks. The Console automates the deployment process, allowing developers to release new versions quickly and safely while monitoring resource usage and performance in real-time.
