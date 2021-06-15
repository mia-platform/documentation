---
id: configuration
title: Auth0 Client Configuration
sidebar_label: Configuration
---
## Environment Variables

The Auth0-Client service accepts the following environment variables:

- __LOG_LEVEL__: defines the logging level of the logger (default: info)
- __HTTP_PORT__: defines the http port to use (default: 8080)
- __SERVICE_PREFIX__: defines the service prefix (default: '')
- __SERVICE_VERSION__: defines the service version
- __SESSION_DURATION_SECONDS__: defines the session duration in seconds (default: 86400)
- __SESSION_SCOPE__: defines the scope of the session
- __REDIS_MODE__: defines the redis mode (normal or sentinel) (default: normal)
- __REDIS_MASTER_NAME__: defines the redis master name
- __REDIS_HOSTS__ (__required__): defines the redis hosts
- __ORIGINAL_PROTOCOL_HEADER__ (__required__): defines the original protocol header
- __SERVICE_CONFIG_FILE_NAME__ (__required__): defines the service config name
- __SERVICE_CONFIG_PATH__ (__required__): defines the service config path

The following environment variables are to sync user metadata in a `user` collection on every token create/update:

- __MONGO_DB_URL__: defines the mongoDB url
- __USERS_DATABASE_NAME__: defines `users` database name
- __USERS_COLLECTION_NAME__: defines `users` collection name
- __USERS_PROPERTIES_TO_SAVE__: defines `users` properties to save
- __DELAY_SHUTDOWN_SECONDS__: defines the delay in seconds before shutting down (default: 10)

## Configuration

The Auth0-Client service uses a single config map called `auth0-client-config` and the file, `config.json`, containing the configuration must follow this schema:

```json
{
  "type": "object",
  "properties": {
    "clients": {
      "additionalProperties": {
        "$ref": "#/definitions/clientType"
      }
    },
    "defaultClient": {
      "type": "string"
    },
    "customClaimsNamespaces": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "managementClient": {
      "type": "object",
      "properties": {
        "auth0Url": {
          "type": "string"
        },
        "clientId": {
          "type": "string"
        },
        "clientSecret": {
          "type": "string"
        },
        "supportedConnections": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "defaultCreateUserConnection": {
          "type": "string"
        }
      },
      "required": [
        "auth0Url",
        "clientId",
        "clientSecret"
      ],
      "additionalProperties": false
    },
    "auth0TenantUrl": {
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "clients",
    "managementClient"
  ],
  "definitions": {
    "clientType": {
      "type": "object",
      "properties": {
        "auth0Url": {
          "type": "string"
        },
        "clientId": {
          "type": "string"
        },
        "clientSecret": {
          "type": "string"
        },
        "redirectUrl": {
          "type": "string"
        },
        "audience": {
          "type": "string"
        },
        "scopes": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "supportedSigningAlgs": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "supportedConnections": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "defaultConnection": {
          "type": "string"
        }
      },
      "required": [
        "auth0Url",
        "clientId",
        "clientSecret",
        "redirectUrl",
        "scopes"
      ],
      "additionalProperties": false
    }
  }
}
```

Clients are indexed by their client type name; please note that the default client is only used when there is no specified client in the request and the default client is configured.
If a wrong/malicious/misconfigured client is being used in the request then the response will be immediately rejected with Unauthorized (401) status code.

## Example of configuration

```json
{
  "clients": {
    "cms": {
      "auth0Url": "my auth0 url",
      "clientId": "{{AUTH0_CLIENT_ID}}",
      "clientSecret": "{{AUTH0_CLIENT_SECRET}}",
      "redirectUrl": "https://my-host/web-login/callback",
      "scopes": [
        "offline_access",
        "profile",
        "email",
        "website"
      ],
      "audience": "https://my-host.test.mia-platform.eu",
      "supportedConnections": [],
      "defaultConnection": ""
    }
  },
  "defaultClient": "",
  "managementClient": {
    "auth0Url": "my auth0 url",
    "clientId": "{{AUTH0_MANAGEMENT_CLIENT_ID}}",
    "clientSecret": "{{AUTH0_MANAGEMENT_CLIENT_SECRET}}",
    "supportedConnections": [],
    "defaultCreateUserConnection": ""
  },
  "customClaimsNamespaces": [
    "https://mia-platform.eu/app_metadata",
    "https://mia-platform.eu/user_metadata"
  ]
}
```

## Auth0 Connection integration

Auth0 uses connections as a pool of identity sources where users are stored. In order to integrate with specific connections in Auth0 domain, the service configuration enables
the developer to specify a set of `supportedConnections` for each client (including the _ManagementClient_); the list of connections is used to filter or reject connections provided
in requests towards the service.

All clients (except the _ManagementClient_ which uses a different property, see below) can be configured to use a `defaultConnection`, please note that
if you do not provide a `defaultConnection` then you'll have to specify a connection when contacting the `/authorize` and `/oauth/token` APIs.
If you instead provide the `defaultConnection` it will be used when no connection is set in the original request.

Keep in mind that the `defaultConnection` **must** be specified in the `supportedConnections` list, otherwise an error is returned at service startup.

The _ManagementClient_ uses an extra configuration `defaultCreateUserConnection` that is used during user creation. Please note that a connection is
required by this endpoint thus the need to enforce a default one if none is provided. As for the `defaultConnection` in normal clients, keep in mind
that the configured `defaultCreateUserConnection` **must** be specified in the `supportedConnections` list, otherwise an error is returned at service startup.

The endpoints that support connections are the following:

- `GET /authorize`: will select connection based on request, using specified default connection if none is provided;
- `POST /oauth/token`: in a similar fashion to `/authorize` will use provided connection if supported otherwise it uses the default configured.
- `GET /users`: will filter connections in original request based on _ManagementClient_ supported connection, if none is provided all supported connections are used by default;
- `POST /user/:userId`: will use default connection from _ManagementClient_ if no connection is provided, otherwise will use the one provided (if supported).

## Supported redis modes

This service handles the session saving into redis either the session id or the access token.

You must configure it through these env variables:

* `REDIS_HOSTS` [**required**]: comma separated list of redis hosts. If port is not specified, use default port (6379);
* `REDIS_MODE` [**required**] (default: *normal*): available values are `normal` or `sentinel`;
* `REDIS_MASTER_NAME` [**optional**]: if redis mode is sentinel, then the value is used as the master name; if redis mode is normal, this variable is ignored.

Session created could have a scope, settable through `SESSION_SCOPE` env variable.

## Sync user metadata into mongodb

Using this service, users are saved only in auth0 database. If links to user id are required in a project, you could sync auth0 user metadata in a mongodb collection.

This feature is disabled by default, but you could activate it by adding all these envs:

* `MONGO_DB_URL` [**optional**]: mongodb url that needs to be connected to your mongo instance;
* `USERS_DATABASE_NAME` [**optional**]: mongodb database name where you want to save user metadata;
* `USERS_COLLECTION_NAME` [**optional**]: mongodb collection name where you want to save user metadata;
* `USERS_PROPERTIES_TO_SAVE` [**optional**]: comma separated list of properties to maintain in sync.
