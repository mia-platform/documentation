---
id: api
title: Software Catalog API
sidebar_label: Software Catalog API
---

:::danger
The Software Catalog API is in **alpha**, interfaces may change in the future.
:::

The Console exposes a set of APIs that powers both miactl and the Software Catalog UI. You can leverage these APIs yourself to gain programmatic access to the data and build alternative clients.

:::caution
To utilize some of the restriced APIs you need to perform the requests as an authenticated users with enough permissions, or using a [service account](/products/console/identity-and-access-management/manage-service-accounts.md).
:::

You can download the documentation of the APIs in the [OpenAPI](https://www.openapis.org/) 3.0 format <a download target="_blank" href="/docs_files_to_download/software-catalog/software-catalog-api-documentation.json">here</a>.

## Deprecation notice

The Console exposes two sets of interchangable APIs, one with the `/api` prefix, and one with the `/api/backend` prefix.

:::danger
The APIs with the `/api/backend` prefix are deprecated and **should not be used**. They will be **removed in Console v15**.
:::
