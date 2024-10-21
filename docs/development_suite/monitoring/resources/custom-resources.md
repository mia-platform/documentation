---
id: custom-resources
title: Monitor your Custom Resources
sidebar_label: Monitor your Custom Resources
slug: "/development_suite/monitoring/resources/jobs"
---


If deployed, the information on the [Custom Resources](/console/design-your-projects/custom-resources/custom-resources.md) for the project can be accessed in the section `Custom Resources` of the sidebar in the `Runtime`section.

:::caution
If you created the custom resource from a marketplace template prior to Console release v13.3.0, the Custom Resources will not be visible by default. 
Please ensure to [update your Custom Resource](/marketplace/add_to_marketplace/add_item_by_type/add_custom_resource.md#update-a-custom-resource-to-the-console-v1330) version via [miactl](/cli/miactl/10_overview.md) to one that has the properties `resourceId` and `type` correctly set in the `runtime` object field of its definition, otherwise the custom resources won't be visible in the section even if the resource is active.
:::


### Custom Resource instances

By selecting a particular Custom Resource type listed from the sidebar, it is possible to view the list of all the active instances in the cluster.

![list](../img/custom_resources.png)

by clicking on a row from the table, is possible to see the description the events of the Custom Resource instance.

#### Custom Resource describe

In the `Custom Resources` section, under the `Describe` tab, you can find the describe of the current Custom resource in YAML format.

![describe](../img/describe_custom_resources.png)

Using the dedicated buttons `Export to YAML`, the describe of the Custom Resource can be downloaded as YAML file. 

#### Namespace events

In the `Custom Resources` section, under the `Events` tab, you can find the events of the current Custom resource instance sorted in a table.

![events](../img/events_custom_resources.png)

Using the dedicated button, the events can be refreshed.
