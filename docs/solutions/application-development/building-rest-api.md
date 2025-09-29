---
id: building-rest-api
title: Building a REST API on Top of a Legacy Database
sidebar_label: Building a REST API
---

### The Scenario

A retail company has a legacy MongoDB database that contains all of its product inventory information. A new mobile application needs to access this data to show product availability to customers. The development team needs to create a modern, secure, and scalable REST API to expose this data, but they don't have the time or resources to write a dedicated microservice from scratch.

### The Challenge

* **Time Constraints**: The project has a very tight deadline, and writing, testing, and deploying a new API layer would take several weeks.
* **Lack of Expertise**: The team primarily consists of frontend developers and lacks deep expertise in backend development and API design best practices.
* **Need for Standard API Features**: The API must support standard features like pagination, filtering, sorting, and projection to be efficient for the mobile app. Implementing these from scratch is complex.
* **Security Requirements**: The data is sensitive, so the API must be secured, and access must be controlled.

### The Solution with Mia-Platform

The team decides to use **Mia-Platform Console** to create a secure and fully functional REST API without writing a single line of code.

1.  **Connecting the Database**: First, the team configures the connection to the legacy MongoDB database. They create a **secret variable** in the project's environment settings containing the MongoDB connection string. This ensures that the credentials are kept secure.

2.  **Creating the CRUD Service**: From the **Marketplace**, they add the **CRUD Service** plugin to their project. In the service's environment variables, they reference the MongoDB connection string variable they just created. The CRUD Service is a ready-to-use component that automatically handles the logic for interacting with a MongoDB database.

3.  **Defining the Data Model (CRUD Collection)**: In the **MongoDB CRUD** section of the Design Area, the team defines a new "CRUD Collection" named `products`.
    * Instead of manually defining all the fields, they use the **"Import fields from data sample"** feature. They provide a small JSON file with an example of a product document from their legacy database.
    * The Console automatically infers the data schema, including field names and types (string, number, boolean, etc.). The team quickly reviews and confirms the schema.

4.  **Exposing the REST API (Endpoint)**: In the **Endpoints** section, they create a new endpoint:
    * **Base Path**: `/products`
    * **Type**: `CRUD`
    * **CRUD Base Path**: They select the `/products` internal endpoint exposed by the CRUD Service.

5.  **Securing the Endpoint**: In the endpoint's security settings, they check the **"Authentication required"** box and define a **User Group Permission** (e.g., `groups.mobile_app`) to ensure that only authenticated clients belonging to the correct group can access the API.

6.  **Deploying the Solution**: The team saves the configuration and deploys the project.

### The Outcome

* **API Ready in Minutes**: In less than an hour, the team had a fully functional, production-ready REST API exposing their legacy data. There was no need for backend coding, which would have taken weeks.
* **Rich Features Out-of-the-Box**: The API automatically supports:
    * **GET `/products/`**: To list all products, with support for pagination (`_l`, `_sk`), filtering (`_q`), sorting (`_s`), and projection (`_p`).
    * **GET `/products/:id`**: To retrieve a single product.
    * **POST `/products/`**: To create a new product.
    * **PATCH `/products/:id`**: To update a product.
    * **DELETE `/products/:id`**: To delete a product.
* **Secure by Design**: The endpoint is protected by the API Gateway and the Authorization Service, ensuring that only authorized requests can access the data.
* **Empowered Frontend Team**: The frontend developers were unblocked immediately and could start developing the mobile app against a real, well-documented API (available in the **API Portal**).

Mia-Platform Console, with its powerful no-code/low-code components like the CRUD Service, allowed the team to overcome their lack of backend expertise and deliver a critical API on a tight schedule, demonstrating how abstracting common patterns can dramatically accelerate development.
