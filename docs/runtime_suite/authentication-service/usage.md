---
id: usage
title: Usage
sidebar_label: Usage
---
In this section, we show you how to use the `authentication-service`.

## Login flow

The service handle the `authorization_code` OAuth2 grant type.

Here is how to login with this flow.

### Authorize

To log in, the first request to make is a GET to the `/authorize` endpoint.

The authorization endpoint accepts as query parameter the *appId* and the *providerId* (which are the key set in the service configuration) and the response is a redirect to the *redirectUrl* specified in the service configuration with the parameters *code* and *state* set in query parameters.

An example curl:

```sh
curl --request GET 'https://app.example.com/authorize?appId={{APP_ID}}&providerId={{PROVIDER_ID}}'
```

Example of redirect URL:

```text
https://app.example.com/callback?code={{CODE}}&state={{STATE}}
```

In case you are using a web app this request can be made directly from the browser; in this case the user will be redirected to an external login page, and then, back to the custom callback URI when the login succeeds.

### Redirect url parameter

You can pass a redirect url to the request, by means of the `redirect` query string parameter. After a successful login, the `/oauth/token` endpoint will set the `Location` header to the specified url.

If a request comes with no `redirect` query parameter, the `Location` header will be set to the `redirectUrlOnSuccessfullLogin` app setting parameter, if specified.

In all other cases the `Location` header will not be set.

:::info

The response status code of a successful request is always `200 OK`, which means that browsers will ignore by default the `Location` header. It is responsibility of the client implementation to use the redirect url when needed.

:::

:::warning

It is strongly recommended to set the `allowedRedirectUrlsOnSuccessfulLogin` parameter (available from v2.8.0) on the app configuration, in order to avoid the [Open Redirector vulnerability](https://www.rfc-editor.org/rfc/rfc6749#section-10.15).

If you set this parameter, the service will refuse to accept any redirect url not present in the set. This prevents an attacker client to set malicious redirect URLs. Any request providing a redirect URL not included in the set will result in a `400 Bad Request`, and the token will not be issued.

This parameter may become required in the next realeases of the service.

:::


#### Client generated state

:::info

This feature is turned off by default for retrocompatibility reasons, but its usage is strongly encouraged.


To enable this feature, you need to set the config parameter variable `authorizeStateRequired` to `true`, in each app where you need it.

:::


To achieve a better level of security, the client should take charge of the process of the state generation.
This enables protection against CSRF attacks, as documented [here](https://www.rfc-editor.org/rfc/rfc6749#section-10.12).

The client must follow these steps:

- Generate a random state string. The randomly generated string should be sufficiently hard to guess, as described [here](https://www.rfc-editor.org/rfc/rfc6749#section-10.10). For instance, an [UUID v4](https://en.wikipedia.org/wiki/Universally_unique_identifier) is compliant with this specification.

- Save the state on the client application side (for example in local storage), making sure the location where it is saved it is only accessible by the client.

- Call the `/authorize` endpoint, passing the state in the query string, like in the following example:

    ```sh
    curl --request GET 'https://app.example.com/authorize?appId={{APP_ID}}&providerId={{PROVIDER_ID}}&state=<some-hard-to-guess-string>'
    ```
- Once the redirect URL is called, the client must check that the state in the redirect URL querystring matches the one it generated at the first step. If it doesn't, the client must refuse to proceed in the token request.

- If the state validation check succeeds, the client can now obtain a token by calling the `/oauth/token` endpoint, as described in the [related section](#get-token).

### Get token

To obtain the token, the endpoint exposed by the service is `/oauth/token` in POST method.
In the body of the request, you should set the *code* and *state* in JSON:

```json
{
    "code": "{{CODE}}",
    "state": "{{STATE}}"
}
```

and it will return a JSON object with *accessToken*, *refreshToken* and *expiresAt*.

```json
{
    "accessToken": "my-access-token",
    "refreshToken": "my-refresh-token",
    "expireAt": 1234567890
}
```

When the `isWebsiteApp` field is set to true in the service configuration, the token API will return a session cookie (named *sid*). 
The *sid* cookie has the following configuration:

    * HttpOnly: `true`
    * Secure: `true`
    * Path: `/`
    * SameSite: `Lax`

## Refresh token

The endpoint `POST /refreshtoken` allows to issue a new token, by using the `refreshToken` received in the Token request.

The endpoint needs to be called with a POST, like in the following example:

```sh
curl --location --request POST 'https://app.example.com/authentication/refreshtoken' \
--header 'Content-Type: application/json' \
--data-raw '{
    "refreshToken": {{refreshToken}}
}'
```
Under the hood, the authentication service will call the provider refresh token endpoint, and then it will refresh its token.

The response is the same as the `/oauth/token`:

```json
{
    "accessToken": "my-access-token",
    "refreshToken": "my-refresh-token",
    "expireAt": 1234567890
}
```

### Skip provider refresh token

If in your provider you set the `skipProviderRefreshToken` option, the authentication service will validate the provider refresh token by calling the provider userinfo before issuing the refresh token request. 
The refresh token on the provider will only be issued if the validation fails.

## Userinfo endpoint

The service exposes a `/userinfo` endpoint, that returns some of the information obtained from the [users collection](configuration.mdx#users-collection)
You can contact the endpoint in this way:
```sh
curl --location --request GET 'https://platform-dev.preprod.mia-platform.eu/authentication/userinfo' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer <access_token>'
```
The endpoint returns a JSON containing the authenticated user's information, for example:
```json
{
    "userId": "some-user-id",
    "groups": [
        "testgroup"
    ],
    "email": "john.doe@example.com",
    "name": "John Doe"
}
```
### Integration with the ***Authorization Service***

The `/userinfo` endpoint can be used by the [Authorization Service](../authorization-service/overview.md) to determine whether the requested resource can be accessed by the current user.

You need to set the following variables in the [configuration](../authorization-service/configuration.md) with these values:

- **USERINFO_URL**=`http://authentication-service/userinfo` (NB: change the hostname if it has been named differently)
- **CUSTOM_USER_ID_KEY**=`userId`
- **HEADERS_TO_PROXY**=`x-request-id,request-id,cookie,authorization,client-type,host,x-forwarded-host`


## Webhooks

When a new User is activated on the ID Provider, the UserInfo collection can be synchronized through this webhook.
(Currently only Okta provider is supported)

:::caution
Pay careful attention when configuring the webhook as the endpoint must be properly protected as it may allow anyone to create new user records.
:::

The webhook is made of 2 endpoints:

- **GET** `/webhook/apps/:appId/providers/:providerId/user` used to validate the hook by the OID Provider
- **POST** `/webhook/apps/:appId/providers/:providerId/user` used to handle the user activation

### Validate the Webhook (Okta)
In order to validate the webhook, Okta sends a GET request on the webhook url with a specific header `x-okta-verification-challenge` and expects to receive in response the same value of the header.

### Security Configuration
In order to secure these endpoints from unwanted requests (that will end up in users being added to the CRUD collection), you need to secure the Endpoint (for instance using an API Key).
Remember to keep the API Key secure and to share it only with who is going to consume the webhook!
