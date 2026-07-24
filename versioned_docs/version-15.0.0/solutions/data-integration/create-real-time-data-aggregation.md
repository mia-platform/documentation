---
id: create-real-time-data-aggregation
title: Create a Real-Time Data Aggregation with Fast Data Single Views
sidebar_label: Create Real-Time Data Aggregation
---

### The Scenario

A multi-brand retail company has its customer data spread across multiple, disconnected systems. This fragmentation makes it impossible to have a unified understanding of their customers' behavior and preferences.

### The Challenge

* **Data Silos**:
    * Customer personal information (name, email) is in a **Salesforce CRM**.
    * Order history is in an **e-commerce platform**.
    * Product browsing history and marketing preferences are in a **HubSpot marketing automation tool**.
    * Development team activities and product releases are tracked in **GitHub repositories**.
    * Customer support tickets and issue tracking data are stored in **Jira Service Management**.
    * Cloud infrastructure logs and security events are scattered across **AWS CloudTrail** and **Azure Activity Logs**.
* **Inconsistent Customer Experience**: When a customer calls support, the agent doesn't have a complete view of their recent orders or marketing interactions, leading to a frustrating and disjointed experience.
* **Ineffective Marketing Campaigns**: The marketing team cannot create personalized campaigns because they cannot segment customers based on their combined purchase and browsing history.
* **Slow Batch Processes**: The company has a nightly batch process that tries to unify this data in a data warehouse, but the information is always stale by up to 24 hours, making real-time personalization impossible.

### The Solution with Mia-Platform

The company leverages **Integration Connector Agent** and **Fast Data Engine 2.0** to create a unified, real-time customer 360° view.

1. **External Data Ingestion**: **Integration Connector Agent** connects to GitHub, Jira, AWS CloudTrail, and Azure Activity Logs, synchronizing development activities, support tickets, and infrastructure events directly into MongoDB collections.

2. **Real-Time Data Capture**: **Mongezium CDC** captures changes from all data sources (CRM, e-commerce, marketing platforms, and external systems) and streams them to Kafka topics with high performance.

3. **Data Transformation and Aggregation**: **Farm Data** combines multiple data streams into a unified customer profile, while **Stream Processor** enriches and transforms data using JavaScript logic.

4. **Unified Single View Creation**: **Kango** persists the aggregated customer data to MongoDB, creating the `customer_sv` collection with complete 360° customer profiles that include traditional business data plus development activities, support interactions, and infrastructure insights.

5. **API Exposure**: Modern REST APIs expose the unified customer single view, providing millisecond response times for applications requiring complete customer context.

### The Outcome

* **Comprehensive 360° Customer View**: The company now has a single, real-time view combining traditional customer data with technical and operational insights. A document in the `customer_sv` collection might look like this:
    ```json
    {
      "email": "jane.doe@example.com",
      "name": "Jane Doe",
      "crm_info": { ... },
      "order_history": [ { ... }, { ... } ],
      "marketing_preferences": { ... },
      "support_tickets": [ { ... } ],
      "product_interactions": { ... }
    }
    ```
* **Personalized Customer Experience**: The new customer support portal, built with **Microfrontend Composer**, calls the `/customers-sv` endpoint. When a customer calls, the support agent instantly sees their complete history, enabling personalized and efficient service.
* **Targeted and Effective Marketing**: The marketing team can now run highly targeted campaigns. For example, they can create a segment of customers who have viewed a specific product category but have not made a purchase in the last 30 days.
* **Foundation for New Applications**: The `customer_sv` becomes a valuable asset for the entire company. New applications, like a recommendation engine or a loyalty program app, can be built quickly on top of this reliable and real-time data source.

By leveraging Fast Data Single Views, the company broke down its data silos and transformed its fragmented data into a strategic asset, that is to say unified business data as a product. Single Views are easily discoverable, reusable and governed across all layers of the organization, enabling a new level of personalization and operational efficiency.
