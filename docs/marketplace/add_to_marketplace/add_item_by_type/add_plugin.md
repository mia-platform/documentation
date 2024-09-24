---
id: add_plugin
title: Create a Plugin
sidebar_label: Create a Plugin
---

Plugins are ready-to-use microservices that only need some configuration from the user to work. They are defined by the *type* field with value `plugin` in the item document.

## Where to host plugins

The plugin must be hosted as a **Docker image**.  

The Docker image should be pushed on an accessible registry.
If you wish to use the **Mia-Platform private registry**, your Mia-Platform referent will provide the credentials to do it.

The Docker image must be specified in the `dockerImage` field in the service Marketplace document.

:::info
In versioned marketplace plugins, the `dockerImage` field depends on the version of the plugin used to install the microservice to the project. This means that, in the *Design* section, the `dockerImage` field is *read-only*, and cannot be modified, unless the user decides to detach the microservice or update the plugin to a different Marketplace item version.

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

### Properties of Plugin resources

:::info
The following information applies also to [Templates and Examples](/marketplace/add_to_marketplace/add_item_by_type/add_template_or_example.md).
:::

Each property described in the following paragraphs regarding the microservices configuration must be configured under the property `resources/services/:serviceId` as follows:

```json
{
  "name": "Service Name",
  ...
  "resources": {
    "services": {
      "service-id": {
        "defaultEnvironmentVariables": [...],
        "defaultConfigMaps": [...],
        ...
      }
    }
  }
}
```

The serviceId **must** be in `kebab-case` format.

Here below are listed all the properties that you can provide for each microservice item:
  
- **`itemId`**: a unique item id that can be used to identify the item and all the services generated from it. Each service created using this item will have the identifier value in the **sourceComponentId** property.
- **`defaultEnvironmentVariables`**: the environment variables that will overwrite the default environment variables applied by DevOps Console.  
  A list is expected, for each of them you need to provide:  
  - **`name`**: the variable name (generally, a key written in `UPPER_SNAKE_CASE`)
  - **`value`**: the variable default value
- **`defaultConfigMaps`**: the default ConfigMaps, if any, that will be mounted inside the container of the microservice.  
  A list is expected, for each of them you need to provide:  
  - **`name`**: the name of the ConfigMap
  - **`mountPath`**: the directory where the ConfigMap data will be added  
  
  You can also provide:
  - **`files`**: a list of files where the ConfigMap data will be stored. Each file should be an object with the following properties:
    - **`name`**: the name of the file
    - **`content`**: the initial content of the file
  - **`usePreserve`**: a boolean the indicates whether the existing files and directories in the mountPath directory should be preserved or not. If not set, it will be considered as false.
- **`defaultSecrets`**: the default secrets, if any, to be mounted inside the container of the  microservice.
  In particular, for each of them you need to provide:  
  - **`name`**: the name of the secret file  
- **`defaultProbes`**: the readiness and liveness paths of the service. By modifying the map of the probes, you can overwrite the default paths applied by DevOps Console.
- **`defaultLogParser`**: one of the following log parser types:
  - `mia-plain`: collects logs but does not parse them
  - `mia-json`: parses JSON logs based on the documented format
  - `mia-nginx`: parses logs of Nginx that were created using templates and services of Mia-Platform (website and api-gateway)
- **`defaultAnnotations`**: the service annotations, which can be used to provide additional information about your services for various purposes (such as configuration, monitoring, or automation). The annotations that start with `mia-platform.eu` are reserved, you are not allowed to use them.
  The field is an array of objects that represent the labels. Each object has the following fields:
  - `name`: the name of the label,
  - `value`: the value of the label,
  - `description`: description of the label,
  - `readOnly`: boolean that represent if you can change the value of the label through the
- **`defaultLabels`**: the service labels, which can be used to categorize, group, and select your service. The labels that start with `mia-platform.eu` are reserved, you are not allowed to use them.
  The field is an array of objects that represent the labels. Each object has the following fields:
  - `name`: the name of the label,
  - `value`: the value of the label,
  - `description`: description of the label,
  - `readOnly`: boolean that represent if you can change the value of the label through the Console
- **`defaultDocumentationPath`**: the APIs documentation path.
- **`defaultResources`**: CPU and memory limitations of the service, which can be used to overwrite the default limitations imposed by DevOps Console for these parameters.
- **`visibility`**: this property determines the visibility of the Marketplace item you are creating. If not set, the service will only be visible within the specified Company mentioned in the tenantId property.
  - **`allTenants`**: a boolean that indicates whether your service should be visible to all other Companies, making it accessible if set to `true`.
  - **`public`**: a boolean that indicates wether the Marketplace item is public and visible also to not logged in users.
- **`providerId`**: the id of the provider that should be used to perform Git operations on your Marketplace item repository. If left unset, your project Git provider will be used instead.

:::caution
Please note that in this configuration **`min`** corresponds to the **`request`** value while **`max`** corresponds to the **`limit`** value specified in the Kubernetes documentation.  

In addition, measurement units are required. Resources are expressed in terms of milliCPUs (`m`) and MebiBytes (`Mi`) respectively for CPU and Memory.
:::

#### Configure Console Links

A service created from the Marketplace can feature custom links to other Console pages, managed by different microfrontend Plugins. To configure them on newly created services set up new objects in the `links` property for each plugin you wish.

A link is an object shaped as follows:

- **`label`** *string* (required): the label to be shown in the link button, does not support internationalization and it is shown right next to a  *View* copy (e.g. with the label set to **Resource** the resulting button will be **View Resource**);
- **`targetSection`** *string* (required): the name of the registered microfrontend where the link should land (e.g. `flow-manager`);
- **`enableIf`** *string*: the name of a feature toggle to be used to optionally display the link.

## Example of a Plugin

The following is an example of the manifest a plugin, called _MongoDB Reader_, released with version `1.0.0`.

This manifest can be used to add the element to the Marketplace.

<details><summary>Plugin manifest</summary>
<p>

```json
{
  "name": "MongoDB Reader",
  "description": "Provide MongoDB aggregation pipelines as REST API.",
  "type": "plugin",
  "categoryId": "database",
  "tenantId": "my-tenant",
  "itemId": "mongodb-reader",
  "version": {
    "name": "1.0.0",
    "releaseNote": "Initial release"
  },
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
  "providerId": "gitlab",
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

</p>
</details>

### Edit a marketplace item

While there are no restrictions on modifying an unversioned plugin, if the item already includes a version, only the following fields can be modified:

- `name`
- `description`
- `imageUrl`
- `supportedByImageUrl`
- `supportedBy`
- `categoryId`
- `repositoryUrl`
- `publishOnMiaDocumentation`
- `documentation`
- `comingSoon`
- `releaseStage`
- `providerId`
- `visibility`

Any modification on any other field will result in an error.
