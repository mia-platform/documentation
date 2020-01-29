### Microservice Gateway ###


This microservice provides the ability to specify http hooks to call before and after each request, to decorate it with additional services.
Such services can modify the request (`PRE` hook), for example to add ACL functionality, or to act after the request to the service has been done (` POST` hook), for example to add more data to the reply.

The Microservice Gateway takes care of making calls to these hook services specified by configuration at startup, and modifying (or interrupting) the request as indicated by the services.

Hook microservices must meet a precise http interface to be successfully interrogated by the Microservice Gateway.

![](img/mg.PNG)
