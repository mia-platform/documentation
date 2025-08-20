---
id: mia-platform-data-catalog-faqs
title: Mia-Platform Data Catalog FAQs
sidebar_label: Data Catalog FAQs
---

### Core Concepts & Architecture

#### What is the Mia-Platform Data Catalog?
The Mia-Platform Data Catalog is a centralized solution for discovering, understanding, and governing all the data assets within your organization. It acts as a single source of truth for your data, allowing users to easily find relevant datasets, view their metadata, understand their quality, and trace their lineage. It is a key component for building a data-driven culture and improving the **developer experience (DevEx)** for anyone working with data.
[Discover more](/data_catalog/overview.mdx)

#### Why is a Data Catalog important for an organization?
A Data Catalog solves several critical problems:
* **Discoverability**: It makes it easy for users (analysts, data scientists, developers) to find the data they need, reducing wasted time.
* **Trust**: By providing metadata, quality scores, and lineage, it helps users trust the data they are using.
* **Governance**: It provides a framework for managing data access, enforcing policies, and ensuring compliance (e.g., GDPR).
* **Collaboration**: It creates a shared understanding of data across different teams and departments.
  In essence, it's a foundational tool for any modern data strategy, often managed by **platform engineers** as part of an **internal developer platform**.
  [Discover more](/data_catalog/overview.mdx)

#### What are the main components of the Mia-Platform Data Catalog solution?
The solution is built on a **service oriented architecture** and consists of several key microservices:
* **Data Catalog Application**: The user-facing frontend where users browse and interact with the catalog.
* **Data Catalog Fabric BFF**: The Backend-for-Frontend that serves the frontend application.
* **Data Catalog Job Runner**: A service that runs jobs to ingest metadata from various data sources and populate the catalog.
* **Data Catalog Open Lineage**: A service that collects and processes data lineage information based on the OpenLineage standard.
* **Fabric Admin**: A utility service used for the initial setup and migration of the catalog's database.
  [Discover more](/data_catalog/overview.mdx)

#### What is a "Data Asset" in the catalog?
A **Data Asset** is the fundamental entity in the Data Catalog. It represents a specific data resource, such as a database table, a view, a Kafka topic, or a file in a data lake like **aws s3**. Each asset in the catalog is enriched with metadata, including its schema, description, owner, tags, and quality information.
[Discover more](/data_catalog/frontend/overview.mdx)

#### What is the difference between a "System" and a "Data Product"?
* A **System** represents a physical data source, such as a specific PostgreSQL database, a MongoDB cluster, or a Kafka cluster. It's the container of the technical data assets.
* A **Data Product** is a logical, business-oriented grouping of data assets. It represents a curated dataset designed to serve a specific business purpose or domain. For example, a "Customer 360" Data Product might include assets from different systems (CRM, e-commerce, support tickets) to provide a complete view of a customer.
  [Discover more](/data_catalog/frontend/data_catalog_assets.mdx)

#### What is Data Lineage?
**Data Lineage** provides a visual representation of how data flows and transforms through your systems. It shows the origin of a data asset, what transformations it undergoes, and where it is used. This is crucial for understanding data dependencies, performing impact analysis, and debugging data pipelines.
[Discover more](/data_catalog/frontend/data_lineage.mdx)

#### What is OpenLineage and how does the Data Catalog use it?
**OpenLineage** is an open standard for collecting and analyzing data lineage information. The Mia-Platform Data Catalog adopts this standard by providing a dedicated service that can receive lineage events from any compatible data processing framework (like Spark, dbt, or Airflow). This allows for automated, real-time lineage tracking as your data pipelines execute.
[Discover more](/data_catalog/data_catalog_open_lineage.mdx)

#### How does the Data Catalog integrate with Mia-Platform Fast Data?
The Data Catalog is designed to work seamlessly with [Mia-Platform Fast Data](/fast_data/what_is_fast_data.md). The **Job Runner** can automatically ingest metadata about Fast Data Projections and Single Views, making them discoverable assets in the catalog. Furthermore, the lineage of how a Single View is created from different Projections can be visualized, providing a clear picture of the data aggregation process.
[Discover more](/data_catalog/overview.mdx)

#### Is the Data Catalog a multi-tenant solution?
Yes, the Data Catalog is designed to be multi-tenant. All data is stored with a unique `tenantId`, ensuring that data from different tenants (e.g., different business units or environments) is logically separated and secure within the same database instance.
[Discover more](/data_catalog/database_setup.mdx)

#### What are the main infrastructure requirements for running the Data Catalog?
The Data Catalog services are containerized and run on Kubernetes. The main external dependencies are:
* **MongoDB** (version >= 5.0) for storing all the catalog's metadata.
* **Redis** (version >= 7.0) used by the Open Lineage service for caching and processing.
  You should always check the official **Compatibility Matrix** for the most up-to-date version requirements.
  [Discover more](/data_catalog/compatibility_matrix.md)

### Frontend Application & Features

#### What can I do on the Data Catalog homepage?
The homepage serves as the main entry point for data discovery. It features a prominent search bar, lists of recently updated assets, popular data products, and saved searches. From here, you can start browsing the catalog or jump directly to assets you've recently worked with.
[Discover more](/data_catalog/frontend/overview.mdx)

#### How does the search functionality work?
The Data Catalog provides a powerful free-text search that looks for matches in asset names, descriptions, column names, and tags. You can also use advanced filtering to narrow down your search based on specific criteria like the asset type, system, tags, or the data product it belongs to.
[Discover more](/data_catalog/frontend/data_catalog_assets.mdx)

#### What information is available on a Data Asset's detail page?
The detail page for a data asset provides a comprehensive overview, including:
* **General Info**: Name, description, owner, and associated tags.
* **Schema**: A list of all columns/fields with their data types and descriptions.
* **Lineage**: A visual graph showing the upstream and downstream dependencies of the asset.
* **Quality**: Data quality metrics and scores.
* **Sample Data**: A preview of the first few rows of data (if configured).
* **Documentation**: Rich text documentation associated with the asset.
  [Discover more](/data_catalog/frontend/data_catalog_assets.mdx)

#### Can I customize the layout of the Data Asset detail page?
Yes, the page is highly customizable. You can configure which tabs are visible, their order, and even add custom tabs that display information from external systems. This allows you to tailor the user experience to the specific needs of your organization.
[Discover more](/data_catalog/frontend/data_catalog_assets.mdx)

#### How can I add custom actions to a Data Asset?
You can configure **custom actions**, which appear as buttons on the asset detail page. These actions can trigger external workflows by navigating the user to a specific URL, which can be dynamically constructed using placeholders for the asset's properties (e.g., navigating to a BI tool dashboard filtered for the selected table).
[Discover more](/data_catalog/frontend/data_catalog_assets.mdx)

#### What is the Business Glossary?
The **Business Glossary** is a centralized repository of business terms and their definitions. It helps to establish a common vocabulary across the organization. You can link glossary terms to data assets, providing business context and making it easier for non-technical users to understand the data.
[Discover more](/data_catalog/frontend/overview.mdx)

#### How can I visualize the lineage of a Data Asset?
On the asset's detail page, the **Lineage** tab displays an interactive graph. You can see the direct upstream sources that produce the asset and the downstream consumers that use it. You can expand the graph node by node to explore the full end-to-end flow of the data across multiple systems.
[Discover more](/data_catalog/frontend/data_lineage.mdx)

#### Can I see column-level lineage?
Yes, the Data Catalog supports column-level lineage. When you view the lineage graph, you can see not only that `Table B` is derived from `Table A`, but also that `Column Y` in `Table B` is calculated using `Column X` from `Table A`. This provides a much more granular understanding of data transformations.
[Discover more](/data_catalog/frontend/data_lineage.mdx)

#### How do I add or edit metadata, like descriptions and tags?
If you have the appropriate permissions, you can edit metadata directly from the Data Catalog's user interface. On an asset's detail page, you will see "edit" icons next to fields like the description or the list of tags, allowing you to easily curate and enrich the information.
[Discover more](/data_catalog/frontend/data_catalog_assets.mdx)

### Data Ingestion & Population

#### How does data get into the Data Catalog?
Metadata is ingested into the catalog using the **Data Catalog Job Runner**. This service executes jobs that connect to your data sources (like PostgreSQL, MySQL, MongoDB), extract metadata about the assets they contain (tables, collections, views), and then write this information into the catalog's database.
[Discover more](/data_catalog/data_catalog_job_runner.mdx)

#### What is the Integration Connector Agent?
The **Integration Connector Agent** is a versatile tool used by the Job Runner to connect to various data sources. It's built with a plugin-based architecture. You configure it with different "processors" to handle different types of sources. For example, there are built-in processors for cloud vendors like **AWS**, Azure, and GCP, as well as for databases.
[Discover more](/runtime_suite/integration-connector-agent/10_overview.md)

#### Can I ingest metadata from a source that is not supported out-of-the-box?
Yes. The Integration Connector Agent is extensible. You can build a custom processor to connect to any data source that has an API or a JDBC/ODBC driver. These custom processors are typically written in the **Go programming language** using a provided template, and then plugged into the agent.
[Discover more](/runtime_suite/integration-connector-agent/10_overview.md#custom-processors)

#### How do I configure a job in the Job Runner?
Jobs are configured as Kubernetes CronJobs. In the CronJob's manifest, you define the schedule and the configuration for the Integration Connector Agent. This configuration, passed as a ConfigMap, specifies which processors to run and provides the connection details (e.g., database host, port, credentials) for the target data source.
[Discover more](/data_catalog/data_catalog_job_runner.mdx)

#### How are credentials for data sources managed securely?
You should never hardcode credentials in the Job Runner's configuration. Instead, you should store them as Kubernetes secrets and mount them into the Job Runner's pod. The job configuration can then reference these secrets to securely connect to the data sources. This aligns with **DevOps** security best practices.
[Discover more](/data_catalog/data_catalog_job_runner.mdx#job-runner-configuration)

#### How is lineage information ingested?
Lineage data is ingested via the **Data Catalog Open Lineage** service. This service exposes an API endpoint that conforms to the OpenLineage specification. Data processing tools (like Spark, Airflow, dbt) can be configured to send lineage events to this endpoint as their jobs run. The service then processes these events and stores the lineage graph in the catalog's database.
[Discover more](/data_catalog/data_catalog_open_lineage.mdx)

#### Can I ingest lineage from a tool that doesn't support OpenLineage?
Yes. While OpenLineage is the recommended approach for automated lineage, you can also ingest lineage manually by making direct API calls to the Data Catalog's backend services. This allows you to integrate with legacy systems or custom data processing applications.
[Discover more](/data_catalog/data_catalog_open_lineage.mdx)

### Setup & Configuration

#### What are the main steps to set up the Data Catalog for the first time?
1.  **Prepare the Database**: Set up a dedicated MongoDB database for the catalog.
2.  **Run Fabric Admin**: Use the **Fabric Admin** service to initialize the database schemas and collections.
3.  **Deploy Core Services**: Deploy the Data Catalog Application, Fabric BFF, Job Runner, and Open Lineage services to your Kubernetes cluster.
4.  **Configure Services**: Provide the necessary environment variables and configuration files for each service (e.g., database connection strings).
5.  **Configure Ingestion Jobs**: Create and schedule the CronJobs for the Job Runner to start populating the catalog.
[Discover more](/data_catalog/database_setup.mdx)

#### What is the role of the Fabric Admin service?
The **Fabric Admin** service is a command-line utility used for managing the lifecycle of the Data Catalog's database. Its primary use is during the initial setup to create all the necessary MongoDB collections and indexes. It is also used for performing database migrations when upgrading to a new version of the Data Catalog.
[Discover more](/data_catalog/database_setup.mdx)

#### What is the Data Catalog Fabric BFF?
The **Data Catalog Fabric BFF** is a Backend-for-Frontend service. It acts as an intermediary between the frontend application and the various backend data stores and services. It exposes a set of APIs tailored specifically for the needs of the UI, simplifying the frontend's logic and improving performance.
[Discover more](/data_catalog/data_catalog_fabric_bff.mdx)

#### How do I configure the Fabric BFF?
The Fabric BFF is configured via a main configuration file and several other files mounted as a ConfigMap. In these files, you can define:
* The structure of the main menu.
* The tabs and cards to be displayed on the asset detail pages.
* Custom actions and integrations.
* Feature flags to enable or disable specific functionalities.
[Discover more](/data_catalog/data_catalog_fabric_bff.mdx)

#### How do I check if my environment is compatible with the Data Catalog?
The official documentation includes a **Compatibility Matrix**. This page lists the required versions for all dependencies, including Kubernetes, MongoDB, and Redis. It's crucial to check this matrix before installing or upgrading the Data Catalog to ensure all components will work together correctly.
[Discover more](/data_catalog/compatibility_matrix.md)

#### Can I deploy the Data Catalog on a public cloud like AWS or GCP?
Yes. Since the Data Catalog runs on Kubernetes, it can be deployed on any managed Kubernetes service, such as **Amazon EKS** (**aws cloud computing**) or **Google Kubernetes Engine** (GCP). You would also use managed database services like MongoDB Atlas or Amazon DocumentDB to host the catalog's data.
[Discover more](/data_catalog/compatibility_matrix.md)

### Security & Governance

#### How is access to the Data Catalog managed?
Access control is managed through a Role-Based Access Control (RBAC) system. Users are organized into groups, and permissions are assigned to these groups. This allows you to define who can view, edit, or manage different parts of the catalog.
[Discover more](/data_catalog/secure_access.mdx)

#### What are the default permission levels in the Data Catalog?
The Data Catalog defines several permission levels, such as:
* `catalog.reader`: Can view all public data assets.
* `catalog.writer`: Can edit metadata for data assets.
* `catalog.manager`: Can manage data products, systems, and user permissions.
  These permissions can be assigned to user groups to implement a granular access control policy.
  [Discover more](/data_catalog/secure_access.mdx#authorization-configuration)

#### Can I restrict access to a specific Data Product or System?
Yes. You can configure **access control policies** on individual Data Products or Systems. For example, you can specify that only members of the "Finance Team" group can view the assets within the "Financial Reporting" Data Product. This ensures that sensitive data is only visible to authorized users.
[Discover more](/data_catalog/secure_access.mdx)

#### How does the Data Catalog handle sensitive information like database credentials?
The Data Catalog itself does not store credentials for your data sources. Credentials should be managed securely using a dedicated **secrets manager** (like HashiCorp Vault, **aws secrets manager**, or **azure key vault**). The **Job Runner** is then configured to fetch the credentials from the secret manager at runtime when it needs to connect to a data source.
[Discover more](/data_catalog/data_catalog_job_runner.mdx#job-runner-configuration)

#### How can I track who made changes to a data asset's metadata?
While the Data Catalog doesn't provide a detailed audit log in the UI out-of-the-box, all changes made through the UI or APIs are associated with the authenticated user who performed the action. This information is available in the backend and can be used for auditing purposes if required.
[Discover more](/data_catalog/secure_access.mdx)

#### What is the "Public" flag on a data asset?
By default, data assets are considered "public" within the catalog, meaning anyone with `catalog.reader` permissions can see them. You can mark a Data Product or System as non-public. In this case, only users who are members of a group explicitly granted access will be able to see the assets it contains.
[Discover more](/data_catalog/secure_access.mdx)

### Troubleshooting & Best Practices

#### My ingestion job failed. How can I troubleshoot it?
1.  **Check the Job Runner logs**: The logs of the failed CronJob pod are the first place to look. They will usually contain detailed error messages about why the job failed (e.g., connection error, permission issue, invalid configuration).
2.  **Verify Credentials**: Ensure the credentials used by the job are correct and have the necessary permissions on the source database.
3.  **Check Network Connectivity**: Make sure the Job Runner's pod can reach the target data source over the network.
4.  **Validate Configuration**: Double-check the job's ConfigMap for any typos or misconfigurations.
[Discover more](/data_catalog/data_catalog_job_runner.mdx)

#### The lineage graph is not showing up for my data assets. What could be the problem?
* **No Lineage Events**: The most common reason is that no lineage events are being sent to the **Open Lineage** service. Ensure that your data processing tools (e.g., Airflow, Spark) are correctly configured with the OpenLineage integration.
* **Incorrect Job Names**: OpenLineage correlates events based on job and dataset names. Make sure the names used in your lineage events match the names of the assets in the Data Catalog.
* **Service Issues**: Check the logs of the Open Lineage service to see if it is receiving events and if there are any errors during processing.
[Discover more](/data_catalog/data_catalog_open_lineage.mdx)

#### How can I improve the quality of the information in my Data Catalog?
Data catalog curation is an ongoing process. Best practices include:
* **Establish Ownership**: Assign clear owners to every Data Product and System. Owners are responsible for ensuring the accuracy of the metadata.
* **Promote Collaboration**: Encourage all data users to contribute by adding descriptions, asking questions, and tagging assets.
* **Automate Ingestion**: Automate metadata and lineage ingestion as much as possible to keep the catalog up-to-date with minimal manual effort.
* **Use the Business Glossary**: Define and use a consistent set of business terms to provide context to your technical assets.
[Discover more](/data_catalog/overview.mdx)

#### What is the best way to organize assets in the catalog?
Using a combination of **Systems** and **Data Products** is the recommended approach.
* Use **Systems** to represent the physical reality of your data landscape.
* Use **Data Products** to create a business-friendly, logical view of your data that is independent of the underlying technology. This makes it much easier for business users to find and understand the data they need.
[Discover more](/data_catalog/frontend/data_catalog_assets.mdx)

#### How do I handle the initial population of the catalog for a large number of data sources?
For the initial bulk load, you can run the **Job Runner** jobs manually instead of waiting for their cron schedule. You may also need to temporarily increase the resources (CPU/memory) allocated to the Job Runner pods to handle the higher load. It's best to ingest sources one by one to make troubleshooting easier if any issues arise.
[Discover more](/data_catalog/data_catalog_job_runner.mdx)

#### How do I upgrade the Data Catalog to a new version?
Upgrading involves two main steps:
1.  **Upgrade Service Images**: Update the Docker image versions for all the Data Catalog services (BFF, Job Runner, etc.) in your Kubernetes deployment manifests.
2.  **Run Database Migrations**: Before starting the new service versions, run the **Fabric Admin** service with the `migrate` command. This will apply any necessary schema changes to the MongoDB database to make it compatible with the new version. Always check the release notes for any version-specific instructions.
[Discover more](/data_catalog/database_setup.mdx)
