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

## v12 - version upgrades

### Upgrade from last v11 to v12.0.0

#### User JWT with asymmetric signing key

:::caution

This feature introduce breaking changes in the chart configuration.
The user account authentication configuration has been moved under a dedicated object in the `values.yml` file. The key `jwtTokenSignKey` has been removed.

Additionally, users could be forced to login again, since tokens signed with the old signing key won't be valid anymore after the Console update.

:::

This version introduces the signing of the JWT token with an asymmetric algorithm, rather than the symmetric HS256 signing key used now.

From now on, tokens will be signed with a private key that you will need to provide.

Please follow the [Authentication Session signing](./30_authentication_provider.md#session-signing) guide for a detailed explanation on how to configure it.

#### Open Telemetry preview

This version introduces the possibility to enable the OpenTelemetry tracing feature (in preview). It is possible to enable it by follow the [OpenTelemetry tracing guide](./20_general_settings.md#optional-telemetry-configurations).

#### Introduction of Mia-Platform Company

Since this version, a Mia-Platform Company will be created during the installation of the Console. Such Company is needed for some internal logic, for example Marketplace items maintained by Mia-Platform will have a reference to this Company.

The value `.Values.configurations.miaPlatformDefaultCompanyId` is required.
When installing a fresh instance of the Console or while upgrading from a previous version, a new company will be created with the given value only if not already existing.

:::warning

You can also set this value to an already existing company, but be aware that this Company will be used also for installation internal purposes.
For this reason we strongly suggest to prefer a dedicated Company.

:::

## v11 - version upgrades

### Upgrade from v11.5.x to v11.6.0

This version introduces the possibility to create Jobs from CronJobs, and to delete Jobs.

Therefore, the Kubernetes Service Account set up on the clusters managed by your Console instance needs some specific permissions.

If during the [Cluster Preparation](../../development_suite/clusters-management/cluster-setup#cluster-preparation) you chose the Automatic procedure, just make sure that you have been provided at least the `v2.18.0` Mia-Platform Helm Chart.

Otherwise, if you manually configure your cluster connections, in the `ClusterRole` bound to the Console Kubernetes Service Account, add the `create` and `delete` verbs to the `jobs` resource, along with the already present `get` and `list`:

```yaml
- apiGroups:
      - "batch"
    resources:
      - "jobs"
    verbs:
      - "get"
      - "list"
      - "create"
      - "delete"
```

### Upgrade from v11.4.0 to v11.4.1

With version v11.4.1 (Chart version v9.5.0) the feature toggle service now uses Rönd, therefore `rbacSidecar` configurations should be added:

```yaml
featureToggleService:
  deploy:
    # ...
  rbacSidecar:
    resources:
      requests:
        memory: "100Mi"
        cpu: "100m"
      limits:
        memory: "200Mi"
        cpu: "200m"
```

### Upgrade from v11.3.0 to v11.4.0

With version v11.4.0 (Chart version v9.4.0) a new service has been added, make sure to configure resource requirements and HPA according to your installation for `exportService`

```yaml
exportService:
  deploy:
    resources:
      requests:
        memory: "200Mi"
        cpu: "50m"
      limits:
        memory: "500Mi"
        cpu: "350m"
    hpa:
      annotations: {}
      minReplicas: 2
      maxReplicas: 4
      targetCPUUtilizationPercentage: 70
  podDisruptionBudget:
    enabled: true
    minAvailable: 1
```

Furthermore, `configurations.exportServiceHostname` value is removed. So, you can remove it from your values file.

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
