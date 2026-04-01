---
id: leveraging-software-catalog-with-mia-assistant
title: Leveraging the Software Catalog with Mia-Assistant
sidebar_label: Leveraging Software Catalog with Mia-Assistant
---

### The Scenario

An organization has fully embraced Mia-Platform, managing dozens of projects, hundreds of microservices, and a complex cloud infrastructure. As the platform scales, developers and operators find it increasingly difficult to find information and troubleshoot issues efficiently.

### The Challenge

* **Information Overload**: Finding specific information—like the owner of a service, its current version in production, or its resource consumption—requires navigating through multiple pages in the Console or querying different systems.
* **High Cognitive Load for Troubleshooting**: When an issue occurs, an operator needs to manually correlate information from different sources. For example, to debug a failing pod, they might need to check its logs, its deployment configuration, recent commits in its Git repository, and the status of its dependencies.
* **Onboarding Complexity**: New team members are overwhelmed by the amount of information and struggle to understand the architecture and dependencies of the systems they are working on.
* **Need for Actionable Insights**: The platform generates a vast amount of data, but turning that data into actionable insights (e.g., identifying optimization opportunities or potential risks) is a manual and time-consuming process.

### The Solution with Mia-Platform

The company enables the **AI features** of Mia-Platform Console, turning its platform into an intelligent system that can be queried and managed through natural language.

1.  **Enriching the Software Catalog with Real-Time Data**: The journey begins with data. The team configures the **Integration Connector Agent** to automatically scrape data from their cloud providers (like Azure) and DevOps tools (like GitLab). This data is used to enrich the **Software Catalog**, turning it from a static list of components into a dynamic, real-time representation of their entire software ecosystem. The catalog now knows about every deployed resource, its runtime status, its configuration, and its relationships with other components.

2.  **Enabling AI Capabilities**: In the **Company Settings**, a Company Owner enables the **AI Settings**. This grants **Mia-Assistant**, the AI-powered assistant within the Console, secure access to the enriched data from the Software Catalog and the project configurations.

3.  **Interacting with the Platform via Mia-Assistant**: Now, developers and operators can use Mia-Assistant to get immediate answers and perform actions:
    * **A developer** preparing for a release can ask: `"@mia show me the DORA metrics for the checkout project in the last 30 days."` Mia-Assistant queries the platform data and provides an instant report on deployment frequency and change failure rate.
    * **An operator** investigating an alert can use the `/debug` command: `"/debug the payment service in production, are there any errors in the logs?"` Mia-Assistant fetches the latest logs from the `payment-service` pod, analyzes them for error patterns, and provides a summary of its findings, often suggesting a root cause.
    * **A new team member** trying to understand the architecture can ask: `"@mia what services does the order-service depend on?"` The assistant uses the relationship data in the catalog to provide a clear dependency graph.
    * **A platform engineer** can even perform actions: `"@mia deploy the latest version of the user-profile service to the staging environment."` After a confirmation prompt, Mia-Assistant can trigger the deployment pipeline.

### The Outcome

* **Drastically Reduced Time to Information**: Team members no longer waste time hunting for information. They get immediate, context-aware answers to their questions through a simple, conversational interface.
* **Accelerated Troubleshooting**: The `/debug` command has become the first step in any troubleshooting process. It automates the initial data gathering and analysis, allowing operators to identify the root cause of issues much faster.
* **Democratized Platform Knowledge**: The institutional knowledge about the platform is no longer confined to a few senior engineers. Anyone can now query the system and get the information they need, which has significantly improved onboarding and collaboration.
* **From Data to Actionable Intelligence**: The platform is no longer just a system for managing configurations; it's an intelligent partner that helps teams make better decisions. Mia-Assistant turns raw data into actionable insights, proactively highlighting risks and suggesting improvements.

By integrating AI at its core, Mia-Platform Console transforms the developer and operator experience, moving from a traditional UI-based interaction to a conversational, intelligent, and highly efficient way of managing the entire software lifecycle.
