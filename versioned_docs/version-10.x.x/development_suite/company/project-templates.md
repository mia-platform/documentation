---
id: project-templates
title: Project Templates
sidebar_label: Project Templates
---

A project template is a repository which contains some project specific information and a default structure to have
after the project creation.
The template allows you to pre-fill resources in your project and start all similar projects with the same configuration.
In short, it constitutes a base on which to create your project.

:::info
The fields set by the template can be changed after the project creation.
:::

## Create a template

You can create a project template by setting up a specific document through the `Project Templates` page of the Console CMS.
The fields to customize inside CMS are:

* `name` (*required*): the name of the template;

* `templateId` (*required*): the human-readable ID of the template (e.g. "mia-platform-multitenant-template"). It must adhere to this regex: `(^[a-z]+[a-z0-9-]*$)`;

* `company`: the company which owns the project template. If set, the project templates will be visible only to the specific company. If not set, the project template is public and anyone can use it;

* `description`: the description of the template;

* `archiveUrl`: URL to a gzip of the base project configuration folder. All contents of this folder will be copied into the target configuration, and correctly interpolated. If you want to create a custom template, click [here](#how-to-create-a-project-archive) to see how to do it;

* `dashboards`: a list of dashboard configured by default in every environments of the project, when created.
  Dashboards values can be interpolated with:
  
  * `%projectId%`: the projectId of the new project
  * `%envId%`: for each environment, the envId
  * `%namespace%`: for each environment,the namespace

  For example:

  ```json
    [
      {
        "id": "default-dashboard",
        "label": "My Default dashboard",
        "url": "https://host:port/path-to-dashboard",
        "type": "iframe"
      }
    ]
  ```

  * `id` (*required*): a unique id of the dashboard;
  * `label` (*required*): the labels shown by the [monitoring section of the Console](/development_suite/monitoring/dashboard.md);
  * `url` (*required*): the url to the dashboard;
  * `type`: can be `iframe` or `newTab`. Default to *iframe*.

* `deploy`: object which identifies some deploy related configurations. For example:

  ```json
    {
      "runnerTool": "mlp",
      "projectStructure": "default",
      "useMiaPrefixEnvs": false
    }
  ```

  * **runnerTool**: Set it to `mlp` if the project uses it as command line deployment tool. It is required to have the [Smart Deploy](/development_suite/deploy/deploy.md#smart-deploy) feature enabled;
  * **useMiaPrefixEnvs**: Set it to **false** if you want the [Public Variables](/development_suite/api-console/api-design/public_variables.md) to be saved without `MIA_` prefix. That depends on the command line deployment tool. If the project uses `mlp` you don't need to use the `MIA_` prefix;
  * **projectStructure**: Set it to `kustomize` if you want to use Kustomize to manage your microservices configurations. More info in [this section](/development_suite/set-up-infrastructure/kustomize/index.md), otherwise use `default` or leave it blank to keep the usual configuration setup.

:::caution
If you set `projectStructure` to `kustomize`, your project configuration structure [needs to be changed accordingly](/development_suite/set-up-infrastructure/kustomize/migrate.md).
:::

:::note
If you switch `useMiaPrefixEnvs` from `true` to `false`, you have to remove the `MIA_` prefix by hand. This operation is not performed automatically by the Console.
:::

* `enabledServices`: object which contains as key the service handled by the Console and as value a boolean. If the value is true, the service is enabled and the Console will generate the configuration for that service, otherwise it will be skipped by the Console. For example:

    ```json
      {
        "cms-site": true,
        "cms-backend": true,
        "v1-adapter": true,
        "export-service": true,
        "login-site": false,
        "auth0-client": true,
        "oauth-login-site": true
      }
    ```

* `staticSecret`: some templates could use the same static secret for a set of projects (especially used with architecture with multiple `api-gateway` entry points). Keys are optional. This is an example of object:

  ```json
    {
      "secret": "my-secret",
      "clientType":"cms"
    }
  ```

## How to create a Project Archive

The project archive is interpolated using [mustache.js](https://github.com/janl/mustache.js) as template system, using `%` as tag symbol instead of the default `{{` or `}}`.

:::note
In order to use the `%` character inside your project archive you can escape it by prefixing the character with an additional `%`. For example, the string `%%something` will be rendered as `%something` when the project archive will be interpolated.
:::

*mustache.js* is a web template system, which allows you to generate custom templates by replacing all the general information in the web template with your product or organization information.

You could create a project template to avoid copy/paste in every new project having the same base configuration.

At Mia-Platform, for example, we create one template to configure a project exposed through Traefik configuration and one to configure it without expose it. Therefore, for a company that uses this template, creating this type of project will be a very simple process.

You can interpolate the template with some project data. With *mustache.js*, you could iterate through an array, in order to have some configuration iterated for every environment.
The values you can use during template interpolation are:

For the project (accessible using `project.${field}`):

* `projectId`;
* `name`;
* `configurationGitPath`;
* `environments`.

Inside environments, you can access to:

* `envId`;
* `envPrefix`;
* `cluster` (an object containing `namespace` and `clusterId` string, `kubeContextVariables` object). Here you can find the variable names for the specified environment where to set the cluster variable;
* `hosts` (an array of objects, with `host` and `isBackoffice` fields).

An example of template for the `.gitlab-ci.yml` file:

```yml
include:
  # job template
  - project: 'platform/pipelines-templates'
    file: '/deploy/deploy-job.yml'
    ref: 'master'
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

All sections between `%#project.environments%` and `%/project.environments%` will be written for `n` times, where `n` is the number of environments. So, inside the environment, you can use the environment specific fields.
For other possibilities, please check [mustache.js](https://github.com/janl/mustache.js) documentation.

You may want to write a file or a folder for every environment. To enable that, you can write the file name (or folder) in the template as `%envId%`, which will be interpolated for every environment.
The interpolation data in those files include the environments fields at the first level (as in `mustache.js` sections), with the project as a key for every environment.

To see an example of Jenkins pipelines definition, take a look at [this](/development_suite/deploy/configuration.md#how-to-automatically-create-jenkins-job-on-project-creation) page of our doc.

## Create default services

There are two ways to add services to a template:

* Using an `api-console-config`, which specifies the services that will be included in the projects created with that template, together with other details (e.g. environment variables). This requires you to add an `api-console-config.json` file in the root directory of the project;
* Deprecated: Using `enabledServices`, which only specifies whether a certain service is enabled or not, without the possibility to define any other detail.

:::caution
The `enabledServices` can only be used for core services (i.e. `cms-site`, `cms-backend`, `v1-adapter`, `export-service`, `auth0-client`, and `oauth-login-site`), while it does not work for services used from the Console that have been migrated to custom services (migrated services are now plugins, you can find them in the [marketplace](/marketplace/overview_marketplace.md)).
:::

The base structure of the `api-console-config.json` is the following:

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

If you create the new `api-console-config.json` from an existing one, please remember to delete all fields that do not match the structure above, since they will be automatically generated by the Console after save and deploy actions (one of those, depending on the field).
