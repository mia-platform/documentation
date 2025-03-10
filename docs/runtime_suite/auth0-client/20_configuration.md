---
id: configuration
title: Auth0 Client Configuration
sidebar_label: Configuration
---

<!--
WARNING: this file was automatically generated by Mia-Platform Doc Aggregator.
DO NOT MODIFY IT BY HAND.
Instead, modify the source file and run the aggregator to regenerate this file.
-->

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
- __REDIS_USERNAME__: defines the redis username to be used for authentication
- __REDIS_PASSWORD__: defines the redis password to be used for authentication
- __REDIS_HOSTS__ (__required__): defines the redis hosts
- __REDIS_TLS__ (__default: `false`__): when `true`, enables the TLS connection to Redis
- __REDIS_TLS_CACERT__: defines the path to the Redis server CA, if not public (this is effective only if `REDIS_TLS` is set to `true`)
- __ORIGINAL_PROTOCOL_HEADER__ (__required__): defines the original protocol header
- __SERVICE_CONFIG_FILE_NAME__ (__required__): defines the service config name
- __SERVICE_CONFIG_PATH__ (__required__): defines the service config path
- __AUTH0_LOGOUT_CLIENT_ID_ENABLED__ (__default: `false`__): When true, the `client_id` query string is always used when logging auth from Auth0. N.B. Enabling this variable will possibly require some changes on your Auth0 dashboard configuration, please [check this paragraph](./50_usage.md#logout-the-users) for details.

The following environment variables are to sync user metadata in a `user` collection on every token create/update:

- __MONGO_DB_URL__: defines the mongoDB url
- __USERS_DATABASE_NAME__: defines `users` MongoDB collection name
- __USERS_COLLECTION_NAME__: defines `users` CRUD Collection name
- __USERS_PROPERTIES_TO_SAVE__: defines `users` properties to save
- __DELAY_SHUTDOWN_SECONDS__: defines the delay in seconds before shutting down (default: 10)

## Configuration

The Auth0-Client service uses a single config map called `auth0-client-config` and the file, `config.json`, containing the configuration must follow this schema:

<details>
<summary>Click to expand the configuration JSON schema</summary>

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
      "anyOf": [
        {
          "$ref": "#/definitions/managementClientBaseProps"
        },
        {
          "oneOf": [
            {
              "$ref": "#/definitions/deprecatedManagementClientProps"
            },
            {
              "$ref": "#/definitions/managementClientProps"
            }
          ]
        }
      ],
      "required": [
        "auth0Url",
        "clientId",
        "clientSecret"
      ]
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
        },
        "sameSite": {
          "enum": ["Lax", "None", "Strict"],
          "description": "The sameSite field set the SameSite attribute of the clientType Set-Cookie HTTP response header. It allows you to declare if your cookie should be restricted to a first-party or same-site context.
          - \"Lax\": Cookies are not sent on normal cross-site subrequests (for example to load images or frames into a third party site), but are sent when a user is navigating to the origin site (i.e., when following a link).
          - \"Strict\": Cookies will only be sent in a first-party context and not be sent along with requests initiated by third party websites.
          - \"None\": Cookies will be sent in all contexts, i.e. in responses to both first-party and cross-site requests."
        },
        "authorizeStateRequired": {
          "type": "boolean"
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
    },
    "deprecatedManagementClientProps": {
      "type": "object",
      "additionalProperties": false,
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
          "description": "DEPRECATED: use `supportedConnectionsMap` in combination with `defaultManagementConnectionName` instead",
          "items": {
            "type": "string"
          }
        },
        "defaultCreateUserConnection": {
          "description": "DEPRECATED: use `defaultManagementConnectionName` in combination with `supportedConnectionsMap` instead",
          "type": "string"
        }
      }
    },
    "managementClientProps": {
      "type": "object",
      "additionalProperties": false,
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
        "defaultManagementConnectionName": {
          "type": "string"
        },
        "supportedConnectionsMap": {
          "type": "object",
          "description": "Maps the supported connection names to the respective connection IDs. Make sure they are correct from the auth0 dashboard",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "connectionId":{ "type": "string" }
            },
            "required": ["connectionId"]
          }
        }
      }
    },
    "managementClientBaseProps": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "auth0Url": {
          "type": "string"
        },
        "clientId": {
          "type": "string"
        },
        "clientSecret": {
          "type": "string"
        }
      }
    }
  }
}
```
</details>

Clients are indexed by their client type name; please note that the default client is only used when there is no specified client in the request and the default client is configured.

If a wrong/malicious/misconfigured client is being used in the request then the response will be rejected with Unauthorized (401) status code.

Notice that the `managementClient` has 2 different possible configurations; the deprecated one does not allow the usage of bulk import APIs.


The `audience` field, if specified, must match the *Identifier* of the Auth0 [API Settings](https://auth0.com/docs/get-started/apis/api-settings#general-settings) of your Application.

### Authorize state parameter

:::info

This feature is turned off by default for retro-compatibility reasons, but its usage is strongly encouraged.


To enable this feature, you need to set the config parameter variable `authorizeStateRequired` to `true`, under the `clientType` configuration of the `client`.

NB: if the config parameter is not set, the `state` parameter will be ignored and generated internally, maintaining the current behavior.

:::


To achieve a better level of security, the client should take charge of the process of the state generation and subsequent check after the redirect.
This enables protection against CSRF attacks, as documented [here](https://www.rfc-editor.org/rfc/rfc6749#section-10.12).

The client must follow these steps:

- Generate a random state string. The randomly generated string should be sufficiently hard to guess, as described [here](https://www.rfc-editor.org/rfc/rfc6749#section-10.10). For instance, an [UUID v4](https://en.wikipedia.org/wiki/Universally_unique_identifier) is compliant with this specification.

- Save the state on the client application side (for example in local storage), making sure the location where it is saved it is only accessible by the client.

- Call the `/authorize` endpoint, passing the `state` in the query string.

- Once the redirect URL is called, the client must check that the state in the redirect URL querystring matches the one it generated at the first step. If it doesn't, the client must refuse to proceed in the token request.

- If the state validation check succeeds, the client can now obtain a token by calling the `/oauth/token` endpoint.


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
    "supportedConnectionsMap": {},
    "defaultManagementConnectionName": "",
    "authorizeStateRequired": true
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
- `POST /users`: will use the default connection from _ManagementClient_ if no connection is provided, otherwise will use the one provided (if supported).
- `GET /users/active`: will return a list of the active users at the time the call is made.

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

## How to add a login page to a front-end service

You may want to add a login page to protect your endpoints from unknown users: for example you may need to restrict the access to the [API Portal](../api-portal/overview).   
The first thing you need to do is to enable the *Authentication Required* [security setting](../../development_suite/api-console/api-design/endpoints#manage-the-security-of-your-endpoints) to the endpoint you want to protect.    
Now you have to specify how to handle the 401 status. You have to redirect the user to the login page of auth0. 

Go to the Design area, Advanced section, and then select `api-gateway`. Put the code below in the `server-extension.conf`.

```nginx
error_page 401 = @error401;

location @error401 {
  include /etc/nginx/customization.d/header-debug.conf;

  if ($type = "text/html") {
    return 302 '$original_request_scheme://$original_request_host/web-login?redirect=$original_request_uri$is_args$args';
  }

  default_type $type;
  return 401 $content_401;
}
```

Now you have to handle the routing of the request to the auth0-client and oauth-login-site endpoints, that are currently handled only on the backoffice.

`maps-proxyName.before.map`

```nginx
# Authentication
## Redirect to OAuth login site to proceed with login on frontend upstream.
"~^(secreted|unsecreted)-(0|1)-GET-/authorize" "auth0-client";
"~^(secreted|unsecreted)-(0|1)-GET-/logout" "auth0-client";
"~^(secreted|unsecreted)-(0|1)-POST-/oauth/token" "auth0-client";
"~^(secreted|unsecreted)-(0|1)-GET-/web-login" "oauth-login-site";
"~^(secreted|unsecreted)-(0|1)-GET-/web-login/callback" "oauth-login-site";
```

Put the following code into `auth.json` file of the authorization-service in order to open the routes declared above: 

<details>
<summary>Click to expand `auth.json` file contents</summary>


```json
{
  "/web-login": {
    "GET": {
      "authorization": {
        "expression": "true",
        "public": true
      },
      "backofficeAuthorization": {
        "expression": "true",
        "public": true
      }
    }
  },
  "/users": {
    "ALL": {
      "authorization": {
        "expression": "true",
        "public": true
      },
      "backofficeAuthorization": {
        "expression": "true",
        "public": true
      }
    }
  },
  "/login-site": {
    "GET": {
      "authorization": {
        "expression": "true",
        "public": true
      }
    }
  },
  "/authorize": {
    "GET": {
      "authorization": {
        "expression": "true",
        "public": true
      },
      "backofficeAuthorization": {
        "expression": "true",
        "public": true
      }
    }
  },
  "/oauth/token": {
    "POST": {
      "authorization": {
        "expression": "true",
        "public": true
      },
      "backofficeAuthorization": {
        "expression": "true",
        "public": true
      }
    }
  }
}
```
</details>

Finally, you need to configure auth0-client to be able to use it correctly:

```json
{
    "clients": {
        "frontend": {
            "auth0Url": "YOUR_AUTH0_URL",
            "clientId": "YOUR_AUTH0_CLIENT_ID",
            "clientSecret": "YOUR_AUTH0_CLIENT_SECRET",
            "redirectUrl": "YOUR_AUTH0_FRONTEND_URL",
            "scopes": [
                "offline_access",
                "profile",
                "email",
                "website"
            ]
        }
    },
    "defaultClient": "frontend",
    "managementClient": {
        "auth0Url": "YOUR_AUTH0_URL",
        "clientId": "YOUR_AUTH0_CLIENT_ID",
        "clientSecret": "YOUR_AUTH0_CLIENT_SECRET",
        "authorizeStateRequired": true
    },
    "customClaimsNamespaces": [
        "https://mia-platform.eu/app_metadata",
        "https://mia-platform.eu/user_metadata"
    ]
}

```

Note that, if you already use auth0-client to handle cms login, you may have the `cms` client already configured. In that case, you just need to add the `frontend` client and `defaultClient` to the configuration already present.

For logging out, you just need to call `GET /logout`.
