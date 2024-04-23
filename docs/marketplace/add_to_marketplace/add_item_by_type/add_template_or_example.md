---
id: add_template_or_example
title: Create a Template or Example
sidebar_label: Create a Template or Example
---

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

By adding an **Example** or a **Template**, the code provided will act as a boilerplate for everyone creating a service from that Marketplace item, therefore that code will be accessible to all Console users.

:::  

Once the user creates a new microservice starting from your template or example, the Console will create a new Git repository in which it will copy all the template files.

:::info

Further details on creating a template are provided by visiting [this documentation page](/marketplace/templates/template_create.md).

:::

#### Repository Files Placeholder

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

The following placeholders still work but are deprecated: it is recommended not to use them as they will be deleted in future versions.
Considering changing them with the corresponding placeholders described above.

:::

- `%CUSTOM_PLUGIN_IMAGE_NAME%`: name of the docker image entered by the user
- `%CUSTOM_PLUGIN_PROJECT_ID%`: id of the Console project;
- `%CUSTOM_PLUGIN_PROJECT_NAMESPACE%`: id of the Console project;
- `%CUSTOM_PLUGIN_SERVICE_NAME%`: service name chosen by the user.


## Best Practices!

Here are listed some useful advice to strengthen your items:

- **Test**: each service must have well-tested code;
- **Logs**: each service should display the logs, to inform users about the actions they are currently performing and if any errors have been found during their execution.

## Tips & Tricks

 - **Where to host the zip with the code**: If you code your template on github you can access the zip file using the url https://github.com/&lt;username&gt;/&lt;project-name&gt;/archive/&lt;branch&gt;.tar.gz
 - **.mia-platform folder**: This folder is used to overwrite files in the main directory and won't be committed in the created repository; you can use it to provide a different README file to developers or to store the images and the marketplace item configuration)


<details><summary>Example of a Start From Code Template</summary>

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
</details>
