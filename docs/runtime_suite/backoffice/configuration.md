---
id: configuration
title: Configuration
sidebar_label: Configuration
---
The configuration of the application is pretty straight forward. You just need to follow the wizard and choose for each
service if you want to deploy a new resource or link an existing one.

:::danger
Once the services have been spawned correctly, you need to navigate to the **ConfigMaps** section of **`micro-lc` service**.
Here you need to check the

> Preserve files and directories already existing in the Runtime Mount Path directory

flag in `micro-lc-configuration` config map, otherwise the service will not work.
:::

Your new Backoffice instance will be exposed under `/backoffice`, but you can always change that in the endpoints
section.
