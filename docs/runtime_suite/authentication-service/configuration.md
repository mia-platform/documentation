---
id: configuration
title: Authentication Service Configuration
sidebar_label: Configuration
---
The _Authentication Service_ needs some environment variables, and a configurations file to work.

## Environment variables

The environment variables needed by the service are:

- **LOG_LEVEL**
- **HTTP_PORT**
- **SERVICE_PREFIX**
- **SERVICE_VERSION**
- **DELAY_SHUTDOWN_SECONDS**
- **REDIS_HOST**
- **REDIS_USERNAME**
- **REDIS_PASSWORD**
- **CONFIG_FILE_PATH**
- **CONFIG_FILE_NAME**
- **USERS_CRUD_BASE_URL**
- **MIA_JWT_TOKEN_SIGN_KEY**
- **MIA_JWT_TOKEN_VALID_DURATION_SEC**
- **MIA_REFRESH_TOKEN_VALID_DURATION_SEC**
- **PROVIDER_TOKEN_PASS_PHRASE**
- **EXPIRE_DELTA_PROVIDER_TOKEN_SEC**
- **ORIGINAL_PROTOCOL_HEADER**
- **ADDITIONALS_CA_FOLDER**
- **ADDITIONAL_HEADERS_TO_PROXY**

## Configurations file

The configurations file required by the _Authentication Service_ is in the JSON format. The file stores the configurations required by the Identity Providers to be used for authenticaton of your applications.

:::caution 
We recommend to mount this configuration file using a Kubernetes Secret due its confidential content.
:::

It is important to outline that it is possible to define an `order` property, not required, that will order your providers in the providers API result (e.g. for your login page) from the relative highest value to the lowest. In case the order property is not defined or multiple providers have the same order number, the service will alphabetically order them.

```json
{
  "apps": {
    "web": {
      "providers": {
        "gitlab": {
          "type": "gitlab",
          "clientId": "the-idp-client-id",
          "clientSecret": "the-idp-client-secret",
          "authUrl": "https://gitlab/auth",
          "tokenUrl": "https://gitlab/token",
          "userInfoUrl": "https://gitlab/api/v4/user",
          "baseUrl": "https://gitlab",
          "scope": ["custom_scope"],
          "order": 10
        },
        "github": {
          "order": 20,
          "type": "github",
          "label": "My GitHub",
          "clientId": "the-idp-client-id",
          "clientSecret": "the-idp-client-secret",
          "authUrl": "https://github/authorize",
          "tokenUrl": "https://github/oauth/token",
          "userInfoUrl": "https://api.github/user",
          "baseUrl": "https://api.github",
          "scope": ["custom_scope_github"]
        },
        "okta": {
          "order": 30,
          "type": "okta",
          "label": "Login with Okta",
          "clientId": "the-idp-client-id",
          "clientSecret": "the-idp-client-secret",
          "authUrl": "${baseUrl}/v1/authorize",
          "tokenUrl": "${baseUrl}/v1/token",
          "userInfoUrl": "${baseUrl}/v1/userinfo",
          "baseUrl": "${baseUrl}",
          "scope": ["your_scope"]
        }
      },
      "redirectUrl": "https://test.com/redirect",
      "realm": "realm1",
      "isWebsiteApp": true,
      "defaultGroups": ["users"]
    },
  }
}
```
