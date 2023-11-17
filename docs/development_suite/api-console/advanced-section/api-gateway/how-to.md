---
id: how-to
title:  "Advanced API Gateway: How to?"
sidebar_label: How To
---

In this section, we will see how to configure the [API Gateway](/runtime_suite/api-gateway/10_overview.md) in advanced mode to achieve specific goals.

:::info
To change all the advanced settings, you have to access to the Console and go to the Advanced Section from the menu in the main sidebar of the Design Area.
:::

## What is a Map?

The **Map** concept will often be mentioned on this page. In this context, we refer to the [Nginx Map Module](https://nginx.org/en/docs/http/ngx_http_map_module.html) which allows you to compare the values of an Nginx variable with some conditions and assign it a new value depending on the match. In other words, it's a map between two values: *A* and *B*. The value of *B* will be set based on the value of *A*.

As first variable you can specify a simple string:

:::tip
Map a Capital City to his Country.

```
"Rome" "Italy"
"Brussels" "Belgium"
"Copenhagen" "Denmark"
```

:::  

The first argument can be also a **regular expression**. To do so you need to prefix the expression with a `~`

:::tip
Map a string to UpperCase or LowerCase

```
"~^[A-Z]+$" "UpperCase"
"~^[a-z]+$" "LowerCase"
```

:::

## How to proxy a request through a service

### Request from the frontend - port 8080

The **maps-proxyName** configuration map allows you to forward your request to a service, based on the sender user and the request done.

Action:

1. Go to Section: `api-gateway/maps-proxyName.before.map` or `api-gateway/maps-proxyName.after.map`
2. Write here your map

The syntax is:

```
$secret_resolution-$is_allowed-$original_request_method-$original_request_uri $proxy_name
```

The variables are:

- `$secret_resolution` : it checks if there is a `client-key` associated to the request. Values: *secreted* or *unsecreted*
- `$is_allowed` : *1* if the user has the required permission to access the resource (based on the nginx *auth_request*), *0* otherwise
- `$original_request_method` : request method. Allowed values are: *GET*, *DELETE*, *POST*, *PATH*, *PUT* or *\w+* to enable all methods
- `$original_request_uri` :  request uri prefix
- `$proxy_name` : destination service hostname

### Request from the Microfrontend Composer - port 8081

Action:

1. Go to Section: `api-gateway/maps-proxyBackofficeName.before.map` or `api-gateway/maps-proxyBackofficeName.after.map`
2. Write here your map

The syntax is:

```
$secret_resolution-$is_allowed-$request_method-$request_uri $proxy_backoffice_name
```

The variables are:

- `$secret_resolution` : it checks if there is a `client-key` associated to the request. Values: *secreted* or *unsecreted*
- `$is_allowed` : *1* if the user has the required permission to access the resource (based on the nginx *auth_request*), *0* otherwise
- `$original_request_method` : request method. Allowed values are: *GET*, *DELETE*, *POST*, *PATH*, *PUT* or *\w+* to enable all methods
- `$original_request_uri` :  request uri prefix
- `$proxy_name` : destination service hostname

:::info
If no request is matched by any regular expression, the default request is forwarded to `not_found`.
:::

:::tip
I want that if it's done a `GET` request to `/login-site` with or without client-key `(secreted|unsecreted)` from an authorized or not authorized user `(0|1)`, this request is forwarded to the `demo-login-site` service.

```
"~^(secreted|unsecreted)-(0|1)-GET-/login-site" "demo-login-site";
```

:::

:::tip
I want that if it's done a `POST` request to `/foo/bar` with an associated client-key from an authorized user `1`, it's forwarded to `foo-bar-manager`.

```
"~^secreted-1-POST-/foo/bar" "foo-bar-manager";
```

:::

## How to forward a request to another url

**Request from the Frontend (port: 8080)**

### maps-proxyUrl

It's a map between a request and the destination url.

Action:

1. Go to Section: `api-gateway/maps-proxyUrl.before.map` or `api-gateway/maps-proxyUrl.after.map`
2. Write here your map

The syntax is:

```
$request_method-$request_uri $proxy_url
```

The variables are:

- `$request_method` : It's the request method. Values: *GET*, *DELETE*, *POST*, *PATH*, *PUT*
- `$request_uri` : It's the request uri
- `$proxy_url` : It's the url where you want to proxy through

**Request from the Microfrontend Composer (port: 8081)**

### maps-proxyBackofficeUrl

The syntax is:

```
$request_method-$request_uri $proxy_backoffice_url
```

Action:

1. Go to Section: `api-gateway/maps-proxyBackofficeUrl.before.map` or `api-gateway/maps-proxyBackofficeUrl.after.map`
2. Write here your map

The variables are:

- `$request_method` : It's the request method. Values: *GET*, *DELETE*, *POST*, *PATH*, *PUT*
- `$request_uri` : It's the request uri
- `$proxy_backoffice_url` : It's the url where you want to proxy through

:::tip
You want to forward all the GET requests /files/images/avatar/foo/ to /user/foo/avatar/

```
"~^GET-/files/images/avatar/(?<username>[\w]+)/$" "/user/$username/avatar/"
```

:::

:::info
If no request is matched by any regular expression, the default proxy_url is set to request_uri (the request is forwarded to itself).
:::

## How to edit which map include

All these files will be included in `maps.conf` file as default.
You can edit which of them include editing this file.

Action:

1. Go to Section: `api-gateway/maps.conf`
2. Write here your include

:::warning
What you write here will overwrite the default maps.conf file.
:::

:::tip
Include maps-proxyName and maps-groupExpression

```
include /etc/nginx/customization.d/maps-proxyName.conf;
include /etc/nginx/customization.d/maps-groupExpression.conf;
```

:::

## How to add a custom location

You can add a custom [Nginx location](http://nginx.org/en/docs/http/ngx_http_core_module.html#location):

1. From the Advanced Configuration go to `api-gateway/server-extension.conf`
2. Write here your location

:::tip

**Example**

```
location ~* /(process|create)|endpoint)/? {
    proxy_pass http://auth.example.com;
}
```

:::

## How to proxy Web Socket connections

You can proxy Web Socket connections to a service adding a specific location:

1. From the Advanced Configuration go to `api-gateway/server-extension.conf`
2. Write here your location:

```
location /api/websocket/ {
    proxy_pass http://$proxy_name$proxy_url;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    # WebSocket support
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection upgrade;
}

```

The variables are:

- `$proxy_name` : destination service hostname
- `$proxy_url` : the url where you want to proxy through
- `$remote_addr` : the client address
- `$host` : in this order of precedence, host name from the request line, or host name from the *Host* request header field, or the server name matching a request
- `$proxy_add_x_forwarded_for` : the *X-Forwarded-For* client request header field with the `$remote_addr` variable appended to it, separated by a comma
- `$http_upgrade` : the *upgrade* client request header

## How to manage authorization in a multi gateway architecture

Sometimes projects can get big and, for this reason, it's better do segregate different macro features inside different projects, each one with its own set of resources. 

In these cases it may be useful to have a single "gateway project" that handles requests coming from API consumers and dispatches them to the right `api-gateway` of other projects (let's call these "functional projects"). This configuration eases the API management, as all the endpoints that are exposed, for example, on the internet, are configured in a single project: the gateway project.

Another advantage of such a configuration is that the authorization process can be centralized at the gateway level, freeing all the sub projects from the burden of managing client authentication and authorization.

In [this section](/console/project-configuration/authorization-flow.md) we described how the authorization flow works for a single project. In few words, in order to activate the authorization flow for a project you need to install the **Authorization Service**.  
The Authorization Service is the service that resolves if the caller is authorized to invoke a certain endpoint and defines a set of _platform headers_ to inform the rest of the architecture about the authorization of the client.

For instance, the Authorization Service sets these headers in the response that it returns to the API Gateway:

- `Mia-Allowed`
- `Mia-Groups`
- `Mia-Userid`

These headers are attached to the response that the API Gateway receives from the Authorization Service, and contain information about the logged user/client.

If authorization passes, the Api Gateway proxies the request to the designated client. In the context of a multi gateway architecture, where the first API Gateway is part of the gateway project, the client that will receive the request is the API Gateway of another project.

Normally, an API Gateway expects the incoming request to be from a client, not another API Gateway, and it doesn't consider incoming platform headers, as the client would be able to self-authorize or impersonate another user.

For this reason, if you want all the auth information passing through the second API Gateway, without having to setup another Authorization Service at the functional project level, you must inform the API Gateway, at the functional project level, about the legitimacy of the incoming platform headers.

In order to do so, an advanced configuration of the API Gateway is required. Here are described the steps to set such an advanced configuration:

1. Open the Console and go the Design section of the functional project of interest.
2. Go to the Advanced mode
3. Open the advanced configuration file named `auth-usage.conf` under the section `api-gateway`, and write this piece of configuration

```
set $mia_userid $http_miauserid;
set $mia_groups $http_miagroups;
set $mia_allowed "1";
set $mia_userproperties $http_miauserproperties;
```

4. Save and deploy

:::caution
It's worth underlying the importance of the line `set $mia_allowed "1";`, which causes the API Gateway to implicitly authorize all the incoming calls.  
This could be quite of a problem if the API Gateway is directly exposed to the clients (through the Internet or an internal network).  
For this reason, in a multi-gateway architecture, it is important to ensure that all the authorization phase, if necessary, is resolved at the gateway project level.
:::
