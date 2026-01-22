---
id: data_catalog_compatibility_matrix
title: Data Catalog Compatibility Matrix
sidebar_label: Compatibility Matrix
---

This section guides you to understand whether your Project can support Data Catalog and its features.

## Infrastructure

Here is described the compatibility between Data Catalog application components and the external systems they rely on.
Please ensure that versions shown in the matrix are respected in your deployed environments.


| Service                                                              | Version       | MongoDB | Redis  |
| -------------------------------------------------------------------- | ------------- | ------- | ------ |
| [Fabric BFF](/products/data_catalog/data_catalog_fabric_bff.mdx)     | 0.1.x - 0.3.x | \>=5.0  | _N/A_  |
| [Open Lineage](/products/data_catalog/data_catalog_open_lineage.mdx) | 0.1.x - 0.3.x | \>=5.0  | \>=7.0 |
| [Job Runner](/products/data_catalog/data_catalog_job_runner.mdx)     | 0.1.x - 0.2.x | \>=5.0  | _N/A_  |
| [Fabric Admin](/products/data_catalog/database_setup.mdx)            | 0.1.x - 0.5.x | \>=5.0  | _N/A_  |
<sup>*</sup><em>N/A</em> means the service does not depend on the resource

## Service Latest Versions

#### 2025-11-27 | v14.4.0

| Service                                                               | Version |
| --------------------------------------------------------------------- | ------- |
| [Fabric BFF](/products/data_catalog/data_catalog_fabric_bff.mdx)      | 0.3.4   |
| [Open Lineage](/products/data_catalog/data_catalog_open_lineage.mdx)  | 0.4.0   |
| [Job Runner](/products/data_catalog/data_catalog_job_runner.mdx)      | 0.2.5   |
| [Data Catalog Frontend](/products/data_catalog/frontend/overview.mdx) | 0.4.0   |
| [Fabric Admin](/products/data_catalog/database_setup.mdx)             | 0.5.3   |

## Previous Releases

In the tables below are grouped together the recommended service versions that
should be deployed together at each Console release. This ensures that
features introduced in a specific release are properly supported by all
Data Catalog components.

#### 2025-09-04 | v14.2.0

| Service                                                               | Version |
| --------------------------------------------------------------------- | ------- |
| [Fabric BFF](/products/data_catalog/data_catalog_fabric_bff.mdx)      | 0.3.4   |
| [Open Lineage](/products/data_catalog/data_catalog_open_lineage.mdx)  | 0.3.8   |
| [Job Runner](/products/data_catalog/data_catalog_job_runner.mdx)      | 0.2.5   |
| [Data Catalog Frontend](/products/data_catalog/frontend/overview.mdx) | 0.3.4   |
| [Fabric Admin](/products/data_catalog/database_setup.mdx)             | 0.5.3   |

#### 2025-06-26 | v14.0.2

| Service                                                               | Version |
| --------------------------------------------------------------------- | ------- |
| [Fabric BFF](/products/data_catalog/data_catalog_fabric_bff.mdx)      | 0.3.4   |
| [Open Lineage](/products/data_catalog/data_catalog_open_lineage.mdx)  | 0.3.8   |
| [Job Runner](/products/data_catalog/data_catalog_job_runner.mdx)      | 0.2.2   |
| [Data Catalog Frontend](/products/data_catalog/frontend/overview.mdx) | 0.3.4   |
| [Fabric Admin](/products/data_catalog/database_setup.mdx)             | 0.5.3   |

#### 2025-02-20 | v13.6.0

| Service                                                               | Version |
| --------------------------------------------------------------------- | ------- |
| [Fabric BFF](/products/data_catalog/data_catalog_fabric_bff.mdx)      | 0.3.3   |
| [Open Lineage](/products/data_catalog/data_catalog_open_lineage.mdx)  | 0.3.5   |
| [Job Runner](/products/data_catalog/data_catalog_job_runner.mdx)      | 0.2.2   |
| [Data Catalog Frontend](/products/data_catalog/frontend/overview.mdx) | 0.3.2   |
| [Fabric Admin](/products/data_catalog/database_setup.mdx)             | 0.5.2   |

---
