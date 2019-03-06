Microservice applications consist of small, scalable and independently controlled services that communicate with each other through standard protocols and well-defined interfaces.

## Allowed languages ​​and available templates ##

You can write your own microservice in any language.
To date are available this template: NodeJS and Java.

## Template of a new project ##

The creation of a new project is facilitated thanks to the availability of some templates that guarantee the correct configuration of the various settings, including:

- Docker configuration (Dockerfile)
- Jenkins configuration (Jenkinsfile)

### Template NodeJS ###
https://git.tools.mia-platform.eu/platform/templates/nodejs-custom-plugin

### Template POJO Java ###
https://github.com/mia-platform/custom-plugin-java

### Template Java - SpringBoot ###
https://github.com/mia-platform/custom-plugin-java-springboot

## Required basic routes ##
Each microservice exposes some useful routes to the ecosystem. Through these routes it is in fact possible to have information on the health of the systems, and to carry out debugging checks.

### Health Routes ###
`/ - / healts /`
It must return 200 if the service and its possible dependencies are able to provide the one for which it was created.
For example, the service correctly communicates with the database, all its configurations are correct, has the resources necessary to be executed.

### State Routes ###
`/ - / ready /`
Answers 200 only when, upon release, all the preliminary operations necessary for the functioning of the service are completed. This route informs OpenShift about the availability of the service.

### Documentation Routes ##
`/ Documentations / swagger / json /`
Each microservice must expose the swagger documentation route
