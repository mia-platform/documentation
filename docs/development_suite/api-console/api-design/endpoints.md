---
id: endpoints
title: Create Endpoints
sidebar_label: Create Endpoints
---

## What is an endpoint

An endpoint allows you to expose your CRUD, Services and proxies. To rapidly create an endpoint linked to a CRUD, you can follow the steps described in [Design QuickStart page](../../../getting_started/quick_rest_api.md).

This page will delve into the endpoint types and configuration and will describe all the functionalities that you can find in the section **Endpoints** of the **Design** area of [Mia-Platform Console](../../overview-dev-suite).

An endpoint can be of different types:

* **CRUD**: hook your endpoint directly to one of your CRUDs.
* **Microservice**: hook your endpoint to a service with logics entirely created by you.
* **External proxy**: hook your endpoint to a proxy linked to a service outside of your cluster.
* **Cross Projects proxy**:  hook your endpoint to a proxy linked to another project contained in your cluster.
* **Mia-Platform BaaS** _Deprecated_: hook your endpoint to some specific Mia-Platform services.
* **Fast Data Projection**: hook your endpoint to the service which expose the Fast Data Projection. This type is visible only if Fast Data is enabled in the Console.
* **Fast Data Single View**: hook your endpoint to the service which expose the Fast Data Single View. This type is visible only if Fast Data is enabled in the Console.

:::warning
The type is selectable only during the creation phase. You can't change it later.
:::

## Basic endpoint properties

All endpoint types share the following properties:

* **Basepath**: is the prefix of the route. It can be set as the base address to which the API is served, relative to the host (name or ip) that supplies the endpoint.
* **Description**: optional description of the endpoint.

## Specific endpoint properties

### CRUD

Upon creation of CRUD type endpoints you will be able to choose any _CRUD Base Path_ from the routes that have been configured in the CRUD section.

You can find more info about how to create an internal endpoint in the [CRUD documentation](crud_advanced.md)

### Microservice, External Proxy and Cross Project Proxy

These endpoint types all share the microservice property that allows you to link the endpoint to a specific microservice (or proxy) configured in your project.

After you created an endpoint linked to a microservice you'll be able to edit the _Rewrite Base Path_. This path is useful to customize the base path that is used when invoking APIs exposed by the linked microservice.

### Fast Data Projection

This endpoint type is used to read data of the [Fast Data projection](../../../fast_data/create_projection).  
These APIs are read only, because they should be edited only by the [Real-Time Updater](../../../fast_data/overview#real-time-updater).

### Fast Data Single View

This endpoint type is used to read data of the [Fast Data Single View](../../../fast_data/sv_concepts).  
These APIs are read only, because they should be edited only by the [Single View Creator](../../../fast_data/single_view#create-the-single-view-creator-service).

## About Rewrite Base Path

The developer can decide which basepath is associated to an endpoint by applying an internal rewrite url.

When a call enters the platform it undergoes a rewrite by the API Gateway or the Microservice Gateway and arrives at the service with a different path.

For example, you can create an endpoint hooked to a microservice with a basepath like `/hello-service` and set as Rewrite Base Path something like `/customers`.  
In this way, the API Gateway (or the Microservice Gateway) will rewrite any call to `/hello-service` into `/hello-service/customers` and send it to the hooked service.

:::warning
For the CRUD endpoint it's not possible to set an internal Rewrite. The Internal Rewrite is / by default.
:::

## Manage the security of your endpoints

In the **Security Management** section, you can manage the security and the permissions at the endpoint level.

The security can be managed at three levels:

1. The `Public` flag enabled allows to call endpoint **without the need to be logged in**. If it is disabled and the endpoint is invoked by an **unregistered user**, the request will receive an Unauthorized error.
2. The `Only with an API Key` flag configures the endpoint to require setting the `secret`/`client-key` header with a valid [API Key](api_key.md). You can also set a `mia_client_key` cookie with the value of the API Key.
:::tip Example of request passing an API Key
`curl --request GET --url <https://your-url/endpoint> --header 'accept: application/json' --header 'secret: <Api Key value>'`
:::
3. `User Group Permission` allows defining a logical expression for authorizing or not the call. If the expression validates to **true**, then the user can access the route. You can use the following properties:
   * `clientType=='<clientType associated with Api Key>` to identify the client author of the call. In this way, you can limit the access to the only selected clients, identified by the API Key passed in the `secret` or `client_secret` headers.
    E.g:

      ```js
        clientType == "apiKey" || clientType == "apiKey2"
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

The group expression can also be set to `false` (to block all accesses to the API) or to `true` (to grant **all** accesses to the API). You can combine different expressions using logical operators `&&` (and) and `||` (or).  

For example, create an endpoint with the following security configuration:

* **Public** flag set to `true`.
* **Only with API Key** flag set to `false`.
* **User Group Permission** field set with the following expression: `groups.foo || clientType=="bar"`.

With this configuration, calls to this endpoint will have a different outcome depending on the credentials the user provides/has. Here is a list of possible outcomes:

* An unregistered user tries to contact your endpoint without providing any API key: the user receives an unauthorized error because the **User Group Permission** condition is falsy.
* An authenticated user with authorization group `foo` calls your endpoint without providing any API key: the call is successful since the first condition of **User Group Permission** is truthy and the API Key is not required.
* An unregistered user tries to contact your endpoint and provides the correct API Key value for the clientType `bar`: the call is successful since the second condition of **User Group Permission** is truthy, and endpoint is open to not authenticated calls.

If the endpoint is linked to a [CRUD](#crud) you can specify dedicated user permissions for the CMS application.
Enable the flag `inherited` to use the displayed default expression or disable the flag to change it. However, you can't remove the checks on [isBackoffice](../../../runtime_suite/session-manager.md) property that ensures the expression will be considered only for calls coming from the CMS.

![endpoint_security](img/qs-configure-endpoint-api-key.png)

:::tip
If you figure out that there is some problem in how you configured the security of your endpoints, go to [Log & Monitoring section](../../monitoring/monitoring.md) to check out the logs of [Authorization Service](../../../runtime_suite/authorization-service/how_to_use.md). Here you can see the logs about authorization operations, included eventually group expression errors.
:::

:::tip Api Key
Check out the [API Key section](api_key.md) to know more about the API Keys.
:::

## Manage the visibility of your endpoints

In the **Security Management** section, you can also manage the endpoint visibility in the API Portal.

The `Show in API Portal` flag enabled allows seeing all endpoint routes in the [API Portal](../../api-portal/api-documentations.md) documentation. By **default**, all endpoints have this **flag enabled**. Disabling this flag for any endpoint type will guarantee that all its routes will not appear.

The visibility can also be defined at the route level in the [routes](endpoints.md#routes) section. In this way, it is possible to specify which routes of a specific endpoint should be present in the API Portal and which should not.
The `inherited` flag enabled (by default) will guarantee that the selected route will inherit the visibility of its base endpoint.
Disabling this flag for a specific route will allow defining a custom behaviour for that route.

Managing the visibility of endpoints and their routes is useful if, for example, you want to show publicly exposed routes while hiding in the API Portal the ones that require special permission that users do not possess.

:::caution
It is important to notice that changing the visibility of an endpoint or a route **will not alter its functionality**, a route will **still be contactable** even if its visibility is hidden.
:::

## Transition through Microservice Gateway

Thanks to this feature, you can define, in all endpoints of type **CRUD** or **Microservice**, which route is going to pass through Microservice Gateway.  

In the **Configure microservice gateway** section you can manage the transition through the Microservice Gateway for all requests to the endpoint you are customizing.  

This card is equipped with a flag that, if enabled, allows to force the endpoint that you are editing to pass through the Microservice Gateway:

![Microservice_Gateway](img/Microservice_Gateway.png)

For endpoints of type **Microservice**, this section includes also two flags related to the format of the request/response.  
In particular, the Microservice Gateway service performs some checks on the **content-type** header:

* **Request**: If your endpoint uses content-type: *application/json* in requests, enable "Support only JSON format on request" flag. If this flag is disabled, you won't be able to access the request body from decorators, if set.

* **Response**: If your endpoint uses content-type: *application/json* in responses, check "Support only JSON format on response" flag. If this flag is disabled, you won't be able to access the response body from the POST decorators, if set.

:::warning
If your project has the microservice-gateway disabled, the configuration of the transition through Microservice Gateway is skipped.
:::

:::caution

* Due to an issue with microservice-gateway, content-type: `application/x-www-form-urlencoded` is converted to JSON.
* Due to another issue with microservice-gateway, if binary data (e.g. PDF file) passes through this service it could be wrongly encoded, resulting in corrupted files.

:::

## Routes

In this section you can create and manage all the routes that can be called from your endpoint in order to have a more granular control over them.  
Endpoints of type **CRUD** and **Fast Data Projection** have a specific set of routes and it is not possible to create new ones, but you can still manage the configuration of each of them.  
For all other endpoint types, you can create a new route by clicking the `Add new Route` button. You should then specify the **http verb** the **path** of the new route.  
Regarding the http verb, you can choose among the following:

* **GET**
* **POST**
* **PUT**
* **PATCH**
* **DELETE**

![route creation](img/create-route.png)

Once you have created all the routes that you need, you can start configuring them and even decide a different behaviour for each one.  
By selecting one verb in the sidebar of this section it is possible to see a detailed view about the configuration of the selected route.  
Here, it is possible to set or unset all the flags described in the other sections, but with a deeper granularity. In fact, while in the sections described before you were configuring your endpoint, in this section you are managing one specific route verb of your endpoint.  
For example, if in the **Security Management** section, you have checked the **Public** flag of a **Microservice** type endpoint with basepath `/test` it means that **all** routes that start with `/test` will be **Public** too.  
Instead if, in the same endpoint page, you uncheck the **Public** flag in the **Routes** section for the route `/management` with verb `DELETE` you will only change the behaviour of that specific route with that specific verb.  
Here we list some example routes and their behaviour with the configuration explained above:

* GET '/test': **Public** is `true`.
* GET '/test/management': **Public** is `true`.
* GET '/test/customers': **Public** is `true`.
* DELETE '/test/management': **Public** is `false`.
* DELETE '/test/management/sales': **Public** is `true`.

This feature is really helpful when you have to define a custom behavior for one of your routes that differs from the default one that you defined at endpoint level.

If **inherited** flag is enabled the field will inherit the behavior from its endpoint.  
By unchecking it, you can set specific rules for the selected route.

:::tip
For example, we can set that the `DELETE /` route can only be reserved for a specific group of users (admin).
If it differes from the endpoint settings we must choose not to inherit global settings; we can uncheck the "inherited" flag and, in the input field, we are now able to write: `groups.admin`.

![route example](img/example-endpoints.png)
:::

For endpoints of type **CRUD**, **Microservice** and **Fast Data Projection** it is also possible to link decorators to the selected route verb.  

:::info
For a detailed description on how to link a decorator to a route visit this [link](./decorators.md#link-a-decorator-to-a-route).
:::
