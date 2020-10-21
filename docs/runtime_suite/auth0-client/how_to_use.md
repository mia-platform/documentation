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
curl --location --request POST 'http://auth0_client/oauth/token' \
--header 'client-type: your_client_type' \
--header 'x-forwarded-host: your_host' \
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
    "scope": "your_scope,
    "expires_in": your_setting_expire_time,
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

If you to create a new connection for each environment, following the instructions described above.

So you can define **Username-Password-Production** for the production environment, and **Username-Password-Testing** for the testing environment. Remember that each connection has its own databases, so they are completely separated.