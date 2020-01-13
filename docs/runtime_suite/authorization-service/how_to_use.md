## How to use

This service exposes a `/auth` endpoint that handles, passing a configuration, the access to a specific combination of route and method.

### Request
The request at the service should have:

* `Original-Request-Uri` _required_ **header**, that specifies the request path to check acl
* `Original-Request-Method` _required_ **header**, that specifies the request path to check acl
* `Authentication` _optional_ **header**, to authenticate logged user calling the api
* `Client-Type` _optional_ **header**, to handle client type in acl expression
* `isbackoffice` _optional_ **header**, to handle isbackoffice parameters in acl expression

This service proxy the request and all the headers specified in `HEADERS_TO_PROXY` env varibles to an url (set by `USERINFO_URL`) and expect that the url respond with the user data in json, or with an http error or an empty body if user is not logged.

This service calls a service, that should handle user authentication and returns logged user body. Request timeout is set to 1 minute.
The user structure must contains:
* `groups`: a list of groups
* an unique identifier of the user (default `sub` but configurable through `CUSTOM_USER_ID_KEY`). User id cannot be empty.

#### Headers set by `/auth`

* `mia-allowed`: set to 0 or 1. 0 -> not allowed. 1 -> allowed
* `mia-userid`: if api called by logged user, it is filled with user id (customizable through `CUSTOM_USER_ID_KEY`). Otherwise it is empty.
* `mia-groups`: if api called by logged user, it is filled with comma separated list of user groups. Otherwise it is empty.
* `mia-userproperties`: to help the authorization through the infrastructure and help the develop of the acl, it is possible to set into `USER_PROPERTIES_TO_PROXY` with a comma separated list of user properties.

### Strict Mode enabled

By default the `authorization-service` is in strict mode.

In this mode, the response could be:

* **200** with mia-allowed header set to 1: if user has access to the resource;
* **200** with mia-allowed header set to 0: if resource is not found in authorization-service configuration;
* **401** with mia-allowed header set to 0: if access to the resource is requested without a logged user
* **403** with mia-allowed header set to 0: if user request to access a resource which does not have enough permissions.

### Strict mode disabled

Into this mode, `authorization-service` always respond **200** with `mia-allowed` set to 0 if the user has permission to access to the resource or 1 if it has the permission.
