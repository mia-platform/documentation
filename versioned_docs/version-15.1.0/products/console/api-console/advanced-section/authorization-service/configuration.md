---
id: configuration
title:  Advanced Authorization Service Configuration
sidebar_label: Authorization Service
---
## How to write authorization extension

The file for this extension is **/config-extension/authorization-service/auth.json**.

This extension is merged with the automatically generated configuration, taking precedence.

Example configuration:

```json
{
  "/my-path": {
    "GET": {
      "authorization": {
        "expression": "true",
        "public": true
      }
    }
  },
  "/other/path": {
    "ALL": {
      "backofficeAuthorization": {
        "expression": "groups.admin",
        "public": false
      }
    }
  }
}
```
