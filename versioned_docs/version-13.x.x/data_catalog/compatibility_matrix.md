---
id: data_catalog_compatibility_matrix
title: Data Catalog Compatibility Matrix
sidebar_label: Compatibility Matrix
---

This section guides you to understand whether your Project can support Data Catalog and its features.

## Infrastructure

Here is described the compatibility between Data Catalog application components and the external systems they rely on.
Please ensure that versions shown in the matrix are respected in your deployed environments.


| Service                                                     | Version         | MongoDB | Redis  |
| ----------------------------------------------------------- | --------------- | ------- | ------ |
| [Fabric BFF](/data_catalog/data_catalog_fabric_bff.mdx)     | 0.1.x - 0.3.x   | \>=5.0  | _N/A_  |
| [Open Lineage](/data_catalog/data_catalog_open_lineage.mdx) | 0.1.x - 0.3.x   | \>=5.0  | \>=7.0 |
| [Job Runner](/data_catalog/data_catalog_job_runner.mdx)     | 0.1.x - 0.2.x   | \>=5.0  | _N/A_  |
| [Fabric Admin](/data_catalog/database_setup.mdx)            | 0.1.x - 0.5.x   | \>=5.0  | _N/A_  |
<sup>*</sup><em>N/A</em> means the service does not depend on the resource

## Service Latest Versions

| Service                                                          | Version |
| ---------------------------------------------------------------- | ------- |
| [Fabric BFF](/data_catalog/data_catalog_fabric_bff.mdx)          | 0.3.3   |
| [Open Lineage](/data_catalog/data_catalog_open_lineage.mdx)      | 0.3.5   |
| [Job Runner](/data_catalog/data_catalog_job_runner.mdx)          | 0.2.2   |
| [Data Catalog Frontend](/data_catalog/frontend/overview.mdx)     | 0.3.2   |
| [Fabric Admin](/data_catalog/database_setup.mdx)                 | 0.5.2   |

## Internal Compatibility

| Service                                                               | Fabric BFF | Open Lineage | Job Runner | Fabric Admin |
| --------------------------------------------------------------------: | :-------:  | :-----------:| :--------: | :----------: |
| [Fabric BFF](/data_catalog/data_catalog_fabric_bff.mdx) - 0.3.3       | N/A        | 0.3.5        | 0.2.2      | 0.5.2        |
| [Open Lineage](/data_catalog/data_catalog_open_lineage.mdx) - 0.3.5   | 0.3.3      | N/A          | 0.2.2      | 0.5.2        |
| [Job Runner](/data_catalog/data_catalog_job_runner.mdx)     - 0.2.2   | 0.3.3      | 0.3.5        | N/A        | N/A          |
| [Data Catalog Frontend](/data_catalog/frontend/overview.mdx) - 0.3.2  | 0.3.3      | N/A          | N/A        | N/A          |
| [Fabric Admin](/data_catalog/database_setup.mdx)  - 0.5.2             | 0.3.3      | 0.3.5        | 0.2.2      | N/A          |
