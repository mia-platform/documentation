---
id: add_template_or_example
title: Create a Template or Example
sidebar_label: Create a Template or Example
---

A **Template** is a base repository from which users can build a new Microservice.

**Examples** are similar to Templates, the only difference is they provide a basic implementation of the business logic for a specific use case, that users can use as a starting point for their custom implementation.

To configure Template and Examples, make sure you followed the [common Marketplace item creation steps](/marketplace/add_to_marketplace/contributing_overview.md#creation-of-a-marketplace-item), then follow the paragraphs below to finalize the configuration.

## The target

Your template should make the creation of microservices easier by providing a specific technology ready-to-use model.

:::info

For simplicity, in this tutorial, the word **template** refers to both Template and Examples, since they have a common configuration.

:::

### Test

The template should always include integration tests.
Even just to show users where to manage and how to run tests.

Check out the [Node.js service template](https://github.com/mia-platform-marketplace/Node.js-Custom-Plugin-Template/blob/master/tests/index.test.js) to see an example.

### Health routes

Each template, or the eventual service library from which depends, should expose health routes.
These routes provide information on the health of the systems, and let to carry out debugging checks.

:::info
For example, in all Node.js templates, health routes are exposed by [LC-39](https://github.com/mia-platform/lc39)
:::

:::caution
Incorrect setting of health routes can cause disservices.
:::

### Environment variables

Your template has to let an easy reading of the environment variables. Furthermore, for each variable, it should provide the capability to define a defaults name and value.

To work correctly, each template, or the service library on which depends, needs some specific environment variables:

* `USERID_HEADER_KEY`
* `USER_PROPERTIES_HEADER_KEY`
* `GROUPS_HEADER_KEY`
* `CLIENTTYPE_HEADER_KEY`
* `BACKOFFICE_HEADER_KEY`
* `MICROSERVICE_GATEWAY_SERVICE_NAME`

Check out the [Node.js service template](https://github.com/mia-platform-marketplace/Node.js-Custom-Plugin-Template/blob/255233ce35ec7748bb4120057dc36fcd2bb3f983/Dockerfile#L29-L30) to see an example.

## The source Git repository

The item template must be hosted on a remote **Git repository**.

 The URL to the tar.gz version of the Git project must be specified in the `archiveUrl` field, optionally you can specify either the `sha` or the `ref` as query parameters. If you don't have access to CMS, this should be provided to your Mia-Platform referent in form of a Git clone URL.

The service should ensure a Continuous Integration (CI) to update the service image any time his code is modified, through the `pipelines` field you can set up the CI file by yourself or use instead Mia-Platform pipeline templates.  

To use the templates provided by Mia-Platform, you can contact your referent to configure the pipeline templates within your Console installation. 

When creating your microservice, the Console will also generate a CI file (e.g. `.gitlab-ci.yml`) alongside the service files.
- The service must be well documented and the field `documentation` helps in it.

In fact, during service creation, it is possible to access the service documentation by clicking on `View documentation` button, which will appear only if the `documentation` field has been filled correctly.  
Two properties must be specified inside `documentation`:  

- `type`, currently only two types exist:
- `markdown`: represents a markdown file (with `.md` file extension), for example, a `README.md` file inside a Git repository.
- `externalLink`: represents a link to an external website page, for example to Mia Platform documentation.
- `url`, contains the URL where the markdown file can be retrieved (if its type is `markdown`), or the link where the user should be redirected (if its of type `externalLink`).  

:::info

By adding an **Example** or a **Template**, the code provided will act as a boilerplate for everyone creating a service from that Marketplace item, therefore that code has to be accessible to all the Console users that have access to the Marketplace item.

:::  

Once the user creates a new microservice starting from your template or example, the Console will create a new Git repository in which it will copy all the template files.

## Repository Files Placeholder

The files of your template repository can contain some special placeholders that will be replaced by the Console at the creation of the new microservice:

- `mia_template_image_name_placeholder`: name of the docker image entered by the user;
- `%CUSTOM_PLUGIN_PROJECT_NAME%`: name (label) of the Console project;
- `mia_template_project_id_placeholder`: id of the Console project;
- `mia_template_service_name_placeholder`: service name chosen by the user;
- `%CUSTOM_PLUGIN_SERVICE_DESCRIPTION%`: description of the service chosen by the user;
- `%CUSTOM_PLUGIN_CREATOR_USERNAME%`: username of the user who created the service;
- `%CUSTOM_PLUGIN_PROJECT_GIT_PATH%`: full path of the repository of the Git provider;
- `%GIT_PROVIDER_PROJECT%`: name of the Git project entered by the user (e.g. GitHub repository or Gitlab project).
- `%GIT_PROVIDER_GROUP%`: name of the group of Projects entered by the user (e.g. GitHub organization or Gitlab group).
- `%GIT_PROVIDER_BASE_URL%`: URL base of the Git provider.
- `%NEXUS_HOSTNAME%`: docker registry hostname.

:::warning

The following placeholders still work but are deprecated: please do not use them as they will be deleted in future versions.

Consider changing them with the releveant placeholders described above.

:::

- `%CUSTOM_PLUGIN_IMAGE_NAME%`: name of the docker image entered by the user
- `%CUSTOM_PLUGIN_PROJECT_ID%`: id of the Console project;
- `%CUSTOM_PLUGIN_PROJECT_NAMESPACE%`: id of the Console project;
- `%CUSTOM_PLUGIN_SERVICE_NAME%`: service name chosen by the user.

## Categories List

The category list is constantly updated, check with your Mia-Platform referent for the updated list.

| ID       | Description                           |
| -------- | ------------------------------------- |
| `kotlin` | Start From Code - Java/Kotlin         |
| `spa`    | Start From Code - SPA - Angular/React |
| `rust`   | Start From Code - Rust/C/Swift        |
| `nodejs` | Start From Code - Node.js             |
| `golang` | Start From Code - Go                  |
| `python` | Start From Code - Python              |
| `code`   | Start From Code                       |

## Best Practices

Here is some useful advice to strengthen your items:

- **Test**: each service must have well-tested code;
- **Logs**: each service should display the logs, to inform users about the actions they are currently performing and if any errors have been found during their execution.

## Tips & Tricks

 - **Where to host the zip with the code**: If you code your template on GitHub you can access the zip file using the URL https://github.com/&lt;username&gt;/&lt;project-name&gt;/archive/&lt;branch&gt;.tar.gz
 - **`.mia-platform/` folder**: This folder is used to overwrite files in the main directory and won't be committed in the created repository; you can use it to provide a different README file to developers or to store the images and the marketplace item configuration


Example of a Start From Code Template

```json
{
    "name": "Spring Boot Native",
    "description": "Starter for Spring Boot Native Application",
    "type": "template",
    "releaseStage": "stable",
    "tenantId": "my-tenant",
    "itemId": "spring-boot-service",
    "repositoryUrl": "https://sample-url.com",
    "label": "Spring Boot Native",
    "categoryId": "kotlin",
    "suportedBy": "Supported",
    "documentation": {
        "type": "markdown",
        "url": "https://url-of-documentation.org"
    },
    "image": {
        "localPath": "./image.png"
    },
    "supportedByImage": {
        "localPath": "./supportedByImage.jpeg"
    },
    "resources":{
        "services":{
            "spring-boot-service":{
                "name": "spring-boot-service",
                "description": "Simple Spring Boot Native service",
                "archiveUrl": "https://the-archive-url.org",
                "containerPorts": [
                    {
                        "name": "http",
                        "from": 80,
                        "to": 3000,
                        "protocol": "TCP"
                    }
                ],
                "type": "template",
                "defaultEnvironmentVariables": [
                    {
                      "name": "LOG_LEVEL",
                      "value": "{{LOG_LEVEL}}",
                      "valueType": "plain"
                    },
                    {
                      "name": "HTTP_PORT",
                      "value": "3000",
                      "valueType": "plain"
                    }
                ],
                "defaultProbes": {
                    "liveness": {
                        "initialDelaySeconds": 40,
                        "periodSeconds": 15,
                        "timeoutSeconds": 1,
                        "successThreshold": 1,
                        "failureThreshold": 3
                    }
                },
                "defaultResources": {
                    "cpuLimits": {
                      "max": "150m",
                      "min": "50m"
                    },
                    "memoryLimits": {
                      "max": "400Mi",
                      "min": "400Mi"
                    }
                  }
            }
        }
    }
}
```

