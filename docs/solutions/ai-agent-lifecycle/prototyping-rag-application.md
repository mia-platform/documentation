---
id: prototyping-rag-application
title: Prototyping a RAG Application in Minutes
sidebar_label: Prototyping a RAG Application
---

### The Scenario

A software company wants to reduce the load on its human support agents by providing a 24/7 chatbot that can answer common questions from users. The source of knowledge for the chatbot is the company's existing public documentation website.

### The Challenge

* **Time to Market**: The company wants to validate the idea quickly and needs a working prototype in a matter of days, not months. Building the entire RAG (Retrieval-Augmented Generation) pipeline from scratch is not feasible.
* **Technical Complexity**: The team is skilled in web development but has limited experience with AI/ML infrastructure, such as managing vector databases, generating embeddings, and orchestrating LLM calls.
* **User Interface**: They need a simple and intuitive chat interface for users to interact with the agent, but they don't want to spend significant time on frontend development.
* **Integration**: The final solution needs to be securely exposed via an API and integrated into their main website.

### The Solution with Mia-Platform

The team uses the **AI RAG Chat** application from the **Mia-Platform Marketplace** to create and deploy a fully functional RAG chatbot in a few simple steps.

1.  **Installing the RAG Application**: From the **Applications** section in the Design Area, the team searches for and creates the "AI RAG Chat" application. With a few clicks, the wizard automatically sets up all the necessary components in their project:
    * The **RAG Chatbot API**: A pre-built microservice that handles all the backend logic.
    * The **AI RAG Template Chat**: A React-based frontend providing the chat UI.
    * An **API Gateway** with pre-configured endpoints to expose both the frontend and the backend API.

2.  **Configuring the Service**: The team navigates to the `rag-chatbot-api` microservice in the Console.
    * They configure the **Environment Variables** with their `MONGODB_CLUSTER_URI` (for the vector database) and their `OPENAI_API_KEY`. These are stored as secure project variables.
    * They edit the service's **ConfigMap** to specify the LLM and embedding models they want to use (e.g., `gpt-4o-mini` and `text-embedding-3-small`) and the details of their MongoDB collection.

3.  **Ingesting the Knowledge Base**: The team doesn't need to write any data ingestion scripts. They use the **API Portal** to access the APIs exposed by the `rag-chatbot-api` service.
    * They make a single `POST` request to the `/api/embeddings/generate` endpoint.
    * In the request body, they provide the URL of their documentation website.
      The service automatically starts the web scraping process: it crawls the website, extracts the text content, splits it into chunks, generates embeddings using the OpenAI API, and stores them in the MongoDB Atlas vector database.

4.  **Deploying and Testing**: The team saves the configuration and deploys the project. Immediately after the deployment is complete, the chatbot is live and accessible at the project's main URL. They can start asking questions related to their documentation and receive accurate, context-aware answers.

### The Outcome

* **Prototype in Minutes**: The team had a fully functional, end-to-end RAG application up and running in less than an hour, a process that would have taken weeks or months if built from scratch.
* **Zero AI/ML Infrastructure Management**: The team didn't have to worry about the complexities of setting up a vector database, managing embedding pipelines, or orchestrating LLM calls. The Marketplace application abstracted all of this away.
* **Seamless Integration**: The solution came with a ready-to-use frontend and was securely exposed via the API Gateway, making it easy to integrate into their existing web properties.
* **Easy to Customize and Evolve**: While the initial prototype was built with a no-code approach, the team has the option to switch to the **AI RAG Chat Template**, which provides the full source code, allowing them to customize and extend the agent's capabilities in the future.

The AI RAG Chat application from the Marketplace provided the team with an incredible accelerator, enabling them to rapidly validate their idea and deliver a valuable AI-powered solution to their users with minimal effort.
