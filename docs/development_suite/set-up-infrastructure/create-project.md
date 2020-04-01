# Create a tenant

If you already have a tenant, you could [skip this section](#create-a-template).

The tenant is useful to create a project configured inside an already existent infrastructure.
In an existent infrastructure some information are repeated for all the projects: *environments*, *cluster informations*, *CI/CD integration*.

!!! info
    The fields in the tenant cannot be changed during project creation steps (if not specified otherwise)

More in detail, a guide how to compile the tenant:

* `name` (*required*): the name of the tenant to display in selection list;
* `tenantId` (*required*): the human readable id of the tenant (e.g. mia-platform). It must adhere to this regex: `(^[a-z]+[a-z0-9-]*$)`;
* `description`: the description of the tenant;
* `defaultTemplateId`: the default template to be used in project creation. This could be changed during the project creation wizard steps;
* `environments` (*required*): an array of objects containing the environments definition for the tenant. The content of this arrays will be interpolated to replate `%projectId%` with inserted `projectId` field in project creation. Any object should contains, for example:

    ```js
      {
        "label": "Development",
        "value": "development",
        "hosts": [
          {
            "host": "%projectId%.test.mia-platform.eu"
          },
          {
            "host": "cms.%projectId%.test.mia-platform.eu",
            "isBackoffice": true
          }
        ],
        "cluster": {
          "hostname": "127.0.0.1", // hostname of the cluster
          "namespace": "%projectId%-development"
        }
      }
    ```

* `environmentVariables`: an object describing the configuration to enable the setup infrastructure environment variables section. As of now, the only supported type is `gitlab`.

  There are three way to configure a project:

  1. **empty**: it is not set a default in project creation, but should be configured manually

  1. **only type configuration**, for example:
      ```json
        {
          "type": "gitlab"
        }
      ```
      The project read the variables from the first parent group of Configurations project in Gitlab.

      So, for example, with a gitlab project to be saved in
      `/clients/mia-platform/configurations`, the environment variables are written in `clients/mia-platform` group

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
      this configuration is saved only in tenant, and should be retrieved at runtime in project fetching from tenant info. So if your tenant has all the env variables of the projects set in one group, this could be changed for all the projects at the same time

* `pipelines` (*required*): the CI/CD pipelines used by the tenant. It is an object, for example:
    ```json
      {
        "type": "gitlab-ci"
      }
    ```

* `availableNamespaces`: namespaces accessible internally from your project, using `cross-projects` endpoint. It is useful when your tenant is made up of more projects of several projects that communicate with each other. The content of this arrays will be interpolated to replate `%projectId%` with inserted `projectId` field in project creation.


# Create a template

If you already have a template, you could [skip this section](#create-a-template).

Once you choose a tenant, you could choose a template. A template contains some project specific information, it is a base on which to create your project.

!!! info
    The fields set by the template can be changed during project creation.

How to compile the tenant:

  * `name` (*required*): name of the template to display;
  * `templateId` (*required*): the human readable id of the tenant (e.g. mia-platform-multitenant-template). It must adhere to this regex: (^[a-z]+[a-z0-9-]*$);
  * `description`: the description of the template;
  * `archiveUrl`: url to a gzip of the base project configuration folder. All the contents of this folder will be copied into the target configuration, correctly interpolated. (TODO: explain the interpolation)
  * `cmsImageName`: cms docker image to interpolate in `archiveUrl`. It should contains also the cms tag to use (if `cms-site` service is disabled, it will not be used).
  * `coreLegacyImageName`: baas core docker image to interpolate in `archiveUrl`. It should contains also the cms tag to use (if `baas-legacy` service is disabled, it will not be used).
  * `staticSecret`: some project could use the same static secret for a set of projects (especially used with an architecture with multiple `api-gateway` entrypoint). This is an object, for example:
      ```json
        {
          "secret": "ugAsOGB0crjx8hAxrvwiomHiGbUCNzvH",
          "active": true,
          "clientType":"cms"
        }
      ```
  * `enabledServices`: an object containing as key the service handled by the console and as value a boolean. If the value is true, the service is enable and the DevOps Console will generate the configuration for that service, otherwise it will be skipped by the console. For example:
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


# Create a project

To create a project, click on the `Create new project` button on DevOps Console homepage.
