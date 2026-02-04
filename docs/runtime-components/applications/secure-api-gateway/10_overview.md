---
id: overview
title: Introduction
sidebar_label: Overview
---



:::danger
The application is deprecated, and no active development, new versions, or bug fixes are planned. It will reach end of life with the v14.0.0 of the console.
:::

The **Secure Api Gateway** is an application that allow you to set up all the microservices and endpoints to enable an authorization flow using Auth0 or other external IDP.
The application contains the following **microservices**:

- `Authorization Service`
- `API Gateway`
- `Auth0 Client`
- `OAuth Login Site`

Moreover the application adds the following **endpoints**:

- `/web-loging`
- `/authorize`
- `/oauth/token`
- `/user-info`
- `/logout`

and the following **public variables**:

- `AUTH0_NAMESPACE`
- `AUTH0_CALLBACK_URL`

To have a deeper understandin on how to use the **Secure API Gateway** application to secure a [Microfrontend Composer] application with Auth0 as external provider check our [detailed tutorial](/products/microfrontend-composer/tutorials/auth0-integration.mdx).

To have an overview on how to use the **Secure API Gateway** application to secure an application in a scenario where you still have an external Identity Provider (IdP) but the token used by the client is produced within your project so that you can manage the user groups within your project using a dedicated CRUD collection read the [dedicated tutorial](/products/microfrontend-composer/tutorials/auth0-integration.mdx).

# Components Overview

## Authorization Service

The [authorization-service](/runtime-components/plugins/authorization-service/10_overview.md) is added by the application if it does not already exist.
The **authorization-service** is used to manage the [authorization flow](/products/console/project-configuration/auth-flow/authorization-flow). It is created with a standard configuration, with `USERINFO_URL` pointing to the `auth0-client` service.

To have a complete overview of all the possible configurations for the **authorization-service** read the [dedicated documentation page](/runtime-components/plugins/authorization-service/20_configuration.md).

## API Gateway

The API Gateway is the microservice responsible for:

- routing requests to the correct service inside Kubernetes;
- verify the need of authentication and orchestrate the conversation with Auth service.

For further details you can refers to the [dedicated documentation](/runtime-components/plugins/api-gateway/10_overview.md).

## Oauth Login Site

This microservice will be responsible for the authentication part of the process, allowing the user to insert his/her credentials and proceed with the login process.

With the _oauth-login-site_ microservice the following endpoints are added to your project:

- `/web-login`

## Auth0 Client

The [auth0-client](/runtime-components/plugins/auth0-client/10_overview.md) is added if it does not already exist in order to handle authentication and user management using Auth0 as identity provider.

With the _oauth-client_ microservice the following endpoints are added to your project:

- `/authorize`
- `/oauth/token`
- `/userinfo`
- `/logout`

## Public Variables

- `AUTH0_NAMESPACE`: name of the namespace of Auth0 tenant,
- `AUTH0_CALLBACK_URL`: a URL to which Auth0 redirects the user at the end of the authentication process. Its value should be `https://{{HOST}}/web-login/callback`.
