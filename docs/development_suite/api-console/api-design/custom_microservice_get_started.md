---
id: custom_microservice_get_started
title: Create Microservice from Template
sidebar_label: Create Microservice from Template
---
Following we will see how to create a Microservice using the [Console](/development_suite/overview-dev-suite.md).

:::info
The following guide is generic, so you can follow it to create any type of Microservice from template.  
You can read [here](/development_suite/api-console/api-design/plugin_baas_4.md) a dedicated guide about creating from the **Node.js Template**
:::

### 1. Microservice creation

In the Console, follow these steps:

 1. Go to `Design section` and click on `Microservices`
 2. Click on `Create a Microservice`:  
   ![new-examples](./img/Marketplace-categories.png)
   You can search for a template, adding `Templates` to types filter. Each template belongs to specific **Category**. You can filter by category using `Filter by categories` filter.
 3. Select a Template and revise or fill the Microservice information:
      * **Name of the Microservice** (*required*): it will be used as internal hostname
      * **Description** (*optional*): this is the description of your Microservice
      * **Git Repository owner** (*required*): choose the path where the repository is created. Only the accessible paths will be available for selection.
      * **Git Repository name**: the name of the git repository that will be created.
      * **Container Registry**: The Container Registry where the microservice image resides in.
      You can use any Container Registry configured in the current Company
      * **Docker image name**: the Docker image path.  
      The shown hostname cannot be modified: it is automatically filled with the hostname of the selected Container Registry
 4. Finally, click on the `Create` button

The Console creates a new git repository on your Provider, by cloning the original Template repository.

If everything is successful, you will be presented the details page of the newly created Microservice, where you can proceed in further customizations.

:::caution

Please notice that the new service repository is created *before* the Console configuration is saved.

Therefore, if you do not save the configuration after the Microservice is created, the repository will remain on your Git provider, even if the service is not present among your microservices.

In case this happens, we suggest to delete the created repository and start over with the template creation.

:::

### 2. Creating the endpoint

Now we need an endpoint to call to access our Microservice.

Following the steps for the creation of an endpoint:

 1. Go to `Design section` and click on `Endpoints`
 2. Click on `Create new endpoint`
 3. Insert the endpoint data:
    * **base path**: the endpoint base path
    * **type**: select __Microservice__
    * **Microservice**: select the Microservice that you have just created
    * **description**: the endpoint description
 4. Click on the `Create` button and your endpoint will be created

### 3. Save the project

Finally it's time to save our configuration, so:

1. In the main navbar, on the top, click on `Commit & Generate` button
2. Insert a commit title
3. Insert a commit message

### 4. Deploy the project through the API Console

In order to have our Microservice _up and running_ follow these steps:

1. Go to `Deploy section` and click on `Endpoints`
1. Select the environment and the branch to deploy
1. Click on the `Deploy` button
1. Wait for the end of the deploy process

Now your Microservice should be _up and running_, you can check it calling the **/-/healthz** route. You should get a response like this:  
![image alt text](img/healthz_response.png).  
The `status` property should be *OK*.

Trough the [Log & monitoring section](/development_suite/monitoring/introduction.md) you can monitor the status of the related Microservice container
