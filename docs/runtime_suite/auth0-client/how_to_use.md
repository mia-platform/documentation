---
id: how_to_use
title: Auth0 client
sidebar_label: How to use
---
This service handles authentication and user management using auth0 as an identity provider.

## How to use Auth0 client

This service exposes different endpoints to handle authentication: `/authorize`, `/oauth/token`, `/logout` and `/userinfo` endpoints. A `/users/me` endpoint is also exposed for backward compatibitity but its use is discouraged.

Moreover, it handles users through the auth0 users management api.

## How to enable username and password login

A Grant-Type property let you define a method from which your application can gain Access Tokens, for a more detailed explanation follow the official [auth0 documentation](https://auth0.com/docs/applications/application-grant-types).

To setup, firstly, you must have a working tenant on Auth0, where your application has enabled different database's connections (e.g. **Username-Password-Authentication**). Then, in the advanced settings of your application, you should enable `Password` in `Grant Types`. You have to add the necessary **Rules**, see [Config Auth0](../../development_suite/set-up-infrastructure/auth-0-setup.md).

In Tenant Setting, at **API Authorization Settings** you set a Default Directory and a Default Audience, which is the name of the connection to be use for Password Grant exchanges.

After everything is set, you can check it by using the following curl:

```bash
curl --location
    -X POST 'https://MY_PROJECT_URL/oauth/token' \
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

If all went well, you should get, without the scope **website**:

```json
{
    "access_token": "your_access_token",
    "id_token": "your_id_token",
    "scope": "your_scope",
    "expires_in": "your_setting_expire_time",
    "token_type": "Bearer"
}
```

Using the scope **websiste**: 

```json
{
    "cookie_sid": "your_cookie_sid"
}
```

## How to configure multiple environment

If you want to segregate users for each runtime environment, the simpler solution is to:
1. Create different databases, one for each environment you want; go to [Auth0 Management Dashboard](https://manage.auth0.com/) and from the *Authentication* section create new databases
1. While still in Auth0 Management Dashboard, you'll have to allow the database (called `connection`) for each application 
(you might also define different applications for different environments, in this scenario you'd have to allow the proper connections to your applications)

1. In the DevOps Console `Setup Infrastructure` section of your project add a variable for each environment (e.g. `DEV_AUTH0_CONNECTION`, `PREPROD_AUTH0_CONNECTION`, `PROD_AUTH0_CONNECTION`) and specify the proper database `connection` name for each environment.
1. In the DevOps Console `Design` section modify `auth0-client` configuration for the `managementClient` in order to use the newly created interpolation variable (e.g. `AUTH0_CONNECTION`) for `supportedConnections` and `defaultCreateUserConnection`, and
1. Make sure that `supportedConnections` is declared for each `client` too, specifying only the connection you want to support in each environment.

:::note
For more information in regards of the Auth0 Client advanced config checkout out the [configuration documentation page](./configuration#auth0-connection-integration)
:::
