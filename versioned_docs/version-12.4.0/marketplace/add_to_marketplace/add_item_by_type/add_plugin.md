---
id: add_plugin
title: Create a Plugin
sidebar_label: Create a Plugin
---

Plugins are ready-to-use microservices that only need some configuration from the user to work.

To configure a Plugin, make sure you followed the [common Marketplace item creation steps](/marketplace/add_to_marketplace/contributing_overview.md#creation-of-a-marketplace-item), then follow the paragraphs below to finalize the configuration.

## Where to host plugins

The plugin must be hosted as a **Docker image**.  

The Docker image should be pushed on an accessible registry. 
If you wish to use the **Mia-Platform private registry**, your Mia-Platform referent will provide the credentials to do it.

The Docker image must be specified in the `dockerImage` field in the service Marketplace document.

The service documentation of your plugin will be accessible from a specific link in the Marketplace, you also need to provide the documentation URL of your plugin and this must be inserted in the `documentation` field:  

```json
{
  "documentation" : {
    "type" : "externalLink",
    "url" : "https://docs.my-plugin.com/docs/configuration"
  }
}
```

## Categories List

The category list is constantly updated, check with your Mia-Platform referent for the updated list.

| ID                | Description                            |
|-------------------|----------------------------------------|
| `notification`    | Core Plugins - Notifications           |
| `business`        | Add-ons - Data Visualization           |
| `addonsecurity`   | Add-ons - Security                     |
| `stream`          | Add-ons - Data Stream                  |
| `monitoring`      | Add-ons - Monitoring                   |
| `addgeo`          | Add-ons - Geolocation                  |
| `payments`        | Add-ons - Payments                     |
| `fast-data`       | Add-ons - Fast Data                    |
| `frontendbuilder` | Add-ons - Frontend Builders            |
| `healthcare`      | Add-ons - Healthcare                   |
| `utility`         | Add-ons - Utilities                    |
| `scoring`         | Add-ons - Scoring Manager              |
| `data-catalog`    | Add-ons - Data Catalog                 |
| `fast-data-connectors` | Add-ons - Fast Data Connectors    |

Example of a Plugin


```json
{
  "name": "MongoDB Reader",
  "description": "Provide MongoDB aggregation pipelines as REST API.",
  "type": "plugin",
  "categoryId": "database",
  "tenantId": "my-tenant",
  "visibility": {
    "allTenants": true
  },
  "image": [
    {
      "_id": "5db0105743875a0011618815",
      "name": "MongoDB Reader.png",
      "file": "image.png",
      "size": 1532,
      "location": "/path/to/your/image.png",
      "sync": 0,
      "trash": 0
    }
  ],
  "supportedByImage": [
    {
      "_id": "5db0106143875a0011618816",
      "name": "MiaPlatform.png",
      "file": "imageSupport.png",
      "size": 139694,
      "location": "/path/to/your/imageSupport.png",
      "sync": 0,
      "trash": 0
    }
  ],
  "repositoryUrl": "https://git.tools.mia-platform.eu/platform/core/mongodb-reader",
  "documentation": {
    "type": "markdown",
    "url": "https://raw.githubusercontent.com/mia-platform-marketplace/Node-Template/master/README.md"
  },
  "resources": {
    "services": {
      "mongodb-reader": {
        "type": "plugin",
        "name": "mongodb-reader",
        "description": "Provide MongoDB aggregation pipelines as REST API.",
        "repositoryUrl": "https://git.tools.mia-platform.eu/platform/core/mongodb-reader",
        "dockerImage": "nexus.mia-platform.eu/core/mongodb-reader:2.0.4",
        "defaultEnvironmentVariables": [
          {
            "name": "LOG_LEVEL",
            "value": "{{LOG_LEVEL}}"
          },
          {
            "name": "HTTP_PORT",
            "value": 8080
          }
          {
            ...
          }
        ],
        "defaultConfigMaps": [
          {
            "name": "config-map-1",
            "mountPath": "/home/node/app/config",
            "files": [
              {
                "name": "config.json",
                "content": "{\"version\":\"1.0.0\",\"config\":{}}"
              }
            ]
          }
        ],
        "defaultSecrets": [
          {
            "name": "my-secret",
            "mountPath": "/home/node/app/secret",
          }
        ],
        "defaultResources": {
          "cpuLimits": {
            "min": "10m",
            "max": "100m"
          },
          "memoryLimits": {
            "min": "100Mi",
            "max": "300Mi"
          }
        },
        "defaultProbes": {
          "liveness": {
            "path": "/-/healthz"
          },
          "readiness": {
            "path": "/-/ready"
          }
        },
        "defaultLogParser": "mia-json",
        "defaultDocumentationPath": "/documentation/json",
        "componentId": "myId",
        // if type is example or template archiveUrl is required, while pipelines is optional
        "archiveUrl": "https://git.tools.mia-platform.eu/api/v4/projects/238/repository/archive.tar.gz",
        "pipelines": {
          "gitlab-ci": {
            "path":"/path/to/your/pipeline/file/name.yml/raw"
          }
        }
      },
    // if the type is application, more than one object can be inserted, allowing you to define more than one microservice configuration.
    }
  } 
}
```





