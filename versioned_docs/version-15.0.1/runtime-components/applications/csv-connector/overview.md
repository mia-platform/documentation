---
id: overview
title: Overview
sidebar_label: Overview
---



:::danger
The CSV Connector is deprecated, and no active development, new versions, or bug fixes are planned. It will reach end of life with the v14.0.0 of the console.
:::

The CSV Fast Data Connector application enables fetching data from CSV files and delivering it with validation to the Fast Data. By describing CSV file specifications in a ConfigMap using a JSON schema, it provides validation of input data and custom mapping to projections. The application uses Files Service's multi-bucket functionality to manage CSV files and maintain a clean environment. It is essential to have the Files Service in the cluster and provide it with a multi-bucket configuration. The Files Service requires the CRUD Service to maintain metadata in Mongo collections about the CSV files being managed.

### Usage

It is recommended to check the [documentation page](/runtime-components/plugins/csv-connector-plugin/configuration.md) for the CSV Connector Plugin for detailed information on how to use the component.

:::caution
Note that this application comes with no default ConfigMap for the CSV Connector, so one should be added manually. For detailed information on how to write a proper ConfigMap, please refer to the CSV Connector Plugin [documentation page](/runtime-components/plugins/csv-connector-plugin/configuration.md).
:::

### Microservices

The application consists of the following three microservices:

- [CRUD Service](/runtime-components/plugins/crud-service/10_overview_and_usage.md);
- [Files Service](/runtime-components/plugins/files-service/configuration.mdx): manages the CSV files and provides the functionality to store them in multiple buckets, ensuring a clean environment.
- [CSV Connector Plugin](/runtime-components/plugins/csv-connector-plugin/configuration.md): the core service that fetches data from CSV files and delivers it with validation to the Fast Data, using the JSON schema to map the columns to projections.
