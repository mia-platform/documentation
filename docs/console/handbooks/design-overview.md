---
id: design-overview
title: Design Overview
sidebar_label: Design Overview
---

Design Overview allows you to create and manage multiple Views (aka Public Views), each one with its own set of filters and visible columns for each available Resource for a Company.
There are a different set of permissions based on whether you want to create or edit a View, make sure you have the ones you need.

:::note
To create a new View you must have the permission `console.company.project.create`.
:::

## View creation

To create the View, simply navigate to the Company Overview, then to Design Overview and select the tab from available Resources ([CRUD](/development_suite/governance/design-overview.md#CRUD), [Endpoints](/development_suite/governance/design-overview.md#Endpoints), [Microservices](/development_suite/governance/design-overview.md#Microservices)). 

Customize the table based on your needs by hiding/displaying column and/or applying filters.

Finally use the `Save current view` button to insert View name and the `Save view` button to persist the current view.

The saved view is visible in the Design Overview's Homepage section.

For further info please refer to the [Design Overview's documentation](/development_suite/governance/design-overview.md#saving)

## View modification

To edit the View, simply navigate to the Company Overview, then to Design Overview's Homepage section and select the card associated to the view to delete.

Click the `Actions Dropdown` icon and select `Edit view name`, then insert new 'View name' through the specific popup and click the `Overwrite view` button.

For further info please refer to the [Design Overview's documentation](/development_suite/governance/design-overview.md#editing)

:::note
Current feature is limited to edit name.
Default views cannot be renamed since they are added by default for all users for a given Company.
:::

## View deletion

To delete the View, simply navigate to the Company Overview, then to Design Overview's Homepage section and select the card associated to the view to delete.

Click the `Actions Dropdown` icon and select `Delete`. 

For further info please refer to the [Design Overview's documentation](/development_suite/governance/design-overview.md#deleting)

:::note
Default views cannot be edited/deleted since they are added by default for all users for a given Company.
:::
