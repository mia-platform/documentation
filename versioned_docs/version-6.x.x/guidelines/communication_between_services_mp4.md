---
id: communication_between_services_mp4
title:  Communication between microservices
sidebar_label: Communication between microservices
---
## Introduction

Platform 4 is made up of microservices, in which each one presents a specific set of functionalities. To make the microservices communicate with each other, we have identified best practices and conventions to uniform the communication mode, both between core components and custom microservices.

## Conventions

### Protocol

The communication protocol chosen for internal communication is `http`.

### Hostname and port

The services are released with hostname equal to the service name, on the `80` port. So for example the crud-service will be reachable at the url `http: // crud-service` (`http: // crud-service: 80`), the microservice-gateway to the url `http: // microservice-gateway` and so on. This is applied to all custom services.

### Data format

The most common format in communication between services is `JSON`, which is the most recommended format for transmitting structured data in REST APIs.
However, its use for all APIs is not obvious, in fact, for example, for file transfer, the HTTP protocol is used directly for download, and typically multipart requests for uploading.

### Documentation

Please refer to the `OpenAPI` (swagger) services documentation to actually check the routes and data format. Highly recommended is the display of a `live` documentation, which is served by the service itself and reflects the actual service routes (better if generated). By convention the route on which the documentation is expected is `/documentation` (for static HTML files) and`/documentation/json` or `/documentation/yaml` for the swagger file.

## Communication between services

There are two possibilities for reaching services in general:

- via `microservice-gateway`
- direct

In any case, it is very important to remember to carry on the Mia headers that contain the user id, its groups etc, so that even the invoked service has access to this information!

To facilitate communication between the services, a [library in node has been written](../development_suite/api-console/api-design/plugin_baas_4.md), it is still possible to call the services directly through http if other technologies are used.

### Communication via microservice-gateway

The microservice-gateway collects all the microservice APIs, and offers the possibility to hook web-hooks to calls that act as PRE (before the call) and POST (after the call) decorators. The call to the microservices from outside could then trigger other calls and other logic to complement the call itself. To have a consistent behavior even when calling services from within, it is advisable to go through the microservice-gateway.

To call a CRUD through the microservice-gateway, you must contact `http: // microservice-gateway / <collection-name> / <routes of the CRUD>`.
To contact a service through the microservice-gateway, contact `http: // microservice-gateway / <service-name> / <service-routes>`

### Direct communication

If you want to avoid passing through the microservice-gateway, you can contact the service directly as shown above. This is generally discouraged because any decorators of the call are evaded, but it is still possible.

## Platform services integration 3

To integrate platform 3 plugins, it is necessary to remember to carry forward also the header containing the Cookies.
