---
id: overview
title: Overview
sidebar_label: Overview
---



:::danger
The application is deprecated, and no active development, new versions, or bug fixes are planned. It will reach end of life with the v14.0.0 of the console.
:::

In order to simplify the creation of a new Mongo-based [Files Service](/runtime-components/plugins/files-service/configuration.mdx#mongodb-gridfs-configuration-file-single-bucket-option) instance, this application available in the Marketplace will help you configure all the needed resources in a few clicks.

:::tip
This application may come in handy when adding files-related capabilities to a [Microfrontend Composer](/products/microfrontend-composer/overview.md).
:::

## Usage

It is recommended to check the documentation page for the [Files Service Plugin](/runtime-components/plugins/files-service/configuration.mdx) for detailed information on how to use the component.

:::caution
This application comes with a default incomplete ConfigMap for the Files Service, specifying Mongo as storage service. For detailed information on how to write a proper ConfigMap, please refer to the Files Service Plugin [documentation page](/runtime-components/plugins/files-service/configuration.mdx#configuration-file).
:::

## Microservices

The application consists of the following microservices:

- [Files Service](/runtime-components/plugins/files-service/configuration.mdx#configuration-file) to manage files.
- [CRUD Service](/runtime-components/plugins/crud-service/10_overview_and_usage.md) to store files information in a [pre-configured](/runtime-components/plugins/files-service/configuration.mdx#crud-collection) collection called `file_records`.

## Endpoints

The application exposes the Files Service on the `/files-service` endpoint.
