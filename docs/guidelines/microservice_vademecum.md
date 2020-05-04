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
`/documentation/json`

Each microservice must expose the swagger documentation route

## Health routes ##
Each microservice exposes some useful routes to the ecosystem. Through these routes it is in fact possible to have information on the health of the systems, and to carry out debugging checks.

### Liveness route ###
`/-/healthz`

It returns 200 if the application correctly runs. If an unrecoverable internal error occurred, this may return a 503 status code.
For example, if your application implements a connection pool and a connection goes down, the application should not returns 503 on this route because your connection pool is still alive.
Instead, if your application has only one connection to the database and this goes down and your application doesn't recover the connection properly, the application should return 503.

### Readiness route ###
`/-/ready`

This route will identify the container is "able to process new incoming request". During the startup, this route returns 503. After the startup, this route returns 200, if in that time, the pod is able to serve requests.
In some conditions, the pod can communicate to Kubernetes that it is under pressure and new incoming request may be served with a delay or may not be served at all. In this condition, the readiness route may return 503 even if your pod is up and running.

In this case, Kubernetes avoids sending to the pod new incoming TCP connections. Only once the container returns 200, Kubernetes restores the pod status and inserts it into the pool of the Service allowing new incoming request to reaches the pod.

### Check-up route ###
`/-/check-up`

This route is not used by Kubernetes but **<u>exclusively</u>** by the [**Doctor service**](/development_suite/doctor-service/services_status).
It's purpose is to check the status of all the dependencies. If your application depends on:
- an another microservice, this route should invoke the `/-/healthz` route of that service
- an external microservice, this route should invoke its status route
- another dependency like Database or Kafka..., this route should check if the dependency is reachable.

This route has to return 200 if and only if all pod dependencies are up, 503 otherwise.

**<u>NB.</u>** **Never call the `/-/check-up` route of another service in the check-up handler of a service** &rarr; this avoids to have a loop of `/-/check-up` calls, the only one who can call the `/-/check-up` route is the _Doctor service_.

#### Kubernetes usage of liveness and readiness ####
Many applications running for long periods of time eventually transition to broken states, and cannot recover except by being restarted. Kubernetes provides liveness probes to detect and remedy such situations.

[Kubernetes kubelet](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) uses liveness probes to know when to restart a Container.

Readiness probes are used to know when a Container is ready to start accepting traffic. When a Pod is not ready, it is removed from Service load balancers
