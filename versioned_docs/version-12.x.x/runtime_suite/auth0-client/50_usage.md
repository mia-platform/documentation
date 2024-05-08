---
id: usage
title: Usage
sidebar_label: Usage
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

## How to enable username and password login

A Grant-Type property let you define a method from which your application can gain Access Tokens, for a more detailed explanation follow the official [auth0 documentation](https://auth0.com/docs/applications/application-grant-types).

To setup, firstly, you must have a working tenant on Auth0, where your application has enabled different database's connections (e.g. **Username-Password-Authentication**). Then, in the advanced settings of your application, you should enable `Password` in `Grant Types`. You have to add the necessary **Action**, see [Config Auth0](./30_configure_auth0.md).

In Tenant Setting, at **API Authorization Settings** you set a Default Directory and a Default Audience, which is the name of the connection to be use for Password Grant exchanges.

After everything is set, you can check it by using the following curl:

```bash
curl --location \
    -X POST 'https://YOUR_PROJECT_URL/oauth/token' \
    --header 'secret: YOUR_SECRET' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'grant_type=your_grand_type' \
    --data-urlencode 'username=your_username' \
    --data-urlencode 'password=your_name' \
    --data-urlencode 'connection=your_connection'
```

:::note
To notice that the connection is not required if you have one connection.

Multi-connections are usually used to manage multi-environment but you can still
have one environment with multi-connections.
:::

If all went well, you should get a `200 OK` response.

If **website** is not included in the `scope` array of the used configuration, you'll get the following response payload:

```json
{
  "refreshToken": "your_refresh_token",
  "accessToken": "your_access_token",
  "idToken": "your_id_token",
  "expireAt": "2021-07-16T08:28:24.568365226Z"
}
```

Using the scope **website** you'll get an empty response, and a cookie with the access token will be set with the following attributes.

| Attribute | Value                                                                |
| --------- | -------------------------------------------------------------------- |
| Name      | `sid`                                                                |
| Value     | The value of the JWT Token                                           |
| HttpOnly  | `true`                                                               |
| Secure    | `true`                                                               |
| Path      | `/`                                                                  |
| Secure    | `true`                                                               |
| MaxAge    | __SESSION_DURATION_SECONDS__ environment variable value              |
| SameSite  | Set to `clients.<CLIENT_NAME>.sameSite` configuration field, if set. |


When the token expires the refresh token endpoint can be used to get a new access token:

```bash
curl --location \
    -X POST 'https://YOUR_PROJECT_URL/oauth/refreshtoken' \
    --header 'secret: YOUR_SECRET' \
    --header 'Content-type: application/json' \
    --header 'authorization: Bearer your_access_token' \
    -d '{ "refresh_token": "your_refresh_token" }'
```

:::note
Note for the project configuration: the endpoint path depends on how the oauth0-client is exposed on the api-gateway, the exposed path by oauth0-client is `/refreshtoken`.
:::

The response contains a new access token and new refresh token.

```json
{
  "refreshToken": "your_new_refresh_token",
  "accessToken": "your_new_access_token",
  "idToken":"your_id_token",
  "expireAt":"2021-07-16T09:53:16.653155743Z"
}
```

In the following an example of how to call an authenticated API using the token:

```bash
curl --location \
    'https://YOUR_PROJECT_URL/YOUR_RESOURCE_PATH/' \
    --header 'secret: YOUR_SECRET' \
    --header 'authorization: Bearer YOUR_ACCESS_TOKEN'
```

### Logout the users

To logout a user, your application should redirect them through the endpoint:

```
GET /logout
```

The endpoint optionally accepts the `redirect` query string parameter: it defines the path to which redirect your users relative to the base URL of your application.

It is used to build the `returnTo` Auth0 param using the `X-Forwarded-Host` and `X-Forwarded-Proto` request headers.

For example if after logout you want to redirect your users to:
```
https://mia-project.example.org/logout-page
```

your application needs to redirect them to the auth0-client endpoint `/logout?redirect=/logout-page`. The service will internally build the url.

:::info

Make sure that the complete logout urls are registered in the [Advanced Auth0 Tenant Settings](https://auth0.com/docs/get-started/tenant-settings#login-and-logout).

:::

If the `redirect` query string is omitted, the `returnTo` query string will not be passed to Auth0: this will cause Auth0 to redirect the user to the first of the logout urls defined in the Tenant Advanced settings.

#### Use the Auth0 Application Logout URLs - Enable the Auth0 `client_id` query param

If the env __AUTH0_LOGOUT_CLIENT_ID_ENABLED__ is set to `true`, the `client_id` query parameter will always be added to the [Auth0 GET /v2/logout ](https://auth0.com/docs/api/authentication#auth0-logout).

This will have the consequence that Auth0 will consider the logout redirect URLs allow-list defined at **Application level**, rather than at Tenant level.

This means that if the `redirect` query param is defined, the resulting URL must be included in the Application Logout URL list.
If the `redirect` param is not defined, the user will be redirected to the first Logout URL defined at Application level.

For more information on how to configure Auth0 Application Logout URLs, please [check this documentation page](https://auth0.com/docs/authenticate/login/logout/redirect-users-after-logout).


## How to configure multiple environment

If you want to segregate users for each runtime environment, the simpler solution is to:

1. Create different databases, one for each environment you want; go to [Auth0 Management Dashboard](https://manage.auth0.com/) and from the *Authentication* section create new databases
1. While still in Auth0 Management Dashboard, you'll have to allow the database (called `connection`) for each application
(you might also define different applications for different environments, in this scenario you'd have to allow the proper connections to your applications)

1. In the Console `Setup Infrastructure` section of your project add a variable for each environment (e.g. `DEV_AUTH0_CONNECTION`, `PREPROD_AUTH0_CONNECTION`, `PROD_AUTH0_CONNECTION`) and specify the proper database `connection` name for each environment.
2. In the Console `Design` section modify `auth0-client` configuration for the `managementClient` in order to use the newly created interpolation variable (e.g. `AUTH0_CONNECTION`) for `supportedConnections` and `defaultCreateUserConnection`, and
3. Make sure that `supportedConnections` is declared for each `client` too, specifying only the connection you want to support in each environment.
4. Make sure that `supportedConnections` and `defaultConnection` is declared for `cms` client too, specifying only the connection you want to support in that environment.

:::note
For more information in regards of the Auth0 Client advanced config checkout out the [configuration documentation page](./configuration#auth0-connection-integration)
:::


## Auth0 tenant management endpoints

Auth0 tenant endpoints are designed to manage the underlying Auth0 tenant.
Make sure to protect these endpoints and not to expose them unless strictly necessary.

### User Management endpoints

This set of endpoints offer a CRUD interface over the users of the Auth0 tenant.

#### Get active users

The endpoint `GET /users/active` returns a list of the active users, for all clients, at the time the call is made.

This list is generated from the active sessions and returns an array of `object` containing the `auth0Id` of the users.

An example of response:

```json
[
  {
    "userId": "auth0|02d90d472bd9d017ef000001"
  },
  {
    "userId": "auth0|02d90d472bd9d017ef000002"
  },
  ...
]
```

#### Get Users

The endpoint `GET /users` returns all the users of the current Auth0 connection.

The response is paginated, and limited by default to 25 items. You can use the query parameters to paginate the output, see the next section for detailed information.

##### Query string

The endpoint accepts a query string with the following parameters:
- _l: CRUD-like limit, translated to Auth0 `per_page`; Defaults to 25, i.e. by default the first 25 users are shown.
- _sk: CRUD-like skip, translated to Auth0 `page`;
- email;
- nickname;
- username;
- connection: transformed in `identities.connection`, multiple values are bound together in a logical `OR` statement.
- app_metadata.*: a series of properties starting with `app_metadata.`. They will be inserted into the `app_metadata` user properties, such as:
  - groups: a list of groups that users must have, these are searched using Auth0 `app_metadata` user property.

#### Create user

The endpoint `POST /users` can be used to create a new user.

:::caution

This endpoint is **not designed to be exposed as a signup endpoint**. 

You should instead implement the signup logic in another service, that takes care of validating the user input, and then contacts this endpoint to create the user.

:::

This API can be contacted with the same body accepted by Auth0 [POST /api/v2/users](https://auth0.com/docs/api/management/v2/users/post-users) API, with the only difference that the `connection` parameter is optional; when omitted it will default on the configured:
- `managementClient.defaultManagementConnectionName` configuration parameter
- `managementClient.defaultCreateUserConnection` configuration parameter (deprecated)

If none of the above is defined, the api will throw an error.

Refer to the [configuration schema](./20_configuration.md#configuration)

### Patch a user

The endpoint `PATCH /users/:userID` allows to patch a user.

This API can be contacted with the same body accepted by Auth0 [PATCH /api/v2/users/{id}](https://auth0.com/docs/api/management/v2/users/patch-users-by-id) API.

#### Delete a user

The endpoint `DELETE /users/:userID` allows to delete a user.

It takes no additional parameters.

### Auth0 Jobs endpoints

Auth0 Jobs endpoints are designed for bulk operation on the underlying tenant.

:::info

These endpoints are available from `v3.4.0`. To enable them, make sure that your configuration contains the `managementClient.supportedConnectionsMap`.

:::

#### Bulk Import users

Signature: `POST /users/import`

The API allows the bulk import of users. 

The endpoint should be contacted with the same body of the [POST  /api/v2/jobs/users-imports](https://auth0.com/docs/api/management/v2/jobs/post-users-imports) Auth0 API, with these differences:
- the `connection_id` parameter is not accepted: if defined, the API will throw an error
- a `connection` parameter can be optionally added: it defines the connection name to be used, that must be defined as key of the `managementClient.supportedConnectionsMap` configuration parameter. If `connection` is not defined, it will default to the config parameter `managementClient.defaultManagementConnectionName`, if present, otherwise the API will throw an error.

#### Get an import job details

Signature `GET /users/import/status/:jobID`

Allows to retrieve import job status.

Returns the same body of Auth0 [GET /api/v2/jobs/{id}](https://auth0.com/docs/api/management/v2/jobs/get-jobs-by-id).

#### Get an import job errors

Signature `GET /users/import/status/:jobID/errors`

Allows to retrieve import job errors.

Returns the same body of Auth0 [GET /api/v2/jobs/{id}/errors](https://auth0.com/docs/api/management/v2/jobs/get-errors).