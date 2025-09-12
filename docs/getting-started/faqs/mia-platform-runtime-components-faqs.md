---
id: mia-platform-runtime-components-faqs
title: Mia-Platform Runtime Components FAQs
sidebar_label: Runtime Components FAQs
---

### Core Services & API Gateway

#### What is the API Gateway?
The API Gateway is the single entry point for all incoming traffic to your project's services. It's a fundamental component of a microservices architecture that is responsible for routing requests, enforcing security policies, and handling cross-cutting concerns like rate limiting and request/response transformations. It acts as the main **ingress** point for your entire digital platform.
[Discover more](/runtime-components/plugins/api-gateway/10_overview.md)

#### How does the API Gateway handle routing?
The API Gateway maintains a routing table based on the **Endpoints** you configure in the Design section of the Console. When a request comes in, the Gateway matches the request's path to a configured endpoint's base path. It then forwards the request to the designated backend service (e.g., a microservice, a plugin, or an external service).
[Discover more](/runtime-components/plugins/api-gateway/10_overview.md)

#### What are Decorators and how do they work with the API Gateway?
Decorators are microservices that intercept requests to add custom logic before or after the main service is called. The API Gateway orchestrates this flow:
* **Pre-decorators**: Run *before* the main service. They can modify the request or perform checks like custom authentication.
* **Post-decorators**: Run *after* a successful response from the main service. They can modify the response body or headers.
* **Catch-decorators**: Run if the main service or a pre/post-decorator returns an error. They are used for custom error handling.
[Discover more](/products/console/api-console/api-design/decorators.md)

#### What is the Authorization Service?
The Authorization Service is a central component that works with the API Gateway to secure your endpoints. When a request for a protected endpoint arrives, the API Gateway asks the Authorization Service to verify the user's credentials (e.g., session cookie, API key) and evaluate their permissions against the endpoint's security policy.
[Discover more](/products/console/project-configuration/authorization-flow.md)

#### What is the API Portal?
The API Portal is a runtime component that automatically generates interactive API documentation for your project. It consumes the OpenAPI 3.0 specifications exposed by your services (including the [CRUD Service](/runtime-components/plugins/crud-service/10_overview_and_usage.md)) and presents them in a user-friendly web interface. It's a key tool for improving the **developer experience (DevEx)** and acts as a **developer portal** for your APIs.
[Discover more](/products/console/project-configuration/documentation-portal.md)

#### How can I customize the request/response flow in the API Gateway?
You can use decorators for complex logic. For simpler transformations, the API Gateway itself supports request and response rewriting. In an endpoint's configuration, you can define rules to add, remove, or modify headers and body content, or to rewrite the request path before it's sent to the backend service.
[Discover more](/runtime-components/plugins/api-gateway/10_overview.md)

### Data Management & Integration

#### What is the CRUD Service?
The **CRUD Service** is one of the most used plugins. Its purpose is to instantly expose a MongoDB collection via a full set of RESTful APIs for Create, Read, Update, and Delete operations. You simply define your data model (schema) in the Console, and the CRUD Service handles the rest, including data validation and exposing the APIs through the API Gateway.
[Discover more](/runtime-components/plugins/crud-service/10_overview_and_usage.md)

#### How can I expose a subset of fields from a CRUD collection?
You can create a **View** on top of your CRUD collection. A View is a read-only projection of the data in a collection. You can configure a View to expose only specific fields, effectively creating a different "shape" of your data for different use cases without duplicating the data itself.
[Discover more](/products/console/api-console/api-design/crud_advanced.md)

#### Can the CRUD Service handle relationships between collections?
The CRUD Service itself operates on a single collection. To handle relationships, you would typically use [Mia-Platform Fast Data](/products/fast_data/what_is_fast_data.md) to create a pre-aggregated **Single View** that combines data from multiple source collections. You can then expose this Single View with its own CRUD Service, providing a denormalized, easy-to-consume API.
[Discover more](/products/fast_data/what_is_fast_data.md)

#### What is the Flow Manager?
The **Flow Manager** is a saga orchestrator. It's a powerful plugin used to manage complex, multi-step business processes that span across multiple microservices. It implements the Saga pattern to ensure data consistency in a distributed system. If one step in the process fails, the Flow Manager can execute compensating transactions to roll back the previous steps.
[Discover more](/runtime-components/plugins/flow-manager-service/10_overview.md)

#### When should I use the Flow Manager instead of simple service-to-service calls?
Use the Flow Manager when you have a business process that:
* Involves three or more separate services.
* Requires transactional integrity (i.e., either all steps succeed, or the entire process is rolled back).
* Needs to be resilient to the temporary failure of one of the participating services.
  A classic example is an e-commerce order process involving payment, inventory, and shipping services.
[Discover more](/runtime-components/plugins/flow-manager-service/10_overview.md)

#### What is the Integration Connector Agent?
The **Integration Connector Agent** is a versatile plugin for data integration. It's designed to connect to various external systems (like cloud provider services, databases, or third-party APIs), fetch data, and optionally transform it. It's often used to populate the [Data Catalog](/products/data_catalog/overview.mdx) or to feed data into other systems.
[Discover more](/runtime-components/plugins/integration-connector-agent/10_overview.md)

#### What kind of data sources can the Integration Connector Agent connect to?
The agent has a plugin-based architecture and supports various "processors" out-of-the-box, including:
* Cloud vendors like **AWS** (e.g., to list **aws s3** buckets), Azure, and GCP.
* GitHub webhooks.
* Custom processors written in the **Go programming language** for connecting to any other source.
[Discover more](/runtime-components/plugins/integration-connector-agent/10_overview.md)

#### What is the Messaging Gateway?
The Messaging Gateway is a plugin that provides a simple HTTP interface for interacting with a message broker like Kafka. It allows your services to produce and consume messages from Kafka topics via simple REST API calls, without needing to include a Kafka client library in every single service.
[Discover more](/runtime-components/plugins/messaging-service/10_overview.md)

#### How does the PDF Service work?
The PDF Service is a utility plugin that can generate PDF documents from HTML templates. You provide it with an HTML template (using a templating language like Handlebars) and a JSON object with data. The service merges the data into the template and returns a rendered PDF file. It's useful for generating invoices, reports, or tickets.
[Discover more](/runtime-components/plugins/pdf-service/10_overview.md)

### Authentication & Security

#### What is the Auth0 Client?
The Auth0 Client is a plugin that integrates with the Auth0 identity platform. It's used by the [Authorization Service](/products/console/project-configuration/authorization-flow.md) to handle user authentication. It can validate tokens, fetch user profiles, and manage user sessions, acting as a bridge between your platform and Auth0.
[Discover more](/runtime-components/plugins/auth0-client/10_overview.md)

#### Are there clients for other identity providers?
Yes, the platform is extensible. While the Auth0 Client is a common plugin, you can create similar clients for other identity providers like Okta, Keycloak, or Azure Active Directory. These clients would implement a standard interface that the Authorization Service can use.
[Discover more](/products/console/company-configuration/providers/overview.md)

#### How should I manage secrets for my runtime services?
You should never store secrets directly in your Git repository. The best practice is to use a dedicated **secrets manager**. Mia-Platform Console supports several providers, including:
* HashiCorp Vault
* **aws secrets manager**
* **azure key vault**
* GitLab CI/CD variables
  Your services can then securely access these secrets at runtime.
[Discover more](/products/console/project-configuration/manage-environment-variables/index.md)

#### What is Rönd and how does it improve security?
Rönd is a lightweight, open-source authorization sidecar. It allows you to enforce fine-grained, policy-based access control on your APIs. Instead of hardcoding authorization logic in your services, you define declarative policies in the Rego language. Rönd intercepts requests and evaluates these policies to decide if the request should be allowed, denied, or if the response should be filtered.
[Discover more](/products/console/api-console/api-design/authorization.md)

#### What is the difference between authentication and authorization?
* **Authentication** is the process of verifying who a user is (e.g., by checking a username and password). Services like the Auth0 Client handle this.
* **Authorization** is the process of determining what an authenticated user is allowed to do (e.g., checking if they are an "admin"). The Authorization Service and Rönd handle this.

### Utility & Helper Services

#### What is the Files Service?
The Files Service is a simple service that allows you to serve static files from a Kubernetes ConfigMap or a local folder within the container. It's useful for serving small configuration files, JSON schemas, or other static assets that need to be accessible via an HTTP endpoint.
[Discover more](/runtime-components/plugins/files-service/configuration.mdx)

#### What is the Form Service?
The Form Service is a backend component designed to work with the Form Builder in the [Microfrontend Composer](/products/microfrontend-composer/what-is.md). It handles the submission of dynamic forms, validates the data against a schema, and can trigger subsequent actions, such as sending the data to another service or starting a Flow Manager saga.
[Discover more](/runtime-components/plugins/form-service-backend/10_overview.md)

### Developer Templates

#### What is a "Template" in the context of runtime components?
A **Template** is a boilerplate Git repository that serves as a starting point for creating a new custom microservice. When you create a service from a template, you get a complete, ready-to-code project with a pre-configured structure, Dockerfile, and **CI/CD** pipeline.
[Discover more](/runtime-components/overview_marketplace.md)

#### What is included in the Node.js Template?
The official Node.js Template provides a production-ready starting point for building services with Node.js. It includes:
* A lightweight web framework (Fastify).
* Standardized logging.
* Health check endpoints (`/-/healthz`, `/-/ready`).
* Graceful shutdown handling.
* A complete Dockerfile and GitLab CI configuration.
[Discover more](/products/console/api-console/api-design/custom_microservice_get_started.md)

#### What are the benefits of using the Go Template?
The **Go programming language** is known for its high performance and low resource consumption. The Go Template provides a solid foundation for building high-performance microservices on Mia-Platform. It includes idiomatic Go code structure, a pre-configured HTTP server, and all the necessary boilerplate for logging and health checks.
[Discover more](https://github.com/mia-platform-marketplace/Go-Template)

#### Are there templates for other languages like Java, .NET, or TypeScript?
Yes, the Marketplace includes a wide variety of templates for popular languages and frameworks, including:
* Spring Boot (Java)
* .NET
* Ktor (Kotlin)
* **typescript-go** (a Node.js template using TypeScript)
  You can also create your own custom templates to enforce company-specific standards.
[Discover more](/runtime-components/overview_marketplace.md)

#### How do I create a new microservice from a template?
In the Console's Design section, you click "Create a Microservice" and select "From Marketplace". You can then browse the available templates, choose the one you want, and provide a name and repository for your new service. The Console will then automatically create the new repository and scaffold the service configuration.
[Discover more](/products/console/api-console/api-design/custom_microservice_get_started.md)

#### What are the best practices when customizing a template?
* **Understand the Boilerplate**: Before deleting code, understand what it does. The template includes important logic for health checks, logging, and configuration management.
* **Follow the Structure**: Try to maintain the existing project structure to ensure consistency.
* **Update the README**: Document your service's purpose, its APIs, and its environment variables in the `README.md` file.
* **Add Tests**: The template provides a testing framework. Be sure to add unit and integration tests for your custom logic.

### Advanced Concepts & Best Practices

#### How do I choose between creating a custom Plugin or a service from a Template?
* Create a service from a **Template** when you are building a specific piece of business logic that will be unique to your project. You own the code and can evolve it freely.
* Create a custom **Plugin** when you have a piece of generic, reusable functionality that you want to share across multiple projects in a governed way. You manage the plugin's version centrally, and project teams consume it as a black box.

#### How do runtime components fit into a service oriented architecture (SOA)?
The entire Mia-Platform ecosystem is a manifestation of **service oriented architecture**. Each runtime component is a distinct, independently deployable service with a well-defined responsibility. They communicate over the network via APIs. This approach promotes loose coupling, reusability, and scalability, which are the core tenets of SOA.
[Discover more](/getting-started/mia-platform-overview.md)

#### How can I monitor the health and performance of my runtime components?
All official Mia-Platform runtime components expose Prometheus metrics by default. These metrics can be scraped and visualized in Grafana to monitor key indicators like request latency, error rates, and resource consumption. This is essential for effective **site reliability engineering (SRE)**. You can also track higher-level metrics like the **DORA metrics** by analyzing your **CI/CD** pipeline data.
[Discover more](/products/console/monitoring/introduction.md)

#### How do I manage resource allocation (CPU/Memory) for my services?
In the Console, for each microservice or plugin, you can specify its Kubernetes resource `requests` and `limits`.
* **Requests**: The amount of CPU/memory guaranteed to the service.
* **Limits**: The maximum amount the service is allowed to consume.
  Setting these values correctly is a critical **SRE** best practice to ensure application stability and efficient use of cluster resources.
[Discover more](/products/console/api-console/api-design/microservices-cpu-resources.md)

#### Can I deploy these components on serverless platforms?
Yes. Since all runtime components are containerized, they can be deployed on **serverless** container platforms like **aws fargate** or **google cloud run**. This can simplify operations and provide cost savings, as you only pay for the resources consumed when your services are actively running.
[Discover more](/infrastructure/paas/overview.md)

#### What is the recommended way to handle database migrations for a service?
Database schema migrations should be handled as part of your service's startup logic. A common pattern is to use a library (like Flyway for Java or a custom script for Node.js) that checks the database schema version on startup and applies any pending migration scripts before the service starts accepting traffic. These migration scripts should be version-controlled alongside your service's code.
[Discover more](/runtime-components/plugins/crud-service/10_overview_and_usage.md#database-initialization-and-migrations)
