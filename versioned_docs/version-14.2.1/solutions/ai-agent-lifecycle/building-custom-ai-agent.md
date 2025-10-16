---
id: building-custom-ai-agent
title: Building a Custom AI Agent and Managing its Full Lifecycle
sidebar_label: Building a Custom AI Agent
---

### The Scenario

A legal tech firm wants to build a highly specialized RAG (Retrieval-Augmented Generation) agent for its lawyers. The agent needs to answer complex legal questions based on a proprietary knowledge base of internal case files, legal documents, and contracts, which are stored in various formats (PDFs, DOCX, and text files).

### The Challenge

* **Custom Data Sources**: The knowledge base is not a public website. The agent needs to ingest data from secure, internal file systems and databases.
* **Specialized Data Processing**: Legal documents require a specific data chunking strategy. Simple paragraph-based splitting is not effective. The firm needs to implement a custom logic that understands legal clauses and document structure.
* **Governance and Security**: The data is highly confidential. The agent must be deployed in a secure environment, and access to its configuration and data ingestion APIs must be strictly controlled.
* **Full Lifecycle Management**: The firm needs to manage the agent like any other production application, including versioning, monitoring, logging, and CI/CD.

### The Solution with Mia-Platform

The team decides that a pre-built plugin is not flexible enough for their needs. They choose to use the **AI RAG Chat Template** from the **Marketplace** to get a head start, and then use the full power of **Mia-Platform Console** to customize and govern the agent.

1.  **Starting from the Template**: The team creates a new microservice from the "AI RAG Chat Template". This provides them with a Git repository containing a fully functional RAG application's source code, including the backend API and data ingestion logic.

2.  **Customizing the Data Ingestion Logic**:
    * The developers clone the repository and modify the data ingestion part of the service. They replace the default web scraper with custom code that connects to their internal document management system.
    * They implement a sophisticated data chunking algorithm that splits documents based on legal sections and clauses, ensuring that the context provided to the LLM is always relevant.
    * They modify the `/api/embeddings/generateFromFile` endpoint to handle their specific file formats and apply the custom logic.

3.  **Deploying as a Standard Microservice**: The custom agent is a standard microservice within their Mia-Platform project. They manage its entire configuration through the Console's **Design Area**:
    * They configure **environment variables** to securely connect to their internal systems.
    * They set **CPU and memory requests and limits** to ensure the agent has the resources it needs.
    * They configure **health probes** (`/-/healthz`, `/-/readyz`) to allow Kubernetes to manage the agent's health.

4.  **Implementing Governance and Security**:
    * **Access Control**: Using the **IAM Portal**, they define who can manage the agent's configuration. Only `Senior Developers` are allowed to modify the service's settings.
    * **API Security**: The data ingestion endpoint is secured. In the **Endpoints** section, they configure it to require an **API Key** and a specific **User Group Permission**, ensuring that only authorized internal processes can add new documents to the knowledge base.

5.  **Monitoring and Observability**: Once deployed, the Operations team uses the **Runtime Area** to monitor the agent. They can stream its logs in real-time to check the status of data ingestion jobs, monitor its resource consumption, and troubleshoot any issues.

### The Outcome

* **Highly Specialized Solution**: The firm successfully built an AI agent tailored to its unique needs, with custom data connectors and processing logic that would have been impossible with an off-the-shelf solution.
* **Full Development Control**: Starting from a template gave them a significant head start, but they retained full control over the source code, allowing for deep customization and future evolution.
* **Enterprise-Grade Governance**: The AI agent is not a standalone, ungoverned application. It is a fully managed component of their software ecosystem, subject to the same security, deployment, and monitoring standards as all their other microservices.
* **Complete Lifecycle Management**: The team manages the agent's entire lifecycle through the Console, from development and deployment to monitoring and maintenance, ensuring a robust and reliable service for their users.

This use case demonstrates that Mia-Platform is not just a platform for building agents with pre-built components, but is a comprehensive ecosystem for developing, deploying and governing custom, mission-critical and task-specific AI applications.
