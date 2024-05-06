---
id: configuration
title: Authorization service
sidebar_label: Configuration
---
This service can be added to your project by visiting Mia-Platform [Marketplace](../../marketplace/overview_marketplace.md) and creating a new microservice from the **Authorization Service** plugin.

## Configuration

The configuration is saved in the `auth.json` file, which is generated from the backend and visible as read-only. One way to overwrite the configuration is editing the service [advanced configuration](../../development_suite/api-console/advanced-section/authorization-service/configuration). The configuration must follow this schema:

```json
{
  "definitions": {
    "authorization": {
      "type": "object",
      "properties": {
        "expression": {
          "type": "string"
        },
        "public": {
          "type": "boolean"
        }
      },
      "required": [
        "expression",
        "public"
      ]
    }
  },
  "type": "object",
  "patternProperties": {
    "^\/": {
      "type": "object",
      "patternProperties": {
        "^(GET|POST|PATCH|PUT|DELETE|HEAD)$|^(ALL)$": {
          "type": "object",
          "properties": {
            "authorization": {
              "$ref": "#/definitions/authorization"
            },
            "backofficeAuthorization": {
              "$ref": "#/definitions/authorization"
            }
          }
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

In this configuration, we expect that all the methods are written in uppercase. You can also insert the keyword `ALL` that automatically handles the main methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD` and `OPTIONS`.

In this configuration authorization is separated between backoffice and frontend request. The header to match this condition is set by the env variable `BACKOFFICE_HEADER_KEY`.

### Configuration example

```json
{
  "/": {
    "GET": {
      "authorization": {
        "expression": "true",
        "public": true
      }
    },
    "POST": {
      "authorization": {
        "expression": "false",
        "public": false
      }
    },
    "PUT": {
      "authorization": {
        "expression": "false",
        "public": false
      },
      "backofficeAuthorization": {
        "expression": "false",
        "public": false
      }
    }
  },
  "/myApi": {
    "ALL": {
      "authorization": {
        "expression": "groups.admin && isBackoffice",
        "public": false
      }
    }
  },
  "/users": {
    "ALL": {
      "authorization": {
        "expression": "groups.admin && isBackoffice",
        "public": false
      }
    }
  }
}

```

## Environment variables

* **LOG_LEVEL** (*default: `trace`*): level of the log. It can be `trace`, `debug`, `info`, `warn`, `error`, or `fatal`;
* **HTTP_PORT** (*default: `3000`*): the port exposed by the service;
* **CONFIGURATION_PATH** (*required, default: `./`*): the path to the configuration file. Do not include the file name;
* **CONFIGURATION_FILE_NAME** (*required, default: `test-config.test`*): the name of the configuration file. Do not include the full path;
* **BACKOFFICE_HEADER_KEY** (*required, default: `isbackoffice`*): the header key which identifies the value which determines if the service is considered backoffice;
* **SERVICE_VERSION** (*default: `1.0.0`*): the service version, included in status routes responses;
* **SERVICE_PREFIX**: the prefix used for the path of the service endpoints;
* **USERINFO_URL** (*required*, if `TRUST_MIA_USER_HEADERS` is set to `false`): the url of the service that provides information about the user.
If you rely on `auth0-client` or on the `authentication-service`, the value of this variable should be respectively `http://auth0-client/userinfo` or `http://authentication-service/userinfo`, where the hostname might be different if your service has been renamed;
* **CUSTOM_USER_ID_KEY** : a unique identifier of the user, based on the response given by the endpoint set in **USERINFO_URL**.  If you use `auth0-client` it should be `sub`, if you use `authentication-service` it should be `userId`. Refer to the documentation of the external service you are using for more information about the user id.
* **AUTHORIZATION_STRICT_MODE_ENABLED**: defines whether strict mode is enabled or not;
* **USER_PROPERTIES_TO_PROXY**: the name of the fields in the response from **USERINFO_URL** that you want to be proxied to other services. They will be JSON encoded and set as value of the header configured in the env variable `USER_PROPERTIES_HEADER_KEY`.
* **CLIENT_TYPE_HEADER_KEY** (*required, default: `client-type`*): the header key which identifies the value which determines the client type;
* **BACKOFFICE_USERINFO_URL**: the backoffice url of the service that provides information about the user;
* **CUSTOM_PERMISSIONS_KEY**: the name of the field in the response from **USERINFO_URL** to be used to retrieve permissions. The field must be at the first level of the response and must be an array of strings. Permissions can then be used in ACL expressions as described [here](../../development_suite/api-console/api-design/endpoints#manage-the-security-of-your-endpoints);
* **DELAY_SHUTDOWN_SECONDS** (*default: `10`*): the amount of seconds waited before closing the service when performing a graceful shutdown;
* **HEADERS_TO_PROXY**: specifies which headers need to be proxied (to the url set by **USERINFO_URL** variable). If you are using `auth0-client` or `authentication-service`, its value should be `x-request-id,request-id,cookie,authorization,client-type,host,x-forwarded-host`;
* **AUTHORIZATION_HEADERS_TO_PROXY**: specifies which headers could contain the authorization headers used by the user services in a comma separated list of headers. For example, in an oidc flow where the session is saved as bearer token, here should be set `authorization`.
* **TRUST_MIA_USER_HEADERS** (*default: `false`*): specifies if the service should trust the request headers which contain the user data (**be careful**: do not set this to `true` if this authorization service is used by an API Gateway exposed to internet. This is intended for the API Gateways of the projects protected by an Edge Gateway).
* **USERID_HEADER_KEY** (*default: `miauserid`*): the request header containing the user id.
* **GROUPS_HEADER_KEY** (*default: `miausergroups`*): the request header containing the user groups.
* **USER_PROPERTIES_HEADER_KEY** (*default: `miauserproperties`*): the request header containing the user properties.
