---
id: usage
title: Usage
sidebar_label: Usage
---
## Request

The request at the service should have:

* `Original-Request-Uri` _required_ **header**, that specifies the request path to check acl;
* `Original-Request-Method` _required_ **header**, that specifies the request method to check acl;
* `Authentication` _optional_ **header**, to authenticate logged user calling the api;
* `Client-Type` _optional_ **header**, to handle client type in acl expression;
* `isbackoffice` _optional_ **header**, to handle isbackoffice parameters in acl expression.

The authorization service proxies the request and all the headers specified in `HEADERS_TO_PROXY` env variables to an url (set by `USERINFO_URL`) and waits for the the url to respond with the user data in json, or with an http error or an empty body, in case the user is not logged.

The authorization service calls a service, that should handle user authentication and returns logged user body. Request timeout is set to 1 minute.
The user structure must contains:

* `groups`: a list of groups
* a unique identifier of the user (default `sub` but configurable through `CUSTOM_USER_ID_KEY`). User id cannot be empty.

The user structure may also contain a field of choice at the first level to be used as array of user's permissions. The name of the field that the authorization service will consider for permissions can be configured by means of the environment variable `CUSTOM_PERMISSIONS_KEY`.<br/>
The permissions field must be an array of strings, where each string represent a permission identifier.
Permissions can then be used in ACL expressions as describe [here](../../development_suite/api-console/api-design/endpoints#manage-the-security-of-your-endpoints).

### Headers set by `/auth`

* `mia-allowed`: set to 0 or 1. 0 -> not allowed. 1 -> allowed
* `mia-userid`: if the api is called by logged user, it is filled with user id (customizable through `CUSTOM_USER_ID_KEY`). Otherwise it is empty.
* `mia-groups`: if the api is called by logged user, it is filled with comma separated list of user groups. Otherwise it is empty.
* `mia-userproperties`: it is possible to set into `USER_PROPERTIES_TO_PROXY` a comma separated list of user properties to evaluate acl expressions.

## Strict Mode enabled

By default the `authorization-service` is in strict mode.

In this mode, the response could be:

* **200** with mia-allowed header set to 1: if user has access to the resource;
* **200** with mia-allowed header set to 0: if resource is not found in authorization-service configuration;
* **401** with mia-allowed header set to 0: if access to the resource is requested without a logged user;
* **403** with mia-allowed header set to 0: if user request aims at accessing a resource which does not have enough permissions.

## Strict mode disabled

In this mode, `authorization-service` always responds **200** with `mia-allowed` set to 0 if the user does not have permission to access the resource or 1 if they have the permission.

## Authorization headers

It is possible to set the environment variable `AUTHORIZATION_HEADERS_TO_PROXY` as a comma separated list of headers which could contain the authorization token used by the user service called by the `USERINFO_URL` and `BACKOFFICE_USERINFO_URL`.

This env variable is not required, and if it is not set the user service is called for every incoming request.
If this env var is set, it brings an enhancement in performance for all APIs called without an authorization header since it avoids calling the user service: user is set as empty.

The responses of the authorization service are the same as before, when the get user api responds with *401*.

## Trust Mia-Platform User Headers

In this mode, the Authorization Service will not try to authenticate the incoming request by calling the external `/userinfo` endpoint, but it will gather the information by resolving the request headers containing the user data.

This is intended for the Authorization Services used by the API Gateway of the Projects exposed through an Edge Gateway, that is responsible to authenticate the request and to gather the authenticated entity's data.

Such data will be contained in some headers, specified by the environment variables `USERID_HEADER_KEY`, `GROUPS_HEADER_KEY` and `USER_PROPERTIES_HEADER_KEY`.

This mode can be enabled by setting the environment variable `TRUST_MIA_USER_HEADERS` to `true`.

:::warning
Be careful when setting this variable to true and enabling this mode. Use this feature only if you understand the implications of this mode.

If the Authorization Service is used by a gateway publicly exposed to internet, please **do not** use this mode since it would expose all the services on serious security threats.
:::
