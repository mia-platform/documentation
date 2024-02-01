---
id: overview_data_catalog
title: Data Catalog Overview
sidebar_label: Overview
---

:::caution
Please notice that the information explained in the following page, regarding the deployment of a Data Catalog Agent,
are valid only for Console projects adopting the [Enhanced Workflow](/development_suite/set-up-infrastructure/enhanced-project-workflow.md).

The Data Catalog Agent can not be deployed in projects adopting the older Console workflow.
:::

A Mia-Platform Console Project can be configured to work as a Data Catalog, that is a centralized 
location where it is possible to collect metadata concerning all the data assets of an organization.
:::tip
The Mia-Platform Console Project can be configured to work as a Data Catalog if you configure a Data Catalog Agent in your project. Refer to the [documentation](/runtime_suite_templates/data-catalog/10_overview.md) to understand how to set it up.
:::
Within the project, it is possible to set up our Data Catalog Agent, which can be configured to connect to different sources,
such as:

- Oracle Database
- Postgres Database
- MySQL Database
- Microsoft SQL Server Database

This agent is in charge of extracting metadata regarding the several tables and data structures existing on configured
sources (System of Record) and forward them to Mia-Platform Console for storing them in the dedicated project.
Example of metadata are the tables' names, their fields' names and their corresponding type.

Once the Data Catalog Agent has run for the first time and it has extracted at least one System of Record, in the design section
of the specific Console project, it will be possible to explore these set of System of Record under the Data Catalog page,
which replaces the Systems of Record page in this particular case.  
Within this page, which is shown in the figure, it will be possible to see the list of System of Record that have
been generated starting from the metadata extracted by the Data Catalog Agent.

![Data Catalog in System of Record page](../img/data_catalog_systems_view.png)

:::note
At the moment, if a project is configured to work with the Data Catalog, in the same Project will not be possible to configure anything regarding Fast Data.
In the next releases, a dedicated section to handle the Data Catalog will be provided.
:::

Selecting a specific System of Record it is possible to observe which tables are associated with the system and for
each table it is visible which fields compose it, alongside the field types and their properties.

As a user, it will be then possible to edit _description_ and _GDPR regulation_ properties of each table field, which are retained upon saving
the project. These changes, executed on the _user-defined_ properties, are preserved across multiple metadata synchronizations performed by
the Data Catalog Agent so that the source systems can add or remove fields without affecting existing ones. 

An example of a table view is displayed in the figure below, which allows to editing description and GDPR regulation fields:

![Data Catalog Table view page](../img/data_catalog_readonly_fields.png)
