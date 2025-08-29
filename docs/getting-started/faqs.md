---
id: faqs
title: Mia-Platform FAQs
sidebar_label: Mia-Platform FAQs
---

### Mia-Platform Console

#### What is Mia-Platform Console?
Mia-Platform Console is a Platform Builder used to create and manage a custom Internal Developer Platform (IDP). It is a centralized developer portal designed to industrialize and govern the entire cloud-native software development lifecycle, from infrastructure connection and API design to deployment and monitoring.

#### What are the main benefits of using the Console?
The main benefits are improved governance, developer self-service, and a lower cognitive load. It empowers development teams with self-service capabilities, abstracts away cloud-native complexity, and allows platform engineering teams to enforce standards and best practices, creating "golden paths" for developers.

For a more detailed list of questions and answers about this product, see the [dedicated FAQ section](/getting-started/faqs/mia-platform-console-faqs.md).

***

### Mia-Platform Fast Data

#### What is Mia-Platform Fast Data?
Mia-Platform Fast Data is a solution for building a **Digital Integration Hub (DIH)**. It collects data from various sources, known as **Systems of Record (SoR)**, standardizes them into collections called **Projections**, and then aggregates them in near real-time into read-optimized data models called **Single Views**.

#### Why would an organization use Fast Data?
Organizations use Fast Data to create a high-performance, real-time data layer that decouples modern applications from legacy systems. This approach offloads legacy systems, ensures data is consistently available 24/7, and provides an up-to-date, aggregated view of fast-changing data to be consumed by APIs and applications with low latency.

For a more detailed list of questions and answers about this product, see the [dedicated FAQ section](/getting-started/faqs/mia-platform-fast-data-faqs.md).

***

### Mia-Platform Microfrontend Composer

#### What is the Microfrontend Composer?
The Microfrontend Composer is a low-code/no-code tool within the Console for building user interfaces like backoffices, dashboards, and developer portals. It allows users to visually assemble pages by configuring and combining pre-built or custom web components.

#### How does it work and what are its key components?
The Composer is powered by **micro-lc**, an open-source microfrontend orchestrator that renders the final application. Pages are typically built using **Back-Kit**, a library of pre-built web components (tables, forms, buttons) that communicate with each other through an event-driven system. The entire application configuration is served by a lightweight web server.

For a more detailed list of questions and answers about this product, see the [dedicated FAQ section](/getting-started/faqs/mia-platform-microfrontend-composer-faqs.md).

***

### Mia-Platform Data Catalog

#### What is the purpose of the Mia-Platform Data Catalog?
The Data Catalog is a centralized solution for discovering, understanding, and governing all data assets within an organization. It functions as a single source of truth, allowing users to find relevant datasets, understand their quality, and trace their origin and transformations (lineage).

#### What kind of information can I find in the Data Catalog?
For each data asset (like a database table or a Fast Data Projection), you can find detailed metadata, including its schema, a business description, owners, and tags. A key feature is **Data Lineage**, which provides a visual graph showing the data's origin and how it flows and transforms across different systems.

For a more detailed list of questions and answers about this product, see the [dedicated FAQ section](/getting-started/faqs/mia-platform-data-catalog-faqs.md).

***

### Mia-Platform Software Catalog

#### What is the Software Catalog and how is it different from the Marketplace?
The **Software Catalog** is the backend management solution used by platform engineers to create, version, and govern all reusable software assets (like Plugins and Templates). The **Marketplace** is the user-facing UI inside the Console, where developers browse and consume the assets made available by the Software Catalog to add them to their projects.

#### Why is the Software Catalog important for a Platform Engineering team?
It is a crucial tool for implementing an effective Internal Developer Platform (IDP). It allows a platform team to enforce standardization and best practices by providing a curated library of approved components. This promotes reusability, accelerates development by offering "golden paths," and ensures governance over the software assets used across the organization.

For a more detailed list of questions and answers about this product, see the [dedicated FAQ section](/getting-started/faqs/mia-platform-software-catalog-faqs.md).

***

### Runtime Components

#### What are Runtime Components?
Runtime Components are ready-to-use software assets available in the Marketplace that can be added to projects to speed up development. They are the functional building blocks, like plugins and templates, that developers use to assemble their applications on the platform.

#### What is the main difference between a Plugin and a Template?
* A **Plugin** is a pre-built, ready-to-use Docker image that functions like a "black box." You configure it but do not modify its source code. It's used for common, standardized functionalities.
* A **Template** is a boilerplate Git repository that serves as a starting point. It gets cloned into your project, giving you full ownership of the code to modify and extend as needed. It's used for building custom services.

For a more detailed list of questions and answers about this product, see the [dedicated FAQ section](/getting-started/faqs/mia-platform-runtime-components-faqs.md).
