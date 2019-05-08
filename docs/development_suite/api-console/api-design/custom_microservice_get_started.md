# Templates overview

The API Console allows the user to create custom microservices from a template;
it manages the following templates:

 * **node-fastify**: a ready-to-use Node.JS template that provides a server for restful services through the Mia-Platform [Custom Plugin](/development_suite/api-console/api-design/plugin_baas_4/#factory-esposta-da-custom-plugin-lib) that take advantage of the <a href="https://www.fastify.io/" target="_blank">Fastify</a> server;

 * **java spring-boot**: a ready to use Java & <a href="https://spring.io/projects/spring-boot" target="_blank">Spring Boot</a> template that provides a server for restful services through the Mia-Platform [Custom Plugin](/development_suite/api-console/api-design/plugin_baas_4/#factory-esposta-da-custom-plugin-lib);

 * **angular 2+**: a ready to use <a href="https://angular.io/" target="_blank">Angular 2+</a> template that provides a basic Angular project, already up and running and ready to be customized.

> These templates are all under the voice **CREATE FROM TEMPLATE**:
> ![](img/Service_create_from_template.png)<br>
> The service types can be different based on the API Console you are working on)

## Our first custom service based on template

Following we will see how to create a custom Microservice using the [API Console](/development_suite/overview-dev-suite/); this guide is generic, so you can follow it to create any type of custom microservice from template.

#### 1. Login into the API Console
To access into the API Console check the [specific page](/development_suite/api-console/accedi_apiconsole/) and, when done, keep going.

#### 2. Service creation
Once into the API Console, we have to create our service (__template-service__ from now).
To do this, follow these steps:

 1. Click on Services
 2. Click on Create new service
 3. Add the service information:
    * **type**: your favorite service under the __CREATE FROM TEMPLATE__ voice (the service types can be different based on the API Console you are working on)<br>![](img/Service_create_from_template.png)
    * **name**: the service name
    * **description**: the service description
    * **gitlab group path**: the gitlab group where you want to save the service repository
    * **gitlab repository name**: the gitlab repository name that you want for your service
    * **docker image name**: the docker image name, you can leave the default one too
    * look at the result<br>![](img/Service_from_template_creation_page.png)
 4. Create the service
 5. Click on the K8S configurations written button<br>![](img/k8s_already_written_configs.png)
 6. Insert a description (optional)

> <u>**NB.**</u> the API Console will show a yellow label now bacause there are unsaved changes
>![](img/API_console_unsaved_changes.png)
> <u>**Do not save the changes now**</u>, we will save them later.

#### 3. Creating the endpoint

Now we have our custom service repository __*already deployed__ on the Mia-Platform <a href="https://nexus.mia-platform.eu/" target="_blank">Nexus repository manager</a>, but we need an endpoint to call to access our custom service.

>__*already deployed__: it depends on the project and technologies we are working on, because we have clients that are not using the Gitlab Continuous Integration mechanism too, so we can need some other step to have the first image built after the service and repository creation.<br>
>**e.g.** if we use a jenkins pipeline we can need to configure a webhoook on the just created repository before continue.

Following the steps for the creation of an endpoint:

 1. Click on endpoint
 2. Click on Create new endpoint
 3. Insert the endpoint data:
    * **base path**: the endpoint base path
    * **type**: select __Custom Microservices__
    * **service**: select the microservice that you just created
    * **description**: the endpoint description
    * look at the result<br>![](img/Endpoint_custom_microservices_creation.png)
 4. Click on the create button and your endpoint will be created<br>![](img/Endpoint_custom_microservices_created.png)

#### 4. Save the project
Finally it's time to save our modifications, so:

1. Click on the save button: ![](img/commit_and_generate.png)
2. Insert a commit title
3. Insert a commit message (optional)

After the deploy you will have your service up and running at the created endpoint.
To check if the service works, based on the chosen service type, you can:

 * call the **/-/healthz** path if the service uses the [Custom Plugin](/development_suite/api-console/api-design/plugin_baas_4/#factory-esposta-da-custom-plugin-lib)<br>![](img/healthz_response.png)<br>

 * navigate the created endpoint and see the html page (frontend services)<br>![](img/angular_template_page.png)
 * call the base endpoint should ever work for some different type, if the endpoint is not secreted and is public.