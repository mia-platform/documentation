---
id: data-catalog-tutorial
title: 'Getting Started with Mia-Platform Data Catalog'
sidebar_label: Getting Started with Mia-Platform Data Catalog
---

# Getting Started with Mia-Platform Data Catalog

## Introduction: What We'll Cover in This Tutorial

This tutorial serves as a guide to understanding and utilizing the [Mia-Platform Data Catalog](/data_catalog/overview.mdx). It is designed for users seeking to effectively catalog their organization's data assets, comprehend data lineage, and enhance data governance practices within the Mia-Platform ecosystem. The primary objective is to equip users with the foundational knowledge and practical steps needed to begin leveraging the Data Catalog's capabilities.

The tutorial will cover the following key areas:

- An exploration of what the Mia-Platform Data Catalog is and its operational principles.
- Essential information regarding the installation and configuration processes.
- Guidance on establishing connections to data sources, with specific examples for OracleDB and Mia-Platform Fast Data, including the process of metadata scraping.
- A detailed explanation of Data Lineage: its definition, significance, and how it functions within the platform.
- An overview of how data lineage is visualized and how virtual elements can be created to enrich lineage information.

Upon completion of this tutorial, users will possess a solid understanding of the Data Catalog's core features and will be prepared to perform initial setup and basic operations. While this guide aims to be comprehensive in its coverage of fundamental aspects, it is important to recognize that it provides a starting point. For the most detailed, up-to-date information, and advanced configurations, users should consult the [official documentation](/data_catalog/overview.mdx). This approach ensures users feel empowered to begin their journey with the Data Catalog, while also being aware of resources for more specialized requirements.

## Data Catalog: What It Is and How It Works

The Mia-Platform Data Catalog is a centralized and organized repository of metadata that describes the company’s data, including its origins, characteristics, and relationships. It aims to provide a clear and detailed overview of available data resources, thereby facilitating their access, management, and informed use.

In today's data-driven landscape, organizations grapple with an ever-increasing volume and complexity of data. A Data Catalog becomes essential in addressing several prevalent challenges:

- **Data Integration**: Companies often encounter difficulties when trying to integrate data from disparate sources. Without a centralized view, achieving a unified and coherent perspective on data assets is a significant hurdle.
- **Data Quality**: Maintaining the accuracy and consistency of data is a continuous challenge, particularly when data is dispersed across various systems and formats.
- **Security and Privacy**: Ensuring the protection of sensitive data and adherence to privacy regulations is crucial yet complex to manage without a centralized system.
- **Data Access and Utilization**: Facilitating access to the correct data for the appropriate individuals, without compromising security, can be difficult to manage effectively.

The Mia-Platform Data Catalog offers solutions to these challenges by providing core benefits:

- **Data Governance**: It assists organizations in controlling and managing data to ensure accuracy, consistency, and compliance with both internal company policies and external regulations. This function extends beyond mere technical utility, positioning the Data Catalog as a strategic asset for mitigating risks associated with data mismanagement and non-compliance.
- **Data Discovery**: It provides tools for efficiently searching and discovering data, significantly reducing the time analysts and data scientists spend locating necessary information from numerous and heterogeneous systems.
- **Regulations and Compliance**: The catalog facilitates adherence to regulations such as GDPR by tracking and documenting data origins and flows, which supports auditing and reporting activities. This capability is vital for businesses operating under strict regulatory frameworks.
- **Adherence to Data Policies**: It helps ensure that company data policies are followed by providing visibility and control over data management practices.

The power of the Mia-Platform Data Catalog is rooted in its key features:

- **Data Cataloging**: It organizes and collects available information about a company's systems of records, tables, and columns, making it easier for analysts to find and understand the data required for their work.
- **Metadata Management**: The platform provides full management of custom properties that can be assigned to collected assets for metadata enrichment. This enrichment is critical; by adding descriptive information, keywords, and data classifications, users can perform more precise searches, leading to improved data discoverability and understanding. Furthermore, standardized and enriched metadata ensures consistency, reduces ambiguity, supports compliance efforts by documenting ownership and sensitivity, and enhances collaboration by providing a shared understanding of data assets. The value derived from the Data Catalog grows substantially with active user participation in contextualizing data through such enrichment.
- **Search and Discovery**: Users can search for and discover data using advanced queries and filters based on tags and custom properties.
- **Collaborative Environment**: It enables users to collaborate in searching for and enriching assets within a centralized source of truth, thereby facilitating knowledge sharing.
- **Policy Management and Access Control**: The system allows for the establishment of customized data classification levels (e.g., public, internal, confidential) and tagging based on data sensitivity. It also enables access control for users, granting specific permissions such as read-only access or metadata enrichment capabilities. For detailed guidance on managing user permissions, refer to the [guide about secure access](/data_catalog/secure_access.mdx).
- **Data Lineage**: This feature allows tracking the origin and flow of data through various systems, which will be explored in detail in [Section 5](#what-is-data-lineage-and-how-does-it-work).
- **Connections Management**: Users can add, edit, and synchronize external data sources to retrieve their assets. This will be covered in [Section 4](#creating-a-new-connection-oracle-database-and-fast-data).

A high-level overview of the architecture reveals several interconnected components:

- **[Data Catalog Frontend (UI)](/data_catalog/frontend/overview.mdx)**: This is the primary interface through which users interact with the catalog.
- **[Fabric BFF (Backend for Frontend)](/data_catalog/data_catalog_fabric_bff.mdx)**: This component manages connections configured from the frontend and communicates with other backend services.
- **[Job Runner](/data_catalog/data_catalog_job_runner.mdx)**: This service is responsible for scheduling and executing tasks, such as metadata extraction (via "Agent Dataset Scan") and lineage data collection (e.g., "Fast Data Sync").
- **[Open Lineage service](/data_catalog/data_catalog_open_lineage.mdx)**: This service manages the assets and lineage jobs, providing the features necessary to retrieve and present lineage data.

These components work in concert: the Fabric BFF handles requests from the UI, particularly for connection configurations; the Job Runner executes tasks to scan data sources or collect lineage information from systems like [Mia-Platform Fast Data](/fast_data/what_is_fast_data.md); and the Open Lineage service stores and serves this data to be displayed in the UI. This architecture underscores that the Data Catalog is not merely a passive repository but an active system whose utility is amplified by the quality and context of the information fed into it, both automatically and through user enrichment. The Mia-Platform Data Catalog supports metadata acquisition from a variety of Systems of Records. Supported Systems of Records for [Metadata Acquisition](/data_catalog/frontend/data_catalog_connections.mdx#connection-providers):

- Oracle Database
- Postgres Database
- MySQL Database
- Microsoft SQL Server Database
- Mia-Platform MongoDB CRUD Service
- Salesforce SObjects API
- SAP HANA
- MongoDB

## Data Catalog: Installation and Configuration Requirements

Before setting up the Mia-Platform Data Catalog, certain prerequisites must be met. A running [Mia-Platform Console](/development_suite/overview-dev-suite.md) instance is fundamental, as the Data Catalog Application is sourced from the [Mia-Platform Marketplace](/marketplace/overview_marketplace.md) and its configuration is managed within the Console environment. It is also crucial for users to consult the [compatibility matrix](/data_catalog/compatibility_matrix.md) to ensure their existing infrastructure and services are equipped to support the Data Catalog solution.

The Data Catalog Application is found within the Mia-Platform Marketplace. This application is a pre-configured bundle of resources designed for straightforward instantiation and deployment of a functional Data Catalog product. The availability of the Data Catalog as a pre-configured package in the Marketplace simplifies deployment, allowing organizations to achieve faster time-to-value by avoiding manual setup of all components from scratch.

To configure the Data Catalog, you must first initialize the Data Catalog Application from the Mia-Platform Marketplace. To do so, move to the "Application" section in the Design Area sidebar and search for the "Data Catalog" application in the list of applications. Then, follow all the steps to complete the initial setup. These steps will create all the necessary microservices and routes. 

![](./../img/data-catalog-application.png)

Once the application is successfully installed you have to do some manual configuration to successfully configure the application.

The effective setup of the Data Catalog involves not only deploying the application but also ensuring that the surrounding Mia-Platform environment, including network paths, security settings, and API Gateway features like WebSocket support, is correctly configured. This interconnectedness means users may need a basic understanding of Mia-Platform's architectural concepts.

The Data Catalog UI can also be embedded as an extension within the Mia-Platform Console using [Mia-Platform Platforge Extensions](/console/console-extensibility/overview.md). This provides seamless access to the Data Catalog through the same interface as other Console functionalities. The primary information needed for this registration is the production URL where the Data Catalog frontend is served. It is generally recommended to embed the Data Catalog Frontend at the Company level within the Console. To enable embedding in an iFrame, the `X-Frame-Options` header for the Data Catalog Frontend endpoint must be relaxed from its default `SAMEORIGIN` to `Any Origin` in the Endpoint Settings.

### Database Preparation

The Data Catalog solution relies on a set of collections to carry out most of its tasks, namely storing data asset definitions and their associated metadata. To provide a performant and reliable system, the database must be configured accordingly to support application execution.

To properly set up the database, please refer to the following [documentation page](/data_catalog/database_setup.mdx) that describes how to configure the `fabric-admin` CronJob.

For the complete configuration of its manifest, please insert:
* <URL_TO_CONTAINER_REGISTRY> → the URL to your Container Registry of reference;
* <NAME_CONTAINER_REGISTRY_SECRET> → name of the secret containing the credentials for connecting to your Container Registry;
* {{MONGODB_ADMIN_URL}} → refers to the secreted value that contains the connection string to your MongoDB database.

Once configured, [deploy](/development_suite/deploy/overview.md) it to your runtime environment and then [launch the cronjob](/development_suite/monitoring/resources/cronjobs.md#manually-launching-a-cronjob) for database preparation.

When launched, the `fabric-admin` creates the necessary MongoDB collections and indexes for the Data Catalog.

Once the database setup phase is completed, you can move to the following phase regarding the Data Catalog Application configuration.

### Data Catalog Application configuration

Navigate to the Applications section inside the Design Area, and choose the Data Catalog Application item.
When you create the Data Catalog application, a comprehensive bundle of resources is automatically generated to support both **security management** and **core data catalog functionality**.

The microservices created can be logically grouped into two main categories:

### Authentication & Authorization Services

These services handle security, access control, and user management:
- **api-gateway**: Entry point, routing and authentication
- **authentication-service**: OAuth2/OIDC authentication flows  
- **authorization-service**: Access control and permissions (ACL)
- **login-site**: Authentication frontend interface
- **micro-lc**: Management interface orchestrator
- **crud-service**: User collection and CRUD operations

### Core Data Catalog Services

These services implement the main Data Catalog capabilities:
- **data-catalog-fe**: Main user interface for data assets
- **fabric-bff**: Backend orchestrator for frontend-to-services communication
- **open-lineage**: Data lineage tracking and metadata management
- **job-runner**: Data processing pipelines and job execution
- **fabric-cache**: Redis cache for performance optimization
- **`grpcui`**: Web interface for Job Runner management

Then, the application creates the following **endpoints**:
- **Authentication endpoints** (7): `/apps`, `/authorize`, `/logout`, `/oauth/token`, `/refreshtoken`, `/userinfo`, `/authz/users`
- **Frontend endpoints** (3): `/data-catalog`, `/data-catalog/.well-known/openid-configuration`, `/data-catalog/configuration`
- **API endpoints** (4): `/api/connections`, `/api/data-catalog`, `/api/job-runner`, `/api/open-lineage`
- **Management endpoints** (2): `/mgmt`, `/micro-lc-configurations`
- **Utility endpoints** (2): `/ui/job-runner`, `/web-login`

Finally, the application creates the following **other resources**: in particular, 1 **collection** (`users`) for user management and various **public variables**.

Now, users can start finalizing the configuration of the application workloads to be properly deployed.

#### Authentication & Authorization Services

In the Data Catalog documentation, there is [Secure Access documentation page](/data_catalog/secure_access.mdx) that guides users through configuring the authentication and authorization flows and securing and managing users access.

Once you have completed all the steps outlined in the Secure Access documentation page, you have achieved the goal of securing your Data Catalog application.

:::note
In this tutorial, Okta has been chosen as the Identity Provider for managing user identities. Any other Identity Provider supported by the Mia-Platform [Authentication Service](/runtime_suite/authentication-service/10_overview.md) can be adopted in place of Okta by following the same guide steps.
:::

Now, we can proceed to finalize the configuration of the core Data Catalog services.

#### Data Catalog Frontend Service

The Data Catalog Frontend serves the main user interface for browsing and managing data assets.

In the `data-catalog-fe-config` ConfigMap, ensure that you have properly configured the variable present in the `openid-configuration.json` file that allows correct handling of user logout.

For more info about Data Catalog Frontend Service, visit the following [documentation page](/data_catalog/frontend/overview.mdx#configuration).

#### Fabric BFF Service

The Fabric BFF (Backend for Frontend) orchestrates communication between the frontend and backend services.

In the `config.json` file of the `fabric-bff-config` ConfigMap, replace `<CONFIGURE_ME>` with your MongoDB connection string by using an environment variable reference: `{"type": "env", "key": "MONGODB_URL_DC"}`.

For more info about Fabric BFF Service, visit the following documentation page (/data_catalog/data_catalog_fabric_bff.mdx).

#### Fabric Cache Service

The Fabric Cache service provides Redis caching for improved performance.

If you have already followed the [Secure Access documentation page](/data_catalog/secure_access.mdx) previously mentioned in this tutorial, no additional actions are required.

#### gRPC UI Service

The gRPC UI service provides a web interface for the Job Runner gRPC API.

If you have already followed the [Secure Access documentation page](/data_catalog/secure_access.mdx) previously mentioned in this tutorial, no additional actions are required.

#### Job Runner Service

The Job Runner service executes data processing pipelines and manages job scheduling.

In the `config.json` file of the `job-runner-config-folder` ConfigMap, replace `<CONFIGURE_ME>` with your MongoDB connection string by using an environment variable reference: `{"type": "env", "key": "MONGODB_URL_DC"}`.

The Data Catalog Job Runner can trigger the execution of different jobs that can update the state of the Data Catalog solution.
To discover more about all the capabilities offered by this service, refer to the following [documentation page](/data_catalog/data_catalog_job_runner.mdx).

#### Open Lineage Service

The Open Lineage service exposes APIs to handle Catalog features and Data Lineage features for the Data Catalog UI.

In the `config.json` file of the `open-lineage-config` ConfigMap, replace `<CONFIGURE_ME>` with your MongoDB connection string by using an environment variable reference: `{"type": "env", "key": "MONGODB_URL_DC"}`.

For more information about the Open Lineage service, visit the following [documentation page](/data_catalog/data_catalog_open_lineage.mdx).

### Deploy Data Catalog!

You have successfully configured your Mia-Platform Data Catalog application!
Now it is ready to be deployed in the same runtime environment where you previously deployed the `fabric-admin` cronjob.

Check that all pods are up and running, and start performing your first login to the Mia-Platform Data Catalog!

### First Access

After successful deployment, you can access your Data Catalog at:

- **Main Interface**: `{{DC_BASE_URL}}/data-catalog/`
- **Management Interface**: `{{DC_BASE_URL}}/mgmt/`
- **Job Runner UI**: `{{DC_BASE_URL}}/ui/job-runner/`
- **Authentication**: `{{DC_BASE_URL}}/web-login/`

:::caution
Refer to **The First User** [documentation paragraph](/data_catalog/secure_access.mdx#the-first-user), which explains what actions to perform as the first accessing user and how to manage user permissions!
:::

For the moment, the Data Catalog is up and running but is not showing any content because, obviously, no assets from your organization's data landscape have been retrieved into it yet.

The next step will therefore be to **start retrieving data assets** into the Data Catalog, and to do this, you will need to **establish your first connection** to a system of record from which you want to import data structures.

## Creating a New Connection (Oracle Database and Fast Data)

[Connections Management](/data_catalog/frontend/data_catalog_connections.mdx) is a core feature of the Mia-Platform Data Catalog, allowing users to add, edit and synchronize external data sources to retrieve their assets. These connections are typically configured from the Data Catalog's frontend interface, and the Fabric BFF component is responsible for managing these configurations.

The Data Catalog **Job Runner** plays a crucial role in populating the catalog with metadata. It schedules tasks, such as an "Agent Dataset Scan", to connect to configured data sources, retrieve metadata about their structure (like tables and columns), and store this information as Datasets within the Data Catalog. Configuration details for the Job Runner should be available in its dedicated [documentation](/data_catalog/data_catalog_job_runner.mdx). 
Here is an example on how to connect to an **OracleDB** Database:

To create a new connection, begin by navigating to the **Connection** tab on the main page of the Data Catalog UI, then click the **Add Connection** button. Next, you must choose a connection provider from the list of available options, such as **OracleDB**, and fill out the form with the required data like the **connection name** and **connection string**. Upon doing so, the connection is established, and the Data Catalog will automatically start to fetch the available metadata for the data sources within that System of Record (SoR). If you want to see a step by step guide take a look at [this guided video tutorial](https://youtu.be/sfMxhWrHwmw?si=fGymSvTVi_TaTlZz) to add a Oracle Connection to Mia-Platform Data Catalog.

![](./../img/data-catalog-connection-1.png)

The **Connection** page allows you to check all available connections. From here, for each System of Record, you can force a new sync of metadata from its data sources. If problems occur, you can also get the sync status and access the logs to troubleshoot.

![](./../img/data-catalog-connection-2.png)

Integrating Mia-Platform Data Catalog with other components of the Mia-Platform ecosystem, such as Mia-Platform CRUD services and Fast Data, allows for a more comprehensive view of your data landscape, encompassing both data at rest and data in motion. 

[Mia-Platform Fast Data](/fast_data/what_is_fast_data.md) often processes real-time data streams, and the results of these processes might be stored in MongoDB collections. If these MongoDB collections are managed and exposed by a [Mia-Platform CRUD Service](/runtime_suite/crud-service/10_overview_and_usage.md), the Data Catalog can connect to this CRUD Service to catalog the metadata of the resulting datasets. This allows you to document and discover the data that has been processed by your Fast Data pipelines.

Conceptually, the process unfolds through several steps. Firstly, it's crucial to **ensure data is accessible via CRUD Service**. This means verifying that the data intended for cataloging—which could very well be the output of a Fast Data pipeline—is indeed stored in a MongoDB collection. Subsequently, this MongoDB collection must be exposed via a Mia-Platform CRUD Service. This involves configuring the CRUD Service within your Mia-Platform project to manage that specific collection, carefully defining its schema, and exposing the necessary endpoints. For comprehensive details on setting up a CRUD service, the relevant Mia-Platform Console [tutorials and documentation](/runtime_suite/crud-service/10_overview_and_usage.md) serve as invaluable resources.

Once the CRUD service is ready, you would **navigate to connections management in Data Catalog**. Within the Mia-Platform Data Catalog UI, you'll find a "Connections" or "Connections Management" section, which is the designated area for managing all your data source connections. Here, you will **add a new connection for the Mia-Platform CRUD Service**. When initiating this process, you'll select "Mia-Platform MongoDB CRUD Service" as the connection type from the comprehensive list of supported Systems of Record.  

![](./../img/data-catalog-connection-3.png)

To connect the Data Catalog with your Mia-Platform CRUD Service, you will need to provide specific configuration details. First, establish a unique name for this particular connection. Next, you must specify the base URL or endpoint of the CRUD Service. This URL can also be taken from a secret name defined within the `secret.json` config map of the Job Runner service.

In addition to the connection details, you will need to identify the Fast Data Project you wish to import data from by providing its Company ID, Project ID, and Environment. To enable this, you must ensure that the Fabric BFF has console communication enabled and is properly configured with a service account, as described in the [relevant documentation page](/data_catalog/data_catalog_fabric_bff.mdx#console-communication).

![](./../img/data-catalog-connection-4.png)

Finally, the process involves **Scheduling Metadata Scraping**. After the connection is configured and saved, the Data Catalog Job Runner takes on the responsibility of scraping the metadata from the specified CRUD Service. This is typically executed by an "Agent Dataset Scan" task. This task connects to the CRUD service, meticulously inspects the exposed collections and their associated schemas (including fields, data types, etc.), and then imports this rich metadata into the Data Catalog. As a result, the scraped collections will manifest as datasets within the Data Catalog, readily available for discovery, enrichment, and incorporation into lineage mapping.

![](./../img/data-catalog-connection-5.png)

Beyond cataloging data at rest, it is profoundly important to understand the journey of data—how it is processed and transformed. The Mia-Platform Data Catalog achieves this by integrating with Fast Data to import information about data processing pipelines, representing them as "Lineage Jobs" within the catalog . This provides invaluable visibility into your intricate data flows.

The mechanics of this integration generally involve a few key stages. Firstly, you must **ensure the Data Catalog Job Runner is operational**, as this component is central to automating tasks within the Data Catalog, including the crucial synchronization of lineage information. Then, you will need to **Configure and Schedule a [Fast Data Sync](/data_catalog/data_catalog_job_runner.mdx#fast-data-jobs-sync) Task**. Within the Data Catalog's Job Runner configuration—a task typically managed via the Mia-Platform Console or through specific configuration files for the Job Runner—a dedicated task for Fast Data integration must be established. This is often referred to as a "Fast Data Sync" task . This task will be scheduled to run periodically, ensuring that the lineage information within the Data Catalog remains current and accurately reflects your Fast Data projects.  

This "Fast Data Sync" task is specifically designed for **connection to the Fast Data Control Plane**. The [Control Plane](/fast_data/runtime_management/control_plane.mdx) is the component that manages the configurations and definitions of your Fast Data pipelines and aggregation projects. During its execution, the sync task performs the **Retrieval of Pipeline Definitions** by querying the Fast Data Control Plane to gather information about the configured data processing pipelines, including any aggregations and transformations defined within your Fast Data Projects.

To launch the Fast Data Jobs Sync procedure you have to manually invoke the gRPC method. Data Catalog Application is shipped with an already pre-configured `grpcui`, that is exposed under proper permissions as part of the [Secure Access microfrontend](/data_catalog/secure_access.mdx#microfrontend-composer).

From there, you can pick the **JobRunner** service, choose the **Run** method and then pick the `openLineageFastDataJobSync` option as request. You need also to specify the name of the **producer** as a string parameter: this information will be displayed in the [Data Catalog UI Job Details section](/data_catalog/frontend/data_lineage.mdx#job-details).

![](./../img/data-catalog-connection-6.png)

The final step is the **registration as lineage jobs**. The retrieved Fast Data pipeline definitions are then intelligently translated and registered within the Data Catalog as "Lineage Jobs" . These Lineage Jobs effectively represent the processing steps and transformations that occur within your Fast Data environment. Consequently, these imported Fast Data jobs become visible on the Data Lineage canvas in the Data Catalog UI, allowing users to clearly see how data flows through these processing stages and how they connect to various data assets .

By meticulously configuring these connections, you can fully leverage the Data Catalog not only to inventory data exposed by CRUD services (which may indeed include Fast Data outputs) but also to visualize and deeply understand the Fast Data processing pipelines themselves. This synergy provides a far more holistic and comprehensive view of your data's entire lifecycle.

## Metadata Scraping and Enrichment

Once data assets have been imported metadata is imported into the Mia-Platform Data Catalog after establishing a connection to a datasource, the assets are organized in a structured manner to facilitate discovery and understanding. This organization, coupled with robust metadata enrichment capabilities, transforms the catalog from a simple inventory into a powerful tool for centralized data governance and collaboration.

The Data Catalog typically organizes imported metadata hierarchically, reflecting the structure of the source systems. This generally includes:  

- **Systems of Record (SoR)**: The highest level, representing the originating data systems themselves (e.g., a specific PostgreSQL database, a Salesforce instance). The SoR is mapped with a 1:1 relationship with the connection you created, so the SoR name is equal to the connection name.
- **Tables/Datasets/Collections**: Within each SoR, assets are further organized into logical groupings like database tables, datasets, or collections (in the case of NoSQL databases like MongoDB). These represent distinct sets of related data.  
- **Columns/Fields/Attributes**: The most granular level, detailing the individual columns within a table, fields in a document, or attributes of a data entity. This includes information about data types, and potentially other technical metadata scraped from the source.  

Users can navigate this hierarchical structure primarily through the **Asset Discovery** section of the Data Catalog UI. This interface allows users to browse and search for specific assets across different connected systems and the advanced search capability allows users to perform a granular discovery of the data assets.

While automated metadata scraping provides a foundational layer of technical information, its true value is unlocked through **metadata enrichment**. This is the process of enhancing the existing metadata with additional contextual, business-relevant information. The Mia-Platform Data Catalog provides full management capabilities through its UI.

Key aspects of metadata enrichment include:

- **Adding Descriptions**: Users can add detailed descriptions to SoRs, tables, and columns to explain their purpose, business context, origin, or how they are used. This is crucial for data understanding, especially for non-technical users.  
- **Assigning Tags**: Tags are keywords or labels that can be associated with assets for classification, categorization, or to improve searchability. For example, tags like "PII," "Sales Data," "GDPR Sensitive," or "Marketing Campaign Q3" can be applied.  
- **Defining Custom Properties**: The Data Catalog allows for the management of custom properties that can be assigned to assets. This enables organizations to capture specific metadata attributes relevant to their unique business needs or governance frameworks, which might not be covered by standard metadata (e.g., "Data Owner," "Refresh Frequency," "Quality Score").  
- **Establishing Data Classification**: Through enrichment, assets can be classified according to sensitivity levels (e.g., public, internal, confidential), which aids in policy management and access control.

Enriching metadata is vital for several reasons :  

- **Enhanced Data Discoverability**: Richer metadata makes it easier and faster for users like data analysts and scientists to find the exact data they need.  
- **Improved Data Understanding**: Contextual information helps all users, including business users and decision-makers, to better understand what the data represents and its relevance.  
- **Better Data Quality and Consistency**: Standardizing descriptions and definitions through enrichment reduces ambiguity and promotes more reliable data usage.  
- **Facilitating Compliance and Governance**: Documenting ownership, sensitivity, and regulatory relevance supports adherence to data protection laws (like GDPR) and internal policies.  
- **Enhanced Collaboration**: A shared understanding of data assets, fostered by detailed metadata, improves collaboration across teams.  

The Data Catalog is designed as a collaborative environment where various users, from data engineers to business analysts and data governance teams, can contribute to enriching the metadata, making it a more valuable and reliable resource for the entire organization. While specific UI elements within the Asset Discovery page provide the interfaces for viewing and editing this information, the core principle is to provide a comprehensive and user-friendly way to manage and augment the metadata associated with each cataloged asset and enhance the data quality.

## What is Data Lineage and How Does It Work?

[Data Lineage](/data_catalog/frontend/data_lineage.mdx) is the process of understanding, documenting, and visualizing data as it flows from its origin to its destination across various systems and transformations. It essentially provides a map of the data's journey, tracking the origin and flow of data through systems to help understand how data are transformed and used through various business processes. Data lineage seeks to answer critical questions such as: Where does this data come from? What changes or transformations has it undergone? And where is it ultimately used or stored?

The importance and benefits of implementing robust data lineage are manifold:

- **Impact Analysis**: It allows organizations to understand how changes in one part of a data pipeline—such as a modification to a source table or a transformation logic—might affect downstream systems, reports, or analytical models. This foresight is crucial for minimizing unintended consequences during development and maintenance.
- **Data Quality & Issue Resolution**: When data quality issues arise, lineage provides the means to trace errors back to their source, significantly speeding up root cause analysis and resolution.
- **Regulatory Compliance & Auditing**: Data lineage is essential for meeting the requirements of regulations like GDPR. It provides an auditable trail of data processing activities, demonstrating data provenance and handling. The ability to answer compliance-related queries, potentially aided by tools like an AI Compliance Assistant leveraging catalog metadata, underscores this value.
- **Trust and Confidence in Data**: By making data flows transparent and understandable, lineage builds trust among data consumers, assuring them of the data's reliability and history.
- **Simplifying Complex Systems**: In environments with intricate data architectures and numerous data flows, lineage provides clarity and helps to demystify complexity.
- **AI Implementation**: For Artificial Intelligence and Machine Learning initiatives, data lineage is critical. It helps ensure the quality and reliability of training data, enables informed feature engineering, and promotes model explainability and auditability.

Mia-Platform Data Catalog implements data lineage by leveraging several key mechanisms:

- **[Open Lineage Integration](/data_catalog/data_catalog_open_lineage.mdx)**: The Data Catalog adopts the Open Lineage standard, an open specification for collecting and structuring data assets lineage information data lineage. The [Open Lineage service](/data_catalog/data_catalog_open_lineage.mdx) is a core backend component responsible for managing assets (data entities) and lineage jobs (processes acting on these assets). This adoption of an open standard is a strategic choice that promotes interoperability with a broader ecosystem of data tools that also support OpenLineage, potentially avoiding vendor lock-in and allowing for more comprehensive lineage views in heterogeneous environments.
- **Job Runner for Lineage Jobs**: The Data Catalog's Job Runner can schedule specific tasks to collect lineage information. A prime example is the "Fast Data Sync" task, which retrieves pipeline definitions from Fast Data available projects. These Fast Data pipelines are then registered within the Data Catalog as "Lineage Jobs". This allows for the automatic capture of data processing logic occurring within Fast Data projects, making these jobs visible on the lineage canvas.
- **Assets and Lineage Jobs**: These entities, representing data elements and the processes that transform them, are managed by the Open Lineage service. This service provides the necessary APIs and features to retrieve this data for visualization and analysis within the Data Catalog frontend. Lineage relationships between assets conform to the OpenLineage `Job` format, where a `Job` represents a process occurring between two or more assets.

Data lineage within the Mia-Platform Data Catalog is therefore not just a static map but an active tool. It serves as a dynamic diagnostic and preventative maintenance utility for data pipelines, enabling operational resilience and supporting robust data governance. Its ability to integrate with processing engines like Fast Data and adhere to open standards positions it as a forward-looking solution for managing complex data ecosystems.

## Data Lineage: Visualization and Creation of Virtual Elements

Understanding data lineage involves not only collecting the information but also presenting it in a comprehensible manner and allowing for its enrichment to reflect the complete data journey.

The Mia-Platform Data Catalog provides a "Data Lineage section" within its UI, designed to help users understand, visualize, and describe the flow and transformations of data within an organization. Lineage is typically presented through "intuitive visual maps" or an "interactive representation of data movement" across systems. This Lineage view enables users to perform impact analyses, identify potential bottlenecks, and ensure compliance across data workflows. 

The visualization of data lineage is often offered at different levels of granularity to cater to diverse user needs and analytical purposes:

- **Table-Level Lineage**: This view tracks the movement of data elements specifically between tables, typically within a database or data warehouse context. It is particularly useful for data engineers and analysts who need to investigate data accuracy issues, understand the impact of schema changes, or trace the origins of data in specific reports. For instance, it can show which source tables contribute to a summary table.
- **System of Record (SoR) Lineage**: This provides a broader, more high-level overview of how different data sources and systems interact across the entire organization. SoR lineage is beneficial for enterprise data architects, data governance teams, and compliance officers who require a holistic view of data flows for strategic planning and monitoring.

These visualizations are designed to be interactive, allowing users to explore data relationships, dependencies, and the transformations applied to data as it moves through various processes. The provision of both table-level and SoR-level lineage demonstrates an understanding that different roles within an organization require varying degrees of detail: from the granular specifics needed by technical teams to the broader strategic overview required by governance bodies.

Automated data discovery and lineage capture are powerful, but they may not always capture the entirety of an organization's data landscape, especially where manual processes, legacy systems not directly connected, or conceptual data flows exist. To address this, Mia-Platform Data Catalog supports the creation of **virtual assets** (virtual assets and virtual jobs).

What are Virtual Assets/Jobs? Virtual elements are user-defined entities that can be manually added to the lineage graph. They represent data assets (like a manually maintained spreadsheet or an external data feed not directly integrated) or processes (like a manual approval step or a data transformation occurring in a non-instrumented system) that are not automatically discovered through standard connections. They are "virtual" in the sense that they might not correspond to a physical table or an automated job within a connected system but are nonetheless a logical and crucial part of the overall data flow. In data lineage, a common challenge is accounting for processes and assets that are not automatically discoverable by scanning systems. To address this, the Open Lineage service provides the capability to create and manage virtual elements, such as virtual assets and jobs. This functionality allows organizations to construct a complete and accurate representation of their data's journey, even when it involves manual steps or external processes. The creation, modification, and deletion of these virtual elements are managed through the Data Catalog UI. To do so, navigate to an asset within your data catalog, such as a System of Record (SoR) or a Table, and then select the "Lineage" tab.

![](./../img/data-catalog-lineage-1.png)

Here, after each block in the lineage flow, you will find a plus button. Click this button and use the “Create new table” option to add a virtual asset. Once the virtual table is created, you can associate it with an available SoR or create a new virtual one. Virtual jobs are automatically created in the process to connect the assets and can be enriched simply by adding a description.

![](./../img/data-catalog-lineage-2.png)

The primary value of virtual elements is their ability to enrich the automated lineage graph with human-curated information. This feature empowers users to formally document segments of the data flow that would otherwise remain as unrecorded "tribal knowledge."

By incorporating these user-defined elements, organizations can ensure the lineage graph provides a comprehensive, end-to-end view of how data moves across all systems and processes, thereby increasing the accuracy and trustworthiness of the entire lineage record.

The inclusion of virtual elements is a significant feature, acknowledging that automated discovery has its limitations. It allows human expertise and contextual understanding to be formally integrated into the data lineage map. This transforms the lineage from being merely a reflection of connected, automated systems into a comprehensive, curated depiction of data flows, which is indispensable for achieving true end-to-end visibility in complex enterprise environments.

## Conclusion

The Mia-Platform Data Catalog emerges as a pivotal tool for organizations aiming to harness the full potential of their data assets. This tutorial has navigated through its core functionalities, from understanding its fundamental purpose as a centralized metadata repository to exploring its advanced capabilities in data lineage.

The journey covered the initial setup and configuration within the Mia-Platform Console, the process of establishing connections to diverse data sources like OracleDB and Mia-Platform Fast Data, and the critical role of metadata scraping in populating the catalog. A significant focus was placed on data lineage: its definition, operational mechanics, visualization at different levels (Table-level and SoR-level), and the innovative use of virtual elements to capture a complete and accurate data story.

For further in-depth information, specific use-case implementations, and advanced configuration options, users are encouraged to consult the [official documentation](/data_catalog/overview.mdx). This continued exploration will ensure that organizations can maximize the strategic benefits offered by this comprehensive data management solution.

