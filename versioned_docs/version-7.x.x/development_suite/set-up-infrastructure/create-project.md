---
id: create-project
title:  Create a Project
sidebar_label: Create a Project
---

The project creation allows you to configure a project, which lifecycle could be wholly managed and developed through Console areas.

## How to set up Console

The first section of this guide allows you to have the prerequisites needed to create a project.
In particular, to create a project, you need to have already set up your Console and have already configured these three features:

* **Provider**: This will be used by the Console to correctly retrieve the third party service providers needed by your projects (e.g. the Git repository provider)
* **Tenant**: This is the upper level of the projects. Each created project shares the same information (environments, CI/CD integration and cluster information) of its tenant.
* **Template**: Repository with libraries and pre-filled configurations. Each tenant could have one or more template. Starting the project from an existent template, you can pre-fill active services in your project and start all the similar projects with the same configuration. For example, the template can define the pipelines and the usage (or not usage) of CMS in your project.

If you have already configured these features, you can directly [skip to the last section](#project-creation).

## CRUDs

You can find more info about how to create a CRUD visiting the [CRUD documentation](../api-console/api-design/crud_advanced.md)

### Create a Provider

If you already have the provider you need in your CRUD, you can [skip this section](#create-a-tenant).

This document will be used by services to correctly retrieve the information about the provider that you use for your projects.
This collection includes the following fields:

* `providerId` (*required*): A unique human readable identifier (ex: "my-git-provider" or "my-pipeline-provider");
* `type` (*required*): the name of provider. Current supported providers are:
  * Git providers: `gitlab`, `github`;
* `baseUrl` (*required*): the provider base url used to persist configurations;
* `apiBaseUrl` (*required*): the provider base url that core service used to call providers (example: gitlab.com/api or api.github.com/);

### Create a Tenant

If you already have a tenant, you can [skip this section](#create-a-template).

The tenant is the upper level of the projects. It allows to create a project configured inside an already existent infrastructure, which information are repeated for all the projects: *environments*, *cluster information*, *CI/CD integration*.

:::info
The fields in the tenant cannot be changed during project creation steps (if not specified otherwise).
:::

The fields necessary for this collection are:

* `name` (*required*): the name of the tenant to display in selection list;
* `tenantId` (*required*): the human-readable id of the tenant (e.g. mia-platform). It must adhere to this regex: `(^[a-z]+[a-z0-9-]*$)`;
* `description`: the description of the tenant;
* `defaultTemplateId`: the default template to be used in project creation. This could be changed during the project creation wizard steps;
* `cmsImageName`: cms docker image to interpolate in template archive. It should also contain the cms tag to use (if `cms-site` service is disabled in project creation, it will not be used).
* `coreLegacyImageName`: baas core docker image to interpolate in template archive. It should also contain the cms tag to use (if `baas-legacy` service is disabled in project creation, it will not be used).
* `environments` (*required*): an array of objects containing the definition of the environments for the tenant. The content of these arrays will be interpolated to replace `%projectId%` by inserting `projectId` field in project creation. Each object should contain, for example:

    ```js
      {
        "label": "Development",
        "envId": "development",
        "envPrefix": "development",
        "hosts": [
          {
            "host": "%projectId%.test.mia-platform.eu",
            "scheme": "https"
          },
          {
            "host": "cms.%projectId%.test.mia-platform.eu",
            "isBackoffice": true
          }
        ],
        "cluster": {
          "clusterId": "human-readable-id-of-the-cluster",
          "hostname": "127.0.0.1", // hostname of the cluster
          "namespace": "%projectId%-development",
          "kubeContextVariables": {
            "KUBE_URL": "KUBE_DEV_URL",
            "KUBE_TOKEN": "KUBE_DEV_TOKEN"
          }
        }
      }
    ```

  :::warning
  Do not set in cluster.kubeContextVariables object the plain values to access to the cluster. Write the variable key name for the specified environment (as in the example)! The values saved here are not encrypted.
  :::

* `environmentVariables`: an object that describes the configuration to enable the setup infrastructure environment variables section. The only supported type is `gitlab`.

  There are three ways to configure a project:

  1. **empty**: it is not set as a default in project creation, but should be configured manually after the project creation.

  1. **only type configuration**, for example:

      ```json
        {
          "type": "gitlab"
        }
      ```

      The project reads the variables from the first parent group of Configurations project in Gitlab.

      So, for example, with a gitlab project to be saved in
      `/clients/mia-platform/configurations`, the environment variables are written in `clients/mia-platform` group.

  1. **complete configuration**, for example:

      ```json
        {
          "type": "gitlab",
          "baseUrl": "https://my-gitlab-host",
          "storage": {
            "type": "projects",
            "path": "clients/mia-platform/configurations"
          }
        }
      ```

      this configuration is saved only in tenant, and should be retrieved at runtime in project fetching from tenant info. So if your tenant has all the environment variables of the projects set in the parent group, this setting could be changed for all the projects at the same time.

* `pipelines` (*required*): the CI/CD pipelines used by the tenant. It is an object, for example:

    ```json
      {
        "type": "gitlab-ci"
      }
    ```

* `availableNamespaces`: namespaces accessible internally from your project, using `cross-projects` endpoint. It is useful when your tenant is made up of several projects that communicate with each other. The content of this array will be interpolated to replace `%projectId%` with `projectId` field in project creation.

* `logicalScopeLayers`: an array of objects identifying the set of logical layers available in the current tenant. Each object is shaped as follows:
  * **name** : identifies the name of the logical layer
  * **order** : identifies the numerical order of the layer in order to display it according to the sorting defined by the user.
  When a project is merged with its tenant information, the `logicalScopeLayers` will be created in the project model according to its `layerId` value. Please refer to the section [How to create a project on Console] for further details.

* `repository` (*required*): object that specifies the information about the repository where have to be created the projects of this tenant. The object must have the following properties:
  * **providerId** (*required*): `providerId` existing into the providers crud. It is used to get information about the provider to use. This id is important because it affects many requests used by the developer Console
  * **basePath**: base path where will be created the project. The user needs to have permission for creating projects on this path.
  * **visibility**: visibility that will have the project.

:::caution
If gitProvider is `github`, the `basePath` have to be an existing organization. If it does not exist, it will not be created.
If gitProvider is `gitlab`, the basePath is the basePath of the group where to create the project. If the group does not exist, it will be created only if the user has the needed permission to create the group in its parent.

e.g.:

* /groupA/groupB -> if groupB does not exist AND user have permission to create group in groupA, then it will be created groupB.
* /groupA/groupB -> if groupB does not exist AND user have no permission to create group in A, then it will NOT be created groupB.
* /groupA/groupB -> if groupB does not exist AND groupA does not exist, then it will NOT be created any group.
:::

* `dockerImageNameSuggestion`: object that defines the docker image name suggestion that will be passed to every project created in your tenant. This suggestion will appear when you [create a microservice](../api-console/api-design/services#how-to-create-a-microservice-from-an-example-or-from-a-template) in the `Docker Image Name` field.  
The object should have the following properties:

  * **type** (*required*): string that defines the type of suggestion, currently three types exist:

    * `PROJECT_ID` (*default*): the suggestion for the Docker image name will be in the following format: `<project-id>/<your-service-name>`. This is the default behavior, even without setting this property the suggestion will follow this format. You must **not** set `prefix` property if you have chosen this type.
    * `REPOSITORY`: the suggestion for the Docker image name will be in the following format: `<your-group-name>/<your-repo-name>`. You must **not** set `prefix` property if you have chosen this type.
    * `CONSTANT_PREFIX`: the suggestion for the Docker image name will be in the following format: `<prefix-value>/<your-service-name>`. `prefix` property is required for this type and will replace `prefix-value`.  

  * **prefix**: string that defines the prefix that will appear in the suggestion for the Docker image name. This property must be defined only when **type** property value is `CONSTANT_PREFIX`.  

:::info
`<your-service-name>`, `<your-group-name>`, `<your-repo-name>`, are field values that you will decide during the [creation of a microservice](../api-console/api-design/services#how-to-create-a-microservice-from-an-example-or-from-a-template). Some of these values must be defined in order to receive a suggestion for the Docker image name (depending on the suggestion **type**).
:::

### Create a Template

If you already have a template, you can [skip this section](#how-to-create-a-project-archive).

A template is a repository which contains some project specific information.
Once you choose a tenant, you can choose a template.
The template allows you to pre-fill active services in your project and starts all the similar projects with the same configuration.
So, it is a base on which to create your project.

:::info
The fields set by the template can be changed during project creation.
:::

There are two ways of adding services to a template:

* Using an `api-console-config` which specifies the services that will be included in the projects created with that template, together with other details e.g. environment variables. This requires you to add an `api-console-config.json` file in the root directory of the project.
* Using `enabledServices` which only specifies whether a certain service is enabled or not, without the possibility of defining any other detail.

:::caution
The `enabledServices` can only be used for core services (i.e. `cms-site`, `cms-backend`, `v1-adapter`, `export-service`, `auth0-client` and `oauth-login-site`), while it is not working for services used from the Console that have been migrated to custom services (migrated services are now plugins, you can find them in the [marketplace](../../marketplace/overview_marketplace.md)). The only exception to this rule is that if your template uses api-console-config version 0.39 or lower, or do not use it at all, `enabledServices` will work for migrated services as well.
:::

The base structure of the `api-console-config.json` is as follows:

```json
{
  "endpoints": {...},
  "decorators": {...},
  "services": {...},
  "configmaps": {...},
  "version": "...",
  "platformVersion": "..."
}
```

If you create the `api-console-config.json` from an existing one, please remember to delete all the fields that do not match the structure above, since they will be created correctly by the console after save and deploy actions (one of the two, depending on the field).

How to compile the template:

* `name` (*required*): name of the template to display;
* `templateId` (*required*): the human-readable id of the template (e.g. mia-platform-multitenant-template). It must adhere to this regex: `(^[a-z]+[a-z0-9-]*$);`
* `description`: the description of the template;
* `archiveUrl`: URL to a gzip of the base project configuration folder. All the contents of this folder will be copied into the target configuration, correctly interpolated. If you have to create a custom template, click [here](#how-to-create-a-project-archive) to see how.
* `staticSecret`: some project could use the same static secret for a set of projects (especially used with architecture with multiple `api-gateway` entrypoints). Keys are optional. This is an object, for example:

  ```json
    {
      "secret": "my-secret",
      "clientType":"cms"
    }
  ```

* `enabledServices`: an object that contains as key the service handled by the Console and as value a boolean. If the value is true, the service is enabled and the Console will generate the configuration for that service, otherwise it will be skipped by the Console. For example:

    ```json
      {
        "api-gateway": true,
        "microservice-gateway": true,
        "crud-service": true,
        "session-manager": false,
        "auth-service": false,
        "baas-legacy": false,
        "cms-site": true,
        "cms-backend": true,
        "v1-adapter": true,
        "export-service": true,
        "swagger-aggregator": true,
        "login-site": false,
        "api-portal": true,
        "auth0-client": true,
        "authorization-service": true,
        "oauth-login-site": true
      }
    ```

* `deploy`: an object that identifies some deploy related configurations.

  ```json
    {
      "runnerTool": "mlp",
      "useMiaPrefixEnvs": false
    }
  ```

  * **runnerTool**: Set it to `mlp` if the project uses it as command line deployment tool. It is required to have the [Smart Deploy](../deploy/deploy#smart-deploy) feature enabled.
  * **useMiaPrefixEnvs**: Set it to **false** if you want the [Public Variables](../api-console/api-design/public_variables.md) to be saved without `MIA_` prefix. That depends on the command line deployment tool. If the project uses `mlp` you don't need to use the `MIA_` prefix.

:::note
If you switch `useMiaPrefixEnvs` from `true` to `false` you have to remove the `MIA_` prefix by hand. This is not made automatically by the Console.
:::

## How to create a project archive

The project archive is interpolated using [mustache.js](https://github.com/janl/mustache.js) as template system, using `%` as tags instead of default `{{` or `}}`.

*mustache.js* is a web template system, which allows you to generate custom templates by replacing all the general information, present in the web template, with your product or organization information.

You could create a project template to avoid copy/paste in every new project having the same base configuration.

At Mia-Platform, for example, we create a template to configure a project to use Auth0, headless CMS, API portal and Traefik configuration. So for a tenant that uses this template, creating this type of project will be a very simple process.

You can interpolate the template with some project data. With *mustache.js*, we could iterate through an array, so we can have some configuration iterated for all the environments.
The values you could use during template interpolation are:

For the project (you could access using `project.${field}`)

* projectId
* name
* configurationGitPath
* environments

Inside environments, you could access to:

* envId
* envPrefix
* cluster (an object containing `namespace` and `clusterId` string, `kubeContextVariables` object). Here you find the variables names for the specified environment where you set the cluster variable
* hosts (an array of object, with `host` and `isBackoffice` fields)

:::warning
Do not set in tenant in cluster.kubeContextVariables object the value to access to the cluster, but only the variable key name for the specified environment (as in the example)! The values saved here are not encrypted.
:::

An example of template for the `.gitlab-ci.yml` file:

```yml
include:
  # job template
  - project: 'platform/pipelines-templates'
    file: '/deploy/deploy-job.yml'
    ref: 'master'

%#tenant.cmsImageName%
variables:
  MIA_CMS_IMAGE_NAME: "%tenant.cmsImageName%"
%/tenant.cmsImageName%
%#project.environments%

%envId%:
  stage: release
  extends: .deploy_job

  variables:
    KUBE_URL: "\${cluster.kubeContextVariables.KUBE_URL}"
    KUBE_TOKEN: "\${cluster.kubeContextVariables.KUBE_TOKEN}"
    KUBE_CA_PEM: "\${cluster.kubeContextVariables.KUBE_CA_PEM}"
    ENVIRONMENT_PREFIX: "%envPrefix%_"

  only:
    variables:
      - $ENVIRONMENT_TO_DEPLOY == "%envId%"
%/project.environments%
```

In this example, we write the variables `MIA_CMS_IMAGE_NAME` only if cmsImageName is set in the tenant.

All the section between `%#project.environments%` and `%/project.environments%` will be written for `n` times, where `n` is the number of environments. So, inside the environment, you could use the environment specific fields.
For other possibilities, please check [mustache.js](https://github.com/janl/mustache.js) documentation.

You may want to write a file or a folder for every environment. To enable this, you could write the file name (or folder) in template as `%envId%`. This will be interpolated for every environment.
The interpolation data in those files are the environments fields at the first level (as in `mustache.js` sections), with the project as a key for every environment.

## Project creation

Once you have a provider, tenant and a template correctly configured, you are able to create a new project using the `Create project` button in the Home area of Console.

![new-project-cards-headers](img/new-project-cards-headers.png)

The project creation is divided in different steps:

### Step 1 **General**

In this step, you are required to insert the general information about your new project:

* **Tenant** (*required*): you have to select, from a list of pre-configured Tenants, your Tenant, which enables you to keep the same configuration for different projects.
* **Project Name** (*required*): the name of your project, which will be shown in the project card in the Home section of Console.
* **Description** (*optional*): this is the description of your new project, which will be shown in the project card in the Home section of Console.
  
![create-project1](img/create-project1.png)

### Step 2 **Repository**

In this step, it is indicated the location of your new project and you have to choose its Template:

* **Git Provider** : this field represents the provider id used by your chosen tenant.

* **Git repo path** (*required*, field not editable): this is the path, calculated from project name and tenant, where the configuration will be saved on GitLab. It specifies the location of your project on GitLab.

* **Visibility** (*required*, field not editable): the visibility states the status of your project once it will be saved in Gitlab. If it is `internal`, all the internal users of the Gitlab instance could see the project. If it is `private`, only who has access to the repository can see the project.

* **Template** (*required*): you have to select, from a list of pre-configured Templates, your Template, which enables you to use pre-filled configurations for your project.

:::tip
If you are using the PaaS Mia-Platform Console, two main templates are available: one with all the core services, and the other which is similar, but without CMS. More information about how to use them at [the bottom of this page](#setup-paas-templates).
:::

![create-project2](img/create-project2.png)

### Step 3 **Environments**

In this step, an overview of the configuration of your project environments is presented. The following information are retrieved from the selected Tenant and, so, are already configured and not editable:

* **Environment name** (*required*, field not editable): the name given to your environment.
* **Environment ID** (*required*, field not editable): the human-readable ID set to your environment.
* **Description** (*required*, field not editable): this is the description of the environment.
* **Hosts** (*required*, field not editable): the hosts which expose the documentation and the APIs.
* **Backoffice Host** (*required*, field not editable): the host which exposes CMS and backoffice APIs.
* **Cluster Host** (*required*, field not editable): this is the IP of the Kubernetes cluster where the project will be deployed.
* **Is production** (*required*, field not editable): defines if the environment is a production environment or not.
* **Namespace** (*required*, field not editable): this is the namespace of kubernetes.

![create-project3](img/create-project3.png)

#### A note about Project Metrics

When the production environment is defined for a project a preview of its **Kubernetes Metrics** will be rendered inside the related card in the Home Page. These metrics will show the following information:

* Number of pods up and running
* CPU usage
* RAM usage

### Step 4 **Configure API Key**

In this step, you are required to set up Client's accesses to your APIs:

* **API Key** (*required*): this is the API Key. It can be generated randomly.
* **Client Type** (*required*): ID of the client that wants to access to your APIs.
* **Description** (*optional*): this is the description of the API Key.

![create-project5](img/create-project5.png)

At the end of the process, your project will be created on your Git provider, and will be visible in the Home section of your Console.
Once your project has been created, you will be redirected on the Setup Infrastructure area of your new project, where you can see your environments and a list of environment variables:

* Some variables are pre-filled from project or tenant information (like *CMS_IMAGE_NAME*, *CRUD_LIMIT_CONSTRAINT_ENABLED* and *LOG_LEVEL*). Other variables are not pre-filled (like *NOTIFICATIONS_COLLECTION_ROUTES* and *NOTIFICATIONS_SERVICE_PATH*).

* All the variables are mandatory, except  CRUD_LIMIT_CONSTRAINT_ENABLED, NOTIFICATIONS_SERVICE_PATH and NOTIFICATIONS_COLLECTION_ROUTES: you have to configure all the variables that are mandatory and not pre-filled like *MONGODB_SHORT_URL*, *MONGODB_URL*and*REDIS_HOSTS*.

These environment variables are saved on GitLab.

At the end of project creation, you have to commit and deploy your new project to finish the process effectively.

## Customize the project with additional information (Optional)

In order to improve the governance of your projects, you may want to add additional details such as:

* `technologies`: the list of technologies used in the project codebase
* `projectOwner` and `teamContact`: the name and contact of the project owner
* `color`: a custom color that can be used as an additional categorization, especially if a label has been already defined (e.g you may decide within your organization that all projects flagged with a *gateway* are associated with the same color).

* `layerId`: a label which identifies a logical layer and can help to categorize projects in custom groups (e.g: *gateway* or *data-lake* are some samples of logical layer names that can be applied to a project).
The `layerId` must be equal to one of the layers names inside the `logicalScopeLayers` property of the related **tenant** object . When the layer is found in the tenant, then the project model is enriched with the `logicalScopeLayers` property according to the values found.

* `logicalScopeLayers`: an array of objects shaped as follows:
  * **name** : identifies the name of the logical layer
  * **order** : identifies the numerical order of the layer in order to display it according to the sorting defined by the user.

`layerId` and `logicalScopeLayers` are mutually exclusive, since the first one must be used when a `tenantId` is specified for the project, while the latter not.

### CMS Configurations

All the above properties can be defined via CMS after a project has been created, because they only provide extra information that will be eventually rendered in the Console Home Page.

Let's say we have created a project as follows:

```json
{
    "_id": "ObjectId(...)",
    "name": "frontend gateway",
    "projectId": "frontend-gateway",
    "configurationGitPath": "git-config-path",
    "repositoryUrl": "http://example.repository/git-config-path",
    "tenantId": "mia-platform"
}
```

To configure all the extra details to a project, just add the `info`, `layerId`/`logicalScopeLayers`, and the `color` properties via the CMS Interface.

### Project Information

To add extra info about `projectOwner`, `teamContact` and `technologies` for a single project, simply edit the *Information* field:

```json
{
    "projectOwner": "John Smith",
    "teamContact": "j.smith@email.it ",
    "technologies": [
        "java",
        "node"
    ]
}
```

### Custom Color

To edit the custom `color` associated to a project, just change the value in the *Project Color* field:

![color-project-cms](img/color-project-cms.png)

### Layer Identifier (layerId)

If the project has a `tenantId` that includes a definition for its `logicalScopeLayers`, then the *Layer Identifier* field can be defined by simply specifying a layer name that exists in the related `logicalScopeLayers`:

![layerId-project-cms](img/layerId-project-cms.png)

### Logical scope layer (logicalScopeLayers)

Alternatively to the above step, if the project isn't under a `tenantId`, then a `logicalScopeLayers` can be defined directly by editing the *Logical Scope Layer* field:

![logical-layer-project-cms](img/logical-layer-project-cms.png)

At the end of the configuration, on the backend side, the project will have the following data structure:

### Sample of project data structure with tenantId

```json
{
    "_id": "ObjectId(...)",
    "name": "frontend gateway",
    "projectId": "frontend-gateway",
    "configurationGitPath": "git-congif-path",
    "repositoryUrl": "http://example.repository/git-config-path",
    "tenantId": "mia-platform",
    "info": {
      "projectOwner": "John Smith",
      "teamContact": "john.smith@email.com",
      "technologies": ["javascript", "dockerfile", "shell"]
    },
    "layerId": "gateway",
    "color": "green"
  }
```

### Sample of project data structure without tenantId

```json
{
    "_id": "ObjectId(...)",
    "name": "frontend gateway",
    "projectId": "frontend-gateway",
    "configurationGitPath": "git-congif-path",
    "repositoryUrl": "http://example.repository/git-config-path",
    "info": {
      "projectOwner": "John Smith",
      "teamContact": "john.smith@email.com",
      "technologies": ["javascript", "dockerfile", "shell"]
    },
    "logicalScopeLayers": [{"name": "gateway", "order": 1}],
    "color": "green"
  }
```

When loading the Console Home Page, the project `Frontend Gateway` will be rendered accordingly:

![new-cards-detail](img/new-cards-detail.png)

### Customize your cluster

It is possible to add a proxy configuration in cluster configuration in environments.
A configuration example:

```json
{
  "environments": [
    {
      "cluster": {
        "proxy": {
          "url": "http://url-to-proxy/"
        }
      }
    }
  ]
}
```

Proxy url supports `http`, `https` and basic auth inside proxy url. For example, an url with basic auth would be like `https://username:password@url-to-proxy/`.

### Final Step: **Activate CRUD**

To activate the CRUD for your project, you can contact your Mia-Platform's responsible for creating a connection with MongoDB.

### Setup PaaS templates

If you are using the PaaS console, the following templates are available:

* `Mia-Platform Multitenant with Traefik`: which contains all the services used by the Console (i.e. `crud-service`, `api-portal`, `swagger-aggregator`, `microservice-gateway`, `authorization-service`, `api-gateway`, `cms-site`, `cms-backend`, `v1-adapter`, `export-service`, `auth0-client` and `oauth-login-site`) with a correct configuration
* `Mia-Platform Multitenant Without CMS`: which contains all services except the CMS-related ones, i.e. `cms-site`, `cms-backend`, `v1-adapter`, `export-service`, `auth0-client` and `oauth-login-site`

A project created with these templates is almost ready to use, but some configuration is required for all its parts to work correctly.

1. For the crud-service to be deployed and work correctly, you need a value for the environment variable `MONGODB_URL`. When the project is first created, its value is an empty string. To fix that, go to Envs Area, Environment Variables table, and either change its value, or delete it if you want to inherit this value. This needs to be done for all the environments you are interested in.
2. For auth0-client service to be deployed and work correctly, you need to setup various environment variables, as specified in its configuration. You can find the configuration in the Design Area, Advanced Section, auth0-client option, config.js file. More on the configuration of the auth0-client [here](../../runtime_suite/auth0-client/configuration).
