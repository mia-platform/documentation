---
id: orchestrating-multi-agent-ai-workflows
title: Orchestrating Multi-Agent AI Workflows with Mia-Platform Flow Manager
sidebar_label: Orchestrating Multi-Agent AI Workflows
---

### The Scenario

An insurance company wants to automate its claims processing workflow. The process is complex and requires several distinct steps, each with its own specialized logic, making it unsuitable for a single monolithic AI agent.

### The Challenge

* **Complex, Multi-Step Process**: A claim process involves:
    1.  **Document Analysis**: Extracting information from a submitted claim form (PDF).
    2.  **Fraud Detection**: Analyzing the extracted data against historical patterns to flag suspicious claims.
    3.  **Policy Verification**: Checking the customer's policy to ensure the claim is valid and covered.
    4.  **Customer Communication**: Notifying the customer of the outcome (approved, rejected, or needs more information).
* **Need for Specialized Agents**: Each step requires a different type of expertise. A single LLM or agent would struggle to perform all these tasks optimally. The company needs a system of specialized agents that can collaborate.
* **Resilience and Error Handling**: The process must be resilient. If one agent fails (e.g., the fraud detection service is temporarily unavailable), the entire workflow shouldn't fail irreversibly. The system needs a way to manage state and handle retries or compensation logic.
* **Lack of Orchestration**: Simply having the agents call each other directly (choreography) would create a brittle, tightly coupled system that is hard to debug and maintain. The company needs a central orchestrator.

### The Solution with Mia-Platform

The company decides to model the workflow as a saga and use the **Flow Manager Service** to orchestrate a team of specialized AI agents.

1.  **Implementing Specialized AI Agents**: The AI team develops several microservices, each acting as a specialized agent:
    * `Document-Analyzer-Agent`: Uses OCR and an LLM to extract structured data from PDFs.
    * `Fraud-Detector-Agent`: A machine learning model that scores a claim's fraud risk.
    * `Policy-Verifier-Agent`: A rule-based service that checks the claim against the policy database.
    * `Notification-Agent`: A service that sends emails to customers.
      Each agent is deployed as a standard microservice in the Mia-Platform Console.

2.  **Designing the Workflow with the Flow Manager**: The team uses the **Flow Manager Configurator**, a no-code graphical tool, to design the entire workflow as a finite state machine.
    * They define states like `ClaimReceived`, `DocumentAnalyzed`, `FraudCheckComplete`, `ClaimApproved`, `ClaimRejected`.
    * For each state transition, they define the **command** to be sent to an agent and the **events** that agent can produce as a response. For example, from the `DocumentAnalyzed` state, the Flow Manager sends a `DetectFraud` command to the `Fraud-Detector-Agent`.

3.  **Decoupled Communication via Kafka**: The Flow Manager and the agents communicate asynchronously via **Kafka**. The Flow Manager publishes commands, and the agents consume them. After processing a command, an agent publishes an event (e.g., `FraudDetected` or `NoFraudDetected`), which the Flow Manager consumes to move the saga to the next state.

4.  **State Persistency and Visibility**: The Flow Manager is configured to persist the state of each claim's saga in a **CRUD** collection. This provides a complete, real-time audit trail. A support agent can, at any time, look up a claim ID and see its exact status in the workflow.

### The Outcome

* **Robust and Scalable Automation**: The company has successfully automated a complex, mission-critical business process. The decoupled, event-driven architecture is highly scalable and resilient.
* **Centralized Orchestration and Visibility**: The entire business logic for the workflow is centralized and visualized in the Flow Manager. It's easy for both business analysts and developers to understand and modify the process. If a step fails, it's immediately visible in the saga's state.
* **Specialized and Maintainable Agents**: Each AI agent is a small, focused microservice that does one thing well. This makes them easy to develop, test, and maintain independently. The company can upgrade the fraud detection model without affecting any other part of the system.
* **Foundation for Hyperautomation**: This multi-agent system becomes the foundation for further automation. New agents (e.g., for sentiment analysis on customer emails) can be easily added to the workflow by simply updating the Flow Manager configuration, and they can cooperate and communicate autonomously. 

By using the Flow Manager as an AI agent orchestrator, the company was able to move beyond simple chatbots and implement a sophisticated, resilient, and manageable multi-agent system that automates a core business process.
