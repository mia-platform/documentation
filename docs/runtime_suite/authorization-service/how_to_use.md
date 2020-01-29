## How to use

The authorization service is responsible for authorizing a route to request certain resources.

This service exposes an `/auth` endpoint that, once that you have provided a [configuration](https://docs.mia-platform.eu/runtime_suite/authorization-service/configuration/), handles the access to a specific combination of route and method.

### Request
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

#### Headers set by `/auth`

* `mia-allowed`: set to 0 or 1. 0 -> not allowed. 1 -> allowed
* `mia-userid`: if the api is called by logged user, it is filled with user id (customizable through `CUSTOM_USER_ID_KEY`). Otherwise it is empty.
* `mia-groups`: if the api is called by logged user, it is filled with comma separated list of user groups. Otherwise it is empty.
* `mia-userproperties`: it is possible to set into `USER_PROPERTIES_TO_PROXY` a comma separated list of user properties to evaluate acl expressions.

### Strict Mode enabled

By default the `authorization-service` is in strict mode.

In this mode, the response could be:

* **200** with mia-allowed header set to 1: if user has access to the resource;
* **200** with mia-allowed header set to 0: if resource is not found in authorization-service configuration;
* **401** with mia-allowed header set to 0: if access to the resource is requested without a logged user;
* **403** with mia-allowed header set to 0: if user request aims at accessing a resource which does not have enough permissions.

### Strict mode disabled

Into this mode, `authorization-service` always respond **200** with `mia-allowed` set to 0 if the user does not have permission to access the resource or 1 if it has the permission.
