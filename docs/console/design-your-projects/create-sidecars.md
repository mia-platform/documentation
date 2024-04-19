---
id: create-sidecars
title: Create and Manage Sidecars
sidebar_label: Create Sidecars
---
## What is a Sidecar

A sidecar is a secondary container that runs together with the main application container inside a Pod. In your Console Projects, sidecars can be added to microservices to enhance or extend their functionality by providing additional features such as security, logging or data synchronization.

## Managing your Sidecars

From your Project's Design area you can manage all sidecars used by your microservices from the dedicated **Sidecars** section. You can also configure them directly from the **Sidecar detail page** inside the microservice the sidecar is attached to.

:::info
**Sidecars can only exist in pair with services**. It is not possible to create a sidecar without attaching it to at least one microservice.
:::

### Sidecars overview section

To have an overview of all sidecars in your Project and the microservices they are attached to, head over to the **Sidecars section**. 

<!-- TODO: SCREENSHOT of overview -->

For each sidecar, you can see all microservices that use it, together with information about the sidecar's specific configuration for each microservice, such as:
 - Docker image
 - CPU request and limit
 - Memory request and limit
 - ConfigMaps and secrets

By clicking on the Edit button inside the table, you can update sidecar configurations for each microservice:
<!-- TODO: SCREENSHOT of edit drawer -->

If you want to view the sidecar configuration in detail, use the **View sidecar configuration** button or click on the the sidecar name in the table row to go to its [detail page](#sidecar-detail) inside the microservice it is attached to.


By clicking on the Delete button inside the table, you can remove a sidecar from a microservice:
<!-- TODO: SCREENSHOT of single delete and bulk delete modal -->

:::caution
If the sidecar is used only by one microservice, removing it from the microservice will result in completely deleting the sidecar from the Project.
:::

#### Create sidecar from Docker Image

You can choose to create a new sidecar from an existing docker image by choosing this option in the **Create sidecar** dropdown. Fill the form with the sidecar name, docker image and microservices you want to attach it to (must be at least one), and press Create.

<!-- TODO: SCREENSHOT of creation form -->

#### Create sidecar from Marketplace

You can choose to create a new sidecar from the Marketplace by choosing this option in the **Create sidecar** dropdown. Choose the desired sidecar among the available Marketplace items and fill in the creation form, then press Create.

<!-- TODO: SCREENSHOT of creation form -->

#### Delete sidecar

If you want to delete a sidecar from all microservices that use it, go to the Advanced tab and click on the Delete sidecar button: by doing this you are completely deleting it from your Project.

<!-- TODO: SCREENSHOT of advanced tab -->

### Microservice sidecars

As already mentioned, sidecars only exist in pair with microservices. From the [microservice detail section](TODO: link) you can view all sidecars used by the service and manage each sidecar's configuration independently.

#### Microservice containers table

In the microservice detail General tab you can find the [Containers table](TODO: link to paragraph in the service documentation). In this card you can:
- view all containers that make up the microservice: the **main container**, which represents the service itself, and all **additional sidecar containers**
- for each container, have an overview of its main configurations and if it is exposed on a container port or not
- remove sidecar containers from the microservice by clicking the Delete button on the corresponding table row
- add a new sidecar to the microservice by clicking on the **Add container** dropdown

<!-- TODO: SCREENSHOT of containers table -->

:::info
If you have enabled [Rönd](TODO: link) on your microservice, you will see the `rbac-service` container in the Containers table. This is a special sidecar managed in the [Authorization page](TODO: link). Find out more about the `rbac-service` sidecar [in the dedicated paragraph](#authorization-sidecar).
:::
:::info
The main container and externally managed containers, such as the `rbac-service` container, cannot be removed from the microservice.
:::

#### Sidecar detail

To manage sidecar configurations on a specific microservice, click on the sidecar name in the [containers table](#microservice-containers-table). You will be taken to the sidecar detail page, where you can view and manage the following configurations (similarly to microservices):
- general configurations, including memory and CPU resources, container ports and runtime resources (TODO: link to the microservice config page)
- environment variables (TODO: link to the microservice config page)
- ConfigMaps and secrets (TODO: link to the microservice config page)

From the Advanced tab you can also decide to remove the sidecar from the microservice
<!-- TODO: SCREENSHOT of advanced tab -->

### Authorization sidecar

The `rbac-manager` container is a special sidecar created when Rönd is enabled on a microservice, and it is managed by the Authorization section.

You can find this sidecar the microservice containers table and in the Sidecars management section, but if you want to manage its configurations you must do it in the Authorization section. Find out more about defining custom security policies with Rönd in the [dedicated documentation page](TODO: link)

:::info
When Rönd is enabled on a microservice, the only container that can be exposed on a port is `rbac-manager`. All other containers present in the microservice, including the main container, will remain unexposed by default. In the microservice containers table, the exposure switch will be turned off and disabled.
:::