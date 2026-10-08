---
id: overview
title: Overview
sidebar_label: Overview
---

The **AI-Compliance for Data Catalog** introduces an AI Assistant chat interface to allow users to access, explore, and comprehend the rich metadata information of a [Data Catalog](/products/data_catalog/overview.mdx).
It is especially useful for **non-technical roles** and individuals responsible for **compliance and audits**, such as the *Data Protection Officer (DPO)*.

By offering a dedicated **AI chat interface**, this *AI-powered integration* provides on-demand Data Discovery insights through simple and **natural language queries**.
This capability democratizes Data Discovery, making it easier to understand and adhere to data regulations, for example, *GDPR*.

For instance, users can easily find answers to questions like:

- "What categories of personal data are processed?"
- "Who has access to the data (internal employees, external consultants)?"
- "Is there any data transfer, and if so, to which locations (within or outside the EU)?"
- "Which personal data assets are classified as sensitive under GDPR, and where are they stored?"

By enabling non-technical users to independently retrieve this essential information for compliance, audits, and documentation, the *AI Assistant significantly reduces the reliance on technical teams*;
in fact, it frees up valuable time and resources for technical teams by enabling other stakeholders to self-serve their data-related information needs.

This fosters better communication and collaboration between legal, compliance, and data teams, creating a more inclusive, efficient, and effective data governance framework.

## How it Works

:::info

To utilize this application, you **must have** a running and properly configured instance of the Mia-Platform **Data Catalog application**.

For detailed information on how Data Catalog works and how to properly configure it, please refer to this [documentation](/products/data_catalog/overview.mdx).
:::

The AI-Compliance Assistant provides a user-friendly chat interface where users can type their questions in natural language, and the AI Assistant leverages its understanding of the Data Catalog metadata and models to provide accurate and comprehensive answers.

Under the hood, the application utilizes a Large Language Model (LLM) to process user queries and retrieve relevant information. It interacts with the Data Catalog underlying data structures through dedicated APIs to fetch and synthesize the required details.

## Technical Details

The application comprises the following key components:

- **`ai-chat-fe` (Frontend):** This service provides the user interface for interacting with the AI Assistant, offering a seamless chat experience within the Data Catalog.
- **`mia-assistant` (Backend):** This service hosts the core AI logic. It processes user queries, interacts with the Data Catalog and other relevant services, and generates responses. It leverages an LLM for natural language understanding and response generation and an embeddings model for semantic search capabilities. It also interacts with a vector store for efficient retrieval of relevant context.
- **API Gateway (`api-gateway`):** This component acts as the entry point for external requests, routing traffic to the appropriate backend services.
- **CRUD Service (`crud-service`):** This service manages the `assistant-catalog-documents` collection, which likely stores internal data related to the AI Assistant's operations.

The application also utilizes a MongoDB database (configured via `MONGODB_CLUSTER_URI` in the `mia-assistant` service) for persistent data storage, for example for chat history and other operational data.

## Getting Started

Start your AI-powered Data Discovery journey by accessing the interface and chatting with your questions in natural language.
