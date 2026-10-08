---
id: configuration
title: Proxy Manager
sidebar_label: Configuration
---



This service proxies HTTP calls to external services.

## Environment variables

The service use the following environment variables:

- **CONFIGURATION_PATH** (required for *static* configuration): the file path of the service configuration file;
- **CONFIGURATION_FILE_NAME** (required for *static* configuration): the filename of the service configuration file (without the extension);
- **CONFIGURATION_URL** (required for *dynamic* configuration): the url of the CRUD collection with the service configuration;
- **PROXY_CACHE_TTL** (optional, default to `0`): the time to live (in seconds) of cached proxy configurations. This is used only with *dynamic* configuration.
- **LOG_LEVEL** (optional, default to `info`): level of the log. It could be trace, debug, info, warn, error, fatal;
- **HTTP_PORT** (optional, default to `8080`): port where the web server is exposed;
- **SERVICE_PREFIX** (optional): path prefix for all the specified endpoints (different from the status routes);
- **EXPOSE_MANAGEMENT_APIS** (optional, default `false`): allows to control whether or not [management APIs](/runtime-components/plugins/http-proxy-manager/20_how_to_use.md#management-api) are exposed by the service (please note that this flag can be used only when running in dynamic configuration mode);
- **ALLOW_PROXY_OPTIMIZER** (optional, default to `true`): boolean that enables optimized proxy using reverse proxy and preventing saving body request in memory. Be careful, this optimization does not perform any retry, thus it is strongly suggested to configure the token validation endpoint in your proxy configuration;
- **DELAY_SHUTDOWN_SECONDS** (optional, default to `10` seconds): seconds to wait before starting the graceful shutdown. This delay is required in k8s to await for the DNS rotation;
- **DISABLE_PROXY_CACHE** (optional, default `false`): allows to disable the in-memory proxy cache. Such cache is used to prevent excessive CRUD invocations (useful when you want to prevent any possible out-dated cache hit whenever the service is using Dynamic Configuration in the context of a scaled HA architecture)
- **BASE_PATH_MATCHERS** (optional): comma-separated list of paths that are used to let the service handle complex base paths when using dynamic proxy configuration (note: this function is not compatible with the non-optimized proxy configuration, make sure to set `ALLOW_PROXY_OPTIMIZER=true`).
- **ADDITIONAL_HEADERS_TO_REDACT** (optional): comma separated values of additional headers to redact when logging. The following headers are always redacted: `Authorization`, `Cookie`, `Proxy-Authorization`, `Set-Cookie` and `Www-Authenticate`;

:::caution
**ALLOW_PROXY_OPTIMIZER** will be dismissed with the next major release. The not optimized proxy functionality and the retry feature is deprecated and will be dismissed too.
:::

## Static configuration

This service requires a configuration file that provides all the different details regarding the external services to be proxied.
The configuration file can be mounted into the service either as a *ConfigMap* or as a *Secret* (for more details, please refer to this [documentation](/products/console/api-console/api-design/services.md#custom-configuration)).

:::caution
In case the former method (*Config Map*) is selected, please use [variables interpolation](/products/console/api-console/api-design/services.md#environment-variable-configuration) for sensitive data, such as:

- username
- password
- clientId
- clientSecret

This prevents to store those sensitive values as plain text in the project repository.
:::

### Configuration schema

The configuration must follow this schema:

```json
{
  "type": "object",
  "properties": {
    "proxies": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["targetBaseUrl","basePath"],
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
          "tokenIssuerValidationPath": {
            "type": "string"
          },
          "targetBaseUrl": {
            "type": "string",
            "pattern": "^https?:\\/\\/[a-zA-Z0-9.:_-]+(\\/((\\{[a-zA-Z0-9_-]+\\})|[a-zA-Z0-9_-]+))*\\/?$"
          },
          "basePath": {
            "type": "string",
            "pattern": "^\\/[a-zA-Z0-9_-]+(\\/((\\{[a-zA-Z0-9_-]+\\})|[a-zA-Z0-9_-]+))*\\/?$"
          },
          "grantType": {
            "type": "string",
            "enum": ["client_credentials","password"],
            "default": "client_credentials"
          },
          "authType": {
            "type": "string",
            "enum": ["client_secret_basic"],
            "default": "client_secret_basic"
          },
          "additionalAuthFields": {
            "type": "object",
            "default": null
          },
          "headersToProxy": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "default": []
          },
          "additionalHeaders": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "value": {
                  "type": "string"
                }
              },
              "required": ["name","value"]
            },
            "default": []
          }
        }
      }
    }
  }
}
```

The **proxies** array contains one item for each external service that has to by proxied.

A proxy can have the following fields:
- **targetBaseUrl**: the url of the external service. This is a required field and has to start with an *http* or *https* scheme. Possible path parameters from the base path can be referenced and added to the url with the `{param-name}` syntax (**only for static configuration**).
- **basePath**: the name of the related endpoint exposed by the _Proxy Manager_. This is a required field and has to start with a `/`.
Path parameter can be specified with the `{param-name}` syntax and eventually forwarded to the external service in the _targetBaseUrl_ using the same name (**only for static configuration**).
- **authentication**: the type of authentication done by the proxy, which can either be `oauth2` or `none`.
- **username**: the user identifier for the OAuth2 authentication (only [Password Grant](https://oauth.net/2/grant-types/password/) flow).
- **password**: the user password used in case of OAuth2 authentication (only [Password Grant](https://oauth.net/2/grant-types/password/) flow).
- **clientId**: the client identifier used in case of OAuth2 authentication.
- **clientSecret**: the client secret used in case of OAuth2 authentication.
- **tokenIssuerUrl**: the authorization server url that has to be called to obtain an access token.
- **tokenIssuerValidationUrl**: the authorization server url that has to be called to validate an access token. This validation is performed at each API call. If not provided, the validation is skipped and the proxy only checks for token expiration.
- **grantType**: the type of procedure used to retrieve an access token. At the moment, the service supports the following OAuth2 Grant Types:
  -  [*client_credentials*](https://oauth.net/2/grant-types/client-credentials/)
  -  [*password*](https://oauth.net/2/grant-types/password/)
- **authType**: the method used to stuff the client credentials in the request when asking for a new access token. This is required only for the Client Credential Grant flow. At the moment, the service only supports the *client_secret_basic* type.
- **additionalAuthFields**: an object containing additional fields to be used in the authentication request. These fields are added in the request body performed to acquire the access token. Both object keys and values must be of type string.
- **headersToProxy**: a list of headers that must be forwarded when calling the external service. The default behavior, triggered when this field is not provided, is to forward all the headers of original request. In case the list is empty, no header from original request is proxied.
- **additionalHeaders**: a list of headers the must be added to the request when calling the external service, after authentication is successful.
A use case of additionalHeaders is api keys management (e.g. x-api-key header).

:::caution
Path parameters inside **targetBaseUrl** and **basePath** are only allowed for the static configuration.
:::

## Dynamic configuration

The service requires a CRUD collection (named as you prefer) that provides all the different details regarding the external services to be proxied: each document **must** match the *proxy* schema specified in the [configuration schema](#configuration-schema).

:::tip
By default, when using the *dynamic configuration* only the first segment of the invoked path is used as base path to extract configurations from the database; in this scenario path parameters are not supported.

**E.g.**: without `BASE_PATH_MATCHERS`, given a request with path `/one/two/three`, the **basePath** searched on CRUD is `/one`.

Use the `BASE_PATH_MATCHERS` environment variable to provide one ore more base path matchers and let the service be able to extract more complex
base paths from the database.

Assuming you set `BASE_PATH_MATCHERS=/my-path/:param,/another-path/test-api` and then invoke `/my-path/123/some-other-api`, the **basePath** searched on CRUD will be `/my-path/123`.
:::

In order to configure correctly the CRUD collection, you can **import** the fields from this <a download target="_blank" href="/docs_files_to_download/http-proxy-manager/crud.fields.json">file</a>. This file already enables the Client Side Field Level Encryption (CSFLE) for those fields with sensitive data.

## Recommendations

It is recommended to add the following indexes to your CRUD collection:
- a *unique* index for field **basePath** (to guarantee proxy uniqueness),
- a search index for fields **basePath** and **__STATE__** (to improve performances).

## Configuration example

In this example, the _Proxy Manager_ is configured to proxy requests to three external services.
- The first one is located at `external-service.com`, requires OAuth2 authentication (*client_credentials* grant type) and can be reached through the proxy with a call to the `/external-service` endpoint.
- The second one is located at `mia-client-credentials.com`, requires OAuth2 authentication (*client_credentials* grant type) and can be reached through the proxy with a call to the `/mia-service` endpoint. It employs additional fields that are added in the request to retrieve an access token.
- The third one is located at `legacy-service.com`, requires OAuth2 authentication (*password* grant type) and can be reached through the proxy with a call to the `/legacy-service` endpoint.
- The forth service is located at `other-service.com/{id}`, requires no authentication and can be reached with a call to the `/other-service/{id}` endpoint. For example, with a call to the `/other-service/page-id/additional-path` endpoint will be called the target service `other-service.com/page-id/additional-path`. Path parameters can be used only with static configuration.
- The latter service is located at `another-service.com`, requires no authentication, can be reached with a call to the `/another-service` endpoint, only selected headers are forwarded to it and the additional header `x-api-key` with `header-value` is sent.

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
      "targetBaseUrl": "http://other-service.com/{id}",
      "basePath": "/other-service/{id}"
    },
    {
      "targetBaseUrl": "http://another-service.com",
      "basePath": "/another-service",
      "headersToProxy": [
        "Accept",
        "Content-Type"
      ],
      "additionalHeaders": [
        {
          "name": "x-api-key", 
          "value": "header-value"
        }
      ]
    }
  ]
}
```
