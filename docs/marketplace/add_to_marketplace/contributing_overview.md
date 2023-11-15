---
id: contributing_overview
title:  Add a new element to the Marketplace
sidebar_label: Add a new element to the Marketplace
---

In this section, we dive into the process of creating a new component for the Marketplace, analyzing the main differences between different types of components and providing some configuration examples.

:::info
Marketplace items can only be created and managed by people with access to the Mia-Platform Console CMS, therefore you may have to ask your Mia-Platform referent to add your Marketplace items for you.
:::

## Public and Internal Company Marketplace

Mia-Platform public Marketplace is the place where every Company can find most of the components needed to set up its Project architecture. It is publicly available on Mia-Platform Console, meaning that all Companies can view and make use of its items.

However, a Company might want to have its own internal Marketplace, fulfilled also with components that must not be shared with everyone else outside the Company.

To achieve this, a Company Owner or a Project Administrator can create new Company-related components **from the CMS** by specifying their Company's identifier in the `tenantId` field. These items will be visible only to those who are part of that specific Company. This means that, inside the Marketplace of that specific Company, users of that Company will have visibility of both Company-related and public Marketplace components.

Company Owners and Project Administrators can create, delete and update those Marketplace items exclusively available for their Company, but they cannot manage public Marketplace items.  
The Console Super User role, instead, has permission to manage all Marketplace items from the CMS without any limitations.

### Deciding whether to create a private or public Marketplace item

The choice between a private and public Marketplace involves benefits on both sides that should be carefully analyzed before making a decision.

Creating an item within the private Marketplace is undoubtedly the better choice when you want to make something highly specialized available for the specific use cases of your Company. If the item cannot be generalized and would have little value for other Companies, then a private Marketplace is the way to go. Additionally, in this case, creating items within the private Marketplace allows for complete ownership in managing them, resulting in a faster maintenance process.

On the other hand, publishing your items in the private Marketplace leads to a loss of corporate visibility that you would otherwise have by making your item publicly available in the Marketplace. It also means missing out on the opportunity to receive reviews from the Mia-Platform team and potential external contributions that can help your product grow and improve more rapidly.


:::info
If you want to contribute to the **Mia-Platform Marketplace** by making your Marketplace item accessible to other Companies, you can visit [this page](/marketplace/add_to_marketplace/marketplace_items_accessibility.md).
:::

:::info
To learn how to migrate an item from the public to private Marketplace and vice versa, please refer to the [dedicated page](/marketplace/add_to_marketplace/change_marketplace_item_visibility.md).
:::

## Marketplace components

Mia-Platform Marketplace can be populated with components belonging to one of the following typologies:

- **plugins**: services for which users have no access to the actual code. Users will still be able to download their Docker image, configure and use them within their projects.  
- **templates** and **examples**: archives for which a new repository is generated. The developer will have direct access to the new repository (created in their project scope) and will be able to evolve its code at will. A template is a repository that, net of the development environment and framework setup, is empty; an example, instead, also implements some features tailored to help the user better familiarize with the development environment.  
- **applications**: bundles of resources that can be created and configured in the Mia-Platform Console within a few clicks. [Applications](/marketplace/applications/mia_applications.md) are composed of microservices (Plugins, Examples, and Templates), endpoints, CRUD collections, and public variables. Users can monitor if all the resources composing an application have been correctly set up inside the project, as well as access their corresponding repository or configuration.  
- **proxy**: specific configurations used to invoke APIs that are not part of the current project but may be exposed by an external provider or another project. You can find more information about proxies in this [section](/development_suite/api-console/api-design/proxy.md).  

:::note
Marketplace components are identified by a **category** (e.g. Data Stream, Data Visualization, Insurance, Healthcare... ).

Once the request has been taken over, together with the Mia-Platform referent it will be possible to determine whether the component can be associated to a pre-existing category, or whether a new category will be needed.
:::

## How to configure a new component

Each Marketplace component is identified by a specific data model (a JSON document). Such models are stored on a MongoDB collection and can be modified through the Marketplace section of the Console CMS.

In the [Examples](#examples) section, you will find a few samples of preconfigured components configurations.

:::info
If you don't have the right permission to access the Console CMS, you should hand over the newly created component configuration to one of your Mia-Platform referents.

They will then be responsible for adding your data to the Marketplace components collection.
:::

### Common to every component

Here below are listed all the properties that must be provided for each type of component:

- **name**: the component name appearing in the Marketplace card
- **description**: a brief description (10 to 20 words) regarding the service functionalities
- **type**: the type of your component (plugin, template, example, application, or proxy)
- **comingSoon** and **releaseStage**: properties to identify the maturity of the component (learn how to configure them in a [dedicated section](#release-stage-of-a-new-component) later on this page)
- **categoryId**: a label to help categorize components by their purpose or use case. As specified before, categories are only created internally at Mia-Platform. The `categoryId` of a component uniquely determines both a specific category and a sub-category (e.g. Start from Code (category) - Node.js (subcategory) will be identified by the `categoryId` "nodejs")
- **supportedBy**: a label to identify the company that has produced the component (only used if `supportedByImage` is not provided)
- **image** and **supportedByImage**: respectively the image that will be associated with the component and the image that will be associated with the company that has produced it.
- **tenantId** (optional): the Company id, only needed if the component is a private Company-owned Marketplace component that must not be generally available on the public Mia-Platform Marketplace.
  
It will be possible to add images using dedicated input fields:  

![upload-images](img/cms-upload-image.png) ![upload-images](img/cms-upload-supported-by-image.png)

The final result will be as follows:  

![Console-custom-service](img/dev-console-custom-service.png)

### Common to microservice components (Plugins, Templates, Examples)

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

Here below are listed all the properties that you can provide for each microservice component:
  
- **componentId**: a unique component id that can be used to identify the component and all the services generated from it. Each service created using this component will have the identifier value in the **sourceComponentId** property.
- **defaultEnvironmentVariables**: the environment variables that will overwrite the default environment variables applied by DevOps Console.  
  In particular, for each of them you need to provide:  
  - **name**: the variable name (generally, a key written in `UPPER_SNAKE_CASE`)
  - **value**: the variable default value
- **defaultConfigMaps**: the default ConfigMaps, if any, that will be mounted inside the container of the microservice.  
  In particular, for each of them you need to provide:  
  - **name**: the name of the ConfigMap
  - **mountPath**: the directory where the ConfigMap data will be added  
  
  You can also provide:
  - **files**: a list of files where the ConfigMap data will be stored. Each file should be an object with the following properties:
    - **name**: the name of the file
    - **content**: the initial content of the file
  - **usePreserve**: a boolean the indicates whether the existing files and directories in the mountPath directory should be preserved or not. If not set, it will be considered as false.
- **defaultSecrets**: the default secrets, if any, to be mounted inside the container of the  microservice.
  In particular, for each of them you need to provide:  
  - **name**: the name of the secret file  
- **defaultProbes**: the readiness and liveness paths of the service. By modifying the map of the probes, you can overwrite the default paths applied by DevOps Console.
- **defaultLogParser**: one of the following log parser types:
  - `mia-plain`: collects logs but does not parse them
  - `mia-json`: parses JSON logs based on the documented format
  - `mia-nginx`: parses logs of Nginx that were created using templates and services of Mia-Platform (website and api-gateway)
- **defaultAnnotations**: the service annotations, which can be used to provide additional information about your services for various purposes (such as configuration, monitoring, or automation). The annotations that starts with `mia-platform.eu` are reserved, you are not allowed to use them.
- **defaultLabels**: the service labels, which can be used to categorize, group, and select your service. The labels that starts with `mia-platform.eu` are reserved, you are not allowed to use them.
- **defaultDocumentationPath**: the APIs documentation path.
- **defaultResources**: CPU and memory limitations of the service, which can be used to overwrite the default limitations imposed by DevOps Console for these parameters.
- **visibility**: this property determines the visibility of the Marketplace item you are creating. If not set, the service will only be visible within the specified Company mentioned in the tenantId property.
  - **allTenants**: a boolean that indicates whether your service should be visible to all other tenants, making it public if set to `true`.
- **providerId**: the id of the provider that should be used to perform Git operations on your Marketplace item repository. If left unset, your project Git provider will be used instead.

:::caution
Please note that in this configuration **`min`** corresponds to the **`request`** value while **`max`** corresponds to the **`limit`** value specified in the Kubernetes documentation.  

In addition, measurement units are required. Resources are expressed in terms of milliCPUs (m) and MebiBytes (Mi) respectively for CPU and Memory.
:::

#### Configure Console Links

A service created from the Marketplace can feature custom links to other console pages, managed by different microfrontend plugins. To configure them on newly created services set up new objects in the `links` property for each template or plugin you wish.

A link is an object shaped as follows:

- **label** *string* (required): the label to be shown in the link button, does not support internationalization and it is shown right next to a  *View* copy (e.g. with the label set to **Resource** the resulting button will be **View Resource**);
- **targetSection** *string* (required): the name of the registered microfrontend where the link should land (e.g. `flow-manager`);
- **enableIf** *string*: the name of a feature toggle to be used to optionally display the link.

### Plugins

If the service you want to publish is a **plugin**:

- The service must be a **Docker image**.  
- The Docker image must be pushed on an accessible registry. If you use the **Mia-Platform registry**, your Mia-Platform referent will provide the credentials to do it.

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

### Example and Templates

If the service you want to publish is either an **Example** or a **Template**, then:

- The service must be a remote **Git repository**.
- The URL to the tar.gz version of the Git project must be specified in the `archiveUrl` field, optionally you can specify either the `sha` or the `ref` as query parameters. If you don't have access to CMS, this should be provided to your Mia-Platform referent in form of a Git clone URL.
- The service should ensure a Continuous Integration (CI) to update the service image any time his code is modified, through the `pipelines` field you can set up the CI file by yourself or use instead Mia-Platform pipeline templates.  
To use the templates provided by Mia-Platform, you can contact your referent to configure the pipeline templates within your Console installation. When creating your microservice, the Console will also generate a CI file (e.g. `.gitlab-ci.yml`) alongside the service files.
- The service must be well documented and the field `documentation` helps in it.  
In fact, during service creation, it is possible to access the service documentation by clicking on `View documentation` button, which will appear only if the `documentation` field has been filled correctly.  
Two properties must be specified inside `documentation`:  
  - `type`, currently only two types exist:
    - `markdown`: represents a markdown file (with `.md` file extension), for example, a `README.md` file inside a Git repository.
    - `externalLink`: represents a link to an external website page, for example to Mia Platform documentation.
  - `url`, contains the URL where the markdown file can be retrieved (if its type is `markdown`), or the link where the user should be redirected (if its of type `externalLink`).  

:::caution
By adding an **Example** or a **Template**, the code provided will act as a boilerplate for everyone creating a service from that Marketplace component, therefore that code will be accessible to all Console users.
:::  

Once the user creates a new microservice starting from your template or example, the Console will create a new Git repository in which it will copy all the template files.

:::info
Further details on creating a template are provided by visiting [this documentation page](/marketplace/templates/template_create.md).
:::

#### Configure Marketplace Strings

The files of your template repository can contain some special strings that will be replaced by the Console at the creation of the new microservice:

- `mia_template_image_name_placeholder`: name of the docker image entered by the user;
- `%CUSTOM_PLUGIN_PROJECT_NAME%`: name (label) of the Console project;
- `mia_template_project_id_placeholder`: id of the Console project;
- `mia_template_service_name_placeholder`: service name chosen by the user;
- `%CUSTOM_PLUGIN_SERVICE_DESCRIPTION%`: description of the service chosen by the user;
- `%CUSTOM_PLUGIN_CREATOR_USERNAME%`: username of the user who created the service;
- `%CUSTOM_PLUGIN_PROJECT_GIT_PATH%`: full path of the repository of the Git provider;
- `%GIT_PROVIDER_PROJECT%`: name of the Git project entered by the user (e.g. GitHub repository or GitLab project).
- `%GIT_PROVIDER_GROUP%`: name of the group of projects entered by the user (e.g. GitHub organization or GitLab group).
- `%GIT_PROVIDER_BASE_URL%`: URL base of the Git provider.
- `%NEXUS_HOSTNAME%`: docker registry hostname.

:::warning
The following strings still work but are deprecated: it is recommended not to use them as they will be deleted in future versions
:::

- `%CUSTOM_PLUGIN_IMAGE_NAME%`: name of the docker image entered by the user;
- `%CUSTOM_PLUGIN_PROJECT_ID%`: id of the Console project;
- `%CUSTOM_PLUGIN_PROJECT_NAMESPACE%`: id of the Console project;
- `%CUSTOM_PLUGIN_SERVICE_NAME%`: service name chosen by the user.

### Applications

Currently, applications support 4 types of resources:

- services (plugins, templates, examples)
- endpoints
- CRUD collections
- public variables

Therefore an application will include a **resources** field with the following structure:

```json
{
  "services": {},
  "endpoints": {},
  "collections": {},
  "unsecretedVariables": {},
  "listeners": {},
}
```

:::info
Only the **services** field must be necessarily configured for an application configuration to be valid.
:::

#### Configure Services

The **services** field of an application is an object composed of properties that reflect the microservice configurations seen in the previous paragraphs.

Thus, if you plan to add a plugin, a template, or an example to your application you can follow the same configuration. Remember to add general details to every microservice, such as name and description.

#### Configure Endpoints

The **endpoints** field of an application is an object composed of properties named as the endpoints composing it.

Here below are listed all the properties that must be provided for each endpoint:

- **defaultBasePath**: the base path of the endpoint
- **defaultPathRewrite**: the default path rewrite of the endpoint
- **description**: a brief description (10 to 20 words) regarding the endpoint functionalities
- **type**: a label to identify the type of endpoint:
  - `custom`: linked to a microservice
  - `crud`: linked to a CRUD collection
  - `view`: linked to a MongoDB view
  - `external`: linked to an external proxy
  - `cronjob`: linked to a cronjob
  - `cross-project`: linked to a cross-project proxy
  - `fast-data-projection`: linked to a Fast Data projection
  - `fast-data-single-view`: linked to a Fast Data single view
- **tags**: array of strings to arbitrarily catalog the endpoint in the Console
- **public**: whether the endpoint should require authentication
- **showInDocumentation**: whether the endpoint should appear in the API Portal section
- **secreted**: whether the endpoint should require an API key
- **service**: present only in custom type endpoints, identifies the microservice the endpoint is linked to
- **collectionId**: present only in CRUD type endpoints, identifies the collection the endpoint is linked to
- **pathName**: present only in CRUD type endpoints, identifies the path name of the collection di endpoint is linked to
  
:::caution
When you add an endpoint to an application make sure the resource the endpoint is linked to (microservice, collection, etc.) is also present in the application configuration.
:::

- **routes**: routes already configured for your endpoint.
  Each route should specify the following properties:
  - **id**: route id (e.g. POST/users)
  - **verb**: route verb: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
  - **path**: route path (e.g. /)
  - **public**: whether the route should require authentication
  - **showInDocumentation**: whether the endpoint should appear in the API Portal section
  - **secreted**: whether the endpoint should require an API key
  - **allowUnknownRequestContentType**: permit request content type different from application/json
  - **allowUnknownResponseContentType**: permit response content type different from application/json.

:::info
Every route boolean value (such as public, secreted, etc.) must comply with the following inheritance structure:

```json
{
  "inherited": boolean,
  "value": boolean
}
```

:::

#### Configure Collections

The **collections** field of an application is an object composed of properties named as the collections composing it.

Here below are listed all the properties that must be provided for each collection:

- **id**: the collection identifier (e.g. users)
- **description**: a brief description (10 to 20 words) regarding the collection functionalities
- **defaultName**: name proposed to the user when creating the collection
- **type**: `collection`, `view`
- **tags**: array of strings to arbitrarily catalog the collection in the Console
- **fields**: array of fields composing your collection data model.  
  Each field should specify the following properties:
  - **name**: the name of the field
  - **description**: a brief description (10 to 20 words) regarding the field purpose
  - **type**: `string`, `number`, `boolean`, `date`, `Geopoint`, `RawObject`, `Array_string`, `Array_number`, `Array_RawObject`, `ObjectId`
  - **required**: whether this field should be required in the data model
  - **nullable**: whether this field could be set to null
  - **sensitivityValue**: the level of data sensitivity associated with this field
  - **sensitivityDescription**: a brief description regarding the sensitivity classification
  - **encryptionEnabled**: whether this field should be encrypted in the database
  - **encryptionSearchable**: a brief description regarding the reason for the encryption
  
:::info
You can find more information regarding **sensitivity** and **encryption** properties in the [**gdpr** section](/development_suite/api-console/api-design/gdpr.md) of the documentation.
:::

- **indexes**: array of indexes used in your collection.  
  Each index should specify the following properties:
  - **name**: name of the index
  - **type**: `normal`, `geo`, `hash`, `TTL`
  - **unique**: whether this index should be unique
  - **fields**:array of fields composing your index data model. Index fields follow the same configuration expressed for collection fields
- **internalEndpoints**: array of internal endpoints present in your collection.  
  Each field should specify the following properties:
  - **basePath**: path of the internalEndpoint
  - **defaultState**: `DRAFT`, `PUBLIC`.

#### Configure Public Variables

The **unsecretedVariables** field of an application is an object composed of properties named as the public variables composing it.

Here below are listed all the properties that must be provided for each public variable:

- **productionEnv**: value to be used in production environments
- **noProductionEnv**: value to be used in no production environments

#### Configure Listeners

The **listeners** field of an application is an Object where the object `key` is the name of the listener and the value is an object made of the following properties:

- **name**: the name of the listener (same as the `key` of the Object)
- **port**: the port that listener will be listening to
- **description**: optional description for the listener
- **selectedByDefault**: whether new Endpoints should be exposed on this listener or not
- **ownedBy**: an Object made of the `componentIds` array. This array includes component ids of services that supports listeners and created by the same application template 


## Best Practices!

Here are listed some useful advice to strengthen your components:

- **Test**: each service must have well-tested code;
- **Logs**: each service should display the logs, to inform users about the actions they are currently performing and if any errors have been found during their execution.

## Release Stage of a new component

From the CMS of the Console, users can associate components with a **release stage** label that will help users identify the maturity of the component.

If you just started developing your component you can select the **coming soon** option to inform users about the imminent publication of your component.

Alternatively, you can choose among the available labels of a Marketplace component lifecycle:

- preview
- beta
- stable

For more information regarding release stages, take a look at the [components lifecycle](/marketplace/overview_marketplace.md#marketplace-component-lifecycle) section.

## Examples

<details><summary>Example Service configuration</summary>
<p>

```json
{
  "name": "MongoDB Reader",
  "description": "Provide MongoDB aggregation pipelines as REST API.",
  "type": "plugin",
  "categoryId": "database",
  "supportedBy": "mia-platform",
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

</p>
</details>

<details><summary>Example Application configuration</summary>
<p>

```json
{
  "name": "Developer Portal",
  "description": "Use this application to set up your Developer Portal in a few clicks.",
  "type": "application",
  "categoryId": "dev-portal",
  "supportedBy": "mia-platform",
  "image": [
    {
      "_id": "5db0105743875a0011618815",
      "name": "Dev Portal.png",
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
  "documentation": {
    "type": "externalLink",
    "url": "https://docs.mia-platform.eu/docs/dev_portal/overview"
  },
  "resources": {
    "services": {
      "crud-service": {
        "defaultConfigMaps": [
          {
            "name": "crud-service-collections",
            "mountPath": "/home/node/app/collections",
            "files": [],
            "link": {
              "targetSection": "collections"
            },
            "viewAsReadOnly": true
          }
        ],
        "defaultDocumentationPath": "",
        "defaultEnvironmentVariables": [
          {
            "name": "LOG_LEVEL",
            "value": "{{LOG_LEVEL}}"
          },
          {
            "name": "HTTP_PORT",
            "value": "3000"
          },
          {
            "name": "COLLECTION_DEFINITION_FOLDER",
            "value": "/home/node/app/collections"
          }
        ],
        "defaultResources": {
          "cpuLimits": {
            "max": "200m",
            "min": "100m"
          },
          "memoryLimits": {
            "max": "250Mi",
            "min": "70Mi"
          }
        },
        "description": "",
        "dockerImage": "nexus.mia-platform.eu/core/crud-service:5.2.1",
        "mapEnvVarToMountPath": {
          "collections": {
            "envName": "COLLECTION_DEFINITION_FOLDER",
            "type": "folder"
          }
        },
        "name": "crud-service",
        "repositoryUrl": "https://git.tools.mia-platform.eu/platform/core/crud-service",
        "type": "plugin",
        "componentId": "crud-service"
      },
      "docusaurus": {
        "archiveUrl": "https://git.tools.mia-platform.eu/api/v4/projects/8576/repository/archive.tar.gz",
        "defaultEnvironmentVariables": [
          {
            "name": "HTTP_PORT",
            "value": 8080
          }
        ],
        "defaultLogParser": "mia-nginx",
        "description": "",
        "name": "docusaurus",
        "repositoryUrl": "https://git.tools.mia-platform.eu/platform/dev-portal/mia-docusaurus/",
        "type": "template"
      }
    },
    "collections": {
      "components": {
        "id": "components",
        "description": "Collection of components",
        "defaultName": "components",
        "tags": [],
        "fields": [
          {
            "name": "name",
            "type": "string",
            "required": true,
            "nullable": false,
            "sensitivityValue": 0,
            "encryptionEnabled": false,
            "encryptionSearchable": false
          },
          {
            "name": "description",
            "type": "string",
            "required": false,
            "nullable": false,
            "sensitivityValue": 0,
            "encryptionEnabled": false,
            "encryptionSearchable": false
          }
        ],
        "indexes": [
          {
            "name": "_id",
            "type": "normal",
            "unique": true,
            "fields": [
              {
                "name": "_id",
                "order": 1
              }
            ]
          }
        ],
        "internalEndpoints": [
          {
            "basePath": "/components",
            "defaultState": "DRAFT"
          }
        ]
      }
    },
    "endpoints": {
      "/bff": {
        "defaultBasePath": "/bff",
        "defaultPathRewrite": "/",
        "description": "Endpoint /bff",
        "type": "custom",
        "tags": [],
        "public": false,
        "showInDocumentation": false,
        "secreted": false,
        "allowUnknownRequestContentType": false,
        "allowUnknownResponseContentType": true,
        "forceMicroserviceGatewayProxy": true,
        "service": "dev-portal-marketplace-backend",
        "routes": {
          "POST/requests": {
            "id": "POST/requests",
            "path": "/requests",
            "verb": "POST",
            "public": {
              "inherited": true
            },
            "secreted": {
              "inherited": true
            },
            "acl": {
              "inherited": true
            },
            "backofficeAcl": {
              "inherited": true
            },
            "showInDocumentation": {
              "inherited": true
            },
            "allowUnknownRequestContentType": {
              "inherited": true
            },
            "allowUnknownResponseContentType": {
              "inherited": true
            },
            "preDecorators": [],
            "postDecorators": []
          }
        }
      },
      "/components": {
        "defaultBasePath": "/components",
        "defaultPathRewrite": "/components",
        "description": "Endpoint /components",
        "type": "crud",
        "tags": [],
        "collectionId": "components",
        "pathName": "/",
        "public": true,
        "showInDocumentation": true,
        "secreted": false,
        "allowUnknownRequestContentType": false,
        "allowUnknownResponseContentType": false,
        "forceMicroserviceGatewayProxy": false,
        "routes": {}
      }
    },
    "unsecretedVariables": {
      "LOG_LEVEL": {
        "productionEnv": "info",
        "noProductionEnv": "debug"
      },
      "COMPONENTS_VERSION": {
        "productionEnv": "0.10.4",
        "noProductionEnv": "latest"
      }
    }
  }
}
```

</p>
</details>


<details><summary>Example Application with Envoy and Listeners</summary>
<p>

```json
{
  "name": "API Documentation Aggregator",
  "description": "This application groups the plugins API Portal and Swagger Aggregator in order to aggregate the individual Open APIs of all the microservices and show them through a graphical interface.",
  "type": "application",
  "categoryId": "devportal",
  "supportedBy": "Mia-Platform",
  "image": [
    {
      "_id": "5db0105743875a0011618815",
      "name": "Dev Portal.png",
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
  "services": {
    "api-portal": {
      "defaultEnvironmentVariables": [
        {
          "name": "HTTP_PORT",
          "value": "8080"
        }
      ],
      "defaultLogParser": "mia-nginx",
      "defaultDocumentationPath": "",
      "description": "Use Mia-Platform core API Portal to expose the swagger documentation of your development services in one unique place.",
      "dockerImage": "nexus.mia-platform.eu/api-portal/website:1.16.6",
      "name": "api-portal",
      "repositoryUrl": "https://git.tools.mia-platform.eu/platform/api-portal/website",
      "type": "plugin",
      "componentId": "api-portal",
      "containerPorts": [
        {
          "name": "http",
          "from": 80,
          "to": 8080,
          "protocol": "TCP"
        }
      ]
    },
    "swagger-aggregator": {
      "name": "swagger-aggregator",
      "dockerImage": "nexus.mia-platform.eu/core/swagger-aggregator:3.5.1",
      "defaultEnvironmentVariables": [
        {
          "name": "HTTP_PORT",
          "value": "3000"
        },
        {
          "name": "LOG_LEVEL",
          "value": "{{LOG_LEVEL}}"
        },
        {
          "name": "TRUSTED_PROXIES",
          "value": "10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
        },
        {
          "name": "CONFIG_FILE_PATH",
          "value": "/home/node/app/configs/config.json"
        }
      ],
      "type": "plugin",
      "description": "Use Mia-Platform core Swagger Aggregator to aggregate the individual swaggers of all the microservices indicated in the configuration file.",
      "componentId": "swagger-aggregator",
      "defaultDocumentationPath": "",
      "repositoryUrl": "https://git.tools.mia-platform.eu/platform/core/swagger-aggregator",
      "mapEnvVarToMountPath": {
        "swagger-aggregator-config": {
          "type": "file",
          "envName": "CONFIG_FILE_PATH"
        }
      },
      "defaultConfigMaps": [
        {
          "name": "swagger-aggregator-config",
          "mountPath": "/home/node/app/configs",
          "files": [],
          "viewAsReadOnly": true
        }
      ],
      "containerPorts": [
        {
          "name": "http",
          "from": 80,
          "to": 3000,
          "protocol": "TCP"
        }
      ]
    },
    "api-gateway": {
      "name": "api-gateway",
      "type": "plugin",
      "description": "Envoy API Gateway to route requests to the correct service and verify the need of authentication",
      "image": "api-gateway-envoy-plugin.png",
      "dockerImage": "envoyproxy/envoy:v1.26.2",
      "componentId": "api-gateway-envoy",
      "documentation": {
        "type": "externalLink",
        "url": "https://docs.mia-platform.eu/docs/runtime_suite/envoy-api-gateway/overview"
      },
      "defaultDocumentationPath": "",
      "publishOnMiaDocumentation": false,
      "defaultArgs": [
        "-c",
        "/etc/envoy/envoy.json",
        "-l",
        "{{LOG_LEVEL}}",
        "--log-format",
        "{\"level\":\"%l\",\"time\":\"%Y-%m-%dT%T.%fZ\",\"scope\":\"%n\",\"message\":\"%j\"}",
        "--drain-time-s",
        "50"
      ],
      "defaultLogParser": "mia-json",
      "defaultEnvironmentVariables": [],
      "defaultResources": {
        "memoryLimits": {
          "max": "250Mi",
          "min": "150Mi"
        },
        "cpuLimits": {
          "min": "150m",
          "max": "200m"
        }
      },
      "defaultProbes": {
        "liveness": {
          "port": "frontend",
          "path": "/healthz",
          "initialDelaySeconds": 15,
          "periodSeconds": 20
        },
        "readiness": {
          "port": "frontend",
          "path": "/healthz",
          "initialDelaySeconds": 5,
          "periodSeconds": 10
        }
      },
      "containerPorts": [
        {
          "name": "frontend",
          "from": 8080,
          "to": 8080
        },
        {
          "name": "backoffice",
          "from": 8081,
          "to": 8081
        },
        {
          "name": "admin",
          "from": 9901,
          "to": 9901
        }
      ],
      "execPreStop": [
        "bash",
        "-c",
        "echo -e 'POST /drain_listeners?graceful HTTP/1.1\r\nHost: localhost:9901\r\n\r' > /dev/tcp/localhost/9901 && sleep 55s"
      ],
      "defaultTerminationGracePeriodSeconds": 60,
      "defaultConfigMaps": [
        {
          "name": "api-gateway-envoy-config",
          "mountPath": "/etc/envoy",
          "files": [],
          "viewAsReadOnly": true,
          "link": {
            "targetSection": "endpoints"
          }
        }
      ]
    }
  },
  "endpoints": {
    "/documentations/api-portal": {
      "allowUnknownRequestContentType": true,
      "allowUnknownResponseContentType": true,
      "defaultBasePath": "/documentations/api-portal",
      "defaultPathRewrite": "/",
      "description": "",
      "forceMicroserviceGatewayProxy": false,
      "public": true,
      "routes": {
        "GET/": {
          "acl": {
            "inherited": false,
            "value": "true"
          },
          "allowUnknownRequestContentType": {
            "inherited": true
          },
          "allowUnknownResponseContentType": {
            "inherited": true
          },
          "backofficeAcl": {
            "inherited": true
          },
          "id": "GET/",
          "path": "/",
          "postDecorators": [],
          "preDecorators": [],
          "public": {
            "inherited": false,
            "value": true
          },
          "secreted": {
            "inherited": true
          },
          "showInDocumentation": {
            "inherited": true
          },
          "verb": "GET"
        },
        "GET/api/swagger/": {
          "acl": {
            "inherited": false,
            "value": "true"
          },
          "allowUnknownRequestContentType": {
            "inherited": true
          },
          "allowUnknownResponseContentType": {
            "inherited": true
          },
          "backofficeAcl": {
            "inherited": true
          },
          "id": "GET/api/swagger/",
          "path": "/api/swagger/",
          "postDecorators": [],
          "preDecorators": [],
          "public": {
            "inherited": true
          },
          "secreted": {
            "inherited": true
          },
          "showInDocumentation": {
            "inherited": true
          },
          "verb": "GET"
        }
      },
      "secreted": false,
      "service": "api-portal",
      "showInDocumentation": true,
      "tags": [
        "api-docs"
      ],
      "type": "custom"
    },
    "/documentations/api-portal/api": {
      "allowUnknownRequestContentType": false,
      "allowUnknownResponseContentType": false,
      "defaultBasePath": "/documentations/api-portal/api",
      "defaultPathRewrite": "/",
      "description": "",
      "forceMicroserviceGatewayProxy": false,
      "public": true,
      "secreted": false,
      "service": "swagger-aggregator",
      "showInDocumentation": true,
      "tags": [
        "api-docs"
      ],
      "type": "custom"
    },
    "/documentations/openapi": {
      "allowUnknownRequestContentType": false,
      "allowUnknownResponseContentType": false,
      "defaultBasePath": "/documentations/openapi",
      "defaultPathRewrite": "/openapi",
      "description": "",
      "forceMicroserviceGatewayProxy": false,
      "public": true,
      "secreted": false,
      "service": "swagger-aggregator",
      "showInDocumentation": true,
      "tags": [
        "api-docs"
      ],
      "type": "custom"
    },
    "/documentations/swagger": {
      "allowUnknownRequestContentType": true,
      "allowUnknownResponseContentType": true,
      "defaultBasePath": "/documentations/swagger",
      "defaultPathRewrite": "/swagger",
      "description": "",
      "forceMicroserviceGatewayProxy": false,
      "public": true,
      "routes": {
        "GET/": {
          "acl": {
            "inherited": false,
            "value": "true"
          },
          "allowUnknownRequestContentType": {
            "inherited": true
          },
          "allowUnknownResponseContentType": {
            "inherited": true
          },
          "backofficeAcl": {
            "inherited": true
          },
          "id": "GET/",
          "path": "/",
          "postDecorators": [],
          "preDecorators": [],
          "public": {
            "inherited": true
          },
          "secreted": {
            "inherited": true
          },
          "showInDocumentation": {
            "inherited": true
          },
          "verb": "GET"
        }
      },
      "secreted": false,
      "service": "swagger-aggregator",
      "showInDocumentation": true,
      "tags": [
        "api-docs"
      ],
      "type": "custom"
    }
  },
  "listeners": {
    "frontend": {
      "name": "frontend",
      "port": "8080",
      "selectedByDefault": true,
      "description": "Default listener for frontend API",
      "ownedBy": {
        "componentIds": [
          "api-gateway-envoy"
        ]
      }
    }
  }
}
```

</p>
</details>