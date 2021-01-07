---
id: endpoints
title: Create Endpoints
sidebar_label: Create Endpoints
---

## What is an endpoint

An endpoint allows you to expose your CRUD, Services and proxies. To rapidly create an endpoint linked to a CRUD, you can follow the steps described in [Design QuickStart page](../../../getting_started/quick_rest_api.md).  

This page will delve into the endpoint types and configuration.

An endpoint can be of different types:

* **CRUD**: hook your endpoint directly to one of your CRUD.
* **Microservice**: hook your endpoint to a service with logics entirely created by you.
* **External proxy**: hook your endpoint to a proxy linked to a service outside of your cluster.
* **Cross Projects proxy**:  hook your endpoint to a proxy linked to another project contained in your cluster.
* **Mia-Platform BaaS** _Deprecated_: hook your endpoint to some specific Mia-Platform services.

:::warning
The type is selectable only during the creation phase. You can't change later.
:::

## Basic endpoint properties

All endpoint types share the following properties:

* **Basepath**: is the prefix of the route. It can be set as the base address to which the API is served, relative to the host (name or ip) that supplies the endpoint.
* **Description**: optional description of the endpoint.

## Specific endpoint properties

## CRUD

Upon creation of CRUD type endpoints you will be able to choose any _CRUD Base Path_ from the routes that have been configured in the CRUD section.

You can find more info about how to create an internal endpoint in the [CRUD documentation](crud_advanced.md)

## Microservice, External Proxy and Cross Project Proxy

These endpoint types all share the microservice property that allows you to link the endpoint to a specific microservice (or proxy) configured in your project.

After you created an endpoint linked to a microservice you'll be able to edit the _Rewrite Base Path_ this path is useful to customize the base path that is used when invoking APIs exposed by the linked microservice.

## About Rewrite Base Path

The developer can decide which basepath is associated to an endpoint by applying an internal rewrite url.

When a call enters the platform it undergoes a rewrite by the API Gateway or the Microservice Gateway and arrives at the service with a different path.

So for example in the case mentioned above when the API gateway enters the platform to call `/test-service-1` will call it with `/`

From this section, you can configure his own custom rewrite and, if necessary, view the default platform.

:::warning
For the CRUD endpoint it's not possible to set an internal Rewrite. The Internal Rewrite is / by default.
:::

## Manage the security of your endpoints

In the Management section, you can manage the security and the permissions at the endpoint level.

You can configure permissions and security settings of the endpoint.

The security can be managed at three levels:

1. The `Public` flag enabled allows to call endpoint **without the need to be logged in**. If it's disabled and the endpoint is invoked by an **unregistered user**, the request will receive an Unauthorized error.
2. The `Only with an API Key` flag configures the endpoint to require setting the `secret`/`client-key` header with a valid [API Key](api_key.md). You can also set a `mia_client_key` cookie with the value of the API Key.
:::tip Example of request passing an API Key
`curl --request GET --url <https://your-url/endpoint> --header 'accept: application/json' --header 'secret: <Api Key value'`
:::
1. `User Group Permission` allows defining a logical expression for authorizing or not the call. If the expression validates to **true**, then the user can access the route. You can use the following properties:
   * `clientType=='<clientType associated with Api Key>` to identify the client author of the call. In this way, you can limit the access to the only selected clients, identified by the API Key passed in the `secret` or `client_secret` headers.  
    E.g:

      ```js
        clientType=="apiKey" || clientType=="apiKey2"
      ```

    :::info
    If you have entered a Client Type the endpoint will be secured by API Key even if the `Only with an API Key` flag is disabled
    :::

   * `groups.<group name>` or `<group name> in groups` to check the **group of logged user**. So you can limit the access to specified groups.
    E.g:

    ```js
    // Limit access only to users in "admin" group
    groups.admin
    ```

    ```js
    // Limit access only to users in "admin" or "user" group
    ["admin", "user"] in groups
    ```

    * `permissions.<permission name>` or `<permission name> in permissions` for limit the access to entities (being user or other clients) having the specified permissions.
     E.g:

    ```js
    // Limit access only to users which have "write:orders" permission
    permissions["write:orders"]
    ```

    ```js
    // Limit access only to users which have "write:orders" or "view:orders" permission
    ["write:orders","view:orders"] in groups
    ```

The group expression can also be set to `0` (**none**) or to `1` (**all**). You can combine different expressions using logical operators `&&` (and) and `||` (or).

If the endpoint is linked to a [CRUD](#crud) you can specify dedicated user permissions for the CMS application.
Enable the flag `inherited` to use the displayed default expression or disable the flag to change it. However, you can't remove the checks on [isBackoffice](../../../runtime_suite/session-manager.md) property that ensures the expression will be considered only for calls will come from CMS.

![endpoint_security](img/qs-configure-endpoint-api-key.png)

:::tip
If you figure out that there's some problem in how you configured the security of your endpoints, go to [Log & Monitoring section](../../monitoring/monitoring.md) to check out the logs of [Authorization Service](../../../runtime_suite/authorization-service/how_to_use.md). Here you can see the logs about authorization operations, included eventually group expression errors.
:::

:::tip Api Key
Check out the [API Key section](api_key.md) to know more about the API Keys
:::

## Manage the visibility of your endpoints

In the Management section, you can manage the endpoint visibility in the [API Portal](../../api-portal/api-documentations.md).

The `Show in API Portal` flag enabled allows seeing all endpoint routes in the [API Portal](../../api-portal/api-documentations.md) documentation. By **default**, all endpoints have this **flag enabled**. Disabling this flag for any endpoint type will guarantee that all its routes will not appear.

The visibility can also be defined at the route level in the [routes](endpoints.md#routes) section. In this way, it is possible to specify which routes of a specific endpoint should be present in the API Portal and which should not.  
The `inherited` flag enabled (by default) will guarantee that the selected route will inherit the visibility of its base endpoint.
Disabling this flag for a specific route will allow defining a custom behaviour for that route.

Managing the visibility of endpoints and their routes is useful if, for example, you want to show publicly exposed routes while hiding in the API Portal the ones that require special permission that users do not possess.  

:::caution
It is important to notice that changing the visibility of an endpoint or a route **will not alter its functionality**, a route will **still be contactable** even if its visibility is hidden.
:::

## Transition through Microservice Gateway

Thanks to this feature, you can define, in each endpoint, which route is going to pass through Microservice Gateway.

To handle the transition from Microservice Gateway, you can use, in the section Endpoints of the area Design, the Microservice Gateway configuration card, which also includes two JSON checkboxes (request and response).

This card is equipped with a flag that, if you are enabled, allows to force the endpoint that you are editing to pass through the Microservice Gateway:

![Microservice_Gateway](img/Microservice_Gateway.png)

The Microservice Gateway service performs some checks on the content-type header:

* **Request**: If your endpoint uses content-type: *application/json* in requests, check "Support only JSON format" on request, otherwise uncheck it. If this is unchecked, you won't be able to access the request body from decorators, if set.

* **Response**: If your endpoint uses content-type: *application/json* in response, check "Support only JSON format" on response, otherwise uncheck it. If this is unchecked, you won't be able to access the response body from the POST decorators, if set.

:::warning
If your project has the microservice-gateway disabled, the configuration of the transition through Microservice Gateway is skipped.
:::

## Routes

In this section you can view all the path that can be called of a CRUD endpoint. By selecting the different verbs in the management section it is possible to further detail on who has the permissions to do certain actions.

If **inherited** is active the field will inherit the behavior of the base endpoint, de-selecting it can set specific rules related to this route.

:::tip
For example, we can set that the `DELETE/` can only be reserved for a specific group of users (admin).
We must therefore choose not to inherit global settings. Then we de-select inherited and in the input we write: groups.admin.
![route example](img/example-endpoints.png)
:::
