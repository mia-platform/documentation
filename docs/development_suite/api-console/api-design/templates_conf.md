---
id: templates_conf
title:  Template configuration
sidebar_label: Add a Service Template
---
The Console is able to generate new services starting from a git project or from an existing docker image.

To make sure that the Console can create new services starting from a template it is necessary to create the template on any public repository that provides a tar.gz file and to register it in the configuration of the Console.

The templates must be registered in the CRUD, in the `services` collection, indicating a label that will display the user and the path to the git repository.

## Template string replaced by Console during service creation

The Console will create a repository in which it will copy the template files replacing all occurrences of the following strings between `%` or the ones starting with `mia_template` and ending with `_placeholder`:

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

## Example of template upload

Below is an example of the body of a template:

```json
{
  "name": "Node Template",
  "archiveUrl": "https://git.tools.mia-platform.eu/api/v4/projects/238/repository/archive.tar.gz",
  "description": "This is the best template to start creating a service in node integrated inside the platform",
  "type": "template",
  "supportedBy": "mia-platform",
  "image": [
    {
      "_id": "5db0105743875a0011618815",
      "name": "36e6b6b4-36e1-4737-b65f-d1fb62bb3647.png",
      "file": "f2ca3f95-1556-446f-a098-dbc1ff219dc8.png",
      "size": 1532,
      "location": "/v2/files/download/f2ca3f95-1556-446f-a098-dbc1ff219dc8.png",
      "type": "image/png"
    }
  ],
  "supportedByImage": [
    {
      "_id": "5db0106143875a0011618816",
      "name": "e7c7ced2-e40e-465b-9e79-7d5c710badb2.png",
      "file": "e5ee5be6-e16d-4404-99a6-2f3ed2f91b64.png",
      "size": 139694,
      "location": "/v2/files/download/e5ee5be6-e16d-4404-99a6-2f3ed2f91b64.png",
      "type": "image/png"
    }
  ]
}
```

and the example curl to create the template:

```bash
curl -d '{"name":"NodeTemplate","archiveUrl":"https://git.tools.mia-platform.eu/api/v4/projects/238/repository/archive.tar.gz","description":"Thisisthebesttemplatetostartcreatingaserviceinnodeintegratedinsidetheplatform","type":"template","supportedBy":"mia-platform","image":[{"_id":"5db0105743875a0011618815","name":"36e6b6b4-36e1-4737-b65f-d1fb62bb3647.png","file":"f2ca3f95-1556-446f-a098-dbc1ff219dc8.png","size":1532,"location":"/v2/files/download/f2ca3f95-1556-446f-a098-dbc1ff219dc8.png","type":"image/png"}],"supportedByImage":[{"_id":"5db0106143875a0011618816","name":"e7c7ced2-e40e-465b-9e79-7d5c710badb2.png","file":"e5ee5be6-e16d-4404-99a6-2f3ed2f91b64.png","size":139694,"location":"/v2/files/download/e5ee5be6-e16d-4404-99a6-2f3ed2f91b64.png","type":"image/png"}]}' 'https://console.cloud.mia-platform.eu/v2/api/services/' -H 'cookie: <your cookie session here>' -H 'secret: <the secret goes here>' -H'content-type: application/json'
```

The `archiveUrl` field must be a URL to the tar.gz version of the git project;
below is an example for project hosted on gitlab:

```url
https://your-host-gitlab/api/v4/projects/:project-id/repository/archive.tar.gz
```

Note that you can now specify an `image` and a `supportedByImage` for the template;
both fields are `array of objects` that cointain the image file data; the result will be as the following:

![Console-custom-service](img/dev-console-custom-service.png)

## Upload service template image

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

You can directly use the response body as image file object of your custom template, as described in the [Example of template upload](#example-of-template-upload) paragraph.

### Change a custom template

To change a custom template, you can use the postman collection below to modify the project.

First, fill with your cookie sid to authenticate. Once authenticated, get the template to modify using `Get templates` collection to find the correct id.
With the correct template id, `Change existing template` with the id, remove the unchanged fields and modify the correct one.

### Postman collection

Create a JSON file with the following content, then import this collection into Postman:

```JSON
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

## How to configure templates default environment variables from CMS

From CMS you can configure the environment variables of each template by adding the property `defaultEnvironmentVariables` inside the data model of each template. By modifying the map of the environment variables, you can overwrite the default environment variables applied by Console.

To use this feature, you have to fill the `defaultEnvironmentVariables` in this way:

```JSON
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

Here there is an example of the React Template configuration, which environment variables can be modified in order to overwrite the defaults applied by Console:

```JSON
  {
    "id": "5e43d8325686a800116b835b",
    "pipelines": {
      "gitlab-ci": {
        "path": "/projects/782/repository/files/console-pipeline%2Freact-app.gitlab-ci.yml/raw"
      }
    },
    "type": "template",
    "name": "React Template",
    "description": "This template allows you to start setting up a front-end project with the React framework",
    "archiveUrl": "https://github.com/mia-platform-marketplace/React-App-Template/archive/master.tar.gz",
    "image": [
      {
        "_id": "5e53cef5f44d4d00126aae7f",
        "name": "react.png",
        "file": "3b5e9a38-262d-4515-b61e-7887fb313beb.png",
        "size": 7341,
        "location": "/v2/files/download/3b5e9a38-262d-4515-b61e-7887fb313beb.png"
      }
    ],
    "supportedBy": "Mia-Platform",
    "supportedByImage": [
      {
        "_id": "5db0106143875a0011618816",
        "name": "e7c7ced2-e40e-465b-9e79-7d5c710badb2.png",
        "file": "e5ee5be6-e16d-4404-99a6-2f3ed2f91b64.png",
        "size": 139694,
        "location": "/v2/files/download/e5ee5be6-e16d-4404-99a6-2f3ed2f91b64.png"
      }
    ],
    "defaultEnvironmentVariables": [
      {
        "value": 8080,
        "name": "HTTP_PORT"
      }
    ]
  }
```
