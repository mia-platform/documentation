---
id: services
title:  Configure your Services
sidebar_label: Configure
---
## Introduction

:::caution
All Microservices of the platform as a default are internally exposed on the **80 port** with **hostname equal to the service name**.  
So for example the [CRUD Service](../../../runtime_suite/crud-service/overview_and_usage.md) will be reachable at the url `http://crud-service`. This is applied to all microservices.
:::

In this section you can learn how to create and manage Microservices on Mia-Platform Console.

You can create a Microservice from the Marketplace section of Console. To learn more about Marketplace, you can read [this page](./../../../marketplace/overview_marketplace.md) of Mia-Platform Docs.

You can create a Microservice by:

* **using a Plugin**: a ready-to-use Microservice

* **using a Template**: a starting point to create a new Microservice

* **using an Example**: an existing and ready-to-use model

* **uploading a Docker Image Name**: an existing Docker image of a Microservice

![new-examples](./img/Marketplace-categories.PNG)

You can search for Microservices, filtering by Plugins, Templates and/or Examples.

Otherwise, you can search for them by category.

The results of your search will appear **organized by category**.

## How to create a Microservice from an Example or from a Template

The Microservice can be created starting from existing and ready-to-use Examples or Templates.

In the [Marketplace](./../../../marketplace/overview_marketplace.md) you can find a list of Examples or Templates powered and supported by Mia-Platform that allows you to set-up microservices with a tested and pre-defined function.

Whether you select Example or Template, you can create your microservice by filling in the following information:

* **Name of the Microservice** (*required*): this is the internal hostname

* **Description** (*optional*): this is the description of your microservice

* **GitLab Repository owner** (*required*): you have to select, from a list of options, where you want to save your microservice

:::warning
If you are using GitLab and don't see any option in *Git repository owner*, it means that you have no access to the GitLab group where the project resides: please contact your console administrator to solve this issue.
:::

* **Git Repository Name** (*required*): name of the git repository of the service

* **Docker Image Name** (*required*): docker image of the service. It should not have the docker host (e.g. "tenant/service-name:tag"). It will be filled with the docker host during the service generation

![service-example](img/service-example.png)

![service-template](img/service-template.png)

Finally to create the Microservice push **create**.

:::warning
Once the service is created on your Git provider, you will not be able to delete it anymore from Console.
:::

:::info
At this [link](../../../development_suite/api-console/api-design/custom_microservice_get_started/) you can find a more detailed guide and overview about how to create new service starting from Templates.
:::

## How to create a Microservice from a Docker Image

The only requirement to import an external Microservice is that the Docker Image needs to be already built.
Once you select the card to upload a Docker image, you can see a new tab where you need to fill in the following information:

* **Name** (*required*): this is the internal hostname;  

* **Docker Image Name** (*required*): the complete docker image name of the service. The docker image repository must be accessible by the cluster k8s;

* **Description** (*optional*): this is the description of your microservice.

![service-docker-image](img/service-docker-image.png)

Finally to create the Microservice push **create**.

## Manage Microservices

For each microservice, Console allows to:

* **Delete** the microservice: with the 'Delete' button present at the bottom of each microservice detail, you can delete it.

:::warning
Deleting a microservice, you are also deleting each associated endpoint.
:::

:::warning
Deleting the microservice will not delete the files *deployment.yml*, *service.yml* and previously configurated *configmap.yml*.
:::

* **View Repository**: this button, present only in microservices created from Examples and Templates, allows you to go directly to your git repository from the Console.

* **Clone**: this button, present only in microservices created from Examples and Templates, enables to clone code repository directly from Console. The code repository can be copied with both ssh and https.

The detail of each microservice is divided in the following sections:

### Microservice

In this section, you can edit microservice's Docker Image Name (this field remains required) and description.
Moreover, with a flag, you can decide to show or not the microservice in the documentation.

![service-detail-new](img/service-detail-new.png)

### Microservice Configuration

In this section, you can manage the resources dedicated to your microservice:

* **Memory Resources**: You have to specify the minimum number of mebibytes (Mi) that the container needs and the maximum number of mebibytes (Mi) that it can use.

* **CPU Resources**: You have to specify the minimum number of 'thousandth of a core' (m) that the container needs and the maximum number of 'thousandth of a core' (m) that it can use.

* **Log Parser** (*required*): You can select which parser will handle your microservice logs. Currently, you can parse log in the following ways:
  * *mia-json*: it parses json logs based on the documented format
  * *mia-nginx*: it parses logs of nginx that were created using templates and services of Mia-Platform (website and api-gateway)
  * *mia-plain*: it collects logs but it does not parse them
  * *not collected*: it is the default option, it does not collect logs and they are not sent to Elastic

See more about the log parsers on the [guidelines](../../../getting_started/monitoring-dashboard/dev_ops_guide/log)  

* **Probes**: Here you can set your microservice probes, which are routes used by Kubernetes cluster to know if the microservice is working (liveness) and ready to receive requests (readiness). These fields are valorized by default. If you leave these fields empty, there will be a tcp socket on the selected microservice port.

 ![service-detail-configuration](img/service-detail-configuration.png)

### Environment Variable Configuration

In this section, you can manage, add and delete the environment variables associated to your microservice. For each variable, you have to define:

* **Key** (*required*)

* **Value** (*required*)

* **Description**

 ![service-detail-variable-new](img/service-detail-variable-new.png)

 You can find more information about environment variables at this [link](../../set-up-infrastructure/env-var/) of Mia-Platform Docs.

### Custom Configuration

In this section, you can add custom configurations to your microservice without the need of using the advanced service configuration. This feature can be useful in different occasions, either when your microservice requires a specific functionality or to have access to particular kubernetes files.

In other words, if your microservice can not be managed in a usable way from environment variables, you can use Custom Configuration to add a configuration to your microservice.

:::info
You can use Custom Configuration if you want to write deployment files with a maximum of one container.
:::

There are two kinds of custom configurations: **ConfigMaps** and **Secrets**.

#### Add a Configuration

 With the button 'Add a Configuration', you can add a custom configuration by defining:

* **Type** (*required*): This is the type of your configuration: *configmap* or *secret*.

* **Configuration Name** (*required*): This is the name of your configuration.

* **Runtime Mount Path** (*required*): Path inside the service where you want to mount the directory.

![service-add-configuration](img/service-add-configuration.png)

For each configuration created, a new card will be visible.

#### ConfigMaps

You can mount files to your microservice using *configmaps*. This feature can be useful if your microservice requires a particular configuration that can be read from a certain type of file (e.g. a complex configuration file that can't be provided via simple environment variables).

Check out the files service [example](../../../runtime_suite/files-service/configuration) to further understand the role of configmaps in microservices.

You can click _Add file_ to generate a new custom file (e.g. a JSON or YAML file, but could be anything you need) and start writing your custom configurations. With the _Delete File_ button you can remove the file from your custom configuration.

 ![service-add-file-new](img/service-add-file-new.png)

#### Secrets

You can use this type of configuration in order to mount Kubernetes Secrets to your microservice.
Kubernetes secrets let you store and manage sensitive information (such as passwords, OAuth tokens, ssh keys, etc).

:::note
Check out the official [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/secret/) for more information about secrets.
:::

:::warning
Secrets associated to microservices must exists on your Kubernetes namespace.

:::
If your projects uses `mlp`, the Mia-Platform cli deploy tool, you can configure the `mlp.yaml` file inside your project configuration repository to generate secrets for you on the namespace.

To release custom secrets with mlp, add these lines to the mlp.yaml file:

```
secrets:
  - name: "client-credential-private-key"
    when: "always"
    data:
      - from: "file"
        file: "/tmp/private.key"
```

Once you have created a secret file on your kubernetes namespace, you can use this feature to associate it to your microservice.

When secrets are linked to a microservice, its deployment files are accordingly modified to automatically mount your secret files on kubernetes. This will allow you to use their private content directly from your microservice.

:::info
Once you'll add a secret to one of your microservices, the secret's name will be recorded and you'll be able to reuse it by easily adding the same secret to multiple microservices.
:::

:::warning
You need to give **additional permissions** to the console service account in order to be able to get the list of the secrets on the cluster.
:::

### Advanced Configuration

In this section, you can write your advanced configurations by filling the files:

* *File Deployment*: defines how the pod in Kubernetes is built (container, probes, ports).

* *File Service*: defines how to contact your deployment.

* *Configmaps*: configuration files that are mounted on the containers.

:::info
You have to use Advanced Configuration if you want to write deployment files with more than one container.
:::

 By switching from standard to advanced configuration (and vice versa), Console allows you to customize your Kubernetes files:

* **To switch from standard to advanced configuration**, you have to flag the option 'I want to write custom k8s files for this microservice'. Enabling advanced configuration, you can customize your kubernetes files.

    ![service-to-advanced](img/service-to-advanced.png)

    The advanced section allows you to configure service.yml and deployment.yml (*File Service* and *File Deployment*). You can also add configmaps by filling the *File path to create* and the *File name to create*.  By pushing the delete button, you can completely remove your advanced configurations.

:::warning
By switching from standard to advanced configuration, you will lose every standard configuration set before.
:::

* **To switch from advanced to standard configuration**, you have to de-flag the option 'I want to write custom k8s files for this microservice'. Coming back to standard configuration, you will no longer be able to customize your K8s files.

    ![service-to-standard](img/service-to-standard.png)

    If you configure your advanced service, deployment and configmaps files, when you come back to standard configuration, you can see your custom configuration files already filled with the environment variables. In other words, you can come back to standard configuration without loosing your advanced settings like your docker image, your variables and your configmaps.

:::info
We suggest you to convert in a standard mode all your microservices in order to achive a better governance of your microservices.
:::

:::warning
By switching from advanced to standard configuration, you are loosing all the containers, except for the first one that you have inserted. The docker image, all the environment variables and all the configmaps are preserved. Other advanced configurations will be lost.
:::
