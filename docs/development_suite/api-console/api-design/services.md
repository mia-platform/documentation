##Marketplace

Welcome to the Marketplace page!

In this section you can learn how to create a Microservice on Mia-Platform DevOps Console. 

First, login into Mia-Platform DevOps Console, access the Design area, and click on Microservices on the menu of the left sidebar. You will see the screen as below. 


![](img//screenMarketplace.png)



As you can see there are many  different cards, with the description of the service. Each of them has different coloured labels on the top right corner of the card: `r colorize("example", "blue") ` and `r colorize("template", "purple")`.

You can create a Microservice by: 
    * using an Example: a ready-to-use model;
    * using a Template: a starting point for a new Microservice;
    * uploading a Docker Image Name: a file that is used to execute code.


![](img/Marketplace.png)

There is one search bar, where you can look for a specific Microservice, and there is a filter bar where you can refine the search per type - either example or template. 


###How to create a Microservice from an Example

The Microservice can be created starting from existing and ready-to-use Examples:

    * Rest2Kafka Example;
    * Node.js PrePost Example;
    * Node.js HelloWorld Microservice Example;
    * Node.js Call CRUD Example;
    * Node.js Custom Plugin with Mongo Example;
    * GraphQL-Custom-Plugin Example;
    * Kafka2Rest Example.

Once you select the Example, you need to fill in the following information:

    * Name of the Microservice (required) - it is an internal hostname;
    * Description (optional);
    * GitLab Group Name - where the user wants to save the custom service (required);
    * GitLab Repository Name - for the custom service (required);
    * Docker Image Name (required).

![](img/example.png)


Then, to create the Microservice push  **create**.


###How to create a Microservice from a Template

The Microservice can be created starting from existing Templates:

    * Go Template;
    * Springboot Template;
    * React Template;
    * Angular Template;
    * Node.js Template;
       

Once you select the Template, you need to fill in the following information:

* Name of the Microservice (required) - it is an internal hostname;
* Description (optional);
* GitLab Group Name - where the user wants to save the custom service (required);
* GitLab Repository Name - for the custom service (required);
* Docker Image Name (required).


![](img/template.png)


Then, to create the Microservice push  **create**.


!!! warning
    Once that the service is created on Gitlab, the user will not be able to delete it anymore.

At the following [link](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/) the user can find a more detailed guide and overview about how to create new service starting from Templates.


###How to create a Microservice from a Docker Image

The only requirement to import an external Microservice is that the Docker Image needs to be already built.
Once you select the card to upload a Docker image, you can see a new tab where you need to fill in the followinf information:

* Name of the Microservice (required);
* Docker Image Name - path (required);
* Description (optional).


![](img/dockerImage.png)


Then, to create the Microservice push **create**.


###Manage Microservices

For each microservice, DevOps Console allows to:

 * Delete the microservice

 * View Repository: this button, present only in microservices created from Templates, allows you to go directly to your git repository from the DevOps Console.

 * Clone: this button, present only in microservices created from DevOps Console, enables to clone code repository directly from DevOps Console. The code repository can be copied with both ssh and https.
