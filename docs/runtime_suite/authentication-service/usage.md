---
id: usage
title: Usage
sidebar_label: Usage
---
In this section, we show you how to use the `authentication-service`.

## Login flow

The service handle the `authorization_code` OAuth2 grant type. To login with this flow, follow the following guide.

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

If the `isWebsiteApp` field is set to true in the service configuration, it is returned a cookie header with key *sid*. In this way, it is possible to authorize all the request made by a website, for example.
