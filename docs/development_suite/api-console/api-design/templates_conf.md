---
id: templates_conf
title:  How to add a new service to the Mia-Platform Marketplace
sidebar_label: Add a new Service
---
The Console is able to generate new services starting from a git project or from an existing docker image.

Services are viewable on Mia-Platform Marketplace, filterable on the basis of type and category.

Currently, all Marketplace components are associated to one among these following typologies:

* **Core Plugins**: services belonging to this category are meant to constitute a base plugins starter pack for an user.
* **Add-ons**: services belonging to this category are meant to constitute additional services that can be included in your Marketplace.
* **Start From Code**: services belonging to this category offer a list of examples and templates that the user can evolve at will.

The category of a service is composed by the addition of the preliminary classification above mentioned to one among the following labels:

* **Data Stream** 
* **Data Visualization** 
* **Fast-Data** 
* **Frontend Builders** 
* **Geolocations** 
* **Insurance** 
* **Monitoring** 
* **Payments** 
* **Security** 
* **Utilities** 
* **Authentication & Authorization** 
* **Database Management** 
* **Dev Portal** 
* **Files Management** 
* **Micro Frontend** 
* **Notifications** 
* **Orchestrators**
* **Serverless**
* **.NET Core**
* **Go**
* **Java/Kotlin**
* **Node.js**
* **Python**
* **Rust/C/Swift**
* **SPA - Angular/React**
* **Healthcare**

Who wants to contribute to our Marketplace can choose to associate a new component to one pre-existing category among the mentioned ones, or to propose a new one by contacting their Mia-Platform referent. 

In this page, we are going to show the guidelines on how to add a service to our Marketplace, whatever the type is: `plugin`, `template`, `example` or `application`.

## Add a Service

The services have to be added by using the `marketplace` page of the CMS of Mia-Platform Console.

To make sure that the Console can create new services starting from a template it is necessary to create the template on any public repository that provides a tar.gz file and to register it in the configuration of the Console.

### Template string replaced by Console during service creation

The Console will create a repository in which it will copy the template files replacing all occurrences of the following strings between `%` or the ones starting with `mia_template_` and ending with `_placeholder`:

* `mia_template_image_name_placeholder` -> name of the nexus image entered by the user.
* `%CUSTOM_PLUGIN_PROJECT_NAME%` -> name (label) of the Console project.
* `mia_template_project_id_placeholder` -> id of the Console project.
* `mia_template_service_name_placeholder` -> service name chosen by the user.
* `%CUSTOM_PLUGIN_SERVICE_DESCRIPTION%` -> description of the service chosen by the user.
* `%CUSTOM_PLUGIN_CREATOR_USERNAME%` -> username of the user who created the service.
* `%CUSTOM_PLUGIN_PROJECT_GIT_PATH%` -> full GitHub/GitLab path.
* `%GIT_PROVIDER_PROJECT%` -> name of the GitHub repository/GitLab project entered by the user.
* `%GIT_PROVIDER_GROUP%` -> name of the GitHub organization/GitLab group entered by the user.
* `%GIT_PROVIDER_BASE_URL%` -> URL base of GitLab/GitHub.
* `%NEXUS_HOSTNAME%` -> Nexus hostname.

:::warning
The following strings still work but are deprecated: it is recommended not to use them as they will be deleted in future versions
:::

* `%CUSTOM_PLUGIN_IMAGE_NAME%` -> name of the nexus image entered by the user
* `%CUSTOM_PLUGIN_PROJECT_ID%` -> id of the Console project
* `%CUSTOM_PLUGIN_PROJECT_NAMESPACE%` -> id of the Console project
* `%CUSTOM_PLUGIN_SERVICE_NAME%` -> service name chosen by the user

### Example of a service upload

Below is an example of the body of a template:

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
            ...
          }
        ],
        // if type is example or template archiveUrl is required, while pipelines is optional
        "archiveUrl": "https://git.tools.mia-platform.eu/api/v4/projects/238/repository/archive.tar.gz",
        "pipelines": {
          "gitlab-ci": {
            "path":"/path/to/your/pipeline/file/name.yml/raw"
          }
        }
      },
    // if type is application, more than one object can be inserted, allowing you to define more than one microservice configuration.
    }
  } 
}
```

:::info
The `resources` property shown into the json configuration constitutes a potential map of objects, wherein each microservice configuration represent an object. In fact, in case of the addition of an application into the Marketplace, the user will have to include all the resources constituting the application, with their respective configurations, inside `resources`.
To know more about what an application is about, visit this [page](./../../../marketplace/applications/mia_applications.md)
:::

The `archiveUrl` field must be a URL to the tar.gz version of the git project;
below is an example for project hosted on gitlab:

```url
https://your-host-gitlab/api/v4/projects/:project-id/repository/archive.tar.gz
```

Note that you can specify an `image` and a `supportedByImage` for the service;
both fields are `array of objects` that cointain the image file data; the result will be as the following:

![Console-custom-service](img/dev-console-custom-service.png)

The field `categoryId` helps to group services by their purpose.
Note that the categoryId shown into the body of a service identifies univocally the association of a specific category with a specific sub-category (among the ones above mentioned).

Another field to be specified is the `pipelines` one.
You can set up the CI file by yourself or use instead Mia-Platform pipeline templates.
In order to use the templates provided by Mia-Platform you can contact your referent to configure the pipeline templates within your Console installation.
In fact, when creating your microservice, the Console also generates a CI file (e.g. `.gitlab-ci.yml`) along side the service files.  
This step is important to perform Continuous Integration (CI) of your templates any time their code is modified.

Every service should be well documented and the field `documentation` helps in this purpose.  
In fact, during service creation by service, it is possible to access the service documentation by clicking  
on `View documentation` button, which will appear only if the `documentation` field has been filled correctly.  
Two properties must be specified inside `documentation`:

* `type`, currently only two types exist:
  * `markdown`: represents a markdown file (with `.md` file extension), for example a `README.md` file inside of a git repository.
  * `externalLink`: represents a link to an external website page, for example to Mia Platform documentation.
* `url`, contains the url where the markdown file can be retrieved (if its type is `markdown`), or the link where the user should be redirected (if its of type `externalLink`).



### Upload service image

If you have an image to upload, you should upload to Console using, for example:

```bash
  curl -F "image=@/path/to/image" "https://console.cloud.mia-platform.eu/v2/files/" -H 'cookie: <your cookie session here>' -H 'secret: <the secret goes here>'
```

Example response for this call:

```json
{
  "_id": "5d8a44205c34c8001240bdaa",
  "name": "magic.gif",
  "file": "65d15696-8724-4103-b672-e29518a55135.gif",
  "size": 1458668,
  "location": "/v2/files/download/65d15696-8724-4103-b672-e29518a55135.gif"
}
```

So, as imageUrl params in template body, you should use: `https://console.cloud.mia-platform.eu/v2/files/download/65d15696-8724-4103-b672-e29518a55135.gif`.

You can directly use the response body as image file object of your custom service, as described in the [Example of a service upload](#example-of-a-service-upload) paragraph.

#### Change a custom template

To change a custom template, you can use the postman collection below to modify the project.

First, fill with your cookie sid to authenticate. Once authenticated, get the template to modify using `Get templates` collection to find the correct id.
With the correct template id, `Change existing template` with the id, remove the unchanged fields and modify the correct one.

#### Postman collection

Create a JSON file with the following content, then import this collection into Postman:

```json
{
 "info": {
  "_postman_id": "71c305bb-0c66-41c0-91df-47d2054f67ac",
  "name": "template",
  "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
 },
 "item": [
  {
   "name": "Get templates",
   "request": {
    "method": "GET",
    "header": [
     {
      "key": "secret",
      "value": "Jh3cQ4bJYh^xyXSN@D94adEZ",
      "type": "text"
     },
     {
      "key": "Cookie",
      "value": "sid=fee6613711d92ff5d54332c04d3491d5fa8c7db95f75990c",
      "type": "text"
     }
    ],
    "url": {
     "raw": "{{API_CONSOLE_HOST}}/v2/api/services/",
     "host": [
      "{{API_CONSOLE_HOST}}"
     ],
     "path": [
      "v2",
      "api",
      "services",
      ""
     ]
    }
   },
   "response": []
  },
  {
   "name": "Add template",
   "request": {
    "method": "POST",
    "header": [
     {
      "key": "secret",
      "value": "Jh3cQ4bJYh^xyXSN@D94adEZ",
      "type": "text"
     },
     {
      "key": "Cookie",
      "value": "sid=fee6613711d92ff5d54332c04d3491d5fa8c7db95f75990c",
      "type": "text"
     },
     {
      "key": "Content-Type",
      "name": "Content-Type",
      "value": "application/json",
      "type": "text"
     }
    ],
    "body": {
     "mode": "raw",
     "raw": "{\n  \"name\": \"\",\n  \"archiveUrl\": \"\",\n  \"description\": \"\",\n  \"type\": \"\",\n  \"supportedBy\": \"\",\n  \"image\": [],\n  \"supportedByImage\": []\n}"
    },
    "url": {
     "raw": "{{API_CONSOLE_HOST}}/v2/api/services/",
     "host": [
      "{{API_CONSOLE_HOST}}"
     ],
     "path": [
      "v2",
      "api",
      "services",
      ""
     ]
    }
   },
   "response": []
  },
  {
   "name": "Change existing template",
   "request": {
    "method": "PATCH",
    "header": [
     {
      "key": "secret",
      "value": "Jh3cQ4bJYh^xyXSN@D94adEZ",
      "type": "text"
     },
     {
      "key": "Cookie",
      "value": "sid=fee6613711d92ff5d54332c04d3491d5fa8c7db95f75990c",
      "type": "text"
     },
     {
      "key": "Content-Type",
      "name": "Content-Type",
      "value": "application/json",
      "type": "text"
     }
    ],
    "body": {
     "mode": "raw",
     "raw": "{\n    \"$set\": {\n        \"name\": \"\",\n        \"archiveUrl\": \"\",\n        \"description\": \"\",\n        \"type\": \"\",\n        \"supportedBy\": \"\",\n        \"image\": [],\n        \"supportedByImage\": []\n    }\n}"
    },
    "url": {
     "raw": "{{API_CONSOLE_HOST}}/v2/api/services/5cd4229b7da195000f957467",
     "host": [
      "{{API_CONSOLE_HOST}}"
     ],
     "path": [
      "v2",
      "api",
      "services",
      "5cd4229b7da195000f957467"
     ]
    }
   },
   "response": []
  }
 ],
 "protocolProfileBehavior": {}
}
```

### Configure default variables from CMS

From CMS you can customize each template by modifying the default values applied for the following properties:

* environment variables
* CPU and memory limitations
* liveness and readiness Paths
* log parser
* documentation path
* category
* pipelines
* documentation
* coming soon
* publish on Mia-Platform

#### Configure default environment variables

You can configure the environment variables of each service by adding the property `defaultEnvironmentVariables` inside the data model of each service. By modifying the map of the environment variables, you can overwrite the default environment variables applied by DevOps Console.

To use this feature, you have to fill the `defaultEnvironmentVariables` in this way:

```json
[
  {
    "name": "HTTP_PORT",
    "value": 8080
  }
]
```

:::info
You can also add a description field.
:::

#### Configure default resources

You can configure the CPU and memory limitations of each service by adding the property `defaultResources` inside the data model of each template. By modifying the map of the resources, you can overwrite the default limitations imposed by DevOps Console.

To use this feature, you have to fill the `defaultResources` in this way:

```json
{
  "cpuLimits": {
    "min": "10m",
    "max": "100m"
  },
  "memoryLimits": {
    "min": "100Mi",
    "max": "300Mi"
  }
}
```

:::info
Please note that in the previous example `min` corresponds to the `request` value in Kubernetes while `max` corresponds to the `limit` value in Kubernetes.
:::

:::warning
Measurements units are required. Limitations are expressed in terms of milliCPUs and MebiBytes.
:::

#### Configure default probes

You can configure the readiness and liveness paths of each service by adding the property `defaultProbes` inside the data model of each service. By modifying the map of the probes, you can overwrite the default paths applied by DevOps Console.

To use this feature, you have to fill the `defaultProbes` in this way:

```json
{
  "liveness": {
    "path": "/-/healthz"
  },
  "readiness": {
    "path": "/-/ready"
  }
}
```

#### Configure default log parser

You can specify a default log parser for each service by adding the property `defaultLogParser` inside the data model of each service. By selecting a log parser, you can overwrite the default selection applied by DevOps Console.

To use this feature, you have to select one `defaultLogParser` among these:

* `mia-plain` to collecting logs but not parsing them
* `mia-json` to parsing JSON logs based on the documented format
* `mia-nginx` to parsing logs of Nginx that were created using templates and services of Mia-Platform (website and api-gateway)

#### Configure default documentation path

You can set the documentation path of each service by adding the property `defaultDocumentationPath` inside the data model of each service. By modifying the documentation path, you can overwrite the default path applied by Console.

To use this feature, you have to set the `defaultDocumentationPath` string.
An example string can be as follows: `/documentation/json`.

#### Configure Component ID

When creating a service from marketplace a link to the original component id can be established by supplying the `componentId` property to the marketplace service. The newly created service will register this identifier in the `sourceComponentId` property.

#### Configure Console Links

A service created from marketplace can feature custom links to other console pages, managed by different microfrontend plugins; to configure them on newly created services setup new objects in the `links` property for each template or plugin you whish.

A link is an object shaped as follows:

- `label` _string_ (required): the label to be shown in the link button, it does not support internationalization and is shown right next to a _View_ copy (e.g. with label set to **Resource** the resulting button will be **View Resource**);
- `targetSection` _string_ (required): the name of the registered microfrontend where the link should land (e.g.: `flow-manager`);
- `enableIf` _string_: the name of a feature toggle to be used to optionally display the link. 

#### Coming Soon property

From CMS, when enable at true, the final user won't be able to install the item in its project, however documentation is still visible.

#### Coming Soon property

From CMS, this flag enables item aggregation on marketplaces where the marketplace features aggregated documentation

```



