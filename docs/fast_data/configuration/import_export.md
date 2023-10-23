---
id: import_export
title: Import / Export of resources between projects
sidebar_label: Import / Export
---

:::info
This feature is available from `v12.0.0` of Mia-Platform Console (you may have to contact your System Administrator in order to enable it).
:::

The Import / Export feature allows Fast Data users to export resources from a specific project and import them inside another one.

This feature makes it easier to access resources from other projects without having to recreate them on each environment.

The following resources can be exported:
- Custom cast functions (assigned to a Projection field)
- ER schemas
- Single Views
- System of Records (with all or some of their Projections)

The feature can be accessed by clicking on the `Import / Export` button, placed on the top right bar of the Systems of Records and Single Views pages. After clicking on the button, it will be possible to open the `Import` or `Export` modals.

## Export

After clicking on the `Export` button, a modal will display exportable Fast Data resources in their respective tabs, if present.

From each tab it will be possible to select and deselect the resources to be exported.

When clicking on the `Export` button on the modal footer, a `.json` file will be downloaded, containing the selected resources in `JSON` format and some information about the current project, branch and exporting time. This metadata will be useful when importing resources inside another project.

When exporting one or more ER schemas, a check will be performed on the potential related resources (such as Projections and Single Views) to make sure they are exported as well. If not, another screen will be opened to display all of the ER schemas dependencies. After the `Confirm and export` button is clicked, these dependencies will be automatically included inside the exported file.

If a custom cast function is assigned to one or more Projection fields and the Projection is exported, the cast function will be exported as well.

## Import

After clicking on the `Import` button, it will be possible to upload a `.json` file containing exported data inside a modal.

The imported file should follow the structure of files downloaded using the `Export` feature.

If the file is valid, information about the source project, branch and exporting time will be displayed.

When clicking on the `Next` button, all of the Fast Data resources contained inside the imported file will be displayed in their respective tabs. It will be possible to select and deselect resources before completing the import process by clicking on the `Confirm and import` button.

Fast Data resources can be imported in two ways:
1) as a reference: the resources will be referenced inside the current project configuration and displayed in read-only mode. It will be possible to access their data but the resources will not be editable. A `Reference` label will be added to their name: when hovering it, a popover will display information about the exporting source project, branch and time.
2) as a reference: the resources will be copied inside the current project configuration and displayed as if they were created directly inside the current project. It will be possible to access and edit their data.

In both cases, an error message will be displayed if some of the imported resources have the same name of resources or references already existing inside the project current configuration.

It will be possible to update references only by importing resources with the same name and from the same source project. In this case, the `Reference update` label will be displayed alongside each updated resource and its content will be overwritten inside the configuration.

:::caution
In both cases, microservices associated to each resource (such as Real-Time Updaters and their Message Formats, Single View Creators or Single View Trigger Generators) will NOT be imported. Please make sure these services have been created before deploying your configuration.
:::

:::info
Some Fast Data resources, such as Projections, can be imported as a reference only in projects that are using the Single View Trigger Generator architecture. Please check your services before importing the resources.
:::