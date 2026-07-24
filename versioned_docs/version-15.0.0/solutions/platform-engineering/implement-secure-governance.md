---
id: implement-secure-governance
title: Implement Secure Governance with Granular Access Control
sidebar_label: Implement Secure Governance
---

### The Scenario

A financial sector organization must ensure maximum security and compliance for its applications. However, to avoid slowing down release cycles, it wants to give development teams some autonomy while maintaining strict control over critical configurations.

### The Challenge

* **Risk of Unauthorized Changes**: Developers, by necessity or by mistake, could modify sensitive configurations in production environments, such as a service's Docker image, an endpoint's security policies, or resource limits.
* **Operational Bottleneck**: To mitigate the risk, the company has mandated that every change in production be approved and applied by the Ops team. This manual process creates queues and drastically slows down the time-to-market.
* **Lack of Guardrails**: Development teams have no clear guidelines on what they can and cannot modify, leading to trial and error and continuous approval requests.
* **Difficult Traceability**: It is difficult to know who changed what and when, making audit and incident response activities complex.

### The Solution with Mia-Platform

The Platform Engineering team decides to implement a "railroad framework", which features golden paths, paved roads  and guardrails measures, by using the governance features of **Mia-Platform Console**.

1.  **Definition of Roles in IAM**: Using the **IAM Portal** at the Company level, clear roles such as `Developer`, `Senior Developer`, and `Platform Engineer` are defined. Each user is assigned a role based on their responsibilities.

2.  **Configuration of Granular Access Control Rules (Fine-Grained Access Control)**: The core of the solution lies in configuring specific rules that limit actions for each role. From the Company settings, the Platform Engineer sets the following `SaveChangesRules`:
    * **Disallow Rule**: A rule is created that **prevents** the `Developer` role from modifying the `dockerImage` field for any microservice. This is a critical security measure to prevent unauthorized deployments in production.
    * **Allow Rule**: A rule is configured that allows **only** the `Senior Developer` and `Platform Engineer` roles to modify the security settings of endpoints (such as `Authentication required` or `User Group Permission`).

3.  **Self-Service and Secure Workflow**: Developers continue to work autonomously in the **Design Area** of the Console. When a `Developer` attempts to save a configuration that includes a change to the Docker image, the Console **blocks the save** and displays an error message explaining the rule violation. The developer can then request the change from a `Senior Developer`, who can make it in compliance with the policies.

4.  **Audit Log for Traceability**: Every save attempt, whether successful or failed, and every configuration change are recorded in the **Audit Log**. This provides the security and compliance team with a complete and immutable trace of all activities, simplifying audits and post-incident analysis.

### The Outcome

* **Security Integrated into the Workflow**: Security is no longer an external manual process but is integrated directly into the development tools. Developers receive immediate feedback if they attempt an unauthorized action.
* **Elimination of Bottlenecks**: Development teams can deploy autonomously, knowing that automatic "guardrails" will prevent risky changes. The Ops team is freed from routine approval requests.
* **Clear and Automatic Governance**: Access policies are defined declaratively and applied automatically by the platform, ensuring compliance without sacrificing speed.
* **Complete Accountability**: Thanks to the Audit Log, every action is tracked and attributed, increasing responsibility and transparency within the organization.

Mia-Platform has allowed the company to perfectly balance agility and control, creating a self-service development environment where security is a shared and automated responsibility.
