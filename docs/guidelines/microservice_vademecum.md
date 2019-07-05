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

# Required basic routes #
## Documentation Routes ##
`/documentations/swagger/json`

Each microservice must expose the swagger documentation route

## Health routes ##
Each microservice exposes some useful routes to the ecosystem. Through these routes it is in fact possible to have information on the health of the systems, and to carry out debugging checks.

### Liveness route ###
`/-/healthz`

It returns 200 if the service is able to handle traffic properly.
For example, the service correctly communicates with the database.

### Readiness route ###
`/-/ready`

Answers 200 only when, upon release, all the preliminary operations necessary for the functioning of the service are completed. This route informs OpenShift about the availability of the service.

### Check-up route ###
`/-/check-up`

This route is **<u>exclusively</u>** used by the [**Doctor service**](/development_suite/doctor-service/services_status); it's purpose is to check the status of all the dependencies of the service (by calling the `/-/healthz` route, if exists) and returns `200` if all the dependencies are healthy, `503` if not.
**<u>NB.</u>** **Never call the `/-/check-up` route of another service in the check-up handler of a service** &rarr; this avoids to have a loop of `/-/check-up` calls, the only one who can call the `/-/check-up` route is the _Doctor service_.

#### Kubernetes usage of liveness and readiness ####
Many applications running for long periods of time eventually transition to broken states, and cannot recover except by being restarted. Kubernetes provides liveness probes to detect and remedy such situations.

[Kubernetes kubelet](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) uses liveness probes to know when to restart a Container.

Readiness probes are used to know when a Container is ready to start accepting traffic. When a Pod is not ready, it is removed from Service load balancers
