---
id: service-specific-configurations
title: Service Specific Configuration
sidebar_label: Service Specific Configurations
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

Mia-Platform Console architecture is composed by several microservices, to better respond to your user-load you can fine tune the configuration for each service following these configurations.

## General configuration options

:::note
All of the following values are root values for the `mia-console` chart values.
:::

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `apiGateway` | [Service Conf](#service-conf) | The configurations for the API Gateway Service |  | ✅ |
| `rateLimitEnvoy` | [Service Conf](#service-conf) | The configurations for the API Gateway Rate Limit Service |  | ✅ |
| `apiPortal` | [Service Conf](#service-conf) | The configurations for the API Portal Service |  | ✅ |
| `authenticationService` | [Service Conf](#service-conf) | The configurations for the Authentication Service |  | ✅ |
| `authorizationService` | [Service Conf](#service-conf) | The configurations for the Authorization Service |  | ✅ |
| `backendService` | [Service Conf](#service-conf) | The configurations for the Console Backend Service |  | ✅ |
| `crudService` | [Service Conf](#service-conf) | The configurations for the CRUD Service |  | ✅ |
| `deployService` | [Service Conf](#service-conf) | The configurations for the Deploy Service |  | ✅ |
| `environmentsVariables` | [Service Conf](#service-conf) | The configurations for the Environment Variables Service |  | ✅ |
| `filesService` | [Service Conf](#service-conf) | The configurations for the Files Service |  | ✅ |
| `kubernetesService` | [Service Conf](#service-conf) | The configurations for the Kubernetes Service |  | ✅ |
| `loginSite` | [Service Conf](#service-conf) | The configurations for the Login website Service |  | ✅ |
| `notificationProvider` | [Service Conf](#service-conf) | The configurations for the Notification Provider Service |  | ✅ |
| `swaggerAggregator` | [Service Conf](#service-conf) | The configurations for the Swagger Aggregator Service |  | ✅ |
| `websites` | [Service Conf](#service-conf) | The configurations for the Console website Service |  | ✅ |
| `miaCraftBff` | [Service Conf](#service-conf) | The configurations for the mia-craft backend for frontend |  | ✅ |
| `rbacManagerBff` | [Service Conf](#service-conf) | The configurations for the rbac-manager backend for frontend to handle users and iam |  | ✅ |
| `rbacStandalone` | [Service Conf](#service-conf) | The configurations for a rbac service standalone |  | ✅ |
| `tenantOverviewBff` | [Service Conf](#service-conf) | The configurations for the tenant overview service |  | ✅ |
| `bindingsCleaner` | [Service Conf](#service-conf) | The configurations for the bindings cleaner cronjob |  | ✅ |
| `configurationsCleaner` | [Service Conf](#service-conf) | The configurations for the configurations history cleaner cronjob |  | ✅ |
| `mailService` | [Service Conf](#service-conf) | The configurations for the mail service |  | ✅ |
| `featureToggleService` | [Service Conf](#service-conf) | The configurations for the feature toggle service |  | ✅ |
| `licenseManager` | [Service Conf](#service-conf) | The configurations for the license manager service |  | ✅ |
| `backoffice` | [Service Conf](#service-conf)| The configurations for Backoffice service |  | ✅ |
| `eventsManager` | [Service Conf](#service-conf)| The configurations for the events-manager service |  | ✅ |
| `licenseMetricsGenerator` | [CronJob Conf](#cronjob-conf)| The configurations for the license metrics generator CronJob |  | ✅ |
| `rbac` | [Annotation Conf](#annotations-conf)| The configurations for the RBAC resources |  | ✅ |
| `updateScripts.marketplaceCategories` | [Job](#job)| The configurable part of the marketplace categories hook |  | ✅ |
| `updateScripts.consoleVersionUpgrader` | [Job](#job)| The configurable part of the console-version-upgrader hook |  | ✅ |

### Service Conf

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `deploy` | [Deployment Conf](#deployment-conf) | An object that describe the configurable part of a deployment |  | ❌ |
| `service` | [Annotation Conf](#annotations-conf) | An object that describe the configurable part of a kubernetes service |  | ❌ |
| `rbacSidecar` | [RBAC Sidecar Conf](#rbac-sidecar-conf) | An object that describe the configurable part of the RBAC Sidecar service |  | ❌ |

### CronJob Conf

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `cronjob` | [CronJob](#cronjob) | An object that describe the configurable part of a cronjob |  | ❌ |

### Deployment Conf

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `image` | [Docker Image](#docker-image) | The docker image configurations |  | ❌ |
| `annotations` | [Annotation Conf](#annotations-conf)  |  |  | ✅ |
| `resources` | object | A kubernetes resource object for the container |  | ✅ |
| `affinity` | object | A kubernetes affinity object for the pod |  | ✅ |
| `nodeSelector` | object | A kubernetes nodeSelector object for the pod |  | ✅ |
| `tolerations` | array | A kubernetes tolerations array for the pod |  | ✅ |
| `hpa` | [HPA Conf](#hpa) | A kubernetes hpa object to enable horizontal pod autoscaler |  | ✅ |
| `podDisruptionBudget` | [PodDisruptionBudget](#poddisruptionbudget) | A kubernetes PodDisruptionBudget object |  | ✅ |
| `podSecurityContext` | [Pod Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod) | A kubernetes pod security context object |  | ✅ |

### Docker Image

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `repository` | string | The docker image name without tag |  | ❌ |
| `version` | string | A valid docker image tag |  | ❌ |
| `registry` | string | A valid docker image registry |  | ✅ |
| `pullPolicy` | string | The policy for pulling the docker image, one of `IfNotPresent` or `Always` | `IfNotPresent` | ✅ |

### HPA

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `minReplicas` | integer | The minimum number of replicas, must not be lower than 1 |  | ❌ |
| `maxReplicas` | integer | The maximum number of replicas |  | ❌ |
| `targetCPUUtilizationPercentage` | integer | Percentage of CPU usage at which the pod should scale. |  | ❌ |
| `annotations` | [object](#annotations-conf) |  |  | ✅ |

### PodDisruptionBudget

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `enabled` | boolean | If PodDisruptionBudget must be enabled | `false` | ✅ |
| `minAvailable` | integer | Number of pods from that set that must still be available after the eviction  |  | ❌ |
| `maxUnavailable` | integer | Number of pods from that set that can be unavailable after the eviction |  | ❌ |

### Annotations Conf

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `annotations` | object | A Kubernetes valid annotation object |  | ✅ |
| `labels` | object | A Kubernetes valid labels object |  | ✅ |

### RBAC Sidecar Conf

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `annotations` | object | A Kubernetes valid annotation object |  | ✅ |
| `resources` | object | A Kubernetes valid resources object |  | ✅ |

### CronJob

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `image` | [Docker Image](#docker-image) | The docker image configurations |  | ❌ |
| `annotations` | [Annotation Conf](#annotations-conf)  |  |  | ✅ |
| `resources` | object | A kubernetes resource object for the container |  | ✅ |
| `affinity` | object | A kubernetes affinity object for the pod |  | ✅ |
| `nodeSelector` | object | A kubernetes nodeSelector object for the pod |  | ✅ |
| `tolerations` | array | A kubernetes tolerations array for the pod |  | ✅ |
| `podSecurityContext` | [Pod Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod) | A kubernetes pod security context object |  | ✅ |

### Job

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `image` | [Docker Image](#docker-image) | The docker image configurations |  | ❌ |
| `annotations` | [Annotation Conf](#annotations-conf)  |  |  | ✅ |
| `resources` | object | A kubernetes resource object for the container |  | ✅ |
| `affinity` | object | A kubernetes affinity object for the pod |  | ✅ |
| `nodeSelector` | object | A kubernetes nodeSelector object for the pod |  | ✅ |
| `tolerations` | array | A kubernetes tolerations array for the pod |  | ✅ |
| `podSecurityContext` | [Pod Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod) | A kubernetes pod security context object |  | ✅ |

### Examples

```yaml
mia-console:
  authenticationService:
    deploy:
      image:
        version: "AUTHN-VERSION"
      resources:
        requests:
          cpu: "10m"
          memory: "30Mi"
        limits:
          memory: 70Mi
      hpa:
        annotations: {}
        minReplicas: 2
        maxReplicas: 3
        targetCPUUtilizationPercentage: 70

  crudService:
    deploy:
      image:
        version: "CRUD-VERSION"
      resources:
        requests:
          memory: "70Mi"
          cpu: "20m"
        limits:
          memory: "250Mi"
          cpu: "50m"
      hpa:
        annotations:
          foo: bar
        minReplicas: 2
        maxReplicas: 4
        targetCPUUtilizationPercentage: 70
```

## Suggested resources

Based on the number of users, you might want to change the CPU and Memory resources configurations for each service; when doing so you can take the examples provided in the [Installation Chart Example page](./10_installation-chart-example.md) which are enough to manage up to 300 monthly active users. If you have less or more users you can reduce or increase the resources as you prefer and fine-tune your installation resource consumption.

:::info
To better size the Console cluster dimension, consider that the minimum allocatable memory (RAM) and core (CPU) values should be at least equal to the sum of the requested ones set in your installation chart for all services.
:::

## Deploy with High Availability

To enable High Availability you can configure HPA for each service just by following the example below

```yaml
mia-console:
  ...

  <SERVICE_NAME>:
    deploy:
      hpa:
        annotations: {}
        minReplicas: 2
        maxReplicas: 4
        targetCPUUtilizationPercentage: 70
```

For all the Console services you want to replicate, set the `<SERVICE_NAME>` with the correct value, adjust the `minReplicas`, `maxReplicas` and the `targetCPUUtilizationPercentage` (which is the percentage of CPU used compared to the requested CPU set) values with the desired ones.

In the configuration shown in the example, the `<SERVICE_NAME>` will have at least 2 running pods and it will be automatically replicated up to 4 times when the service CPU usage exceeds the request value set.