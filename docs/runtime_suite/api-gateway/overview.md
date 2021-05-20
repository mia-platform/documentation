---
id: overview
title: API Gateway
sidebar_label: Overview
---
## General overview

The API Gateway is the microservice responsible for:

- routing requests to the correct service inside Kubernetes;
- verify the need of authentication and orchestrate the conversation with Auth service.

Its main features are:

* URL Mapping
* Rate Limit with Burst
* Http Secure Headers
* Request Dispaching
* [API Key](../../development_suite/api-console/api-design/api_key.md) Management
* Http Utilities
* Proxy-Pass Plain
* URL Rewriting
* Microcache

## Architecture
The service exposes two different ports for allowing differentiation between application and backoffice routing.  
The application one will be exposed on port 8080, and the backoffice on port 8081: this will allow to have two different
url for the two servers.

![API Gateway](../img/gateway.PNG)

## Edge Router

Edge Router is part of the API Gateway module and protects the API Gateway guaranteeing:

- SSL termination;
- route dispatching.

### Certificate Management

The Edge Router manages the termination of the SSL certificates with auto-renew on Let's Encrypt.
