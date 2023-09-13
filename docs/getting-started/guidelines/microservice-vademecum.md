---
id: microservice-vademecum
title: Microservice Vademecum
sidebar_label: Microservice Vademecum
---
Microservice applications consist of small, scalable, and independently controlled services that communicate with each other through standard protocols and well-defined interfaces.

:::info
You can write your own microservices in any language.
:::

## Required basic routes ##

Below are listed some required routes that each microservice has to expose.

### Documentation Routes ###

`/documentation/json`

Each microservice must expose the Swagger documentation route. For further information about Swagger, see the [Swagger Aggregator page](/runtime_suite/swagger-aggregator/10_overview.md).

### Health routes ###

Each microservice exposes some useful routes to the ecosystem. Through these routes it is in fact possible to have information on the health of the systems, and to carry out debugging checks.

:::info
If you are creating a microservice from a template, a plugin or an example, the routes described below will be implemented by default. If you are creating a microservice from scratch, you will have to manually implement these routes.
:::

#### Liveness route ####

`/-/healthz`

This route returns a 200 status code if the application is correctly running. If an unrecoverable internal error occurred, this may return a 503 status code.

For example, if your application implements a connection pool and a connection goes down, the application should not return 503 on this route because your connection pool is still alive.
Instead, the application should return 503 if your application has only one connection to the database that goes down, and your application doesn't recover the connection properly.

#### Readiness route ####

`/-/ready`

This route will identify if the container is "able to process new incoming request". During the startup, this route returns 503. After the startup, this route returns 200, if in that time the pod is able to serve requests.

In some conditions, the pod can communicate to Kubernetes that it is under pressure, and new incoming requests may be served with a delay or may not be served at all. In this condition, the readiness route may return 503, even if your pod is up and running.  
When this occurs, Kubernetes avoids sending to the pod new incoming TCP connections. Only once the container returns 200, Kubernetes restores the pod status and inserts it into the pool of the Service, allowing new incoming requests to reach the pod.

#### Check-up route ###

`/-/check-up`

The purpose of this rout is to check the status of all the microservice dependencies.

:::caution
This route is not used by Kubernetes, but **exclusively** by the [**Doctor service**](/runtime_suite/doctor-service/configuration.md).
:::

If your application depends on:

- Another microservice, this route should invoke the `/-/healthz` route of that service;
- An external microservice, this route should invoke its status route;
- Another dependency like Database or Kafka, this route should check if the dependency is reachable.

This route has to return 200 if, and only if, **all pod dependencies** are up. If even a single pod dependency is down, the route returns 503.

:::warning
**Never call the `/-/check-up` route of another service in the check-up handler of a service**: this avoids having a loop of `/-/check-up` calls.  
The only service who can call the `/-/check-up` route is the _Doctor service_.
:::

## Kubernetes usage of liveness and readiness ##

Many applications running for long periods of time eventually transition to broken states, and cannot recover except by being restarted. Kubernetes provides liveness probes to detect and resolve such situations.

[Kubernetes kubelet](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) uses liveness probes to know when to restart a Container.

Readiness probes are used to know when a Container is ready to start accepting traffic. When a Pod is not ready, it is removed from Service load balancers.
