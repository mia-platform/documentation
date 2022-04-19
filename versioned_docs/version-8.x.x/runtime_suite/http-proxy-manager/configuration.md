---
id: configuration
title: Proxy Manager
sidebar_label: Configuration
---
This service proxies http calls to external services.

## Environment variables

The service needs the following environment variable:

- **CONFIGURATION_PATH** (required): the file path of the service configuration file
- **CONFIGURATION_FILE_NAME** (required): the filename of the service configuration file (without the extension)
- **LOG_LEVEL** (optional, default to `info`): level of the log. It could be trace, debug, info, warn, error, fatal;
- **HTTP_PORT** (optional, default to `8080`): port where the web server is exposed;
- **SERVICE_PREFIX** (optional): path prefix for all the specified endpoints (different from the status routes);
- **ALLOW_PROXY_OPTIMIZER** (optional, default to `false`): boolean that enables optimized proxy using reverse proxy and preventing saving body request in memory. Be careful, this optimization does not perform any retry, thus it is stronly suggested to configure the token validation endpoint in your proxy configuration
- **DELAY_SHUTDOWN_SECONDS** (optional, default to `10` seconds): seconds to wait before starting the graceful shutdown. This delay is required in k8s to await for the DNS rotation;

:::caution
**ALLOW_PROXY_OPTIMIZER** will be dismissed with the next major release. The not optimized proxy functionality and the retry feature is deprecated and will be dismissed too.
:::
## Configuration

This service requires a configuration file that provides all the different details regarding the external services to be proxied.
The configuration file can be mounted into the service either as a *ConfigMap* or as a *Secret* (for more details, please refer to this [documentation](../../development_suite/api-console/api-design/services#custom-configuration)).

:::caution

In case the former method (*Config Map*) is selected, please use [variables interpolation](../../development_suite/api-console/api-design/services#environment-variable-configuration) for sensitive data, such as:

- username
- password
- clientId
- clientSecret

This prevents to store those sensitive values as plain text in the project repository.

:::

The configuration must follow this schema:

```json
{
  "type": "object",
  "properties": {
    "proxies": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "targetBaseUrl",
          "basePath"
        ],
        "properties": {
          "authentication": {
            "type": "string",
            "enum": ["none","oauth2"],
            "default": "none"
          },
          "username": {
            "type": "string"
          },
          "password": {
            "type": "string"
          },
          "clientId": {
            "type": "string"
          },
          "clientSecret": {
            "type": "string"
          },
          "tokenIssuerUrl": {
            "type": "string"
          },
          "tokenIssuerValidationUrl": {
            "type": "string"
          },
          "targetBaseUrl": {
            "type": "string",
            "pattern": "^(https?:\/\/)"
          },
          "basePath": {
            "type": "string",
            "pattern": "^\/"
          },
          "grantType": {
            "type": "string",
            "enum": ["client_credentials", "password"],
            "default": "client_credentials"
          },
          "authType": {
            "type": "string",
            "enum": ["client_secret_basic"],
            "default": "client_secret_basic"
          },
          "additionalAuthFields": {
            "type": "object"
          },
          "headersToProxy": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    }
  }
}
```

The **proxies** array contains one item for each external service that has to by proxied.
A proxy can have the following fields:
- **targetBaseUrl**: the url of the external service. This is a required field and has to start with an *http* or *https* scheme.
- **basePath**: the name of the related endpoint exposed by the _Proxy Manager_. This is a required field and has to start with a `/`.
- **authentication**: the type of authentication done by the proxy, which can either be `oauth2` or `none`.
- **username**: the user identifier for the OAuth2 authentication (only [Password Grant](https://oauth.net/2/grant-types/password/) flow).
- **password**: the user password used in case of OAuth2 authentication (only [Password Grant](https://oauth.net/2/grant-types/password/) flow).
- **clientId**: the client identifier used in case of OAuth2 authentication.
- **clientSecret**: the client secret used in case of OAuth2 authentication.
- **tokenIssuerUrl**: the authorization server url that has to be called to obtain an access token.
- **tokenIssuerValidationUrl**: the authorization server url that has to be called to validate an access token.
- **grantType**: the type of procedure used to retrieve an access token. At the moment, the service supports the following OAuth2 Grant Types:
  -  [*client_credentials*](https://oauth.net/2/grant-types/client-credentials/)
  -  [*password*](https://oauth.net/2/grant-types/password/)
- **authType**: the method used to stuff the client credentials in the request when asking for a new access token. This is required only for the Client Credential Grant flow. At the moment, the service only supports the *client_secret_basic* type.
- **additionalAuthFields**: an object containing additional fields to be used in the authentication request. These fields are added in the request body performed to acquire the access token. Both object keys and values must be of type string.
- **headersToProxy**: a list of headers that must be forwarded when calling the external service. The default behavior, triggered when this field is not provided, is to forward all the headers of original request. In case the list is empty, no header from original request is proxied.

:::caution
**tokenIssuerValidationUrl** and **tokenIssuerUrl** will be dismissed with the next major release.
:::

## Configuration example

In this example, the _Proxy Manager_ is configured to proxy requests to three external services.
- The first one is located at `external-service.com`, requires OAuth2 authentication (*client_credentials* grant type) and can be reached through the proxy with a call to the `/external-service` endpoint.
- The second one is located at `mia-client-credentials.com`, requires OAuth2 authentication (*client_credentials* grant type) and can be reached through the proxy with a call to the `/mia-service` endpoint. It employs additional fields that are added in the request to retrieve an access token.
- The third one is located at `legacy-service.com`, requires OAuth2 authentication (*password* grant type) and can be reached through the proxy with a call to the `/legacy-service` endpoint.
- The forth service is located at `other-service.com`, requires no authentication and can be reached with a call to the `/other-service` endpoint.
- The latter service is located at `another-service.com`, requires no authentication, can be reached with a call to the `/another-service` endpoint and only selected headers are forwarded to it.

```json
{
  "proxies": [
    {
      "authentication": "oauth2",
      "clientId": "6779ef20e75817b79602",
      "clientSecret": "GBAyfVL7YWtP6gudLIjbRZV_N0dW",
      "tokenIssuerUrl": "http://external-service.com/auth/oauth/token",
      "targetBaseUrl": "https://external-service.com",
      "basePath": "/external-service",
      "grantType": "client_credentials"
    },
    {
      "authentication": "oauth2",
      "clientId": "6739ef20e75817a79c02",
      "clientSecret": "GBAweVL7YWtP6gudLIjbRZV_NdW",
      "tokenIssuerUrl": "http://mia-client-credentials.com/auth/oauth/token",
      "tokenIssuerValidationPath": "/token-info",
      "targetBaseUrl": "https://mia-service.com",
      "basePath": "/mia-service",
      "grantType": "client_credentials",
      "additionalAuthFields": {
        "audience": "mia-audience"
      }
    },
    {
      "authentication": "oauth2",
      "username": "username",
      "password": "password",
      "clientId": "0fbd65b60ca0388f2069",
      "clientSecret": "ZUogSDuesC6VpZM9P2_mPTX4",
      "tokenIssuerUrl": "http://legacy-service.com/auth/oauth/token",
      "targetBaseUrl": "http://legacy-service.com",
      "basePath": "/legacy-service",
      "grantType": "password"
    },
    {
      "targetBaseUrl": "http://other-service.com",
      "basePath": "/other-service"
    },
    {
      "targetBaseUrl": "http://another-service.com",
      "basePath": "/another-service",
      "headersToProxy": [
        "Accept",
        "Content-Type"
      ]
    }
  ]
}
```
