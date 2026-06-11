---
id: mia-platform-data-catalog-faqs
title: Mia-Platform Data Catalog FAQs
sidebar_label: Data Catalog FAQs
---

### Core Concepts & Architecture

#### What is the Mia-Platform Data Catalog?
The Mia-Platform Data Catalog is a centralized solution for discovering, understanding, and governing all the data assets within your organization. It acts as a single source of truth for your data, allowing users to easily find relevant datasets, view their metadata, understand their quality, and trace their lineage. It is a key component for building a data-driven culture and improving the **developer experience (DevEx)** for anyone working with data.
[Discover more](/products/data_catalog/overview.mdx)

#### Why is a Data Catalog important for an organization?
A Data Catalog solves several critical problems:
* **Discoverability**: It makes it easy for users (analysts, data scientists, developers) to find the data they need, reducing wasted time.
* **Trust**: By providing metadata, quality scores, and lineage, it helps users trust the data they are using.
* **Governance**: It provides a framework for managing data access, enforcing policies, and ensuring compliance (e.g., GDPR).
* **Collaboration**: It creates a shared understanding of data across different teams and departments.
  In essence, it's a foundational tool for any modern data strategy, often managed by **platform engineers** as part of an **internal developer platform**.
  [Discover more](/products/data_catalog/overview.mdx)

#### What are the main components of the Mia-Platform Data Catalog solution?
The Data Catalog Application consists of several key microservices:
* **Data Catalog Application**: The user-facing frontend where users browse and interact with the catalog.
* **Data Catalog Fabric BFF**: The Backend-for-Frontend that serves the frontend application.
* **Data Catalog Job Runner**: A service that runs jobs to ingest metadata from various data sources and populate the catalog.
* **Data Catalog Open Lineage**: A service that collects and processes data lineage information based on the OpenLineage standard.
* **Fabric Admin**: A utility service used for the initial setup and migration of the catalog's database.
  [Discover more](/products/data_catalog/overview.mdx)

#### What is a "Data Asset" in the catalog?
A **Data Asset** is the fundamental entity in the Data Catalog. It represents a specific data resource, such as a system of record, a table of a database, or a column of a table. Each asset in the catalog is enriched with metadata, including its schema, description, owner, tags, and quality information.
[Discover more](/products/data_catalog/frontend/overview.mdx)

#### What is Data Lineage?
**Data Lineage** provides a visual representation of how data flows and transforms through your systems. It shows the origin of a data asset, what transformations it undergoes, and where it is used. This is crucial for understanding data dependencies, performing impact analysis, and debugging data pipelines.
[Discover more](/products/data_catalog/frontend/data_lineage.mdx)

#### What is OpenLineage and how does the Data Catalog use it?
**OpenLineage** is an open standard for lineage data collection that the Data Catalog adopts as its foundation. The catalog stores data assets using an extended version of the OpenLineage Dataset format. This choice enables future integrations with other lineage systems and tools that support this standard, fostering easier data products exchange and discovery across different systems.
[Discover more](/products/data_catalog/data_catalog_open_lineage.mdx)

#### How does the Data Catalog integrate with Mia-Platform Fast Data?
The Data Catalog is designed to work seamlessly with [Mia-Platform Fast Data](/products/fast_data/what_is_fast_data.md). In fact, it is possible to retrieve metadata about the Fast Data aggregation processes, to automatically create the lineage that involves Fast Data Projections and Single Views.
[Discover more](/products/data_catalog/data_catalog_job_runner.mdx#fast-data-jobs-sync)

#### What are the main infrastructure requirements for running the Data Catalog?
The Data Catalog services are containerized and run on Kubernetes. The main external dependencies are:
* **MongoDB** (version >= 5.0) for storing all the catalog's metadata.
* **Redis** (version >= 7.0) used by the Open Lineage service for caching and processing.
  You should always check the official **Compatibility Matrix** for the most up-to-date version requirements.
  [Discover more](/products/data_catalog/compatibility_matrix.md)

### Frontend Application & Features

#### What can I do on the Data Catalog homepage?
The homepage serves as the main entry point for data discovery. It features a prominent search bar and lists of last viewed assets. From here, you can start browsing the catalog or jump directly to assets you've recently visited.
[Discover more](/products/data_catalog/frontend/overview.mdx)

#### How does the search functionality work?
The Data Catalog provides a powerful free-text search that looks for matches in asset names, descriptions, column names, and tags. You can also use advanced filtering to narrow down your search based on specific criteria like the asset type, tags, or other custom properties.
[Discover more](/products/data_catalog/frontend/data_catalog_assets.mdx)

#### What information is available on a Data Asset's detail page?
The information available depends on the type of data asset:

For System of Records (SoR):
- **General Info**: Name, provider info, number of contained tables, tags, description, and custom properties
- **Tables List**: Overview of all tables within the SoR
- **Lineage**: High-level lineage showing relationships with other SoRs

For Tables:
- **General Info**: Namespace, number of columns, tags, description, and custom properties
- **Columns**: Detailed list of all columns with their properties
- **Lineage**: Table-level lineage showing relationships with other tables

For Columns:
- **Details**: Namespace, tags, description, and other technical metadata
- **Custom Properties**: Additional metadata fields for enrichment
  [Discover more](/products/data_catalog/frontend/data_catalog_assets.mdx)

#### Can I customize the layout of the Data Asset detail page?
No, each detail page owns a predetermined structure that depends on the type of the asset. For more information about each data asset detail page, read the answer previous answer.
[Discover more](/products/data_catalog/frontend/data_catalog_assets.mdx)

#### How can I visualize the lineage of a Data Asset?
On the asset's detail page, the **Lineage** tab displays the lineage canvas. You can see the direct upstream sources that produce the asset and the downstream consumers that use it. You can expand the graph node by node to explore the full end-to-end flow of the data across multiple systems.
[Discover more](/products/data_catalog/frontend/data_lineage.mdx)

#### How do I add or edit metadata, like descriptions and tags?
If you have the appropriate permissions, you can edit metadata directly from the Data Catalog user interface. On an asset detail page, you will see proper buttons for adding and editing description and tags, allowing you to easily curate and enrich the information.
[Discover more](/products/data_catalog/frontend/data_catalog_assets.mdx)

### Data Ingestion & Population

#### How does data get into the Data Catalog?
For users that have enough permissions, inside the Data Catalog UI there is the [Connections section](/products/data_catalog/frontend/data_catalog_connections.mdx), useful to create and manage connections towards System of Records in order to import Data Assets from each specific setup connection.
In particular, metadata is ingested into the catalog using the **Data Catalog Job Runner**. This service executes jobs that connect to your data sources (like PostgreSQL, MySQL, MongoDB), extract metadata about the assets they contain (tables, collections, views), and then write this information into the catalog's database.
[Discover more](/products/data_catalog/data_catalog_job_runner.mdx)

#### How is lineage information ingested?
In case you have Fast-Data Projects adopting our [Mia-Platform Fast Data runtime solution](/products/fast_data/runtime_management/overview.mdx), it is possible to automatically retrieve the Data Lineage information regarding all the aggregation processes configured in order to populate and expose your Fast Data Single Views.  
Alternatively, the Lineage canvas inside Data Catalog allows users to create [virtual jobs](/products/data_catalog/frontend/data_lineage.mdx#jobs-real-and-virtual). These jobs allow users to model planned transformations or describe physically relationships still not retrived inside Data Catalog. Each Virtual Job includes the job producer and an editable description field where users can document about some relevant information such as the type of implemented process (e.g. ETL, filtering, replica, aggregation, other), the purpose or expected behavior.
[Discover more](/products/data_catalog/data_catalog_job_runner.mdx#fast-data-jobs-sync)

### Setup & Configuration

#### What are the main steps to set up the Data Catalog for the first time?
1.  **Prepare the Database**: Set up a dedicated MongoDB database for the catalog.
2.  **Run Fabric Admin**: Use the **Fabric Admin** service to initialize the database schemas and collections.
3.  **Deploy Core Services**: Deploy the Data Catalog Application, Fabric BFF, Job Runner, and Open Lineage services to your Kubernetes cluster.
4.  **Configure Services**: Provide the necessary environment variables and configuration files for each service (e.g., database connection strings).
5.  **Configure Connections**: Setup connections to external System of Records and trigger the scan&sync jobs to retrieve data assets from that specific connections.
[Discover more](/products/data_catalog/overview.mdx#setup-mia-platform-data-catalog)

#### What is the role of the Fabric Admin service?
The **Fabric Admin** service is a command-line utility used for managing the lifecycle of the Data Catalog's database. Its primary use is during the initial setup to create all the necessary MongoDB collections and indexes. It is also used for performing database migrations when upgrading to a new version of the Data Catalog.
[Discover more](/products/data_catalog/database_setup.mdx)

#### What is the Data Catalog Fabric BFF?
The **Data Catalog Fabric BFF** is a Backend-for-Frontend service. It acts as an intermediary between the frontend application and the various backend data stores and services. It exposes a set of APIs tailored specifically for the needs of the UI, simplifying the frontend's logic and improving performance.
[Discover more](/products/data_catalog/data_catalog_fabric_bff.mdx)

#### How do I check if my environment is compatible with the Data Catalog?
The official documentation includes a **Compatibility Matrix**. This page lists the required versions for all dependencies, including Kubernetes, MongoDB, and Redis. It's crucial to check this matrix before installing or upgrading the Data Catalog to ensure all components will work together correctly.
[Discover more](/products/data_catalog/compatibility_matrix.md)

#### Can I deploy the Data Catalog on a public cloud like AWS or GCP?
Yes. Since the Data Catalog runs on Kubernetes, it can be deployed on any managed Kubernetes service, such as **Amazon EKS** (**aws cloud computing**) or **Google Kubernetes Engine** (GCP). You would also use managed database services like MongoDB Atlas to host the catalog's data resources.
[Discover more](/products/data_catalog/compatibility_matrix.md)

### Security & Governance

#### How is access to the Data Catalog managed?
Access control is managed through a Role-Based Access Control (RBAC) system. Users are organized into groups, and permissions are assigned to these groups. This allows you to define who can view, edit, or manage different parts of the catalog.
[Discover more](/products/data_catalog/secure_access.mdx)

#### What are the default permission levels in the Data Catalog?
The Data Catalog defines several permission levels, such as:
* `admin:connections`: Allow users to manage Data Catalog connections
* `read:data-assets`: Allow visualizing Data Catalog records and their metadata
* `update:metadata-assets`: Enable editing metadata associated to Data Catalog records
* `update:bulk-action`: Allow users to perform bulk operations over multiple records
* `update:lineage`: Allow users to update lineage information of assets
* `admin:producers`: Enable triggering of jobs that can update the Data Catalog state
* `read:users`: Enable read-only access to user management
* `update:users`: Enable editing of user details in user management
  These permissions can be assigned to user groups to implement a granular access control policy.
  [Discover more](/products/data_catalog/secure_access.mdx#authorization-configuration)

### Troubleshooting & Best Practices

#### My ingestion job failed. How can I troubleshoot it?
1.  **Check the Job Runner logs**: The logs of the failed job are the first place to look. They will usually contain detailed error messages about why the job failed (e.g., connection error, permission issue, invalid configuration).
2.  **Verify Credentials**: Ensure the credentials used by the job are correct and have the necessary permissions on the source database.
3.  **Check Network Connectivity**: Make sure the Job Runner's pod can reach the target data source over the network.
4.  **Validate Configuration**: Double-check the job's ConfigMap for any typos or misconfigurations.
[Discover more](/products/data_catalog/data_catalog_job_runner.mdx)

#### How can I improve the quality of the information in my Data Catalog?
Data catalog curation is an ongoing process. Some suggestions and best practices include:
* **Establish Ownership**: Assign clear owners to every System of Records and its data assets. Data owners are responsible for ensuring the accuracy of the metadata.
* **Promote Collaboration**: Encourage all data users to contribute by adding descriptions, asking questions, and tagging assets.
* **Automate Ingestion**: Automate metadata and lineage ingestion as much as possible to keep the catalog up-to-date with minimal manual effort.
* **Use the Custom properties**: Define a set of custom properties to be applied to your data asset for metadata enrichment, in order to enhance the overall quality and auditability of your data landscape.
[Discover more](/products/data_catalog/overview.mdx)

#### How do I handle the initial population of the catalog for a large number of data sources?
From the Connection tab, start creating all the necessary connections from which you want to retrieve the data assets. Then, start triggering the Data Catalog Sync Job to import data assets from each of connection on after the other.
[Discover more](/products/data_catalog/frontend/data_catalog_connections.mdx)

#### How do I upgrade the Data Catalog to a new version?
Update the versions for all the Data Catalog services (Open Lineage, Job Runner, etc.) by following the [Compatibility matrix](/products/data_catalog/compatibility_matrix.md) of the Data Catalog Application, that keep up-to-date the Service Latest Versions list.
Moreover, follow what reported on the Migration Guides available on the detail pages of the Data Catalog Application in order to correctly handle some requested migrations.
[Discover more](/products/data_catalog/compatibility_matrix.md)
