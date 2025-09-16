---
id: scaling-legacy-system
title: Scaling a Legacy System of Record with Fast Data Projections
sidebar_label: Scaling a Legacy System
---

### The Scenario

A large insurance company relies on a monolithic, on-premise mainframe system as its System of Record (SoR) for customer policies. This system is reliable for transactional writes but is slow and cannot handle the high volume of read requests from new digital channels, such as a customer-facing web portal and a mobile app.

### The Challenge

* **Performance Bottlenecks**: Every time a customer logs into the new portal to view their policy details, a query is sent directly to the mainframe. During peak hours, this high volume of read requests is causing the mainframe to slow down, affecting critical business operations.
* **High Latency for Users**: The slow response times from the SoR result in a poor user experience on the web portal and mobile app, with pages taking several seconds to load.
* **Risk of Outages**: The IT team is concerned that a sudden spike in traffic from the digital channels could overload and crash the mainframe, leading to a major business outage.
* **Development Blockers**: Developers building new features are constrained by the mainframe's limited query capabilities and slow performance, hindering innovation.

### The Solution with Mia-Platform

The architecture team decides to use **Mia-Platform Fast Data** to create a scalable read layer that shields the mainframe from high traffic, a pattern known as CQRS (Command Query Responsibility Segregation).

1.  **Setting Up the Event Stream**: The team uses a Change Data Capture (CDC) tool to capture any changes (creates, updates, deletes) to the policy data in the mainframe's database. These changes are published as events to a Kafka topic.

2.  **Creating a Projection**: In Mia-Platform Console, they configure a **Fast Data Projection** named `policies_projection`. This Projection is essentially a new MongoDB collection designed to be a denormalized, query-optimized read model of the policy data.

3.  **Configuring the Real-Time Updater**: They deploy the **Real-Time Updater (RTU)**, a key component of Fast Data. The RTU is configured to:
    * Consume events from the Kafka topic where the mainframe changes are published.
    * Process these events and apply the corresponding changes to the `policies_projection` in MongoDB.
      This ensures that the Projection is kept in sync with the mainframe in near real-time.

4.  **Exposing the Projection via API**: A **CRUD Service** is created, and an **Endpoint** `/policies` is configured to expose the `policies_projection`. This instantly creates a fast, modern, and scalable REST API on top of the Projection.

5.  **Redirecting Read Traffic**: The new web portal and mobile app are reconfigured to send their read requests to the new `/policies` endpoint instead of directly to the mainframe. Write operations (like creating a new policy) still go to the mainframe to maintain it as the single source of truth.

### The Outcome

* **Drastic Performance Improvement**: The user-facing applications now query the highly performant MongoDB Projection. Page load times are reduced from seconds to milliseconds, significantly improving the customer experience.
* **Legacy System Protection**: The mainframe is completely shielded from high-volume read traffic. Its load is reduced to its core transactional function, eliminating the risk of performance degradation or outages caused by the new digital channels.
* **Developer Empowerment**: Developers can now build new features against a modern, flexible, and fast REST API. They can use the full power of MongoDB queries without worrying about impacting the legacy SoR.
* **Scalability and Elasticity**: The read layer (the Projection and the CRUD Service) can be scaled independently of the mainframe. If traffic to the portal increases, the company can simply add more replicas of the CRUD Service, ensuring the system remains responsive.

By using Fast Data Projections, the company successfully modernized its architecture, unlocking the data from its legacy system and enabling the development of fast, modern applications without a costly and risky "big bang" migration.
