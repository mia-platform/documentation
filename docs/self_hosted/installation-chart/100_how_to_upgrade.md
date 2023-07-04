---
id: how_to_upgrade
title: How to Upgrade
sidebar_label: How To Upgrade
---
In order to upgrade Mia-Platform Console, all you need to do is to update the `mia-console` Chart version dependency in your `Chart.yaml` file.

:::caution
when upgrading Mia-Platform Console to a new major release, always remember that updates must be performed one major at a time. Therefore, in order to upgrade from v9 to v11 you must first upgrade to v10.
:::

```yaml title="Chart.yaml" {9} showLineNumbers
apiVersion: v2
name: console
version: "0.0.0"
kubeVersion: ">= 1.20.0-0"
description: Self Hosted Console Installation Chart
type: application
dependencies:
- name: mia-console
  version: "X.Y.Z"
  repository: "https://nexus.mia-platform.eu/repository/helm-internal/"
```

When upgrading also make sure to check if any new configuration option is available or if something has been removed.

:::info
The Chart version follows [semver](https://semver.org/) policy so any breaking change with the Chart will always be followed by a Major release. Minor releases may include new configuration options while as a general rule of thumb, patches never holds new configuration options but only internal updates and fixes.
:::

## v11 - version upgrades

### Upgrade from v11.2.1 to v11.3.0

With version v11.3.0 (Chart version v9.3.0) a new service has been added, make sure to configure resource requirements and HPA according to your installation for `eventsManager`

```yaml
eventsManager:
  deploy:
    resources:
      requests:
        memory: "50Mi"
        cpu: "50m"
      limits:
        memory: "250Mi"
        cpu: "350m"
    hpa:
      annotations: {}
      minReplicas: 2
      maxReplicas: 4
      targetCPUUtilizationPercentage: 70
  rbacSidecar:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "300Mi"
        cpu: "300m"
  podDisruptionBudget:
    enabled: true
    minAvailable: 1
```

### Upgrade from v10.9.0 to v11.2.1

Between v10.9.0 (Chart version `v9.0.15`) and v11.2.1 (Chart version `v9.2.1`) the are no notable changes to take care of.
