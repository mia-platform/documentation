##Marketplace

Welcome to the Marketplace page!

In this section you can learn how to create a Microservice on Mia-Platform DevOps Console. 

First, login into Mia-Platform DevOps Console, access the Design area, and click on Microservices on the menu of the left sidebar. You will see the screen as below. 


![](img//screenMarketplace.png)



As you can see there are many  different cards, with the description of the service. Each of them has different coloured labels on the top right corner of the card: example and template. 

You can create a Microservice in 3 ways: 
* use an Example
* use a Template
* use a Docker Image Name

There is one search bar, where you can look for a specific service, and a filter bar where you can refine the search per type - either example or template. 


![](img/Marketplace.png)



### Import services

The only requirement to import an external service is that the Docker Image needs to be already built.
By clicking on the *Import* button, a new tab is opened. Here, the user need to specify some information:

* Name of the service (required);
* Path for the Docker Image (required);
* Description (optional).

Finally, to create the service select **create**.

![](img/services-import.png)

### Services from Templates

The service can be create starting from some existing Templates:

* Node Template;
* Springboot Template;
* GraphQL Template;
* React Template.

Once the Template has been selected, the user needs to insert the following information:

* Name of the service (required);
* Description (optional);
* Gitlab Group path where the user wants to save the custom service;
* Name of the Gitlab repository for the custom service;
* Name of the Docker Image.

![](img/services-template.png)

Finally, to create the service select **create**.

!!! warning
    Once that the service is created on Gitlab, the user will not be able to delete it anymore.

At the following [link](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/) the user can find a more detailed guide and overview about how to create new service starting from Templates.


### Manage services

For each microservice, DevOps Console allows to:

 * Delete the microservice

 * View Repository: this button, present only in microservices created from Templates, allows you to go directly to your git repository from the DevOps Console.

 * Clone: this button, present only in microservices created from DevOps Console, enables to clone code repository directly from DevOps Console. The code repository can be copied with both ssh and https.
