---
id: prompt_gallery
title: Prompt Gallery
sidebar_label: Prompt gallery
---



Here is a set of prompts that we are testing just right now and will be stable soon. You can try them out! If you
provide us feedback to improve them, it will be greatly appreciated.

Remember to change the values inside the curly braces `{}` with your specific information.

## End-to-End Walking Skeleton

```txt
Create a Mia-Platform project named {projectName} that implements an e-commerce for selling items. Use the {projectBlueprint} template and the tenant {tenantName}.

Reuse all items in the marketplace/software catalog to maximize reuse and minimize code written from scratch.

Design the architecture with the following components:
- A frontend in React
- A backend for frontend in Node.js
- A CRUD service
- An API Gateway

Configure the CRUD service with collections useful to:
- Browse items and categories
- Add items to cart
- Calculate prices with discounts
- Create and manage orders
- Process payments using electronic payment methods
- Send email notifications with order confirmations and shipping updates

The user should be able to see order history and shipping status in their personal area.

Protect the personal area and payment process with OpenID Connect.

Scale all microservices from 2 to max 10 replicas.

Once everything is created, deploy in the DEV Environment and provide me the status of all services when everything is up and running.

Finally, provide the link to the application created.
```

```txt
Create a Mia-Platform project named {projectName} for a hospital management system using the {projectBlueprint} template in the tenant {tenantName}.

Use components from the marketplace where possible and include:
- A staff portal built with React
- A patient-facing mobile app backend
- A CRUD service for patient records
- A secure API Gateway with rate limiting

Configure the CRUD service with collections for:
- Patients
- Appointments
- Medical records
- Billing

Implement appointment scheduling workflows and notification services.
Ensure all patient data is secured using proper authentication and authorization.

Deploy to the DEV environment and show me the deployment status.
```

## Project Creation

```txt
Create a Mia-Platform Project named {projectName} using the default project blueprint in the tenant {tenantName}
```

```txt
Create a Mia-Platform Project named {projectName} using the microservices-oriented blueprint in the tenant {tenantName} and enable continuous deployment
```

```txt
Create a Mia-Platform Project named {projectName} for a data analytics platform. Use the {blueprintName} blueprint in the tenant {tenantName}. Configure three environments: DEV, STAGING, and PRODUCTION
```

## Microservice Creation

```txt
Add a new Node.js microservice named {microserviceName} to project {projectName}. Use the Express framework template and configure it with 2 replicas
```

```txt
Create a Java Spring Boot microservice named {microserviceName} in project {projectName}. Set up proper health checks and configure 3GB of memory
```

```txt
Add a Python FastAPI microservice named {microserviceName} to project {projectName}. Configure it to connect to the existing MongoDB instance and implement proper error handling
```

## Resource Creation

```txt
Create a microservice named {microserviceName} using the template {templateName} in the project {projectName}
```

```txt
Create a microservice for a backend for frontend using the template in software catalog in the current project
```

```txt
Create a MongoDB resource named {resourceName} in project {projectName} with 10GB storage and configure backups to run daily
```

```txt
Add a Redis cache named {cacheName} to project {projectName} with 1GB memory and configure proper persistence options
```

## Runtime Environments and Workload Discovery

```txt
Which are the current configurations of the project {projectName}? Provide a table that lists all workloads, replicas, status and if it's source code, a container, or a resource.
List also all endpoints exposed and if they are protected or public and which microservice exposes that endpoint
```

```txt
Check all projects in the tenant {tenantName} and verify if there is code duplication and if items in the marketplace/software catalog are properly reused
```

```txt
Show me the resource utilization of all services in project {projectName} in the PRODUCTION environment. Identify any services that are over-provisioned or under-provisioned
```

```txt
Compare the configurations between DEV and PRODUCTION environments for project {projectName} and highlight any inconsistencies or differences that could cause deployment issues
```

## Workloads Troubleshooting and Coding

```txt
Check in Prod environment all containers and if there are any errors. If there is an error, highlight it and clone the source code of the service. Provide a code snippet to fix that code
```

```txt
Analyze the logs of microservice {microserviceName} in project {projectName} from the last 24 hours. Identify any recurring errors and suggest fixes
```

```txt
The microservice {microserviceName} in project {projectName} is experiencing high CPU usage. Analyze the code and configuration to identify potential bottlenecks and suggest optimizations
```

```txt
Service {serviceName} in project {projectName} is crashing on startup. Review the logs, identify the root cause, and provide a solution
```

## API Management, Authentication and Authorization

```txt
Publish the endpoint /hello-world exposed by the microservice {microserviceName} and protect it with OAuth2. Only admin users can call that endpoint, configure authorization accordingly
```

```txt
Create a public API endpoint /products in the {projectName} project that allows GET requests without authentication but requires OAuth2 authentication for POST, PUT and DELETE operations
```

```txt
Implement rate limiting on the /api/v1/users endpoint in project {projectName} to prevent abuse. Allow 100 requests per minute for authenticated users and 10 requests per minute for anonymous users
```

```txt
Configure cross-origin resource sharing (CORS) for all API endpoints in project {projectName} to allow requests from the domain example.com
```

## CRUD Service Management

```txt
Create a CRUD Service with the following collections:
  - customers
  - products
  - payments
  - shipping
Add the properties needed to describe all domains
```

```txt
Create a CRUD Service for an inventory management system with the following collections:
  - items (with fields for SKU, name, description, quantity, location, supplier)
  - suppliers (with fields for name, contact information, payment terms)
  - purchase_orders (with fields for order date, supplier, items, status, delivery date)
  - inventory_movements (with fields for item, quantity, direction, timestamp, reason)

Add appropriate indexes for optimizing common queries and configure validation rules
```

```txt
Add a new collection named 'reviews' to the existing CRUD Service in project {projectName}. Include fields for product_id, user_id, rating, comment, and date. Create a projection that joins reviews with products
```

```txt
Configure full-text search on the 'products' collection in project {projectName} to allow users to search by name and description. Implement sorting options by price and popularity
```

## Microservice Orchestration (Flow Manager)

```txt
Orchestrate a Saga for purchasing orchestrating the following microservices:
  - CartService, command AddToCart, event ItemAdded
  - PriceCalculatorService, command CalculatePrice, event PriceCalculated
  - PayService, command Pay, event Payed
Check the API exposed by each service and configure the FlowManager accordingly
```

```txt
Create a workflow in Flow Manager for a customer onboarding process that orchestrates:
  - UserRegistrationService, command RegisterUser, event UserRegistered
  - VerificationService, command VerifyEmail, event EmailVerified
  - ProfileService, command CreateProfile, event ProfileCreated
  - NotificationService, command SendWelcomeEmail, event WelcomeEmailSent

Add proper error handling with compensation transactions if any step fails
```

```txt
Implement an order processing workflow in project {projectName} that includes:
  - Order validation
  - Inventory check
  - Payment processing
  - Order fulfillment
  - Shipping notification

Configure timeouts for each step and implement retry logic for the payment processing step
```

## Data Pipelines Management (Fast Data)

```txt
Create a Fast Data Pipeline that aggregates information about Customer from system of record {sysofrecordName1} and system of record {sysofrecordName2}. Call that single view customer_sv.
Inside customer_sv list:
  - customer information
  - orders
  - preferences
```

```txt
Build a real-time data pipeline in project {projectName} that processes IoT device data from Kafka topics. Transform the raw data into analytics-ready format and store in both MongoDB for real-time access and S3 for long-term storage
```

```txt
Create a Fast Data Pipeline that integrates product data from multiple sources: the ERP system {erpSystem}, the e-commerce platform {ecommercePlatform}, and the PIM system {pimSystem}.
Create a single view called product_sv with:
  - Basic product information
  - Inventory levels
  - Pricing information
  - Sales history
  - Product relationships
  
Configure real-time updates when any source system changes
```

```txt
Implement a Fast Data Pipeline for customer behavior analysis that:
  - Collects clickstream data from the website
  - Combines it with purchase history from the CRM
  - Creates a real-time customer profile with preferences and behavior patterns
  - Stores the results in a dedicated collection for the recommendation engine
```

## Microfrontend Orchestration (micro-lc)

```txt
Create an internal tool (backoffice) using micro-lc and micro frontend composer.
The backoffice should visualize:
  - customers
  - products
  - payments
  - shippings
Create the pages accordingly using the CRUD services exposed in the project {projectName}
```

```txt
Build a customer support dashboard using micro-lc in project {projectName} with:
  - A ticket management interface
  - A customer information panel showing order history
  - A knowledge base search component
  - A real-time chat interface

Connect all components to their respective backend services and configure user roles for support agents and supervisors
```

```txt
Create a multi-tenant admin portal using micro-lc with the following features:
  - Tenant-specific branding and styling
  - User management interface
  - Subscription and billing management
  - Feature configuration panel
  - Analytics dashboard

Ensure proper role-based access control for different admin user types
```

```txt
Implement a modular operations dashboard for project {projectName} using micro-lc that includes:
  - System health monitoring
  - User activity tracking
  - Resource utilization graphs
  - Alert management
  - Configuration panel

Allow users to customize their view by selecting which components to display
```

## Blueprints Creation

```txt
Create a project blueprint starting from project {projectName} in the tenant {tenantName}
```

```txt
Add to Software Catalog the microservice {microserviceName} in the project {projectName} converting to placeholders the real values inside ENV Vars and Config Maps. Call this item {itemName} and provide a proper description
```

```txt
Create a comprehensive e-commerce project blueprint based on project {projectName}. Include all microservices, configurations, and resources but templatize environment-specific values as placeholders
```

```txt
Create a blueprint for a standard microservice architecture with API Gateway, authentication service, and scalable backend services based on the project {projectName}. Name the blueprint "{blueprintName}" and add documentation explaining key components
```

## DevOps Tools Integration

```txt
Which are the available pipelines in GitLab repository connected to tenant {tenantName}?
```

```txt
Configure a CI/CD pipeline for project {projectName} that includes:
  - Code quality checks
  - Unit and integration tests
  - Security scanning
  - Automatic deployment to DEV environment
  - Manual approval for STAGING and PRODUCTION deployments
```

```txt
Set up monitoring and alerting for all services in project {projectName} using Prometheus and Grafana. Configure alerts for:
  - High error rates
  - Slow response times
  - Resource constraints
  - Service unavailability
```

```txt
Integrate SonarQube code quality checking into the CI pipeline for project {projectName} and configure it to block merges if quality gates fail
```

## Infrastructure Tools Integration

```txt
Describe the status of the cluster {clusterName} connected to tenant {tenantName}
```

```txt
Show resource utilization of cluster {clusterName} including CPU, memory, and storage. Identify nodes that are approaching capacity
```

```txt
Set up autoscaling for project {projectName} based on CPU utilization and request rate. Configure minimum and maximum pod counts for each service
```

```txt
Configure network policies for project {projectName} to isolate services and restrict communication between microservices to only what's necessary for operation
```

## Project Migration

```txt
Starting from project {originProjectName} in the tenant {originTenantName} create another project named {targetProjectName} in the tenant {targetTenantName} with the same configurations of {originProjectName}
```

```txt
Migrate project {projectName} from cluster {sourceCluster} to cluster {targetCluster}, ensuring all configurations, secrets, and resources are properly transferred
```

```txt
Create a new version of project {projectName} that upgrades all dependencies and runtime versions to the latest compatible versions. Name it {newProjectName}
```

```txt
Clone project {sourceProject} to create {targetProject}, but replace the authentication service with the new OAuth2 implementation from the marketplace
```

## Workload Scaling and Optimization

```txt
Are the number of replicas of the microservice {microserviceName} in project {projectName} correct in the production environment?
```

```txt
Analyze the performance of all microservices in project {projectName} over the last week and recommend scaling adjustments based on usage patterns
```

```txt
Optimize resource requests and limits for all services in project {projectName} based on actual usage patterns from the monitoring data
```

```txt
Configure horizontal pod autoscaling for the {microserviceName} service based on custom metrics from the application (e.g., queue length, active users)
```

## Data Discovery

```txt
What are the properties of the Purchase Data Product? Who publishes it? Who consumes it?
```

```txt
Map all data flows in project {projectName} showing how data moves between services and what transformations occur
```

```txt
List all collections in the CRUD service of project {projectName} with their schemas, indexes, and relationships
```

```txt
Show me all data products in tenant {tenantName} related to customer information, who produces them, and which applications consume them
```

## API Discovery

```txt
How can I retrieve the information about the logged-in user via API?
```

```txt
List all available APIs in project {projectName} with their endpoints, methods, request parameters, and response formats
```

```txt
Generate OpenAPI documentation for all RESTful services in project {projectName} and publish it to the developer portal
```

```txt
Show me all endpoints in project {projectName} that handle customer data and verify if they are properly secured
```

## Legacy Systems Modernization

```txt
Starting from this repository {repoName}, analyze the code, split into microservices, and create a Mia-Platform project with the splitted microservices
```

```txt
Analyze the monolithic application in repository {repoName} and propose a migration strategy to a microservices architecture on Mia-Platform. Identify bounded contexts and service boundaries
```

```txt
Create API wrappers for the legacy system {legacySystemName} to expose its functionality through RESTful interfaces in project {projectName}
```

```txt
Implement a strangler pattern to gradually migrate functionality from the legacy system {legacySystem} to new microservices in project {projectName}, starting with the customer management module
```

## Metrics and Analytics

```txt
What are the DORA metrics of the project {projectName} in the last 30 days?
```

```txt
Calculate the average response time for all API endpoints in project {projectName} over the last week and identify the slowest endpoints
```

```txt
Show me the usage patterns of the {microserviceName} API in project {projectName} broken down by hour of day and day of week
```

```txt
Generate a report on error rates and types for all services in project {projectName} for the last month, grouped by service and error category
```

## Compliance and Auditing

```txt
Who has done the last releases in production in the last 7 days for the project {projectName}?
```

```txt
Generate an audit report for all configuration changes in project {projectName} over the last month, including who made each change and when
```

```txt
List all users who have accessed sensitive data in project {projectName} in the last 30 days and what actions they performed
```

```txt
Verify that all services in project {projectName} comply with the company's security policy requirements for authentication, authorization, and data protection
```

## Concierge and Task Management

```txt
What are my tasks for today?
```

```txt
Create a prioritized list of pending tasks related to project {projectName}, including code reviews, deployments, and issue resolutions
```

```txt
Schedule a deployment of the latest version of {microserviceName} to production for tomorrow at 6:00 AM and notify the team
```

```txt
What outstanding pull requests do I need to review for project {projectName}?
```

## Documentation and Self-Service

```txt
How can I configure the authentication service?
```

```txt
Provide step-by-step documentation on how to implement rate limiting for APIs in a Mia-Platform project
```

```txt
Generate comprehensive documentation for project {projectName}, including architecture diagrams, API references, and deployment instructions
```

```txt
Create a troubleshooting guide for common issues with the CRUD service in project {projectName}, including error codes and resolution steps
```

## Observability and Logging

```txt
Show me the logs for microservice {microserviceName} in project {projectName} from the last hour filtered to only show error messages
```

```txt
Set up distributed tracing across all services in project {projectName} and configure sampling rates appropriately
```

```txt
Create a custom dashboard in Grafana for project {projectName} that shows key performance indicators for all microservices, including response times, error rates, and throughput
```

```txt
Configure log aggregation for project {projectName} to centralize all application and system logs for easier troubleshooting
```

## Testing and Quality Assurance

```txt
Generate comprehensive test cases for the API endpoints in microservice {microserviceName} based on its OpenAPI specification
```

```txt
Set up end-to-end testing for the critical user flows in project {projectName} using a testing framework of your choice
```

```txt
Create a load testing scenario for project {projectName} that simulates peak traffic conditions and reports on performance metrics
```

```txt
Implement chaos testing in the DEV environment for project {projectName} to verify system resilience when services fail
```

## Example of conversations

You may start with a prompt and then within the context continue the conversations. Some examples

```txt
Create the project Demo Projects in my preferred tenant using all defaults
```

```txt
What I can do now?
```

```txt
Create a microservice to test the coding DevX. Choose you what is better.
```

```txt
Clone the microservice in vscode and add the endpoint /hello-mia
```

```txt
Test and push the code
```

```txt
Deploy that microservice in dev environment
```

```txt
Check the status, is up and running?
```

```txt
Add the endpoint /hello-mia using the API Gateway and deploy that configuration
```

```txt
It's all up and running? If yes provide me the link to call that endpoit
```
