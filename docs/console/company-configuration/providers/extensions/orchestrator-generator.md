---
id: orchestrator-generator
title: Orchestrator Generator
sidebar_label: Orchestrator Generator
---

Capability: `Orchestrator Generator`

An Orchestrator Generator can generate orchestrator's **files**, ready to **deploy**, which are saved in the **configuration repository**. For instance, it could generate Kubernetes files.
If the Extension is enabled, the Console will send a **POST request** to its Provider's API Base URL to generate the deploy files. The request body will contain some information about the Project and the Configuration. The Console will expect to receive, in response, the files.

## Request format

### Headers

For security concerns, the request is provided with a specific header, `X-Mia-Signature`, which can be used to validate that the payload comes from the Console.

| Header | Value |
|---|---|
| `X-Mia-Signature` | `hex(sha256(payload + secret))` |

### Body

The payload sent to the Extension is shaped as follows:


```json
{
  "project": {
    "name": "<Project Name>",
    "id": "<MongoId>",
    "projectId": "<projectId>",
  },
  "tenant": {
    "name": "<Company Name>",
    "id": "<tenantId>"
  },
  "environment": {
    "id": "<envId>",
    "name": "<Env name>",
    "isProduction": true|false
  },
  "configuration": {
    "services": {
      "serviceName": {
        "name": "serviceName",
        ...all services configurations
      }
    },
    "configMaps": {
      "config1": {
        "name": "config1",
        "files": [{
          "name": "file1",
          "content": "file1 content"
        }]
      }
    }
  }
}
```

#### Service data model

| Field          | Type     | Description | optional |
|----------------|----------|-------------|----------|
| `name`         | String   | Name of the service |  |
| `description`  | String   | Description of the service set in UI | | 
| `tags`         | String[] | List of tags set in UI | | 
| `dockerImage`  | String   | Service docker image | |
| `advanced`     | Boolean  | Flag to distinguish the data model for advanced services (if `true` check the advanced services data model)| ✔️ |
| `replicas`     | Number   | Number of service static replicas | |
| `createdAt`    | String   | ISOString of the service creation date | |
| `environment`  | [Env Schema](#env-schema) | Environment variables | |
| `annotations`  | Object   | Service annotation, fields (`name`, `value`, `description`) | |
| `labels`       | Object   | Service labels, fields (`name`, `value`, `description`) | |
| `resources`    | [Resource Schema](#resources-schema)   | CPU and MEM configuration | |
| `probes`       | [Probes Schema](#probes-schema) | K8S probes configuration | |
| `containerPorts` | ContainerPort[] | List of ports exposed by the container (fields: `name`, `from`, `to`) | |
| `configMaps`   | [ConfigMount[]](#configmount-schema) | List of configurations to be mounted | |
| `terminationGracePeriodSeconds` | Number | Grace period time configuration | |
| `exclusiveServiceExposure` | Boolean | Use this field to understand which containers should be exposed in the k8s Service | ✔️ |
| `additionalContainers` | [Container[]](#container-schema) | Extra containers to be installed in the service | ✔️ |

#### Env Schema

| Field   | Type     | Description   |
|---------|----------|---------------|
| `name`  | String   | Env var name  |
| `value` | String   | Env var value |
| `valueType` | `plain`/`secret`  | Env var value (if `secret`, use `secretName` and `secretKey`) |
| `secretName` | String | Name of the secret holding the env value |
| `secretKey` | String | Name of the secret key (withint the Secret `secretName`) holding the value for the env |

#### Resource Schema

The `resources` field holds two properties `cpuLimits` and `memoryLimits`, each of them having the following schema:

| Field   | Type     | Description     | Optional |
|---------|----------|-----------------|----------|
| `max`   | String   | CPU/MEM limit   | ✔️ |
| `min`   | String   | CPU/MEM request | ✔️ |

#### Probes Schema

The `probes` field holds two properties `readiness` and `liveness`, each of them having the following schema:

| Field   | Type     | Description     | Optional |
|---------|----------|-----------------|----------|
| `path`  | String   | Path to configure the `httpGet` probe   | ✔️ |
| `port`  | String   | Name of the container port exposing the probe | ✔️ |
| `initialDelaySeconds` | Number | Value for the `initialDelaySeconds` k8s configuration  | ✔️ | 
| `periodSeconds` | Number | Value for the `periodSeconds` k8s configuration  | ✔️ | 
| `timeoutSeconds` | Number | Value for the `timeoutSeconds` k8s configuration  | ✔️ | 
| `successThreshold` | Number | Value for the `successThreshold` k8s configuration  | ✔️ | 
| `failureThreshold` | Number | Value for the `failureThreshold` k8s configuration  | ✔️ |

#### ConfigMount Schema

Each `configMaps` item holds information about how to mount a specific ConfigMap found in the top-level `configMaps` field.

Mount information is the following:

| Field   | Type     | Description     | Optional |
|---------|----------|-----------------|----------|
| `name` | String | Name of the ConfigMap to be mounted | |
| `mountPath` | String | Path where the configuration files should be mounted | |
| `subPaths` | String[] | List of specific files that needs to be picked from the ConfigMap and mounted | ✔️ |

#### Container schema

Each additional container has a similar shape of the main service, holding the following properties subset: `name`, `dockerImage`, `exclusiveServiceExposure`, `containerPorts`, `probes`, `environment`, `resources`, and `configMaps`.

#### Service data model example

```json
{
    "name": "my-service",
    "description": "Some description",
    "tags": ["custom"],
    "dockerImage": "ghcr.io/mia-platform/crud-service",
    "swaggerPath": "/documentation/json",
    "advanced": false,
    "replicas": 1,
    "createdAt": "2022-10-18T13:51:49.959Z",
    "environment": [
        {
            "name": "SOME_VAR",
            "value": "VALUE",
            "valueType": "plain"
        }
    ],
    "annotations": [
        {
            "name": "mia-platform.eu/version",
            "value": "v11.5.0",
            "description": "Version of Mia-Platform used by the project"
        }
    ],
    "labels": [
        {
            "name": "app",
            "value": "crud-service",
            "description": "Name of the microservice, in the service selector",
        }
    ],
    "resources": {
        "cpuLimits": { "max": "300m", "min": "150m" },
        "memoryLimits": { "max": "300Mi", "min": "150Mi" }
    },
    "probes": {
        "liveness": {
            "path": "/-/healthz",
            "port": "http",
            "initialDelaySeconds": 15,
            "periodSeconds": 20,
            "timeoutSeconds": 1,
            "failureThreshold": 3
        },
        "readiness": {
            "path": "/-/ready",
            "port": "http",
            "initialDelaySeconds": 5,
            "periodSeconds": 10,
            "timeoutSeconds": 1,
            "successThreshold": 1,
            "failureThreshold": 3
        }
    },
    "configMaps": [{
        "name": "crud-service-collections",
        "mountPath": "/home/node/app/collections"
    }],
    "containerPorts": [{
        "name": "http",
        "from": 80,
        "to": 3000
    }],
    "terminationGracePeriodSeconds": 30,
    "additionalContainers": [
        {
            "name": "rbac-service",
            "dockerImage": "ghcr.io/rond-authz/rond:main",
            "exclusiveServiceExposure": true,
            "containerPorts": [{"name": "rbac-service","from": 80,"to": 9876}],
            "probes": {
                "liveness": { "path": "/-/rbac-healthz", "port": "rbac-service" },
                "readiness": { "path": "/-/rbac-ready", "port": "rbac-service" }
            },
            "environment": [
                {
                    "name": "HTTP_PORT",
                    "value": "9876",
                    "valueType": "plain"
                }
            ],
            "resources": {
                "cpuLimits": { "min": "100m", "max": "100m" },
                "memoryLimits": { "min": "60Mi", "max": "430Mi" }
            },
            "configMaps": [{
                "name": "rbac-sidecar-svc-opa-policies-config",
                "mountPath": "/configurations/opa",
            }, {
                "name": "rbac-sidecar-svc-oas-permissions-config",
                "mountPath": "/configurations/oas",
                "subPaths": ["crud-service-permissions.json"]
            }]
        }
    ]
}
```

## Response format

The response, coming from the Extension and received by the Console, must be an object holding a *key/value* pair for each file that needs to be saved to the configuration repository. The key will be threated as the file name while the value as the file content. The **file content must be a string**.

### Example

```json
{
    "values.yaml": "the content of the values file ...",
    "my-service.deployment.yml": "the content of the deployment file for my-service"
}
```