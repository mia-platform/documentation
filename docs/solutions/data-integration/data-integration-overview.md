---
id: data-integration-overview
title: Data Integration Overview
sidebar_label: Data Integration Overview
---

# Data Integration: Unlock and Unify Your Data in Real-Time

Data Integration is the process of combining data from different sources to provide users with a unified, single view of that data. In modern enterprise architectures, data is often fragmented across various systems of record (SoRs), databases, and third-party applications. This creates data silos that hinder innovation, slow down decision-making, and make it difficult to build cohesive customer experiences.

## The Challenges of Modern Data Integration

As companies evolve, they face significant hurdles in making their data accessible, scalable, and consistent across the organization:

* **Legacy System Bottlenecks**: Many critical business systems (like ERPs, mainframes, or legacy databases) were not designed for the high-volume, low-latency read requests of modern web and mobile applications. Direct queries can easily overload these systems, causing performance degradation and even outages.
* **Data Silos**: Customer, product, and operational data is often scattered across multiple applications (CRM, e-commerce, marketing platforms). Creating a unified view requires complex and fragile point-to-point integrations, which are typically slow batch processes.
* **Lack of Real-Time Insights**: Traditional data integration methods often rely on nightly ETL (Extract, Transform, Load) jobs. This means that business decisions and customer-facing applications are based on data that is up to 24 hours old, which is unacceptable in today's fast-paced market.
* **High Development Cost for Data Access**: For every new application that needs data, developers often have to build custom integration logic, which is time-consuming, duplicates effort, and increases the maintenance burden.

## The Mia-Platform Solution: a Real-Time, Event-Driven Approach

**Mia-Platform Fast Data** provides a comprehensive solution to these challenges by enabling an event-driven, real-time data integration architecture. Instead of slow and brittle batch processes, Fast Data allows you to create a low-latency data mesh that keeps your systems in sync. Additionally, for simpler use cases, the platform offers synchronous data aggregation tools.

### Scale Your Systems of Record with Projections

The core of Fast Data's ability to scale legacy systems is the **Projection**. A Projection is a denormalized, query-optimized read model of your data, stored in a modern, scalable database like MongoDB.
* **Real-Time Updater**: This component listens to events from your Systems of Record (typically via a CDC tool and a message broker like Kafka) and updates the Projections in real-time.
* **Decouple Read and Write Operations**: Modern applications can now perform high-volume read operations against the fast and scalable Projections, completely shielding the legacy SoR from this traffic. This unlocks the data without compromising the stability of your core systems.

### Unify Your Data with Single Views

A **Single View** is a pre-aggregated, 360-degree view of a business entity (like a customer or a product) created by combining data from multiple Projections in real-time.
* **Single View Creator**: This service listens for changes in one or more Projections and uses an aggregation logic to build and maintain the Single View.
* **Eliminate Data Silos**: With Single Views, you can create a single source of truth for your key business entities. For example, a `customer_sv` can combine personal data from a CRM, order history from an e-commerce platform, and preferences from a marketing tool into a single, comprehensive document.

### Expose Your Data Through APIs

Both Projections and Single Views are exposed as standard collections that can be instantly made available via REST APIs using the **CRUD Service** plugin. This provides a simple, secure, and standardized way for applications to consume the unified, real-time data.

### Lightweight, On-Demand Aggregation with MongoDB Views

For simpler use cases that don't require the full power of an event-driven architecture, Mia-Platform Console also supports the creation of **MongoDB Views**.
* **On-the-Fly Aggregation**: A MongoDB View is a virtual collection whose content is defined by a MongoDB aggregation pipeline that can join data from multiple collections at query time.
* **Simplicity and Speed**: This is a perfect solution for backoffice dashboards or internal tools that need to display combined data without the overhead of creating a new persistent collection or a Fast Data pipeline.

By leveraging these tools, organizations can break down data silos, unlock the value of their legacy systems, and build a modern, real-time data integration architecture that fuels innovation and provides a competitive edge.
