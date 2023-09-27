---
id: basics
title: Backoffice Tutorial Basics
sidebar_label: Backoffice Tutorial Basics
---

# Mia-Platform Backoffice Integration with Auth0

In this tutorial, we will integrate the Backoffice with Auth0 that allow us to:
- setup a frontend where users can register or authenticate to get access to the Backoffice
- protect Backoffice pages using ACLs to grant access to certain users

## What We Will Build

Throughout this tutorial, we will:

- [Set Up the Microservices](#setup-the-microservices)
- [Customize the Backoffice Appearance](#customize-the-backoffice-appearance)
- [Create a Backoffice Table Page](#create-a-backoffice-table-page)
- [Connect the Page to the Backoffice Menu](#connect-the-page-with-the-backoffice-menu)
- [Save and Deploy the Backoffice](#save-and-deploy)

## Prerequisites

Before starting this tutorial, we need to be familiar with the concepts of the [Mia-Platform Backoffice](/business_suite/backoffice/10_overview.md) and have completed:
* The [Backoffice Tutorial Basics](/getting-started/tutorials/backoffice/basics.mdx).

This tutorial will follow the following:
* [Secure API Gateway](/runtime_suite_applications/secure-apigateway/overview)

## Setup the Microservices

You can install almost all the microservices for this tutorial using the `Secure API Gateway` application:
1. Go to Applications and click on the `Create New Application` button.
2. Search for `Secure ApiGateway` and click on the card.
![Secure ApiGateway Application Marketplace](img/basics_01-search-backoffice-application.png)
3. Follow the wizard, selecting if you want to install new microservices or use existing ones.
4. At the end, click the `Create` button and then save the new Application.

This application will create:
* Microservices 
    - `Authorization Service`
    - `Api Gateway`
    - `Auth0 Client`
    - `OAuth Login Site`
* Endpoints
    - `/web-login`
    - `/authorize`
    - `/oauth/token`
    - `/userinfo`
    - `/logout`
* Public Variables
    - `AUTH0_NAMESPACE`
    - `AUTH0_CALLBACK_URL`

In order to handle the users on `Auth0` you need to install the `user-manager-service`:
1. Go to Microservices and click on the `Create a Microservice` button.
2. Search for `User Manager Service` and click on the card.
![User Manager Service Marketplace](img/basics_01-search-backoffice-application.png)
3. Choose the name of the service and then click the `Create` button.

## Configure the Microservices and Auth0

Now that you have created all the required microservices you need to configure them.

### API Gateway

You can follow this page: [API Gateway Configuration](/runtime_suite_applications/secure-apigateway/configuration#api-gateway)

### Authorization Service

You can follow this page: [Authorization Service Configuration](/runtime_suite_applications/secure-apigateway/configuration#authorization-service)

### Auth0 Client

The Auth0-Client service accepts the following environment variables:

- __LOG_LEVEL__: defines the logging level of the logger (default: `{{LOG_LEVEL}}`)
- __HTTP_PORT__: defines the http port to use (default: 8080)
- __SESSION_SCOPE__: defines the scope of the session
- __REDIS_MODE__: defines the redis mode (normal or sentinel) (default: normal)
- __REDIS_HOSTS__ (__required__): defines the redis hosts (default: `{{REDIS_HOSTS}}`)
- __SERVICE_CONFIG_FILE_NAME__ (__required__): defines the service config name (default: config)
- __SERVICE_CONFIG_PATH__ (__required__): defines the service config path (default: /configs)

The Auth0-Client service uses a single config map called `auth0-client-config` and the file, `config.json`, containing the configuration must follow this example:

```json
{
  "clients": {
    "frontEnd": {
      "auth0Url": "{{AUTH0_NAMESPACE}}",
      "clientId": "{{AUTH0_CLIENT_ID}}",
      "clientSecret": "{{AUTH0_CLIENT_SECRET}}",
      "redirectUrl": "{{AUTH0_CALLBACK_URL}}",
      "scopes": [
        "offline_access",
        "profile",
        "email",
        "website"
      ]
    }
  },
  "defaultClient": "frontEnd",
  "managementClient": {
    "auth0Url": "{{AUTH0_NAMESPACE}}",
    "clientId": "{{AUTH0_USER_MANAGEMENT_CLIENT_ID}}",
    "clientSecret": "{{AUTH0_USER_MANAGEMENT_CLIENT_SECRET}}",
    "supportedConnections": [
      "{{AUTH0_CONNECTION}}"
    ],
    "defaultCreateUserConnection": "{{AUTH0_CONNECTION}}"
  },
  "customClaimsNamespaces": [
    "{{MIA_NAMESPACE}}app_metadata",
    "{{MIA_NAMESPACE}}user_metadata"
  ]
}
```
In order to complete this configuration you have to define the following variables:
* `AUTH0_NAMESPACE`: the namespace of your tenant on Auth0 (i.e. https://tenant-name.eu.auth0.com/)
* `AUTH0_CLIENT_ID`: the Client ID of your Regular Application (you can find it inside `Dashboard > Applications > Your Regular Application`)
* `AUTH0_CLIENT_SECRET`: the Client Secret of your Regular Application (you can find it inside `Dashboard > Applications > Your Regular Application`)
* `AUTH0_CALLBACK_URL`: the url already defined during Auth0 configuration (i.e. https://your-project.cms.mia-platform.eu/web-login/callback)
* `AUTH0_USER_MANAGEMENT_CLIENT_ID`: the Client ID of your M2M Application (you can find it inside `Dashboard > Applications > Your M2M Application`)
* `AUTH0_USER_MANAGEMENT_CLIENT_SECRET`: the Client Secret of your M2M Application (you can find it inside `Dashboard > Applications > Your M2M Application`)
* `AUTH0_CONNECTION`: `Username-Password-Authentication`, the default Auth0 database
* `MIA_NAMESPACE`: the namespace you already set in the Rules configuration on Auth0

### User Manager Service

You can configure Auth0 following this page: [Auth0 Configuration](/runtime_suite/auth0-client/configure_auth0)
Briefly you have to:
* create a CRUD collection for Auth0 Users (i.e. auth0_users) and populate the variable USERS_CRUD_ENDPOINT (i.e. USERS_CRUD_ENDPOINT)
* create a CRUD collection for User Manager Service configuration (i.e. ums_configuration) and populate the variable UMS_CONFIG_CRUD_ENDPOINT (i.e. /ums-configurations)

Then you have to add new endpoints and modify some of the existing ones (beware that for all the following endpoints the `Rewrite Base Path` must be equal to the `Base path`):
* remove the `/oauth/token` endpoint linked to `auth0-client` and create the same endpoint linked to `user-manager-service`
* remove the `/userinfo` endpoint linked to `auth0-client` and create the same endpoint linked to `user-manager-service`
* add the `/refreshtoken` endpoint linked to `user-manager-service`
* add the `/users` endpoint linked to `user-manager-service`
* add the `/ums-configurations` endpoint linked to `ums-configurations` CRUD path

## Configure the Backoffice
Now that you have configured all the microservices you need to follow these last steps to configure the Backoffice to enable the creation of Auth0 users using it.

First of all you need to create the pages to handle users and `user-manager-service` configurations:
1. Go to Configurations, select the `Pages` tab and click on the `Create new page` button.
2. Select the following configuration
![User Manager Service Marketplace](img/basics_01-search-backoffice-application.png)
3. Click the `Save` button.
4. Repeat the first 3 steps to create the page for the `user-manager-service` configurations.

Then you can add the newly created pages to the Backoffice homepage:
1. Click on the `Layout` tab.
2. Select `Layout` from the left-side menu.
3. Click on the `Edit property` button under the `Menu Items` section on the right-side menu.
4. On the opened modal click on the `Add item` button.
5. Choose the following configuration: ![User Manager Service Marketplace](img/basics_01-search-backoffice-application.png)
6. Click on the `Save` button.
7. Repeat the first 6 steps to add the `user-manager-service` configurations page.

Then you have to set the user menu:
1. Click on the `Layout` tab.
2. Select `Layout` from the left-side menu.
3. Click on the `Edit property` button under the `Login and user context menu` section on the right-side menu, under the `Advanced Properties`.
4. On the opened modal click fill the `User Context URL` with the value `/userinfo`
5. Click on the `Add property` button related to `Logout` section.
6. Fill the `Redirect Url` with `/logout?redirect=/web-login?redirect=/backoffice`.
7. Click on the `Save` button.

## Configure the authorization process

In order to protect your Backoffice you need to follow these steps:
1. Go to Endpoints, select `/backoffice` and check the `Authentication required` checkbox under the `Endpoint settings`
2. Set the following variables on `Authentication Service`:
  - USERINFO_URL: http://user-manager-service/userinfo
  - AUTHORIZATION_HEADERS_TO_PROXY: cookie,authorization,client-type

The final configuration step is to change the API key client type with the one defined as defaultClient in the Auth0 Client configuration.

:::info
This step will allow the oauth-login-site microservice to obtain the right client key necessary for the authorization process.
:::

In our case, the client type will be **frontEnd**. 

The final configuration will look something like this: 

![API Key](./img/api_key.png) -> add API Key image

After that, you finally completed the configuration of the authentication process.
You can now try to access your application. You should be automatically redirected to a login page.

:::caution
In order to grant access to a user, make sure his/her credentials are also defined on your Auth0 platform.
:::

## Setup ACLs to show Backoffice sections to certain users
Here it will be described the ACLs setup to manage the access of users using groups.

## Save and Deploy

With all the configurations in place, save your changes and then deploy. For further details on the deploy command, consult the [Console Handbook](/getting-started/handbooks/project/usage.md).

![Backoffice Page Composer](img/basics_20-backoffice-table-page-output.png)

## Create a user using Backoffice
Here it will be described the process of user creation using Backoffice. The created user cannot see users and ums configurations table.

## Backoffice Tutorials

In this tutorial, you've learned how to set up the integration between Backoffice and Auth0 and to create Auth0 users using the Backoffice.

Also, make sure to check out:
* The [Backoffice Basics Tutorial ](/getting-started/tutorials/backoffice/basics.mdx) where we demonstrate how to create a new Backoffice and how to create a new Backoffice Page using the Backoffice Table Template.
* In the [Backoffice Templates Tutorial](/getting-started/tutorials/backoffice/templates.mdx), explore how to configure various page types with the Backoffice Page Composer and an iFrame Page.
* The [Backoffice Microfrontends Tutorial](/getting-started/tutorials/backoffice/microfrontends.mdx) provides guidance on configuring a Microfrontend using Angular or React, and its integration into the Backoffice.