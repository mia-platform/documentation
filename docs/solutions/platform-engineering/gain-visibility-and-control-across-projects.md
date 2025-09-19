---
id: gain-visibility-and-control-across-projects
title: Gain Visibility and Control Across Multiple Projects with a Centralized Dashboard
sidebar_label: Gain Visibility and Control Across Projects
---

### The Scenario

A large enterprise with multiple business lines manages dozens of projects on Mia-Platform Console. Over time, it has become nearly impossible for the Platform Engineering team and security managers to get an overview of the state of the applications.

### The Challenge

* **Lack of Centralized Visibility**: There is no single point to answer critical questions like: "How many endpoints are publicly exposed without authentication?", "Which services are consuming an excessive amount of CPU?", "Are we using deprecated versions of a plugin?".
* **Difficulty in Enforcing Standards**: Although standards have been defined (e.g., all services must have resource limits configured), verifying their application across all projects is a manual, costly, and error-prone task.
* **Impossible Proactive Risk Identification**: Security or performance issues are discovered only after an incident has occurred, instead of being identified and resolved proactively.
* **Manual and Ineffective Reporting**: Preparing reports for management or audits requires manually collecting data from dozens of different projects, a slow and unreliable process.

### The Solution with Mia-Platform

The Platform Engineering team leverages the **Design Overview** of Mia-Platform Console, a Company-level feature that aggregates configuration data from all underlying projects into a single interface for a streamlined, automated developer experience.

1.  **Using Predefined Views**: Upon entering the Design Overview, the team uses the predefined views to get immediate insights:
    * **Unprotected Endpoints**: In a few seconds, they identify all endpoints exposed without authentication or API key, creating a priority list for the security team.
    * **CPU-intensive services / Memory-intensive services**: They analyze services with resource requests above a predefined threshold, identifying potential areas for cost optimization or performance issues.
    * **Replicated services**: They check which services are horizontally scaled, useful for understanding the criticality and expected load for each component.

2.  **Creating Custom Public Views**: To go further, the team creates custom views to monitor compliance with specific company standards:
    * **"Services without Log Parser" View**: They create a view filtering all microservices where the `logParser` field is set to `not collected`. This view becomes a fundamental tool for the observability team to ensure that all services produce analyzable logs.
    * **"CRUD without Description" View**: They set up a filter on CRUDs where the `description` field is empty. This helps enforce internal documentation policies.
    * **"Deprecated Plugin Usage" View**: They create a view that filters services based on a specific Docker image corresponding to a deprecated version of an internal plugin, facilitating migration planning.

3.  **Integration into the Governance Workflow**: These views are not just a visualization tool but become an integral part of the governance process. During weekly reviews, the Platform Engineering team analyzes the views to identify deviations from standards and assigns resolution tickets to the relevant development teams.

### The Outcome

* **360-Degree Visibility**: The Platform Engineering team now has a centralized, real-time dashboard on the health and compliance status of all projects, without having to access each one individually.
* **Simplified Enforcement of Standards**: It has become easy and immediate to verify if development teams are following the guidelines, transforming governance from a reactive to a proactive activity.
* **Rapid Risk Identification**: Security risks (open endpoints) and performance risks (oversized services) are identified in minutes, allowing for quick resolution before they become critical problems.
* **Automated and Reliable Reporting**: The views can be exported or shared, providing accurate and up-to-date data for management and audits, eliminating the need for manual collection.

The Design Overview has transformed how the company governs its software ecosystem, providing the Platform Engineering team with the ultimate tool for visibility, control, and proactive management.
