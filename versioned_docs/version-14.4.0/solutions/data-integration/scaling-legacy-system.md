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

The architecture team leverages **Fast Data v2** to create a modern, high-performance read layer that shields the mainframe from traffic spikes, implementing a CQRS (Command Query Responsibility Segregation) pattern.

1.  **Real-Time Data Capture**: **Mongezium CDC** captures all changes from the mainframe's database and streams them to Kafka topics with high throughput and fault tolerance.

2.  **Data Transformation**: **Stream Processor** transforms and enriches the policy data in real-time using secure JavaScript environments, creating optimized data structures for fast querying.

3.  **Data Persistence**: **Kango** persists the processed policy data to MongoDB collections with optimized performance, creating a denormalized, query-ready projection of the mainframe data.

4.  **API Exposure**: The MongoDB projection is exposed through modern REST APIs, providing millisecond response times for policy queries while maintaining data consistency with the source system.

5.  **Traffic Redirection**: Digital channels are redirected to query the high-performance projection layer, while write operations continue to flow to the mainframe as the authoritative source of truth.

### The Outcome

* **Drastic Performance Improvement**: The user-facing applications now query the highly performant MongoDB Projection. Page load times are reduced from seconds to milliseconds, significantly improving the customer experience.
* **Legacy System Protection**: The mainframe is completely shielded from high-volume read traffic. Its load is reduced to its core transactional function, eliminating the risk of performance degradation or outages caused by the new digital channels.
* **Developer Empowerment**: Developers can now build new features against a modern, flexible, and fast REST API. They can use the full power of MongoDB queries without worrying about impacting the legacy SoR.
* **Scalability and Elasticity**: The read layer can be scaled independently of the mainframe. If traffic to the portal increases, the company can simply add more replicas of the CRUD Service, ensuring the system remains responsive.

By using Fast Data, the company successfully modernized its architecture, unlocking the data from its legacy system and enabling the development of fast, modern applications without a costly and risky "big bang" migration.
