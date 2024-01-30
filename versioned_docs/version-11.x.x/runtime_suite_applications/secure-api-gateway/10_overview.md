---
id: overview
title: Overview
sidebar_label: Overview
---
This application allows you to setup all the microservices and endpoints to enable front-end authorization with Auth0.

## Authorization Service

The [authorization-service](../../runtime_suite/authorization-service/overview) is added (if it does not already exist) in order to manage the [authorization flow](../../console/project-configuration/authorization-flow). It is created with a standard configuration, with `USERINFO_URL` pointing to the `auth0-client` service.

## API Gateway

The API Gateway is the microservice responsible for:
- routing requests to the correct service inside Kubernetes;
- verify the need of authentication and orchestrate the conversation with Auth service.

For further details you can refers to the [dedicated documentation](../../runtime_suite/api-gateway/overview).

## Oauth Login Site

This microservice will be responsible for the authentication part of the process, allowing the user to insert his/her credentials and proceed with the login process.

### Endpoints

- `/web-login`

## Auth0 Client

The [auth0-client](../../runtime_suite/auth0-client/overview_and_usage) is added (if it does not already exist) in order to handle authentication and user management using Auth0 as identity provider.

### Endpoints

- `/authorize`
- `/oauth/token`
- `/userinfo`
- `/logout`

### Public Variables

- `AUTH0_NAMESPACE`: name of the namespace of Auth0 tenant,
- `AUTH0_CALLBACK_URL`: a URL to which Auth0 redirects the user at the end of the authentication process. Its value should be `https://{{HOST}}/web-login/callback`.
