---
id: data-integration
title: Data Integration
sidebar_label: Data Integration
---

# Data Integration

Mia-Platform achieves Data Integration with an architectural approach named [**Data Fabric**](/products/fast_data/what_is_fast_data.md), i.e. a cutting-edge solution designed to address common challenges related to data, such as fragmentation, tight coupling, legacy system bottlenecks, and the need for access to real-time information. The primary goal is to decouple data from disparate sources, known as **Systems of Record (SoRs)**, and make it available 24/7, for any digital channel or application. This is achieved by creating a high-performance, consolidated data layer that provides a unified, 360-degree view of business entities.

Mia-Platform's approach combines the principles of **Data Mesh** and **Data Fabric**, enabling organizations to manage the entire data lifecycle, from collection to exposure, with agility and governance.

## The Core Challenge: Overcoming Legacy Constraints

Modern enterprises often struggle to innovate because their critical data is locked within legacy systems. These systems are frequently non-scalable, difficult to query, and become a significant bottleneck, leading to issues such as:

* **Increased response times** for applications trying to access data.

* **High load and resource consumption** on source systems, impacting their primary functions.

* **Data inconsistency** across different channels and applications.

* **Lack of 24/7 data availability**, with system maintenance or downtime directly affecting business operations.

Directly querying and aggregating data from these systems on-demand is inefficient and hinders the ability to deliver seamless, real-time digital experiences.

## Mia-Platform's Solution: The Fast Data Architecture

To solve these challenges, Mia-Platform provides [**Fast Data**](/products/fast_data/what_is_fast_data.md), a suite of highly configurable, event-driven components that industrialize the process of data integration. The architecture is designed to create a persistent, low-latency data layer that is always available and easy to consume.

### Building Blocks of Data Integration

The data integration process in Mia-Platform is built upon a few key concepts and components:

1. [**Connectors and Change Data Capture (CDC)**](/products/fast_data/concepts/the_basics.md#change-data-capture-cdc)**:** The process begins with ingesting data from the Systems of Record. This is typically achieved using CDC connectors, which capture changes (creations, updates, deletions) in the source databases in near real-time and stream them as events into an event streaming platform like Apache Kafka. This event-driven approach ensures that legacy systems are only touched when data actually changes, effectively offloading them.

2. [**Projections**](/products/fast_data/concepts/the_basics.md#projection)**:** Once the data events are in Kafka, they are consumed by services like the [**Real-Time Updater**](/products/fast_data/realtime_updater.md). This service is responsible for creating **Projections**, which are standardized, cleaned, and filtered representations of the source data. Projections contain only the fields relevant to the business domain and are stored in a highly scalable NoSQL database like MongoDB. This step ensures data standardization, as different source formats can be cast into a consistent model.

3. [**Single Views**](/products/fast_data/concepts/the_basics.md#single-view-sv)**:** The ultimate goal of the integration process is to create **Single Views**. A Single View is a pre-aggregated document that combines data from multiple Projections to provide a holistic, 360-degree view of a business entity (e.g., a customer, a product, an order). The [**Single View Creator**](/products/fast_data/single_view_creator.md) service is responsible for this aggregation. Because the data is aggregated on write (i.e., as soon as a related Projection changes) rather than on read, read operations on Single Views are exceptionally fast and efficient.

### The Data Flow

The typical data integration flow is as follows:

* A change occurs in a System of Record.

* A CDC connector captures this change and produces an event on a Kafka topic.

* The Real-Time Updater consumes the event, applies any necessary transformations (casting), and updates the corresponding Projection document in MongoDB.

* The update to the Projection triggers the Single View Creator, which re-aggregates the relevant Single View, ensuring it always reflects the latest data.

* The updated Single View is now available to be consumed by any application or API, providing a consistent, real-time view of the data.

## Key Benefits of Mia-Platform's Data Integration

* **Legacy System Offloading:** Reduces the load on critical source systems by moving read traffic to the highly scalable Single View layer.

* **24/7 Data Availability:** The Data Fabric provides a persistent data layer that remains available even if source systems are down for maintenance.

* **Real-Time Data Access:** The event-driven architecture ensures that data is synchronized and aggregated in near real-time, enabling reactive and data-intensive applications.

* **Data Standardization and Governance:** Data from various sources is transformed into a consistent, governed model, simplifying consumption and ensuring data quality.

* **Accelerated API and Application Development:** With data readily available in a pre-aggregated and easy-to-consume format, developers can build new APIs and applications much faster, as the complexity of data aggregation is handled by the platform.
