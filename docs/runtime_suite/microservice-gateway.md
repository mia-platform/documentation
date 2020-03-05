## Microservice Gateway ##


This microservice provides the ability to specify http hooks to call before and after each request, to decorate it with additional services.
Such services can modify the request (`PRE` hook), for example to add ACL functionality, or to act after the request to the service has been done (` POST` hook), for example to add more data to the reply.

The Microservice Gateway takes care of making calls to these hook services specified by configuration at startup, and modifying (or interrupting) the request as indicated by the services.

Hook microservices must meet a precise http interface to be successfully interrogated by the Microservice Gateway.

![](img/mg.PNG)

### Pre and Post Hooks ###

Pre and Post Hooks are reusable and convenient tools that can be used with the console. But in which situation is appropriate to use them?    
 * When I want to change the behaviour of core components or the logic of frontend and backend components on which I cannot make changes;   
 * If, due to the convenience of having the functionality available through console, I want to reuse simply and quickly the same logic for more routes;    
 * When, in order to make the CMS work with filter logics, ACL has to be attached to different objects;   
 * if I want to send notifications in small and limited projects.   

Moreover, to standardize responses, conversion mapping and ACL can be used as standard architectures. 

Be carefull: if you are having performance problems with Pre and Post Hooks, it can be due to:
 * slowness of cache management;
 * debugging difficulties.

Moreover, it is not convenient to use them to define and model business flows and to manage logics with high performances.
