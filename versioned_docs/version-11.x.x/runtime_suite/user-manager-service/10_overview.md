---
id: overview
title: User Manager Service
sidebar_label: Overview
---
The **User Manager Service** is a microservice responsible for handling user management.
Leveraging the [CRUD Service](../../runtime_suite/crud-service/overview_and_usage) and the desired authentication service
(for instance, the [Auth0 Client](../../runtime_suite/auth0-client/overview_and_usage)),
it can be used to control users creation, update and deletion on both a CRUD collection and the authentication service.
The service can also handle user roles and permissions leveraging the integration with the [Rönd Service](https://rond-authz.io/docs/getting-started).

The combination of the authentication service with a CRUD collection brings the following advantages:
- it supports the adoption of data encryption: properties can easily be encrypted in the [CRUD](../../runtime_suite/crud-service/encryption_configuration);
- the [user management endpoints](./30_usage.md#User-Management) are CRUD-alike, thus the User Manager Service can be used by the [Mia-Backoffice](../../business_suite/backoffice/overview)
  as a CRUD collection (other endpoints can be used as actions from the Backoffice, e.g. the [reset password endpoint](./30_usage.md#POST-/users/change-password)).
- the authentication service only contains authentication information (password, username, email), while all the user data is stored in the CRUD;
- even if all the users are stored in a common CRUD collection, each user group make use of a different schema, stored in a
  [dedicated CRUD collection](./20_configuration.md#User-Manager-Configuration-CRUD-collection);
  this allows the validation of the user against different schemas and to define different properties for each group.

:::note
When a new user is created, the User Manager Service returns the element ID on the users CRUD collection (Mongo ID).
The user ID on the CRUD thus identifies the user and should always be used as user reference ID.
This ID is also used as path parameter in some endpoints, e.g in the `PATCH` one.
:::

# Authentication Service Modules

The User Manager Service can be extended with new authentication modules, in order to interact to new authentication services.
To do this, a dedicated interface to the given authorization service must be implemented and added to the service.

:::note
At this time the [Auth0 Client](../../runtime_suite/auth0-client/overview_and_usage) microservice is the only authentication service available,
so the `auth0Client` module is the only one that has been implemented in the User Manager Service.
:::
