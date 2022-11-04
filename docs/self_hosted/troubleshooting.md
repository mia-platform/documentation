---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
---

This page describes resolution methods for common errors you may encounter in your self hosted installation.

If the problem you are facing is not listed below, or you are unable to solve it, please contact your Console administrator or visit the [Mia-Platform Help Center](https://makeitapp.atlassian.net/servicedesk/customer/portal/21).


### Incomplete Logs

**Issue**: When accessing the stream of logs of a K8s entity in the monitoring section, such as a pod or a namespace, logs do not appear formatted correctly. Logs include only partial information and cannot be seen entirely.

**Solution**: The microservice responsible for handling the stream of logs, the Kubernetes service, may need more resources to function properly. Please ensure requests and limits values are set accordingly to your architecture demands.

:::info
If the chart managing your Console extends the template chart provided by Mia Platform, you can directly change requests and limits values from it. 
:::

In that case, open `values.yaml` and modify the following configuration:

```yaml
kubernetesService:
  deploy:
    resources:
      requests:
        memory: "200Mi"
        cpu: "100m"
      limits:
        memory: "600Mi"
        cpu: "400m"
```
