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
| [Fabric BFF](/data_catalog/data_catalog_fabric_bff.mdx)     | 0.1.x - 0.2.x   | \>=5.0  | _N/A_  |
| [Open Lineage](/data_catalog/data_catalog_open_lineage.mdx) | 0.1.x - 0.2.x   | \>=5.0  | \>=7.0 |
| [Job Runner](/data_catalog/data_catalog_job_runner.mdx)     | 0.1.x           | \>=5.0  | _N/A_  |
<p><sup>*</sup><em>N/A</em> means the service does not depend on the resource</p>

## Service Latest Versions

| Service                                                          | Version |
| ---------------------------------------------------------------- | ------- |
| [Fabric BFF](/data_catalog/data_catalog_fabric_bff.mdx)          | 0.2.1   |
| [Open Lineage](/data_catalog/data_catalog_open_lineage.mdx)      | 0.2.1   |
| [Job Runner](/data_catalog/data_catalog_job_runner.mdx)          | 0.1.0   |
| [Data Catalog Frontend](/data_catalog/frontend/overview.mdx)     | 0.2.1   |
| [Fabric Admin](/data_catalog/database_setup.mdx)                 | 0.2.0   |
