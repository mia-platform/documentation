---
id: configuration
title:   Advanced Auth0 Client Configuration
sidebar_label: Auth0 Client
---
The file for this extension is **/config-extension/auth0-client/config.json**.

Example of the configuration:

```json
{
  "clients": {
    "cms": {
      "auth0Url": "my auth0 url",
      "clientId": "{{AUTH0_CLIENT_ID}}",
      "clientSecret": "{{AUTH0_CLIENT_SECRET}}",
      "redirectUrl": "https://platform-devcms.test.mia-platform.eu/web-login/callback",
      "scopes": [
        "offline_access",
        "profile",
        "email",
        "website"
      ],
      "audience": "https://platform-dev.test.mia-platform.eu"
    }
  },
  "defaultClient": "",
  "managementClient": {
    "auth0Url": "my auth0 url",
    "clientId": "{{AUTH0_MANAGEMENT_CLIENT_ID}}",
    "clientSecret": "{{AUTH0_MANAGEMENT_CLIENT_SECRET}}"
  },
  "customClaimsNamespaces": [
    "https://mia-platform.eu/app_metadata",
    "https://mia-platform.eu/user_metadata"
  ]
}
```