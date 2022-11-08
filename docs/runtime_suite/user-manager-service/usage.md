---
id: usage
title: User Manager Usage
sidebar_label: Usage
---
The main purpose of the User Manager is to ease user management operations.
It combines calls directed to the chosen authentication service and to the `users` CRUD collection.

:::note
As stated in the [configuration section](configuration.md), you can name the CRUD collections however you like.
For simplicity’s sake, in the following page it is assumed that you have called them `users` and `ums-config`.
:::

The User Manager Service provides two groups of endpoints: the first one includes all the authentication endpoints,
while the other one includes all the user management endpoints (creation, retrieval, deletion, etc.).

## Authentication Management

### POST /oauth/token

Login endpoint, allows obtaining an access-token and a refresh-token from the authentication service
if a valid username and password are provided.

#### Body

This request accepts the following fields:
- **username** - `string`: the user username;
- **password** - `string`: the user email address.

#### Response

If the user is successfully authenticated, you will receive a response with a 200 status code, the `refreshToken` and
the `accessToken` with its expiration date `expireAt`.

:::warning
If in the advanced configuration of the console the auth0 client is set with `scope website`,
then only the `set-cookie` header with the `sid` is returned and the response body is empty.
:::

### POST /refreshtoken

Refresh token endpoint, it returns new access and refresh tokens.

#### Body

This request accepts the following fields:
- **refreshToken** - `string`: the old refresh token.

Moreover, the request also require the expired access token to be included in the headers.

#### Response

In case of success, you will receive a response with a 200 status code, the `refreshToken` and
the `accessToken` with its expiration date `expireAt`.

### POST /users/change-password

Triggers a 'change password' event in the authentication service.
In case of Auth0, a change password email will be sent to the user.

:::note
Since this endpoint is exposed as a `POST`, it can be used as an 'action' in the [Mia-Backoffice](../../business_suite/backoffice/overview).
:::

#### Body

This request accepts the following fields:
- **authUserId** - `string`: the user id in the authentication service.

#### Response

If the change password request is correctly sent, you will receive a response with a 204 status code and no payload.

## User Management

### POST /users/

Creates a new user in the `users` CRUD collection and in the chosen authentication service.

:::note
In case the user group has the `authUserCreationDisabled` property set to `true` in the configuration CRUD,
no user is created in the authentication service (only the CRUD collection element is created)
and no roles are assigned to the user (in case Rönd is enabled).
:::

#### Body

This request accepts the following 'standard' fields:
- **username** - `string`: the user username;
- **email** - `string`: the user email address;
- **blocked** - `boolean`: to create a 'blocked' user;
- **userGroup (required)** - `string`: the group to which the user belongs;
- **roles** - `array`: the roles to be assigned to the user via Rönd.

Additional fields can also be added to the body, depending on the `users` CRUD collection.
All these additional fields must be defined in the schema stored in the `ums-config` CRUD collection.
The user json will be validated against its group schema before user insertion.

:::note
The user is first created in the `users` CRUD collection.
If this operation succeeds the user is also created in the chose authentication service and the CRUD entry is updated
with the `authUserId`.
In case one of these two operations fail, the user creation is backtracked (the entry in the CRUD is removed and the
user is removed from the authentication service) and and error is returned.
:::

:::note
If the environment variable `ROND_ENABLED` is set to true and in the request body is present the array **roles**, 
a request towards the Rönd service is performed in order to set the roles and permissions.
:::

#### Response

If the user is successfully created, you will receive a response with a 200 status code and the `_id` of the newly
created user in the payload. The `_id` is to the `_id` of the user in the `users` CRUD collection.

:::note
If the user json fails the validation against its group schema, a `400 Bad Request` code is returned.
:::

### POST /users/with-id

Creates a new user in the `users` CRUD collection from an existing user in the chosen authentication service.

#### Body

This request accepts the following 'standard' fields:
- **authUserId** - `string`: the user id in the authentication service.
- **blocked** - `boolean`: to create a 'blocked' user;
- **userGroup (required)** - `string`: the group to which the user belongs;
- **roles** - `array`: the roles to be assigned to the user via Rönd.

Similarly to the [POST /users/](#POST-/users/), additional fields can also be added to the body
and must be defined in the schema stored in the `ums-config` CRUD collection.
Validation is also performed against such schema.

:::note
If the environment variable `ROND_ENABLED` is set to true a request towards the Rönd service is performed in order to set the user's roles and permissions.
:::

#### Response

If the user is successfully created, you will receive a response with a 200 status code and the `_id` of the newly
created user in the payload. The `_id` is to the `_id` of the user in the `users` CRUD collection.

:::note
If the user json fails the validation against its group schema, a `400 Bad Request` code is returned.
:::

### GET /users/

Returns the list of users. This endpoint is a direct proxy to the `GET /users` of the CRUD service and it has no side effects.

### DELETE /users/:id

Deletes a single user.
This endpoint combines calls to the `DELETE /users/:id` of the CRUD service and to the authentication service delete.

:::note
The `id` used as path parameter in this endpoint is the CRUD `_id` of the desired user.
:::

#### Response

If the user is successfully deleted, you will receive a response with a 204 status code and no payload.

### PATCH /users/:id

Updates the user with the specified id.
This endpoint updates the user data in both the `user` CRUD collection and the authentication service.

:::note
The `id` used as path parameter in this endpoint is the CRUD `_id` of the desired user.

The user schema is validated against the new `userGroup` if set, otherwise against the actual `userGroup`. If a non-existing `userGroup` is set, the PATCH throws a Bad request.

It's not allowed to change `authUserId` parameter.
:::

:::note
If the environment variable `ROND_ENABLED` is set to true a request towards the Rönd service is performed in order to update the user's roles and permissions.
:::

:::warning
If the roles are successfully revoked but an error happen during the grant procedure, you will end up with an user with no roles. So, if an error occurred, be sure to check that the user have its roles.
:::

### Body

The body of this request has the same interface of a CRUD service `PATCH /users/:id` request.

### Response

If the user is successfully updated, you will receive a response with a 200 status code and the updated user in the payload.

### GET /users/count

Returns the number of users.
This endpoint is a direct proxy to the `GET /users/count` of the CRUD service and has no side effects.

### POST /users/state

Changes the state of the users matching the provided filters (similarly to the `POST /users/state` endpoint of the CRUD).

This endpoint combines calls to the `POST /users/state` of the CRUD service and a `PATCH` on the authentication service,
and may have the following side effects.

:::note
A user set to `DRAFT` or `TRASH` states is set to `blocked: true` in the authentication service, in order to prevent the user to authenticate in any system.

A user set to `PUBLIC` state is set to `blocked: false` in the authentication service, in order to 'unblock' a previously blocked user.

A user set to `DELETED` is deleted from the authentication service only if the [AUTH_HARD_DELETE](configuration.md#Environment-variables) is set to `true`,
otherwise its behavior is the same as the `DRAFT` and `TRASH` cases.
Note that in any case a user set to `DELETED` is never deleted from the CRUD with this endpoint (its state is only set to `DELETED`).
:::

### Body

The body of this request has the same interface of a CRUD service `POST /users/state` request, if used with the filters.

### Response

If the users states are successfully updated, you will receive a response with a 200 status code,
and the number of updated users in the payload.

### GET /userinfo

Returns the data of the logged used. It acts as a combination of a `/userinfo` on the authentication service and a `GET /users/:id` on the CRUD.

:::note
The behavior of this endpoint can be configured through the `USERINFO_ADDITIONAL_PROPERTIES` environment variable,
which represents the CRUD user properties that must be returned.

If an empty variable is provided, only the auth client properties will be returned by the `/userinfo`.
If the `USERINFO_ADDITIONAL_PROPERTIES` is not defined (thus `undefined`), all the CRUD user properties will be
returned.

Note that the auth client properties, coming from the auth client `/userinfo` endpoint, are always returned.
:::

:::info
Cookies `sid` and `client-key` must be passed as headers to the `/userinfo`.
:::

If the Rönd roles collection is configured and the `ROLES_CRUD_ENDPOINT` environment variable is defined, the response payload will contain also the `permissions` array (checking the user's current roles).

:::note
In order to retrieve the user's `permissions`, you also need to add the `permissions` property to the `USERINFO_ADDITIONAL_PROPERTIES` environment variable.
:::

#### Response

In case of success, you will receive a response with a 200 status code and the user properties in the payload.

:::note
This endpoint is not intended to be used with users which have been created only in the CRUD.
In such cases, the endpoint will return the following message: `Missing authUserId, user not logged`.
:::
