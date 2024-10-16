---
id: custom-resources
title: Monitor your Custom Resources
sidebar_label: Monitor your Custom Resources
slug: "/development_suite/monitoring/resources/jobs"
---


A [Custom Resource](/console/design-your-projects/custom-resources/custom-resources.md) allows you to define custom objects that are not part of the standard Console resources and can be used to extend the Console capabilities.
If deployed, the information on the Custom Resources for the project can be accessed in the section `Custom Resources` of the sidebar in the `Runtime`section.

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
