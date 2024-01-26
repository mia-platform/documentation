---
id: manage_marketplace_items
title:  Manage Marketplace Items
sidebar_label:  Manage Marketplace Items
---

There are three main methods to create, modify and delete Marketplace items:

* (recommended) Use [`miactl`](/cli/miactl/10_overview.md), the Mia-Platform command line interface tool.
* Open an issue on Mia-Platform [Github community page](https://github.com/mia-platform/community).
* (deprecated) Use the [CMS](/microfrontend-composer/previous-tools/cms/guide_cms.md).

## How to use `miactl` to manage the Marketplace


First of all, you need to setup `miactl`, as explained in the [dedicated doc](/cli/miactl/20_setup.md).

With the `miactl marketplace` subcommands, you can perform several actions, described here below.

:::tip

If you need to handle many Marketplace items, we suggest the adoption of a [Declarative Approach](/marketplace/add_to_marketplace/declarative_marketplace.md).

:::

### Create an item 

:::info

You need to have *Company Owner* or *Project Administrator* role at Company level to perform this action

:::

Imagine you are a software developer, working for the Company "Acme Corporation".

You have developed a new service (for example a NodeJS service) 
called "My Awesome Service". The service is a plugin, i.e. users are only required to configure it and deploy it in their project.
You now want it to be available in the Marketplace of your Company.

First of all, you need to create a JSON file as explained in [this guide](/marketplace/add_to_marketplace/contributing_overview.md#how-to-configure-a-new-component).
Save the file, for example as `myAwesomeService.json` file.

The file contents will look like this:
<details>
<summary>Click to expand <code>myAwesomeService.json</code></summary>

```json
{
  "description": "My Awesome Service allows your project to do amazing stuff!",
  "documentation": {
    "type": "externalLink",
    "url": "https://docs.example.org/AwesomeService"
  },
  "image": {
    "localPath": "./awesomeService.png"
  },
  "name": "My Awesome Service",
  "itemId": "my-awesome-service",
  "repositoryUrl": "https://git.example.org/awesome-service",
  "resources": {
    "services": {
      "api-portal": {
        "componentId": "my-awesome-service",
        "containerPorts": [
          {
            "from": 80,
            "name": "http",
            "protocol": "TCP",
            "to": 8080
          }
        ],
        "defaultEnvironmentVariables": [
          {
            "name": "HTTP_PORT",
            "value": "8080",
            "valueType": "plain"
          }
        ],
        "defaultLogParser": "mia-nginx",
        "defaultProbes": {
          "liveness": {
            "path": "/index.html"
          },
          "readiness": {
            "path": "/index.html"
          }
        },
        "defaultResources": {
          "memoryLimits": {
            "max": "25Mi",
            "min": "5Mi"
          }
        },
        "description": "My Awesome Service allows your project to do amazing stuff!",
        "dockerImage": "docker.example.org/awesome-service:1.0",
        "name": "awesome-service",
        "repositoryUrl": "https://git.example.org/awesome-service",
        "type": "plugin"
      }
    }
  },
  "supportedBy": "Acme Corporation Inc.",
  "supportedByImage": {
    "localPath": "./acmeCorporation.png"
  },
  "tenantId": "acme-corporation",
  "type": "plugin"
}
```
</details>

You also want users to write services in your brand new programming language, `Acme.Js`.

You want to provide a Template, which is a skeleton with a minimal setup: your users are required to write business code from scratch.

<details>
<summary>Click to expand <code>myAcmeJsTemplate.json</code></summary>

```json
{
  "categoryId": "acmejs",
  "description": "This template allows you to start setting up a service written in Acme.Js",
  "documentation": {
    "type": "markdown",
    "url": "https://raw.githubusercontent.com/acme-corporation/Acme-Js-template/master/README.md"
  },
  "image": {
    "localPath": "./acmeJsTemplate.png"
  },  
  "itemId": "acmejs-template",
  "name": "Acme.Js Template",
  "releaseStage": "",
  "resources": {
    "services": {
      "acmejs-template": {
        "archiveUrl": "https://github.com/acme-corporation/Acme-Js-template/archive/master.tar.gz",
        "containerPorts": [
          {
            "from": 80,
            "name": "http",
            "protocol": "TCP",
            "to": 8080
          }
        ],
        "defaultEnvironmentVariables": [
          {
            "name": "HTTP_PORT",
            "value": "8080",
            "valueType": "plain"
          }
        ],
        "defaultLogParser": "mia-nginx",
        "description": "This template allows you to start setting up a service written in Acme.Js",
        "name": "acmejs-template",
        "type": "template"
      }
    }
  },
  "supportedBy": "Acme Corporation Inc.",
  "supportedByImage": {
    "localPath": "./acmeCorporation.png"
  },
  "tenantId": "acme-corporation",
  "type": "example",
  "visibility": {
    "allTenants": false,
    "public": true
  }
}
```
</details>

To highlight the potentialities of `Acme.Js` and introduce your users to the new programming language, you also decide to provide a working example with minimal business code.

<details>
<summary>Click to expand <code>myAcmeJsExample.json</code></summary>

```json
{
  "categoryId": "acmejs",
  "description": "A simple Hello World example based on Acme Corporation Acme.Js Template.",
  "documentation": {
    "type": "markdown",
    "url": "https://raw.githubusercontent.com/acme-corporation/Acme-Js-example/master/README.md"
  },
  "image": {
    "localPath": "./acmeJsExample.png"
  },
  "itemId": "acme-js-example",
  "name": "TypeScript Hello World Example",
  "resources": {
    "services": {
      "acme-js-example": {
        "archiveUrl": "https://github.com/acme-corporation/Acme-Js-example/archive/master.tar.gz",
        "containerPorts": [
          {
            "from": 80,
            "name": "http",
            "protocol": "TCP",
            "to": 3000
          }
        ],
        "name": "acme-js-example",
        "type": "example"
      }
    }
  },
  "supportedBy": "Acme Corporation Inc.",
  "supportedByImage": {
    "localPath": "./acmeCorporation.png"
  },
  "tenantId": "mia-platform",
  "type": "example",
  "visibility": {
    "allTenants": false,
    "public": true
  }
}
```
</details>


Notice that the `image` and `supportedByImage` objects are populated with local paths to images: make sure the images exist and that their path is correct.

To create the items on the Marketplace, open up a terminal in directory where the files are places and run this command:

```sh
miactl marketplace apply -f myAwesomeService.json -f myAcmeJsTemplate.json -f myAcmeJsExample.json
```

This command will create the Marketplace item and upload the images along with it.

A message will confirm the operation, returning some information as shown here below:
```
3 of 3 items have been successfully applied:

  ID                        ITEM ID             NAME                 STATUS   

  65368hf0c91d871a87afbcbf  my-awesome-service   My Awesome Service   Inserted  
  65368hf0c91d871a87afvedc  acme-js-template     Acme.Js Template     Inserted  
  65368hf0c91d871a87afdase  acme-js-example      Acme.Js Example      Inserted  
```

After the upload, the image keys will be replaced with the `imageUrl` and the `supportedByImageUrl`; to obtain the updated version of an item, use the `get` command:
```sh
miactl marketplace get 65368hf0c91d871a87afbcbf > myAwesomeService.json

miactl marketplace get 65368hf0c91d871a87afvedc > myAcmeJsTemplate.json

miactl marketplace get 65368hf0c91d871a87afdase > myAcmeJsExample.json
```

:::tip

The local file fields won't be updated after the item creation.
We recommend to always download a new copy afterwards to keep your local copy up to date.

:::

From now on, the items you created will be visible as a clickable card inside the Internal Company Marketplace section of the Console.

For example, here is "My Awesome Service"'s card:

![awesome service](img/awesome_service.png)

:::tip

Further information about the `apply` command can be found in the [dedicated doc](/cli/miactl/30_commands.md#apply).

:::

### Update an item

:::info

You need to have *Company Owner* or *Project Administrator* role at Company level to perform this action

:::

Imagine now that you noticed that the description of "My Awesome Service" is not correct and you want to change it.

First of all, download and save the latest version of the item configuration:

```sh
miactl marketplace get ITEM_ID > myAwesomeService.json
```
where `ITEM_ID` is an alphanumerical id of the Marketplace item.  
If you don't know the item id, use the `miactl marketplace list` command to list all the Marketplace Items. You can easily locate the one of interest by looking for its name.

:::tip

It is suggested to always download the Marketplace item just before updating it to make sure it works on the latest version.

:::

Edit your file following the steps described in the [Modifying the Marketplace Item](#enabling-the-visibility-to-all-companies); 
once you are happy with the changes, save the file and apply it to the Marketplace:

```sh
miactl marketplace apply -f myAwesomeService.json
```

You will see the outcome of the operation in the command output:
```
1 of 1 items have been successfully applied:

  ID                        ITEM ID             NAME                 STATUS   

  65368hf0c91d871a87afbcbf  my-awesome-service  My Awesome Service   Updated
```

The changes are now reflected to the Console.

### Delete an item

:::info

You need either the *Company Owner* or *Project Administrator* role at Company level to perform this action

:::

Imagine you notice that the service "My Awesome Service" is no longer useful for your Company and so you want to delete it.

You can delete an item from the Marketplace by means of the `delete` command:

```sh
miactl marketplace apply -f myAwesomeService.json
```

The item is then deleted from the Marketplace. 

The deletion is permanent, but the file on your machine will not be deleted.
If you want, you can recreate the item on the Marketplace again by applying the file.

## Open an issue on Mia-Platform Github community page

To contribute to the Mia-Platform Marketplace using this method, start by opening an issue [here](https://github.com/mia-platform/community/issues/new?assignees=%40mia-platform%2Fsig-marketplace&labels=marketplace&projects=&template=marketplace-contribution.yaml&title=%5BNew+marketplace+item%5D%3A+). This issue will outline the necessary information for your request.  
Subsequently, a Mia-Platform representative will take over the issue and contact you to collaboratively plan the addition of the component to the Mia-Platform Marketplace, following the guidelines described on [this documentation page](/marketplace/add_to_marketplace/contributing_overview.md).

### Using the CMS

To make a Marketplace item of your Company accessible to other Companies, you first need to create it in the CMS. Follow the instructions on [this page](/marketplace/add_to_marketplace/contributing_overview.md#how-to-configure-a-new-component) to do so,

If the item is already present, just edit it, following the [related section](#enabling-the-visibility-to-all-companies).


