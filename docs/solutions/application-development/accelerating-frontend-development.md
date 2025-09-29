---
id: accelerating-frontend-development
title: Accelerating Frontend Development with Microfrontend Composer
sidebar_label: Accelerating Frontend Development
---

### The Scenario

A company needs to develop a new internal backoffice application for managing its product catalog. The application must be ready in a few weeks and must provide a modern and intuitive user experience for the operators. The development team is small and doesn't have deep expertise in all the latest frontend frameworks.

### The Challenge

* **Tight Deadlines**: The time-to-market is extremely short, making it impossible to develop the entire frontend from scratch.
* **Complex Requirements**: The backoffice needs to include functionalities like a searchable product table, forms for creating and editing products, data visualization dashboards, and user management.
* **Need for Consistency**: The UI must be consistent across all pages, but achieving this with custom development is time-consuming.
* **Integration with Existing Services**: The frontend needs to communicate with an existing CRUD service that exposes the product data.

### The Solution with Mia-Platform

The development team decides to use **Mia-Platform Microfrontend Composer** to build the backoffice application through a composable approach, leveraging the no-code/low-code capabilities of the platform.

1.  **Application Setup**: The team starts by creating the **Microfrontend Composer Toolkit** application from the Marketplace. This instantly sets up the necessary services, including the `micro-lc` frontend orchestrator and the webserver to serve the application.

2.  **Creating the Main Page with a Table**: Using the **Page Composer**, the team creates the main page of the backoffice.
    * They choose the "Base table" template, which provides a pre-configured page with a table, search bar, and buttons for creating new items.
    * In the **Connectors & Adapters** section, they connect the page to the existing `products` CRUD endpoint. They use the "Generate Schema" feature to automatically infer the data structure and configure the table columns.

3.  **Configuring Forms for Data Entry**: The template already includes a **Form Modal**. The team customizes the form by:
    * Modifying the `dataSchema` to define which fields are editable and which are required.
    * Setting up validation rules directly in the schema to ensure data integrity (e.g., price must be a positive number).

4.  **Adding a Details Page with Cards**: To view the details of a single product, the team creates a new page using the "Show info/details page" template.
    * This template uses **Card** components to display information in a clear and organized way.
    * They configure a `bk-url-parameters-adapter` to read the product ID from the URL, so the page dynamically fetches and displays the data for the selected product.
    * Finally, they add a "Detail" button to each row of the main table that navigates to this new page, passing the product ID in the URL.

5.  **Applying Consistent Styling**: The team customizes the overall look and feel of the application by configuring the **Layout** in the Microfrontend Composer. They set the company logo, choose the primary color to match the corporate branding, and define the structure of the navigation menu.

### The Outcome

* **Rapid Development**: The entire backoffice application was built and deployed in a matter of days, not weeks. The no-code/low-code approach allowed the team to focus on the user experience rather than on writing boilerplate code.
* **High-Quality and Consistent UI**: By using the pre-built components from the **Back-kit** library, the team created a modern, responsive, and consistent user interface without needing deep frontend expertise.
* **Easy Integration**: Connecting the frontend to the backend CRUD service was a matter of simple configuration, thanks to the integrated components like the `CRUD Client`.
* **Empowered Team**: The development team was able to deliver a complex application on time, demonstrating that composability drastically streamlines application design and configuration.

Mia-Platform Microfrontend Composer allowed the team to transform a complex requirement into a fully functional application quickly, proving that modern, high-quality frontends can be built with agility and efficiency.
