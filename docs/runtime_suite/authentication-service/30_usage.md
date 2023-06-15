---
id: usage
title: Usage
sidebar_label: Usage
---
In this section, we show you how to use the `authentication-service`.

## Login Flow

The service handle the `authorization_code` OAuth2 grant type.

Here is how to login with this flow.

### Authorize

API Signature: `GET /authorize`

The `/authorize` endpoint is useful for the login flow with grant type `authorization_code`.

The authorization endpoint accepts the following **query parameters**:
- **appId**: the `APP_ID` key from the [configurations file](./20_configuration.mdx#configurations-file)
- **providerId**: the `PROVIDER_ID` key from the configuration file, under the corresponding `APP_ID`


An example curl:

```sh
curl --request GET 'https://app.example.com/authorize?appId={{APP_ID}}&providerId={{PROVIDER_ID}}'
```

When called, the authentication service redirects to the IdP's *authUrl* endpoint, which in turn is expected to redirect to the *redirectUrl* specified in the configurations file with the query string parameters *code* and *state*.

Example of redirect URL:

```text
https://app.example.com/callback?code={{CODE}}&state={{STATE}}
```


Your application should then implement the logic to call the [POST /oauth/token with authorization_code grant type](#authorization-code-grant-type) with the information passed in the above query string, as per the [Authorization Code Grant OAuth2 flow](https://oauth.net/2/grant-types/authorization-code/).


:::tip

In case you are using a web app this request can be urlmade directly from the browser; in this case the user will be redirected to an external login page, and then, back to the custom callback URI when the login succeeds.

:::

#### Redirect url parameter

You can pass a redirect url to the request, by means of the `redirect` query string parameter. After a successful login, the `/oauth/token` endpoint will set the `Location` header to the specified url.

If a request comes with no `redirect` query parameter, the `Location` header will be set to the `redirectUrlOnSuccessfullLogin` app setting parameter, if specified.

In all other cases the `Location` header will not be set.

:::info

The response status code of a successful request is always `200 OK`, which means that browsers will ignore by default the `Location` header. It is responsibility of the client implementation to use the redirect url when needed.

:::

:::warning

It is strongly recommended to set the `allowedRedirectUrlsOnSuccessfulLogin` parameter (available from v2.8.0) on the app configuration, in order to avoid the [Open Redirector vulnerability](https://www.rfc-editor.org/rfc/rfc6749#section-10.15).

If you set this parameter, the service will refuse to accept any redirect url not present in the set. This prevents an attacker client to set malicious redirect URLs. Any request providing a redirect URL not included in the set will result in a `400 Bad Request`, and the token will not be issued.

This parameter may become required in the next releases of the service.

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


### Get JWT Token

API Signature: `POST /oauth/token`

This endpoint is used to obtain the token, that the user will then use to authenticate to the endpoints.

#### Authorization code grant type

The body of the request, in JSON format, is composed of the following fields:

```json
{
    "code": "{{CODE}}",
    "state": "{{STATE}}"
}
```

These fields are usually retrieved from the redirect url query string.


The endpoint will return a JSON object with *accessToken*, *refreshToken* and *expiresAt*.

```json
{
    "accessToken": "my-access-token",
    "refreshToken": "my-refresh-token",
    "expireAt": 1234567890
}
```

#### Web site cookie configuration

If you are using a website client, you can set the `isWebsiteApp` field to `true` in the service configuration; this way, the token API will return two session cookies: 
- a cookie named *sid*, that contains the access token as value
- a cookie named *refresh_token*, that contains the refresh token as value

The cookies have the following default configuration:

    * HttpOnly: `true`
    * Secure: `true`
    * Path: `/`
    * SameSite: `Lax`

You can further customize the cookie response by adding the `sidCookieCustomAttributes` and/or the `refreshCookieCustomAttributes` to the service configuration, at application level.
In particular, you can change the `SameSite` attribute to `Strict`, and set the `Domain` and the `Path` attributes to a value of your choice.

Here is an example snippet of the configuration:
```json
... 
    "isWebsiteApp": true,
    "sidCookieCustomAttributes": {
        "sameSite": "Strict",
        "domain": "example.com"
    },
    "refreshCookieCustomAttributes": {
        "sameSite": "Strict",
        "domain": "example.com"
        "path": "/auth"
    }
...
```

Refer to [this documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) for a thorough explanation of the mentioned cookie attributes.

:::info

For security reasons, you cannot change the other attributes of the cookie, and you cannot set the `SameSite` attribute to `None`.

:::

#### The JWT Token

The authentication service generates a JWT Token compliant with the [RFC 7519 specification](https://www.rfc-editor.org/rfc/rfc7519).

In particular, the service populates the standard claims:
- `exp` with the expiration date as unix timestamp
- `iat` with the issuance date as unix timestamp
- `sub` with the `userId`, which is the Mongo Id of the user CRUD document
- `jti` with a random generated UUIDv4
- `iss` with the `issuer` specified in the current application config

Along with the above mentioned standard claims, the token contains a custom claim named `user`, which is an object with the following structure:

```json
{
    "properties": {
        "userId": {
            "type": "string"
        },
        "groups": {
            "type": "array",
            "items": { "type": "string" }
        },
        "email": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "userSettingsURL": {
            "type": "string"
        },
        "providerUserId": {
            "type": "string"
        },
        "metadata": {
            "type": "object",
            "additionalProperties": true
        }
    }
}
```
The data are populated from the user CRUD collection. The `providerUserId` and the `metadata` fields are included and populated only if configured, as explained [here](#custom-claims).

### Refresh token

API Signature: `POST /refreshtoken`

The endpoint `POST /refreshtoken` allows to issue a new token, by using the `refreshToken` received in the Token request.

The endpoint needs to be called with a POST, like in the following example:

```sh
curl --location --request POST 'https://app.example.com/refreshtoken' \
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

In case the `isWebsiteApp` application flag is `true`, the `/refreshtoken` also sets the *sid* and *refresh_token* cookies with the new values.

### Logout

API Signature: `GET /logout`

This API takes charge of logging out the user, clearing the access token and the refresh token on both server side and, in case of webapps, on the frontend side.

On server side, the tokens are deleted from Redis.

The request should contain the access token in the `Authorization` header and/or the *sid* and *refresh_token* cookies. 
It also accepts a request with only the *refresh_token* set: in this case it only deletes the session associated to the given refresh token from Redis, since the access token is already expired.

When `isWebsiteApp` flag is set to true, both the *sid* and *refresh_token* cookies are unset, by means of a `Set-Cookie` response header with expiration dates set in the past.

#### Skip provider refresh token

If in your provider you set the `skipProviderRefreshToken` option, the authentication service will validate the provider refresh token by calling the provider userinfo before issuing the refresh token request. 
The refresh token on the provider will only be issued if the validation fails.

## User Info

API Signature: `GET /userinfo`

The `/userinfo` endpoint returns the contents of the `user` claim of the JWT Token.

See the [related section](#jwt-token) for more information on how the JWT Token is built and how you can personalize it to achieve a customized userinfo response.

You can contact the endpoint in this way:
```sh
curl --location --request GET 'https://app.example.com/userinfo' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer <access_token>'
```


### Custom claims

If you need to have additional custom claims in the `user` claim of the token and, as a consequence, in the userinfo response, you have to include the  `customTokenClaims` object in the app configuration.

The object contains the following fields:
- `includeProviderUserId`, if set to `true` the `providerUserId` will be included in the `user` claim, and populated with the user id of the provider. The default behavior is not to include the field.

- `metadataFieldsToInclude`,  an array of strings. If it contains at least one element, a  `metadata` object is added to the `user` claim and populated with the specified fields taken from the corresponding `metadata` object of the CRUD user collection.

As an example, consider a user collection like the following:

```json
{
    "_id": "some-mongo-id",
    "name": "John Doe",
    "groups": ["someGroup"],
    "username": "someUsername",
    "email": "johndoe@example.com",
    "providerId": "someProviderId",
    "providerUserId": "some-id",
    "metadata": {
        "firstName": "John",
        "surname": "Doe",
        "address": {
            "city": "Milan",
            "country": "Italy"
        }
    }
}
```
The authentication service can be configured as follows:

```json
{
  "apps": {
    "APP_ID": {
      "providers": {
        "PROVIDER_ID": {
          ...
        }
      },
    ...
    "customTokenClaims": {
        "includeProviderUserId": true,
        "metadataFieldsToInclude": [
                "surname", "address"
            ]
        }
    }
  }
}
```

The configuration snippet above will result in the following JWT token claims:

```json
{
  "user": {
    "userId": "some-mongo-id",
    "groups": [
        "someGroup"
    ],
    "email": "johndoe@example.com",
    "name": "John Doe",
    "providerUserId": "some-id",
    "metadata": {
        "surname": "Doe",
        "address": {
            "city": "Milan"
        }
    }
  },
  "exp": 123456789,
  "jti": "some-jti",
  "iat": 123456789,
  "iss": "some-iss",
  "sub": "some-mongo-id"
}
```

### Integration with the ***Authorization Service***

The `/userinfo` endpoint can be used by the [Authorization Service](../../runtime_suite/authorization-service/overview) to determine whether the requested resource can be accessed by the current user, based on the contents of the `groups` array.

You need to set the following variables in the [configuration](../../runtime_suite/authorization-service/configuration) with these values:

- **USERINFO_URL**=`http://authentication-service/userinfo` (NB: change the hostname if it has been named differently)
- **CUSTOM_USER_ID_KEY**=`userId`
- **HEADERS_TO_PROXY**=`x-request-id,request-id,cookie,authorization,client-type,host,x-forwarded-host`

#### Custom properties to proxy

If you have configured some [custom claims](#custom-claims) in the authentication service, you can also add them to the authorization service *Custom properties to proxy*.

Just add the name of the fields as a comma-separated list to the following authorization service environment variable:

**USER_PROPERTIES_TO_PROXY**=`metadata,email,name,providerUserId`

This way, a JSON string will be set to an header with name `miauserproperties`, populated with the metadata field of the userinfo response.

Referring to the example above, the header will have the following contents:

```json
{    
    "email": "johndoe@example.com",
    "name": "John Doe",
    "providerUserId": "some-id",
    "metadata": {
        "surname": "Doe",
        "address": {
            "city": "Milan"
        }
    }
}
```

## Token Info

API Signature: `GET /tokeninfo`

:::danger

This endpoint returns potentially confidential information, that a user may not be supposed to have; therefore, depending on your specific use case, you probably don't want to expose it publicly.

:::

This endpoint has the same response of the [userinfo](#user-info), with in addition a `provider` field, populated with the following fields:

- **accessToken**: the access token obtained from the IdP.
- **id**: the provider id of the currently used configuration
- **baseUrl**: the OAuth2 base url of the provider, as set in the configuration
- **userId**: the provider id of the current user

An example of response:
```json
{
    "userId": "63cacfa530a2a89a7f057dce",
    "groups": [
        "testgroup"
    ],
    "email": "some@email.com",
    "name": "John Doe",
    "provider": {
        "accessToken": "provider-token",
        "id": "provider-id",
        "baseUrl": "provider base url",
        "userId": "provider-user-id"
    }
}
```

:::tip

You can use the `/tokeninfo` endpoint as `USERINFO_URL` in the authorization service. This is useful if you want the information included in the `provider` key to be added to the `miauserproperties` header.

:::

## Revoke sessions

:::caution

This API is intended to be used by a privileged user (e.g. an administrator or a customer service operator) or application. Make sure to expose it with a proper authorization config. 

:::

API Signature: `DELETE /sessions`

This is an admin feature that revokes all sessions of the specified user. This is useful when the user is being blocked or deleted on the provider side.

You can contact the endpoint this way:
```sh
curl --location --request DELETE 'https://app.example.com/sessions/:userId' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer <access_token>'
```

The endpoint in case of success will reply with status code 200 and the number of deleted elements.
An example of response:

```json
{
    "count": 2
}
```

## Cleanup all users queue

:::caution

This API is intended to be used by a privileged user (e.g. an administrator or a customer service operator) or application (e.g. a cronjob). Make sure to expose it with a proper authorization config. 

:::

API Signature: `DELETE-/expired-sessions`

This API is helpful to clean up all the expired sessions of all the users.

This is especially useful when the *STORED_ACCESS_TOKEN_NUMBER* environment variable is a big number, in order to keep stored data in Redis to the minimum.

It's recommended to setup a CronJob that periodically invokes this API; the period can be tuned with respect to the queue length and to other parameters that depend on your use case, such as the number of logins per unit of time.

:::warning

The operation is deliberately non-atomic, as it triggers a potentially long and CPU-intensive task that could block Redis.

:::

In case of success, the endpoint will return a 204 No Content response.

### Cleanup a specific users queue

The endpoint can receive also as a query params a specific userID. 
In this case, only the session of the specified user are cleaned up.

Here is an example:
```sh
curl --location --request DELETE 'https://app.example.com/expired-sessions/:userId`' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer <access_token>' 
```

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
