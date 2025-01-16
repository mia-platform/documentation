---
id: create_plugin
title: Create a Plugin
sidebar_label: Create a Plugin
---

Plugins are ready-to-use microservices that only need some configuration from the user to work. They are defined by the *type* field with value `plugin` in the item document.

## Where to host plugins

In the Mia-Platform Console, you can design your project by adding microservices coming from existing elements in the Marketplace.
Plugins are ready-to-use microservices that only need some configuration from the user to work.
You do not need to download the repository and/or review the code: the plugin is available in a registry so you only need the *Docker Image name* and you are ready to go.

To add your own *plugin* to the Company Marketplace, you have to host the plugin as a **Docker image**, that should be pushed on an accessible registry.
This Docker image name must be specified in the `dockerImage` field in the service Marketplace document.

:::info
In versioned marketplace plugins, the `dockerImage` field depends on the version of the plugin used to install the microservice to the project.
This means that, in the *Design* section, the `dockerImage` field is *read-only*, and cannot be modified, unless the user decides to detach the microservice or update the plugin to a different Marketplace item version (which means, selecting a different Docker image).
:::

## Definition of a Plugin resource

Plugins should follow the Marketplace item schema defined in the related section of the ["Create your Company Marketplace" page](/software-catalog/manage-items/overview.md#how-to-configure-a-new-item).
The *type* field must be equal to `plugin`, and the content of the field `resources` to include only a property called `services`.
Inside the `services` object, you should specify *only one property*, which is the plugin name as the key and the plugin configuration as the value.

Each property described in the following paragraphs regarding the microservices configuration must be configured under the property `resources/services/:serviceId` as follows:

```json
{
  "name": "Service Name",
  ...
  "resources": {
    "services": {
      "<<your-service-id>>": {
        "defaultEnvironmentVariables": [...],
        "defaultConfigMaps": [...],
        ...
      }
    }
  }
}
```

Instead of `<<your-service-id>>`, you must include the identifier of your service, which **must** be in `kebab-case` format and should not exceed the length of 63 characters.

:::info
The definition of services, and the following information related to the list of fields applies also to [Templates and Examples](/software-catalog/manage-items/mia-ctl/create/create-item-by-type/create_template_or_example.md), with the difference that the `services` object in Templates and Examples can include more than one key, which means more than one service.
:::

Here below are listed all the properties that you can provide for each microservice item:
  
- **`itemId`**: a unique item id that can be used to identify the item and all the services generated from it. Each service created using this item will have the identifier value in the **sourceComponentId** property.
- **`providerId`**: the id of the provider that should be used to perform Git operations on your Marketplace item repository. If left unset, your project Git provider will be used instead.
- **`visibility`**: this property determines the visibility of the Marketplace item you are creating. If not set, the service will only be visible within the specified Company mentioned in the tenantId property.
  - **`allTenants`**: a boolean that indicates whether your service should be visible to all other Companies, making it accessible if set to `true`.
  - **`public`**: a boolean that indicates wether the Marketplace item is public and visible also to not logged in users.
- **`defaultEnvironmentVariables`**: the environment variables that will overwrite the default environment variables applied by the Console.  
  In particular, for each of them you need to provide:
  - **`name`**: the variable name (generally, a key written in `UPPER_SNAKE_CASE`)
  - **`readOnly`** (default: false): a boolean that represents if you can change the value of the variable through the Console
  - **`description`** (optional): a brief description of the variable
  - **`managedBy`** (optional): a string that represents the Console section that manages the variable. For now, it can be empty or `fast-data`. It only works used in combination with the `readOnly` property set to `true`.
  - **`valueType`** (default: `plain`): the field controls whether the value of the variable is provided by the user or by a Kubernetes resource; at the moment, *Plain Text*, *Config Maps*, *Secrets* and *Downward API* are supported.
  
  When `valueType: plain`, the following field is **required**:
  - **`value`**: the variable default value; it can contain placeholders that will be replaced with the actual values when the service is created, as explained in the [interpolation section](#interpolating-default-labels-annotations-and-environment-variables-values).

  When `valueType: secret`, the following fields are **required**:
  - **`secretName`**: the name of the secret that contains the value of the variable
  - **`secretKey`**: the key of the secret that contains the value of the variable
  
  Be aware that the secret must be created in the same namespace where the service will be deployed. Since the secret cannot be created through the Console, the user must be made aware of this requirement when they want to deploy the service.
  It is recommended to let the `readOnly` property set to `false` (the default), to allow users to change the secret reference in case they have it with another name or key for any reason.

  When `valueType: configmap`, the following fields are **required**:
  - **`configMapName`**: the name of the ConfigMap that contains the value of the variable
  - **`configMapFileName`**: the key of the ConfigMap that contains the value of the variable

  We recommend to set the ConfigMap accordingly to the `defaultConfigMaps` property, seen in the next section.
  It is also recommended to let the `readOnly` property set to `false` (the default), to allow users to change the ConfigMap reference in case they have it with another name or file name for any reason.

  When `valueType: downwardAPI`, the following field is **required**:
  - **`fieldPath`**: the field path of the Downward API that contains the value of the variable.
  
  It can be any of the following Pod-level fields: `metadata.name`, `metadata.namespace`, `metadata.labels`, `metadata.uid`, `spec.serviceAccountName`, `spec.nodeName`, `status.hostIP`, `status.podIP`, `status.podIPs`, `metadata.annotations['<KEY>]`, where `<KEY>` is the name of a valid annotation key, `metadata.labels['<KEY>']`, where `<KEY>` is the name of a valid label key.

  It can also be any of the following Container-level fields: `resource.limits.cpu`, `resource.requests.cpu`, `resource.limits.memory`, `resource.requests.memory`, `resource.limits.ephemeral-storage`, `resource.requests.ephemeral-storage`.
  
  In case a container-level field is provided, the following field is also **required**:
  - **`containerName`**: the name of the container where the field is located. It is **required** only if the field is a container-level field; it must be **omitted for pod-level fields**.
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
- **`defaultAnnotations`**: the service annotations, which can be used to provide additional information about your services for various purposes (such as configuration, monitoring, or automation).
  The annotations that start with `mia-platform.eu` are reserved, you are not allowed to use them.
  The field is an array of objects that represent the labels. Each object has the following fields:
  - `name`: the name of the annotation
  - `value`: the value of the annotation; it can contain placeholders that will be replaced with the actual values when the service is created, as explained in the [interpolation section](#interpolating-default-labels-annotations-and-environment-variables-values).
  - `description`: description of the label,
  - `readOnly`: boolean that represent if you can change the value of the label through the
- **`defaultLabels`**: the service labels, which can be used to categorize, group, and select your service. The labels that start with `mia-platform.eu` are reserved, you are not allowed to use them.
  The field is an array of objects that represent the labels. Each object has the following fields:
  - `name`: the name of the label
  - `value`: the value of the label; it can contain placeholders that will be replaced with the actual values when the service is created, as explained in the [interpolation section](#interpolating-default-labels-annotations-and-environment-variables-values).
  - `description`: description of the label
  - `readOnly`: boolean that represent if you can change the value of the label through the Console
- **`defaultDocumentationPath`**: the APIs documentation path.
- **`defaultResources`**: CPU and memory limitations of the service, which can be used to overwrite the default limitations imposed by DevOps Console for these parameters.

:::caution
Please note that in this configuration **`min`** corresponds to the **`request`** value while **`max`** corresponds to the **`limit`** value specified in the Kubernetes documentation.  

In addition, measurement units are required. Resources are expressed in terms of milliCPUs (`m`) and MebiBytes (`Mi`) respectively for CPU and Memory.
:::

### Interpolating Default Labels, Annotations, and Environment Variables Values

The values of the `defaultLabels`, `defaultAnnotations`, and `defaultEnvironmentVariables` fields can contain placeholders that will be replaced with the actual values when a Console user creates the service.

Here is an exhaustive list of the placeholders that can be used:

- `%MICROSERVICE_NAME%`: the name of the created microservice
- `%PROJECT_ID%`: the human-readable ID of the project. It is a dash-separated string generated by the Console when a project is created, based on the project name.
- `%COMPANY_ID%`: the ID of the company that owns the project.
- `%TENANT_ID%`: alias for `%COMPANY_ID%`.

As example, suppose you create a Marketplace item of type `plugin`, with the following `defaultEnvironmentVariables`:

```json
[
  ...,
  {
    "name": "SOME_ENV_VAR",
    "value": "ms name: %MICROSERVICE_NAME%; project id: %PROJECT_ID%; company id: %COMPANY_ID%"
  }
]
```

For example, given a Project with the id `my-project` and a Company with the ID `my-company`, a Console user creates a Microservice from such plugin, naming the Microservice `my-ms`.

The microservice will be created with the env var `SOME_ENV_VAR` set as follows:

```json
{
   "name": "SOME_ENV_VAR",
   "value": "ms name: my-ms; project id: my-project; company id: my-company"
}
```

:::caution
Be aware of the limitations of the values where the placeholders will be interpolated.
For example, the labels values are limited to 63 characters, so the interpolated value must not exceed this limit.
Annotations have a limit of 256 characters, so the interpolated value must not exceed this limit.

Refer to Kubernetes documentation of [annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) and [labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/) for more information about the limits of the resources.

Failing to comply with these limitations will result in an error when deploying the service.
:::

:::info
Any unrecognized placeholder will be left as is in the final value.
:::

### Configure Console Links

A service created from the Marketplace can feature custom links to other Console pages, managed by different microfrontend Plugins.
To configure them on newly created services set up new objects in the `links` property for each plugin you wish.

A link is an object shaped as follows:

- **`label`** *string* (required): the label to be shown in the link button, does not support internationalization and it is shown right next to a  *View* copy (e.g. with the label set to **Resource** the resulting button will be **View Resource**);
- **`targetSection`** *string* (required): the name of the registered microfrontend where the link should land (e.g. `flow-manager`);
- **`enableIf`** *string*: the name of a feature toggle to be used to optionally display the link.

### Categories List

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

## Create a new Plugin

The following is an example of the manifest a plugin, called *MongoDB Reader*, released with version `1.0.0`.

This manifest can be used to add the element to the Marketplace.

<details><summary>Plugin manifest</summary>
<p>

```json
{
  "name": "MongoDB Reader",
  "description": "Provide MongoDB aggregation pipelines as REST API.",
  "type": "plugin",
  "categoryId": "database",
  "tenantId": "my-company-id",
  "itemId": "mongodb-reader",
  "version": {
    "name": "1.0.0",
    "releaseNote": "Initial release"
  },
  "visibility": {
    "allTenants": true
  },
  "image": "/path/to/your/image.png",
  "supportedByImage": "/path/to/your/imageSupport.png",
  "repositoryUrl": "https://git.tools.mia-platform.eu/platform/core/mongodb-reader",
  "providerId": "gitlab",
  "documentation": {
    "type": "markdown",
    "url": "https://raw.githubusercontent.com/mia-platform-marketplace/Node-Template/master/README.md"
  },
  "resources": {
    "services": {
      "mongodb-reader": {
        "name": "mongodb-reader",
        "componentId": "mongodb-reader",
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
      },
    }
  } 
}
```

</p>
</details>

## Publish a new Plugin

This section describes the steps required to publish a sidecar resource to the Marketplace via [miactl](/cli/miactl/10_overview.md), the Command Line Interface by Mia-Platform designed to interact with the Mia-Platform Console. Make sure to [configure miactl](/cli/miactl/20_setup.md) before proceeding with the next steps.

To upload the example resource defined above (`mongodb-reader`) to the marketplace, run the following command, specifying the file name and your Company (tenant) id:

```bash
> miactl marketplace apply -f ./mongodb-reader.json --company-id my-company-id
```

You should receive a success response similar to this one:

```bash
1 of 1 items have been successfully applied:

  OBJECT ID                 ITEM ID             STATUS   

  66423781fdd3d6dd3ca62b7b  mongodb-reader      Created 
```

You just created your plugin, which is now available on your `Company Marketplace`.

## Update the Plugin

You can update a Custom Resource Marketplace item by using the same `miactl marketplace apply` explained before, by including an updated file (either in `json` or `yaml` format).

While non-versioned items can be modified in place without any limitation (except for `itemId` and `tenantId` that identifies the resource to update), versioned Marketplace Custom Resource have some fields that cannot be modified.

If you want to do so, you must create a new version of the resource: for more information, refer to the [dedicated section on the _Create your Company Marketplace_ page](/software-catalog/manage-items/overview.md#versioned-resources).

Also remember that versioned elements does not allow the update of the `dockerImage` field, since the value is automatically tied with the released version: if you need to change the Docker Image, you should create a new version of the resource.

:::info
Versions are not mandatory but highly recommended to avoid overwriting existing resources.

Also, it is required to follow the [Semantic Versioning](https://semver.org/) convention when creating new versions: this convention is used to group the different versions of the same marketplace items and determine the _latest_ version that will be used by the Console to help the user to determine the best version to use and be notified of further updates.
:::

Of course you can do that always with `miactl marketplace apply` by using the same `itemId` and the same `tenantId` but with a new `name` inside the `version` field.
