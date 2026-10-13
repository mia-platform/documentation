---
id: mia-platform-fast-data-faqs
title: Mia-Platform Fast Data FAQs
sidebar_label: Fast Data FAQs
---

### Core Concepts

#### What is Mia-Platform Fast Data?
Mia-Platform Fast Data is a solution designed to build a **Digital Integration Hub**. It allows you to collect data from various sources, known as **Systems of Record (SoR)**, and aggregate it in near real-time. The core idea is to create read-optimized, pre-aggregated data models called **Single Views** that serve your applications with low latency. This approach helps to offload legacy systems and ensures that data is always available and consistent, forming a key part of a modern **service oriented architecture**.
[Discover more](/products/fast_data/what_is_fast_data.md)

#### What is a System of Record (SoR)?
A System of Record (SoR) is the authoritative data source for a specific piece of information. In a Fast Data context, these are the original systems (like databases, CRMs, or legacy applications) from which data is ingested. Through a Change Data Capture (CDC) system, Fast Data can start processing incoming change events on SoRs and implements event-driven data pipelins.
[Discover more](/products/fast_data/concepts/the_basics.md#system-of-record-sor)

#### What is a Projection?
A **Projection** is a standardized representation of data from a single System of Record. It acts as an intermediary data model stored in MongoDB. It contains only the fields you are interested in, and the data is transformed into a consistent format using **Cast Functions**. For example, a `pr_customers` projection would hold standardized customer data ingested from a legacy CRM system.
[Discover more](/products/fast_data/concepts/the_basics.md#projection)

#### What is a Single View (SV)?
A **Single View** is a denormalized, pre-aggregated document that combines data from one or more Projections to create a Data Product. It is designed to provide a business-centric, 360-degree view of an entity (like a customer or a product) and is optimized for fast read operations. Single Views embody Data Product principles by being discoverable, addressable, trustworthy, and self-describing. For instance, an `sv_customer_orders` Single View could combine data from a `pr_customers` projection and a `pr_orders` projection to create a comprehensive customer Data Product.
[Discover more](/products/fast_data/concepts/the_basics.md#single-view-sv)

#### What is the difference between a Projection and a Single View?
The main difference lies in their scope and purpose. A **Projection** is a direct, cleaned-up, and standardized copy of data from *one* System of Record. Its goal is to create a consistent data layer. A **Single View**, on the other hand, is an *aggregation* of data from *one or more* Projections, designed to serve a specific business need and optimized for reading by applications and APIs.
[Discover more](/products/fast_data/concepts/the_basics.md)

#### What is the difference between a "Base Projection" and an "Initial Projection"?
* **Initial Projection**: This is the projection that is directly affected by an incoming message from the CDC. For example, if a change occurs in the `orders` table, the `pr_orders` projection is the Initial Projection.
* **Base Projection**: This is the main projection that has a one-to-one relationship with the Single View being created. It serves as the root of the aggregation. For a `sv_customer_profile` Single View, the Base Projection would likely be `pr_customers`.
[Discover more](/products/fast_data/concepts/glossary.mdx)

#### What is Change Data Capture (CDC)?
Change Data Capture (CDC) is a design pattern used to track changes in a data source and propagate those changes to other systems. In Fast Data, a CDC system (like Debezium) monitors the transaction logs of a System of Record and produces an event for every insert, update, or delete. These events are then published to a message broker like Kafka to be consumed by Fast Data.
[Discover more](/products/fast_data/concepts/the_basics.md#change-data-capture-cdc)

#### What are Strategies in Fast Data?
**Strategies** are the logic that determines which Single View(s) need to be updated in response to a change in a Projection. When a Projection document is updated, a strategy is executed to find the unique identifier(s) of the corresponding Single View(s). This tells the [Single View Creator](/products/fast_data/concepts/architecture.md#single-view-creator-svc) which document to re-aggregate. Strategies can be automatic (low-code) or custom JavaScript functions.
[Discover more](/products/fast_data/concepts/the_basics.md#strategies)

#### What is the purpose of a Cast Function?
A **Cast Function** is a JavaScript function used during data ingestion to transform and standardize data from a System of Record before it is saved into a Projection. For example, you can use a cast function to convert a date string from a proprietary format into a standard ISO 8601 format, ensuring data consistency across all your Projections.
[Discover more](/products/fast_data/configuration/cast_functions.md)

#### What is a Digital Integration Hub and how does Fast Data help build one?
A Digital Integration Hub (DIH) is an architectural pattern that decouples data consumers (like APIs and applications) from data sources (Systems of Record) by creating a high-performance, real-time data layer. Mia-Platform Fast Data is a reference implementation of a DIH. It ingests data, creates real-time, aggregated Single Views, and exposes them via fast, scalable APIs, effectively offloading legacy systems and ensuring 24/7 data availability.
[Discover more](/products/fast_data/what_is_fast_data.md)

### Architecture & Services

#### What are the main microservices in a Fast Data architecture?
The core services are:
* **Real-Time Updater (RTU)** or **Projection Storer (PS)**: Ingests data from Kafka and updates Projections.
* **Single View Trigger Generator (SVTG)**: (Event-Driven Architecture only) Executes strategies to determine which Single Views to update.
* **Single View Creator (SVC)**: Performs the data aggregation and writes the final Single View document to MongoDB.
  
These services form a pipeline that transforms raw change events into ready-to-use aggregated data.
[Discover more](/products/fast_data/concepts/architecture.md)

#### What is the role of the Real-Time Updater (RTU)?
The **Real-Time Updater (RTU)** is a key service that consumes ingestion messages from Kafka, applies any configured **Cast Functions** to standardize the data, and then upserts the resulting document into the corresponding **Projection** collection in MongoDB. In the Standard Architecture, it is also responsible for executing strategies.
[Discover more](/products/fast_data/realtime_updater.md)

#### What is the role of the Projection Storer (PS)?
The **Projection Storer (PS)** is a more modern and streamlined alternative to the RTU, designed specifically for the Event-Driven Architecture. Its sole responsibility is to consume ingestion messages and update Projections. It then emits a `pr-update` event to notify downstream services (like the SVTG) that a projection has changed. It offers better performance and a simpler configuration experience than the RTU.
[Discover more](/products/fast_data/projection_storer.md)

#### What is the difference between the Real-Time Updater and the Projection Storer?
The main difference is their scope of responsibility. The **RTU** can be a service that handles both projection updates and strategy execution (in the Standard Architecture). The **Projection Storer** is a more focused service that *only* handles projection updates and is designed for the decoupled, event-driven flow, leaving strategy execution to the [Single View Trigger Generator](/products/fast_data/single_view_trigger_generator.md).
[Discover more](/products/fast_data/projection_storer.md#comparison-with-real-time-updater)

#### What is the Single View Trigger Generator (SVTG) and why would I use it?
The **Single View Trigger Generator (SVTG)** is a service used in the Event-Driven Architecture. It consumes `pr-update` events from the RTU/PS, executes the configured **Strategies** to identify which Single Views are affected by a specific change event, and then produces `sv-trigger` events. Using the SVTG decouples the ingestion logic from the business logic of strategies, leading to better scalability and easier management of data loading processes.
[Discover more](/products/fast_data/single_view_trigger_generator.md)

#### What is the role of the Single View Creator (SVC)?
The **Single View Creator (SVC)** is the service responsible for aggregating data to build the final Single View documents. It listens for triggers (either by polling the Projection Changes collection in MongoDB or by consuming `sv-trigger` events from Kafka) and, when triggered, executes the MongoDB aggregation pipeline defined in the `aggregation.json` file to create or update a Single View.
[Discover more](/products/fast_data/single_view_creator.md)

#### What is the difference between the Standard Architecture and the Event-Driven Architecture?
* **Standard Architecture**: A more monolithic flow where the [Real-Time Updater](/products/fast_data/realtime_updater.md) handles both projection updates and strategy execution, writing triggers (Projection Changes) directly to MongoDB. The [Single View Creator](/products/fast_data/single_view_creator.md) polls MongoDB in order to perform data aggregation.
* **Event-Driven Architecture**: A decoupled, fully event-based flow. The [Projection Storer](/products/fast_data/projection_storer.md) updates projections and emits an event. The [Single View Trigger Generator](/products/fast_data/single_view_trigger_generator.md) consumes this event, runs strategies, and emits another event. The [Single View Creator](/products/fast_data/single_view_creator.md) consumes this final event. This architecture is more scalable and resilient.
[Discover more](/products/fast_data/concepts/architecture.md)

#### When should I migrate from the Standard to the Event-Driven architecture?
You should consider migrating to the Event-Driven architecture if you experience performance bottlenecks with the Real-Time Updater, especially during high-volume data ingestion or complex strategy executions. The decoupled nature of the event-driven approach allows you to scale the ingestion and triggering components independently, improving overall throughput and reliability.
[Discover more](/products/fast_data/faq/architecture_migration.md)

#### How do Fast Data services communicate with each other?
Communication depends on the architecture:
* In the **Standard Architecture**, the RTU writes Projection Changes records to a MongoDB collection, and the SVC polls this collection.
* In the **Event-Driven Architecture**, communication is primarily through Kafka. The PS/RTU produces a `pr-update` message, the SVTG consumes it and produces an `sv-trigger` message, and the SVC consumes the `sv-trigger` message.
[Discover more](/products/fast_data/concepts/architecture.md)

#### How does Fast Data fit into a service oriented architecture?
Fast Data is a prime example of a **service oriented architecture** (SOA). It is composed of small, independent, and decoupled microservices (RTU, SVTG, SVC) that communicate through well-defined interfaces (Kafka topics or MongoDB collections). Each service has a single responsibility, which allows them to be developed, deployed, and scaled independently, promoting flexibility and resilience.
[Discover more](/products/fast_data/what_is_fast_data.md)

### Configuration (Low-Code/No-Code)

#### What is the ER Schema (`erSchema.json`) and what is it used for?
The **ER Schema** defines the relationships between your data assets. It's like a traditional Entity-Relationship diagram but in a declarative format. You define `outgoing` relationships from one collection to another and specify the `condition` (i.e., the fields to join on). This schema is crucial for both the automatic strategy generation and the aggregation process.
[Discover more](/products/fast_data/configuration/config_maps/erSchema.md)

#### How do I define a one-to-many relationship in the ER Schema?
To define a one-to-many relationship (e.g., one customer has many orders), you set the `oneToMany` property to `true` in the condition definition within the `erSchema.json` file. This tells the system that the join can result in multiple documents.
[Discover more](/products/fast_data/configuration/config_maps/erSchema.md#syntax-and-configuration-properties)

#### Why do I need to define relationships in both directions in the ER Schema?
You need to define relationships bidirectionally because they are used for two different purposes that traverse the relationship in opposite directions:
1.  **Aggregation (SVC)**: Traverses the relationship from the base projection outwards to gather data (e.g., from `pr_registry` to `pr_orders`).
2.  **Strategy Execution (RTU/SVTG)**: Traverses the relationship inwards from an updated projection to find the base projection (e.g., from `pr_orders` to `pr_registry`).
  [Discover more](/products/fast_data/configuration/config_maps/erSchema.md#direction-of-the-relationships)

#### What is the Aggregation configuration?
The `aggregation.json` is a declarative file that instructs the [Single View Creator](/products/fast_data/single_view_creator.md) on how to build a Single View. It specifies the `dependencies` (which Projections to fetch data from, based on the ER Schema) and the `mapping` (how to map fields from the source Projections to the fields of the target Single View).
[Discover more](/products/fast_data/configuration/config_maps/aggregation.md)

#### How do I map a field from a Projection to a Single View field in the aggregation?
In the `mapping` tab of your aggregation section, the page will now show the list of fields, as defined in the Single View Data Model page. You can even navigate in the nested structure of fields between fields of type `object` or `array of objects` to see the child fields and manage them as well.

Clicking on a field will open a drawer to the right side of the panel that allows you to map this field, by allowing the selection of an existing dependency and a field.
[Discover more](/products/fast_data/configuration/config_maps/aggregation.md#mapping)

#### How do I join data from multiple Projections in an aggregation?
You define multiple `dependencies` in your `aggregation.json`. Each dependency specifies a projection to fetch and the relationship to follow from the ER Schema (e.g., `"on": "registry_to_order"`). The SVC will then execute the necessary lookups to fetch documents from all specified projections, making them available for mapping into the Single View.
[Discover more](/products/fast_data/configuration/config_maps/aggregation.md#dependencies)

#### What is the Projection Changes Schema?
This file is used by the automatic strategy generation mechanism. It defines the `paths` that the strategy should follow through the ER Schema to get from any given **Initial Projection** back to the **Base Projection** of a Single View. This allows the system to automatically generate the correct identifier for the Single View that needs to be updated.
[Discover more](/products/fast_data/configuration/config_maps/projection_changes_schema.md)

#### How does the `__automatic__` strategy work in the Kafka Projection Updates configuration?
When you set `strategy` to `__automatic__` for a projection, you are telling the [RTU](/products/fast_data/realtime_updater.md) or [SVTG](/products/fast_data/single_view_trigger_generator.md) to use the Low-Code strategy engine. This engine will use the **ER Schema** and the **Projection Changes Schema** to automatically determine the correct Single View identifiers without requiring you to write any custom JavaScript code.
[Discover more](/products/fast_data/configuration/config_maps/kafka_projection_updates.mdx)

#### How can I write a custom manual strategy function?
If the automatic strategy is not sufficient, you can specify a JavaScript file using the `__fromFile__` keyword (e.g., `"strategy": "__fromFile__[myCustomStrategy.js]"`). This file must export an `async function*` (an async generator) that takes the projection update event as input and `yields` one or more Single View identifier objects.
[Discover more](/products/fast_data/configuration/config_maps/kafka_projection_updates.mdx#manual)

#### What is the Single View Key configuration used for?
The Single View Key tells the [Single View Creator](/products/fast_data/single_view_creator.md) how to map the fields from a Projection Change identifier to the primary key fields of the Single View collection. This is how the SVC knows which specific Single View document to `upsert` in MongoDB.
[Discover more](/products/fast_data/configuration/config_maps/singleViewKey.md)

#### How can I test my Low-Code configurations before deployment?
Mia-Platform provides a [Fast Data Low Code Test Template](https://github.com/mia-platform/fast-data-low-code-test-template) repository. You can clone this repository, add your `erSchema.json`, `aggregation.json`, and other configuration files, and write unit tests to verify that your aggregation logic produces the expected output for given input projections.
[Discover more](/products/fast_data/configuration/single_view_creator/plugin.md)

#### Can I use custom JavaScript functions within my Low-Code aggregation?
Yes. The `aggregation.json` file supports a `__fromFile__` keyword in the `mapping` section. This allows you to call a custom JavaScript function to compute the value of a specific Single View field. The function receives the already-resolved dependencies as input, allowing you to perform complex calculations or transformations that are not possible with simple field mapping.
[Discover more](/products/fast_data/configuration/config_maps/aggregation.md#mapping)

### Data Loading & Operations

#### What is an "Initial Load" and when is it necessary?
An **Initial Load** is the process that involves streaming all existing records from a source table in a System of Record to its corresponding ingestion topic. This is necessary when you first set up your Fast Data system or when a data model schema change requires a full resynchronization.
[Discover more](/products/fast_data/concepts/data_loading.mdx#initial-load)

#### What are the best practices for performing an Initial Load to avoid performance issues?
During an Initial Load, a large volume of messages is processed. To manage this effectively:

1. **Use the Control Plane**: Leverage [Fast Data Control Plane](/products/fast_data/runtime_management/overview.mdx), the Mia-Platform runtime management solution for Fast Data to govern the Initial Load process without changing runtime configurations. It allows to:
  - Pause/resume specific stages of your pipeline through a visual interface
  - Control resource allocation dynamically

2. **Follow the process**:
  - First, pause the Single View generation stages
  - Start the ingestion process for your data
  - Once ingestion is complete, resume Single View generation
  - Monitor the process through the Control Plane UI

3. **Technical considerations**:
  - Scale up RTU/PS replicas to handle high message throughput
  - Monitor Kafka consumer lag and MongoDB resource utilization
  - Ensure proper indexes are in place before starting

This approach ensures optimal resource utilization and system stability during large-scale data operations.
[Discover more](/products/fast_data/concepts/data_loading.mdx#best-practices)

#### What is a "Full Refresh" of a Single View?
A **Full Refresh** is the process of regenerating all the documents in a specific **Single View** collection. This is done by generating a trigger for every base projection document, causing the [Single View Creator](/products/fast_data/single_view_creator.md) to re-run the aggregation for every Single View instance.
[Discover more](/products/fast_data/concepts/data_loading.mdx#full-refresh)

#### What is the difference between an Initial Load and a Full Refresh?
* An **Initial Load** populates the **Projections** with data from the source systems. It's about getting the raw, standardized data into Fast Data.
* A **Full Refresh** repopulates a **Single View** with data that often is already in the Projections. It's about re-running the aggregation logic to ensure the Single View is consistent with the latest projection data and aggregation rules.
[Discover more](/products/fast_data/concepts/data_loading.mdx)

#### How do I perform a Full Refresh for a Single View?
To perform a Full Refresh, you first need to disable strategy execution to prevent real-time updates from interfering. Alternatively, thanks to Mia-Platform Control Plane, it is possible to pause all steps in pipeline that involves strategy executions. Then, you need to generate a trigger for every document in the base projection. This can be done with a custom script that reads all documents from the base projection's MongoDB collection and produces either a Projection Change record or an `sv-trigger` message for each one.
[Discover more](/products/fast_data/concepts/data_loading.mdx#full-refresh)

#### How does Fast Data handle ingestion messages from different CDC systems like Debezium or Oracle Golden Gate?
Fast Data allows to configure **Message Adapters** in the [Real-Time Updater](/products/fast_data/realtime_updater.md) or [Projection Storer](/products/fast_data/projection_storer.md). These adapters are responsible for parsing the specific JSON format produced by different CDC tools. Fast Data comes with built-in adapters for common formats like Debezium, Golden Gate, and DB2. If your CDC produces a different format, you can write a custom JavaScript adapter to parse it.
[Discover more](/products/fast_data/concepts/inputs_and_outputs.md#ingestion-message)

### Connectors & Integration

#### What is a Connector in the context of Fast Data?
A **Connector** is any component responsible for transmitting data changes from a source system to the Fast Data ingestion topics on Kafka. This is most often a **Change Data Capture (CDC)** system like Debezium, which monitors a database, but it could also be a custom application that produces events based on other triggers.
[Discover more](/products/fast_data/connectors/overview.md)

#### How does the Debezium Server CDC work with Fast Data?
The **Debezium Server** is a standalone application that can be configured to monitor a source database (like MySQL, PostgreSQL, or Oracle). It uses the appropriate database-specific plugin to read the transaction log, converts changes into a standard JSON format, and publishes them to Kafka topics. These topics are then configured as the ingestion topics for your Fast Data Projections.
[Discover more](/products/fast_data/connectors/debezium_cdc.md)

#### How do I configure the Debezium connector for PostgreSQL or Oracle?
For **PostgreSQL**, you need to enable logical decoding on the database and create a user with `REPLICATION` privileges. The connector configuration in `application.properties` will then specify the database connection details and the `plugin.name` (e.g., `pgoutput`). For **Oracle**, you need to enable `ARCHIVELOG` mode and grant `LogMiner` privileges to the Debezium user. The connector configuration will specify the database connection details and the mining strategy.
[Discover more](/products/fast_data/connectors/debezium_cdc.md)

#### What is the purpose of the `topic.prefix` in the Debezium configuration?
The `topic.prefix` is a string that Debezium prepends to the name of all Kafka topics it creates. For example, if you set `topic.prefix` to `my-app`, a change in the `customers` table will be published to the `my-app.public.customers` topic. This is essential for organizing topics and preventing name collisions in a shared Kafka cluster.
[Discover more](/products/fast_data/connectors/debezium_cdc.md)

#### Why does the Debezium Server CDC require a Redis instance?
The standalone **Debezium Server** (unlike the Kafka Connect version) needs an external store to keep track of its progress (offsets) and the database schema history. Using **Redis** for this purpose ensures that if the Debezium server restarts, it can resume processing from where it left off without losing data or needing to perform a full snapshot again.
[Discover more](/products/fast_data/connectors/debezium_cdc.md#offsets-management)

### Other Features

#### What is the Bucket Storage Support feature?
Bucket Storage Support is a feature that allows you to archive messages from Kafka topics to a long-term, cost-effective object storage system like **AWS s3** or **Google Cloud Storage**. It is useful for compliance, auditing, or for re-processing historical data.
[Discover more](/products/fast_data/bucket_storage_support/overview.md)

#### How does the Ingestion Storer save messages to an S3 bucket?
The **Ingestion Storer** service consumes messages from one or more Kafka topics. It batches these messages together and writes them as files to the configured bucket (e.g., an **AWS s3** bucket). It also emits an event to a Kafka topic to notify other systems that a new file has been successfully stored.
[Discover more](/products/fast_data/bucket_storage_support/configuration/ingestion_storer.md)

#### How can I re-ingest data from a bucket using the Ingestion Reloader?
The **Ingestion Reloader** service exposes REST APIs that allow you to trigger a re-ingestion process. You can make a POST request specifying either a single file or an entire topic's worth of archived files. The service will then read the specified files from the bucket and publish their contents as messages back onto a designated Kafka topic for reprocessing by your Fast Data pipeline.
[Discover more](/products/fast_data/bucket_storage_support/configuration/ingestion_reloader.md)

#### What is the purpose of the Fast Data Control Plane (Runtime Management)?
The Fast Data Control Plane is a runtime management solution that provides a UI to monitor and govern the execution of your Fast Data pipelines. It allows you to **pause** and **resume** data consumption at different stages of the pipeline (e.g., at the Projection Storer or the Single View Creator). This is extremely useful for managing operations like an **Initial Load** or a **Full Refresh** without needing to manually scale services down to zero.
[Discover more](/products/fast_data/runtime_management/overview.mdx)

#### How can I pause and resume data streams using the Control Plane?
The Control Plane UI provides a visual representation of your data pipelines. On this UI, you will see play/pause buttons at different stages. Clicking "pause" on a specific stage (e.g., the "Mapping" stage handled by the Projection Storer) sends a command to the relevant service, instructing it to stop consuming new messages from its input topic. Clicking "resume" will cause it to start consuming again.
[Discover more](/products/fast_data/runtime_management/control_plane_frontend.mdx#pause-and-resume)

#### What is a Single View Patch and when should I use it?
A **Single View Patch** can be, in some cases, a more efficient alternative to update a Single View. Instead of re-running the entire aggregation, it performs a direct, targeted MongoDB update on the Single View document. This is highly recommended for updates that affect a small, specific part of the Single View, especially when a change in one projection (like a product's category) would otherwise trigger a full re-aggregation for thousands of Single Views.
[Discover more](/products/fast_data/configuration/single_view_creator/patch.md)

### Troubleshooting & Best Practices

#### My Real-Time Updater (RTU) keeps restarting during an Initial Load. What could be the cause?
This often happens because the RTU is overwhelmed by the high volume of messages and complex strategy executions, causing it to exceed its CPU or memory limits and crash. The recommended solution is to temporarily disable strategy execution in the RTU (`PROJECTIONS_CHANGES_ENABLED=false`) during the Initial Load. Once the load is complete, you can perform a **Full Refresh** to generate the Single Views.
[Discover more](/products/fast_data/troubleshooting/rtu_keeps_restarting_rebalancing.md)

#### My Single View generation is slow. What are the common causes and how can I fix it?
Slow Single View generation is almost always caused by inefficient MongoDB queries due to missing indexes. Ensure that:
* All fields used in the join conditions of your **ER Schema** are indexed on the respective Projections.
* The **Projection Changes** collection has the recommended indexes on `identifier` and `type`.
* The **Single View** collection has a unique index on its primary key fields, as defined in the **Single View Key** configuration.
[Discover more](/products/fast_data/faq/bootstrapping_fast_data.md#why-is-the-strategy-execution-or-the-single-view-generation-slow)

#### How does Fast Data handle failures if Kafka or MongoDB goes down?
Fast Data is designed for resilience:
* **If Kafka goes down**: The CDC will stop publishing, and Fast Data services will pause consumption. Once Kafka is back, the CDC will resume from where it left off (within the database's log retention period), and services will process the backlog.
* **If MongoDB goes down**: Fast Data services will stop consuming from Kafka because they cannot write to the database. Messages will accumulate in Kafka. Once MongoDB is restored, services will resume processing from the last committed Kafka offset. No data is lost in either scenario, as long as the outage is shorter than the retention periods.
[Discover more](/products/fast_data/faq/failure_handling.md)

#### What are the recommended resources (CPU/Memory) for Fast Data services during an Initial Load?
Especially when using the Standard architecture, during an Initial Load, the **Real-Time Updater** will require significantly more resources. A good starting point for a single replica is a request of `200m` CPU and `150MiB` memory, with limits set higher (e.g., `600m` CPU, `350MiB` memory). However, these values are highly dependent on the message volume and complexity, so it is crucial to monitor performance and adjust accordingly.
[Discover more](/products/fast_data/faq/bootstrapping_fast_data.md#how-should-i-set-the-resource-limits-of-the-real-time-updater-rtu)

#### I see an `FD_PS_E4001` error in my Projection Storer logs. What does it mean?
The error code `FD_PS_E4001` means that the list of projection operations provided to the storage component was empty. This typically happens when the incoming change events from Kafka were all filtered out because they were malformed or did not match the expected format of the selected **Message Adapter**. You should check if the `dataSourceAdapter` is configured correctly and if the CDC is producing events in the expected format.
[Discover more](/products/fast_data/troubleshooting/fast_data_error_codes.md)

#### How can I monitor the performance of my Fast Data pipelines?
Mia-Platform provides a set of pre-configured **Grafana** dashboards that connect to Prometheus. These dashboards visualize key metrics exposed by the Fast Data services, such as:
* **Consumer Group Lag**: Monitor if services are keeping up with message volume using `kafka_consumergroup_lag` metrics
* **Processing Times**: Track strategy execution and Single View creation latencies
* **Message Throughput**: Measure I/O message rates for each service
* **Resource Usage**: Monitor CPU and memory utilization of service pods
* **MongoDB Query Performance**: Track query execution times and index usage
* **Kafka Topic Metrics**: Monitor message rates and partition health
* **Service Health**: Track service uptime and error rates
  
Monitoring these dashboards is essential for identifying bottlenecks and ensuring the health of your system.
[Discover more](/products/fast_data/monitoring/overview.md)
