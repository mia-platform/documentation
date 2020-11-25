---
id: api-gateway
title:  API Gateway
sidebar_label: API Gateway
---
The API Gateway is the microservice responsible for:

- routing requests to the correct service inside Kubernetes;
- verify the need of authentication and orchestrate the conversation with Auth service.

Its main features are:

* URL Mapping
* Rate Limit with Burst
* Http Secure Headers
* Request Dispaching
* API Key Management
* Http Utilities
* Proxy-Pass Plain
* URL Rewriting
* Microcache

The service is based on Nginx. All configurations are written by Console and stored on Git. Every time the Console deploy a new configuration Kubernetes apply it automaticcaly.

![API Gateway](img/gateway.PNG)

## Edge Router

Edge Router is part of the API Gateway module and protects the API Gateway guaranting:

- SSL termination;
- route dispatching.

### Certificate Management

The Edge Router manages the termination of the SSL certificates with auto-renew on Let's Encrypt.
