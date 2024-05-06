---
id: license_management
title: License management and tracking
sidebar_label: License Management
---
Mia-Platform Console comes with a self-managed license tracking mechanism, that measures Console usage on a timely base.

The data is collected by querying the cluster directly for information in a time period specified within this configuration in the `scheduleEveryMinutes` field.

:::info
In order to reach the Kubernetes clusters the license tracking system will use the service accounts configured in your Company for each Cluster; make sure these service account have the following permissions described [here](../../development_suite/clusters-management/cluster-setup#cluster-preparation).
:::

:::note
The license tracking system is enabled by default, however if your contract allows for it you can shut it down or tune it with a different time schedule.
:::

## Configure licenses tracking

License tracking can be configured with the `configurations.licenses` object, this configuration is optional and accepts the following options:

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `enabled`              | boolean | Set if license metrics generator should be active          | `true`  | ✅ |
| `scheduleEveryMinutes` | string  | CronJob schedule when license metrics generator should run | `15`    | ✅ |
