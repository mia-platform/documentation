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
- **DELAY_SHUTDOWN_SECONDS** (optional, default to `10` seconds): seconds to wait before starting the graceful shutdown. This delay is required in k8s to await for the dns rotation;

## Configuration

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
          "clientId": {
            "type": "string"
          },
          "clientSecret": {
            "type": "string"
          },
          "tokenIssuerUrl": {
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
            "enum": ["client_credentials"],
            "default": "client_credentials"
          },
          "authType": {
            "type": "string",
            "enum": ["client_secret_basic"],
            "default": "client_secret_basic"
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
- **basePath**: the name of the related endpoint exposed by the _Proxy Manager_. This is a required field and has to start with a */*.
- **authentication**: the type of authentication done by the proxy, which can either be *oauth2* or *none*.
- **clientId**: the client identifier used in case of OAuth2 authentication.
- **clientSecret**: the client secret used in case of OAuth2 authentication.
- **tokenIssuerUrl**: the authorization server url that has to be called to obtain an access token.
- **grantType**: the type of procedure used to retrieve an access token. At the moment, the service only supports the *client_credentials* type.
- **authType**: the method used to stuff the client credentials in the request when asking for a new access token. At the moment, the service only supports the *client_secret_basic* type.

## Configuration example

In this example, the _Proxy Manager_ is configured to proxy requests to two external services. 
The first one is located at *external-service.com*, requires OAuth2 authentication and can be reached through the proxy with a call to the */external-service* endpoint.
The second service is located at *other-service.com*, requires no authentication and can be reached with a call to the */other-service* endpoint.

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
      "targetBaseUrl": "http://other-service.com",
      "basePath": "/other-service"
    }
  ]
}
```
