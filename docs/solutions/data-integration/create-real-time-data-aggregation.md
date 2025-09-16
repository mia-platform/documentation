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
    * Order history is in a **Magento e-commerce platform**.
    * Product browsing history and marketing preferences are in a **HubSpot marketing automation tool**.
* **Inconsistent Customer Experience**: When a customer calls support, the agent doesn't have a complete view of their recent orders or marketing interactions, leading to a frustrating and disjointed experience.
* **Ineffective Marketing Campaigns**: The marketing team cannot create personalized campaigns because they cannot segment customers based on their combined purchase and browsing history.
* **Slow Batch Processes**: The company has a nightly batch process that tries to unify this data in a data warehouse, but the information is always stale by up to 24 hours, making real-time personalization impossible.

### The Solution with Mia-Platform

The company decides to build a real-time, 360° view of their customers using **Mia-Platform Fast Data Single Views**.

1.  **Creating Projections for Each Data Source**: First, they create a **Fast Data Projection** for each of the three systems of record. Using CDC tools and Kafka, any change in these systems is published as an event and consumed by a **Real-Time Updater**.
    * `crm_customers_projection`: Contains up-to-date personal information from Salesforce.
    * `ecommerce_orders_projection`: Contains the real-time order history from Magento.
    * `marketing_preferences_projection`: Contains the latest browsing and preference data from HubSpot.

2.  **Configuring the Single View**: In Mia-Platform Console, they create a **Fast Data Single View** named `customer_sv`. This Single View will be a new, aggregated MongoDB collection.

3.  **Defining the Aggregation Logic with the Single View Creator**: They deploy and configure the **Single View Creator (SVC)**, the service responsible for building the Single View. The SVC is configured to:
    * Listen for any changes in the three source Projections (`crm_customers`, `ecommerce_orders`, `marketing_preferences`).
    * Use the customer's email as the unique identifier to link the data from the different sources.
    * Execute an aggregation logic whenever a change occurs. For example, when a new order is added to the `ecommerce_orders_projection`, the SVC finds the corresponding customer in the `customer_sv` and updates their `order_history` array.

4.  **Exposing the Single View via API**: An endpoint `/customers-sv` is created and connected to a **CRUD Service** that reads from the `customer_sv` collection. This provides a fast and secure REST API to access the unified customer data.

### The Outcome

* **Real-Time 360° Customer View**: The company now has a single, comprehensive, and up-to-the-minute view of each customer. A document in the `customer_sv` collection might look like this:
    ```json
    {
      "email": "jane.doe@example.com",
      "name": "Jane Doe",
      "crm_info": { ... },
      "order_history": [ { ... }, { ... } ],
      "marketing_preferences": { ... }
    }
    ```
* **Personalized Customer Experience**: The new customer support portal, built with **Microfrontend Composer**, calls the `/customers-sv` endpoint. When a customer calls, the support agent instantly sees their complete history, enabling personalized and efficient service.
* **Targeted and Effective Marketing**: The marketing team can now run highly targeted campaigns. For example, they can create a segment of customers who have viewed a specific product category but have not made a purchase in the last 30 days.
* **Foundation for New Applications**: The `customer_sv` becomes a valuable asset for the entire company. New applications, like a recommendation engine or a loyalty program app, can be built quickly on top of this reliable and real-time data source.

By leveraging Fast Data Single Views, the company broke down its data silos and transformed its fragmented data into a strategic asset, enabling a new level of personalization and operational efficiency.
