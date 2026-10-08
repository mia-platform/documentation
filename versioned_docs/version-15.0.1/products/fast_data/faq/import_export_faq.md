---
id: import_export_faq
title: Import / Export
sidebar_label: Import / Export
---

## When should I use the Import / Export feature?

This feature can be useful in two main use cases:

### Handling Fast Data resources split between projects

For example, imagine a company with two projects, `Project A`, which contains Systems of Record, Projections and ER schemas, and `Project B`, which contains Single Views. Users assigned to `Project A` do not have access to `Project B` and vice versa.

When configuring microservices, such as Single View Creators, users assigned to `Project B` will need an ER schema containing data about Projections (and other collections) relationships, but this data is stored inside `Project A`, which is not accessible to them.

With the Import / Export feature, users from `Project A` could easily export the ER schema and its related resources, then share the exported data with users assigned to `Project B`.

`Project B` users could then import the data as a reference, thus being now able to configure their microservices while keeping a single source of truth of their data inside `Project A`.

### Cloning Fast Data resources from a project to another one

For example, when complex Fast Data resources are configured inside one project and are needed in their entirety or as a basis for further improvements inside another project. 

The Import / Export would prevent users from recreating two or more equal data structures in different projects. They would only need to export data from one project and import it as a resource inside another one.

## Is it better to import my data as a reference or as a resource?

This actually depends on the specific use case.

In general, importing as a reference could be the best solution when it is necessary to define precisely a Fast Data resource in one project and make sure this definition is not changing when the resource is imported elsewhere. This way, a single source of truth defines the resource inside a project and all other projects references it. These references can be updated later by importing a resource with the same name from the same source project.

:::caution
Resources imported by reference are not automatically synced between projects. In order to update them, it will be necessary to manually export them from the source project and import them again inside the destination project.
:::

When it is not necessary to keep Fast Data resources consistent between projects, or it is needed to edit them, import as a resource could be a better way.

## I am trying to import a file but I cannot complete the operation, how can I solve this?

Errors while importing a file could happen for several reasons. This errors could prevent the importing process to be completed.

The most common reason could be related to the imported `.json` file format. If the file does not contain data about Fast Data resources, it will not be possible to complete the import operation because there is nothing to be imported.

The file could also correctly contain data and be a valid `.json`, but its format could have been updated, thus making it impossible to be read by our importing algorithm.

To prevent this problems, we suggest using `.json` files generated during the export process without editing them.

Another potential error could be related to the resources naming. In fact, it is not possible to import resources with the same name of resources or references already existing inside the project current configuration.
