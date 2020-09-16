---
id: configuration
title:  Configuration
sidebar_label: Configuration
---
The configuration must follow the schema described in [config schema](https://git.tools.mia-platform.eu/platform/core/authorization-service/blob/master/config.schema.json).

In this configuration, we expect that all the methods are written in uppercase. You can also insert the keyword `ALL` that automatically handles the main methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE` and `HEAD`.

In this configuration authorization is separated between backoffice and frontend request. The header to match this condition is set by the env variable `BACKOFFICE_HEADER_KEY`.

#### Configuration example

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
