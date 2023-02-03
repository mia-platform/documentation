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
curl --request GET 'https://platform-dev.test.mia-platform.eu/authorize?appId={{APP_ID}}&providerId={{PROVIDER_ID}}'
```

Example of redirect URL:

```text
https://platform-dev.test.mia-platform.eu/callback?code={{CODE}}&state={{STATE}}
```

In case you are using a web app this request can be made directly from the browser; in this case the user will be redirected to an external login page, and then, back to the custom callback URI when the login succeeds.

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
