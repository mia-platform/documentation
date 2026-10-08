---
id: overview
title: User Manager Service
sidebar_label: Overview
---



The **User Manager Service** is a microservice responsible for handling user management.
Leveraging the [CRUD Service][crud-service] and the desired authentication service
(for instance, the [Auth0 Client][auth0-client]),
it can be used to control users creation, update and deletion on both a CRUD collection and the authentication service.
The service can also handle user roles and permissions leveraging the integration with the [Rönd Service][rond].

The combination of the authentication service with a CRUD collection brings the following advantages:
- it supports the adoption of data encryption: properties can easily be encrypted in the [CRUD][crud-encryption];
- the [user management endpoints][user-management-endpoints] are CRUD-alike, thus the User Manager Service can be used by the Mia-Platform [Microfrontend Composer][microfrontend-composer]
  as a CRUD collection (other endpoints can be used as actions from the Microfrontend Composer, e.g. the [reset password endpoint][reset-password-endpoint]).
- the authentication service only contains authentication information (password, username, email), while all the user data is stored in the CRUD;
- even if all the users are stored in a common CRUD collection, each user group make use of a different schema, stored in a
  [dedicated CRUD collection][crud-user-manager-config];
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
At this time the [Auth0 Client][auth0-client] microservice is the only authentication service available,
so the `auth0Client` module is the only one that has been implemented in the User Manager Service.
:::


[auth0-client]: /runtime-components/plugins/auth0-client/10_overview.md
[crud-service]: /runtime-components/plugins/crud-service/10_overview_and_usage.md
[crud-encryption]: /runtime-components/plugins/crud-service/30_encryption_configuration.md
[microfrontend-composer]: /products/microfrontend-composer/overview.md
[rond]: https://rond-authz.io/docs/getting-started

[reset-password-endpoint]: /runtime-components/plugins/user-manager-service/30_usage.md#post-userschange-password
[user-management-endpoints]: /runtime-components/plugins/user-manager-service/30_usage.md#user-management
[crud-user-manager-config]: /runtime-components/plugins/user-manager-service/20_configuration.md#user-manager-configuration-crud-collection
